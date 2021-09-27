import React, {useState, useEffect} from 'react'
import axios from 'axios'
import _ from 'lodash'
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './OverallResults.css'

function OverallResults() {
  const [rows, setRows] = useState([])
  const user = localStorage.getItem('MERIT_MONEY_USERNAME') || ''
  const useStyles = makeStyles({
    table: {
      minWidth: 650
    },
  });
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#5101d1',
      color: theme.palette.common.white,

    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: '#e7e7e7',
      },
    },
  }))(TableRow);
  useEffect(() => {
    axios.get(`/overall`).then((res) => {
      const allResults = res.data
      let result = []
      allResults.map(eachResult => {
        eachResult.votes.map(vote => {
          const temp = _.find(result, (res) => {
            return res.username === vote.username
          })
          if (temp) {
            temp.allVotes += vote.votes
            temp.attempts++
          } else {
            result.push({username: vote.username, allVotes: parseInt(vote.votes), attempts: 1})
          }
        })
      })
      result.map(res => {
        res.average = parseInt(res.allVotes / res.attempts)
      })
      setRows(_.sortBy(result, ['average']).reverse())
    }).catch((err) => {
      window.alert(err.response.data)
    })
  }, [])
  const classes = useStyles()
  const sort = (type) => {
    setRows(_.sortBy(rows, [type]).reverse())
  }
  return (
    <div className='overall__result__body'>
      <span>Summary of All Voting </span>
      <TableContainer component={Paper}>
        <Table classname={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell style={{cursor: 'pointer'}} align="center"
                               onClick={() => sort('allVotes')}>Votes</StyledTableCell>
              <StyledTableCell style={{cursor: 'pointer'}} align="center"
                               onClick={() => sort('attempts')}>Attempts</StyledTableCell>
              <StyledTableCell style={{cursor: 'pointer'}} align="center"
                               onClick={() => sort('average')}>Average</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow style={{border: row.username === user ? '5px solid #5101d1': ''}} key={row.username}>
                <StyledTableCell component="th" scope="row">
                  {row.username}
                </StyledTableCell>
                <StyledTableCell align="center">{row.allVotes}</StyledTableCell>
                <StyledTableCell align="center">{row.attempts}</StyledTableCell>
                <StyledTableCell align="center">{row.average}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )


}

export default OverallResults
