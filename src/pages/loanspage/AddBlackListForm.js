import React from 'react';
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



const AddBlackListForm = ({ rowData, data, handleChange, action }) => {
    const classes = useStyles()
    const remarks = {
        remarks: [
            'Transporter Agreement not Signed',
            'Fuel Credit Agreement not signed',
            'Renewal Processing fee is not collected',
        ]
    }

    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    const handleSubmit = () => {
        console.log("submit")
    }
    const mapList = () => {
        console.log("mapped")

    }

    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Blacklist data Form</div>
                <CloseIcon onClick={action} />
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
                                        getOptionLabel={(option) => option?.transporter_id?.toString()}
                                        id="Choose id"
                                        debug
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <TextInput
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
                            onClick={action}
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
                            Add to Blacklist
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )

}
export default AddBlackListForm;