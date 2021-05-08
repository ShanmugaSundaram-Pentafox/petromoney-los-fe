import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import { useMount } from 'react-use';
import Paper from '@material-ui/core/Paper';
import Currency from '../../components/Number/Currency';
import { getReport } from '../../services/users.service';
import usePageTitle from '../../hooks/usePageTitle';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SendReports } from '../../services/common.service';
import Button from '../../components/CommonComponents/Button/Button';
import { getDealerDetails } from '../../services/dealers.service';


const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom:20
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  },
  
}));

const DueTable = ({onRowClick}) => {
  const classes = useStyles();

  const [loans, setLoans] = useState({})
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Yes")

  useMount(async () => {
    var a = await getDealerDetails()
    setLoans(a.due)
  })
  const columns = useMemo(() => {
    return [
      { name: 'prospectcode', label: 'Loan ID' },
      { name: 'applicant_code', label: 'Applicant Code' },
      { name: 'applicant_name', label: 'Applicant Name' },
      { name: 'cust_code', label: 'Dealership ID' },
      { name: 'cust_region', label: 'Customer Region' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'tot_due',
        label: 'Total Due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => true,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(loans[dataIndex].dealership_id, loans[dataIndex])
    },
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  // if (loans.length === 0) {
  //   return (
  //     <div className={classes.root}>
  //       <Grid item xs={12}>
  //         <Skeleton variant="rect" width="100%" height={600} />
  //       </Grid>
  //     </div>
  //   )
  // }
  // else {
    return (
      <>
        <div className={classes.root} >
          {/* {(loans.length === 0) ? (
            <Grid item xs={12}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
          ) : (
              Array.isArray(loans) && loans.length ? (
                <MUIDataTable
                  title={"Due Reports"}
                  data={loans}
                  columns={columns}
                  options={options}
                />
              ) : <Paper style={{ padding: 10 }}>No Due Reports</Paper>
            )} */}
            {
                Array.isArray(loans) && loans.length ? (
                    <MUIDataTable
                        title={"Over Due Reports"}
                        data={loans}
                        columns={columns}
                        options={options}
                    />
                ) : <Paper style={{ marginTop: 10, padding: 10 }}>No Due Reports</Paper>
            }
        </div>
      </>
    )
  }
// }

export default DueTable;