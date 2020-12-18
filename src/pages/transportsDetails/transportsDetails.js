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

const TransportsDetails = ({ currentUser, match }) => {
  const [ownerInfo, setOwnerInfo] = useState({})
  const [transportsData, setTransportsData] = useState({})
  const [vehicleData, setVehicleData] = useState()
  const {
    url,
    params: { id },
  } = match

  useMount(() => {
    getTransporterInfoFromID(id)
      .then(data => {
        setTransportsData(data);
        console.log(data);
        return getTransportOwnerInfo(data.pm_user_id)
      })
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
    <Grid container spacing={2}>
      <Grid item container spacing={2}>
        <Grid item md={4} xs={12}>
          <InfoCard
            title={"Owner Info"}
            userInitial={ownerInfo?.first_name?.charAt(0)}
            name={ownerInfo?.first_name ? `${ownerInfo?.first_name} ${ownerInfo?.last_name}` : 'Transporter Name'}
            caption={ownerInfo?.mobile}
            content={ownerInfo?.email}
            description={ownerInfo?.address}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <InfoCard
            title={"Transport Info"}
            userInitial={transportsData?.name?.charAt(0)}
            name={transportsData?.name}
            caption={transportsData?.id}
            content={transportsData?.mobile}
          />
        </Grid>
      </Grid>
      <Grid item md={6} xs={12}>
        {transportsData && (
          <TransportsInfo data={transportsData} currentUser={currentUser} />
        )}
      </Grid>
      <Grid item md={6} xs={12}>
        {vehicleData && (
          <VehicleInfo id={id} data={vehicleData} currentUser={currentUser} />
        )}
      </Grid>
    </Grid>
  )
}

export default TransportsDetails
