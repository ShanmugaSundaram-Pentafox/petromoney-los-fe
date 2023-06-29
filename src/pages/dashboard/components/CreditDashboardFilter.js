import { Box, Tooltip, Popover, Button, CircularProgress } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import { subDays, format, isValid } from 'date-fns'
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import { filterStyles, Selector } from '../../../components/CommonComponents/FilterCard';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { getAllRegions, getFilteredProducts, getSignedUrl, getZones } from '../../../services/common.service';
import CheckAllowed from '../../rbac/CheckAllowed';

const CreditDashboardFilter = ({ filterQry, filterType, setChartData, refetch, filters, currentUser, handleDownload, fileData, downloadLoading, searchLoading }) => {
  const classes = filterStyles();
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedProducts, setSelectedProducts] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedZones, setSelectedZones] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedPeriodType, setSelectedPeriodType] = useState(filterType == 'processed' ? 'D' : 'W');
  const [selectedPeriod, setSelectedPeriod] = useState({ from: new Date(), to: new Date() });
  const [showPicker, setShowPicker] = useState();
  const [selectedDealership, setSelectedDealership] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });

  const { data: zones = [] } = useQuery('zones', () => { return getZones(1) }, { refetchOnWindowFocus: false })

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
    case 'Custom':
      setShowPicker(event.currentTarget)
      break;
    default:
      break;
    }
  }
  useEffect(() => {
    setChartData({ name: 'Zone', count: selectedZones })
  }, [])

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
    if (selectedDealership?.id) {
      qry.dealership_id = selectedDealership?.id
    }
    filterQry(qry)

  }, [selectedRegion, selectedPeriod, filterQry, selectedProducts, selectedZones, selectedDealership?.id])

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setShowPicker();
  }
  const handleSearch = () => {
    if (filterType == 'processed') {
      if (selectedDealership?.id || selectedPeriodType == 'D')
        refetch()
      else
        setSelectedDealership({ ...selectedDealership, error: 'Please enter dealership ID to get data' })
    }
    else {
      refetch()
      setChartData({ name: 'Zone', count: selectedZones })
    }
  }
  const downloadExistingReport = () => {
    if (fileData?.file_url) {
      getSignedUrl(fileData?.file_url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
    else {
      enqueueSnackbar('No report found please initiate download to get the report', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
  }
  return (
    <CheckAllowed currentUser={currentUser} resource={resources_id.creditReload} action={action_id.creditReload.dealer_search}>
      <Box p={3} borderRadius={4} bgcolor="background.paper" style={{ padding: 10 }}>
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
          {
            filters.includes('period') &&
              <Box>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Period</label>
                <div className={classes.filterWrapper}>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'D' && 'active'}`} onClick={onDateChange('D')} onKeyDown>Today</div>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'W' && 'active'}`} onClick={onDateChange('W')} onKeyDown>1W</div>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'M' && 'active'}`} onClick={onDateChange('M')} onKeyDown>MTD</div>
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
          {
            filterType == 'processed' && (
              <div style={{ marginLeft: 10, minWidth: '20%' }}>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Enter dealership ID</label>
                <TextInput
                  number
                  value={selectedDealership?.id}
                  onChange={(e) => { setSelectedDealership({ ...selectedDealership, id: e?.target?.value }) }}
                  error={selectedDealership?.error}
                  helperText={selectedDealership?.error}
                />
              </div>
            )
          }
          <div style={{ display: 'flex', marginTop: 15, marginLeft: 10 }}>
            <Button
              color="primary"
              variant="contained"
              size='small'
              disabled={searchLoading}
              onClick={handleSearch}
            >
              {searchLoading ? <CircularProgress size={14} /> : <SearchIcon />}
            </Button>
            {
              filterType == 'processed' && (
                <>
                  <Button
                    color="primary"
                    variant="outlined"
                    size='small'
                    disabled={downloadLoading}
                    startIcon={<GetAppIcon />}
                    style={{ marginLeft: 10 }}
                    onClick={handleDownload}
                  >
                    Download Report
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    size='small'
                    disabled={!fileData?.file_url}
                    style={{ marginLeft: 10 }}
                    onClick={downloadExistingReport}
                  >
                    {fileData?.file_url ? `Show Report ( Last update : ${isValid(new Date(fileData?.modified_date)) && format(new Date(fileData?.modified_date), 'MMM dd yyyy hh:mma')} )` : fileData?.status}
                  </Button>
                </>
              )
            }
          </div>
        </Box>
      </Box>
    </CheckAllowed>
  )
}

export default CreditDashboardFilter;
