import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { FieldArray, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import * as Yup from 'yup';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import { ViewData } from '../../components/CommonComponents/FilePreview';
import TextInput from '../../components/TextInput/TextInput';
import {
  AddActionsToResource,
  createNewResource,
  getRbacResources,
} from '../../services/rbac.service';

const init = {
  actions: [
    {
      allowed_roles: [],
      action: '',
      description: '',
    },
  ],
};

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '45vw',
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

const CreateResourceForm = ({ roles, close }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [resourceType, setResourceType] = useState();
  const [savedResource, setSavedResource] = useState();
  const [initialValues, setInitialValues] = useState(init);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (resourceType === 'API') {
      setInitialValues({
        actions: [
          {
            allowed_roles: ['ADMIN'],
            action: 'read',
            description: 'This is read',
          },
          {
            allowed_roles: ['ADMIN'],
            action: 'edit',
            description: 'This is Edit',
          },
          {
            allowed_roles: ['ADMIN'],
            action: 'delete',
            description: 'This is Delete',
          },
        ],
      });
    } else {
      setInitialValues(init);
    }
  }, [resourceType]);

  const { data: resources = [] } = useQuery(
    ['rbac-resources', resourceType],
    () => getRbacResources(resourceType),
    { refetchOnWindowFocus: false }
  );

  const updatedArray = roles?.map((role) => ({
    ...role,
    label: role?.role_name,
    value: role?.role_name,
  }));

  const updatedResourceArray = resources?.map((resource) => ({
    ...resource,
    label: resource?.resource,
    value: resource?.resource,
  }));

  const handleCreateActions = (values) => {
    const body = {
      resource_name: savedResource?.resource,
      ...values,
    };

    AddActionsToResource(body, savedResource?.id)
      .then((res) => {
        queryClient.invalidateQueries('rbac-access');
        close();
      })
      .catch((err) => console.log(err));
  };

  const getExistingResourceData = (opt) => {
    getRbacResources(resourceType, opt.id)
      .then((resp) => {
        setSavedResource(resp?.[0]);
      })
      .catch((e) => console.log(e));
  };

  const { errors, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      const body = {
        type: resourceType,
        resources: [values],
      };
      createNewResource(body)
        .then((res) => {
          setLoading(false);
          queryClient.invalidateQueries('rbac-resources');
          getRbacResources(resourceType, res)
            .then((resp) => {
              setSavedResource(resp?.[0]);
            })
            .catch((e) => console.log(e));
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    },
    validationSchema: Yup.object().shape({
      resource: Yup.string().nullable().required('Enter Resource name'),
      description: Yup.string()
        .nullable()
        .required('Enter Resource description'),
    }),
    defaultValues: {},
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Create New Resource</div>
        <IconButton size="small" onClick={close}>
          <CloseIcon />
        </IconButton>
      </Typography>
      <Grid container spacing={2} style={{ padding: 20 }}>
        <Grid item xs={9}>
          <Grid item md={6}>
            <TextInput
              select
              label="Resource Type"
              name="resourceType"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setResourceType(e.target.value)}
            >
              <option value="">Select Resource Type</option>
              <option value="MDM">UI Resource</option>
              <option value="API">API Resource</option>
            </TextInput>
          </Grid>
        </Grid>
        {resourceType && (
          <>
            <Grid item md={6}>
              {savedResource ? (
                <ViewData
                  title="Resource Name"
                  value={savedResource?.resource}
                />
              ) : (
                <CreatableSelect
                  name="resource"
                  label="Resource Name"
                  options={updatedResourceArray}
                  onChange={(option) => {
                    if (updatedResourceArray.includes(option)) {
                      getExistingResourceData(option);
                    } else {
                      setFieldValue('resource', option?.value);
                    }
                  }}
                />
              )}
            </Grid>
            <Grid item md={6}>
              {savedResource ? (
                <ViewData
                  title="Resource Description"
                  value={savedResource?.description}
                />
              ) : (
                <TextInput
                  label="Resource Description"
                  name="description"
                  error={errors.description}
                  helperText={errors.description}
                  onChange={handleChange}
                />
              )}
            </Grid>
            {!savedResource && (
              <Grid item md={6}>
                <LoaderButton
                  variant="contained"
                  className={classes.editButton}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  loadingText="Creating..."
                >
                  Create Resource
                </LoaderButton>
              </Grid>
            )}
            {savedResource && (
              <Grid item md={12}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values) => handleCreateActions(values)}
                >
                  {({ values, handleChange, handleSubmit, setFieldValue }) => (
                    <>
                      {resourceType === 'MDM' ? (
                        <FieldArray name="actions">
                          {({ insert, remove, push }) => (
                            <>
                              {values.actions.length > 0 &&
                                values.actions.map((action, index) => (
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{ marginTop: 12 }}
                                    key={index}
                                  >
                                    <Grid item md={6}>
                                      <TextInput
                                        label="Action Name"
                                        name={`actions.${index}.action`}
                                        onChange={handleChange}
                                      />
                                    </Grid>
                                    <Grid item md={6}>
                                      <TextInput
                                        label="Action Description"
                                        name={`actions.${index}.description`}
                                        onChange={handleChange}
                                      />
                                    </Grid>
                                    <Grid item md={9}>
                                      <Select
                                        name={`actions.${index}.allowed_roles`}
                                        onChange={(option) =>
                                          setFieldValue(
                                            `actions[${index}].allowed_roles`,
                                            option.map((item) => item.value)
                                          )
                                        }
                                        isMulti
                                        options={updatedArray}
                                        closeMenuOnSelect={false}
                                      />
                                    </Grid>
                                    <Grid>
                                      <IconButton
                                        onClick={() =>
                                          push({
                                            allowed_roles: [],
                                            action: '',
                                            description: '',
                                          })
                                        }
                                      >
                                        <Add style={{ color: 'green' }} />
                                      </IconButton>
                                      {values.actions.length > 1 && (
                                        <IconButton
                                          onClick={() => remove(index)}
                                        >
                                          <CloseIcon color="error" />
                                        </IconButton>
                                      )}
                                    </Grid>
                                  </Grid>
                                ))}
                            </>
                          )}
                        </FieldArray>
                      ) : (
                        <>
                          {['read', 'edit', 'delete'].map((action, index) => (
                            <Grid item md={9} style={{ marginTop: 16 }} key={index}>
                              <label>
                                {action.charAt(0).toUpperCase() +
                                  action.slice(1)}{' '}
                                Access
                              </label>
                              <Select
                                name="read"
                                onChange={(option) => {
                                  setFieldValue(
                                    `actions[${index}].allowed_roles`,
                                    option.map((item) => item.value)
                                  );
                                  setFieldValue(
                                    `actions[${index}].action`,
                                    action
                                  );
                                  setFieldValue(
                                    `actions[${index}].description`,
                                    `This is ${action}`
                                  );
                                }}
                                isMulti
                                options={updatedArray}
                                closeMenuOnSelect={false}
                              />
                            </Grid>
                          ))}
                        </>
                      )}
                      <div
                        style={{
                          marginTop: 18,
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          className={classes.editButton}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </Formik>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </div>
  );
};

export default CreateResourceForm;
