import { Paper } from '@material-ui/core';
import React from 'react'
import AccountStatement from '../../dealershipDetails/components/AccountStatement'

const DealersAccountStatement = ({ currentUser }) => {
  return (
    <Paper style={{padding: 15}}>
      <AccountStatement id={currentUser.dealership_id} currentUser={currentUser}/>
    </Paper>
  )
}

export default DealersAccountStatement
