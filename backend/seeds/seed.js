// seeds/seed.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('../models/User')
const Category = require('../models/Category')
const Post = require('../models/Post')

// Sample users
const users = [
  { name: "Lunareth", username: "LunarethSystem", email: "Lunareth@example.com", password: "password", roles: ['Admin', 'Contributor'] },
  { name: "Quantumis", username: "QuantumisChain", email: "Quantumis@example.com", password: "password", roles: ['Admin', 'Contributor'] },
  { name: "Neonara", username: "NeonaraDelta", email: "Neonara@example.com", password: "password", roles: ['Editor', 'Contributor'] },
  { name: "Aurona", username: "AuronaMinor", email: "Aurona@example.com", password: "password", roles: ['Editor', 'Contributor'] },
  { name: "Victor Dutch", username: "VictorDutch", email: "VictorDutch@example.com", password: "password", roles: ['Contributor'] },
  { name: "Deirdre Hawken", username: "DeirdreHawken", email: "DeirdreHawken@example.com", password: "password", roles: ['Contributor'] }
]

// Categories following Joi schema
const categories = [
  { name: 'Poem', type: 'Text', published: true },
  { name: 'Essay', type: 'Text', published: true },
  { name: 'Fashion', type: 'Image', published: true },
  { name: 'Painting', type: 'Image', published: true }
]

// Posts with `postCategory` as string placeholders
const posts = [
  { postCategory: "Poem", title: "spikes", published: true, postdate: "2026-01-02", postContent: "One cannot separate bankers..." },
  { postCategory: "Poem", title: "ornamental", published: true, postdate: "2026-01-03", postContent: "Before feelings, fowls were only ornaments..." },
  { postCategory: "Essay", title: "On Acting", published: true, postdate: "2026-01-05", postContent: "I'm a humble student of acting..." },
  { postCategory: "Fashion", title: "Cauliflower", published: true, postdate: "2026-01-02", imgSrc: "/src/assets/Cauliflower - Deirdre Hawken.jpg" },
  { postCategory: "Painting", title: "The Black Horse", published: true, postdate: "2026-01-05", imgSrc: "/src/assets/The Black Horse - John Atherton.jpg" }
]

const seedDatabase = async () => {
  try {
    // Connect to dev DB
    await mongoose.connect(process.env.MONGO_URI_DEV)
    console.log('Connected to MongoDB')

    // Clear collections
    await User.deleteMany()
    await Category.deleteMany()
    await Post.deleteMany()

    // Insert users with hashed passwords
    const hashedUsers = await Promise.all(
      users.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    )
    const createdUsers = await User.insertMany(hashedUsers)
    console.log(`${createdUsers.length} users inserted`)

    // Insert categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`${createdCategories.length} categories inserted`)

    // Replace postCategory string with actual ObjectId
    const postsWithRefs = posts.map((post, index) => ({
      ...post,
      user: createdUsers[index % createdUsers.length]._id,
      postCategory: createdCategories.find(cat => cat.name === post.postCategory)._id
    }))

    const createdPosts = await Post.insertMany(postsWithRefs)
    console.log(`${createdPosts.length} posts inserted`)

    console.log('Database seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seedDatabase()