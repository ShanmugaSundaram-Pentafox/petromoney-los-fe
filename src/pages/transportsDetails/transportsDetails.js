import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Drawer from "@material-ui/core/Drawer"
import TransportsInfo from "./components/transportsInfo"
import { useMount } from "react-use"
import { NavLink as RouterLink } from "react-router-dom"
import usePageTitle from "../../hooks/usePageTitle"
import { getTransporterInfoFromID } from "../../services/transports.service"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  titleActionContainer: {
    textAlign: "right",
  },
  topSpacing: {
    marginTop: theme.spacing(2),
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2),
  },
  sidePanelWrapper: {
    width: 700,
  },
}))

// function TransportsDetails(props) {
//   console.log(props)
//   return <h1>TransportsDetails Page</h1>
// }

const TransportsDetails = ({ currentUser, match }) => {
  const classes = useStyles()
  const [transportsData, setTransportsData] = useState()
  const {
    url,
    params: { id },
  } = match

  useMount(() => {
    getTransporterInfoFromID(id)
      .then((data) => setTransportsData(...data))
      .catch((e) => null)

    // getDealersByDealershipId(id)
    //   .then((data) => setDealersData(data))
    //   .catch((e) => null)
  })
  usePageTitle(`${id} - ${transportsData && transportsData.name}`)

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          {transportsData && (
            <TransportsInfo data={transportsData} currentUser={currentUser} />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default TransportsDetails
