import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import Button from '../../../components/CommonComponents/Button/Button';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import AddNewTransportForm from '../../../pages/transports/components/AddNewTransportsForm';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';
import usePageTitle from '../../../hooks/usePageTitle';


const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 5px 0 rgba(0,0,0,.4);
  max-width:22vw;
  min-height:25vh;

  .card-body {
    display: flex;
    justify-content:flex-start;
    align-items: center;
    padding: 10px 15px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding-left: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;


const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        paddingTop: theme.spacing(1),
        color: '#9e9e9e'
    },
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
    tableRow: {
        cursor: 'pointer'
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

export const OwnerInfoCard = () => {
    const classes = useStyles()
    const [openEditModal, setOpenEditModal] = useState(false)
    usePageTitle(`111222 - Owner's name`,true)
    return (
        <>
            <Card>
                <Typography variant="h4" color="action" className={classes.title}>Owner Info</Typography>
                <div className="card-body">
                    <Box pr={2}>
                        <Avatar>
                            <AccountCircleRoundedIcon />
                        </Avatar>
                    </Box>
                    <Box>
                        <p><strong>Vignesh S</strong></p>
                        <p><small>13-11-1998 | Male</small></p>
                        <p><small>76/7, East street,Salem, 636003 </small></p>
                        <p><small>9876543212 </small></p>
                        <p><small>hello@pentafox.in</small></p>
                    </Box>
                </div>
                <div className="card-footer">
                    <IconButton
                        color="primary"
                        aria-label="edit owner"
                        component="span"
                        onClick={() => setOpenEditModal(true)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </div>
            </Card>

            <Drawer
                anchor="right"
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                variant="temporary"
            >
                <div className={classes.sidePanelFormWrapper}>
                    <Typography className={classes.sidePanelTitle} variant="h4">
                        <div>Owner Information</div>
                        <CloseIcon onClick={() => setOpenEditModal(false)} />
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
                                    onClick={() => setOpenEditModal(false)}
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

        </>

    )


}

const OwnerDetails = ({ loading }) => {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const [loans, setLoans] = useState([
        {
            transport_id: 102211,
            name: "M C K Vinoj",
            mobile: 9876543210,
            omc: "Others"
        }
    ])
    const columns = useMemo(() => {
        return [
            {
                label: 'Transport Id',
                name: 'transport_id',
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: value => {
                        return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
                    }
                }
            },
            {
                label: 'Name',
                name: 'name',
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                label: 'Mobile',
                name: 'mobile',
                options: {
                    filter: true,
                    filterWidth: "100%",
                    sort: true,
                    // setCellProps: () => ({
                    //     align: 'center',
                    // }),
                    customBodyRender: value => {
                        return <div>
                            {value ? value : '-'}
                        </div>
                    }
                }
            },
            {
                label: 'OMC',
                name: 'omc',
                options: {
                    filter: false,
                    sort: true
                }
            },
        ]
    }, [loans]);

    const options = {
        selectableRowsHeader: false,
        selectableRows: "none",
        print: false,
        filter: false,
        search: false,
        download: false,
        viewColumns: false,
        rowsPerPage: 3,
        isRowSelectable: () => false,
        selectableRowsHeader: false,
        customToolbar: () => {
            return (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                >
                    Add Transport
                </Button>
            );
        }
    };


    return (
        <>
            <Grid container>
                <Grid item md={4}>
                    <OwnerInfoCard />
                </Grid>
                <Grid item md={9}>
                    <div >
                        {
                            Array.isArray(loans) && loans.length ? (

                                <MUIDataTable
                                    title={<Typography className={classes.tableTitle} variant="h4" component="h4">Transports List</Typography>}
                                    data={loans}
                                    columns={columns}
                                    options={options}
                                />
                            ) : (
                                !loading && <Paper style={{ padding: 10 }}>No Submitted Records</Paper>
                            )
                        }
                        {
                            loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
                        }
                    </div>
                </Grid>
            </Grid>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => setOpenModal(false)}
                variant="temporary"
            >
                <div className={classes.sidePanelFormWrapper}>
                    <Typography className={classes.sidePanelTitle} variant="h4">
                        <div>Add New Transport Form</div>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </Typography>
                    <div className={classes.sidePanelFormContentWrapper}>
                        <div className={classes.stepperRoot}>
                            <AddNewTransportForm />
                        </div>
                    </div>
                    <div className={classes.actionFooter}>
                        <Divider />
                        <div className={classes.actionButtonsWrapper}>
                            <div>
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenModal(false)}
                                >
                                    Back
                                    </Button>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    className={clsx(classes.btn, classes.editButton)}
                                >
                                    Add Transport
                                    </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </Drawer>
        </>
    )

}

export default OwnerDetails;