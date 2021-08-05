import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextInput from '../../../components/TextInput/TextInput';
// import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
// import AttachmentOutlinedIcon from '@material-ui/icons/AttachmentOutlined';
// import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/Backup';
import { grey } from '@material-ui/core/colors';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import FileUpload from '../../../components/FileUpload';


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
        borderColor: 'grey',
        minWidth: 80,
        height: 50,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left'
    },
    readOnlyWrapper: {
        margin: '2px 4px',
        maxWidth: '100%',
    },

    fileStyle: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    fileAttachement: {
        display: 'flex',
        // justifyContent:'center',
        marginTop: 6
    },
    icon: {
        marginRight: 4,
        marginTop: 6,
    },
    typography: {
        marginTop: 8,
    },
    text: {
        marginBottom: 4,
        fontSize: 12,
    },
    title: {
        fontSize: 11,
    },
});
export const ViewData = ({ title, value }) => {
    const classes = useStyles()
    return (
        <Box className={classes.details}>
            <div>
                <p className={classes.title}>{title}</p>
                <strong className={classes.text}>{value ? value : '-'}</strong>
            </div>
        </Box >
    )
}


const DealerEditForm = ({ modelType, data, dealersList, handleDate, deleteFile, editableValues, readOnlyProps, values, errors, onChange, handleState, handleSave }) => {
    const readOnly = readOnlyProps;
    const classes = useStyles();
    const [showUpload, setShowUpload] = useState(false);
    const [fileType, setFileType] = useState()
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
    const docUpload = (val) => {
        setShowUpload(true)
        setFileType(val)
    }

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
            <div className={classes.fileStyle}>
                <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#eeeeee', color: '#43a047' }}
                    href={data.aadhar_b_file_url} target="_blank" title={'Aadhar Back'}>{'Back'}</a>
                <Tooltip title={'Click to edit'}>
                    <UploadIcon fontSize="small" padding={2} onClick={() => docUpload('Back')} />
                </Tooltip>
                {/* <Tooltip title={'Click to delete'}>
                    <DeleteIcon fontSize="small" padding={2} />
                </Tooltip> */}
            </div>
        )
    }
    const profileAttachment = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#eeeeee', color: '#43a047' }}
                    href={data.profile_image_url} target="_blank" title={'Profile Attachment'}>{'Profile Attachment'}</a>
                <Tooltip title={'Click to edit'}>
                    <UploadIcon fontSize="small" style={{ color: grey[800] }} padding={2} onClick={() => docUpload('Profile')} />
                </Tooltip>
                {/* <Tooltip title={'Click to delete'}>
                    <DeleteIcon fontSize="small" style={{ color: grey[800] }} padding={2} />
                </Tooltip> */}
            </div>
        )
    }

    const aadharFront = () => {
        return (
            <div className={classes.fileStyle} >
                <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#eeeeee', color: '#43a047' }}
                    href={data.aadhar_f_file_url} target="_blank" title={'Aadhar Front'}>{'Front'}</a>
                <Tooltip title={'Click to edit'}>
                    <UploadIcon fontSize="small" style={{ color: grey[800] }} padding={2} onClick={() => docUpload('Front')} />
                </Tooltip>
                {/* <Tooltip title={'Click to delete'}>
                    <DeleteIcon fontSize="small" style={{ color: grey[800] }} padding={2} />
                </Tooltip> */}
            </div>
        )
    }
    const panAttachment = () => {
        return (
            <div className={classes.fileStyle}>
                <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#eeeeee', color: '#43a047' }}
                    href={data.pan_file_url} target="_blank" title={'PAN Attachment'}>{'PAN Attachment'}</a>
                <Tooltip title={'Click to edit'}>
                    <UploadIcon fontSize="small" padding={2} style={{ color: grey[800] }} onClick={() => docUpload('PAN')} />
                </Tooltip>
                {/* <Tooltip title={'Click to delete'}>
                    <DeleteIcon fontSize="small" style={{ color: grey[800] }} padding={2} />
                </Tooltip> */}
            </div>
        )
    }
    return (
        <>
            {
                readOnly ? (
                    <Grid container spacing={2} className={classes.readOnlyWrapper}>
                        <Grid item md={6}>
                            <Box className={classes.box} >
                                <ViewData title='ID' value={values.id} />
                                <ViewData title='Date of Birth' value={values.dob} />
                                <ViewData title='Address' value={values.address} />
                                <ViewData title='Marital Status' value={values.marital_status} />
                                <ViewData title='Mobile' value={values.mobile} />
                                <ViewData title='Aadhar' value={values.aadhar} />
                            </Box>
                        </Grid>
                        <Grid item md={6}>
                            <Box className={classes.box} >
                                <ViewData title='Name' value={`${values.first_name} ${values.last_name}`} />
                                <ViewData title='Gender' value={values.gender} />
                                <ViewData title='Residing since' value={values.residing_since} />
                                <ViewData title='Email' value={values.email} />
                                <ViewData title='PAN' value={values.pan} />
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
                            <Grid {...gridItem} md={12} >
                                <Typography variant="title">Documents </Typography>
                            </Grid>
                            <Grid {...gridItem} md={3}>
                                <Typography style={{ display: 'contents' }} variant="title" >Profile</Typography>
                            </Grid>
                            <Grid {...gridItem} md={5}>
                                <>
                                    {
                                        data.profile_image_url ? profileAttachment() :
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} onClick={() => docUpload('Profile')}>
                                                <Tooltip title={'Click to attach Profile'}>
                                                    <>
                                                        <UploadIcon fontSize='small' />
                                                        <Typography style={{ marginLeft: 12 }}>Attach profile</Typography>
                                                    </>
                                                </Tooltip>
                                            </div>
                                    }
                                </>
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
                            {
                                values.pan ? (
                                    <Grid {...gridItem} md={6}>
                                        {data.pan_file_url ? panAttachment() :
                                            <div className={classes.fileAttachement} onClick={() => docUpload('PAN')}>
                                                <Tooltip title={'Click to attach PAN'}>
                                                    <>
                                                        <UploadIcon className={classes.icon} disabled={readOnly} />
                                                    </>
                                                </Tooltip>
                                            </div>
                                        }
                                    </Grid>
                                ) : null
                            }

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
                            {
                                values.aadhar ? (
                                    <>
                                        <Grid {...gridItem} md={3}>
                                            {data.aadhar_f_file_url ? aadharFront() :
                                                <div className={classes.fileAttachement} onClick={() => docUpload('Front')}>
                                                    <Tooltip title={'Click to attach aadhar front'}>
                                                        <>
                                                            <UploadIcon className={classes.icon} disabled={readOnly} />
                                                            <Typography className={classes.typography}>Front</Typography>
                                                        </>
                                                    </Tooltip>
                                                </div>
                                            }
                                        </Grid>
                                        <Grid {...gridItem} md={3}>
                                            {data.aadhar_b_file_url ?
                                                aadharBack() :
                                                <div className={classes.fileAttachement} onClick={() => docUpload('Back')}>
                                                    <Tooltip title={'Click to attach aadhar back'}>
                                                        <>
                                                            <UploadIcon className={classes.icon} disabled={readOnly} />
                                                            <Typography className={classes.typography}>Back</Typography>
                                                        </>
                                                    </Tooltip>
                                                </div>
                                            }
                                        </Grid>
                                    </>

                                ) : null
                            }
                            {
                                showUpload && <FileUpload
                                    handleSave={(value) => {
                                        handleSave(value, fileType)
                                        showUpload && setShowUpload(false);
                                    }}
                                    title='Upload Documents'
                                    open={showUpload} onCloseUploader={() => { setShowUpload(false) }} />
                            }
                        </>
                    </Grid>
                )
            }
        </>
    )
}

export default DealerEditForm;