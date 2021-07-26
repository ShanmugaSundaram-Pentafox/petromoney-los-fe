import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextInput from '../../../components/TextInput/TextInput';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';


const useStyles = makeStyles({
    row: {
        paddingRight: 12,
        paddingBottom: 14
    },
    input: {
        display: 'none'
    },
    details: {
        padding: 4,
        marginBottom: 10,
        borderColor: 'grey',
        minWidth: 80,
        height: 60,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left'
    },
    readOnlyWrapper: {
        margin: '2px 4px',
        maxWidth: '100%',
    },
    text: {
        fontSize: 14,
    },
    title: {
        fontSize: 12,
    },
});

const DealerEditForm = ({ modelType, data, dealersList, handleDate, deleteFile, editableValues, readOnlyProps, values, errors, onChange, handleState }) => {
    const readOnly = readOnlyProps;
    const classes = useStyles();
    const [showUpload, setShowUpload] = useState(false);
    const [currentFileUpload, setCurrentFileUpload] = useState('');
    const [formValue, setformValue] = useState(values);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const [selectedDate, setSelectedDate] = useState(data.dob)
    const handleDateChange = (date) => {
        setSelectedDate(date)
        handleDate(date)
    }
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        handleState(state)
    };

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
    const profileAttachment = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.profile_image_url} target="_blank" title={'Profile Attachment'}>{'Profile Attachment'}</a>
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
        <>
            {
                readOnly ? (
                    <Grid container spacing={2} className={classes.readOnlyWrapper}>
                        <Grid item md={6}>
                            <Box className={classes.box} >
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>ID</p>
                                        <strong className={classes.text}>{values.id}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Date of Birth</p>
                                        <strong className={classes.text}>{values.dob}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Address</p>
                                        <strong className={classes.text}>{values.address}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Marital status</p>
                                        <strong className={classes.text}>{values.marital_status}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Mobile</p>
                                        <strong className={classes.text}>{values.mobile}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Aadhar</p>
                                        <strong className={classes.text}>{values.aadhar}</strong>
                                    </div>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={6}>
                            <Box className={classes.box} >
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Name</p>
                                        <strong className={classes.text}>{values.first_name} {values.last_name}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Gender</p>
                                        <strong className={classes.text}>{values.gender}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Residing since</p>
                                        <strong className={classes.text}>{values.residing_since}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>Email</p>
                                        <strong className={classes.text}>{values.email}</strong>
                                    </div>
                                </Box>
                                <Box className={classes.details}>
                                    <div>
                                        <p className={classes.title}>PAN</p>
                                        <strong className={classes.text}>{values.pan}</strong>
                                    </div>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container>
                        <>
                            <Grid {...gridItem} md={6}>
                                <TextInput
                                    label="First Name"
                                    name="first_name"
                                    error={errors.first_name}
                                    readOnly={readOnly}
                                    value={values.first_name?.toUpperCase()}
                                    helperText={errors.first_name}
                                    onChange={onChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid {...gridItem} md={6}>
                                <TextInput
                                    label="Last Name"
                                    name="last_name"
                                    readOnly={readOnly}
                                    error={errors.last_name}
                                    helperText={errors.last_name}
                                    value={values.last_name?.toUpperCase()}
                                    onChange={onChange}
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <option value="null">Select Gender</option>
                                    <option value={'MALE'}>Male</option>
                                    <option value={'FEMALE'}>Female</option>
                                </TextInput>
                            </Grid>
                            <Grid {...gridItem} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        variant='inline'
                                        inputVariant='outlined'
                                        label="Date of Birth"
                                        format='dd/MM/yyy'
                                        animateYearScrolling={true}
                                        invalidDateMessage='Invalid Date Format'
                                        error={errors.dob}
                                        helperText={errors.dob}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        margin='normal'
                                        id='date-picker'
                                        autoOk={true}
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        keyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                        PopoverProps={{
                                            anchorOrigin: {
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}

                                    />
                                </MuiPickersUtilsProvider>
                                {/* <TextInput
                        id="date"
                        label="Date of Birth"
                        name="dob"
                        error={errors.dob}
                        helperText={errors.dob}
                        readOnly={readOnly}
                        defaultValue={values.dob}
                        onChange={onChange}
                        InputLabelProps={{ shrink: true }}
                    /> */}
                            </Grid>
                            {modelType === 'COAPPLICANT' || modelType === 'GUARANTOR' ?
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
                                            InputLabelProps={{ shrink: true }}
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
                                    value={values.address?.toUpperCase()}
                                    error={errors.address}
                                    helperText={errors.address}
                                    onChange={onChange}
                                    rows={3}
                                    multiline={true}
                                    InputLabelProps={{ shrink: true }}
                                />
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <option value="null">Choose Marital Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </TextInput>
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
                                    InputLabelProps={{ shrink: true }}
                                ></TextInput>
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
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid {...gridItem} md={6}>
                                <Typography component="div">
                                    <Grid component="label" container alignItems="center" style={{ marginBottom: '10px', marginTop: '6px' }} spacing={2}>
                                        <Grid md={12} style={{ paddingLeft: '8px' }}>Mobile number on Whatsapp?</Grid>
                                        <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                                        <Grid>
                                            <Switch
                                                checked={state.checkedA}
                                                onChange={handleChange}
                                                name="checkedA"
                                                color="primary"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid>Yes</Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                <Typography component="div" >
                                    <Grid component="label" container style={{ marginBottom: '8px', marginTop: '6px' }} alignItems="center" spacing={2}>
                                        <Grid md={12} style={{ paddingLeft: 8, fontSize: 12 }}>Mobile number linked with AADHAR?</Grid>
                                        <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                                        <Grid>
                                            <Switch
                                                checked={state.checkedB}
                                                onChange={handleChange}
                                                color="primary"
                                                name="checkedB"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                        </Grid>
                                        <Grid>Yes</Grid>
                                    </Grid>
                                </Typography>
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
                                    InputLabelProps={{ shrink: true }}

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
                                    InputLabelProps={{ shrink: true }}

                                >
                                </TextInput>
                            </Grid>
                            <Grid md={12} style={{ marginBottom: '16px' }}>
                                <Typography variant="title">Documents </Typography>
                            </Grid>
                            <Grid {...gridItem} md={12}>
                                <Typography variant="subtitle2" component="subtitle2">
                                    Photo : {(readOnly) ?
                                        <>
                                            {data.pan_file_url ?
                                                profileAttachment()
                                                : <Typography variant="subtitle2" component="subtitle2">
                                                    <Tooltip title={'Click Edit and attach'}>
                                                        <AttachFileRoundedIcon disabled={readOnly} />
                                                    </Tooltip> Attach PAN
                                                </Typography>}
                                        </> :
                                        <>
                                            {data.profile_image_url ? profileAttachment() :
                                                <>
                                                    <TextInput
                                                        type="file"
                                                        accept="image/*"
                                                        name="pan_file_url"
                                                        value={data.profile_image_url}
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
                            <Grid {...gridItem} md={12}>
                                <Typography variant="subtitle2" component="subtitle2">
                                    PAN : {(readOnly) ?
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
                            <Grid md={12} style={{ marginBottom: '8px' }}>
                                <Typography variant="subtitle1">Aadhar </Typography>
                            </Grid>
                            <Grid {...gridItem} md={6}>
                                <Typography variant="subtitle2" component="subtitle2">
                                    Front: {(readOnly) ?
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
                                    Back: {(readOnly) ?
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
                        </>
                    </Grid>
                )
            }
        </>
    )
}

export default DealerEditForm;