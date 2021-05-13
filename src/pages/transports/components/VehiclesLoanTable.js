import React, { useMemo, useState } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useMount } from "react-use"
import { getAllVehicleLoans } from "../../../services/transports.service"
import Currency from "../../../components/Number/Currency"
import Button from '../../../components/CommonComponents/Button/Button'
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog"
import AddNewTransportsForm from "./AddNewTransportsForm"
import AddNewVehicleForm from "./AddNewVehicleForm"
// import AddNewVehicleForm from "./AddNewVehicleForm"


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const VehiclesLoanTable = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
        name: "transporter_name",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Vehicle Number",
        name: "tt_no",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Loan Type",
        name: "credit_head",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta) => {
            // console.log(tableMeta)
            return value
          },
        },
      },
      {
        label: "Amount",
        name: "loan_amount",
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          },
        },
      },
    ]
  }, [])

  useMount(() => {
    getAllVehicleLoans()
      .then((data) => {
        setData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })
  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    viewColumns: false,
    print: false,
    isRowSelectable: () => false,
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add Vehicle
        </Button>
      );
    }
  }

  return (
    <div>
      {Array.isArray(data) && data.length ? (
        <MUIDataTable
          title={
            <Typography className={classes.title} variant="h5" component="h5">
              Vehicle Loans List
            </Typography>
          }
          data={data}
          columns={columns}
          options={options}
        />
      ) : (
        <CircularProgress />
      )}
      <FormDialog
        title="Add Vehicle"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewVehicleForm  />
      </FormDialog>
    </div>
  )
}

export default VehiclesLoanTable
