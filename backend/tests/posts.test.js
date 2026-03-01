const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Post = require('../models/Post')
const User = require('../models/User')
require('dotenv').config()

let testUserId

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)

    const testUser = await User.create({
        username: 'jestuser',
        name: 'Jest User',
        email: 'jestuser@example.com',
        password: 'password123',
        roles: ['Contributor']
    })
    testUserId = testUser._id

    await Post.create({
        user: testUserId,
        postType: 'blog',
        postCategory: 'testing',
        title: 'Jest Test Post',
        postContent: 'This is a test post.',
        published: true
    })
})

afterAll(async () => {
    await Post.deleteMany({ postCategory: 'testing' })
    await User.deleteOne({ _id: testUserId })
    await mongoose.connection.close()
})

describe('Posts API', () => {
    it('GET /posts should return an array of posts', async () => {
        const res = await request(app)
            .get('/posts')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toHaveProperty('title')
        expect(res.body[0]).toHaveProperty('user')
    })

    it('GET /posts/:id should return a single post', async () => {
        const post = await Post.findOne({ title: 'Jest Test Post' })
        const res = await request(app)
            .get(`/posts/${post._id}`)
            .expect(200)

        expect(res.body.title).toBe('Jest Test Post')
        expect(res.body.user).toBeDefined()
    })

    it('POST /posts should create a new post', async () => {
        const newPost = {
            user: testUserId.toString(),
            postType: 'blog',
            postCategory: 'testing',
            title: 'Jest Create Post',
            postContent: 'Testing POST endpoint.',
            published: false
        }

        const res = await request(app)
            .post('/posts')
            .send(newPost)
            .expect(201)

        expect(res.body.message).toMatch(/New post Jest Create Post created/)

        await Post.deleteOne({ title: 'Jest Create Post' })
    })
})