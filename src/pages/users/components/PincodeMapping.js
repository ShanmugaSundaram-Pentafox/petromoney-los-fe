import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import MapPincode from './MapPincode';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { differenceBy } from 'lodash'
import { getAllCityByRegionId, getAllMappedPincode, getAllRegionByStateId, getAllUnmappedPincodeByCity, getStates } from '../../../services/common.service';
import { mapPincode } from '../../../services/users.service';
import { MultiSelect, Select } from '@mantine/core';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';

const useStyles = makeStyles(theme => ({
  passwordWrapper: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-end'
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: 16,
    fontSize: 14,
    textAlign: 'left',
    maxWidth: 600,
    minHeight: 200,
    minWidth: 600
  },
  root: {
    marginTop: 10,
    minWidth: '35vh',
    maxHeight: '35vh',
    overflowY: 'auto',
    border: '1px solid rgb(0,0,0,0.2)',
    boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
    borderRadius: 3
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
  activeBtn: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.white,
    },
    color: '#128C7E'
  },
  listItem: {
    border: '1px solid rgb(0,0,0,0.2)',
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 2,
    paddingBottom: 2,
    marginRight: 2,
    marginTop: 2
  },
  list: {
    margin: 10,
    marginRight: 20,
    width: '100%',
    maxHeight: 300,
    minHeight: '20%',
    overflowY: 'auto',
    border: '1px solid rgb(0,0,0,0.2)',
    boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
    borderRadius: 3
  },
  pincodeList: {
    paddingTop: 4,
    paddingLeft: 4,
    paddingBottom: 4
  }
}));

const ListItem = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.listItem}>
      <Typography>{data || ''}</Typography>
    </div>
  )
}

