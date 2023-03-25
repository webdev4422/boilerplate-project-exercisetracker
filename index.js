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

// Initialize variables
const users = [] // empty array of objs
let userId = 1 // user ID
// Class template for creating objects
class User {
  constructor(_id, username, count, log) {
    this._id = _id
    this.username = username
    this.count = 0
    // this.description = description
    // this.duration = duration
    // this.date = date
    this.log = []
  }
}

// Create new user with random ID {"_id":"1","username":"user1"}
app.post('/api/users', (req, res) => {
  // Create new users with class constructor instances
  let _id = (userId++).toString()
  let username = req.body.username
  let userX = new User(_id, username)
  // Alternative: Create new users with unique ID using object literal syntax
  // const userX = {
  //   _id: (userId++).toString(),
  //   username: req.body.username,
  //   count: 0,
  //   log: [],
  // }
  // // Also: Date.now().toString() // valid alternative; // Math.floor(Math.random() * (100 - 1 + 1)) + 1 // produce dupicates
  users.push(userX)
  res.json({ _id: userX._id, username: userX.username })
})

// Get array of all users [{"_id":"1","username":"user1"}, {"_id":"2","username":"user2"}]
app.get('/api/users', (req, res) => {
  res.json(users)
})

// Add exercise params to user object {"_id":"1","username":"user1","date":"Wed Mar 22 2023","duration":10,"description":"test"}
app.post('/api/users/:_id/exercises', (req, res) => {
  // Find object by request ID ":_id"
  let userX = users.find(({ _id }) => _id === req.params._id)
  // Push exercise changes into user object
  userX.count += 1
  userX.log.push({
    description: req.body.description.toString(),
    duration: Number(req.body.duration),
    date: new Date().toLocaleDateString('en-US'),
  })
  res.json({
    _id: userX._id,
    username: userX.username,
    description: userX.log[0].description,
    duration: userX.log[0].duration,
    date: userX.log[0].date,
  })
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
