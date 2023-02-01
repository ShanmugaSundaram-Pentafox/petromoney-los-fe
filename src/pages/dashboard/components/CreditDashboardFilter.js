import { Box, Tooltip, Popover, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { subDays, format } from 'date-fns'
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { useQuery } from 'react-query';
import Select, { components } from 'react-select'
import { useMount } from 'react-use';
import Button from '../../../components/CommonComponents/Button/Button'
import TextInput from '../../../components/TextInput/TextInput';
import { getAllRegions, getFilteredProducts, getZones } from '../../../services/common.service';
import { getTypeOfAccount } from '../../../services/users.service';

const Option = (props) => {
  return (
    <components.Option {...props} >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label>&nbsp;{props.label}</label>
      </div>
    </components.Option>
  );
};

const multiValueContainer = ({ selectProps, data }) => {
  const label = data.label;
  const allSelected = selectProps.value;
  const index = allSelected?.findIndex(selected => selected?.label === label);
  const isLastSelected = index === allSelected?.length - 1;
  const labelSuffix = isLastSelected ? '' : ', ';
  const val = `${label}${labelSuffix}`;
  return val;
};

export const Selector = ({ options, value, setValue, title }) => {
  return (
    <>
      <Box style={{ width: 180 }}>
        <label style={{ color: 'hsl(0,0%,75%)' }}>{title}</label>
        <Select
          options={options}
          isMulti={true}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isClearable
          value={value}
          isSearchable={false}
          components={{
            MultiValueContainer: multiValueContainer,
            Option,
          }}
          onChange={(selectedOption, triggeredAction) => {
            if (triggeredAction?.action === 'clear') {
              setValue([{ value: 0, label: 'ALL' }])
            } else {
              setValue(selectedOption.filter(item => item.label !== 'ALL'))
            }
          }}
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
            valueContainer: (provided, state) => ({
              ...provided,
              maxHeight: '29px',
              padding: '0 6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'initial'
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              maxHeight: '29px',
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

const CreditDashboardFilter = ({ filterQry, filterType, setChartData, refetch, filters, currentUser }) => {
  const classes = useStyles();
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedProducts, setSelectedProducts] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedZones, setSelectedZones] = useState([{ label: 'ALL', value: 0 }]);
  const [selectedAccountType, setSelectedAccountType] = useState([{ label: 'ALL', value: 0 }]);
  const [accountType, setAccountType] = useState();
  const [selectedPeriodType, setSelectedPeriodType] = useState('W');
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState();
  const [selectedDealership, setSelectedDealership] = useState({});
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
    if (filters.includes('account')) {
      getTypeOfAccount()
        .then((data) => {
          setAccountType(
            data.map(({ id, type_of_account }) => ({
              label: type_of_account,
              value: id,
            }))
          );
        })
        .catch((e) => {
          console.log(e);
        })
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
    if (filters.includes('account')) {
      let accountTypeID = []
      selectedAccountType.forEach(item => accountTypeID.push(item.value))
      qry.account = accountTypeID.toString()
    }
    if (selectedPeriod?.from) {
      qry.from = format(selectedPeriod?.from || new Date(), 'yyyy-MM-dd');
      qry.to = format(selectedPeriod?.to || new Date(), 'yyyy-MM-dd');
    }
    if (selectedDealership?.id) {
      qry.dealership_id = selectedDealership?.id
    }
    setChartData({ name: 'Zone', count: selectedZones })
    filterQry(qry)

  }, [selectedRegion, selectedPeriod, filterQry, selectedProducts, selectedZones, selectedAccountType, selectedDealership?.id])

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setShowPicker();
  }
  const handleSearch = () => {
    if (filterType == 'processed') {
      if (selectedDealership?.id)
        refetch()
      else
        setSelectedDealership({ ...selectedDealership, error: 'Please enter dealership ID to get data' })
    }
    else
      refetch()
  }

  const handleClear = () => {
    setSelectedDealership({})
    setSelectedRegion([{ label: 'ALL', value: 0 }])
    setSelectedProducts([{ label: 'ALL', value: 0 }])
    setSelectedAccountType([{ label: 'ALL', value: 0 }])
    setSelectedZones([{ label: 'ALL', value: 0 }])
    setSelectedPeriodType('W')
    setSelectedPeriod({})
    refetch()
  }

  return (
    <Box p={3} borderRadius={4} bgcolor="background.paper" style={{ padding: 10 }}>
      <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {
          (filters.includes('zone') && currentUser?.role_id !== 13) &&
            <Selector title="Zone" options={zones} value={selectedZones} setValue={setSelectedZones} />
        }
        {
          (filters.includes('region') && currentUser?.role_id !== 13) &&
            <Selector title="Region" options={regions} value={selectedRegion} setValue={setSelectedRegion} />
        }
        {
          (filters.includes('product') && currentUser?.role_id !== 13) &&
            <Selector title="Product" options={products} value={selectedProducts} setValue={setSelectedProducts} />
        }
        {
          filters.includes('account') &&
            <Selector title="Account Type" options={accountType} value={selectedAccountType} setValue={setSelectedAccountType} />
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
          currentUser?.role_id !== 13 &&
            <Grid container spacing={2} style={{ marginTop: 2 }}>
              <Grid item md={3}>
                <label style={{ color: 'hsl(0,0%,75%)' }}>Enter dealership ID</label>
                <TextInput
                  value={selectedDealership?.id}
                  onChange={(e) => { setSelectedDealership({ ...selectedDealership, id: e?.target?.value }) }}
                  error={selectedDealership?.error}
                  helperText={selectedDealership?.error}
                />
              </Grid>
            </Grid>
        }
      </Box>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSearch}
          style={{ marginLeft: 20 }}
        >
          Search
        </Button>
        {/* <Button
          color="primary"
          variant="contained"
          onClick={refetch}
          style={{ marginLeft: 20 }}
        >
          Download
        </Button> */}
      </div>
    </Box>
  )
}

export default CreditDashboardFilter;
