import React , {useState,useEffect} from 'react'
import {AppBar, Typography, useMediaQuery} from "@material-ui/core";
import LogoutComponent from "./LogoutComponent"
import {Link,useLocation} from 'react-router-dom'
import useStyles from './NavBarStyles'

const NavBar = ({username, setUsername}) => {
  const classes = useStyles()
  const location = useLocation()
  const [selected,setSelected] = useState('login')
  const isDesktop = useMediaQuery('(min-width:600px)')
  useEffect(()=> {
    if (location.pathname.includes('overall')) setSelected('overalls')
    if (location.pathname.includes('histories')) setSelected('histories')
    if (location.pathname.includes('login')) setSelected('login')
  },[location])
  return (
    <AppBar className={classes.navBar} elevation={6}>
      <Link className={selected === 'login' ? classes.activeLink : classes.link} to={'/login'} onClick={() => setSelected('login')}>
        <Typography variant={'a'}>Login</Typography>
      </Link>
      <Link className={selected === 'histories' ? classes.activeLink : classes.link} to={'/histories'} onClick={() => setSelected('histories')}>
        <Typography variant={'a'}>History</Typography>
      </Link>
      <Link className={selected === 'overalls' ? classes.activeLink : classes.link} to={'/overalls'} onClick={() => setSelected('overalls')}>
        <Typography variant={'a'}>Overall</Typography>
      </Link>
      {isDesktop &&
      <div style={{position: 'absolute', display: 'flex', justifyContent: 'center', width: '100%',zIndex:'-19'}}>
        <Typography variant={'h4'}>
          Welcome To Merit Money Project</Typography></div>}
      {username && <LogoutComponent username={username} onLogout={setUsername}/>}
    </AppBar>
  )
}

export default NavBar
