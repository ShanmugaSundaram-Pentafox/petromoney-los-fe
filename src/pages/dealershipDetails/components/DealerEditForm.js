import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import TextInput from '../../../components/TextInput/TextInput';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';

import FileUpload from "../../../components/FileUpload";
import Typography from '@material-ui/core/Typography'
import { useFormik } from 'formik';

const useStyles = makeStyles({
    row: {
        paddingRight: 12,
        paddingBottom: 14
    },
    input: {
        display: 'none'
    }
});

const DealerEditForm = ({ modelType, data, dealersList, deleteFile, editableValues, readOnlyProps, values, errors, onChange }) => {
    const readOnly = readOnlyProps;
    const classes = useStyles();
    const [showUpload, setShowUpload] = useState(false);
    const [currentFileUpload, setCurrentFileUpload] = useState('');
    const [formValue, setformValue] = useState(values);
    const gridItem = {
        md: 12,
        item: true,
        className: classes.row
    };
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentYearDiff = date.getFullYear() - 1970;

    const relationShipOptions = [
        { label: "Choose Relationship", value: "" },
        { label: "Father", value: "FATHER" },
        { label: "Mother", value: "MOTHER" },
        { label: "Uncle", value: "UNCLE" },
        { label: "Aunt", value: "AUNT" },
        { label: "Son", value: "SON" },
        { label: "Daughter", value: "DAUGHTER" },
        { label: "Grandfather", value: "GRANDFATHER" },
        { label: "Grandmother", value: "GRANDMOTHER" },
        { label: "Mother-in-law", value: "MOTHER-IN-LAW" },
        { label: "Father-in-law", value: "FATHER-IN-LAW" },
        { label: "Sister-in-law", value: "SISTER-IN-LAW" },
        { label: "Brother-in-law", value: "BROTHER-IN-LAW" },
        { label: "Brother", value: "BROTHER" },
        { label: "Newphew", value: "NEPHEW" },
        { label: "Partner", value: "PARTNER" },
        { label: "Friend", value: "FRIEND" },
        { label: "Shareholder", value: "SHAREHOLDER" },
        { label: "Buyer", value: "BUYER" },
        { label: "Supplier", value: "SUPPLIER" },
        { label: "Business Neighbour", value: "BUSINESS NEIGHBOUR" },
        { label: "Home Neighbour", value: "HOME NEIGHBOUR" },
        { label: "Director", value: "DIRECTOR" },
        { label: "Proprietor", value: "PROPRIETOR" },
        { label: "Debtors", value: "DEBTORS" },
        { label: "Creditors", value: "CREDITORS" },
        { label: "Principal", value: "PRINCIPAL" },
        { label: "Others", value: "OTHERS" }
    ]

    const aadharBack = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.aadhar_b_file_url} target="_blank" title={'Aadhar Back'}>{'Aadhar Back'}</a>
        )
    }

    const aadharFront = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.aadhar_f_file_url} target="_blank" title={'Aadhar Front'}>{'Aadhar Front'}</a>
        )
    }

    const panAttachment = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.pan_file_url} target="_blank" title={'PAN Attachment'}>{'PAN Attachment'}</a>
        )
    }

    return (
        <Grid container>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="First Name"
                    name="first_name"
                    error={errors.first_name}
                    readOnly={readOnly}
                    defaultValue={values.first_name}
                    helperText={errors.first_name}
                    onChange={onChange}
                />
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="Last Name"
                    name="last_name"
                    readOnly={readOnly}
                    error={errors.last_name}
                    helperText={errors.last_name}
                    defaultValue={values.last_name}
                    onChange={onChange}
                />
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    select
                    label="Gender"
                    name="gender"
                    error={errors.gender}
                    helperText={errors.gender}
                    value={values.gender}
                    disabled={readOnly}
                    onChange={onChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="null">Select Gender</option>
                    <option value={'MALE'}>Male</option>
                    <option value={'FEMALE'}>Female</option>
                </TextInput>
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    id="date"
                    label="Date of Birth"
                    name="dob"
                    error={errors.dob}
                    helperText={errors.dob}
                    readOnly={readOnly}
                    defaultValue={values.dob}
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="Email"
                    name="email"
                    readOnly={readOnly}
                    error={errors.email}
                    helperText={errors.email}
                    defaultValue={values.email}
                    onChange={onChange}
                />
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    select
                    label="Marital Status"
                    name="marital_status"
                    error={errors.marital_status}
                    helperText={errors.marital_status}
                    readOnly={readOnly}
                    value={values.marital_status}
                    onChange={onChange}
                    disabled={readOnly}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="null">Choose Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                </TextInput>
            </Grid>
            {modelType === 'COAPPLICANT' ?
                <>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            select
                            label="Relation To"
                            name="dealer_id"
                            error={errors.dealer_id}
                            helperText={errors.dealer_id}
                            readOnly={readOnly}
                            value={values.dealer_id}
                            onChange={onChange}
                            disabled={readOnly}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="null">Choose Relative</option>
                            {
                                dealersList.map((item, i) => {
                                    return (
                                        <option value={item.id}>{item.first_name} {item.last_name}</option>
                                    )
                                })
                            }
                        </TextInput>
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            select
                            label="Relationship type"
                            name="relationship"
                            error={errors.relationship}
                            helperText={errors.relationship}
                            readOnly={readOnly}
                            value={values.relationship}
                            onChange={onChange}
                            disabled={readOnly}
                            SelectProps={{
                                native: true,
                            }}
                            InputLabelProps={{ shrink: true }}
                        >
                            {
                                relationShipOptions.map((item, i) => {
                                    return (
                                        <option value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                        </TextInput>
                    </Grid>
                </> : null}

            <Grid {...gridItem}>
                <TextInput
                    label="Address"
                    name="address"
                    readOnly={readOnly}
                    defaultValue={values.address}
                    error={errors.address}
                    helperText={errors.address}
                    onChange={onChange}
                    rows={3}
                    multiline={true}
                />
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="Mobile"
                    name="mobile"
                    readOnly={readOnly}
                    value={values.mobile}
                    onChange={onChange}
                    error={errors.mobile}
                    helperText={errors.mobile}
                    type='number'
                ></TextInput>
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    select
                    label="Residing Since"
                    name="residing_since"
                    value={values.residing_since}
                    error={errors.residing_since}
                    onChange={onChange}
                    disabled={readOnly}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {
                        <>
                            <option value="null">Residing Since</option>
                            {[...Array(currentYearDiff)].map((_, i) => {
                                return (
                                    <option value={currentYear - i}>{currentYear - i}</option>
                                )
                            })}
                        </>
                    }
                </TextInput>
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="Aadhar"
                    name="aadhar"
                    value={values.aadhar}
                    helperText={errors.aadhar}
                    readOnly={readOnly}
                    error={errors.aadhar}
                    onChange={onChange}
                >
                </TextInput>
            </Grid>
            <Grid {...gridItem} md={6}>
                <TextInput
                    label="PAN Number"
                    name="pan"
                    value={values.pan}
                    error={errors.pan}
                    helperText={errors.pan}
                    readOnly={readOnly}
                    onChange={onChange}
                >
                </TextInput>
            </Grid>

            <Grid {...gridItem} md={6}>
                <Typography variant="subtitle2" component="subtitle2">
                    PAN File: {(readOnly) ?
                        <>
                            {data.pan_file_url ?
                                panAttachment()
                                : <Typography variant="subtitle2" component="subtitle2">
                                    <Tooltip title={'Click Edit and attach'}>
                                        <AttachFileRoundedIcon disabled={readOnly} />
                                    </Tooltip> Attach PAN
                                </Typography>}
                        </> :
                        <>
                            {data.pan_file_url ? panAttachment() :
                                <>
                                    <TextInput
                                        type="file"
                                        accept="image/*"
                                        name="pan_file_url"
                                        value={data.pan_file_url}
                                        onChange={(event) => {
                                            values[event.target.name] = event.currentTarget.files[0];
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    ></TextInput>
                                </>
                            }
                        </>
                    }
                </Typography>
            </Grid>

            <Grid {...gridItem} md={6}>
                <Typography variant="subtitle2" component="subtitle2">
                    Aadhar Front: {(readOnly) ?
                        <>
                            {data.aadhar_f_file_url ?
                                aadharFront()
                                : <Typography variant="subtitle2" component="subtitle2">
                                    <Tooltip title={'Click Edit and attach'}>
                                        <AttachFileRoundedIcon disabled={readOnly} />
                                    </Tooltip> Front
                                </Typography>}
                        </> :
                        <>
                            {data.aadhar_f_file_url ? aadharFront() :
                                <>
                                    <TextInput
                                        type="file"
                                        accept="image/*"
                                        name="aadhar_f_file_url"
                                        value={data.aadhar_f_file_url}
                                        onChange={(event) => {
                                            values[event.target.name] = event.currentTarget.files[0];
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    ></TextInput>
                                </>
                            }
                        </>
                    }
                </Typography>
            </Grid>
            <Grid {...gridItem} md={6}>
                <Typography variant="subtitle2" component="subtitle2">
                    Aadhar Back: {(readOnly) ?
                        <>
                            {data.aadhar_b_file_url ?
                                aadharBack()
                                :
                                <Typography variant="subtitle2" component="subtitle2">
                                    <Tooltip title={'Click Edit and attach'}>
                                        <AttachFileRoundedIcon disabled={readOnly} />
                                    </Tooltip> Back
                                    </Typography>
                            }
                        </> :
                        <>
                            {data.aadhar_b_file_url ?
                                aadharBack() :
                                <>
                                    <TextInput
                                        type="file"
                                        accept="image/*"
                                        name="aadhar_b_file_url"
                                        value={data.aadhar_b_file_url}
                                        onChange={(event) => {
                                            values[event.target.name] = event.currentTarget.files[0];
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    ></TextInput>
                                </>
                            }
                        </>
                    }
                </Typography>
            </Grid>
        </Grid>
    )
}

export default DealerEditForm;