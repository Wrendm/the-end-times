const request = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const Post = require('../models/Post')
const User = require('../models/User')
require('dotenv').config()

let testUser
let authToken
let testPost

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

beforeEach(async () => {
    // Clean test data
    await Post.deleteMany({ postCategory: 'testing' })
    await User.deleteMany({ email: /jestuser/i })

    // Create a unique test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const timestamp = Date.now()
    testUser = await User.create({
        username: `jestuser_${timestamp}`,
        name: 'Jest User',
        email: `jestuser_${timestamp}@example.com`,
        password: hashedPassword,
        roles: ['Contributor']
    })

    // Generate JWT for authenticated routes
    const loginRes = await request(process.env.API_URL)
        .post('/auth/login')
        .send({ username: testUser.username, password: 'password123' })

    authToken = loginRes.body?.accessToken || loginRes.body?.token

    // Create a test post
    testPost = await Post.create({
        user: testUser._id,
        postType: 'blog',
        postCategory: 'testing',
        title: 'Jest Test Post',
        postContent: 'This is a test post.',
        published: true
    })
})

afterAll(async () => {
    await Post.deleteMany({ postCategory: 'testing' })
    await User.deleteMany({ email: /jestuser/i })
    await mongoose.connection.close()
})

describe('Posts API', () => {
    it('GET /posts should return an array of posts', async () => {
        const res = await request(app)
            .get('/posts')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('title')
            expect(res.body[0]).toHaveProperty('user')
        }
    })

    it('GET /posts/:id should return a single post', async () => {
        const res = await request(app)
            .get(`/posts/${testPost._id}`)
            .expect(200)

        expect(res.body.title).toBe('Jest Test Post')
        expect(res.body.user).toBeDefined()
    })

    it('POST /posts should create a new post', async () => {
        const newPost = {
            user: testUser._id.toString(),
            postType: 'blog',
            postCategory: 'testing',
            title: 'Jest Create Post',
            postContent: 'Testing POST endpoint.',
            published: false
        }

        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${authToken}`) // include auth
            .send(newPost)
            .expect(201)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/created/i)

        const createdPost = await Post.findOne({ title: 'Jest Create Post' })
        expect(createdPost).not.toBeNull()
    })
})