import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    height: '100px',
    backgroundColor: '#5101d1',

    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      height: '50px'
    }
  },
  link: {
    padding: '5px 10px',
    margin: '0 5px',
    textDecoration: 'none',
    color: 'white',
    fontSize: '16px',

    '&:hover': {
      color: '#5101d1',
      borderRadius: '5px',
      background: 'white',
    },
  }, activeLink: {
    padding: '5px 10px',
    textDecoration: 'none',
    fontSize: '16px',
    margin: '0 5px',
    color: '#5101d1',
    borderRadius: '5px',
    background: 'white',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 10px'
  }
}));
