
import React, { useState } from 'react';
import { withStyles } from "@material-ui/core/styles"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import { useMount } from "react-use";
import { Typography } from '@material-ui/core';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import Button from '../../../components/CommonComponents/Button/Button';
import { makeStyles } from "@material-ui/styles";
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import AddNewTransportsForm from '../../transports/components/AddNewTransportsForm';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {
    getTransporterInfoFromID,
    getTransportOwnerInfo,
    getVehicleInfoFromID,
} from "../../../services/transports.service";


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
    root: {
        width: '50vw',
        padding: 4,

    },
    mainDiv: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    sidePanelWrapper: {
        width: '50vw',
        padding: '14px',
    },
    sidePanelTitle: {
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        marginBottom: 4,
        boxShadow: '0 1px 4px -3px #333',
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
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
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

}))
const DealershipTransport = ({ id, currentUser }) => {
    const [openModal, setOpenModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState()
    const [transportsData, setTransportsData] = useState()
    const [vehicleData, setVehicleData] = useState()

    const classes = useStyles()

    const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)
    useMount(() => {

    })


    console.log("transport details", transportsData);
    console.log("vehicle info ", vehicleData)
    console.log("owner info", ownerInfo)

    return (
        <div>
            <div className={classes.root}>
                <div className={classes.mainDiv}>
                    <Typography variant="h5">Dealership Transport</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Transport
                </Button>
                </div>
            </div>
            <Drawer anchor="right" open={openModal} onClose={() => setOpenModal(false)}>
                <div className={classes.sidePanelWrapper}>
                    <Typography className={classes.sidePanelTitle} variant="h4">
                        <div> Owner Information</div>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </Typography>
                    <div className={classes.ownerWrapper}>
                        <AddNewTransportsOwnerForm />
                    </div>
                    <div className={classes.transportFormWrapper}>
                        <div className={classes.transWrapper}>
                            <Typography variant="h3" >Transports</Typography>
                            <Tooltip title="Add transport">
                                <AddOutlinedIcon fontSize="large" color="secondary" onClick={() => setOpenForm(true)} />
                            </Tooltip>
                        </div>
                        <div>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1d-content"
                                    id="panel1d-header"
                                >
                                    <Typography variant="h6">Erode Lorry Owner Association</Typography>
                                    <div style={{ display: "flex" }}>
                                        <Tooltip title="Edit vehicle">
                                            <Typography style={{ marginRight: '7px', color: "#4770C1" }} >
                                                <EditOutlinedIcon fontSize="medium" onClick={() => setOpenForm(true)} />
                                            </Typography>
                                        </Tooltip>
                                        <Tooltip title="Delete vehicle">
                                            <Typography style={{ color: '#ff6666' }}>
                                                <DeleteOutlineOutlinedIcon fontSize="medium" />
                                            </Typography>
                                        </Tooltip>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>

                                </AccordionDetails>

                            </Accordion>
                        </div>

                    </div>
                </div>
            </Drawer>
            <FormDialog
                title="New User Form"
                open={openForm}
                onClose={() => setOpenForm(false)}
            >
                <AddNewTransportsForm />
            </FormDialog>
        </div>
    )
}
export default DealershipTransport;