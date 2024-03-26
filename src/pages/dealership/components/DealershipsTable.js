import { makeStyles } from '@material-ui/styles';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import { getAllDealership } from '../../../services/dealerships.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';


const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontWeight: 500
  }
}));
const DealershipsTable = () => {
  const [dealerships, setAllDealerships] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const column = [
    {
      key: 'id',
      header: 'ID',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
    }, {
      key: 'sales_area',
      header: 'Sales Area',
      isHeaderDisplay: false,
    }, {
      key: 'loan_application_submitted_date',
      header: 'Submitted Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? format(new Date(value?.getValue()), 'dd-MMM-yyyy') : '-'}</span>
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

  useMount(() => {
    setLoading(true)
    getAllDealership()
      .then(data => {
        // console.log(data);
        setAllDealerships(data);
        setLoading(false)
        // setData(data)
      })
      .catch(e => {
        setLoading(false);
      })
  })

  return (
    <div>
      <DataTableViewer
        rowData={dealerships}
        column={column}
        title={'Dealership List'}
        loading={loading}
      />
    </div>
  )
}


export default DealershipsTable;