const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose')
const User = require('./models/userModel')
const Exercise = require('./models/exerciseModel')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// Connect Database
mongoose.connect(process.env.MONGO_URI, (error) => {
  if (error) return console.log(error)
  console.log('Database Connected')
})

// Create Exercise Record
app.post('/api/users/:id/exercises', async (req, res) => {
  const uid = req.params.id
  const user = await User.findById(uid)

  if (user) {
    const date = new Date(req.body.date).toDateString()
    if (date === 'Invalid Date') {
      const currentDate = new Date(Date.now()).toDateString()
      delete req.body.date
      const exercise = await Exercise.create({ description: req.body.description, duration: req.body.duration, uid, date: currentDate })
      const { date, duration, description } = exercise
      res.status(200).json({ _id: uid, username: user.username, date, duration, description })
    } else {
      const dateFromReq = new Date(req.body.date).toDateString()
      const exercise = await Exercise.create({ description: req.body.description, duration: req.body.duration, uid, date: dateFromReq })
      const { date, duration, description } = exercise
      res.status(200).json({ _id: uid, username: user.username, date, duration, description })
    }
  } else {
    res.status(400).json({ error: `User with id -> ${ req.params.id } does not exists!` })
  }
})

// Create New User
app.post('/api/users/', async (req, res) => {
  const user = await User.create({ username: req.body.username })
  if (!user) {
    res.status(400).json({ error: 'Something went wrong!' })
  } else {
    res.status(200).json(user)
  }
})

app.get('/api/users/:id/logs', async (req, res) => {
  const uid = req.params.id
  const user = await User.findById(uid).select("-__v")
  if (user) {
    const exercises = await Exercise.find({ uid }).select('duration date description -_id')
    const resObj = { ...user._doc, count: exercises.length, logs: exercises }
    res.json(resObj)
  } else {
    res.status(404).json({ error: `User does not exists with id -> ${ uid }` })
  }
})

// Get all users
app.get('/api/users', async (_req, res) => {
  const users = await User.find({})
  res.status(200).json({ users })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
