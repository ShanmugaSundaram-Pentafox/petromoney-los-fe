import React, { useMemo, useState } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography"
import { useMount } from "react-use"
import { getAllTransport } from "../../../services/transports.service"
import { selectAllTransports } from "../../../store/transports/transports.selector"
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { setAllTransports } from "../../../store/transports/transports.actions"
import { Grid } from "@material-ui/core"
import { Paper } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import { getOmcList } from "../../../services/common.service"




const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
    marginRight: 12,
  },
  button: {
    display: "flex",
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))
function getSteps() {
  return ['Add Transport Owner Information', 'Add Transport Information'];
}



const TransportsTable = ({ transports, setAllTransports, onRowClick }) => {


  const [loading, setLoading] = useState(false);
  const [omcs, setOmcs] = useState([]);

  const classes = useStyles()

  const columns = useMemo(() => {
    return [
      {
        label: "Code",
        name: "transporter_id",
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
          },
        },
      },
      {
        label: "Name",
        name: "name",
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: "Mobile Number",
        name: "mobile",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "OMC",
        name: "omc",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value.length < 2 ? omcs[value - 1]?.name : value}</>
          },
        },
      },
    ]
  }, [transports])

  useMount(() => {
    if (!transports.length) {
      setLoading(true)
      getAllTransport()
        .then((data) => {
          setAllTransports(data)
          setLoading(false)
          // setData(data)
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        })
    }
    getOmcList()
      .then((data) => {
        setOmcs(data);
      })
      .catch((e) => {
        console.log(e);
      });
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    print: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(transports[dataIndex].dealership_id, transports[dataIndex])
    },

    // customToolbar: () => {
    //   return (
    //     <Button
    //       color="primary"
    //       variant="contained"
    //       onClick={() => setOpenModal(true)}
    //     >
    //       Add Transport
    //     </Button>
    //   );
    // }
  }

  return (
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
                <div className={classes.button}>
                  <Typography className={classes.title} variant="h5" component="h5">
                    Transports List
                  </Typography>
                </div>
              }
              data={transports}
              columns={columns}
              options={options}
            />
          ) : (
            <Paper style={{ marginTop: 10, padding: 10 }}>No Transporters found</Paper>
          )}
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  transports: selectAllTransports,
})

const mapDispatchToProps = (dispatch) => ({
  setAllTransports: (data) => dispatch(setAllTransports(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransportsTable)
