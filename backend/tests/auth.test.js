const mongoose = require('mongoose')
const User = require('../models/User')
const app = require('../app')
const request = require('supertest')
const jwt = require('jsonwebtoken')
require('dotenv').config()

jest.setTimeout(20000)

let testUser

describe('Auth API', () => {
    console.log('API_URL:', process.env.API_URL_TEST)
    let createdUserIds = []

    beforeAll(async () => {
        if (!process.env.MONGO_URI_TEST) {
            throw new Error('MONGO_URI is not defined in your .env file')
        }

        await mongoose.connect(process.env.MONGO_URI_TEST)
    })

    afterAll(async () => {
        if (createdUserIds.length > 0) {
            await User.deleteMany({ _id: { $in: createdUserIds } })
        }
        await mongoose.connection.close()
    })

    beforeEach(async () => {
        await User.deleteMany({ email: /auth_/ })

        const timestamp = Date.now() + Math.floor(Math.random() * 10000)
        testUser = {
            username: `authuser_${timestamp}`,
            name: 'Auth Test User',
            email: `auth_${timestamp}@example.com`,
            password: 'password123'
        }
    })

    it('POST /auth/register should create a user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/registered/i)

        const created = await User.findOne({ email: testUser.email })
        expect(created).toBeTruthy()
        createdUserIds.push(created._id)
    })

    it('POST /auth/register should reject duplicate username/email', async () => {
        // Create first user
        const createdRes = await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const created = await User.findOne({ email: testUser.email })
        createdUserIds.push(created._id)

        // Try creating duplicate
        const res = await request(app)
            .post('/auth/register')
            .send(testUser) // same email & username
            .expect(409) // controller should return 409 for duplicate

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/already exists/i)
    })

    it('POST /auth/login should authenticate valid user', async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ username: testUser.username, password: testUser.password })
            .expect(200)

        expect(loginRes.body.data).toHaveProperty('token')
        expect(loginRes.body.data.user).toHaveProperty('username', testUser.username)
        expect(loginRes.body.data.user).not.toHaveProperty('password')
    })

    it('POST /auth/login should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'nouser', password: 'wrongpassword' })
            .expect(401)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/invalid/i)
    })

    it('POST /auth/login should set httpOnly refresh token cookie', async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const res = await request(app)
            .post('/auth/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .expect(200)

        // Cookie should be set
        expect(res.headers['set-cookie']).toBeDefined()

        const cookie = res.headers['set-cookie'][0]
        expect(cookie).toMatch(/jwt=/)
        expect(cookie).toMatch(/HttpOnly/i)
    })

    it('GET /auth/refresh should return new access token', async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const agent = request.agent(app)

        await agent
            .post('/auth/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .expect(200)

        const res = await agent
            .get('/auth/refresh')
            .expect(200)

        expect(res.body.data).toHaveProperty('token')
    })

    it('GET /auth/me should fail with missing token', async () => {
        const res = await request(app)
            .get('/auth/me')
            .expect(401)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/unauthorized/i)
    })

    it('GET /auth/me should fail with invalid token', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(403)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/forbidden|invalid/i)
    })

    it('GET /auth/me should fail with expired token', async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const user = await User.findOne({ email: testUser.email })

        const expiredToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                roles: user.roles
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1ms' }
        )

        await new Promise(resolve => setTimeout(resolve, 10))

        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(403)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/forbidden|expired/i)
    })

    it('POST /auth/logout should clear cookie and invalidate session', async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201)

        const agent = request.agent(app)

        await agent
            .post('/auth/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .expect(200)

        const logoutRes = await agent
            .post('/auth/logout')
            .expect(204)

        expect(logoutRes.headers['set-cookie']).toBeDefined()
    })
})