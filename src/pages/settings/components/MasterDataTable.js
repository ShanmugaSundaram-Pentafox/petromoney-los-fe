import { Flex, Text, ActionIcon, Divider, Tooltip, Input } from '@mantine/core';
import { Grid, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useMount } from 'react-use';
import TransferList from '../../../components/CommonComponents/TransferList';
import { Button } from '../../../components/Mantine/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { logger } from '../../../config/logger';
import {
  addAssetType,
  addBusinessType,
  addLoanType,
  addOmcs,
  addRegion,
  addState,
  deleteAsset,
  deleteBusiness,
  deleteLoan,
  deleteOmcs,
  deleteRegion,
  deleteState,
  getActiveStates,
  getAllRegion,
  getAssetType,
  getBusinessTypes,
  getLoanTypes,
  getOmcList,
  getStates,
  updateAssetById,
  updateBusinessById,
  updateLoanById,
  updateOmcsById,
  updateRegionById,
  updateStateById,
} from '../../../services/common.service';
import { getStatesMapById, getUnmappedRegions, updateRegionMapById } from '../../../services/master.service';
import { IconPlus } from '@tabler/icons-react';

const useStyles = makeStyles((theme) => ({
  // sidePanelTitle: {
  //   padding: '12px 16px',
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   zIndex: 0,
  //   boxShadow: '0 1px 4px -3px #333',
  // },
  // root: {
  //   minWidth: '35vw',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   padding: 10,
  //   margin: 10,
  //   height: '100%',
  //   borderRadius: 5,
  //   overflow: 'hidden'
  // },
  // rooting: {
  //   position: 'absolute',
  // },
  // backdrop: {
  //   position: 'absolute',
  // },
  // title: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   width: '100%',
  //   justifyContent: 'space-between',
  //   position: 'sticky',
  // },
  // section: {
  //   marginTop: 10,
  //   overflowY: 'auto',
  // },
  // label: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   padding: 6,
  //   alignItems: 'center',
  //   '&:hover': {
  //     backgroundColor: '#EEEEEE',
  //     '& $btn': {
  //       visibility: 'visible',
  //     },
  //   },
  // },
  // divider: {
  //   backgroundColor: '#EEEEEE',
  // },
  // drawer: {
  //   position: 'absolute',
  // },
  // btn: {
  //   visibility: 'hidden',
  //   color: '#687980',
  // },
  // nodata: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   height: 380,
  //   alignItems: 'center',
  // },
  // editButton: {
  //   marginRight: '8px',
  //   '&.MuiButton-contained': {
  //     backgroundColor: theme.palette.success.main,
  //     color: theme.palette.white
  //   },
  //   '&.MuiButton-contained:hover': {
  //     backgroundColor: theme.palette.success.dark
  //   }
  // },
  // actionButtonsWrapper: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   padding: '12px 16px'
  // },
  // addForm: {
  //   margin: 10,
  //   padding: 25,
  //   borderRadius: 6,
  //   boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  // },
  // formFooter: {
  //   display: 'flex',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   marginTop: 10
  // },
  // listBtn: {
  //   marginTop: 18,
  // },

  // btns: {
  //   width: 25,
  //   marginLeft: 10,
  //   backgroundColor: 'white',
  //   border: '1px solid #C8C6C6',
  //   borderRadius: 2,
  //   cursor: 'pointer',
  //   fontSize: '1rem',
  //   '&:hover': {
  //     border: '1px solid #212121'
  //   }
  // },

  // deleteBtn: {
  //   width: 25,
  //   marginLeft: 10,
  //   backgroundColor: 'white',
  //   border: '1px solid #FF7878',
  //   borderRadius: 2,
  //   cursor: 'pointer',
  //   color: '#FF5C58',
  //   fontSize: '1rem',
  //   '&:hover': {
  //     border: '1px solid #FF5C58'
  //   }
  // },

}));

