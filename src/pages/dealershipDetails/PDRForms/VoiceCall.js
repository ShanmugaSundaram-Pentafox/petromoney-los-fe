import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Table, TableCell, TableRow, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PauseIcon from '@material-ui/icons/Pause';
import PhoneTwoToneIcon from '@material-ui/icons/PhoneTwoTone';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/styles';
import { Howl } from 'howler';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../../../components/CommonComponents/Button/Button';
import DeleteButton from '../../../components/CommonComponents/Button/DeleteButton';
import { action_id, resources_id } from '../../../config/accessControl';
import { getCoApplicantByDealershipId, getDealersByDealershipId, getGuarantorByDealershipId } from '../../../services/dealers.service';
// import { getAllGuarantor } from '../../../services/leegality.service';
import { deleteVoiceCallById, getVoiceCallLogsById, makeVoiceCallById } from '../../../services/users.service';
import CheckAllowed from '../../rbac/CheckAllowed';

export const CardWrapper = ({ title, data, callback, type }) => {
  const classes = useStyles();
  return (
    <div style={{ flex: 10, marginRight: 12, marginTop: 12 }}>
      <Typography variant='h4' style={{ color: 'grey' }} className={classes.title}>{title}</Typography>
      {
        data?.length !== 0 ?
          <div style={{ flex: 4 }}>
            {data?.map((item, i) =>
              <div key={i} className={classes.cardWrapper}>
                <div className={classes.cardContent}>
                  <div>
                    <Typography variant='h6'>{item.first_name}</Typography>
                    <Typography variant='body1' style={{ color: 'grey' }}>{item.mobile}</Typography>
                  </div>
                  <div>
                    <IconButton className={classes.CallIcon} onClick={() => callback(item, type)} size="small">
                      <PhoneTwoToneIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            )}
          </div>
          : <Typography variant='body1' className={classes.title}>No {title} Found!</Typography>
      }
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'right',
    padding: '12px 16px'
  },
  initiateButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  callboxtitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogcontent: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px'
  },
  dialogWrapper: {
    paddingBottom: 12,
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  cardWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 2,
    padding: '12px 12px 12px 12px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: '#c5f4cc'
    }
  },
  CallIcon: {
    '&:hover': {
      backgroundColor: '#c5f4cc'
    }
  },
  title: {
    marginBottom: 12,
    marginLeft: 12,
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  audioIcon: {
    color: 'gray',
    fontSize: 'small'
  },
  iconLabel: {
    color: '#363637',
    fontSize: '12px'
  },
  cardContent: {
    flex: 5,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typo: {
    marginTop: 12,
    marginBottom: 36,
    textAlign: 'center'
  },
  deleteicon: {
    visibility: 'hidden',
  },
  tableroweffect: {
    '&:hover': {
      '& $deleteicon': {
        visibility: 'visible',
      },
    }
  }
}))



