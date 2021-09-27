import React, {useRef, useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {Paper} from "@material-ui/core";
import {v4 as uuidV4} from 'uuid'
import axios from 'axios'
import './Login.css'
import useStyles from './LoginStyles'

function Login({onLogin, onCreate, firstUsername}) {
  const roomIdRef = useRef()
  const numberOfVotesRef = useRef()
  const {roomId} = useParams()
  const history = useHistory()
  const [usernameList, setUsernameList] = useState([])
  const [username, setUsername] = useState(firstUsername)
  const classes = useStyles()
  useEffect(() => {
    axios.get('/getUsers').then((res) => {
      setUsernameList(res.data)
    }).catch(err => {
      console.log('err', err)
    })
  }, [])

  function createUser() {
    if (!username.length) {
      window.alert('select your name')
      return
    }
    if (!roomIdRef.current.value) {
      window.alert('Enter a room name')
      return
    }
    const room = roomIdRef.current.value
    axios.post('/login', {
      username, room
    }).then(() => {
      onLogin(username, room)
      history && history.push(`/voting/${room}`)
    }).catch((err) => {
      window.alert(err.response.data)
    })

  }

  function handleSelectChange(e) {
    setUsername(e.target.value)
  }

  function createRoom() {
    if (!username.length) {
      window.alert('select your name')
      return
    }
    if (!numberOfVotesRef.current.value) {
      window.alert('insert number of votes')
      return
    }
    const room = uuidV4()
    const numberOfVotes = numberOfVotesRef.current.value
    axios.post('/createRoom', {
      username, room, numberOfVotes
    }).then(() => {
      onCreate(username, room, numberOfVotesRef.current.value)
      history && history.push(`/voting/${room}`)
    }).catch((err) => {
      window.alert(err.response.data)
    })
  }

  return (
    <Paper className={classes.loginPaper} elevation={12}>
      <select onChange={handleSelectChange} value={username ? username : ''} className='login__select'>
        <option value=''> Select Name</option>
        {usernameList.map(username => {
          return <option value={username} key={username}> {username}</option>
        })}
      </select>
      <div className='login__input-wrapper'>
        <input placeholder='Enter room name' ref={roomIdRef} defaultValue={roomId}/>
        <button onClick={createUser}> Login</button>
      </div>
      <span> OR</span>
      <div className='login__input-wrapper'>
        <input placeholder='Enter number of votes' ref={numberOfVotesRef}/>
        <button onClick={createRoom}> Create Room</button>
      </div>
    </Paper>
  )
}

export default Login
