import React, { useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useMount } from 'react-use';
import { getAllDealership } from '../../../services/dealerships.service';
import { selectAllDealerships } from '../../../store/dealership/dealership.selector';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setAllDealerships } from '../../../store/dealership/dealership.actions';
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
  
  const columns = useMemo(() => {
    return [
      {
        label: 'ID',
        name: 'id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        label: 'Sales Area',
        name: 'sales_area',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        label: 'Pincode',
        name: 'pincode',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        label: 'GST',
        name: 'gst',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'PAN',
        name: 'pan',
        options: {
          filter: false,
          sort: false,
        }
      }
    ]
  }, []);

  useMount(() => {
    if(!dealerships.length) {
      getAllDealership()
        .then(data => {
          // console.log(data);
          setAllDealerships(data);
          // setData(data)
        })
        .catch(e => null)
    }
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    isRowSelectable: () => false
  };

  return (
    <div>
      {
        Array.isArray(dealerships) && dealerships.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h5" component="h5">Dealership List</Typography>}
            data={dealerships}
            columns={columns}
            options={options}
          />
        ) : <CircularProgress />
      }
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  dealerships: selectAllDealerships
});

const mapDispatchToProps = dispatch => ({
  setAllDealerships : data => dispatch(setAllDealerships(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DealershipsTable);