/* eslint-disable react/react-in-jsx-scope */
import { Box, Button, Popover, Tooltip } from '@mantine/core'
import { format, subDays } from 'date-fns'
import { filterStyles } from '../FilterCard';
import { DateRange } from 'react-date-range';
import { useState } from 'react';

const DateFilter = ({ filterObj }) => {
  const classes = filterStyles();
  const [selectedPeriodType, setSelectedPeriodType] = useState('D');
  const [showPicker, setShowPicker] = useState();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });

  const onDatePickerChange = ({ range }) => {
    setDateRange(range)
  }

  const onDateRangeClose = () => {
    filterObj({
      from: dateRange.startDate,
      to: dateRange.endDate,
    })
    setShowPicker();
  }

  const onDateChange = type => (event) => {
    let today = new Date();
    let year = today.getFullYear(); // to get the current year
    let month = today.getMonth(); // to get the current month if it is with January being 0 and December being 11. 
    setSelectedPeriodType(type)
    switch (type) {
    case 'D':
      filterObj({
        from: today,
        to: today,
      })
      break;
    case 'W':
      filterObj({
        from: subDays(today, 8),
        to: today,
      })
      break;
    case 'M':
      filterObj({
        from: new Date(year, month),
        to: new Date(),
      })
      break;
    case 'Y':
      year = month < 3 ? year - 1 : year // if the user choose YTD from the month between JAN to March the period is set from the previous year APR month.
      filterObj({
        from: new Date(year, 3),
        to: new Date(),
      })
      break;
    case 'UTD':
      filterObj({})
      break;
    case 'Custom':
      setShowPicker(true)
      break;
    default:
      break;
    }
  }


  return (
    <Box>
      {/* <label style={{ color: 'hsl(0,0%,75%)' }}>Period</label> */}
      <div className={classes.filterWrapper}>
        <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'D' && 'active'}`} onClick={onDateChange('D')} onKeyDown>Today</div>
        <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'W' && 'active'}`} onClick={onDateChange('W')} onKeyDown>1W</div>
        <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'M' && 'active'}`} onClick={onDateChange('M')} onKeyDown>MTD</div>
        <div role="button" className={`${classes.filterItem} ${selectedPeriodType === 'Y' && 'active'}`} onClick={onDateChange('Y')} onKeyDown>YTD</div>
        <Tooltip label='Up to Date' withArrow color='gray'>
          <div className={`${classes.filterItem} ${selectedPeriodType === 'UTD' && 'active'}`} onClick={onDateChange('UTD')} onKeyDown>UTD</div>
        </Tooltip>
        <Popover
          opened={showPicker}
          onClose={onDateRangeClose}
          position='bottom-end'
          withArrow
        >
          <Popover.Target>
            <Tooltip withArrow color='gray' label='Choose custom dates'>
              <div className={`${classes.filterItem} ${selectedPeriodType === 'Custom' && 'active'}`} onClick={onDateChange('Custom')} onKeyDown>
                {
                  selectedPeriodType === 'Custom' ? (
                    `${format(dateRange?.startDate, 'dd-MM-yyyy')} to ${format(dateRange?.endDate || new Date(), 'dd-MM-yyyy')}`
                  ) : 'Custom'
                }
              </div>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <DateRange
              ranges={[dateRange]}
              onChange={onDatePickerChange}
              months={2}
              direction="horizontal" 
              minDate={subDays(new Date(), 1095)}
            />
            <Box >
              <Button onClick={onDateRangeClose}>
                Appl
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      </div>
    </Box>
  )
}

export default DateFilter