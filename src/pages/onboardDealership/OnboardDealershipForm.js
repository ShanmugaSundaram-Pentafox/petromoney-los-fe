import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from 'react-query';
import { useSnackbar } from 'notistack';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getOmcList, getAllRegions } from '../../services/common.service';
import {
  createOnboardDealership,
  validateGST,
  validatePAN
} from '../../services/onboardDealership.service';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(3),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: '#222244'
  },
  formSection: {
    marginBottom: theme.spacing(3)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontSize: 16,
    fontWeight: 600,
    color: '#222244'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ddd'
      },
      '&:hover fieldset': {
        borderColor: '#bbb'
      }
    }
  },
  selectField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ddd'
      }
    }
  },
  validationLink: {
    color: '#0066cc',
    cursor: 'pointer',
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5),
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5)
  },
  successText: {
    color: '#388e3c',
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5)
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    justifyContent: 'flex-end'
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    color: '#222244',
    border: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#eeeeee'
    }
  },
  saveButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1d4ed8'
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      color: '#999'
    }
  },
  verificationLink: {
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  detailsCard: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0'
  },
  detailsTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: '#222244',
    marginBottom: theme.spacing(2)
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1.5),
    borderBottom: '1px solid #e0e0e0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  detailLabel: {
    fontWeight: 500,
    color: '#666',
    fontSize: '0.95rem'
  },
  detailValue: {
    color: '#222244',
    fontSize: '0.95rem',
    fontWeight: 500
  },
  uploadSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#f8f9fa',
    borderRadius: 4
  },
  uploadTitle: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: theme.spacing(2),
    color: '#222244'
  },
  uploadContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap'
  },
  uploadBox: {
    flex: '1 1 200px',
    minWidth: 150,
    padding: theme.spacing(2),
    border: '2px dashed #ddd',
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#2563eb',
      backgroundColor: '#f0f4ff'
    }
  },
  uploadBoxLabel: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: theme.spacing(1),
    color: '#222244'
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1d4ed8'
    }
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400
  }
}));

