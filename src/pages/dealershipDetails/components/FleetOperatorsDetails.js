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
import TransportOwnerTable from '../../../components/Tables/TransportOwnerTable';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';
import FleetOperatorsTable from '../../../components/Tables/FleetOperatorsTable';
import AddNewFleetOperatorForm from '../../transports/components/AddNewFleetOperatorForm';

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
const FleetOperatorsDetails = ({ id, currentUser, titleAlign }) => {
    const [openModal, setOpenModal] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState()
    const [transportsData, setTransportsData] = useState()
    const [vehicleData, setVehicleData] = useState()
    const [edit, setEdit] = useState(false)
    const [data, setData] = useState({})
    const classes = useStyles()


    const handleEdit = () => {
        setOpenModal(!openModal)
        setEdit(false)
        setData({});
    }
    const handleClick = (e, row) => {
        console.log(e.target.value)
        setData(row)
        setOpenModal(true)
        setEdit(true)

    }

    return (
        <div>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <Typography style={{ width: '70%' }} variant="h5" align={titleAlign} className={classes.title}>Fleet Operator</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Fleet Operator
                    </Button>
                </div>
                <div>
                    <FleetOperatorsTable id={id} dealersClickRow={handleClick} />
                </div>
            </div>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => setOpenModal(false)}
                variant="temporary"
            >
                {
                    !edit ? (
                        <AddNewFleetOperatorForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
                    ) : (
                        <AddNewFleetOperatorForm data={data} dealer_id={id} callback={handleEdit} currentUser={currentUser} />
                    )
                }
            </Drawer>
        </div>
    )
}
export default FleetOperatorsDetails;