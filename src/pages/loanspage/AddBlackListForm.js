import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '../../components/CommonComponents/Button/Button';
import Typography from "@material-ui/core/Typography"
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextInput from '../../components/TextInput/TextInput';


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



const AddBlackListForm = ({ rowData, data, handleChange, callback }) => {
    const [newRemark, setNewRemark] = useState()
    const classes = useStyles()

    const remarks = [
        {
            "id": "1",
            "remarks": "Transporter Agreement not Signed",
            "is_resolved": 0
        },
        {
            "id": "2",
            "remarks": "Fuel Credit Agreement not signed",
            "is_resolved": 1
        },
        {
            "id": "3",
            "remarks": "Renewal Processing fee is not collected",
            "is_resolved": 1
        }
    ]

    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    const handleSubmit = () => {
        console.log("submit")
    }
    const mapList = (rowData, newValue) => {
        console.log("mapped")


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
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={7}>
                                    <Autocomplete
                                        size="small"
                                        options={data}
                                        getOptionLabel={(option) => option?.dealership_id?.toString()}
                                        id="Choose id"
                                        debug
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <TextInput
                                                    {...inputProps}
                                                    {...params}
                                                    variant="standard"
                                                    placeholder="Choose ID"
                                                    label="ID"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </div>
                                        )}
                                        onChange={(event, newValue) => {
                                            mapList(rowData, newValue)
                                        }}
                                    />
                                </Grid>
                                <Grid item md={7}>
                                    <Autocomplete
                                        size="small"
                                        options={remarks}
                                        getOptionLabel={(option) => option?.remarks?.toString()}
                                        id="Choose id"
                                        debug
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <TextInput
                                                    {...inputProps}
                                                    {...params}
                                                    onChange={(e) => setNewRemark(e.target.value)}
                                                    variant="standard"
                                                    placeholder="Choose ID"
                                                    label="ID"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </div>
                                        )}
                                        onChange={(event, newValue) => {
                                            mapList(rowData, newValue)
                                        }}
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
                            onClick={handleSubmit}
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