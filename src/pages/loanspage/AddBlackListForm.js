import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '../../components/CommonComponents/Button/Button';
import Typography from "@material-ui/core/Typography"
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/styles";
import { useMount } from 'react-use';
import { addNewRemarks, AddNewRemarks, getAllWithheldRemarks, updateRemarks } from '../../services/withheld.services';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useSnackbar } from 'notistack';



const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
        // textAlign: 'center',
        padding: '24px 16px',
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
    const [newRemarks, setNewRemarks] = useState()
    const [dealerID, setDealerID] = useState()
    const [remarks, setRemarks] = useState()
    const [list, setList] = useState([])
    const [value, setValue] = useState()
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (data?.length) {
            setList(data.map(({ id }) => ({
                label: id,
                value: id
            })))
        }
    }, [data])

    useMount(() => {
        getAllWithheldRemarks()
            .then((data) => {
                setRemarks(data)
            })
            .catch((e) => {
                console.log(e);
            })

    })

    const handleRemarkChange = (newValue, actionMeta) => {
        if (remarks.includes(newValue?.label)) {
            setNewRemarks(newValue?.label)
        }
        else {
            setValue(newValue?.label)
        }
    };
    const handleSave = () => {
        const res = value ? value : newRemarks;
        if (!value) {
            updateRemarks(dealerID.label, res)
                .then(res => {
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    }
                    )
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500);
                    setNewRemarks("")
                    setValue("")
                })
                .catch(err => {
                    console.log(err)
                    enqueueSnackbar(err, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'error',
                    }
                    )

                })
        }
        else {
            addNewRemarks(dealerID.value, res)
                .then(res => {
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    }
                    )
                    setNewRemarks("")
                    setValue("")
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500);
                })
                .catch(err => {
                    console.log(err)
                    enqueueSnackbar(res.message, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'error',
                    }
                    )
                })
        }
    }

    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Withheld Form</div>
                <CloseIcon onClick={callback} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item md={7}>
                                    <Select
                                        isClearable
                                        onChange={setDealerID}
                                        options={list}
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
                            </Grid>
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
        </div >
    )

}
export default AddBlackListForm;