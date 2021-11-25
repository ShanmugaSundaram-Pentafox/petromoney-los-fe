import { Button, Typography, makeStyles } from '@material-ui/core'
import React, {useState} from 'react'
import StatementTable from './StatementTable'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
}))

const StatementAnalysis = ({currentUser, id}) => {
  const classes = useStyles()
  const [addStatement, setAddStatement] = useState({open: false})

  return (
    <>
      <div className={classes.wrapper}>
        <Typography variant="h5">Statement Analysis</Typography>
        <Button variant='contained' size='small' color='primary' onClick={() => setAddStatement({open: true, action: 'add'})}>Add Statement</Button>
      </div>
      <StatementTable addStatement={addStatement} callback={setAddStatement} id={id}/>
    </>
  )
}

export default StatementAnalysis;