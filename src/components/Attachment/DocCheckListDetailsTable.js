import { green, grey } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react'

const DocCheckListDetailsTable = ({ title, data }) => {

  return (
    <div>
      <div style={{ minHeight: 150, minWidth: 300, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant='subtitle2'>Dealership ID - </Typography>
            <Typography variant='body1'> {title?.dealership_id}</Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant='subtitle2'>Name &nbsp;-  </Typography>
            <Typography variant='body1'> &nbsp; {title?.name}</Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant='subtitle2'>Region - </Typography>
            <Typography variant='body1'>&nbsp;{title?.region}</Typography>
          </div>
        </div>
        <div>
          <TableContainer style={{ maxHeight: 170 }}>
            <Table >
              <TableBody >
                {
                  data?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell style={{ padding: 0 }}>{item[0]}</TableCell>
                        <TableCell>{item[1] !== '' ? <DoneIcon style={{ color: green[400], fontSize: 15 }} /> : <CloseIcon style={{ color: grey[200], fontSize: 15 }} />}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

export default DocCheckListDetailsTable
