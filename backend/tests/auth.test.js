const mongoose = require('mongoose')
const User = require('../models/User')
const app = require('../app')
const request = require('supertest')
require('dotenv').config()

describe('Auth API', () => {
    console.log('API_URL:', process.env.API_URL)
    let createdUserIds = []
    let testUser

    beforeAll(async () => {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in your .env file')
        }

        // Connect to MongoDB (Mongoose 7+ automatically handles parser and topology)
        await mongoose.connect(process.env.MONGO_URI)
    })

    afterAll(async () => {
        // Clean up test users
        if (createdUserIds.length > 0) {
            await User.deleteMany({ _id: { $in: createdUserIds } })
        }
        await mongoose.connection.close()
    })

    beforeEach(async () => {
        // Remove leftover test users
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
        expect(res.body.message).toMatch(/duplicate/i)
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

        expect(loginRes.body).toHaveProperty('token')
        expect(loginRes.body.user).toHaveProperty('username', testUser.username)
        expect(loginRes.body.user).not.toHaveProperty('password')
    })

    it('POST /auth/login should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'nouser', password: 'wrongpassword' })
            .expect(401)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/invalid/i)
    })
})