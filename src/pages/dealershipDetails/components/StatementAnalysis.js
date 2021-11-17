import { Button, Table, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core'
import StatementTable from '../../../components/Tables/StatementTable'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
}))

const StatementAnalysis = () => {
    const classes = useStyles()
    const [addStatement, setAddStatement] = useState({open: false})

    return (
        <>
            <div className={classes.wrapper}>
                <Typography variant="h5">Statement Analysis</Typography>
                <Button variant='contained' size='small' color='primary' onClick={() => setAddStatement({open: true, action: "add"})}>Add Statement</Button>
            </div>
            <StatementTable addStatement={addStatement} callback={setAddStatement} />
        </>
    )
}

export default StatementAnalysis;