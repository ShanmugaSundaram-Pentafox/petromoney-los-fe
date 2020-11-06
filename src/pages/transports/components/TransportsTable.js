import React, { useEffect } from "react";
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useMount } from 'react-use';
import { getAllTransport } from "../../../services/transports.service"
// import { selectAllDealerships } from '../../../store/dealership/dealership.selector';
// import { createStructuredSelector } from 'reselect';
// import { connect } from 'react-redux';
// import { setAllDealerships } from '../../../store/dealership/dealership.actions';

function TransportTable() {
  useEffect(() => {
    getAllTransport().then((d) => {
      console.log(d)
    })
  }, [])

  return <h1>Transport Table</h1>
}

export default TransportTable


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: 0
  },
  title: {
    fontWeight: 500
  }
}));

// const TransportsTable = ({ transports, setAllTransport s }) => {
//   // const [ data, setData ] = useState([]);
//   const classes = useStyles();
  
//   const columns = useMemo(() => {
//     return [
//       {
//         label: 'ID',
//         name: 'id',
//         options: {
//           filter: false,
//           sort: true,
//           customBodyRender: value => {
//             return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
//           }
//         }
//       },
//       {
//         label: 'Name',
//         name: 'name',
//         options: {
//           filter: false,
//           sort: true
//         }
//       },
//       {
//         label: 'Sales Area',
//         name: 'sales_area',
//         options: {
//           filter: true,
//           sort: true
//         }
//       },
//       {
//         label: 'Region',
//         name: 'region',
//         options: {
//           filter: true,
//           sort: true
//         }
//       },
//       {
//         label: 'Pincode',
//         name: 'pincode',
//         options: {
//           filter: false,
//           sort: true
//         }
//       },
//       {
//         label: 'GST',
//         name: 'gst',
//         options: {
//           filter: false,
//           sort: false
//         }
//       },
//       {
//         label: 'PAN',
//         name: 'pan',
//         options: {
//           filter: false,
//           sort: false
//         }
//       }
//     ]
//   }, []);

//   useMount(() => {
//     if(!transports.length) {
//       getAllTransport()
//         .then(data => {
//           setAllTransports(data);
//           // setData(data)
//         })
//         .catch(e => null)
//     }
//   })

//   const options = {
//     // filterType: 'checkbox',
//     selectableRowsHeader: false,
//     selectableRows: 'none',
//     isRowSelectable: () => false
//   };

//   return (
//     <div className={classes.root}>
//       {
//         Array.isArray(transports) && transports.length ? (
//           <MUIDataTable
//             title={<Typography className={classes.title} variant="h5" component="h5">Transports List</Typography>}
//             data={transports}
//             columns={columns}
//             options={options}
//           />
//         ) : <CircularProgress />
//       }
//     </div>
//   )
// }

// const mapStateToProps = createStructuredSelector({
//   transports: selectAllTransports
// });

// const mapDispatchToProps = dispatch => ({
//   setAllTransports : data => dispatch(setAllTransports(data))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(TransportsTable);