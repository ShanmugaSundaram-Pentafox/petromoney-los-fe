import { Grid } from '@material-ui/core'
import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import Currency from '../../../components/Number/Currency'
import { getAllVehicleLoans } from '../../../services/transports.service'
import DataTableViewer from '../../../components/ReactTable/DataTableViewer'
import { useQuery } from 'react-query'
// import AddNewVehicleForm from "./AddNewVehicleForm"

const VehiclesLoanTable = () => {

  const getVehicleLoanDetailsQuery = useQuery({
    queryKey: 'vehicle',
    queryFn: () => getAllVehicleLoans()
  });

  const column = [
    {
      key: 'transporter_id',
      header: 'Code',
      cell: (value) => <RouterLink to={`/transports/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'transporter_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'tt_no',
      header: 'Vehicle Number',
    }, {
      key: 'credit_head',
      header: 'Loan Type',
    }, {
      key: 'loan_amount',
      header: 'Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    },
  ]

  return (
    <Grid item md={12}>
      <DataTableViewer
        column={column}
        rowData={getVehicleLoanDetailsQuery?.data}
        filter={false}
        title={'Vehicle Loans List'}
        columnsFilter={false}
        excelDownload
        loading={getVehicleLoanDetailsQuery?.isLoading}
      />
    </Grid>
  )
}

export default VehiclesLoanTable
