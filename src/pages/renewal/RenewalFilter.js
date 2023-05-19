import { Box, Tooltip, Popover, Button } from '@material-ui/core';
import { subDays, format } from 'date-fns'
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import { filterStyles, Selector } from '../../components/CommonComponents/FilterCard';
import { getAllRegions, getFilteredProducts, getZones } from '../../services/common.service';
import { getRenewalStatusList, getStatusWiseRecordCount } from '../../services/renewal.service';

const RenewalFilter = ({ filterQry, setChartData, type, setTotalLoans, filterType, filters }) => {
  const classes = filterStyles();
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedProducts, setSelectedProducts] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedZones, setSelectedZones] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedMonth, setSelectedMonth] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedPeriodType, setSelectedPeriodType] = useState(type == 'credit' ? 'W' : 'UTD');
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });
  const month = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ]

  const { data: zones = [] } = useQuery('zones', () => { return getZones(1) }, { refetchOnWindowFocus: false })

  const onDatePickerChange = ({ range }) => {
    setDateRange(range)
  }

  const onDateChange = type => (event) => {
    let today = new Date();
    let year = today.getFullYear(); // to get the current year
    let month = today.getMonth(); // to get the current month if it is with January being 0 and December being 11. 
    setSelectedPeriodType(type)
    switch (type) {
    case 'D':
      setSelectedPeriod({
        from: today,
        to: today,
      })
      break;
    case 'W':
      setSelectedPeriod({
        from: subDays(today, 8),
        to: today,
      })
      break;
    case 'M':
      setSelectedPeriod({
        from: new Date(year, month),
        to: new Date(),
      })
      break;
    case 'Y':
      year = month < 3 ? year - 1 : year // if the user choose YTD from the month between JAN to March the period is set from the previous year APR month.
      setSelectedPeriod({
        from: new Date(year, 3),
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

  useEffect(() => {
    let zoneId = []
    selectedZones.forEach(item => zoneId.push(item.value))
    getAllRegions(zoneId.toString())
      .then(data => {
        setRegions(data);
      })
      .catch(() => null);
  }, [selectedZones])

  useMount(() => {
    if (filters.includes('product')) {
      getFilteredProducts()
        .then(setProducts)
        .catch(() => null)
    }
  })

  useEffect(() => {
    let qry = {}
    if (filters.includes('zone')) {
      let zoneId = []
      selectedZones.forEach(item => zoneId.push(item.value))
      qry.zone = zoneId.toString()
    }
    if (filters.includes('region')) {
      let regionId = []
      selectedRegion.forEach(item => regionId.push(item.value))
      qry.region = regionId.toString()
    }
    if (filters.includes('product')) {
      let productId = []
      selectedProducts.forEach(item => productId.push(item.value))
      qry.products = productId.toString()
    }
    if (selectedPeriod?.from) {
      qry.from = format(selectedPeriod?.from || new Date(), 'yyyy-MM-dd');
      qry.to = format(selectedPeriod?.to || new Date(), 'yyyy-MM-dd');
    }
    if (filters.includes('month')) {
      let monthId = []
      selectedMonth.forEach(item => monthId.push(item.value))
      qry.month = monthId.toString()
    }
    getStats(qry)
    filterQry(qry)
  }, [selectedRegion, selectedPeriod, filterQry, selectedProducts, selectedZones,selectedMonth])

  const getStats = (qry) => {
    getRenewalStatusList(filterType)
      .then((status) => {
        getStatusWiseRecordCount(filterType,qry)
          .then(res => {
            const cdata = status?.map((item) => {
              const matchingItem = res.find((el) => el.status === item.status);
              return matchingItem ? { name: item?.status, count: matchingItem?.record_count } : { name: item?.status, count: 0 };
            });
            setChartData(cdata);
            let s = 0;
            for (let i = 0; i < cdata.length; i++) {
              s += cdata[i].record_count;
            }
            setTotalLoans(s)
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch((err) => console.log('err >>', err))
  }

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setShowPicker();
  }

  return (
    <Box p={3} borderRadius={4} bgcolor="background.paper" style={{ padding: 10 }}>
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            filters.includes('zone') &&
              <Selector title="Zone" options={zones} value={selectedZones} setValue={setSelectedZones} />
          }
          {
            filters.includes('region') &&
              <Selector title="Region" options={regions} value={selectedRegion} setValue={setSelectedRegion} />
          }
          {
            filters.includes('product') &&
              <Selector title="Product" options={products} value={selectedProducts} setValue={setSelectedProducts} />
          }
        </Box>
        {
          filters.includes('period') &&
            <Box>
              <>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Period</label>
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
              </>
              <>
                {
                  ['Y','UTD','Custom'].includes(selectedPeriodType) && filters.includes('month') &&
                    <Selector title="Renewal month" options={month} value={selectedMonth} setValue={setSelectedMonth} />
                }
              </>
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
                  minDate={subDays(new Date(), 1095)}
                />
                <Box p={1} textAlign='right'>
                  <Button variant="contained" color="primary" onClick={onDateRangeClose}>
                    Apply
                  </Button>
                </Box>
              </Popover>
            </Box>
        }
      </Box>
    </Box>
  )
}

export default RenewalFilter;
