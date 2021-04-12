import React, { useMemo, useState } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useMount } from "react-use"
import { selectAllTransports } from "../../../store/transports/transports.selector"
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { setAllTransports } from "../../../store/transports/transports.actions"
import { getDealerTransportsList } from "../../../services/dealers.service"
import Button from '../../../components/CommonComponents/Button/Button';
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog"
import AddNewTransportsForm from "./AddNewTransportsForm"
import Tooltip from '@material-ui/core/Tooltip';





const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 500,
    },
}))

const DealerTransportsTable = () => {
    const [transports, setTransports] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const classes = useStyles()

    useMount(() => {
        if (!transports.length) {
            getDealerTransportsList()
                .then((data) => {
                    setTransports(data)
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    })
    const columns = useMemo(() => {
        return [
            {
                label: "Code",
                name: "id",
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
                name: "name",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                label: "Mobile Number",
                name: "mobile",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                label: "OMC",
                name: "omc",
                options: {
                    filter: false,
                    sort: true,
                },
            },
        ]
    }, [])
    const options = {
        filter: false,
        print: false,
        download: false,
        search: false,
        column: false,
        viewColumns: false,
        selectableRowsHeader: false,
        selectableRows: "none",
        rowsPerPage: 10,
        isRowSelectable: () => false,
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
    }

    return (
        <>
            <div>
                {Array.isArray(transports) && transports.length ? (
                    <MUIDataTable
                        title={
                            <div>
                                <Typography className={classes.title} variant="h5" component="h5">
                                    Transports List
                            </Typography>
                            </div>
                        }
                        data={transports}
                        columns={columns}
                        options={options}
                    />
                ) : (
                    <CircularProgress />
                )}
            </div>
            <FormDialog
                title="Add Transport"
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <AddNewTransportsForm />
            </FormDialog>
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    transports: selectAllTransports,
})

const mapDispatchToProps = (dispatch) => ({
    setAllTransports: (data) => dispatch(setAllTransports(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DealerTransportsTable)
