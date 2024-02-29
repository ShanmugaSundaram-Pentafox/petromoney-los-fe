import { Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import { format } from 'date-fns';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import { createStructuredSelector } from 'reselect';
import { getAllDealership } from '../../../services/dealerships.service';
import { setAllDealerships } from '../../../store/dealership/dealership.actions';
import { selectAllDealerships } from '../../../store/dealership/dealership.selector';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
// import { decrypt } from '../../../services/crypto.service';


const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontWeight: 500
  }
}));
/*
{
  "address": "HPCL DEALERS ANAVATHIL COCHIN 682002",
  "address_2": "Address",
  "auto": "No",
  "business_property": "",
  "business_type": "",
  "created_date": "Thu, 28 Nov 2019 11:54:34 GMT",
  "deal_status": "",
  "district": "KL-ERNAKULAM",
  "doi": "",
  "gst": "",
  "gst_file_url": "",
  "id": 11727030,
  "is_microatm": "",
  "latitude": 0.0,
  "location": "COCHIN                   ",
  "longtitude": 0.0,
  "modified_date": "Thu, 06 Feb 2020 02:36:25 GMT",
  "name": "MS/HSD PETROLEUM AGENCIES",
  "nhsh": "NA",
  "pan": "",
  "pan_file_url": "",
  "pincode": "682002",
  "region": "COCHIN Retail RO",
  "sales_area": "Ernakulam Retail S.A.",
  "state": "Kerala",
  "urh": "Urban",
  "visit_status": 0,
  "zone": "South"
}
*/
const DealershipsTable = ({ dealerships, setAllDealerships }) => {
  // const [ data, setData ] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('id', {
      header: 'ID',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('sales_area', {
      header: 'Sales Area',
    }),
    columnHelper.accessor('loan_application_submitted_date', {
      header: 'Submitted Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? format(new Date(value?.getValue()), 'dd-MMM-yyyy') : '-'}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
    }),
    columnHelper.accessor('pincode', {
      header: 'Pincode',
    }),
    columnHelper.accessor('gst', {
      header: 'GST',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('pan', {
      header: 'PAN',
      enableColumnFilter: false,
    }),
  ]

  useMount(() => {
    if (!dealerships.length) {
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
    }
  })

  return (
    <div>
      <DataTableViewer
        rowData={dealerships}
        column={column}
        title={`Dealership List`}
        loading={loading}
      />
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  dealerships: selectAllDealerships
});

const mapDispatchToProps = dispatch => ({
  setAllDealerships: data => dispatch(setAllDealerships(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DealershipsTable);