const PincodeMapping = ({ userId }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedState, setSelectedState] = useState();
  const [mappedPincode, setMappedPincode] = useState([])
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [regionfilterQry, setRegionFilterQry] = useState();
  const [cityfilterQry, setCityFilterQry] = useState();
  const [openModal, setOpenModal] = useState();

  const { data: state = [] } = useQuery(['state'], () => { return getStates() }, {
    refetchOnWindowFocus: false,
    retry: false,
    select: d => {
      const activeState = d?.filter(d => d?.is_active == 1)
      const result = activeState?.map((item) => ({
        label: item.name,
        value: item.id?.toString(),
      }));
      return result;
    }
  })

  const { data: region = [], refetch: refetchRegion } = useQuery(
    ['region', selectedState, isEdit],
    () => getAllRegionByStateId(selectedState?.value),
    {
      onSuccess: (data) => {
        if (!selectedState?.value) {
          setSelectedRegion([])
          setSelectedCity([])
        } else {
          let region = [];
          selectedRegion?.map((i) => {
            if (data.find((item) => item?.value == i?.value)) {
              region.push({
                label: i?.label,
                value: parseInt(i?.value)
              });
            }
          })
          setSelectedRegion(region?.filter((i) => i != undefined));
        }
      },
      onError: e => {
        setSelectedRegion([])
        setSelectedCity([])
      },
      refetchOnWindowFocus: false,
      enabled: selectedState ? true : false,
      retry: false,
      cacheTime: 0,
    }
  )

  const { data: city = [], refetch: refetchCity } = useQuery(
    ['city', regionfilterQry, isEdit],
    () => { return getAllCityByRegionId(regionfilterQry) },
    {
      onSuccess: (data) => {
        if (!selectedRegion?.length) {
          setSelectedCity([])
        } else {
          let city = [];
          selectedCity?.map((i) => {
            if (data.find((item) => item?.value == i?.value)) {
              city.push({
                label: i?.label,
                value: parseInt(i?.value)
              });
            }
          })
          setSelectedCity(city?.filter((i) => i != undefined));
        }
      },
      onError: e => {
        setSelectedCity([])
      },
      refetchOnWindowFocus: false,
      enabled: regionfilterQry ? true : false,
      retry: false,
      cacheTime: 0,
    }
  )

  const { data: pincode = [], refetch: refetchUnmappedPincode } = useQuery(
    ['pincode', cityfilterQry, isEdit],
    () => getAllUnmappedPincodeByCity(cityfilterQry, userId),
    {
      refetchOnWindowFocus: false,
      enabled: cityfilterQry ? true : false,
      retry: false,
      cacheTime: 0,
    }
  )

  const { data = [], refetch } = useQuery(
    ['mapped-pincode', isEdit],
    () => { return getAllMappedPincode(userId) },
    {
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: d => {
        if (d?.state) {
          setSelectedState({ label: d?.state[0]?.state_name, value: d?.state[0]?.state_id })
          setMappedPincode(d?.pincode?.map((item) => ({
            label: item?.pincode_value,
            value: item?.pincode_id,
          })))
          setSelectedRegion(d?.region?.map(item => ({
            label: item?.region_name,
            value: item?.region_id
          })))
          setSelectedCity(d?.city?.map(item => ({
            label: item?.city_name,
            value: item?.city_id
          })))
        } else {
          setMappedPincode([])
        }
      },
      onError: (e) => {
        displayNotification({
          message: e?.message || e,
          variant: 'error',
        })
        setMappedPincode([])
        refetchRegion()
        refetchCity()
      },
      cacheTime: 0,
    }
  )

  useEffect(() => {
    let qry = {}
    let regionId = []
    selectedRegion.forEach(item => regionId.push(item.value))
    qry.region = regionId.toString()
    !regionId?.length && setSelectedCity([])
    setRegionFilterQry(qry)
  }, [selectedRegion])

  useEffect(() => {
    let qry = {}
    let cityId = []
    selectedCity.forEach(item => cityId.push(item.value))
    qry.city = cityId.toString()
    setCityFilterQry(qry)
  }, [selectedCity])


  // used to handle the delete api call from mapping
  const handleSelectedValueChange = (selectedValue = [], value, name) => {
    var diff = []
    // finding the difference from selected value to current value
    differenceBy(selectedValue?.length ? [...selectedValue] : [], value?.length ? [...value] : [], 'value').forEach(item => diff.push(item?.value))
    if (diff?.length) {
      // once the difference is found then delete api will call
      mapPincode({ body: { id: [], method: 'DELETE' }, userId, [name]: diff?.toString() })
        .then((res) => {
          displayNotification({
            message: res,
            variant: 'success'
          })
          refetch();
          refetchUnmappedPincode();
        })
        .catch((err) => {
          displayNotification({
            message: err,
            variant: 'error'
          })
        })
    }
  }

  return (
    <>
      {
        !isEdit ? (
          <div style={{ marginTop: 20 }}>
            {
              (data?.state?.length > 0) &&
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>States </Typography>
                  <div style={{ display: 'flex', minWidth: '20%', justifyContent: 'flext-start', flexWrap: 'wrap' }}>
                    {
                    data?.state?.map((item, index) => {
                      return <ListItem key={index} data={item?.state_name} />
                    })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '20%', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
                    {/* <Typography variant='h6' color='primary' style={{ textDecoration: 'underline', marginLeft: 12 }}>View all</Typography> */}
                  </div>
                </div>
            }
            {
              (data?.region?.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Region</Typography>
                  <div style={{ display: 'flex', minWidth: '20%', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {
                      data?.region?.map((item, index) => {
                        return <ListItem key={index} data={item?.region_name} />
                      })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '20%', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
                    {/* <Typography variant='h6' color='primary' style={{ textDecoration: 'underline', marginLeft: 12 }}>View all</Typography> */}
                  </div>
                </div>
              )
            }
            {
              (data?.city?.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>City</Typography>
                  <div style={{ display: 'flex', minWidth: '20%', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {
                      data?.city?.map((item, index) => {
                        return <ListItem key={index} data={item?.city_name} />
                      })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '20%', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
                    {/* <Typography variant='h6' color='primary' style={{ textDecoration: 'underline', marginLeft: 12 }}>View all</Typography> */}
                  </div>
                </div>
              )
            }
            {
              (mappedPincode?.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Pincodes</Typography>
                  <div style={{ display: 'flex', maxWidth: '60%', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {
                      mappedPincode?.slice(0, 15).map((item, index) => {
                        return <ListItem key={index} data={item?.label} />
                      })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '20%', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
                    {/* <Typography variant='h6' color='primary' style={{ textDecoration: 'underline', marginLeft: 12 }}>View all</Typography> */}
                  </div>
                </div>
              )
            }
            {
              (mappedPincode.length > 0) ? (
                <div style={{ marginTop: 20, marginLeft: '20%' }}>
                  <Button variant='contained' className={classes.activeBtn} onClick={() => setIsEdit(true)}>Edit Mapping</Button>
                </div>
              ) : (
                <div style={{ marginTop: 20 }}>
                  <Button variant='contained' className={classes.activeBtn} onClick={() => setIsEdit(true)}>Map Pincode</Button>
                </div>
              )
            }
          </div>
        ) : (
          <>
            <Grid container style={{ marginTop: 20 }}>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} mb={20} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>State</Typography>
                  {/* <PinSelector isSearchable={true} width={'100%'} options={state} value={selectedState} setValue={(e) => { handleSelectedValueChange(selectedState ? [selectedState] : [], [e], 'state'); setSelectedState(e) }} isMulti={false} /> */}
                  <Select
                    w={'100%'}
                    placeholder='Select...'
                    searchable
                    data={state}
                    allowDeselect={false}
                    value={selectedState?.value?.toString()}
                    onChange={(e, option) => {
                      handleSelectedValueChange(selectedState ? [selectedState] : [], option?.value ? [{ ...option, value: parseInt(option?.value) }] : [], 'state');
                      setSelectedState({ ...option, value: parseInt(option?.value) });
                    }}
                    size='xs'
                  />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Region</Typography>
                  {/* <PinSelector width={'100%'} isSearchable={true} options={region} value={selectedRegion} setValue={(e) => { handleSelectedValueChange(selectedRegion, e, 'region'); setSelectedRegion(e) }} /> */}
                  <MultiSelect
                    w={'100%'}
                    placeholder='Select...'
                    searchable
                    clearable
                    data={region}
                    value={selectedRegion?.map((item) => item?.value?.toString())}
                    onChange={(option) => {
                      let values = option?.map((i) => region?.find(item => item?.value === i));
                      values = values?.map((item) => ({ label: item?.label, value: parseInt(item?.value) }));
                      handleSelectedValueChange(selectedRegion, values, 'region');
                      setSelectedRegion(values);
                    }}
                    size='xs'
                  />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>City</Typography>
                  {/* <PinSelector width={'100%'} isSearchable={true} options={city} value={selectedCity} setValue={(e) => { handleSelectedValueChange(selectedCity, e, 'city'); setSelectedCity(e); }} /> */}
                  <MultiSelect
                    w={'100%'}
                    placeholder='Select...'
                    searchable
                    clearable
                    data={city}
                    value={selectedCity?.map((item) => item?.value?.toString())}
                    onChange={(option) => {
                      let values = option?.map((i) => city?.find(item => item?.value === i));
                      values = values?.map((item) => ({ label: item?.label, value: parseInt(item?.value) }));
                      handleSelectedValueChange(selectedCity, values, 'city');
                      setSelectedCity(values);
                    }}
                    size='xs'
                  />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Map Pincode</Typography>
                  <div style={{ minWidth: '90%' }}>
                    <MapPincode
                      mappedData={mappedPincode || []}
                      masterData={pincode || []}
                      selectedRegion={selectedRegion}
                      userId={userId}
                      callBack={() => {
                        setIsEdit(false)
                        refetch();
                        refetchUnmappedPincode();
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className={classes.passwordWrapper}>
              <>
                <Button variant='outlined' style={{ marginRight: 4 }} onClick={() => setIsEdit(false)}>Cancel</Button>
                {/* <Button variant='contained' startIcon={<NavigateNextRoundedIcon />} className={clsx(classes.btn, classes.editButton)} onClick={() => handleSubmit()} >Map</Button> */}
              </>
            </div>
          </>
        )
      }
      <Modal
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <div className={classes.paper}>
          <div style={{ marginLeft: 10, minWidth: '20%' }}>
            <label style={{ color: 'hsl(0,0%,75%)' }}>Search by pincode</label>
            <TextInput
              number
            // value={selectedDealership?.id}
            // onChange={(e) => { setSelectedDealership({ ...selectedDealership, id: e?.target?.value }) }}
            // error={selectedDealership?.error}
            // helperText={selectedDealership?.error}
            />
          </div>
          <div className={classes.list}>
            {
              mappedPincode?.map((item, index) => {
                return (
                  <div key={index} className={classes.pincodeList}>
                    <Typography style={{ padding: 4 }} >{item.value}</Typography>
                    <Divider />
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
    </>
  )

}
export default PincodeMapping