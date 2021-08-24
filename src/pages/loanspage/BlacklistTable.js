import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { NavLink as RouterLink } from "react-router-dom";
import { useMount } from 'react-use';
import { getAllVehicleLoans } from "../../services/transports.service";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core";
import Button from '../../components/CommonComponents/Button/Button';
import { DeleteOutlineRounded } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import { Drawer } from "@material-ui/core";
import AddBlackListForm from './AddBlackListForm';




const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 500,
    },
}))

const BlacklistTable = () => {
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const classes = useStyles()

    useMount(() => {
        getAllVehicleLoans()
            .then((data) => {
                setData(data)
            })
            .catch((e) => {
                console.log(e);
            })

    })

    const columns = useMemo(() => {
        return [
            {
                label: "Code",
                name: "transporter_id",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
                    },
                },
            },
            {
                label: "Name",
                name: "transporter_name",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <>{value?.toUpperCase()}</>
                    },
                },
            },
            {
                label: "Vehicle Number",
                name: "tt_no",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                label: "Action",
                name: "",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <Tooltip title={'Delete'}>
                                <Typography style={{ color: '#ff6666' }}>
                                    <DeleteOutlineRounded />
                                </Typography>
                            </Tooltip>
                        )
                    },
                },
            },
        ]
    }, [])
    const options = {
        // filterType: 'checkbox',
        selectableRowsHeader: false,
        selectableRows: "none",
        rowsPerPage: 10,
        viewColumns: false,
        print: false,
        download: false,
        filter: false,
        isRowSelectable: () => false,
        customToolbar: () => {
            return (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                >
                    Add
                </Button>
            );
        }

    }


    return (
        <>
            <Grid item md={8}>
                {Array.isArray(data) && data.length ? (
                    <MUIDataTable
                        title={
                            <Typography className={classes.title} variant="h5" component="h5">
                                Blacklists
                            </Typography>
                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                ) : (!loading && <Paper style={{ padding: 10 }}>No blacklist found</Paper>)
                }
                {
                    loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
                }
            </Grid>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => setOpenModal(false)}
                variant="temporary"
            >
                <AddBlackListForm data={data} />

            </Drawer>
        </>
    )
}
export default BlacklistTable;