import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { useMount } from "react-use"
import usePageTitle from "../../hooks/usePageTitle"
import {
  getTransporterInfoFromID,
  getTransportOwnerInfo,
  getVehicleInfoFromID,
} from "../../services/transports.service"
import VehicleInfo from "./components/VehicleInfo"
import AddNewVehicleForm from '../transports/components/AddNewVehicleForm'
import { Drawer } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    color: '#9e9e9e'
  },
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  tableRow: {
    cursor: 'pointer'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  transportsInfo: {
    maxWidth: '40vw',
    padding: theme.spacing(2)
  },
  card: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: "wrap",
      [theme.breakpoints.up('md')]: {
        flexWrap: "nowrap",
      }
    }
  },
  btn: {
    marginTop: 14,
  }
}))


const TransportsDetails = ({ currentUser, match }) => {
  const [ownerInfo, setOwnerInfo] = useState()
  const [openModal, setOpenModal] = useState(false);
  const [transportsData, setTransportsData] = useState()
  const [vehicleData, setVehicleData] = useState()
  const [showModal, setShowModal] = useState(false)

  const classes = useStyles()
  const {
    url,
    params: { id },
  } = match
  useMount(() => {
    getTransporterInfoFromID(id)
      .then(data => {
        setTransportsData(data);
        return data.t_owner_id
      })
      .then(getTransportOwnerInfo)
      .then(data => {
        setOwnerInfo(data)
      })
      .catch((e) => null)

    getVehicleInfoFromID(id)
      .then((data) => {
        // console.log(data)
        setVehicleData(data)
      })
      .catch((e) => null)


  })
  let cardData = [
    { label: 'Dealership ID', value: ownerInfo?.dealership_id },
    { label: 'Transport ID', value: transportsData?.id },
    { label: 'Transport name', value: transportsData?.name },
    { label: 'Owner name', value: ownerInfo?.first_name },
    { label: 'Mobile', value: ownerInfo?.mobile },
  ]
  usePageTitle(`${id} - ${transportsData && transportsData?.name}`, true, cardData)

  const handleClose = () => {
    setShowModal(!showModal)
  }


  return (
    <>
      <Grid container spacing={2}>
        {/* {
          currentUser.role_name !== 'DEALER' ? (
            <Grid item container spacing={2}>
              <Grid item md={4} xs={12}>
                <InfoCard
                  hover
                  noMargin
                  title={"Transport Info"}
                  userInitial={transportsData?.name?.charAt(0)}
                  name={transportsData?.name}
                  caption={transportsData?.id}
                  content={transportsData?.mobile}
                  onClick={() => setShowModal(true)}
                />
                {transportsData && (
                  <Drawer
                    anchor="right"
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    variant="temporary"
                  >
                    {/* <TransportsInfo data={transportsData} currentUser={currentUser} /> */}
        {/* <AddNewTransportsForm callback={handleClose} data={transportsData} />
                  </Drawer>
                )}
              </Grid> */}
        {/* <Grid item md={4} xs={12}>
                <InfoCard
                  title={"Owner Info"}
                  noMargin
                  userInitial={ownerInfo?.first_name?.charAt(0)}
                  name={ownerInfo?.first_name ? `${ownerInfo?.first_name} ${ownerInfo?.last_name}` : 'Transporter Name'}
                  caption={ownerInfo?.mobile}
                  content={ownerInfo?.email}
                  description={ownerInfo?.address}
                />
              </Grid> */}
        {/* </Grid>
          ) : null
        } */}
        <Grid item xs={12} md={12}>
          <Button
            color="primary"
            variant="contained"
            className={classes.btn}
            onClick={() => setOpenModal(true)}
          >
            Add Vehicle
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          {vehicleData && (
            <VehicleInfo id={id} data={vehicleData} currentUser={currentUser} />
          )}
        </Grid>
      </Grid>
      {/* <FormDialog
        title="Add Vehicle"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewVehicleForm data={transportsData} />
      </FormDialog> */}
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <AddNewVehicleForm callback={() => setOpenModal(false)} data={transportsData} isEdit='Edit' id={id} />
      </Drawer>
    </>
  )
}

export default TransportsDetails
