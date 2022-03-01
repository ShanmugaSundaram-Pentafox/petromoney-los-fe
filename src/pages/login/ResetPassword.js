import { makeStyles } from '@material-ui/core';
import React from 'react'
import { LoginWrapper } from './login.css'

const useStyles = makeStyles(() => ({

}))

const ResetPassword = () => {
  const classes = useStyles();

  return (
    <LoginWrapper>
      <div className='right-content'>
        hi
        hello
      </div>
    </LoginWrapper>
  )
}

export default ResetPassword