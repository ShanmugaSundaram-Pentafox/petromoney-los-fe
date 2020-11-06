import React, { useMemo } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useMount } from "react-use"
import { getAllTransport } from "../../../services/transports.service"
import { selectAllTransports } from "../../../store/transports/transports.selector"
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { setAllTransports } from "../../../store/transports/transports.actions"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: 0,
  },
  title: {
    fontWeight: 500,
  },
}))

const TransportsTable = ({ transports, setAllTransports }) => {
  // const [ data, setData ] = useState([]);
  const classes = useStyles()

  const columns = useMemo(() => {
    return [
      {
        label: "ID",
        name: "id",
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
        },
      },
      {
        label: "Mobile Number",
        name: "mobile",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "OMC",
        name: "omc",
        options: {
          filter: true,
          sort: true,
        },
      },
    ]
  }, [])

  useMount(() => {
    if (!transports.length) {
      getAllTransport()
        .then((data) => {
          setAllTransports(data)
          // setData(data)
        })
        .catch((e) => null)
    }
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    isRowSelectable: () => false,
  }

  return (
    <div className={classes.root}>
      {Array.isArray(transports) && transports.length ? (
        <MUIDataTable
          title={
            <Typography className={classes.title} variant="h5" component="h5">
              Transports List
            </Typography>
          }
          data={transports}
          columns={columns}
          options={options}
        />
      ) : (
        <CircularProgress />
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
