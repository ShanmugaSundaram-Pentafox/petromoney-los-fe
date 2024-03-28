import { Typography, Box, Grid, Button, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import { getDealershipForSearch } from '../../services/common.service';
import {
  SubmitNocRequestbyDealershipID,
} from '../../services/noc.services';

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
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  inputFile: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  dropdown: {
    boxShadow: '1px 1px 4px -3px #333',
  },
  option: {
    padding: 6,
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  image: {
    borderRadius: 6,
    padding: 1,
  },
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  grid: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
  },
}));
const RequestNocForm = ({ data, callback, currentUser, view }) => {
  const [selectedValue, setSelectedValue] = useState(
    !view ? null : currentUser.dealership_id
  );
  const classes = useStyles();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    setLoading(true)
    SubmitNocRequestbyDealershipID(selectedValue)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setLoading(false);
        callback();
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        setLoading(false);
        callback();
      });
  };

  const getOptions = (inputValue, callback) => {
    if (inputValue.toString().length > 2) {
      setOptionsLoading(true);
      getDealershipForSearch(inputValue)
        .then((data) => {
          setOptionsLoading(false);
          callback(data);
        })
        .catch((e) => {
          setOptionsLoading(false);
        });
    }
  };
  const onChangeOption = (newValue) => {
    setSelectedValue(newValue.dealership_id);
  };
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>NOC Request Form</div>
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
                    {!view ? (
                      <AsyncSelect
                        components={
                          optionsLoading ? null : { LoadingIndicator: null }
                        }
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        onChange={onChangeOption}
                        loadingMessage={() => ' '}
                        loadOptions={getOptions}
                        placeholder="Search Dealership ID or Name"
                      />
                    ) : (
                      <Typography variant="h6" style={{ marginTop: 7 }}>
                        {selectedValue}
                      </Typography>
                    )}
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
              <Button variant="outlined" onClick={callback}>
                Back
              </Button>
            </div>
            <div>
              {
                <LoaderButton
                  variant="contained"
                  className={clsx(classes.btn, classes.editButton)}
                  isLoading={loading}
                  loadingText="Submitting..."
                  type="submit"
                  onClick={handleSubmit}
                >
                  Raise Request
                </LoaderButton>
              }
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default RequestNocForm;
