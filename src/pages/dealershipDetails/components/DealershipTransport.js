import React, { useState } from 'react';
import { withStyles } from "@material-ui/core/styles"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import { Typography } from '@material-ui/core';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import Button from '../../../components/CommonComponents/Button/Button';
import { makeStyles } from "@material-ui/styles";
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import AddNewTransportsForm from '../../transports/components/AddNewTransportsForm';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import TransportOwnerTable from '../../../components/Tables/TransportOwnerTable';



const Accordion = withStyles({
    root: {
        backgroundColor: "#F0F8FF",
        border: "1px solid rgba(0, 0, 0, .125)",
        borderRadius: 4,
        marginBottom: 8,
        minWidth: '40vw',
        // boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0,
        },
        "&:before": {
            display: "none",
        },
        "&$expanded": {
            margin: "auto",
            "&:last-child": {
                marginBottom: 8,
            },
        },
    },
    expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
    root: {
        minHeight: 56,
        "&$expanded": {
            minHeight: 56,
        },
    },
    content: {
        "&$expanded": {
            margin: "12px 0",
        },
        justifyContent: "space-between",
    },
    expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        flexDirection: 'column',
        borderTop: "1px solid rgba(0, 0, 0, .125)",
    },
}))(MuiAccordionDetails)

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
    wrapper: {
        padding: 8,
        width: '50vw',
    },
    title: {
        paddingLeft: 8,
        marginBottom: 8
    },
    table: {
        // minWidth: 650,
        padding: 8
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    footer: {
        paddingTop: 8,
        textAlign: 'right'
    },
    sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '40vw',
    },
    actionButtons: {
        // paddingTop: 8
    },
    tableRow: {
        cursor: 'pointer'
    },
    document: {
        display: 'inline-block',
        borderRadius: 2,
        lineHeight: 1,
    },
    sidePanelWrapper: {
        width: '40vw',
        padding: '14px',
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    transportFormWrapper: {
        padding: theme.spacing(2),
    },
    transWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    ownerWrapper: {
        flex: 1,
        overflowY: 'auto'
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    actionButtons: {
        // paddingTop: 8
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    stepTitle: {
        '& .MuiStepLabel-label.MuiStepLabel-active': {
            fontSize: 15,
            fontWeight: 600
        }
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
const DealershipTransport = ({ id, currentUser, titleAlign }) => {
    const [openModal, setOpenModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState()
    const [transportsData, setTransportsData] = useState()
    const [vehicleData, setVehicleData] = useState()
    const [data, setData] = useState([])
    const classes = useStyles()

    const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)



    return (
        <div>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <Typography style={{ width: '70%' }} variant="h5" align={titleAlign} className={classes.title}>Transport Owner</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Owner
                </Button>
                </div>
                <div>
                    <TransportOwnerTable  />
                </div>
            </div>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => setOpenModal(false)}
                variant="temporary"
            >
                <div className={classes.sidePanelFormWrapper}>
                    <Typography className={classes.sidePanelTitle} variant="h4">
                        <div>Owner Information</div>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </Typography>
                    <div className={classes.sidePanelFormContentWrapper}>
                        <div className={classes.stepperRoot}>
                            <AddNewTransportsOwnerForm />
                        </div>
                    </div>
                    <div className={classes.actionFooter}>
                        <Divider />
                        <div className={classes.actionButtonsWrapper}>
                            <div>
                                <Button
                                    variant="outlined"
                                // startIcon={<NavigateBeforeRoundedIcon />}
                                // disabled={loading}
                                // onClick={onClose}
                                >
                                    Back
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    className={clsx(classes.btn, classes.editButton)}
                                // startIcon={!readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />}
                                // disabled={loading}
                                // onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                                >
                                    {/* {loading ? <CircularProgress size={20} /> : readOnly ? `Edit` :
                                        'Save'} */}
                                        Save
                                        </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
            <FormDialog
                title="New Transport Form"
                open={openForm}
                onClose={() => setOpenForm(false)}
            >
                <AddNewTransportsForm />
            </FormDialog>
        </div>
    )
}
export default DealershipTransport;