function Contain({ title, setStateBtn, regionForm, assetForm, callback }) {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [rowData, setRowData] = useState();
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [status, setStatus] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [AddData, setAddData] = useState();
  const [openDeactiveForm, setOpenDeactiveForm] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const [openRegionForm, setOpenRegionForm] = useState(false);
  const [openAssetForm, setOpenAssetForm] = useState(false);
  const [assetValue, setAssetValue] = useState([{ label: '', type: '' }]);
  const [states, setStates] = useState();
  const [selectedItem, setSelectedItem] = useState([])
  const { enqueueSnackbar } = useSnackbar();

  const updateMapping = (action) => {
    let body = { region_id: selectedItem }
    updateRegionMapById(rowData?.id, body, action)
      .then(res => {
        setSelectedItem([])
        queryClient.invalidateQueries('mapped')
        queryClient.invalidateQueries('unmapped')
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch(e => logger(e))
  }

  useMount(() => {
    if (title === 'OMCs') {
      getOmcList()
        .then(setData)
        .catch((e) => {
          console.log(e)
        });
    } else if (title === 'Region') {
      getAllRegion()
        .then(setData)
        .catch((e) => {
          console.log(e)
        });
      getActiveStates()
        .then(setStates)
        .catch((e) => {
          console.log(e)
        })
    } else if (title === 'State') {
      getStates()
        .then(setData)
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
    } else if (title === 'Business Type') {
      getBusinessTypes()
        .then(setData)
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
    } else if (title === 'Loan Type') {
      getLoanTypes()
        .then(setData)
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
    } else if (title === 'Asset Type') {
      getAssetType()
        .then(setData)
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
    }
  })


  const handleClose = () => {
    setOpenEditForm(false);
    setOpenDeleteForm(false);
    setOpenAddForm(false);
    setOpenDeactiveForm(false);
    setOpenRegionForm(false);
    setOpenAssetForm(false);
  };

  const handleStateDeactivate = () => {
    const test = { is_active: 0 }
    updateStateById(test, deactivateId)
      .then((res) => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const filteredData = data?.filter((item) =>
    item.name?.toUpperCase().includes(value?.toUpperCase())
  );
  const editItem = (item, title) => {
    setRowData(item);
    setStatus(title);
    title === 'Asset Type' && setAssetValue(JSON.parse(item.details))
  };

  const deleteItem = (item, title) => {
    setRowData(item);
    setStatus(title);
  };

  const DeactivateItem = (id) => {
    setDeactivateId(id);
  }

  const handleChange = (event) => {
    setRowData({
      ...rowData,
      name: event.target.value.toUpperCase(),
    });
  };

  const handleInputChange = (e, index) => {
    const { id, value } = e.target;
    const list = [...assetValue];
    list[index][id] = value;
    setAssetValue(list)
  }

  const handleRemoveClick = index => {
    // console.log(index);
    const list = [...assetValue]
    list.splice(index, 1)
    setAssetValue(list)
  }

  const handleAddClick = () => {
    setAssetValue([...assetValue, { label: '', type: '' }]);
  }

  const handleAdd = (event) => {
    setAddData({ ...AddData, name: event.target.value.toUpperCase() })
  }

  const handleStateAdd = (event) => {
    setAddData({ ...AddData, state_id: parseInt(event.target.value) })
  }

  const handleSubmit = () => {
    console.log('updating...');
    if (status === 'OMCs') {
      updateOmcsById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Region') {
      updateRegionById(rowData, rowData.region)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'State') {
      updateStateById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }

    if (status === 'Business Type') {
      updateBusinessById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }

    if (status === 'Asset Type') {
      const AssetUpdateData = { name: rowData?.name, details: assetValue }
      updateAssetById(AssetUpdateData, rowData.asset_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }

    if (status === 'Loan Type') {
      updateLoanById(rowData, rowData.loan_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
  };

  const submitAdd = () => {
    if (AddData) {
      if (status === 'OMCs') {
        addOmcs(AddData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }
      if (status === 'Region') {
        addRegion(AddData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }
      if (status === 'State') {
        addState(AddData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }
      if (status === 'Business Type') {
        addBusinessType(AddData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }

      if (status === 'Loan Type') {
        addLoanType(AddData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }

      if (status === 'Asset Type') {
        const assetData = { name: AddData.name, details: assetValue }
        addAssetType(assetData)
          .then((res) => {
            handleClose()
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }
    }
  }

  const handleDelete = () => {
    if (status === 'OMCs') {
      deleteOmcs(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Region') {
      deleteRegion(rowData, rowData.region)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'State') {
      deleteState(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Asset Type') {
      deleteAsset(rowData, rowData.asset_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Loan Type') {
      deleteLoan(rowData, rowData.loan_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Business Type') {
      deleteBusiness(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
  }

  return (
    <>
      {/* Drawer content */}
      <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>
        <form noValidate autoComplete='off'>
          <Input
            leftSectionPointerEvents="none"
            leftSection={
              <svg style={{ fill: '#CED4DA', width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            }
            id="search"
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>

        <Flex mt="md" direction="column">
          {value ? (
            filteredData.length > 0 ? (
              filteredData.map((item) => {
                return (
                  <>
                    <Flex
                      justify="space-between"
                      align="center"
                      py="6"
                    >
                      <Text>{item.name}</Text>

                      <Flex align="center" gap="4">
                        <ActionIcon
                          variant="transparent"
                          aria-label="Edit"
                          onClick={() => {
                            handleClose()
                            { title === 'Asset Type' ? setOpenAssetForm(true) : setOpenEditForm(true) }
                            editItem(item, title);
                          }}
                        >
                          <svg style={{ fill: '#868E96', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </ActionIcon>

                        {setStateBtn && item.is_active ? (
                          <Tooltip fz="xs" px="8" py="2.5" zIndex={99999} offset={2} label="Deactivate">
                            <ActionIcon
                              variant="transparent"
                              aria-label="Deactivate"
                              onClick={() => {
                                handleClose()
                                setOpenDeactiveForm(true);
                                DeactivateItem(item.id)
                              }}
                            >
                              <svg style={{ fill: '#868E96', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </ActionIcon>
                          </Tooltip>
                        ) : (
                          <Tooltip fz="xs" px="8" py="2.5" zIndex={99999} offset={2} label="Activate">
                            <ActionIcon
                              variant="transparent"
                              aria-label="Activate"
                              onClick={() => {
                                const test = { is_active: 1 }
                                updateStateById(test, item.id)
                                  .then((res) => {
                                    enqueueSnackbar(res, {
                                      anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                                      variant: 'success',
                                    })
                                    setTimeout(() => {
                                      window.location.reload(false);
                                    }, 1500);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }}
                            >
                              <svg style={{ fill: '#ADB5BD', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                              </svg>
                            </ActionIcon>
                          </Tooltip>
                        )}

                        <ActionIcon
                          variant="transparent"
                          aria-label="Delete"
                          onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}
                        >
                          <svg style={{ fill: '#FF6B6B', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </ActionIcon>
                      </Flex>
                    </Flex>

                    <Divider color="#E9ECEF" />
                  </>
                );
              })
            ) : (
              <>
                <div className={classes.nodata}>
                  <Typography variant='h6'>No Data Found</Typography>

                  <div>
                    <Button
                      variant='outlined'
                      size='small'
                      color='primary'
                      style={{ marginTop: 15 }}
                      onClick={() => {
                        if (title === 'Region') {
                          handleClose()
                          setOpenRegionForm(true)
                          setStatus(title)
                        } else {
                          handleClose()
                          setOpenAddForm(true);
                          setStatus(title)
                        }
                      }}
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </>
            )
          ) : (
            data.map((item) => {
              return (
                <>
                  <Flex
                    key={item.id ? item.id : item.region}
                    justify="space-between"
                    align="center"
                    py="6"
                    styles={{
                      backgroundColor: 'red',
                      '&:hover': {
                        backgroundColor: '#000'
                      }
                    }}
                  >
                    <Text>{item.name}</Text>

                    <Flex align="center" gap="4">
                      <ActionIcon
                        variant="transparent"
                        aria-label="Edit"
                        onClick={() => {
                          handleClose()
                          { title === 'Asset Type' ? setOpenAssetForm(true) : setOpenEditForm(true) }
                          editItem(item, title);
                        }}
                      >
                        <svg style={{ fill: '#868E96', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </ActionIcon>

                      {setStateBtn && item.is_active ? (
                        <Tooltip fz="xs" px="8" py="2.5" zIndex={99999} offset={2} label="Deactivate">
                          <ActionIcon
                            variant="transparent"
                            aria-label="Deactivate"
                            onClick={() => {
                              handleClose()
                              setOpenDeactiveForm(true);
                              DeactivateItem(item.id)
                            }}
                          >
                            <svg style={{ fill: '#868E96', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </ActionIcon>
                        </Tooltip>
                      ) : (
                        <Tooltip fz="xs" px="8" py="2.5" zIndex={99999} offset={2} label="Activate">
                          <ActionIcon
                            variant="transparent"
                            aria-label="Activate"
                            onClick={() => {
                              const test = { is_active: 1 }
                              updateStateById(test, item.id)
                                .then((res) => {
                                  enqueueSnackbar(res, {
                                    anchorOrigin: {
                                      vertical: 'top',
                                      horizontal: 'right',
                                    },
                                    variant: 'success',
                                  })
                                  setTimeout(() => {
                                    window.location.reload(false);
                                  }, 1500);
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}
                          >
                            <svg style={{ fill: '#ADB5BD', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          </ActionIcon>
                        </Tooltip>
                      )}

                      <ActionIcon
                        variant="transparent"
                        aria-label="Delete"
                        onClick={() => {
                          handleClose()
                          setOpenDeleteForm(true);
                          deleteItem(item, title);
                        }}
                      >
                        <svg style={{ fill: '#FF6B6B', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </ActionIcon>
                    </Flex>
                  </Flex>

                  <Divider color="#E9ECEF" />
                </>
              );
            })
          )}
        </Flex>
      </div>

      {
        openAddForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add {title}</Typography>
            <Grid item md={12} style={{ marginTop: 15 }}>
              <label>{title}</label>
              <TextField
                id='add'
                style={{ marginTop: 8 }}
                variant='outlined'
                fullWidth
                value={AddData?.name}
                onChange={handleAdd}
              />
            </Grid>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                size={'compact-md'}
                variant='outline'
              >
                Cancel
              </Button>
              <Button
                onClick={submitAdd}
                size={'compact-md'}
                leftSection={<IconPlus size={16} />}
                ml={'md'}
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openEditForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Edit {title}</Typography>
            <Grid item md={12} style={{ marginTop: 15 }}>
              <label style={{ marginBottom: 8 }}>{title}</label>
              <TextField
                id='edit'
                fullWidth
                variant='outlined'
                value={rowData.name}
                onChange={handleChange}
              />
            </Grid>
            {
              status === 'State' &&
                <TransferList title='Regions Map' mappedData={() => getStatesMapById(rowData?.id)} unmappedData={getUnmappedRegions} selectedItem={selectedItem} setSelectedItem={setSelectedItem} updateMapping={updateMapping} />
            }
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                style={{ color: '#1EAE98', borderColor: '#1EAE98' }}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openDeleteForm && (
          <div className={classes.addForm}>
            <Typography variant='h7'>Are you sure want to delete <strong>{rowData?.name}</strong> ?</Typography>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                style={{ color: '#FF4848', borderColor: '#FF4848' }}
                variant='outlined'
                size='small'
              >
                Delete
              </Button>
            </div>
          </div>
        )
      }
      {
        openDeactiveForm && (
          <div className={classes.addForm}>
            <Typography variant='h7'>Do you want to disable this state ?</Typography>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleStateDeactivate}
                style={{ color: '#FF4848', borderColor: '#FF4848' }}
                variant='outlined'
                size='small'
              >
                Deactivate
              </Button>
            </div>
          </div>
        )
      }
      {
        openRegionForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add New {title}</Typography>
            <Grid container spacing={2} style={{ marginTop: 15 }}>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>State</label>
                <TextInput
                  select
                  name='states'
                  variant='outlined'
                  onChange={handleStateAdd}
                >
                  {
                    states?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                  }
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>{title}</label>
                <TextField
                  id='add'
                  style={{ width: '100%', marginTop: 4 }}
                  variant='outlined'
                  onChange={handleAdd}
                />
              </Grid>
            </Grid>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={submitAdd}
                style={{ color: '#1EAE98', borderColor: '#1EAE98' }}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openAssetForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add New {title}</Typography>
            <Grid container spacing={2} style={{ marginTop: 15 }}>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>Asset Type</label>
                <TextField
                  id='edit'
                  fullWidth
                  variant='outlined'
                  value={rowData ? rowData?.name : AddData?.name}
                  onChange={rowData ? handleChange : handleAdd}
                />
              </Grid>
            </Grid>
            {
              assetValue.map((x, i) => {
                return (
                  <Grid key={i} container spacing={2} style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
                    <Grid item md={3}>
                      <label style={{ marginBottom: 8 }}>Label</label>
                      <TextField
                        id='label'
                        fullWidth
                        variant='outlined'
                        value={x?.label}
                        onChange={e => handleInputChange(e, i)}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <label style={{ marginBottom: 8 }}>Key</label>
                      <TextField
                        id='key'
                        fullWidth
                        variant='outlined'
                        value={x?.key}
                        onChange={e => handleInputChange(e, i)}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <label style={{ marginBottom: 8 }}>Type</label>
                      <TextInput
                        select
                        id='type'
                        fullWidth
                        variant='outlined'
                        style={{ margin: 0 }}
                        value={x?.type}
                        onChange={e => handleInputChange(e, i)}
                      >
                        <option key={0} value=''>Choose Type...</option>
                        <option key={1} value='string'>String</option>
                        <option key={2} value='number'>Number</option>
                      </TextInput>
                    </Grid>
                    <div className={classes.listBtn}>
                      {assetValue.length !== 1 && <button className={classes.deleteBtn} variant='outlined' size='small' onClick={() => handleRemoveClick(i)}><DeleteOutlineIcon style={{ fontSize: 'small', marginTop: 5 }} /></button>}
                      {assetValue.length - 1 === i && <button className={classes.btns} variant='outlined' size='small' onClick={handleAddClick}>+</button>}
                    </div>
                  </Grid>
                )
              })
            }
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={rowData ? handleSubmit : submitAdd}
                style={{ color: '#1EAE98', borderColor: '#1EAE98' }}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }

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
          <Tooltip position="top" label="Edit">
            <Button
              colorScheme="secondary"
              variant="outline"
              size="md"
              onClick={callback}
            >
              Go back
            </Button>
          </Tooltip>

          <Button
            size="md"
            onClick={() => {
              handleClose()
              !regionForm && !assetForm ? setOpenAddForm(true) : !assetForm ? setOpenRegionForm(true) : setOpenAssetForm(true)
              setStatus(title)
            }}
          >
            Add
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Contain;
