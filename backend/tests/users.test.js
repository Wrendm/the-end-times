const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/User')
require('dotenv').config()

describe('Users API', () => {
    let createdUserIds = []

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI)
    })

    afterAll(async () => {
        if (createdUserIds.length) {
            await User.deleteMany({ _id: { $in: createdUserIds } })
            createdUserIds = []
        }
        await mongoose.connection.close()
    })

    beforeEach(async () => {
        await User.deleteMany({ email: /jest/ })
    })

    it('GET /users should return an array of users', async () => {
        const res = await request(process.env.API_URL)
            .get('/users')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('username')
            expect(res.body[0]).not.toHaveProperty('password')
        }
    })

    it('POST /users should create a new user', async () => {
        const timestamp = Date.now()
        const newUser = {
            username: `jestuser_${timestamp}`,
            name: 'Jest New User',
            email: `jest_${timestamp}@example.com`,
            password: 'password123',
            roles: ['Contributor']
        }

        const res = await request(process.env.API_URL)
            .post('/users')
            .send(newUser)
            .expect(201)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/created/i)

        const createdUser = await User.findOne({ email: newUser.email })
        expect(createdUser).toBeTruthy()
        createdUserIds.push(createdUser._id)
    })

    it('POST /users should reject duplicate email', async () => {
        const timestamp = Date.now()
        const originalUser = {
            username: `jestuserdup_${timestamp}`,
            name: 'Original User',
            email: `jestdup_${timestamp}@example.com`,
            password: 'password123',
            roles: ['Contributor']
        }
        const created = await request(process.env.API_URL)
            .post('/users')
            .send(originalUser)
            .expect(201)

        const userRecord = await User.findOne({ email: originalUser.email })
        createdUserIds.push(userRecord._id)

        const duplicateUser = {
            username: `anotheruser_${timestamp}`,
            name: 'Duplicate User',
            email: originalUser.email,
            password: 'password123',
            roles: ['Contributor']
        }

        const res = await request(process.env.API_URL)
            .post('/users')
            .send(duplicateUser)
            .expect(409)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/duplicate/i)
    })
})