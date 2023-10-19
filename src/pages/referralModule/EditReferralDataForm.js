import { Typography, Box, Grid, Button, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import { getDealershipForSearch } from '../../services/common.service';
import { postReferralData } from '../../services/dealerships.service';
const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  submitButton: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  image: {
    borderRadius: 6,
    padding: 1
  },
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  grid: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2
  }
}));
const EditReferralDataForm = ({ dealershipId, rowData, callback }) => {
  const [selectedValue, setSelectedValue] = useState({
    dealership_id: rowData?.referred_dealership_id,
    label: `${rowData?.referred_dealership_id} - ${rowData?.referred_dealership_name}`,
    name: rowData?.referred_dealership_name,
    region: rowData?.region,
  });
  const classes = useStyles();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (selectedValue?.dealership_id) {
      setLoading(true);
      let body = { referred_dealership_id: selectedValue?.dealership_id, referred_dealership_name: selectedValue?.name}
      postReferralData(dealershipId, body, rowData?.referral_id)
        .then((res) => {
          setLoading(false);
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          callback();
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
          callback();
        })
    }
    else {
      enqueueSnackbar('Please enter dealership ID', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      })
    }
  }

  const getOptions = (inputValue, callback) => {
    if (inputValue.toString().length > 2) {
      setOptionsLoading(true)
      getDealershipForSearch(inputValue)
        .then(data => {
          setOptionsLoading(false)
          callback(data);
        })
        .catch(e => {
          console.log(e);
          setOptionsLoading(false)
        })
    }
  }
  const onChangeOption = (newValue) => {
    setSelectedValue(newValue)
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Edit dealer referral form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Box>
              <form>
                <Grid container spacing={2}>
                  <Grid item md={8} style={{ marginBottom: 10 }}>
                    <label style={{ marginBottom: 8 }}>Dealership</label>
                    {
                      <AsyncSelect
                        components={optionsLoading ? null : { LoadingIndicator: null }}
                        styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 })
                        }}
                        defaultInputValue={selectedValue?.label}
                        onChange={onChangeOption}
                        loadingMessage={() => ' '}
                        loadOptions={getOptions}
                        placeholder={'Search by dealership Id or name'}
                      />
                    }
                  </Grid>
                </Grid>
              </form>
            </Box>
          </div>
        </div>
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <div>
              <Button variant='outlined' onClick={callback}>
                Back
              </Button>
            </div>
            <div>
              {
                <LoaderButton
                  variant='contained'
                  className={classes.submitButton}
                  isLoading={loading}
                  loadingText='Submitting...'
                  type='submit'
                  onClick={handleSubmit}
                >Submit</LoaderButton>
              }
            </div>
          </div>
        </div>
      </>
    </div >
  );
};

export default EditReferralDataForm;