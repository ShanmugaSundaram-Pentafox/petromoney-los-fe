import React, { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import AnnouncementTwoToneIcon from '@material-ui/icons/AnnouncementTwoTone';
import { Paper } from '@material-ui/core';
import { Drawer } from "@material-ui/core";
import AddOmcDetailsForm from '../PDRForms/AddOmcDetailsForm';
import AddBusinessDetailsForm from '../PDRForms/AddBusinessDetailsForm';
import AddNewOutletDetailsForm from '../PDRForms/AddNewOutletDetailsForm';




const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 4,
        flexGrow: 1,
        // maxWidth:'50vw'
    },
    paper: {
        maxWidth: 300,
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        textAlign: 'center'
    },

    wrapper: {
        padding: 8,
        width: '55vw',
    },
    title: {
        paddingLeft: 8,
        marginBottom: 8
    },
    content: {
        padding: 12,
        fontSize: '17px'
    },
    icons: {
        fontSize: '80px',
    }


}))

const PersonalDiscussionReport = ({ id, currentUser, textAlign }) => {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const [openOmcForm, setOpenOmcForm] = useState(false)
    const [openBusinessForm, setOpenBusinessForm] = useState(false)
    const [openOutletForm, setOpenOutletForm] = useState(false)

    const handleEdit = () => {
        setOpenModal(!openModal)
    }

    return (

        <div>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <Typography style={{ width: '70%' }} variant="h4" align={textAlign} className={classes.title} >Personal Discussion Report</Typography>
                </div>
                <Grid container spacing={3} className={classes.root} >
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenOmcForm(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >OMC details</Typography>

                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenBusinessForm(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >Business details</Typography>

                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenOutletForm(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >Outlet details</Typography>

                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenModal(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >OMC details</Typography>

                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenModal(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >OMC details</Typography>

                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item md={4}>
                        <Tooltip title="click to edit omc details">
                            <Paper className={classes.paper}>
                                <AnnouncementTwoToneIcon className={classes.icons} onClick={() => setOpenModal(true)} />
                                <Typography variant="h5" align='center' className={classes.title} >Business details</Typography>

                            </Paper>
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
                <AddOmcDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
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
                open={openOutletForm}
                onClose={() => setOpenOutletForm(false)}
                variant="temporary"
            >
                <AddNewOutletDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
            </Drawer>
        </div >

    );

}
export default PersonalDiscussionReport;