import { FormControlLabel } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import { InputAdornment } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import React, { useMemo, useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { Button } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import apiCall from '../../../utils/api.util';
import { subDays, format } from 'date-fns';
import PublishIcon from '@material-ui/icons/Publish';
import { CircularProgress } from '@material-ui/core';
import Currency from '../../../components/Number/Currency';
import { URL } from '../../../config/serverUrls';
import { useSnackbar } from 'notistack';
import { Popover } from '@material-ui/core';
import { DateRange } from 'react-date-range';
import { Box } from '@material-ui/core';


const useStyles = makeStyles({
  root: {
    borderRadius: 5,
    padding: '5px',
    '& .MuiInputBase-root': {
      paddingLeft: 0,
    },
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    margin: 5,
  },
  find: {
    display: 'flex',
    alignItems: 'center',
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    border: '1px solid hsl(0, 0%, 90%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    minHeight: 32,
    boxSizing: 'border-box',
    padding: '0 4px',
    width: 220,
    marginLeft: 10,
  },
  filterItem: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 2,
    padding: '2px 4px',
    minWidth: 50,
    textAlign: 'center',
    border: 'none',
    backgroundColor: 'hsl(0, 0%, 100%)',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      backgroundColor: 'hsl(0, 0%, 95%)',
    },
    '&.active': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
  },
  inputFile: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },

  label: {
    border: '1px solid #8CADFF',
    padding: '8px 15px',
    borderRadius: 3,
    color: '#2965FF',
    cursor: 'pointer',
    transition: '.300s',
    '&:hover': {
      backgroundColor: '#F4FCFF',
      border: '1px solid #3A71FB',
    },
    display: 'flex',
    alignItems: 'center',
  },

  disabled: {
    border: '1px solid #6A6A6A',
    padding: '8px 15px',
    borderRadius: 3,
    color: '#363636',
    display: 'flex',
    alignItems: 'center',
  }
});

