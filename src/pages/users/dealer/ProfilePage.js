import React, { useState, useMemo } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useMount } from 'react-use';
import usePageTitle from '../../../hooks/usePageTitle';
import { getDealerDetails, getDealersByDealershipId } from '../../../services/dealers.service';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));


const ProfilePage = () => {
    const classes = useStyles();
    usePageTitle("Profile")
    const [data, setData] = useState([]);

    useMount(() => {
        getDealerDetails()
            .then((data) => {
                const id = data.cust_details[0].cust_code
                getDealersByDealershipId(id)
                    .then((data) => {
                        setData(data[0])
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    });
    console.log("dataaa for profile", data)
    return (
        <>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item md={2}>
                        <Typography >Dealership ID</Typography>
                        <Typography>Name</Typography>
                        <Typography>Address</Typography>
                        <Typography>PAN</Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography>{data.dealership_id}</Typography>
                        <Typography>{data.first_name}</Typography>
                        <Typography>{data.address}</Typography>
                    </Grid>

                </Grid>
                <div className={classes.root}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                        <Typography className={classes.heading}>Dealers Info</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                             </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                        <Typography className={classes.heading}>Loan Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                        <Typography className={classes.heading}>Bussiness Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion><Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                        <Typography className={classes.heading}>Documents Checklists</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </Paper>
        </>
    )
}
export default ProfilePage;