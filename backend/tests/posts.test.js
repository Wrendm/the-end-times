const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Post = require('../models/Post')
const User = require('../models/User')
require('dotenv').config()

let testUser
let testPost

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

beforeEach(async () => {
    // Clean test data before each test
    await Post.deleteMany({ postCategory: 'testing' })
    await User.deleteMany({ email: 'jestuser@example.com' })

    testUser = await User.create({
        username: 'jestuser',
        name: 'Jest User',
        email: 'jestuser@example.com',
        password: 'password123',
        roles: ['Contributor']
    })

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
    await User.deleteMany({ email: 'jestuser@example.com' })
    await mongoose.connection.close()
})

describe('Posts API', () => {

    it('GET /posts should return an array of posts', async () => {
        const res = await request(process.env.API_URL)
            .get('/posts')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('title')
            expect(res.body[0]).toHaveProperty('user')
        }
    })

    it('GET /posts/:id should return a single post', async () => {
        const res = await request(process.env.API_URL)
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

        const res = await request(process.env.API_URL)
            .post('/posts')
            .send(newPost)
            .expect(201)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/created/i)

        const createdPost = await Post.findOne({ title: 'Jest Create Post' })
        expect(createdPost).not.toBeNull()
    })
})