const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/User')
require('dotenv').config()

let testUser

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

beforeEach(async () => {
    // Ensure clean test state
    await User.deleteMany({ email: /jestuser/ })

    testUser = await User.create({
        username: 'jestuser',
        name: 'Jest User',
        email: 'jestuser@example.com',
        password: 'password123',
        roles: ['Contributor']
    })
})

afterAll(async () => {
    await User.deleteMany({ email: /jestuser/ })
    await mongoose.connection.close()
})

describe('Users API', () => {

    it('GET /users should return an array of users', async () => {
        const res = await request(app)
            .get('/users')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('username')
            expect(res.body[0]).not.toHaveProperty('password')
        }
    })

    it('POST /users should create a new user', async () => {
        const newUser = {
            username: 'jestnewuser',
            name: 'Jest New User',
            email: 'jestnewuser@example.com',
            password: 'password123',
            roles: ['Contributor']
        }

        const res = await request(app)
            .post('/users')
            .send(newUser)
            .expect(201)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/created/i)

        const createdUser = await User.findOne({ username: 'jestnewuser' })
        expect(createdUser).not.toBeNull()
    })

    it('POST /users should reject duplicate email', async () => {
        const duplicateUser = {
            username: 'anotheruser',
            name: 'Duplicate User',
            email: 'jestuser@example.com', // already exists
            password: 'password123',
            roles: ['Contributor']
        }

        const res = await request(app)
            .post('/users')
            .send(duplicateUser)
            .expect(400)

        expect(res.body).toHaveProperty('message')
    })

})