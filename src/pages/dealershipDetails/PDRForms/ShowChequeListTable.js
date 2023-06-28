import Backdrop from '@material-ui/core/Backdrop';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import ShowChequeDetailsUnderbank from './ShowCheckDetailsUnderBank';
import Button from '../../../components/CommonComponents/Button/Button';
import { getPdcCollectionDetails } from '../../../services/pdc.service';
import { dateCustomSort } from '../../../utils/commonFunctions.util';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500,
    padding: 0,
    margin: 0
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: 16,
    fontSize: 14,
    textAlign: 'left',
    maxWidth: 600
  },
}));


const ShowChequeListTable = ({ dealershipId, title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState([])

  useEffect(() => {
    getPdcCollectionDetails(dealershipId)
      .then((res) => setData(res))
      .catch((err) => console.log('err >>>', err))
  }, [dealershipId])
  console.log('data >>', data)
  const columns = useMemo(() => {
    return [
      {
        label: 'Account Number',
        name: 'account_number',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Account name',
        name: 'account_name',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Bank Name',
        name: 'bank_name',
        options: {
          filter: false,
          sort: true,
          // customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Branch Name',
        name: 'branch_name',
        options: {
          filter: false,
          sort: true,
          // customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }

      },
      {
        label: 'IFSC code',
        name: 'ifsc_code',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Cheque Details',
        name: 'cheque_details',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, r) => {
            return (
              <Tooltip title="View Cheques added under this bank">
                <IconButton size="small" color="primary" aria-label="application" onClick={() => { setOpenModal(true); setModalData(value) }}>
                  <Button color='primary' variant='outlined' size='small'>View cheques</Button>
                </IconButton>
              </Tooltip>
            )
          }
        }
      }
    ]
  }, [data]);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => true,
    rowsPerPage: 10,
    filter: false,
    print: false,
    download: true,
    sort: false,
    viewColumns: false,
    // onCellClick: (colData, cellMeta) => {
    //   if (cellMeta.colIndex !== 5) {
    //     onRowClick(data[cellMeta.dataIndex].dealership_id, data[cellMeta.dataIndex], 'approved')
    //   }
    // },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <MUIDataTable
        title={<Typography className={classes.title} variant="h4" component="h4">Banks List</Typography>}
        data={data}
        columns={columns}
        options={options}
      />

      <Modal
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <div className={classes.paper}>
          <ShowChequeDetailsUnderbank data={modalData} />
          {/* <AddChequeDetailsForm dealer_id={dealershipId} currentUser={currentUser} /> */}
        </div>
      </Modal>
    </div>
  )
}

export default ShowChequeListTable;