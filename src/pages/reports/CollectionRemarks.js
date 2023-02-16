import { Drawer, Grid, TextField, IconButton, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { Skeleton } from '@material-ui/lab';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query';
import { CollectionRemarksDrawer } from './CollectionRemarksDrawer';
import Currency from '../../components/Number/Currency';
import TextInput from '../../components/TextInput/TextInput';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';



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


  const { data: testData = [], isFetching } = useQuery(['remark-Data', searchData], () => getCollectionRemarkData(searchData), { refetchOnWindowFocus: false })

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
    rowsPerPageOptions: [15, 20, 30],
    onRowClick: (value) => {
      setRowData(value)
      setOpenModal(true)
    },
    customSearchRender: (searchText, handleSearch, hideSearch) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: 10 }}>
            <TextInput
              select
              value={searchValue?.type}
              onChange={(e) => setSearchValue({ ...searchValue, type: e?.target?.value })}
              placeholder='search by'
              SelectProps={{
                native: true,
              }}
              style={{ backgroundColor: '#ffffff', color: 'green' }}
              InputLabelProps={{ shrink: true }}
            >
              <option value={'name'}>Dealership Name</option>
              <option value={'id'}>Dealership ID</option>
            </TextInput>
          </div>
          {
            searchValue?.type && (
              <TextField
                label='Search'
                type={(searchValue?.type == 'id') ? 'number' : 'string'}
                value={searchValue?.value}
                error={error}
                helperText={error}
                onChange={(e) => setSearchValue({ ...searchValue, value: e?.target?.value })}
                style={{ width: '60%' }}
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
          <IconButton onClick={() => { hideSearch(); setSearchValue({}); searchData() }} style={{ marginLeft: 10 }} size='small'>
            <CloseIcon />
          </IconButton>
        </div>
      </div >

    )
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
