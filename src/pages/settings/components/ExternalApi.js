import { Button, Divider, Drawer, Flex, Grid, TextInput, Textarea, Checkbox } from '@mantine/core';
import {
  Collapse,
  IconButton,
  List,
  ListSubheader,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Check, Edit } from '@material-ui/icons';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import {
  getExternalApi,
  updateExternalApi,
} from '../../../services/master.service';
import { compareObject } from '../../../utils/compareObject.util';

const formValidationSchema = Yup.object().shape({
  usage_desc: Yup.string().required('Please enter the config name'),
  api_path: Yup.string().required('Please enter the config api path'),
  base_url_prod: Yup.string().required('Please enter the config prod url'),
  base_url_uat: Yup.string().required('Please enter the config uat url'),
  group_name: Yup.string().required('Please enter group name'),
  type: Yup.string().required('Please enter config type'),
  prod_header: Yup.string().required('Please enter production header'),
  uat_header: Yup.string().required('Please enter UAT header')
})

const ExternalApi = ({ callback }) => {
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
    <>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {/* Drawer content */}

        {categories.map((category, i) => (
          <List
            key={i}
            dense
            subheader={
              <ListSubheader
                component={Paper}
                style={{
                  fontFamily: 'Inter !important',
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
                    <div key={index}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>{`${d?.usage_desc} (${d?.group_name})`}</Typography>
                        {
                          d?.is_current ?
                            <Tooltip title="In Use">
                              <Check style={{ fontSize: 13, color: '#2cae66e6', marginLeft: 20 }} />
                            </Tooltip> : null
                        }
                      </div>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
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
      </div>

      {/* Sticky footer */}
      <Flex
        h="64"
        style={{ 
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'end',
          padding: '0 16px', 
          background: '#FFFFFF', 
          borderTop: '1px solid #eaeaea', 
          zIndex: 9
        }}
      >
        <Flex gap="sm">
          <Button 
            variant="outline" 
            size="md"
            color="gray"
            onClick={() => callback(false)}
          >
            Go back
          </Button>

          <Button 
            variant="filled" 
            size="md"
            color="rgba(0, 0, 0, 1)"
            onClick={() => setAddForm({})}
          >
            Add New Config
          </Button>
        </Flex>  
      </Flex>
        
      <Drawer
        position="right"
        title={addForm?.usage_desc ?? 'Add New Config'} 
        opened={addForm}
        onClose={() => setAddForm()}
        overlayProps={{ backgroundOpacity: 0.2, blur: 2 }}
        zIndex={999999}
        styles={{
          content: {
            overflow: 'hidden',
          },
          header: {
            borderBottom: '1px solid #eaeaea', 
          },
          title: {
            fontWeight: 700,
          },
          body: {
            padding: 0,
            height: '(100%',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }}
      >
        <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>
          <Formik
            initialValues={addForm}
            validateOnChange={false}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
              values.is_current = values.is_current ? 1 : 0;
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
              <>
                <Grid gutter="sm">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput  
                      name="usage_desc"
                      label="Name"
                      value={values?.usage_desc}
                      onChange={handleChange}
                      error={errors?.usage_desc}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="api_path"
                      label="Api Path"
                      onChange={handleChange}
                      value={values?.api_path}
                      error={errors?.api_path}
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <Textarea
                      name="payload"
                      label="Payload"
                      autosize
                      minRows={2}
                      maxRows={4}
                      onChange={handleChange}
                      value={values?.payload}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="type"
                      label="Type"
                      value={values?.type}
                      onChange={handleChange}
                      error={errors?.type}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="group_name"
                      label="Group Name"
                      value={values?.group_name}
                      onChange={handleChange}
                      error={errors?.group_name}
                    />
                  </Grid.Col>

                  {/* <Grid.Col span={{ base: 12, md: 6 }}>
                    <NativeSelect 
                      label="Mode" 
                      data={[
                        { label: 'No Mode', value: '' },
                        { label: 'Basic', value: 'Basic' },
                        { label: 'Advanced', value: 'Advanced' },
                      ]}
                      value={values?.mode}
                      onChange={handleChange}
                    />
                  </Grid.Col> */}

                  <Grid.Col>                    
                    <Checkbox 
                      my="sm"
                      fw="700"
                      styles={{
                        label: {
                          color: '#495057',
                          fontSize: 14
                        }
                      }}
                      checked={values?.is_current} 
                      label="Activate Service" 
                      onChange={handleChange} 
                    />
                  </Grid.Col>

                  <Grid.Col>
                    <Divider 
                      my="xs"
                      tt="uppercase" 
                      styles={{
                        label: {
                          color: '#868E96',
                          fontSize: 14,
                          fontWeight: 700,
                        }
                      }} 
                      label="Sandbox" 
                      labelPosition="left" 
                    />
                  </Grid.Col>  

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="base_url_uat"
                      label="URL"
                      onChange={handleChange}
                      value={values?.base_url_uat}
                      error={errors?.base_url_uat}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="uat_header"
                      label="Header"
                      onChange={handleChange}
                      value={values?.uat_header}
                      error={errors?.uat_header}
                    />
                  </Grid.Col>

                  <Grid.Col>
                    <Divider 
                      my="xs" 
                      tt="uppercase"
                      styles={{
                        label: {
                          color: '#868E96',
                          fontSize: 14,
                          fontWeight: 700
                        }
                      }} 
                      label="Production" 
                      labelPosition="left" 
                    />
                  </Grid.Col>  

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="base_url_prod"
                      label="URL"
                      onChange={handleChange}
                      value={values?.base_url_prod}
                      error={errors?.base_url_prod}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      name="prod_header"
                      label="Header"
                      onChange={handleChange}
                      value={values?.prod_header}
                      error={errors?.prod_header}
                    />
                  </Grid.Col>

                  <Grid.Col mt="md" ta="right">
                    <Button
                      w="25%" 
                      variant="filled" 
                      size="md"
                      color="rgba(0, 0, 0, 1)"
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </Grid.Col>
                </Grid>
              </>
            )}
          </Formik>
        </div>
      </Drawer>
    </>
  );
};

export default ExternalApi;
