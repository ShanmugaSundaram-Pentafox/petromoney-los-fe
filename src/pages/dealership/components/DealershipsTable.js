import { format } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getAllDealership } from '../../../services/dealerships.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';

const DealershipsTable = () => {

  const delaershipDetailsQuery = useQuery({
    queryKey: ['dealership-details'],
    queryFn: () => getAllDealership(),
  })

  const history = useHistory();

  const handleRowClick = (rowData) => {
    const id = rowData?.id;
    if (id) {
      history.push(`/dealership/${id}`);
    }
  };

  const column = [
    {
      key: 'id',
      header: 'ID',
      enableColumnFilter: false,
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
        onRowClick={handleRowClick}
      />
    </div>
  )
}


export default DealershipsTable;