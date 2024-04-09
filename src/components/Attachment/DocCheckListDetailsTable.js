import { green, grey } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import React from 'react'
import { useQuery } from 'react-query';
import { getDealershipCheckList } from '../../services/dealerships.service';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  titlename: {
    width: '200px',
    height: '20px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  tablebody: {
    display: 'flex',
    justifyContent: 'flex-start'
  }
}))

const DocCheckListDetailsTable = ({ title }) => {
  const classes = useStyles();
  const { data: checkListData = [] } = useQuery(['doc-checklist', title?.dealership_id], () => getDealershipCheckList(title?.dealership_id), { refetchOnWindowFocus: false })

  return (
    <div>
      <div style={{ minHeight: 150, width: 380, padding: 10 }}>
        <div style={{ marginBottom: 12 }}>
          <div className={classes.title}>
            <Typography variant='body1' className={classes.titlename}>{title?.name}</Typography>
            <Typography variant='caption' style={{ color: 'rgb(0,0,0,0.4)' }}>&nbsp;{title?.region}</Typography>
          </div>
          <div className={classes.tablebody}>
            <Typography variant='body1'> {title?.dealership_id}</Typography>
          </div>
        </div>
        <div>
          <TableContainer style={{ maxHeight: 170 }}>
            <Table >
              <TableBody >
                {
                  checkListData?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell style={{ paddingLeft: 0 }}>{item.file_data[0]?.file_url !== '' ? <DoneIcon style={{ color: green[400], fontSize: 15 }} /> : <CloseIcon style={{ color: grey[200], fontSize: 15 }} />}</TableCell>
                        <TableCell style={{ padding: 0 }}>{item.description}</TableCell>
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