const OnboardDealershipForm = ({ onSuccess, initialValues = null }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [validationStatus, setValidationStatus] = useState({
    gst: null,
    pan: null,
  });
  const [isValidating, setIsValidating] = useState({
    gst: false,
    pan: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    gst_document: null,
    pan_document: null
  });
  const [gstData, setGstData] = useState(null);

  // Fetch OMC list
  const { data: omcList = [], isLoading: omcLoading } = useQuery(
    'omcList',
    () => getOmcList(),
    { staleTime: 1000 * 60 * 5 }
  );

  // Fetch regions
  const { data: regions = [], isLoading: regionsLoading } = useQuery(
    'regions',
    () => getAllRegions('0'),
    { staleTime: 1000 * 60 * 5 }
  );

  const handleValidateGST = async (gst, setFieldError) => {
    if (!gst) return;
    setIsValidating(prev => ({ ...prev, gst: true }));
    try {
      const result = await validateGST(gst);
      setValidationStatus(prev => ({ ...prev, gst: 'valid' }));
      // Store GST data for auto-population
      setGstData(result?.data || result);
      enqueueSnackbar('GST validated successfully', { variant: 'success' });
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, gst: 'invalid' }));
      setFieldError('gst', error?.message || 'Invalid GST');
      enqueueSnackbar(error?.message || 'Invalid GST', { variant: 'error' });
    } finally {
      setIsValidating(prev => ({ ...prev, gst: false }));
    }
  };

  const handleValidatePAN = async (pan, setFieldError) => {
    if (!pan) return;
    setIsValidating(prev => ({ ...prev, pan: true }));
    try {
      const result = await validatePAN(pan);
      setValidationStatus(prev => ({ ...prev, pan: 'valid' }));
      enqueueSnackbar('PAN validated successfully', { variant: 'success' });
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, pan: 'invalid' }));
      setFieldError('pan', error?.message || 'Invalid PAN');
      enqueueSnackbar(error?.message || 'Invalid PAN', { variant: 'error' });
    } finally {
      setIsValidating(prev => ({ ...prev, pan: false }));
    }
  };

  const handleFileUpload = (fieldName, file) => {
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
      enqueueSnackbar(`${fieldName === 'gst_document' ? 'GST' : 'PAN'} document uploaded`, { variant: 'success' });
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare form data with files
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      if (gstData) {
        if (gstData.state_id) formData.append('state_id', gstData.state_id);
        if (gstData.state_name) formData.append('state_name', gstData.state_name);
        if (gstData.address) formData.append('address', gstData.address);
        if (gstData.pincode) formData.append('pincode', gstData.pincode);
        if (gstData.business_type) formData.append('business_type', gstData.business_type);
        if (gstData.legal_business_name) formData.append('legal_business_name', gstData.legal_business_name);
        if (gstData.name) formData.append('name', gstData.name);
      }

      if (uploadedFiles.gst_document) {
        formData.append('gst_document', uploadedFiles.gst_document);
      }
      if (uploadedFiles.pan_document) {
        formData.append('pan_document', uploadedFiles.pan_document);
      }

      await createOnboardDealership(formData);
      enqueueSnackbar('Dealership onboarded successfully', { variant: 'success' });
      if (onSuccess) onSuccess();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to onboard dealership', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (omcLoading || regionsLoading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h5" className={classes.title}>
          Onboard Dealership
        </Typography>

        <Formik
          initialValues={initialValues || {
            omc_id: '',
            pan: '',
            gst: '',
            dealership_id: '',
            mobile_no: '',
            omc_region: '',
          }}
          validationSchema={Yup.object().shape({
            omc_id: Yup.string().required('Please select OMC'),
            pan: Yup.string().required('PAN is required').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
            gst: Yup.string().required('GST is required').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format'),
            dealership_id: Yup.string().required('Dealership ID is required'),
            mobile_no: Yup.string().required('Mobile No is required').matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
            omc_region: Yup.string().required('Please select OMC Region'),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, setFieldError, isSubmitting, dirty }) => (
            <Form>
              {/* Step 1: Basic Input Fields */}
              <Box className={classes.formSection}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Choose OMC</Typography>
                    <Select
                      fullWidth
                      name="omc_id"
                      value={values.omc_id}
                      onChange={(e) => setFieldValue('omc_id', e.target.value)}
                      displayEmpty
                      variant="outlined"
                      className={classes.selectField}
                      error={touched.omc_id && !!errors.omc_id}
                    >
                      <MenuItem value="" disabled>
                        Select OMC
                      </MenuItem>
                      {omcList.map((omc) => (
                        <MenuItem key={omc.id} value={omc.id}>
                          {omc.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.omc_id && errors.omc_id && (
                      <Typography className={classes.errorText}>{errors.omc_id}</Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Dealership ID (OMC unique id)</Typography>
                    <TextField
                      fullWidth
                      name="dealership_id"
                      value={values.dealership_id}
                      onChange={(e) => setFieldValue('dealership_id', e.target.value)}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={touched.dealership_id && !!errors.dealership_id}
                      helperText={touched.dealership_id && errors.dealership_id}
                      placeholder="Enter Dealership ID"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>PAN</Typography>
                    <TextField
                      fullWidth
                      name="pan"
                      value={values.pan}
                      onChange={(e) => setFieldValue('pan', e.target.value.toUpperCase())}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={touched.pan && !!errors.pan}
                      placeholder="E.g., AAAAA0000A"
                    />
                    {values.pan && (
                      <Box style={{ marginTop: 6 }}>
                        <MuiLink
                          className={classes.verificationLink}
                          onClick={() => handleValidatePAN(values.pan, setFieldError)}
                        >
                          {isValidating.pan ? (
                            <>
                              <CircularProgress size={12} style={{ marginRight: 4, display: 'inline-block' }} /> Validating
                            </>
                          ) : validationStatus.pan === 'valid' ? (
                            '✓ Verified'
                          ) : (
                            'Verify PAN'
                          )}
                        </MuiLink>
                        {validationStatus.pan === 'valid' && (
                          <Typography className={classes.successText}>✓ PAN verified successfully</Typography>
                        )}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>GST</Typography>
                    <TextField
                      fullWidth
                      name="gst"
                      value={values.gst}
                      onChange={(e) => setFieldValue('gst', e.target.value.toUpperCase())}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={touched.gst && !!errors.gst}
                      placeholder="Enter GST Number"
                    />
                    {values.gst && (
                      <Box style={{ marginTop: 6 }}>
                        <MuiLink
                          className={classes.verificationLink}
                          onClick={() => handleValidateGST(values.gst, setFieldError)}
                        >
                          {isValidating.gst ? (
                            <>
                              <CircularProgress size={12} style={{ marginRight: 4, display: 'inline-block' }} /> Validating
                            </>
                          ) : validationStatus.gst === 'valid' ? (
                            '✓ Verified'
                          ) : (
                            'Verify GST'
                          )}
                        </MuiLink>
                        {validationStatus.gst === 'valid' && (
                          <Typography className={classes.successText}>✓ GST verified successfully</Typography>
                        )}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Mobile No</Typography>
                    <TextField
                      fullWidth
                      name="mobile_no"
                      value={values.mobile_no}
                      onChange={(e) => setFieldValue('mobile_no', e.target.value)}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={touched.mobile_no && !!errors.mobile_no}
                      helperText={touched.mobile_no && errors.mobile_no}
                      placeholder="Enter 10 digit mobile number"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography style={{ marginBottom: 8, fontWeight: 500 }}>OMC Region</Typography>
                    <Select
                      fullWidth
                      name="omc_region"
                      value={values.omc_region}
                      onChange={(e) => setFieldValue('omc_region', e.target.value)}
                      displayEmpty
                      variant="outlined"
                      className={classes.selectField}
                      error={touched.omc_region && !!errors.omc_region}
                    >
                      <MenuItem value="" disabled>
                        Select OMC Region
                      </MenuItem>
                      {regions.map((region) => (
                        <MenuItem key={region.id} value={region.id}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.omc_region && errors.omc_region && (
                      <Typography className={classes.errorText}>{errors.omc_region}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {/* Auto-populated fields from GST - Display only after GST validation */}
              {validationStatus.gst === 'valid' && gstData && (
                <Box className={classes.formSection}>
                  <Typography className={classes.sectionTitle} style={{ marginTop: 24 }}>Details from GST</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>State</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography>{gstData?.state_name || '-'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>District</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography>{gstData?.district || '-'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Address</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 60
                      }}>
                        <Typography>{gstData?.address || '-'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Pincode</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography>{gstData?.pincode || '-'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Business Name</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography>{gstData?.legal_business_name || gstData?.name || '-'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography style={{ marginBottom: 8, fontWeight: 500 }}>Business Type</Typography>
                      <Box style={{
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography>{gstData?.business_type || '-'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 2: Verification Details */}
              {validationStatus.pan === 'valid' && validationStatus.gst === 'valid' && (
                <Card className={classes.detailsCard}>
                  <CardContent>
                    <Typography className={classes.detailsTitle}>
                      Please verify your details
                    </Typography>
                    <Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>1. Dealership ID</Typography>
                        <Typography className={classes.detailValue}>{values.dealership_id || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>2. Name</Typography>
                        <Typography className={classes.detailValue}>{gstData?.name || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>3. Business Name</Typography>
                        <Typography className={classes.detailValue}>{gstData?.legal_business_name || gstData?.name || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>4. Business Type</Typography>
                        <Typography className={classes.detailValue}>{gstData?.business_type || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>5. Address</Typography>
                        <Typography className={classes.detailValue}>{gstData?.address || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>6. Pincode</Typography>
                        <Typography className={classes.detailValue}>{gstData?.pincode || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>7. OMC</Typography>
                        <Typography className={classes.detailValue}>
                          {omcList.find(o => o.id === values.omc_id)?.name || '-'}
                        </Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>8. State</Typography>
                        <Typography className={classes.detailValue}>{gstData?.state_name || '-'}</Typography>
                      </Box>
                      <Box className={classes.detailRow}>
                        <Typography className={classes.detailLabel}>9. Region</Typography>
                        <Typography className={classes.detailValue}>
                          {regions.find(r => r.id === values.omc_region)?.name || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Document Uploads */}
              {validationStatus.pan === 'valid' && validationStatus.gst === 'valid' && (
                <Box className={classes.uploadSection}>
                  <Typography className={classes.uploadTitle}>Attachments</Typography>
                  <Box className={classes.uploadContainer}>
                    <Box className={classes.uploadBox}>
                      <Typography className={classes.uploadBoxLabel}>GST Document</Typography>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        id="gst-upload"
                        onChange={(e) => handleFileUpload('gst_document', e.target.files?.[0])}
                      />
                      <label htmlFor="gst-upload" style={{ display: 'block' }}>
                        <Button
                          component="span"
                          variant="outlined"
                          color="primary"
                          className={classes.uploadButton}
                          style={{ marginTop: 8 }}
                        >
                          Upload
                        </Button>
                      </label>
                      {uploadedFiles.gst_document && (
                        <Typography style={{ fontSize: 12, marginTop: 8, color: '#388e3c' }}>
                          ✓ {uploadedFiles.gst_document.name}
                        </Typography>
                      )}
                    </Box>

                    <Box className={classes.uploadBox}>
                      <Typography className={classes.uploadBoxLabel}>PAN Document</Typography>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        id="pan-upload"
                        onChange={(e) => handleFileUpload('pan_document', e.target.files?.[0])}
                      />
                      <label htmlFor="pan-upload" style={{ display: 'block' }}>
                        <Button
                          component="span"
                          variant="outlined"
                          color="primary"
                          className={classes.uploadButton}
                          style={{ marginTop: 8 }}
                        >
                          Upload
                        </Button>
                      </label>
                      {uploadedFiles.pan_document && (
                        <Typography style={{ fontSize: 12, marginTop: 8, color: '#388e3c' }}>
                          ✓ {uploadedFiles.pan_document.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box className={classes.buttonGroup}>
                <Button
                  variant="outlined"
                  className={classes.cancelButton}
                  onClick={() => window.history.back()}
                >
                  Go back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.saveButton}
                  disabled={isSubmitting || validationStatus.pan !== 'valid' || validationStatus.gst !== 'valid'}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={18} style={{ marginRight: 8 }} /> Saving
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default OnboardDealershipForm;
