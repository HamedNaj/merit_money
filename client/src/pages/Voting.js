import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {useParams, useHistory} from 'react-router-dom'
import './Voting.css'

function Voting({username, room}) {
  const [socket, setSocket] = useState()
  const [users, setUsers] = useState([])
  const [voters, setVoters] = useState([])
  const [creator, setCreator] = useState('')
  const [votingStarted, setVotingStarted] = useState(false)
  const [numberOfVotes, setNumberOfVotes] = useState([])
  const [insertedVotes, setInsertedVotes] = useState(0)
  const history = useHistory()
  const {roomId} = useParams()
  useEffect(() => {
    if (!username)
      history.push(`/login/${roomId}`)
  }, [username, roomId, history])

  useEffect(() => {
    if (!username) return
    const s = io('/', {query: {username, room: roomId}})
    setSocket(s)
    return () => {
      s.disconnect(room)
    }
  }, [room, username])

  useEffect(() => {
    if (!socket) return
    socket.on('get-all-users', res => {
      setUsers(res.usernames.filter(user =>
        user !== username
      ))
      setNumberOfVotes(parseInt(res.numberOfVotes))
      setCreator(res.creator)
      setVotingStarted(res.started)
    })
    socket.on('new-user-joined', newUser => {
      if (users.includes(newUser) || votingStarted)
        return
      setUsers(ps => {
        return [...ps, newUser]
      })
    })
    socket.on('has-voted', voter => {
      if (voters.includes(voter))
        return
      setVoters(ps => {
        return [...ps, voter]
      })
    })
    socket.on('user-left', newUser => {
      if (!users.includes(newUser) || votingStarted)
        return
      setUsers(ps => {
        return ps.filter(p => {
          return p !== newUser
        })
      })
    })
    socket.on('voting-started', () => {
        setVotingStarted(true)
      }
    )
    socket.on('receive-votes', () => {
        history.push(`/result/${roomId}`)
      }
    )
    return () => {
      socket.off('new-user-joined')
      socket.off('get-all-users')
      socket.off('user-left')
      socket.off('receive-votes')
      socket.off('voting-started')
    }
  }, [socket, users, roomId, history, votingStarted])

  function calculateVotes(e) {
    if (e.target.value < 0) {
      window.alert('votes should be positives')
      e.target.value = 0
      return
    }
    setInsertedVotes(calcVotes)
  }

  function calcVotes() {
    let sum = 0
    document.querySelectorAll('input').forEach(el => {
      if (el.value < 0) {
        window.alert('votes should be positives')
        return
      }
      sum += parseInt(el.value || 0)
    })
    return sum
  }

  function sendVotes() {
    const sumVotes = calcVotes()
    if (sumVotes !== numberOfVotes) {
      window.alert(`you have votes remaining: ${numberOfVotes - sumVotes}`)
    } else {
      const votes = {}
      document.querySelectorAll('input').forEach(el => {
        votes[el.id] = el.value
      })
      socket.emit('send-votes', votes, roomId, username)
      window.alert('votes submitted')
    }
  }

  function startVoting() {
    socket.emit('start-voting', roomId)
  }
  return (
    <div className='voting__body'>
      <span> total votes : {numberOfVotes}</span>
      <span> remaining votes : {numberOfVotes - insertedVotes}</span>

      <ul className='voting__list'>
        {users.map((user, index) => (
          <div className='voting__list-items' key={user}>
            <li className={voters.includes(user) ? 'voted' : ''}>
              {index + 1} - {user}
            </li>
            <input onChange={calculateVotes} type='number' defaultValue={0} id={user}/>
          </div>
        ))}
      </ul>
      <button style={{marginTop: '10px'}} onClick={sendVotes} disabled={!votingStarted}> Send</button>
      {creator === username && <button style={{marginTop: '10px'}} onClick={startVoting}> Start</button>}
    </div>
  )
}

export default Voting
