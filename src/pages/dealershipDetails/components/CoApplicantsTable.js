import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
<<<<<<< HEAD
import Button from '@material-ui/core/Button';

=======
import React from 'react';
>>>>>>> ca63aaac1f5fc2b0c381d2b9b97d37141ca95840

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  header: {
    display: 'flex',
    marginBottom: 8
  },
  footer: {
    paddingTop: 8,
    textAlign: 'right'
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
  actionButtons: {
    // paddingTop: 8
  },
  tableRow: {
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
    marginRight: 3,
    marginBottom: 4,
    padding: 4,
  }
}));

const CoApplicantsTable = ({id, editable, coApplicantsData, titleAlign, getExperianData, onClickAddMenu, formType, openCloseCreditForm, rowData, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
  const classes = useStyles();
    
  if (!coApplicantsData || !coApplicantsData.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No CoApplicants Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('COAPPLICANT')}>Add CoApplicants</Button>
            </div>
          )
        }
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Co-Applicants</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Co Applicant Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coApplicantsData.map(row => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => editable && dealersClickRow(e, row, 'COAPPLICANT')}>
              <TableCell>
                {row.first_name}&nbsp;&nbsp;
                {/* <Chip size="small" label="Experian Report" onClick={(e) => getExperianData(e, row.id)} /> */}
              </TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
              <TableCell align="center">
                {row.aadhar_f_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_f_file_url} target="_blank" title={'Aadhar Front'} rel="noreferrer">{'Aadhar Front'}</a>

                </TableCell>}
                {row.aadhar_b_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_b_file_url} target="_blank" title={'Aadhar Back'} rel="noreferrer">{'Aadhar Back'}</a>

                </TableCell>}
                {row.pan_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.pan_file_url} target="_blank" title={'PAN'} rel="noreferrer">{'PAN'}</a>
                </TableCell>}
                {!row.pan_file_url && !row.aadhar_b_file_url && !row.aadhar_f_file_url &&
                  <TableCell style={{ border: 0 }} align="center">
                    -
                  </TableCell>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CoApplicantsTable;