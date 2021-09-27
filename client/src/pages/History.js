import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment-jalaali'
import './History.css'

function History() {
  const [list, setList] = useState([])
  const history = useHistory()
  useEffect(() => {
    axios.get('/history').then((res) => {
      setList(res.data.reverse())
    }).catch((err) => {
      window.alert(err.response.data)
    })
  }, [])

  function handleOnClick(el) {
    history.push(`/histories/${el.name}`)
  }

  return (
    <div className='history__body'>
      <span> Past Voting Results</span>
      <ul className='history__list'>
        {list.map((el, index) => {
          return <li className='history__list-items' onClick={() => {
            handleOnClick(el)
          }} key={index}>{el.name} at {moment(el.date, 'jYYYYjMMjDD').format('jYYYY/jMM/jDD')}</li>
        })}
      </ul>
    </div>
  )


}

export default History
