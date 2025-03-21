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
const users = []
let userID = 1















// Create new user {"_id":"1","username":"user1"}
app.post('/api/users', (req, res) => {
  // Create object literal with props
  let userX = {
    _id: userID.toString(),
    username: req.body.username,
    count: 0,
    log: [],
  }
  users.push(userX)
  res.json({ _id: userX._id, username: userX.username })
  userID++
})

// Get array of all users [{"_id":"1","username":"user1"}, {"_id":"2","username":"user2"}]
app.get('/api/users', (req, res) => {
  let arrX = []
  for (let i = 0; i < users.length; i++) {
    arrX.push({ _id: users[i]._id, username: users[i].username })
  }
  res.json(arrX)
})

// Add exercise params to user object {"_id":"1","username":"user1","date":"Wed Mar 22 2023","duration":10,"description":"test"}
app.post('/api/users/:_id/exercises', (req, res) => {
  // Find object by request ID ":_id"
  let userX = users.find(({ _id }) => _id === req.params._id)
  // Push exercise changes into user object
  userX.log.push({
    date: new Date().toDateString(),
    duration: Number(req.body.duration),
    description: req.body.description.toString(),
  })
  res.json({
    _id: userX._id,
    username: userX.username,
    date: userX.log[userX.count].date,
    duration: userX.log[userX.count].duration,
    description: userX.log[userX.count].description,
  })
  userX.count++
})

// Return the user object with a log array of all the exercises added {"_id":"1","username":"user1","from":"Sat Oct 10 2020","to":"Mon Apr 24 2023","count":2,"log":[{"description":"test","duration":20,"date":"Wed Mar 22 2023"},{"description":"test","duration":20,"date":"Wed Mar 22 2023"}]}
// app.get('/api/users/:_id/logs', (req, res) => {
app.get('/api/users/:_id/logs', (req, res) => {
  let userX = users.find(({ _id }) => _id === req.params._id)
  let fromX = req.query.from
  let toX = req.query.to
  let limitX = Number(req.query.limit)
  // Check if query parameters exists, must be limitX, because response object differ
  let newLogs = userX.log
  if (limitX) {
    let limitLogs = []
    for (let i = 0; i < limitX; i++) {
      limitLogs.push(userX.log[i])
    }
    newLogs = limitLogs.filter((e) => e) // Filter null, undefined
  }
  console.log(newLogs)
  res.json({
    _id: userX._id,
    username: userX.username,
    from: fromX,
    to: toX,
    count: newLogs.length,
    log: newLogs,
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
