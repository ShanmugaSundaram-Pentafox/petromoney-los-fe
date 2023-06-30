import { Backdrop, Checkbox, Modal, Tooltip } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/styles';
import toInteger from 'lodash-es/toInteger'
import React, { useEffect, useState } from 'react'
import AddTransitDetailsForm from './AddTransitDetailsForm';
import Button from '../../../components/CommonComponents/Button/Button';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import Currency from '../../../components/Number/Currency';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: 16,
    fontSize: 14,
    textAlign: 'left',
    minWidth: 450,
    maxWidth: 600
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ShowChequeDetailsUnderbank = ({ data, dealershipId, currentUser }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false)
  const [imageModal, setImageModal] = useState({})
  const [selectedItem, setSelectedItem] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  let allId = data?.map(obj => obj.id)

  const handleChange = (e) => {
    let val = toInteger(e?.target?.value);
    if (selectedItem.includes(val)) {
      setSelectedItem(selectedItem.filter((item) => item !== val));
    } else {
      setSelectedItem([...selectedItem, val]);
    }
  }

  useEffect(() => {
    if (selectedItem?.length !== allId?.length) {
      setSelectAll(false)
    }
  }, [selectedItem])

  const handleSelectAll = (list, mode) => {
    if (mode) {
      setSelectedItem([])
      setSelectAll(false)
    } else {
      setSelectedItem(list)
      setSelectAll(true)
    }
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        {
          selectedItem?.length > 0 && (
            <Button onClick={() => setOpenDialog(true)} variant='outlined' color='primary' size='small'>Add transit details</Button>
          )
        }
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell><Checkbox checked={selectAll} color="primary" value={selectAll} onChange={() => handleSelectAll(allId, selectAll)} /></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Applicant Type</TableCell>
            <TableCell>Account Details</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Cheque number</TableCell>
            {/* <TableCell>File</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody style={{ backgroundColor: '#FFFFFF' }}>
          {data?.map(row => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => null}>
              <TableCell>{<Checkbox checked={selectedItem.includes(row.id)} color="primary" value={row.id} onChange={(e) => handleChange(e)} />}</TableCell>
              <TableCell>{row?.id}</TableCell>
              <TableCell>{row?.applicant_type.toUpperCase()}&nbsp;&nbsp;</TableCell>
              <TableCell>{row.account_name.toUpperCase()} <br /><b>{row.account_number}</b><br /><p style={{ fontSize: 10, color: '#888' }}>{row.bank_name}, {row?.branch_name}</p></TableCell>
              <TableCell align='right'>{row.amount_filled ? <Currency value={row.amount_filled} /> : 'BLANK'}</TableCell>
              <TableCell onClick={() => { setImageModal({ image: row.soft_copy_url, type: row?.soft_copy_url?.endsWith('.pdf'), cheque_number: row?.cheque_number }); setOpenModal(true) }}>
                <Tooltip title={'Click to view cheque'}>
                  <p style={{color:'#259bf4'}}>
                    {row.cheque_number}
                  </p>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <FormDialog className={classes.dialogBox} title={`Cheque ${imageModal?.cheque_number}`} onDownload={imageModal.image} open={openModal} onClose={() => setOpenModal(false)}>
          <FilePreview data={imageModal} />
        </FormDialog>
      </div>
      <Modal
        className={classes.modal}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <div className={classes.paper}>
          <AddTransitDetailsForm callback={() => setOpenDialog(false)} currentUser={currentUser} data={selectedItem} dealershipId={dealershipId} />
        </div>
      </Modal>
    </div>
  )
}

export default ShowChequeDetailsUnderbank;