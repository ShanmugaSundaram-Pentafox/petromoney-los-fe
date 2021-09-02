import { FormControlLabel } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import { InputAdornment } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/styles';
import { mergeClasses } from '@material-ui/styles';
import React, { useMemo, useState, useEffect } from 'react';
import { useMount } from 'react-use';
import { Typography } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { getAllTransport } from '../../../services/transports.service';
import { data } from 'browserslist';
import { Button } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import apiCall from '../../../utils/api.util';
import { subDays } from 'date-fns/esm';
import { format } from 'validate.js';
import moment from 'moment';
import FileUpload from '../../../components/FileUpload';
import PublishIcon from '@material-ui/icons/Publish';

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
    width: 170,
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
});

function FastTagPassbook() {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('mobile');
  const [searchValue, setSearchValue] = useState();
  const [selectedPeriodType, setSelectedPeriodType] = useState('D');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
  });

  const columns = useMemo(() => {
    return [
      {
        label: 'Transaction Date',
        name: 'transporter_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value}</>;
          },
        },
      },
      {
        label: 'Toll Name',
        name: 'name',
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
        name: 'mobile',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Amount',
        name: 'omc',
        options: {
          filter: true,
          sort: true,
        },
      },
    ];
  }, []);

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    print: false,
    viewColumns: false,
    download: false,
    filter: false,
    search: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
  };

  // useMount(() => {
  //       getAllTransport()
  //         .then((data) => {
  //           setTestData(data)
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         })
  //   })

  const docUpload = () => {
    setShowUpload(true);
  };

  const handleKeyPress = event => {
      console.log("key");
  }

  useEffect(() => {
    let qry = {};
    qry.from = moment(selectedPeriod.from).format('YYYY-MM-DD');
    qry.to = moment(selectedPeriod.to).format('YYYY-MM-DD');
    if (searchValue) {
      apiCall(
        `fastag/details?${selectedValue}=${searchValue}&from=${qry.from}&to=${qry.to}`
      );
    }
  }, [selectedPeriod]);

  const onDateChange = (type) => (event) => {
    setSelectedPeriodType(type);
    switch (type) {
      case 'D':
        setSelectedPeriod({
          from: moment(new Date()).format('YYYY-MM-DD'),
          to: moment(new Date()).format('YYYY-MM-DD'),
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
  const handleSubmit = () => {
    apiCall(
      `fastag/details?${selectedValue}=${searchValue}&from=${selectedPeriod.from}&to=${selectedPeriod.to}`
    );
  };
  const handleSave = (value) => {
    //   console.log(value);
    const data = new FormData();
    data.append('fastag_statement', value);
    console.log('fastag_statement :', value);
    apiCall(`fastag/upload_statement`, {
      method: 'POST',
      body: data,
    });
  };

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
                  checked={selectedValue === 'mobile'}
                  onChange={handleChange}
                  name='mobile'
                  value='mobile'
                />
              }
              label='Mobile'
            />
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
          </div>
        </div>
        <div className={classes.top}>
          <div className={classes.search}>
            <TextField
              id='search'
              variant='outlined'
              value={searchValue}
              onChange={handleValues}
              onKeyPress={(event) => {
                  if(event.key === 'Enter'){
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
            <Button
              variant='outlined'
              startIcon={<PublishIcon />}
              color='primary'
              onClick={docUpload}
            >
              Upload Statement
            </Button>
          </div>
        </div>
      </Paper>
      <Paper className={classes.root} style={{ marginTop: 20 }}>
        <MUIDataTable columns={columns} options={options} />
        {showUpload && (
          <FileUpload
            handleSave={(value) => {
              handleSave(value);
              showUpload && setShowUpload(false);
            }}
            excel={true}
            title='Upload Documents'
            open={showUpload}
            limit={1}
            onCloseUploader={() => {
              setShowUpload(false);
            }}
          />
        )}
      </Paper>
    </>
  );
}

export default FastTagPassbook;
