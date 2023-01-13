import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { useMount } from 'react-use';
import Button from '../../components/CommonComponents/Button/Button';
import { getDealershipForSearch } from '../../services/common.service';
import { getAllWithheldRemarks, updateRemarks } from '../../services/withheld.services';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
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
  dropdown: {
    boxShadow: '1px 1px 4px -3px #333'
  },
  option: {
    padding: 6,
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  }
}))



const AddBlackListForm = ({ data, callback }) => {
  const queryClient = useQueryClient()
  const [newRemarks, setNewRemarks] = useState()
  const [dealerID, setDealerID] = useState()
  const [remarks, setRemarks] = useState()
  const [comment, setComment] = useState()
  const [error, setError] = useState();
  const [value, setValue] = useState()
  const [optionsLoading, setOptionsLoading] = useState(false);
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();

  useMount(() => {
    getAllWithheldRemarks()
      .then((data) => {
        setRemarks(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })

  const handleChange = (event) => {
    setComment(event.target.value)
  }

  const onChangeOption = (newValue) => {
    setDealerID(newValue.dealership_id)
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

  const handleRemarkChange = (newValue, actionMeta) => {
    if (remarks?.includes(newValue?.label)) {
      setNewRemarks(newValue?.label)
    }
    else {
      setValue(newValue?.value)
    }
  };
  const handleSave = () => {
    if ((value || newRemarks) && dealerID) {
      const res = value ? value : newRemarks;
      let body = {
        [typeof (res) === 'number' ? 'remarks_id' : 'remarks']: res,
        comment: comment ? comment : null
      }
      updateRemarks(dealerID, body)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          queryClient.invalidateQueries('withheld-loans')
          callback()
          setNewRemarks('')
          setValue('')
          setError()
        })
        .catch(err => {
          console.log(err)
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
    }
    else {
      if (!dealerID)
        setError('Choose dealership ID to add')
      else
        setError('Add remarks to save')
    }
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Withheld Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      {
        Array.isArray(data) ? (
          <>
            <div className={classes.sidePanelFormContentWrapper}>
              <div className={classes.stepperRoot}>
                <Box>
                  <form>
                    <Grid container spacing={2}>
                      <Grid item md={7}>
                        <label style={{ marginBottom: 8 }}>Dealership</label>
                        <AsyncSelect
                          components={optionsLoading ? null : { LoadingIndicator: null }}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 9999 })
                          }}
                          onChange={onChangeOption}
                          loadingMessage={() => ' '}
                          loadOptions={getOptions}
                          placeholder='Search Dealership ID or Name'
                        />
                      </Grid>
                      <Grid item md={7}>
                        <label style={{ marginBottom: 8 }}>Remarks</label>
                        <CreatableSelect
                          isClearable
                          onChange={handleRemarkChange}
                          options={remarks}
                        />
                      </Grid>
                      <Grid item md={7}>
                        <label style={{ marginBottom: 8 }}>Comments</label>
                        <TextField
                          name='comment'
                          fullWidth
                          variant='outlined'
                          value={comment}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    {
                      error &&
                        <Alert severity='error' style={{ margin: 12, marginLeft: 0 }}>{error}</Alert>
                    }
                  </form>
                </Box>
              </div>
            </div>
            <div className={classes.actionFooter}>
              <Divider />
              <div className={classes.actionButtonsWrapper}>
                <div>
                  <Button
                    variant="outlined"
                    onClick={callback}
                  >
                    Back
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSave}
                    className={clsx(classes.btn, classes.editButton)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Typography style={{ textAlign: 'center', marginTop: 12 }}>Getting dealership data...</Typography>
        )
      }

    </div>
  )

}
export default AddBlackListForm;