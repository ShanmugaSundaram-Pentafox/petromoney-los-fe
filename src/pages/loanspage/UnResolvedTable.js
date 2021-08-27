import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core"; import Button from '../../components/CommonComponents/Button/Button';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Tooltip } from '@material-ui/core';
import { Drawer } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import AddBlackListForm from './AddBlackListForm';
import { deleteRemarks, resolveRemarks } from '../../services/withheld.services';



const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 500,
    },
}))

const UnresolvedTable = ({ data }) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const classes = useStyles()

    const handleResolve = (id) => {
        resolveRemarks(id)
            .then((data) => {
                console.log(data)
            })
            .catch((e) => {
                console.log(e);
            })

    }
    const handleDelete = (id) => {
        deleteRemarks(id)
            .then((data) => {
                console.log(data)
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                name: "id",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <div>{value}</div>
                    },
                },
            },
            {
                label: "Name",
                name: "name",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <>{value?.toUpperCase()}</>
                    },
                },
            },
            {
                label: "Region",
                name: "region",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                label: "Remarks",
                name: "remarks",
                options: {
                    filter: true,
                    sort: true,
                    setCellProps: () => ({
                        align: 'left',
                    }),
                    customBodyRender: (value, tableMeta) => {
                        return (
                            value?.map((remark) => {
                                return (
                                    <div style={{ marginBottom: 12, display: 'flex' }}>
                                        <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.remarks}</div>
                                        <div onClick={() => handleResolve(remark.id)} style={{ marginLeft: 12 }}>
                                            <Tooltip title="Click to resolve">
                                                <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                                            </Tooltip>
                                        </div>
                                        <div onClick={() => { handleDelete(remark.id) }} style={{ marginLeft: 12 }}>
                                            <Tooltip title='Click to delete'>
                                                <DeleteOutlineRounded style={{ color: "#ff6666" }} fontSize={'small'} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                )
                            })
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
            <Grid item md={12}>
                {Array.isArray(data) && data.length ? (
                    <MUIDataTable
                        title={
                            <Typography className={classes.title} variant="h5" component="h5">
                                Unresolved withheld loans
                            </Typography>
                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                ) : (!loading && <Paper style={{ padding: 10 }}>No unresolved withheld loans found</Paper>)
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
                <AddBlackListForm callback={() => setOpenModal(false)} data={data} />
            </Drawer>
        </>
    )
}
export default UnresolvedTable;