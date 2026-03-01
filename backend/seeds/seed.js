const User = require('../models/User')
const Post = require('../models/Post')

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

require('dotenv').config()

// Sample data
const users = [
    { name: "Lunareth", username: "LunarethSystem", email: "Lunareth@example.com", password: "password", roles: ['Admin', 'Contributor'] },
    { name: "Quantumis", username: "QuantumisChain", email: "Quantumis@example.com", password: "password", roles: ['Admin', 'Contributor'] },
    { name: "Neonara", username: "NeonaraDelta", email: "Neonara@example.com", password: "password", roles: ['Editor', 'Contributor'] },
    { name: "Aurona", username: "AuronaMinor", email: "Aurona@example.com", password: "password", roles: ['Editor', 'Contributor'] },
    { name: "Victor Dutch", username: "VictorDutch", email: "VictorDutch@example.com", password: "password", roles: ['Contributor'] },
    { name: "Deirdre Hawken", username: "DeirdreHawken", email: "DeirdreHawken@example.com", password: "password", roles: ['Contributor'] }
]

const posts = [
    {
        "postType": "text",
        "postCategory": "poem",
        "title": "spikes",
        "published": "true",
        "postdate": "2026-01-02",
        "postContent": "One cannot separate bankers from sweeping examinations. One cannot separate crooks from hissing bombers. The bamboos could be said to resemble masking tramps. Uncocked sprouts show us how spikes can be voices."
    },
    {
        "postType": "text",
        "postCategory": "poem",
        "title": "ornamental",
        "published": "true",
        "postdate": "2026-01-03",
        "postContent": "Before feelings, fowls were only ornaments. In recent years, a minister is a flare's rise. A gummy tiger without crayons is truly a river of manful explanations. If this was somewhat unclear, they were lost without the entranced success that composed their criminal."
    },
    {
        "postType": "text",
        "postCategory": "poem",
        "title": "thunder",
        "published": "true",
        "postdate": "2026-01-04",
        "imgSrc": "",
        "postContent": "Trousers are choppy possibilities. The thunder of a ptarmigan becomes an ermined oyster. Few can name a xiphoid stepmother that isn't a mono greek. Those diplomas are nothing more than stations."
    },
    {
        "postType": "text",
        "postCategory": "essay",
        "title": "On Acting",
        "published": "true",
        "postdate": "2026-01-05",
        "postContent": "I'm a humble student of acting myself and part of that studentship is teaching. I like a pickled cucumber. A regular cucumber I'm not so interested in.\nThe universe is so big, there's so many worlds, there must be one of them or more, something that's alive. Well, of course I would choose to be the top scientist in my field.\nAnybody can die, everything is fleeting, and you've just got to make sure that you catch up on what you can catch up on. I like the challenge. I like a good, meaty experience for me.\nMy friend Ed Begley goes fishing. It's a little smelly to me, I don't like it so much. I like to eat fish, but I don't like to catch them. I think we're dealing with a realm of human experience that doesn't get all that much attention on television.\nYou want to be in a movie where your part works. That's the main thing. No matter how you beat yourself working on the thing, if it doesn't work, it doesn't work. An actor wants to get up every day and they can't think of anything particularly more fun to do than getting into a made-up situation and living it out as if it's real."
    },
    {
        "postType": "text",
        "postCategory": "essay",
        "title": "Selfhood", 
        "published": "true",
        "postdate": "2026-01-07",
        "imgSrc": "Selfhood",
        "postContent": "He was a great man. And he was also me. Oh yeah, oohing and ahhing, that's how it always starts, but later there's the running and screaming.\nYou want to be in a movie where your part works. That's the main thing. No matter how you beat yourself working on the thing, if it doesn't work, it doesn't work. It's best not to stare at the sun during an eclipse.\nIt's best not to stare at the sun during an eclipse. It's a delight to trust somebody so completely.\nI had a brother who died early on, he was 23 when I was 19. And, boy, I certainly didn't expect that. That was utterly shocking. No. I'm simply saying that life, uh, finds a way.\nYou want to be in a movie where your part works. That's the main thing. No matter how you beat yourself working on the thing, if it doesn't work, it doesn't work. God help us we're in the hands of engineers."
    },
    {
        "postType": "image",
        "postCategory": "fashion",
        "title": "Cauliflower",
        "published": "true",
        "postdate": "2026-01-02",
        "imgSrc": "/src/assets/Cauliflower - Deirdre Hawken.jpg"
    },
    {
        "postType": "image",
        "postCategory": "fashion",
        "title": "Coat", 
        "published": "true",
        "postdate": "2026-01-03",
        "imgSrc": "/src/assets/Coat - Maison Margiela.jpg"
    },
    {
        "postType": "image",
        "postCategory": "fashion",
        "title": "Dress", 
        "published": "true",
        "postdate": "2026-01-04",
        "imgSrc": "/src/assets/Dress - Victor Dutch.jpg"
    },
    {
        "postType": "image",
        "postCategory": "painting",
        "title": "The Black Horse", 
        "published": "true",
        "postdate": "2026-01-05",
        "imgSrc": "/src/assets/The Black Horse - John Atherton.jpg"
    },
    {
        "postType": "image",
        "postCategory": "painting",
        "title": "The Woman in the Waves", 
        "published": "true",
        "postdate": "2026-01-06",
        "imgSrc": "/src/assets/The Woman in the Waves - Gustave Courbet.jpg"
    }
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    await User.deleteMany()
    await Post.deleteMany()

    const hashedUsers = await Promise.all(
      users.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    )

    const createdUsers = await User.insertMany(hashedUsers)
    console.log(`${createdUsers.length} users inserted`)

    const postsWithUsers = posts.map((post, index) => ({
      ...post,
      user: createdUsers[index % createdUsers.length]._id
    }))

    const createdPosts = await Post.insertMany(postsWithUsers)
    console.log(`${createdPosts.length} posts inserted`)

    const populatedPosts = await Post.find().populate('user')

    const invalidPosts = populatedPosts.filter(post => !post.user)

    if (invalidPosts.length > 0) {
      console.error('Some posts have invalid user references')
      process.exit(1)
    }

    console.log('Verification successful: All posts have valid populated users')

    process.exit(0)

  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seedDatabase()