import React from 'react'
import {useHistory} from 'react-router-dom'
import {ExitToApp} from '@material-ui/icons';
import './LogoutComponent.css'

export default function LogoutComponent({username, onLogout}) {
  const history = useHistory()

  function logout() {
    onLogout()
    history.push('/login')
  }

  return (
    <div className='logout__component' onClick={logout}>
      <span>{username}</span>
      <ExitToApp/>
    </div>
  )
}
