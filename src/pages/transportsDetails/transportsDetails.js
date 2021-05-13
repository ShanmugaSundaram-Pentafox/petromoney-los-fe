import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import TransportsInfo from "./components/transportsInfo"
import { useMount } from "react-use"
import usePageTitle from "../../hooks/usePageTitle"
import {
  getTransporterInfoFromID,
  getTransportOwnerInfo,
  getVehicleInfoFromID,
} from "../../services/transports.service"
import VehicleInfo from "./components/VehicleInfo"
import InfoCard from "../../components/CommonComponents/Cards/InfoCard"
import FormDialog from "../../components/CommonComponents/FormDialog/FormDialog"
import AddNewVehicleForm from '../transports/components/AddNewVehicleForm'

const TransportsDetails = ({ currentUser, match }) => {
  const [ownerInfo, setOwnerInfo] = useState()
  const [openModal, setOpenModal] = useState(false);
  const [transportsData, setTransportsData] = useState()
  const [vehicleData, setVehicleData] = useState()
  const [showModal, setShowModal] = useState(false)
  const {
    url,
    params: { id },
  } = match
  useMount(() => {
    getTransporterInfoFromID(id)
      .then(data => {
        setTransportsData(data);
        return data.pm_user_id
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
  usePageTitle(`${id} - ${transportsData && transportsData?.name}`, true)
  return (
    <>
      <Grid container spacing={2}>
        {
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
                  <FormDialog title="Transport Details" open={showModal} onClose={() => setShowModal(false)}>
                    <TransportsInfo data={transportsData} currentUser={currentUser} />
                  </FormDialog>
                )}
              </Grid>
              <Grid item md={4} xs={12}>
                <InfoCard
                  title={"Owner Info"}
                  noMargin
                  userInitial={ownerInfo?.first_name?.charAt(0)}
                  name={ownerInfo?.first_name ? `${ownerInfo?.first_name} ${ownerInfo?.last_name}` : 'Transporter Name'}
                  caption={ownerInfo?.mobile}
                  content={ownerInfo?.email}
                  description={ownerInfo?.address}
                />
              </Grid>
            </Grid>
          ) : null
        }
        <Grid item xs={12} md={12}>
          <Button
            color="primary"
            variant="contained"
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
      <FormDialog
        title="Add Transport"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewVehicleForm />
      </FormDialog>
    </>
  )
}

export default TransportsDetails
