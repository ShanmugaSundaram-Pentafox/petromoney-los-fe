import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { useMount } from 'react-use'
import VehicleInfo from './components/VehicleInfo'
import usePageTitle from '../../hooks/usePageTitle'
import {
  getTransporterInfoFromID,
  getTransportOwnerInfo,
  getVehicleInfoFromID,
} from '../../services/transports.service'

const useStyles = makeStyles((theme) => ({

  btn: {
    marginTop: 14,
  }
}))


const TransportsDetails = ({ currentUser, match }) => {
  const [ownerInfo, setOwnerInfo] = useState()
  const [transportsData, setTransportsData] = useState()
  
  const classes = useStyles()
  const {
    url,
    params: { id },
  } = match
  const { data: vehicleData = [] } = useQuery(['vehicleData', id], () => getVehicleInfoFromID(id), {refetchOnWindowFocus: false})
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

  })
  let cardData = [
    { label: 'Dealership ID', value: ownerInfo?.dealership_id },
    { label: 'Transport ID', value: transportsData?.transporter_id },
    { label: 'Transport name', value: transportsData?.name },
    { label: 'Owner name', value: ownerInfo?.first_name },
    { label: 'Mobile', value: ownerInfo?.mobile },
  ]
  usePageTitle(`${id} - ${transportsData && transportsData?.name}`, true, cardData)


  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={5} xs={12}>
          {vehicleData && (
            <VehicleInfo id={id} data={vehicleData} currentUser={currentUser} />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default TransportsDetails
