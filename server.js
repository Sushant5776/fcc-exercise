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
app.get('/api/users/:id/exercises', (req, res) => {
  res.status(200).json({ params: req.params.id })
})

// Create New User
app.get('/api/users/', (req, res) => {
  res.status(200).json({ message: 'Hello you can create user here' })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
