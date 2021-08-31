import React, { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Drawer } from "@material-ui/core";
import AddOmcDetailsForm from '../PDRForms/AddOmcDetailsForm';
import AddBusinessDetailsForm from '../PDRForms/AddBusinessDetailsForm';
import AddNewOutletDetailsForm from '../PDRForms/AddNewOutletDetailsForm';
import AddInfrastructureDetailsForm from '../PDRForms/AddInfrastructureDetailsForm';
import AddAssetDetailsForm from '../PDRForms/AddAssetDetailsForm';
import { ReactComponent as AssetIcon } from '../../../icons/assets.svg';
import { ReactComponent as BunkIcon } from '../../../icons/bunk.svg';
import { ReactComponent as BusinessIcon } from '../../../icons/business.svg';
import { ReactComponent as InfrastructureIcon } from '../../../icons/infrastructure.svg';
import { ReactComponent as LoanIcon } from '../../../icons/loan.svg';
import { ReactComponent as OutletIcon } from '../../../icons/outlet.svg';
import { Button } from '@material-ui/core';
import AddBankingDetailsForm from '../PDRForms/AddBankingDetailsForm';
import { getAssetDetailsById, getInfrastructureDetailsById, getOmcDetailsById, getOutletDetailsById } from '../../../services/PDReport.services';
import { useMount } from 'react-use';


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 4,
        flexGrow: 1,
        // maxWidth:'50vw'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20

    },
    WrapperTitle: {
        fontSize: 18,
        marginBottom: 12
    },

    wrapper: {
        padding: 8,
        // width: '55vw',
    },
    title: {
        fontSize: 12,
        paddingLeft: 8,
        marginBottom: 8
    },
    content: {
        textAlign: 'center',
    },
    icons: {
        textAlign: 'center',
        // fontSize: '40px',
    },
    btnSuccess: {
        '&.MuiButton-contained': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.white
        },
        '&.MuiButton-contained:hover': {
            backgroundColor: theme.palette.success.dark
        }
    },
}))

const PersonalDiscussionReport = ({ id, currentUser, textAlign }) => {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const [openOmcForm, setOpenOmcForm] = useState(false)
    const [openBusinessForm, setOpenBusinessForm] = useState(false)
    const [openOutletForm, setOpenOutletForm] = useState(false)
    const [openInfrastructureForm, setOpenInfrastructureForm] = useState(false)
    const [openAssetForm, setOpenAssetForm] = useState(false)
    const [openBankingForm, setOpenBankingForm] = useState(false)
    const [omcData, setOmcData] = useState()
    const [outletData, setOutletData] = useState()
    const [infrastructureDetails, setInfrastructureDetails] = useState()
    const [assetDetails, setAssetDetails] = useState()


    const handleEdit = () => {
        setOpenOmcForm(false)
        setOpenBusinessForm(false)
        setOpenOutletForm(false)
        setOpenInfrastructureForm(false)
        setOpenAssetForm(false)
        setOpenBankingForm(false)
    }

    useMount(() => {
        getOmcDetailsById(id)
            .then(data => {
                setOmcData(data[0])
            })
            .catch((e) => {
                console.log(e);
            })

        getOutletDetailsById(id)
            .then(data => {
                setOutletData(data[0])
                console.log(data);

            })
            .catch((e) => {
                console.log(e);
            })

        getInfrastructureDetailsById(id)
            .then(data => {
                setInfrastructureDetails(data[0])
            })
            .catch((e) => {
                console.log(e);
            })

        getAssetDetailsById(id)
            .then(data => {
                setAssetDetails(data[0])
            })
            .catch((e) => {
                console.log(e);
            })


    })

    return (

        <div>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <Typography style={{ width: '70%' }} variant="h4" align={textAlign} className={classes.WrapperTitle} >Personal Discussion Report</Typography>
                    <Button variant="contained" size="small" className={classes.btnSuccess}>Download</Button>
                </div>
                <Grid container spacing={1} className={classes.root} >
                    <Grid item md={2}>
                        <Tooltip title="click to edit OMC details">
                            <div className={classes.content} onClick={() => setOpenOmcForm(true)}>
                                <BunkIcon width={30} className={classes.icons} />
                                <Typography variant="h5" align='center' className={classes.title} >OMC details</Typography>

                            </div>
                        </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                        <Tooltip title="click to edit Business details">
                            <div className={classes.content} onClick={() => setOpenBusinessForm(true)}>
                                <BusinessIcon width={30} className={classes.icons} />
                                <Typography variant="h6" align='center' className={classes.title} >Business details</Typography>
                            </div>
                        </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                        <Tooltip title="click to edit Outlet details">
                            <div className={classes.content} onClick={() => setOpenOutletForm(true)}>
                                <OutletIcon width={30} className={classes.icons} />
                                <Typography variant="h6" align='center' className={classes.title} >Outlet details</Typography>

                            </div>
                        </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                        <Tooltip title="click to edit Infrastructure details">
                            <div className={classes.content} onClick={() => setOpenInfrastructureForm(true)}>
                                <InfrastructureIcon width={30} className={classes.icons} />
                                <Typography variant="h6" align='center' className={classes.title} >Infrastructure details</Typography>

                            </div>
                        </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                        <Tooltip title="click to edit Asset details">
                            <div className={classes.content} onClick={() => setOpenAssetForm(true)}>
                                <AssetIcon width={30} />
                                <Typography variant="h5" align='center' className={classes.title} >Asset details</Typography>

                            </div>
                        </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                        <Tooltip title="click to edit Bank details">
                            <div className={classes.content} onClick={() => setOpenBankingForm(true)}>
                                <LoanIcon width={30} className={classes.icons} />
                                <Typography variant="h5" align='center' className={classes.title} >Bank details</Typography>

                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>

            <Drawer
                anchor="right"
                open={openOmcForm}
                onClose={() => setOpenOmcForm(false)}
                variant="temporary"
            >
                <AddOmcDetailsForm dealer_id={id} isEdit={omcData ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={omcData} />
            </Drawer>
            <Drawer
                anchor="right"
                open={openOutletForm}
                onClose={() => setOpenOutletForm(false)}
                variant="temporary"
            >
                <AddNewOutletDetailsForm dealer_id={id} isEdit={outletData ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={outletData} />
            </Drawer>
            <Drawer
                anchor="right"
                open={openBusinessForm}
                onClose={() => setOpenBusinessForm(false)}
                variant="temporary"
            >
                <AddBusinessDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
            </Drawer>
            <Drawer
                anchor="right"
                open={openInfrastructureForm}
                onClose={() => setOpenInfrastructureForm(false)}
                variant="temporary"
            >
                <AddInfrastructureDetailsForm dealer_id={id} isEdit={infrastructureDetails ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={infrastructureDetails} />
            </Drawer>
            <Drawer
                anchor="right"
                open={openAssetForm}
                onClose={() => setOpenAssetForm(false)}
                variant="temporary"
            >
                <AddAssetDetailsForm dealer_id={id} isEdit={assetDetails ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={assetDetails} />
            </Drawer>
            <Drawer
                anchor="right"
                open={openBankingForm}
                onClose={() => setOpenBankingForm(false)}
                variant="temporary"
            >
                <AddBankingDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
            </Drawer>
        </div >

    );

}
export default PersonalDiscussionReport;