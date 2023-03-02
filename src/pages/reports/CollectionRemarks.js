import { Drawer, Grid, TextField, IconButton, Tooltip, Box, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { Skeleton } from '@material-ui/lab';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query';
import Select from 'react-select'
import { CollectionRemarksDrawer } from './CollectionRemarksDrawer';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';


const useStyles = makeStyles((theme) => ({
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
}))



const CollectionRemarks = () => {
  usePageTitle('Collection Remarks');
  const [rowData, setRowData] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [searchValue, setSearchValue] = useState({
    value: '',
    type: 'name'
  });
  const [searchData, setSearchData] = useState();
  const [error, setError] = useState()
  const classes = useStyles();
  const filterOption = [{ value: 'name', label: 'Dealership Name' },{ value: 'id', label: 'Dealership ID' }];
  const { data: testData = [], isFetching } = useQuery(['remark-Data', searchData], () => getCollectionRemarkData(searchData), { refetchOnWindowFocus: false,enabled: searchData ? true : false })

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
  const onChangeSearch = () => {
    if (searchValue?.value) {
      setSearchData({ ...searchValue })
    } else {
      setError('Enter dealership ID/Name to search')
    }

  }
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    filter: false,
    download: false,
    search: false,
    viewColumns: false,
    print:false,
    rowsPerPageOptions: [15, 20, 30],
    onRowClick: (value) => {
      setRowData(value)
      setOpenModal(true)
    },
  };
  return (
    <div>
      <Box p={3} borderRadius={4} bgcolor="background.paper" style={{ padding: 10, marginBottom: 20 }}>
        <Typography variant='h6'>Search by</Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxWidth: '50vw' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={filterOption[0]}
                onChange={(e) => setSearchValue({ ...searchValue, type: e?.value })}
                options={filterOption}
              />
            </div>
            {
              searchValue?.type && (
                <TextField
                  label={(searchValue?.type == 'id') ? 'Enter dealership ID' : 'Enter dealership name'}
                  type={(searchValue?.type == 'id') ? 'number' : 'string'}
                  value={searchValue?.value}
                  error={error}
                  helperText={error}
                  onChange={(e) => setSearchValue({ ...searchValue, value: e?.target?.value })}
                  style={{ width: '60%' }}
                  className={classes.number}
                />
              )
            }
          </div>
          <div style={{ marginTop: 10 }}>
            <Tooltip title='Search'>
              <IconButton onClick={onChangeSearch} size='small'>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => {setSearchValue({type:'name',value:''}); setSearchData();setError('') }} style={{ marginLeft: 10 }} size='small'>
              <CloseIcon />
            </IconButton>
          </div>
        </div >

      </Box>
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
