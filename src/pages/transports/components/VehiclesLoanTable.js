import { Grid, Paper } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import MUIDataTable from 'mui-datatables'
import React, { useMemo, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { useMount } from 'react-use'
import Currency from '../../../components/Number/Currency'
import { getAllVehicleLoans } from '../../../services/transports.service'
import { createColumnHelper } from '@tanstack/react-table'
import DataTableViewer from '../../../components/ReactTable/DataTableViewer'
// import AddNewVehicleForm from "./AddNewVehicleForm"


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const VehiclesLoanTable = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('transporter_id', {
      header: 'Code',
      cell: (value) => <RouterLink to={`/transports/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('transporter_name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('tt_no', {
      header: 'Vehicle Number',
    }),
    columnHelper.accessor('credit_head', {
      header: 'Loan Type',
    }),
    columnHelper.accessor('loan_amount', {
      header: 'Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    })
  ]

  useMount(() => {
    setLoading(true)
    getAllVehicleLoans()
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e);
      })
  })

  return (
    <Grid item md={12}>
      {Array.isArray(data) && data.length ? (
        <DataTableViewer
          column={column}
          rowData={data}
          title={'Vehicle Loans List'}
          columnsFilter={false}
          excelDownload
        />
      ) : (!loading && <Paper style={{ padding: 10 }}>No Vehicle Loans</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </Grid>
  )
}

export default VehiclesLoanTable
