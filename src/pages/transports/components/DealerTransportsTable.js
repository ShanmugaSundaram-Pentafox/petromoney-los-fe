import { Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles'
import MUIDataTable from 'mui-datatables'
import React, { useMemo, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { useMount } from 'react-use'
import Button from '../../../components/CommonComponents/Button/Button';
import { getDealerTransportsList } from '../../../services/dealers.service'
import { getTransporterInfoFromID, getTransportOwnerInfo, getVehicleInfoFromID } from '../../../services/transports.service'




const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const DealerTransportsTable = ({ currentUser }) => {
  const [transports, setTransports] = useState([]);
  const [transportsData, setTransportsData] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState();
  const [vehicleData, setVehicleData] = useState();
  const [loading, setLoading] = useState(false)
  const classes = useStyles()
  useMount(() => {
    getDealerTransportsList()
      .then((data) => {
        setTransports(data)
        let id = data[0].id;
        setLoading(true);
        getTransporterInfoFromID(id)
          .then(data => {
            setTransportsData(data);
            setLoading(false);
            return data.pm_user_id
          })
          .then(getTransportOwnerInfo)
          .then(data => {
            setOwnerInfo(data)
          })
          .catch((e) => {
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          })
      })
      .catch((e) => {
        console.log(e);
      })
    getVehicleInfoFromID(id)
      .then((data) => {
        // console.log(data)
        setVehicleData(data)
      })
      .catch((e) => null)
  })

  const handleClose = () => {
    setOpenModal(!openModal)
  }

  const columns = useMemo(() => {
    return [
      {
        label: 'Code',
        name: 'id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            setView(true)
            setId(value)
            return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
          },
        },
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: 'Mobile Number',
        name: 'mobile',
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: 'OMC',
        name: 'omc',
        options: {
          filter: false,
          sort: true,
        },
      },
    ]
  }, [])
  const options = {
    filter: false,
    print: false,
    download: false,
    search: false,
    column: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    isRowSelectable: () => false,
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add Transport
        </Button>
      );
    }
  }

  return (
    <>

      <div>
        {
          loading ? (
            <Grid item xs={12}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
          ) :
            Array.isArray(transports) && transports.length ? (
              <MUIDataTable
                title={
                  <Typography className={classes.title} variant="h5" component="h5">Transports List</Typography>
                }
                data={transports}
                columns={columns}
                options={options}
              />
            ) : (
              <Paper style={{ marginTop: 10, padding: 10 }}>No Transporters found</Paper>
            )
        }
      </div>
    </>
  )
}



export default DealerTransportsTable;
