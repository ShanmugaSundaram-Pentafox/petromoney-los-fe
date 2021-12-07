import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { Fragment, useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { AddNewPartnersByID, getPartnerDetailsbyID, updatePartnersByID } from '../../../services/PDReport.services';

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


const AddPartnerDetails = ({ dealer_id, isEdit }) => {
  const classes = useStyles()
  const [partnerData, setPartnerData] = useState([])
  const [editable, setEditable] = useState(true)
  const [addNewRow, setAddNewRow] = useState();
  const [editRow, setEditRow] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useMount(() => {
    getPartnerDetailsbyID(dealer_id)
      .then(data => {
        setPartnerData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })
  const editPartnerRow = (rowData, rowIndex) => {
    setEditRow({ ...rowData, rowIndex });
  }
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // transport_name: Yup.string().required('Please enter transporter name'),

    }),
    onSubmit: values => {
      const data = { ...values }
      AddNewPartnersByID(data, dealer_id)
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
    updatePartnersByID(data, dealer_id)
      .then(res => {
        setPartnerData(res);
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
  return (
    <Table className={classes.table} size="small" aria-label="Income">
      <TableHead>
        <TableRow>
          <TableCell>Partner name</TableCell>
          <TableCell>Mobile number</TableCell>
          <TableCell>Managing partner name</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          partnerData?.map((row, i) => i === editRow?.rowIndex ? (
            <TableRow key={`edit-row-${i}`}>
              <TableCell>
                <TextInput
                  label="Partner Name"
                  name="partner_name"
                  value={editRow.partner_name}
                  onChange={onEditTextChange}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  label="Partner mobile"
                  name="partner_mobile"
                  value={editRow.partner_mobile}
                  onChange={onEditTextChange}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  label="Managing partner name"
                  name="managing_partner_name"
                  value={editRow.managing_partner_name}
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
              <TableCell>{row.partner_name}</TableCell>
              <TableCell>{row.partner_mobile}</TableCell>
              <TableCell>{row.managing_partner_name}</TableCell>
              <TableCell>
                {
                  editable ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      className={classes.btnSuccess}
                      onClick={() => editPartnerRow(row, i)}>
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
            <TableRow key={'new-row'}>
              <TableCell>
                <TextInput
                  label="Partner name"
                  name="partner_name"
                  value={values.partner_name}
                  onChange={handleChange}
                >
                </TextInput>
              </TableCell>
              <TableCell>
                <TextInput
                  label="Partner mobile"
                  name="partner_mobile"
                  value={values.partner_mobile}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  label="Managing partner name"
                  name="managing_partner_name"
                  value={values.managing_partner_name}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          )
        }
        <TableRow key={'add-row'}>
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
                  onClick={() => setAddNewRow(true)}>Add Partner</Button>
              ))
            }
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
export default AddPartnerDetails;