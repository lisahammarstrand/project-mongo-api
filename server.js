import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Song = mongoose.model('Song', {
  id: {
    type: Number,
  },
  trackName: {
    type: String,
  },
  artistName: {
    type: String,
  },
  genre: {
    type: String,
  },
  bpm: {
    type: Number,
  },
  energy: {
    type: Number,
  },
  danceability: {
    type: Number,
  },
  loudness: {
    type: Number,
  },
  liveness: {
    type: Number,
  },
  valence: {
    type: Number,
  },
  length: {
    type: Number,
  },
  acousticness: {
    type: Number,
  },
  speechiness: {
    type: Number,
  },
  popularity: {
    type: Number,
  },
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database ...')

  const seedDatabase = async () => {
    // Clear the database
    await Song.deleteMany()
    // Save all songs from topMusic.json to the database
    await topMusicData.forEach((song) => new Song(song).save())
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get all songs
app.get('/songs', async (req, res) => {
  const songs = await Song.find()
  console.log(`Found ${songs.length} songs ...`)
  res.json(songs)
})

// Get one song
app.get('songs/:id', async (req, res) => {
  const { id } = req.params
  const song = await Song.findOne({ id: id })
  if (song) {
    res.json(song)
  } else {
    res.status(404).json({ error: `Could not find song with id ${id}` })
  }
})

/* // Get a genre
app.get('genre/:genre', async (req, res) => {
  const { genre } = req.params
  const genre = await Song.find({ genre: genre })
  if (genre) {
    res.json(genre)
  } else {
    res.status(404).json({ error: `Could not find ${genre}` })
  }
}) */

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
