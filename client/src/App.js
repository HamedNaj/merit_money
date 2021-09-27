import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import {Container} from '@material-ui/core'
import Login from './pages/Login'
import Voting from './pages/Voting'
import Results from './pages/Results'
import History from './pages/History'
import SavedResults from './pages/SavedResults'
import OverallResults from './pages/OverallResults'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  // const [username, setUsername] = useLocalStorage('username')
  // const [room, setRoom] = useLocalStorage('room')
  const [username, setUsername] = useState(localStorage.getItem('MERIT_MONEY_USERNAME') || '')
  const [room, setRoom] = useState('')

  function onLogin(loginUser, loginRoom) {
    setUsername(loginUser)
    setRoom(loginRoom)
    localStorage.setItem('MERIT_MONEY_USERNAME', loginUser)
  }

  function onLogout() {
    setUsername('')
    localStorage.removeItem('MERIT_MONEY_USERNAME')
  }

  function onCreate(loginUser, loginRoom) {
    localStorage.setItem('MERIT_MONEY_USERNAME', loginUser)
    setUsername(loginUser)
    setRoom(loginRoom)
  }

  return (
    <Router>
      <Container style={{height:'100vh',display:'flex', justifyContent:'center'}}>
        <NavBar username={username} setUsername={onLogout}/>
        <Switch>
          <Route path='/' exact>
            <Redirect to={`/login`}/>
          </Route>
          <Route path='/login/:roomId'>
            {username ? <Redirect to={`/voting/${room}`}/> :
              <Login onLogin={onLogin} onCreate={onCreate}/>}
          </Route>
          <Route path='/login'>
            <Login onLogin={onLogin} onCreate={onCreate} firstUsername={username}/>
          </Route>
          <Route path='/voting/:roomId'>
            <Voting username={username} room={room}/>
          </Route>
          <Route path='/result/:roomId'>
            <Results username={username}/>
          </Route>
          <Route path='/histories/:name'>
            <SavedResults/>
          </Route>
          <Route path='/histories'>
            <History/>
          </Route>
          <Route path='/overalls'>
            <OverallResults/>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
