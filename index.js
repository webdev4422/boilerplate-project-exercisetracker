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

// Initiate variables
const users = [] // Create empty array of objects
let _id = 1 // Set user ID

// Create new user with random ID {"_id":"1","username":"user1"}
app.post('/api/users', (req, res) => {
  // Create object literal with props
  const userX = {
    _id: _id.toString(),
    username: req.body.username,
    count: 0,
    log: [],
  }
  users.push(userX) // Push to array
  res.json({ _id: userX._id, username: userX.username }) // Response with json
  _id++
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
  // Find object by ID
  let userX = users.find(({ _id }) => _id === req.params._id)
  // Add params
  userX.log.push({
    // NOT WORK! Ternary operator, if no date is supplied, the current date will be used.
    // let date = req.body.date.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(req.body.date).toDateString() : new Date().toDateString()
    date: new Date().toDateString(),
    duration: Number(req.body.duration),
    description: req.body.description.toString(),
  })
  userX.count++
  // TODO: The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
  res.json({
    _id: userX._id,
    username: userX.username,
    date: userX.log[userX.count - 1].date,
    duration: userX.log[userX.count - 1].duration,
    description: userX.log[userX.count - 1].description,
  })
  // res.json(userX)
})

// Handle unmached routes
app.use((req, res) => {
  res.status(404)
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Error</title>
    </head>
    <body>
    <pre>[object Object]</pre>
    </body>
    </html>
    `
  )
})

// Return the user object with a log array of all the exercises added {"_id":"1","username":"user1","count":2,"log":[{"description":"test","duration":20,"date":"Wed Mar 22 2023"},{"description":"test","duration":20,"date":"Wed Mar 22 2023"}]}
// app.get('/api/users/:_id/logs?', (req, res) => {
//   let userX = users.find(({ _id }) => _id === req.params._id)
//   // let from = req.query.from
//   // let to = req.query.to
//   // let limit = Number(req.query.limit)
//   // if (limit > 0) {
//   // userX.count = limit
//   // userX.log = userX.log[0]
//   // }
//   res.json(userX)
// })

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
