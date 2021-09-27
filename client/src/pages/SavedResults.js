import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment-jalaali'
import './SavedResults.css'

function SavedResults() {
  const {name} = useParams()
  const [results, setResults] = useState([])
  useEffect(() => {
    axios.get(`/history/${name}`).then((res) => {
      setResults(res.data)
    }).catch((err) => {
      window.alert(err.response.data)
    })
  }, [name])
  return (
    <div className='saved__result__body'>
      <span> Result of {results.name} at {moment(results.date, 'jYYYYjMMjDD').format('jYYYY/jMM/jDD')}</span>
      <ul>
        {results.votes && results.votes.map((el, index) => {
          return <li key={index} id={index === 0 ? `rank0`: ''}> {el.username} = {el.votes}</li>
        })}
      </ul>
    </div>
  )


}

export default SavedResults
