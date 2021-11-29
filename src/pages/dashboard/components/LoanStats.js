import { Box, Typography, Tooltip, Popover } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { subDays, format } from 'date-fns'
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import Select from 'react-select'
import { useMount } from 'react-use';
import DashCard from '../../../components/CommonComponents/Cards/DashCard';
import { getAllRegions } from '../../../services/common.service';
import { getLoanStats } from '../../../services/loans.service';

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
    // '&::after': {
    //   content: '"|"',
    //   position: 'absolute',
    //   right: -6,
    //   color: 'hsl(0, 0%, 75%)',
    // },
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

const LoanStats = ({ selectedStatsCard, handleClick, filterQry }) => {
  const classes = useStyles();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({ label: 'ALL', value: 0 });
  const [selectedPeriodType, setSelectedPeriodType] = useState('UTD');
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState();
  const [totalLoans, setTotalLoans] = useState();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);

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
    // getStats();
    getAllRegions()
      .then(data => {
        setRegions(data);
      })
      .catch(err => {
        console.log(err)
      });
  })

  useEffect(() => {
    let qry = {
      region: selectedRegion.value,
    }
    if (selectedPeriod?.from) {
      qry.from = format(selectedPeriod?.from || new Date(), 'yyyy-MM-dd');
      qry.to = format(selectedPeriod?.to || new Date(), 'yyyy-MM-dd');
    }
    getStats(qry)
    filterQry(qry)
  }, [selectedRegion, selectedPeriod])

  const getStats = (qry) => {
    getLoanStats(qry)
      .then(data => {
        // const data = _countBy(res, item => {
        //   return item.status?.toLowerCase()
        // });
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
    <Box p={2} pt={1} borderRadius={4} bgcolor="background.paper">
      <Box pb={1} display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h5">Loans' Statistics {totalLoans ? `(${totalLoans})` : null}</Typography>
        <Box display='flex' flexDirection='row'>
          <Box pr={1} display='flex' justifyContent='center' alignItems='center'>
            <div style={{ color: 'hsl(0,0%,75%)' }}>Region</div>
          </Box>
          <Box style={{ width: '200px' }}>
            <Select
              options={regions}
              value={selectedRegion}
              onChange={setSelectedRegion}
              styles={{
                control: (provided) => ({
                  ...provided,
                  // borderWidth: 0,
                  // borderRadius: 0,
                  // borderBottomWidth: 1, 
                  borderColor: 'hsl(0, 0%, 90%)',
                  minHeight: 29,
                  '&:hover': {
                    boxShadow: 'none',
                    minHeight: 29,
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999
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
          <Box pl={2}>
            {/* <small>Period</small> */}
            <div className={classes.filterWrapper}>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'D' && 'active'}`} onClick={onDateChange('D')}>Today</div>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'W' && 'active'}`} onClick={onDateChange('W')}>1W</div>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'M' && 'active'}`} onClick={onDateChange('M')}>MTD</div>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'Y' && 'active'}`} onClick={onDateChange('Y')}>YTD</div>
              <Tooltip title='Up to Date'>
                <div className={`${classes.filterItem} ${selectedPeriodType === 'UTD' && 'active'}`} onClick={onDateChange('UTD')}>UTD</div>
              </Tooltip>
              <Tooltip title='Choose custom dates'>
                <div className={`${classes.filterItem} ${selectedPeriodType === 'Custom' && 'active'}`} onClick={onDateChange('Custom')}>
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
          {/* <Box pl={1}>
              {
                selectedPeriodType === 'Custom' && (
                  <div className={`${classes.filterItem} disabled`} onClick={(event) => setShowPicker(event?.currentTarget)}>
                    <small>
                      {format(dateRange?.startDate, 'dd-MM-yyyy')} to {format(dateRange?.endDate || new Date(), 'dd-MM-yyyy')}
                    </small>
                  </div>
                )
              }
            </Box> */}

        </Box>
      </Box>

      <Box className={classes.card} borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="nowrap">
        {
          chartData.map((item, i) => (
            <DashCard key={i} noBorder={i === chartData.length - 1} value={item.count} text={item.name} amount={item.amount} selected={item.name === selectedStatsCard} action={() => handleClick(item.name)} />
          ))
        }
      </Box>
    </Box>
  )
}

export default LoanStats;
