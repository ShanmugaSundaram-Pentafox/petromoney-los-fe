import { subDays, format, isValid, differenceInDays } from 'date-fns'
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import { filterStyles, Selector } from '../../../components/CommonComponents/FilterCard';
import { action_id, resources_id } from '../../../config/accessControl';
import { getAllRegions, getFilteredProducts, getSignedUrl, getZones } from '../../../services/common.service';
import CheckAllowed from '../../rbac/CheckAllowed';
import { ActionIcon, Box, Button, Popover, TextInput, Tooltip } from '@mantine/core';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SupportContactModal from '../../../components/CommonComponents/SupportContactModal/SupportContactModal';

const CreditDashboardFilter = ({ filterQry, filterType, setChartData, refetch, filters, currentUser, handleDownload, fileData, downloadLoading, searchLoading }) => {
  const classes = filterStyles();
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedProducts, setSelectedProducts] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedZones, setSelectedZones] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedType, setSelectedType] = useState(null)
  const [selectedPeriodType, setSelectedPeriodType] = useState(filterType == 'processed' ? 'D' : 'M');
  const [selectedPeriod, setSelectedPeriod] = useState(filterType == 'processed' ? { from: new Date(), to: new Date() } : {
    from: new Date(new Date().getFullYear(), new Date().getMonth()),
    to: new Date(),
  });
  const [showPicker, setShowPicker] = useState();
  const [selectedDealership, setSelectedDealership] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [opened, { open, close }] = useDisclosure(false);
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
    setChartData({ name: 'Zone', count: selectedZones })
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
    if (selectedType) {
      qry.type = selectedType
    }
    if (selectedDealership?.id) {
      qry.dealership_id = selectedDealership?.id
    }
    filterQry(qry)

  }, [selectedRegion, selectedPeriod, filterQry, selectedProducts, selectedZones, selectedType, selectedDealership?.id])

  const onDateRangeClose = () => {
    if (differenceInDays(new Date(), dateRange.startDate) <= 90) {
      setSelectedPeriod({
        from: dateRange.startDate,
        to: dateRange.endDate,
      });
    }
    else {
      open();
    }
    setShowPicker(false);
  }
  const handleSearch = () => {
    if (filterType == 'processed') {
      if (selectedDealership?.id || selectedPeriodType == 'D') {
        refetch();
        setSelectedDealership({ ...selectedDealership, error: null });
      }
      else
        setSelectedDealership({ ...selectedDealership, error: 'Please enter dealership ID to get data' });
    }
    else {
      refetch();
      setSelectedDealership({ ...selectedDealership, error: null });
      setChartData({ name: 'Zone', count: selectedZones });
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
      <Box>
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            filters.includes('zone') &&
              <Selector title="Zone" width={150} options={zones} value={selectedZones} setValue={setSelectedZones} />
          }
          {
            filters.includes('region') &&
              <Selector title="Region" width={150} options={regions} value={selectedRegion} setValue={setSelectedRegion} />
          }
          {
            filters.includes('product') &&
              <Selector title="Product" width={150} options={products} value={selectedProducts} setValue={setSelectedProducts} />
          }
          {
            filters.includes('type') &&
              <Box style={{ marginRight: '10px' }}>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Type</label>
                <div className={classes.filterWrapper}>
                  <div role="button" className={`${classes.filterItem} ${selectedType === null && 'active'}`} onClick={() => setSelectedType(null)} onKeyDown>All</div>
                  <div role="button" className={`${classes.filterItem} ${selectedType === 'regular' && 'active'}`} onClick={() => setSelectedType('regular')} onKeyDown>Regular</div>
                  <div role="button" className={`${classes.filterItem} ${selectedType === 'express' && 'active'}`} onClick={() => setSelectedType('express')} onKeyDown>Express</div>
                </div>
              </Box>
          }
          {
            filters.includes('period') &&
              <Box>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Period</label>
                <div className={classes.filterWrapper}>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'D' && 'active'}`} onClick={onDateChange('D')} onKeyDown>Today</div>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'W' && 'active'}`} onClick={onDateChange('W')} onKeyDown>1W</div>
                  <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'M' && 'active'}`} onClick={onDateChange('M')} onKeyDown>MTD</div>
                  <Tooltip label='Up to Date' withArrow color='gray'>
                    <div className={`${classes.filterItem} ${selectedPeriodType === 'UTD' && 'active'}`} onClick={onDateChange('UTD')} onKeyDown>UTD</div>
                  </Tooltip>
                  <Popover
                    opened={Boolean(showPicker)}
                    onClose={onDateRangeClose}
                    withArrow
                    shadow='md'
                  >
                    <Popover.Target>
                      <Tooltip label={selectedPeriodType === 'Custom' ? `${format(dateRange?.startDate, 'MMM dd yyy')} to ${format(dateRange?.endDate || new Date(), 'MMM dd yyy')}` : 'Choose custom Date'} withArrow color='gray'>
                        <div role={'button'} className={`${classes.filterItem} ${selectedPeriodType === 'Custom' && 'active'}`} onClick={onDateChange('Custom')} onKeyDown>
                          Custom
                        </div>
                      </Tooltip>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <DateRange
                        ranges={[dateRange]}
                        onChange={onDatePickerChange}
                        maxDate={new Date()}
                        months={2}
                        direction="horizontal"
                      />
                      <Box p={1} textAlign='right'>
                        <Button onClick={onDateRangeClose} fullWidth>
                          Apply
                        </Button>
                      </Box>
                    </Popover.Dropdown>
                  </Popover>
                </div>
              </Box>
          }
          {
            filterType == 'processed' && (
              <div style={{ marginLeft: 10, width: '150px' }}>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Enter dealership ID</label>
                <TextInput
                  type={'number'}
                  size='xs'
                  value={selectedDealership?.id}
                  onChange={(e) => { setSelectedDealership({ ...selectedDealership, id: e?.target?.value, error: null }); }}
                  error={selectedDealership?.error}
                />
              </div>
            )
          }
          <Tooltip label={'Click to search'} withArrow color={'gray'}>
            <ActionIcon
              variant="white"
              onClick={handleSearch}
              ml={10}
              mt={21}
              loading={searchLoading}
            >
              <IconSearch size={16} color={'#4196f0'} />
            </ActionIcon>
          </Tooltip>
          <Box mt={10}>
            {
              filterType == 'processed' && (
                <>
                  <Button
                    variant="outline"
                    size='xs'
                    disabled={downloadLoading}
                    leftSection={<IconDownload size={16} />}
                    onClick={handleDownload}
                  >
                    Download Report
                  </Button>
                  <Button
                    variant="outline"
                    size='xs'
                    disabled={!fileData?.file_url}
                    ml={10}
                    onClick={downloadExistingReport}
                  >
                    {fileData?.file_url ? `Show Report ( Last update : ${isValid(new Date(fileData?.modified_date)) && format(new Date(fileData?.modified_date), 'MMM dd yyyy hh:mma')} )` : fileData?.status}
                  </Button>
                </>
              )
            }
          </Box>
          {/* </Group> */}
        </Box>
        <SupportContactModal opened={opened} onClose={close} />
      </Box>
    </CheckAllowed >
  )
}

export default CreditDashboardFilter;
