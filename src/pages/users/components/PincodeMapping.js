import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../../../components/CommonComponents/Button/Button';
import { PincodeSelector, Selector } from '../../../components/CommonComponents/FilterCard';
import TextInput from '../../../components/TextInput/TextInput';
import { getAllCityByRegionId, getAllMappedPincode, getAllPincodeByCityId, getAllRegionByStateId, getStates } from '../../../services/common.service';
import { mapPincode } from '../../../services/users.service';

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
  const [isEdit, setIsEdit] = useState(false);
  const [selectedState, setSelectedState] = useState();
  const [mappedPincode, setMappedPincode] = useState([])
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState([]);
  const [regionfilterQry, setRegionFilterQry] = useState();
  const [cityfilterQry, setCityFilterQry] = useState();
  const [selectAll, setSelectAll] = useState(true);
  const [openModal, setOpenModal] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { data = [], refetch } = useQuery(['mapped-pincode'], () => { return getAllMappedPincode(userId) },
    {
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: d => {
        setSelectedState({ label: d?.state[0]?.state_name, value: d?.state[0]?.state_id })
        setMappedPincode(d?.pincode?.map((item) => ({
          label: item?.pincode_value,
          value: item?.pincode_id,
        })))
        setSelectedPincode(d?.pincode?.map((item) => ({
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
      }
    })
  const { data: state = [] } = useQuery(['state'], () => { return getStates() }, {
    refetchOnWindowFocus: false,
    retry: false,
    select: d => {
      const activeState = d?.filter(d => d?.is_active == 1)
      const result = activeState?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return result;
    }
  })
  const { data: region = [] } = useQuery(['region', selectedState], () => getAllRegionByStateId(selectedState?.value), {
    refetchOnWindowFocus: false,
    enabled: selectedState ? true : false,
    retry: false
  })
  const { data: city = [] } = useQuery(['city', regionfilterQry], () => { return getAllCityByRegionId(regionfilterQry) },
    {
      refetchOnWindowFocus: false,
      enabled: regionfilterQry ? true : false,
      retry: false
    })
  const { data: pincode = [] } = useQuery(['pincode', cityfilterQry], () => { return getAllPincodeByCityId(cityfilterQry) },
    {
      refetchOnWindowFocus: false,
      enabled: cityfilterQry ? true : false,
      retry: false,
      onSuccess: d => {
        if (mappedPincode.length > 0) {
          setSelectedPincode(mappedPincode)
        }
        else {
          setSelectedPincode(d)
        }
      }
    })



  const handleSubmit = () => {
    let reqBody = {}
    if (mappedPincode?.length > selectedPincode?.length) {
      let removeItem = mappedPincode.filter((element) => !selectedPincode.includes(element));
      reqBody = {
        id: removeItem?.map(item => item.value),
        method: 'DELETE'
      }
    }
    else {
      let resultArray = selectedPincode?.map((item) => ({
        city: item?.city,
        pincode: item.value,
      }));
      reqBody = {
        user_id: userId,
        mapping: resultArray,
        method:'POST'
      }
    }
    
    mapPincode(reqBody)
      .then((res) => {
        setIsEdit(false)
        refetch();
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'red',
        })
      })
  }

  useEffect(() => {
    let qry = {}
    let regionId = []
    selectedRegion.forEach(item => regionId.push(item.value))
    qry.region = regionId.toString()
    setRegionFilterQry(qry)
  }, [selectedRegion])

  useEffect(() => {
    let qry = {}
    let cityId = []
    selectedCity.forEach(item => cityId.push(item.value))
    qry.city = cityId.toString()
    setCityFilterQry(qry)
  }, [selectedCity])

  const handleChange = (selectedItem) => {
    /** 
     * let array1 = ['pentafox','madhu','shidiq','sudharsanan','mohan']
     * let array2= ['pentafox','madhu','sudharsanan']
     * store the element of array1 in new array named array3 if the elements of array1 is not present in array2
     * 
     */
  }
  return (
    <>
      {
        !isEdit ? (
          <div style={{ marginTop: 20 }}>
            {
              (mappedPincode?.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Pincodes</Typography>
                  <div style={{ display: 'flex', minWidth: '20%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    {
                      mappedPincode?.slice(0, 15).map((item, index) => {
                        return <ListItem key={index} data={item?.label} />
                      })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '20%', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
                    <Typography variant='h6' color='primary' style={{ textDecoration: 'underline', marginLeft: 12 }}>View all</Typography>
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
                  <Selector width={'100%'} options={state} value={selectedState} setValue={setSelectedState} isMulti={false} />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Region</Typography>
                  <Selector width={'100%'} options={region} value={selectedRegion} setValue={setSelectedRegion} />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>City</Typography>
                  <Selector width={'100%'} options={city} value={selectedCity} setValue={setSelectedCity} />
                </div>
              </Grid>
              <Grid item style={{ marginBottom: 20, marginRight: 20 }} md={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' component='h5' style={{ minWidth: '20%', color: 'rgb(0,0,0,0.5)' }}>Map Pincode</Typography>
                  <div style={{ minWidth: '80%' }}>
                    <PincodeSelector
                      isMulti
                      isSearchable
                      isClearable
                      width={'100%'}
                      selectAll={selectAll}
                      options={pincode}
                      setSelectAll={setSelectAll}
                      placeholder="Select pincode"
                      value={selectedPincode}
                      setValue={setSelectedPincode}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className={classes.passwordWrapper}>
              <>
                <Button variant='outlined' style={{ marginRight: 4 }} onClick={() => setIsEdit(false)}>Cancel</Button>
                <Button variant='contained' startIcon={<NavigateNextRoundedIcon />} className={clsx(classes.btn, classes.editButton)} onClick={() => handleSubmit()} >Map</Button>
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
                  <div key={index}  className={classes.pincodeList}>
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