const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app') // your Express app
const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')
require('dotenv').config()

jest.setTimeout(20000) // 20 seconds per test

// --- Helpers ---
function uniqueUsername(base = 'ratelimittest') {
    return `${base}_${Math.floor(Math.random() * 100)}`
}

async function createTestPost(testUserId, categoryId) {
    const testPost = {
        title: 'Rate Limit Post',
        body: 'Testing rate limit',
        user: testUserId,
        postCategory: categoryId
    }
    return Post.create(testPost)
}

async function hitEndpoint(url, method, body = {}, agentInstance = request(app)) {
    return agentInstance[method](url).send(body)
}

// --- Test setup ---
let testCategory
let testUser
let agent

beforeAll(async () => {
    // Connect to test DB
    if (!process.env.MONGO_URI_TEST) {
        throw new Error('MONGO_URI_TEST is not defined in your .env file')
    }

    await mongoose.connect(process.env.MONGO_URI_TEST)

    // Clear collections to prevent duplicate key errors
    await User.deleteMany({})
    await Category.deleteMany({})
    await Post.deleteMany({})

    // Seed categories
    const categories = await Category.insertMany([
        { name: 'Poem', type: 'Text' },
        { name: 'Story', type: 'Text' },
    ]);

    // Save a reference to the category you want to use in posts
    testCategory = categories.find(cat => cat.name === 'Poem');

    // Seed test user
    await User.create({ name: 'Rate Limit', username: 'ratelimittest', email: 'ratelimit@test.com', password: 'password123' });
})

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST)
})

beforeEach(async () => {
    // Create a fresh user for each test
    const username = uniqueUsername()
    testUser = { name: 'Rate Limit', username, email: `${username}@example.com`, password: 'Password123!' }
    await User.deleteMany({ $or: [{ username: testUser.username }, { email: testUser.email }] })

    await User.create(testUser)

    // Use agent for session persistence (login → refresh)
    agent = request.agent(app)
    await agent.post('/auth/login').send({ username: testUser.username, password: testUser.password })
})


afterAll(async () => {
    await mongoose.disconnect()
})

// --- Tests ---
describe('Rate Limiting (Integration)', () => {

    test('should block /auth/register after exceeding limit', async () => {
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/auth/register', 'post', {
                name: 'Rate Limit',
                username: uniqueUsername(),
                email: `${uniqueUsername()}@example.com`,
                password: 'Password123!'
            })
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many account creation attempts/i)
    })

    test('should block /auth/login after exceeding limit', async () => {
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/auth/login', 'post', {
                username: testUser.username,
                password: testUser.password
            })
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many login attempts/i)
    })

    test('should block /auth/refresh after exceeding limit', async () => {
        // hit refresh endpoint multiple times
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/auth/refresh', 'get', {}, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many refresh attempts/i)
    })

    test('should block /auth/logout after exceeding limit', async () => {
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/auth/logout', 'post', {}, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many logout attempts/i)
    })

    test('should block GET /posts after exceeding limit', async () => {
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/posts', 'get', {}, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many requests/i)
    })

    test('should block POST /posts after exceeding limit', async () => {
        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint('/posts', 'post', {
                title: 'Test Post',
                body: 'Testing rate limit',
                postCategory: testCategory._id
            }, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many posts/i)
    })

    test('should block PUT /posts/:id after exceeding limit', async () => {
        const post = await createTestPost((await User.findOne({ username: testUser.username }))._id, testCategory._id)

        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint(`/posts/${post._id}`, 'put', { title: 'Updated' }, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many updates/i)
    })

    test('should block PATCH /posts/:id after exceeding limit', async () => {
        const post = await createTestPost((await User.findOne({ username: testUser.username }))._id, testCategory._id)

        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint(`/posts/${post._id}`, 'patch', { body: 'Updated' }, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many updates/i)
    })

    test('should block DELETE /posts/:id after exceeding limit', async () => {
        const post = await createTestPost((await User.findOne({ username: testUser.username }))._id, testCategory._id)

        let lastResponse
        for (let i = 0; i < 11; i++) {
            lastResponse = await hitEndpoint(`/posts/${post._id}`, 'delete', {}, agent)
        }
        expect(lastResponse.statusCode).toBe(429)
        expect(lastResponse.body.message).toMatch(/too many deletes/i)
    })
})