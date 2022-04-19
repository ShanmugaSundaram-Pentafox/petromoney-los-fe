import { Drawer, Grid, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query';
import { CollectionRemarksDrawer } from './CollectionRemarksDrawer';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';

const useStyles = makeStyles(theme => ({
  badge: {
    fontSize: 10,
    height: 15
  },
  icon: {
    color: 'rgb(0,0,0,0.4)',
    cursor: 'pointer'
  }
}))

const CollectionRemarks = () => {
  usePageTitle('Collection Remarks');
  const classes = useStyles();
  const [rowData, setRowData] = useState()
  const [openModal, setOpenModal]= useState(false)

  const { data: testData = [], isFetching } = useQuery('remark-Data', () => getCollectionRemarkData(), { refetchOnWindowFocus: false })

  const columns = useMemo(() => {
    return [
      {
        name: 'cust_code',
        label: 'Dealership ID',
        options: {
          filter: false,
        }
      },
      { name: 'applicant_name', label: 'Applicant Name' },
      {
        name: 'cust_region',
        label: 'Region',
        options: {
          filter: false,
        }
      },
      {
        name: 'omc',
        label: 'OMC',
        options: {
          filter: false,
        }
      },
      {
        name: 'tot_disb_amt',
        label: 'Total Disbursed Amount',
        options: {
          filter: false,
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
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'tot_overdue',
        label: 'Total Overdue',
        options: {
          filter: false,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'loan_data',
        label: 'Details',
        options: {
          filter: false,
          display: 'excluded',
          download: false
        }
      },
      {
        name: 'tot_prin_due',
        label: 'Total Prin Due',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'tot_prin_overdue',
        label: 'Total Prin Overdue',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'tot_int_overdue',
        label: 'Total Int Overdue',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'tot_penal_overdue',
        label: 'Total Penal Overdue',
        options: {
          filter: false,
          display: false
        }
      }
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
    onRowClick: (value) => {
      setRowData(value)
      setOpenModal(true)
    }
  };

  return (
    <div>
      {
        isFetching ? (
          <Grid item xs={12}>
            <Skeleton variant='rect' width='100%' height={400} />
          </Grid>
        ) : (
          <MUIDataTable
            title="Remarks"
            columns={columns}
            options={options}
            data={testData}
          />
        )
      }
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <CollectionRemarksDrawer callback={() => setOpenModal(false)} rowData={rowData} />
      </Drawer>
    </div>
  )
}

export default CollectionRemarks
