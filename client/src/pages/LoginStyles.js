import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  loginPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '75%',
    alignItems: 'center',
    backgroundColor:'#e7e7e7',
    height: '500px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '50%',
      padding: '20px'

    }
  }
}));
