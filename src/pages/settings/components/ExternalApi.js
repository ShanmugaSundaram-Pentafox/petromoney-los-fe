import {
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListSubheader,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Check, Edit } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import TextInput from '../../../components/TextInput/TextInput';
import {
  getExternalApi,
  updateExternalApi,
} from '../../../services/master.service';
import { compareObject } from '../../../utils/compareObject.util';

const formValidationSchema = Yup.object().shape({
  usage_desc: Yup.string().required('Please enter the config name'),
  api_path: Yup.string().required('Please enter the config api path'),
  base_url_prod: Yup.string().required('Please enter the config prod url'),
  base_url_uat: Yup.string().required('Please enter the config uat url')
})

const useStyles = makeStyles(() => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  root: {
    minWidth: '36vw',
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    height: '100%',
    borderRadius: 5,
    overflow: 'auto',
  },
  sidePanelTitle: {
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 9,
    margin: '0px 10px',
    borderBottom: '1px solid hsl(0,0%,90%)',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'hsl(0,0%,96%)',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px 0 16px',
  },
  addForm: {
    margin: 10,
    padding: 17,
    position: 'relative',
    borderRadius: 6,
    boxShadow:
      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
}));

const ExternalApi = ({ callback }) => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState([]);
  const [addForm, setAddForm] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { data: externalApiData = [] } = useQuery(
    ['external-api'],
    () => getExternalApi(),
    { refetchOnWindowFocus: false }
  );

  const handleCollapse = (category) => {
    if (collapsed.includes(category)) {
      setCollapsed(collapsed.filter((c) => c !== category));
    } else {
      setCollapsed([...collapsed, category]);
    }
  };

  const categories = [...new Set(externalApiData?.map((d) => d?.type))];

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>External APIs</div>
        <IconButton onClick={() => callback(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Typography>
      <Paper className={classes.root}>
        {categories.map((category, i) => (
          <List
            key={i}
            dense
            subheader={
              <ListSubheader
                component={Paper}
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: '#FFF',
                }}
                onClick={() => handleCollapse(category)}
              >
                {category}
              </ListSubheader>
            }
          >
            <Collapse in={!collapsed.includes(category)}>
              {externalApiData?.map(
                (d, index) =>
                  d?.type === category && (
                    <div className={classes.label} key={index}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography>{`${d?.usage_desc} (${d?.group_name})`}</Typography>
                        {
                          d?.is_current &&
                            <Tooltip title="In Use">
                              <Check style={{fontSize: 13, color: '#2cae66e6', marginLeft: 20}} />
                            </Tooltip>
                        }
                      </div>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          className={classes.btn}
                          onClick={() => setAddForm(d)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
              )}
            </Collapse>
          </List>
        ))}
      </Paper>
      {addForm && (
        <div className={classes.addForm}>
          <div
            style={{
              marginTop: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">{addForm?.usage_desc}</Typography>
            <IconButton onClick={() => setAddForm()} size="small">
              <CloseIcon />
            </IconButton>
          </div>
          <Formik
            initialValues={addForm}
            validateOnChange={false}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
              console.log(values, '-=-=-=>:');
              let body = addForm?.usage_desc ? compareObject(addForm, values) : values;
              updateExternalApi(body, values?.id)
                .then((data) => {
                  callback(false);
                  enqueueSnackbar(data, {
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                    variant: 'success',
                  });
                })
                .catch((e) => console.log(e));
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
            }) => (
              <Grid
                container
                spacing={2}
                style={{ marginTop: 12, maxWidth: '38vw' }}
              >
                <Grid item md={6}>
                  <TextInput
                    name="usage_desc"
                    label="Name"
                    value={values?.usage_desc}
                    onChange={handleChange}
                    error={errors?.usage_desc}
                    helperText={errors?.usage_desc}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="api_path"
                    label="Api Path"
                    onChange={handleChange}
                    value={values?.api_path}
                    error={errors?.api_path}
                    helperText={errors?.api_path}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="base_url_prod"
                    label="Prod URL"
                    onChange={handleChange}
                    value={values?.base_url_prod}
                    error={errors?.base_url_prod}
                    helperText={errors?.base_url_prod}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="base_url_uat"
                    label="UAT URL"
                    onChange={handleChange}
                    value={values?.base_url_uat}
                    error={errors?.base_url_uat}
                    helperText={errors?.base_url_uat}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextInput
                    name="payload"
                    label="Payload"
                    multiline
                    rows={4}
                    onChange={handleChange}
                    value={values?.payload}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="prod_header"
                    label="Prod Header"
                    onChange={handleChange}
                    value={values?.prod_header}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="uat_header"
                    label="UAT Header"
                    onChange={handleChange}
                    value={values?.uat_header}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    name="type"
                    label="Type"
                    value={values?.type}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    select
                    name="mode"
                    label="Mode"
                    value={values?.mode}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  >
                    <option value="">No Mode</option>
                    <option value="basic">Basic</option>
                    <option value="advanced">Advanced</option>
                  </TextInput>
                </Grid>
                <Grid
                  item
                  md={12}
                  style={{ justifyContent: 'flex-end', display: 'flex' }}
                >
                  <Button
                    style={{ color: '#1EAE98', borderColor: '#1EAE98' }}
                    variant="outlined"
                    size="small"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            )}
          </Formik>
        </div>
      )}
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={() => callback(false)}
            >
              Back
            </Button>
          </div>
          {/* <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.productsAdd}> */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon  />}
            onClick={() => setAddForm({})}
            style={{ marginBottom: 12 }}
          >
            Add New Config
          </Button>
          {/* </CheckAllowed> */}
        </div>
      </div>
    </div>
  );
};

export default ExternalApi;
