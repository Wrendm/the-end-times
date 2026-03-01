const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/User')
require('dotenv').config()

let createdUserId

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    await User.deleteOne({ username: 'jestnewuser' })
})

afterAll(async () => {
    // Cleanup any user we created
    if (createdUserId) await User.deleteOne({ _id: createdUserId })
    await mongoose.connection.close()
})

describe('Users API', () => {
    it('GET /users should return an array of users', async () => {
        const res = await request(app)
            .get('/users')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toHaveProperty('username')
        expect(res.body[0]).not.toHaveProperty('password')
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

        expect(res.body.message).toMatch(/New user jestnewuser created/)

        const createdUser = await User.findOne({ username: 'jestnewuser' })
        expect(createdUser).toBeTruthy()
        createdUserId = createdUser._id
    })
})