const VoiceCall = ({ id, callback, currentUser }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [coapplicants, setCoapplicants] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const [audio, setAudio] = useState(false)
  const [playing, setPlaying] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [soundurl, setSoundurl] = useState(null);
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const sound = new Howl({
    urls: [soundurl],
    src: [soundurl],
    autoplay: true,
    loop: false
  })
  const { data: CallLogs = [], refetch } = useQuery(['voice-call-log', id], () => getVoiceCallLogsById(id), { refetchOnWindowFocus: false })

  useEffect(() => {
    if (id) {
      getDealersByDealershipId(id)
        .then(res => {
          setDealers(res);
        })
        .catch(err => {
          console.log('getDealersByDealershipId >> ', err);
        });
      getCoApplicantByDealershipId(id)
        .then(res => {
          setCoapplicants(res);
        })
        .catch(err => {
          console.log('getCoApplicantByDealershipId >> ', err)
        })
      getGuarantorByDealershipId(id)
        .then(res => {
          setGuarantors(res);
        })
        .catch(err => {
          console.log('getAllGuarantor >>', err)
        })
    }
  }, [id])

  const handleVoiceCall = (item, type) => {
    var data = {
      To: item.mobile,
      type: type.toUpperCase(),
      module: 'pdr'
    }
    console.log('data >>>>>>>>>>>>>>>>>>>>',data)
    makeVoiceCallById(item.dealership_id, data)
      .then(res => {
        setOpenDialog(false);
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        refetch();
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      });
  }
  const appli_id = [];
  const appli_name = [];
  const appli_number = [];
  const appli_type = [];
  var type = CallLogs?.map(id => {
    !appli_id.includes(id.applicant_id) && appli_id.push(id.applicant_id) && appli_name.push(id.first_name) && appli_number.push(id.from_mobile) && appli_type.push(id.applicant_type)
  })

  const handleSound = (data, i, log) => {
    sound.pause();
    setSoundurl(data)
    if (log == 'play' && playing.playing == true) {
      playing.playing = false;
    }
    else {
      sound.pause();
      setPlaying({ id: i, playing: !playing.playing });
    }
    setPlaying({ id: i, playing: !playing.playing });
  }

  const handleDelete = (id) => {
    deleteVoiceCallById(id)
      .then(res => {
        if (res.status == 'SUCCESS') {
          setDeleteModel(false)
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          refetch();
        } else {
          setDeleteModel(false)
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        }
      })
      .catch((e) => {
        setDeleteModel(false)
        enqueueSnackbar(e?.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      });
    {/* This function is to handle the delete for call logs */ }
  }

  return (
    <>
      <div className={classes.sidePanelFormWrapper}>
        <Typography className={classes.sidePanelTitle} variant="h4">
          <div>Call logs</div>
          <IconButton onClick={() => { callback(); handleSound(null, null, 'pause') }} size='small'>
            <CloseIcon />
          </IconButton>
        </Typography>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                {
                  appli_id.length > 0 ?
                    (appli_id?.map((id, idIndex) => {
                      return (
                        <div key={idIndex} style={{ marginTop: '20px' }}>
                          <Typography variant='h4' style={{ marginLeft: '10px' }}>{`${appli_name[idIndex]} (${appli_number[idIndex]})`}</Typography>
                          <Typography variant='h4' style={{ marginLeft: 10, marginBottom: 4, color: '#969696' }}>{appli_type[idIndex]}</Typography>
                          <Table>
                            <TableRow>
                              <TableCell style={{ width: '30%' }}>From</TableCell>
                              <TableCell>Time</TableCell>
                              <TableCell>Duration</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Origin</TableCell>
                              <TableCell>Module</TableCell>
                              <TableCell style={{ width: '12%' }}>Recordings</TableCell>

                            </TableRow>
                            {
                              CallLogs?.map((item, itemIndex) => {
                                // if (item?.module == 'pdr') {
                                return (
                                  id == item.applicant_id && (
                                    <TableRow className={classes.tableroweffect}>
                                      <TableCell style={{ color: '#363637' }}>{`${item.to_mobile} (${item.to_user_name})`}</TableCell>
                                      <TableCell><span>{item.start_date ? item.start_date : '-'}</span> <span>{item.start_time && item.start_time}</span></TableCell>
                                      <TableCell>{item.duration ? item.duration + 's' : '-'}</TableCell>
                                      <TableCell>{item.status ? item?.status : '-'}</TableCell>
                                      <TableCell>{item?.application_type ? item?.application_type : '-'}</TableCell>
                                      <TableCell>{item?.module ? item?.module : '-'}</TableCell>
                                      <TableCell>
                                        {
                                          item.recording_url ? (
                                            playing.id == itemIndex && playing.playing ?
                                              <IconButton onClick={() => handleSound(null, itemIndex, 'pause')} style={{ padding: 0 }}>
                                                <PauseIcon className={classes.audioIcon} /> <span className={classes.iconLabel}>{'Pause'}</span>
                                              </IconButton> :
                                              <IconButton onClick={() => handleSound(item.recording_url, itemIndex, 'play')} style={{ padding: 0 }}>
                                                <PlayArrowIcon className={classes.audioIcon} /> <span className={classes.iconLabel}>{'Play'}</span>
                                              </IconButton>
                                          ) : <Typography style={{ marginLeft: 2 }}>-</Typography>
                                        }
                                      </TableCell>
                                      <TableCell className={classes.deleteicon}>
                                        <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.callLogDelete}>
                                          <DeleteButton alertText={`Do you really want to delete this call log from ${item.to_user_name} (${item.to_mobile})`} deleteAction={() => handleDelete(item.id)} deleteModal={deleteModel} setDeleteModal={setDeleteModel} id={itemIndex} buttonType='icon' />
                                        </CheckAllowed>
                                      </TableCell> {/* shows delete button for call logs by hovering it */}
                                    </TableRow>)
                                )
                                // }
                              })
                            }
                          </Table>
                        </div>
                      )
                    })) : <Typography className={classes.typo}>No logs found...</Typography>
                }
              </Grid>
            </Grid>
          </div>
        </div>
        <div>
          <Dialog onClose={() => setOpenDialog(false)} open={openDialog} maxWidth='md' fullWidth>
            <DialogTitle>
              <div className={classes.callboxtitle}>
                <Typography variant="h3">Initiate Call</Typography>
                <IconButton onClick={() => setOpenDialog(false)} size='small'>
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <Divider />
              <div className={classes.dialogWrapper}>
                <div className={classes.dialogcontent}>
                  <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12, width: '100%', justifyContent: 'space-between' }}>
                    <CardWrapper title={'Dealers'} type={'dealer'} data={dealers} callback={handleVoiceCall} />
                    <Divider orientation='vertical' />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12, width: '100%', justifyContent: 'space-between' }}>
                    <CardWrapper title={'Co-applicants'} type={'coapplicant'} data={coapplicants} callback={handleVoiceCall} />
                    <Divider orientation='vertical' />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12, width: '100%', justifyContent: 'space-between' }}>
                    <CardWrapper title={'Guarantors'} type={'guarantor'} data={guarantors} callback={handleVoiceCall} />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.callInitiate}>
              <Button
                variant="contained"
                className={classes.initiateButton}
                startIcon={<PhoneTwoToneIcon />}
                onClick={() => { setOpenDialog(true); handleSound(null, null, 'pause') }}
              >
                Initiate Call
              </Button>
            </CheckAllowed>
          </div>
        </div>
      </div>
    </>
  )
}

export default VoiceCall;