function FastTagPassbook( {currentUser} ) {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('vehicle');
  const [searchValue, setSearchValue] = useState();
  const [selectedPeriodType, setSelectedPeriodType] = useState('D');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [showPicker, setShowPicker] = useState();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(15);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });

  const fetchResult = (pageQry) => {
    if(searchValue){
      setPageLoader(true);
      apiCall(`fastag/details?${selectedValue}=${searchValue}&from=${from}&to=${to}&page=${pageQry}&row_count=${rowsPerPage}`)
        .then(res => {
          setPageLoader(false)
          if(res.status === "SUCCESS"){
            setData(res.data.list)
            setTotal(res.data.count)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

  const columns = useMemo(() => {
    return [
      {
        label: 'Transaction Date',
        name: 'transactionDateTime',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{format(new Date(value), 'dd-MM-yyyy')}</>;
          },
        },
      },
      {
        label: 'Vehicle No',
        name: 'vehicleRegistrationNo',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>;
          },
        },
      },
      {
        label: 'Toll Name',
        name: 'plazaName',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>;
          },
        },
      },
      {
        label: 'Transaction Id',
        name: 'tollTransactionID',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Amount',
        name: 'transactionAmount',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta) => {
            if(tableMeta?.rowData[5] === 'SUCCESS'){
              return <strong><Currency value={value} /></strong> 
            }
            else{
              return (
              <Tooltip title={tableMeta?.rowData[5]}>
                <strong>
                  <Currency value={value} style={{color: 'red'}}/>
                </strong>
              </Tooltip>
              )
            }
        }
        },
      },
      {
        name: 'transactionStatus',
        options: {
          filter: true,
          sort: true,
          display: 'excluded',
        },
      },
    ];
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    print: false,
    viewColumns: false,
    download: false,
    filter: false,
    search: false,
    rowsPerPage: rowsPerPage,
    onChangeRowsPerPage	: (rows) => {
      setRowsPerPage(rows)
    },
    rowsPerPageOptions: [10, 15, 50],
    isRowSelectable: () => false,
    serverSide: true,
    count: total,
    onTableChange: (action, tableState) => {
      switch(action) {
        case "changePage":
          pageChange(tableState.page)
          break;
      }
    }
  };

  useEffect(() => {
    let qry = {};
    if(selectedPeriod?.from){
      qry.from = format(selectedPeriod?.from , 'yyyy-MM-dd');
      qry.to = format(selectedPeriod?.to ,'yyyy-MM-dd');
      setFrom(qry.from);
      setTo(qry.to);
    }
    if (searchValue) {
      setPageLoader(true)
      apiCall(`fastag/details?${selectedValue}=${searchValue}&from=${qry.from}&to=${qry.to}&page=${page}&row_count=${rowsPerPage}`)
        .then(res => {
          setPageLoader(false)
          if(res.status === "SUCCESS"){
            setData(res.data.list)
            setTotal(res.data.count)
          }
        })
    }
  }, [selectedPeriod, rowsPerPage]);

  const onDateChange = (type) => (event) => {
    setSelectedPeriodType(type);
    switch (type) {
      case 'D':
        setSelectedPeriod({
          from: new Date(),
          to: new Date(),
        });
        break;
      case 'W':
        setSelectedPeriod({
          from: subDays(new Date(), 8),
          to: subDays(new Date(), 1),
        });
        break;
      case '2W':
        setSelectedPeriod({
          from: subDays(new Date(), 16),
          to: subDays(new Date(), 1),
        });
        break;
      case 'Custom':
        setShowPicker(event.currentTarget)
          break;
      
      default:
        break;
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleValues = (event) => {
    setSearchValue(event.target.value);
  };
  const pageChange = (page) => {
    fetchResult(page);
  }
  const handleSubmit = () => {
    fetchResult(page);
  };
  
  const onChangeHandler = (event) => {
    setFile(event.target.files[0]);
    setLoading(true);
    setDisable(true);
    const formData = new FormData();
    formData.append('file', event.target.files[0])
    fetch(`${URL.base}fastag/upload/statement`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
    .then(res => {
      return res.json()
    })
      .then(({ status, message}) => {
        setFile('')
        setDisable(false)
        setLoading(false);
        setDisable(false);
        if(status === 'SUCCESS'){
          setLoading(false)
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
            style: { width: 400 },
            autoHideDuration: 10000,
          })
        }
        else {
          setLoading(false)
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
        }
      })
      .catch(e => {
        enqueueSnackbar('Error Uploading File', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
        setFile('')
        setLoading(false)
        setDisable(false)
        console.log(e);
      })
  };

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setShowPicker();
  }

  const onDatePickerChange = ({ range }) => {
    setDateRange(range)
  }

  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.find}>
          <Typography
            variant='h4'
            style={{ marginLeft: '10px', marginTop: '5px' }}
          >
            Find By
          </Typography>
          <RadioGroup row style={{ marginLeft: 15 }}>
            <FormControlLabel
              control={
                <Radio
                  color='primary'
                  checked={selectedValue === 'vehicle'}
                  onChange={handleChange}
                  name='vehicle'
                  value='vehicle'
                />
              }
              label='Vehicle No'
            />
            <FormControlLabel
              control={
                <Radio
                  color='primary'
                  checked={selectedValue === 'id'}
                  onChange={handleChange}
                  name='id'
                  value='id'
                />
              }
              label='Transport Code'
            />
          </RadioGroup>
          <div className={classes.filterWrapper}>
            <div
              className={`${classes.filterItem} ${
                selectedPeriodType === 'D' && 'active'
              }`}
              onClick={onDateChange('D')}
            >
              Today
            </div>
            <div
              className={`${classes.filterItem} ${
                selectedPeriodType === 'W' && 'active'
              }`}
              onClick={onDateChange('W')}
            >
              1W
            </div>
            <div
              className={`${classes.filterItem} ${
                selectedPeriodType === '2W' && 'active'
              }`}
              onClick={onDateChange('2W')}
            >
              2W
            </div>
            <div className={`${classes.filterItem} ${selectedPeriodType === 'Custom' && 'active'}`} onClick={onDateChange('Custom')}>
            {
              'Custom'
            }
            </div>
          </div>
          <Popover
                id={Boolean(showPicker) ? 'dp' : undefined}
                open={Boolean(showPicker)}
                anchorEl={showPicker}
                onClose={onDateRangeClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <DateRange
                  ranges={[dateRange]}
                  onChange={onDatePickerChange}
                  maxDate={new Date()}
                  months={2}
                  direction="horizontal"
                  minDate={subDays(new Date(), 1095)}
                />
                <Box p={1} textAlign='right'>
                  <Button variant="contained" color="primary" onClick={onDateRangeClose}>
                    Apply
                  </Button>
                </Box>
              </Popover>
        </div>
        <div className={classes.top}>
          <div className={classes.search}>
            <TextField
              id='search'
              variant='outlined'
              value={searchValue}
              onChange={handleValues}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                ),
              }}
              margin='normal'
              style={{
                marginLeft: 83,
                width: 220,
              }}
            />
            <Button
              variant='outlined'
              color='secondary'
              type='submit'
              style={{ margin: 10 }}
              onClick={handleSubmit}
            >
              Search
            </Button>
          </div>
          <div className={classes.icon}>
            <input
              type='file'
              name='file'
              id='file'
              className={classes.inputFile}
              onChange={onChangeHandler}
              disabled={disable}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <label for='file' className={!file? classes.label : classes.disabled}>
              {file ? loading? <><CircularProgress size={11} style={{marginRight: 7}}/> {file.name}</> : file.name : <><PublishIcon fontSize='small' style={{paddingRight: 4,}}/> Upload Statement</>}
            </label>
          </div>
        </div>
      </Paper>
      {
        data ? (
      <Paper className={classes.root} style={{ marginTop: 20 }}>
        <MUIDataTable columns={columns} options={options} data={data} 
        title={
          <Typography variant="h6" style={{display: 'flex', alignItems: 'center'}}>
            Fastag Passbook {
              pageLoader && (
                <CircularProgress size={24} style={{ marginLeft: 15, position: "relative"}} />
              )
            }
          </Typography>
        }
        />
      </Paper>
        ) : null
      }
    </>
  );
}

export default FastTagPassbook;
