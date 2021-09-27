const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const _ = require('lodash')
const path = require('path')
const moment = require('moment-jalaali')

const Users = require('./database/Users')
const VoteResults = require('./database/VoteResults')
app.use(cors())
const server = require('http').createServer(app)
mongoose.connect(`mongodb+srv://Admin:Hamed@@123@eventbookingnosqldb.wjhm3.mongodb.net/merit-money?retryWrites=true&w=majority`
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('DB IS CONNECTED')
  })
  .catch(err => {
    console.log('error in connecting database ====>>>', err)
  })


const io = require('socket.io')(server, {cors: {origin: '*'}})
let users = []
let VOTES = []
let rooms = []

app.set('view engine', 'ejs')
const APP_PORT = process.env.PORT || 3000
server.listen(APP_PORT, () => {
  console.log('server is running on port :', APP_PORT)
})
app.use(express.json());
app.use(express.urlencoded());

app.use(express.static("./client/build"));
app.post('/login', (req, res) => {
  const {username, room} = req.body
  if (usernameExists(username, room)) {
    res.status(400).send('user already exists')
  } else
    res.sendStatus(204)
})
app.post('/createRoom', (req, res) => {
  const {username, room, numberOfVotes} = req.body
  if (usernameExists(username, room)) {
    res.status(400).send('user already exists')
  } else {
    rooms.push({name: room, numberOfVotes, started: false, creator: username})
    res.sendStatus(204)
  }
})
app.get('/results', (req, res) => {
  const {roomId} = req.query
  res.send(calcTotalVotes(roomId))
})
app.get('/getUsers', async (req, res) => {
  const users = await Users.find({})
  res.send(users.map(user => {
    return user.name
  }))
})
app.get('/history/:name', async (req, res) => {
  const {name} = req.params
  const history = await VoteResults.find({name})
  if (history && history.length)
    res.send(history[0])
  else res.sendStatus(404)
})
app.get('/history', async (req, res) => {
  const history = await VoteResults.find({})
  res.send(history)
})
app.post('/add/new/user', async (req, res) => {
  const {name, role, team} = req.body
  await Users.findOneAndUpdate({name: name}, {name, role, team}, {upsert: true})
  res.sendStatus(204)
})
app.post('/saveResult', async (req, res) => {
  const {votes, name} = req.body        //votes as array
  const now = moment().format('jYYYYjMMjDD')
  await VoteResults.findOneAndUpdate({name: name.trim()}, {date: now, votes}, {upsert: true})
  res.sendStatus(204)
})
app.get('/overall', async (req, res) => {
  const overall = await VoteResults.find({})
  res.send(overall)
})

if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, `${__dirname}/client/build`);
  // app.use('/static', express.static(`${__dirname}/../client/build`));
  app.use(express.static(publicPath));
  app.use('*', express.static(publicPath));
}
app.get('*', function (req, res) {
  res.sendFile('index.html', {root: `${__dirname}/./client/build`});
})

io.on('connection', (socket) => {
  console.log('connection ', socket.id)
  const {username, room} = socket.handshake.query
  socket.join(room)
  users.push({id: socket.id, username, room})
  socket.emit('get-all-users', {
    usernames: getUsernames(room),
    numberOfVotes: getNumberOfVotes(room),
    creator: getRoomDetails(room).creator,
    started: getRoomDetails(room).started,
  })
  socket.broadcast.to(room).emit('new-user-joined', username)

  socket.on('send-votes', (votes, room, voter) => {
    VOTES = VOTES.filter(vote => {
      return vote.room !== room || vote.voter !== voter
    })
    VOTES.push({...votes, room, voter})
    let numberOfVotesInRoom = 0
    VOTES.map(vote => {
      if (vote.room === room)
        numberOfVotesInRoom++
    })

    socket.broadcast.to(room).emit('has-voted', voter)
    if (numberOfVotesInRoom === getRoomDetails(room).numberOfUsers) {
      socket.emit('receive-votes')
      socket.broadcast.to(room).emit('receive-votes')
    }
  })
  socket.on('start-voting', room => {
    setRoomDetails(room, 'started', true)
    setRoomDetails(room, 'numberOfUsers', getUsernames(room).length)
    socket.emit('voting-started')
    socket.broadcast.to(room).emit('voting-started')
  })

  socket.on('disconnect', () => {
    console.log('disconnect')
    users.map((user, index) => {
      if (user.id === socket.id) {
        users.splice(index, 1)
      }
    })
    socket.broadcast.to(room).emit('user-left', username)
  })


})

function calcTotalVotes(room) {
  let result = {creator: getRoomDetails(room).creator, votes: {}}
  VOTES.map(vote => {
    if (vote.room === room) {
      for (let key in vote) {
        if (key !== 'voter' && key !== 'room') {
          result.votes[key] = parseInt(result.votes[key] || 0) + parseInt(vote[key])
        }
      }
    }
  })
  return result
}

function getUsernames(room) {
  let temp = []
  users.map(user => {
    if (user.room === room)
      temp.push(user.username)
  })
  return temp
}

function usernameExists(username, room) {
  let result = false
  users.map(user => {
    if (user.username === username && user.room === room) {
      result = true
    }
  })
  return result
}

function getNumberOfVotes(roomName) {
  let result = 0
  rooms.map(room => {
    if (room.name === roomName)
      result = room.numberOfVotes
  })
  return result
}

function getRoomDetails(roomName) {
  let result = {}
  rooms.map(room => {
    if (room.name === roomName)
      result = room
  })
  return result
}

function setRoomDetails(roomName, key, value) {
  rooms.map(room => {
    if (room.name === roomName)
      room[key] = value
  })
}
