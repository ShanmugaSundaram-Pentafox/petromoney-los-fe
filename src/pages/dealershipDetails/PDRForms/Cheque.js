import {
  Divider,
  Typography,
  Button,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddBankAndChequeDetailsForm from './AddBankAndChequeDetailsForm';
import AddChequeCountForm from './AddChequeCountForm';
import AddChequeDetailsForm from './AddChequeDetailsForm';
import ShowChequeListTable from './ShowChequeListTable';
import { getPdcCollectionDetails } from '../../../services/pdc.service';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {

    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    backgroundColor: '#FAFAFA',
    flex: 1,
    padding: 4,
    overflow: 'auto'
  },
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8
  },
  collapseCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  actionButtonsWrapper: {
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between'
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
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
}))



const Cheque = ({ dealershipId, dealershipData, callback, currentUser }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false)
  const [tableData, setTableData] = useState([])
  const [collectionDetails, setCollectionDetails] = useState({})

  useEffect(() => {
    getData()
  }, [dealershipId])
  const getData = () => {
    getPdcCollectionDetails(dealershipId)
      .then((res) => {
        if (res?.pdc_banks_and_cheques) {
          let finalData = []
          let d = res?.pdc_banks_and_cheques.forEach((item) => {
            item.cheque_details.forEach((cheque) => {
              finalData.push({
                ...cheque,
                account_name: item.account_name,
                account_number: item.account_number,
                applicant_type: item.applicant_type,
                bank_name: item.bank_name,
                branch_name: item.branch_name,
                created_by: item.created_by,
                id: item.id,
                ifsc_code: item.ifsc_code,
                verified: item.verified,
              });
            });
          });
          setTableData(finalData)
        }
        setCollectionDetails(res?.pdc_collection)
      })
      .catch((err) => console.log('err >>>', err))
  }

  const handleClose = () => {
    callback();
  };

  return (
    <>
      <div className={classes.sidePanelFormWrapper}>
        <Typography className={classes.sidePanelTitle} variant="h4">
          <div>Cheques</div>
          <CloseIcon />
        </Typography>
        <div className={classes.sidePanelFormContentWrapper}>
          <div style={{ marginBottom: 20, padding: 10 }}>
            <div style={{ display: 'flex' }}>
              <Typography variant='h6'>{dealershipData?.name} ({dealershipId})</Typography>
            </div>
            <AddChequeCountForm initData={collectionDetails} dealershipId={dealershipId} dealershipData={dealershipData} />
            <Divider className={classes.divider} />
            <Typography variant='h6' style={{ marginBottom: 12 }}>Cheque Details</Typography>
            <ShowChequeListTable data={tableData} dealershipId={dealershipId} />
            <Divider />

          </div>
        </div>
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={handleClose}
            >
              Back
            </Button>
            <div>
              <Button
                color='primary'
                variant="contained"
                onClick={() => setOpenBankModal(true)}
              >
                Add Bank
              </Button>
              <Button
                color='primary'
                variant="contained"
                style={{ marginLeft: 20 }}
                onClick={() => setOpenModal(true)}
              >
                Add Cheque
              </Button>
            </div>
          </div>
        </div>
      </div>
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
          <AddChequeDetailsForm callback={() => { getData(); setOpenModal(false); }} dealer_id={dealershipId} currentUser={currentUser} />
        </div>
      </Modal>
      <Modal
        className={classes.modal}
        open={openBankModal}
        onClose={() => setOpenBankModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <div className={classes.paper}>
          <AddBankAndChequeDetailsForm callback={() => setOpenBankModal(false)} dealer_id={dealershipId} currentUser={currentUser} />
        </div>
      </Modal>
    </>
  )
}

export default Cheque;