import React from 'react'
import {NavLink} from 'react-router-dom'
import LogoutComponent from "./LogoutComponent"
import './TopNavigator.css'

export default function TopNavigator({username, setUsername}) {

  return (
    <div className='top__navigator'>
      <nav>
        <ul>
          <li>
            <NavLink to='/Login'> Login</NavLink>
          </li>
          <li>
            <NavLink to='/histories'> History</NavLink>
          </li>
          <li>
            <NavLink to='/overalls'> Overall</NavLink>
          </li>
        </ul>
      </nav>
      <span>Welcome To Merit Money Project</span>
      {username && <LogoutComponent username={username} onLogout={setUsername}/>}
    </div>
  )
}
