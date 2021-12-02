import { Box, Tooltip, Popover, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { subDays, format } from 'date-fns'
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import Select from 'react-select'
import { useMount } from 'react-use';
import { getAllRegions, getProducts } from '../../../services/common.service';
import { getLoanStats } from '../../../services/loans.service';

export const Selector = ({ options, value, setValue, title, isMulti }) => {
  return(
    <>
      <Box pr={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'hsl(0,0%,75%)' }}>{title}</div>
      </Box>
      <Box style={{ width: '200px' }}>
        <Select
          options={options}
          isMulti = {isMulti}
          value={value}
          onChange={setValue}
          styles={{
            control: (provided) => ({
              ...provided, 
              borderColor: 'hsl(0, 0%, 90%)',
              minHeight: 29,
              marginRight: 10,
              '&:hover': {
                boxShadow: 'none',
                minHeight: 29,
              },
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              '> div': {
                padding: 5
              }
            }),
            indicatorContainer: (provided) => ({
              ...provided,
            })
          }}
        />
      </Box>
    </>
  )
}

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'nowrap',
      }
    }
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
    '&.disabled': {
      backgroundColor: 'hsl(0, 0%, 80%)',
      padding: '4px 8px',
      marginTop: 6,
      borderRadius: 8,
    },
    '&:last-child': {
      marginRight: 0,
      '&::after': {
        display: 'none',
      }
    }
  },
}))

const DashboardFilter = ({ filterQry, setChartData, setTotalLoans }) => {
  const classes = useStyles();
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({ label: 'ALL', value: 0 });
  const [selectedProducts, setSelectedProducts] = useState({ label: 'ALL', value: 0 });
  const [selectedPeriodType, setSelectedPeriodType] = useState('UTD');
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });

  const onDatePickerChange = ({ range }) => {
    setDateRange(range)
  }

  const onDateChange = type => (event) => {
    setSelectedPeriodType(type)
    switch (type) {
    case 'D':
      setSelectedPeriod({
        from: new Date(),
        to: new Date(),
      })
      break;
    case 'W':
      setSelectedPeriod({
        from: subDays(new Date(), 8),
        to: new Date(),
      })
      break;
    case 'M':
      setSelectedPeriod({
        from: new Date(new Date().getFullYear(), new Date().getMonth()),
        to: new Date(),
      })
      break;
    case 'Y':
      setSelectedPeriod({
        from: new Date(new Date().getFullYear(), 0),
        to: new Date(),
      })
      break;
    case 'UTD':
      setSelectedPeriod({})
      break;
    case 'Custom':
      setShowPicker(event.currentTarget)
      break;
    default:
      break;
    }
  }

  useMount(() => {
    getAllRegions()
      .then(data => {
        setRegions(data);
      })
      .catch(() => null);
    
    getProducts()
      .then(data => {
        let prod = []
        data.forEach(item => {
          let buffer = {label: item.product_name, value: item.product_id}
          prod.push(buffer)
        })
        setProducts(prod)
      })
      .catch(() => null)
  })

  useEffect(() => {
    let qry = {
      region: selectedRegion.value,
      products: selectedProducts.value
    }
    if (selectedPeriod?.from) {
      qry.from = format(selectedPeriod?.from || new Date(), 'yyyy-MM-dd');
      qry.to = format(selectedPeriod?.to || new Date(), 'yyyy-MM-dd');
    }
    getStats(qry)
    filterQry(qry)
  }, [selectedRegion, selectedPeriod, filterQry, selectedProducts])

  const getStats = (qry) => {
    getLoanStats(qry)
      .then(data => {
        let cdata = [
          { name: 'Submitted', count: data.submitted_count },
          { name: 'Pending Review', count: data.loan_review_count },
          { name: 'Pending Approval', count: data.loan_approval_count || 0, amount: data.amount_requested },
          { name: 'Approved', count: data.approved_count, amount: data.amount_approved },
          { name: 'Disb. Approval', count: data.disbursement_approval_count || 0, amount: data.amount_disbursement_approval },
          { name: 'Disb. Approved', count: data.disbursement_approved_count || 0, amount: data.amount_disbursement_approved },
          { name: 'Disbursed', count: data.disbursed_count, amount: data.amount_disbursed },
          { name: 'Rejected', count: data.rejected_count },
        ];
        setChartData(cdata);
        let s = 0;
        for (let i = 0; i < cdata.length; i++) {
          s += cdata[i].count;
        }
        setTotalLoans(s)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setShowPicker();
  }

  return (
    <Box p={3} borderRadius={4} bgcolor="background.paper" style={{padding: 10}}>
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Selector title="Zone" options={regions} value={selectedRegion} setValue={setSelectedRegion} isMulti={true} />
          <Selector title="Region" options={regions} value={selectedRegion} setValue={setSelectedRegion} />
          <Selector title="Product" options={products} value={selectedProducts} setValue={setSelectedProducts} isMulti={true} />
        </Box>
        <Box>
          <div className={classes.filterWrapper}>
            <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'D' && 'active'}`} onClick={onDateChange('D')} onKeyDown>Today</div>
            <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'W' && 'active'}`} onClick={onDateChange('W')} onKeyDown>1W</div>
            <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'M' && 'active'}`} onClick={onDateChange('M')} onKeyDown>MTD</div>
            <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'Y' && 'active'}`} onClick={onDateChange('Y')} onKeyDown>YTD</div>
            <Tooltip title='Up to Date'>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'UTD' && 'active'}`} onClick={onDateChange('UTD')} onKeyDown>UTD</div>
            </Tooltip>
            <Tooltip title='Choose custom dates'>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'Custom' && 'active'}`} onClick={onDateChange('Custom')} onKeyDown>
                {
                  selectedPeriodType === 'Custom' ? (
                    `${format(dateRange?.startDate, 'dd-MM-yyyy')} to ${format(dateRange?.endDate || new Date(), 'dd-MM-yyyy')}`
                  ) : 'Custom'
                }
              </div>
            </Tooltip>
          </div>
          <Popover
            id={showPicker ? 'dp' : undefined}
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
              // scroll={{ enabled: true }}
              minDate={subDays(new Date(), 1095)}
            />
            <Box p={1} textAlign='right'>
              <Button variant="contained" color="primary" onClick={onDateRangeClose}>
                Apply
              </Button>
              {/* <button className={`${classes.filterItem} active`} onClick={onDateRangeClose}>Apply</button> */}
            </Box>
          </Popover>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardFilter;
