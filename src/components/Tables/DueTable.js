import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getTestReport } from '../../services/users.service';

const DueTable = ({ id, onRowClick }) => {
  const [loans, setLoans] = useState({})
  const [loading, setLoading] = useState(false);
  let cardData = [
    { label: 'Applicant code', value: loans[0]?.applicant_code },
    { label: 'Applicant name', value: loans[0]?.applicant_name },
    { label: 'Dealership ID', value: loans[0]?.cust_code },
    { label: 'Customer Region', value: loans[0]?.cust_region },
  ]
  usePageTitle(`${id} - ${loans[0] && (loans[0].name || '')} `, true, cardData)

  useMount(async () => {
    setLoading(true)
    getTestReport(id)
      .then((data) => {
        setLoans(data.due)
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  })
  const columns = useMemo(() => {
    return [
      { name: 'prospectcode', label: 'Loan ID' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'disb_amt',
        label: 'disburse Amt',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
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
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 20, 25, 30],
  };
  return (
    <>
      <div>
        {
          loading ? (
            <Grid item xs={12}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
          ) : Array.isArray(loans) ? (
            <MUIDataTable
              title={'Due Reports'}
              data={loans}
              columns={columns}
              options={options}
            />
          ) : <Paper style={{ marginTop: 10, padding: 10 }}>No due Reports found</Paper>
        }
      </div>
    </>
  )
}
export default DueTable;