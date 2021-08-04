import React, { useState } from 'react';
// import { withStyles } from "@material-ui/core/styles"
// import MuiAccordion from "@material-ui/core/Accordion"
// import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
// import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import { Typography } from '@material-ui/core';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import Button from '../../../components/CommonComponents/Button/Button';
import { makeStyles } from "@material-ui/styles";
import Drawer from '@material-ui/core/Drawer';
import TransportOwnerTable from '../../../components/Tables/TransportOwnerTable';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';

const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
        // textAlign: 'center',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        boxShadow: '0 1px 4px -3px #333'
    },
    sidePanelFormContentWrapper: {
        flex: 1,
        overflow: 'auto'
    },
    wrapper: {
        padding: 8,
        // width: '50vw',
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
    const [ownerInfo, setOwnerInfo] = useState()
    const [transportsData, setTransportsData] = useState()
    const [vehicleData, setVehicleData] = useState()
    const [formType, setFormType] = useState('');
    const [data, setData] = useState([])
    const [rowData, setRowData] = useState({})
    const classes = useStyles()


    const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)
    const handleEdit = () => {
        setOpenModal(!openModal)
    }
    const showOwnerEditForm = (id, data) => {
        // console.log("Owner edit form", data)
        setFormType('Edit')
        setRowData(data)
        setOpenModal(!openModal)
    }


    return (
        <div>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <Typography style={{ width: '70%' }} variant="h5" align={titleAlign} className={classes.title}>Transport Owner</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        size='small'
                        onClick={() => {
                            setOpenModal(true)
                            setRowData({})
                            setFormType('Add')
                        }}
                    >
                        Add Owner
                    </Button>
                </div>
                <div>
                    <TransportOwnerTable id={id} onRowClick={showOwnerEditForm} />
                </div>
            </div>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => {
                    setRowData({})
                    setOpenModal(false)
                }}
                variant="temporary"
            >
                <AddNewTransportsOwnerForm dealer_id={id} rowData={rowData} isAdd={formType} callback={handleEdit} currentUser={currentUser} />
            </Drawer>
        </div>
    )
}
export default DealershipTransport;