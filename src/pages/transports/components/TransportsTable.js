import React, { useMemo, useState } from "react"
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
import Button from '../../../components/CommonComponents/Button/Button';
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog"
import AddNewTransportsForm from "./AddNewTransportsForm"


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
    marginRight: 12,
  },
  button: {
    display: "flex",
  }
}))

const TransportsTable = ({ transports, setAllTransports }) => {
  const [openModal, setOpenModal] = useState(false);

  const classes = useStyles()

  const columns = useMemo(() => {
    return [
      {
        label: "Code",
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
        .catch((e) => {
          console.log(e);
        })
    }
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    print: false,
    viewColumns: false,
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
    <div>
      {Array.isArray(transports) && transports.length ? (
        <MUIDataTable
          title={
            <div className={classes.button}>
              <Typography className={classes.title} variant="h5" component="h5">
                Transports List
            </Typography>
              {/* <Button
                color="primary"
                variant="contained"
              // onClick={() => setOpenModal(true)}
              >
                Add Transport
        </Button> */}
            </div>
          }
          data={transports}
          columns={columns}
          options={options}
        />
      ) : (
        <CircularProgress />
      )}
      <FormDialog
        title="Add Transport"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewTransportsForm  />
      </FormDialog>
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
