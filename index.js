const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// Create empty array of objects
const users = []
let _id = 0
// Create new user with random ID {"_id":"1","username":"user1"}
app.post('/api/users', (req, res) => {
  username = req.body.username
  // Create object in array with params
  users.push({ _id: _id, username: username, count: 0, log: [] })
  res.json({ _id: _id, username: username })
  _id++
})

// Get array of all users [{"_id":"1","username":"user1"}, {"_id":"2","username":"user2"}]
app.get('/api/users', (req, res) => {
  res.json(users)
})

// Add exercise params to user object {"_id":"1","username":"user1","date":"Wed Mar 22 2023","duration":10,"description":"test"}
app.post('/api/users/:_id/exercises', (req, res) => {
  // Find object by ID
  let userX = users.find(({ _id }) => _id === Number(req.params._id))
  // Add params
  let description = req.body.description.toString()
  let duration = Number(req.body.duration)
  // let date = req.body.date.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(req.body.date).toDateString() : new Date().toDateString()
  let date = new Date().toDateString()
  userX.count++
  userX.log.push({ description: description, duration: duration, date: date })
  res.json({ _id: userX._id, username: username, description: description, duration: duration, date: date })
})

// Return the user object with a log array of all the exercises added {"_id":"1","username":"user1","count":2,"log":[{"description":"test","duration":20,"date":"Wed Mar 22 2023"},{"description":"test","duration":20,"date":"Wed Mar 22 2023"}]}
app.get('/api/users/:_id/logs?', (req, res) => {
  let userX = users.find(({ _id }) => _id === Number(req.params._id))
  // let from = req.query.from
  // let to = req.query.to
  // let limit = Number(req.query.limit)
  // if (limit > 0) {
  // userX.count = limit
  // userX.log = userX.log[0]
  // }
  res.json(userX)
})

// TODO
// Add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
// app.get('/api/users/:_id/logs?limit=1', (req, res) => {
//   let userX = users.find(({ _id }) => _id === Number(req.params._id))
//   // res.json(userX)
//   res.json({ ok: 'ok' })
// })

// :from-:to

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
