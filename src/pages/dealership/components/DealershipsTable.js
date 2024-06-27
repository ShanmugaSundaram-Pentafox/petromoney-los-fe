import { format } from 'date-fns';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { getAllDealership } from '../../../services/dealerships.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';

const DealershipsTable = () => {

  const delaershipDetailsQuery = useQuery({
    queryKey: ['dealership-details'],
    queryFn: () => getAllDealership(),
  })

  const column = [
    {
      key: 'id',
      header: 'ID',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>,
      sorting: true,
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      sorting: true,
      // }, {
      //   key: 'sales_area',
      //   header: 'Sales Area',
      //   isHeaderDisplay: false,
    }, {
      key: 'loan_application_submitted_date',
      header: 'Submitted Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? format(new Date(value?.getValue()), 'dd-MMM-yyyy') : '-'}</span>,
      sorting: true,
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'pincode',
      header: 'Pincode',
    }, {
      key: 'gst',
      header: 'GST',
      enableColumnFilter: false,
    }, {
      key: 'pan',
      header: 'PAN',
      enableColumnFilter: false,
    },
  ]

  return (
    <div>
      <DataTableViewer
        allowSorting={true}
        rowData={delaershipDetailsQuery?.data}
        column={column}
        title={'Dealership List'}
        loading={delaershipDetailsQuery?.isLoading}
        excelDownload={true}
      />
    </div>
  )
}


export default DealershipsTable;