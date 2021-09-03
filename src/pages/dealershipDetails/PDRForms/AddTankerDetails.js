import React, { Fragment, useState } from 'react';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from 'notistack';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { addInfrastructureDetails, addNewTanker, getTankersById, updateTankerByID } from '../../../services/PDReport.services';
import { useMount } from 'react-use';

const useStyles = makeStyles((theme) => ({
    table: {
        padding: 8,
        marginTop: 8
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


const AddTankerDetails = ({ dealer_id, isEdit }) => {
    const classes = useStyles()
    const [tankerData, setTankerData] = useState([])
    const [editable, setEditable] = useState(true)
    const [addNewRow, setAddNewRow] = useState();
    const [editRow, setEditRow] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    useMount(() => {
        getTankersById(dealer_id)
            .then(data => {
                setTankerData(data)
            })
            .catch((e) => {
                console.log(e);
            })
    })
    const editTankerRow = (rowData, rowIndex) => {
        setEditRow({ ...rowData, rowIndex });
    }
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: { tankerData },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            const data = { ...values }
            addNewTanker(data, dealer_id)
                .then(res => {
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    });
                    // setTimeout(() => {
                    //     window.location.reload()
                    // },1500);
                })
                .catch(e => {
                    console.log(e);
                })
        }
    });
    const saveEditRow = (data, i) => {
        console.log("save edit row", data)
        updateTankerByID(data, dealer_id)
            .then(res => {
                setTankerData(res);
                setEditRow({});
            })
            .catch(err => {
                console.log('Sales data save error - ', err);
            })
    }
    const onEditTextChange = e => {
        const { name, value } = e.target;
        setEditRow({
            ...editRow,
            [name]: value
        })
    }

    console.log("tanker data", tankerData)
    return (
        <Table className={classes.table} size="small" aria-label="Income">
            <TableHead>
                <TableRow>
                    <TableCell>Tanker number</TableCell>
                    <TableCell>Tanker  Type</TableCell>
                    <TableCell>Tanker Capacity</TableCell>
                    <TableCell>Tanker Operation hours</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    tankerData?.map((row, i) => i === editRow?.rowIndex ? (
                        <TableRow key={`edit-row-${i}`}>
                            <TableCell>
                                <TextInput
                                    label="Tanker number"
                                    name="vehicle_no"
                                    value={editRow.vehicle_no}
                                    onChange={onEditTextChange}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    select
                                    label="Tanker type"
                                    name="tanker_type"
                                    value={editRow.tanker_type}
                                    onChange={onEditTextChange}
                                >
                                    <option>Owned</option>
                                    <option>Rented</option>
                                </TextInput>
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    label="Tanker capacity"
                                    name="tanker_capacity"
                                    value={editRow.tanker_capacity}
                                    onChange={onEditTextChange}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    label="Operational hours"
                                    name="operation_hours"
                                    value={editRow.operation_hours}
                                    onChange={onEditTextChange}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    className={classes.btnSuccess}
                                    onClick={() => saveEditRow(editRow, i)}>
                                    Save
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setEditRow({});
                                    }}>
                                    Cancel
                                </Button>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow key={i}>
                            <TableCell>{row.vehicle_no}</TableCell>
                            <TableCell>{row.tanker_type}</TableCell>
                            <TableCell>{row.tanker_capacity}</TableCell>
                            <TableCell>{row.operation_hours}</TableCell>
                            <TableCell align="right">
                                {
                                    editable ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            className={classes.btnSuccess}
                                            onClick={() => editTankerRow(row, i)}>
                                            Edit
                                        </Button>
                                    ) : null
                                }

                            </TableCell>
                        </TableRow>
                    ))
                }
                {
                    addNewRow && (
                        <TableRow key={"new-row"}>
                            <TableCell>
                                <TextInput
                                    label="Tanker number"
                                    name="vehicle_no"
                                    value={values.vehicle_no}
                                    onChange={handleChange}
                                >
                                </TextInput>
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    select
                                    label="Tanker Type"
                                    name="tanker_type"
                                    value={values.tanker_type}
                                    onChange={handleChange}
                                >
                                    <option>Owned</option>
                                    <option>Rented</option>
                                </TextInput>
                            </TableCell>
                            <TableCell align={"right"}>
                                <TextInput
                                    label="Tanker_capacity"
                                    name="tanker_capacity"
                                    value={values.tanker_capacity}
                                    onChange={handleChange}
                                />
                            </TableCell>
                            <TableCell >
                                <TextInput
                                    label="Operation hours"
                                    name="operation_hours"
                                    value={values.operation_hours}
                                    onChange={handleChange}
                                />
                            </TableCell>
                            <TableCell align={"right"}></TableCell>
                        </TableRow>
                    )
                }
                <TableRow key={"add-row"}>
                    <TableCell align="right" colSpan={4}>
                        {
                            addNewRow ? (
                                <Fragment>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setAddNewRow(false);
                                        }}>
                                        <ClearRoundedIcon fontSize="small" />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        className={classes.btnSuccess}
                                        onClick={handleSubmit}>
                                        <DoneRoundedIcon fontSize="small" />
                                    </Button>
                                </Fragment>
                            ) : (editable && (

                                <Button
                                    variant="contained"
                                    className={clsx(classes.btn, classes.btnSuccess)}
                                    onClick={() => setAddNewRow(true)}>Add Tanker</Button>
                            ))
                        }
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

    )
}
export default AddTankerDetails;