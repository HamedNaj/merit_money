import React, {useState, useEffect, useRef} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import './Results.css'

function Results({username}) {
  const [votes, setVotes] = useState({})
  const [sortedVotes, setSortedVotes] = useState([])
  const [creator, setCreator] = useState('')
  const resultNameRef = useRef()
  const {roomId} = useParams()
  const history = useHistory()
  useEffect(() => {

    axios.get('/results', {
      params: {
        roomId
      }
    }).then((res) => {
      setVotes(res.data.votes)
      setCreator(res.data.creator)
    }).catch(err => {
      console.log('error ', err)
    })
  }, [roomId])
  useEffect(() => {
    let temp = []
    Object.keys(votes).map(key => (
      temp.push({username: key, votes: votes[key]})
    ))
    setSortedVotes(_.sortBy(temp, ['votes']).reverse())
  }, [votes])

  function saveResults() {
    if (!resultNameRef.current.value) {
      window.alert('Enter a name for result')
      return
    }
    axios.post('/saveResult', {votes: sortedVotes, name: resultNameRef.current.value.trim()}).then(() => {
      history && history.push(`/histories`)
    }).catch((err) => {
      window.alert(err.response.data)
    })
  }

  return (
    <div className='result__body'>
      <span> Voting Results</span>
      <ul>
        {sortedVotes.map((vote, index) => {
          return <li key={vote.username} id={`rank${index}`}> {vote.username} = {vote.votes}</li>
        })}
      </ul>
      {username === creator && <button onClick={saveResults}> Save Results</button>}
      {username === creator && <input placeholder='Enter a name for voting' ref={resultNameRef}/>}
    </div>
  )

}

export default Results
