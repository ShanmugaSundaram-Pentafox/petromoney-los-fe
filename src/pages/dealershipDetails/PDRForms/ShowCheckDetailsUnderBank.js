import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react'
import Button from '../../../components/CommonComponents/Button/Button';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ShowChequeDetailsUnderbank = ({ data }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false)
  const [imageModal, setImageModal] = useState({})
  return (
    <div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Applicant Type</TableCell>
            <TableCell>Account Details</TableCell>
            <TableCell>Amount Filled</TableCell>
            <TableCell>Cheque Details</TableCell>
            <TableCell>Cheque type</TableCell>
            <TableCell>File</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ backgroundColor: '#FFFFFF' }}>
          {data?.map(row => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => null}>
              <TableCell>{row?.applicant_type.toUpperCase()}&nbsp;&nbsp;</TableCell>
              <TableCell>{row.account_number} <br />{row.account_name.toUpperCase()}</TableCell>
              <TableCell>{row.amount_filled}</TableCell>
              <TableCell>{row.cheque_number}<br />{row.bank_name}, {row?.branch_name}</TableCell>
              <TableCell>{row.cheque_type.toUpperCase()}</TableCell>
              <TableCell><Button variant='outlined' size='small' color='primary' onClick={() => { setImageModal({ image: row.soft_copy_url, type: row?.soft_copy_url?.endsWith('.pdf') }); setOpenModal(true) }}>View file</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <FormDialog className={classes.dialogBox} title={'Cheque'} onDownload={imageModal.image} open={openModal} onClose={() => setOpenModal(false)}>
          <FilePreview data={imageModal} />
        </FormDialog>
      </div>
    </div>
  )
}

export default ShowChequeDetailsUnderbank;