import { Popover, Tooltip, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { format, subDays } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { Box } from 'victory';
import Button from '../../../components/CommonComponents/Button/Button';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import usePageTitle from '../../../hooks/usePageTitle';
import { downloadAccountStatement } from '../../../services/dealerships.service';


const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  icons: {
    marginRight: 16,
  },
  number: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'hsl(0, 0%, 100%)',
    minHeight: 32,
    boxSizing: 'border-box',
  },
  filterItem: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 2,
    padding: '9px 16px',
    border: '1px solid hsl(0, 0%, 90%)',
    minWidth: 50,
    textAlign: 'center',
    backgroundColor: 'hsl(0, 0%, 100%)',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      backgroundColor: 'hsl(0, 0%, 95%)',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
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
}));




const AccountStatement = ({ id, currentUser }) => {
  usePageTitle('Statement')
  // const [selectedDate, setSelectedDate] = useState();
  const [fileCode, setFileCode] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPeriodType, setSelectedPeriodType] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [showPicker, setShowPicker] = useState();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 8),
    endDate: new Date(),
    key: 'range'
  });
  const classes = useStyles();

  const onDatePickerChange = ({ range }) => {
    setDateRange(range)
  }

  const onDateRangeClose = () => {
    setSelectedPeriod({
      from: format(dateRange.startDate, 'dd-MM-yyyy'),
      to: format(dateRange.endDate, 'dd-MM-yyyy'),
    });
    setShowPicker();
  }

  const onDateChange = type => (event) => {
    setSelectedPeriodType(type)
    switch (type) {
    case 'PFY':
      if(new Date().getMonth() + 1 <= 3){
        setSelectedPeriod({
          from: `01-04-${new Date().getFullYear()-2}`,
          to: `31-03-${new Date().getFullYear()-1}`,
        })
      } else {
        setSelectedPeriod({
          from: `01-04-${new Date().getFullYear()-1}`,
          to: `31-03-${new Date().getFullYear()}`,
        }) 
      }
      break;
    case 'CFY':
      if(new Date().getMonth() + 1 <= 3){
        setSelectedPeriod({
          from: `01-04-${new Date().getFullYear()-1}`,
          to: format(new Date(), 'dd-MM-yyyy'),
        })
      } else {
        setSelectedPeriod({
          from: `01-04-${new Date().getFullYear()}`,
          to: format(new Date(), 'dd-MM-yyyy'),
        }) 
      }
      break;
    case 'Custom':
      setShowPicker(event.currentTarget)
      break;
    default:
      break;
    }
  }

  const handleDownload = values => {
    const from_date = selectedPeriod?.from
    const to_date = selectedPeriod?.to
    setLoading(true)
    if (from_date && to_date) {
      downloadAccountStatement(id, from_date, to_date)
        .then(res => {
          setFileCode(res?.file)
          setOpenDialog(true)
          setLoading(false)
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
      enqueueSnackbar('Please enter from date and to date.', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
  }

  return (
    <>
      <Typography variant='h4' style={{ marginTop: 4, marginBottom: 12 }}>Account statement</Typography>
      <Grid container spacing={2} style={{marginLeft: 1, marginTop: 8, marginBottom: 8}}>
        <div className={classes.filterWrapper}>
          <div
            className={`${classes.filterItem} ${
              selectedPeriodType === 'PFY' && 'active'
            }`}
            onClick={onDateChange('PFY')}
          >
            Previous Financial Year
          </div>
          <div
            className={`${classes.filterItem} ${
              selectedPeriodType === 'CFY' && 'active'
            }`}
            onClick={onDateChange('CFY')}
          >
            Current Financial Year
          </div>
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
            <Button variant="contained" color="primary" 
              onClick={onDateRangeClose}
            >
              Apply
            </Button>
          </Box>
        </Popover>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
        <Button
          // disabled={!permissionCheck(currentUser.role_name, rulesList.dealership_edit)}
          color="primary"
          variant="contained"
          size="small"
          type="submit"
          onClick={handleDownload}
          style={{marginTop: 8}}
        >
          Get statement
        </Button>
      </div>
      <FormDialog
        open={openDialog}
        title={'Account statement'}
        onClose={() => { setOpenDialog(false) }}
      >
        <div className={classes.dialogBox} >
          <DialogContent className={classes.frame}>
            <iframe src={fileCode} height="900" width="500" frameBorder="0" title="Account Statement"></iframe>
          </DialogContent>
        </div>
      </FormDialog>
    </>
  )
}

export default AccountStatement;