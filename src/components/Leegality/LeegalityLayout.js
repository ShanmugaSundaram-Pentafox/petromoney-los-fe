import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { deleteRequestUrl } from '../../services/leegality.service';
import apiCall from '../../utils/api.util';
import FilePreview from '../CommonComponents/FilePreview';

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);

  .card-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 15px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;
const useStyles = makeStyles((theme) => ({
  popover: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    minWidth: '40px',
  },
  icon: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },
  text: {
    marginLeft: theme.spacing(1),
  },
}));

const LeegalityLayout = ({ docId, dealershipId, currentUser, setActiveState }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState({});
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const getLegalityDocument = useQuery({
    queryKey: ['getLegality-document', docId, dealershipId],
    queryFn: () => apiCall(`dealership/${dealershipId}/document/${docId}`),
    enabled: Boolean(docId && dealershipId),
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      setActiveState(data);
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
      setActiveState();
    }
  })

  const handleClick = (event, cardData) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemData(cardData)
  };

  const ResendNotification = () => {
    apiCall('document/resend', {
      method: 'POST',
      body: { sign_url: selectedItemData.signUrl },
    })
      .then((res) => {
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    let value = { signUrl: selectedItemData.url, document_id: getLegalityDocument?.data?.documentId };
    deleteRequestUrl(value)
      .then((res) => {
        setOpen(false)
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      });
  };

  return (
    <Box bgcolor="#fbfbfb">
      <Grid container spacing={2}>
        <Grid item md={6} style={{ position: 'relative' }}>
          {docId && getLegalityDocument?.data?.file && (
            <FilePreview
              title="Leegality"
              data={{ image: getLegalityDocument?.data?.file, type: getLegalityDocument?.data?.file?.endsWith('.pdf') }}
              showDownload
            />
          )}
          <Backdrop
            open={getLegalityDocument?.isLoading}
            style={{ position: 'absolute', zIndex: '2' }}
          >
            <CircularProgress size={25} style={{ color: 'white' }} />
          </Backdrop>
        </Grid>
        {getLegalityDocument?.data?.file ? (
          <Grid item md={4}>
            <Box pt={2}>
              <TableContainer>
                <Table aria-label="leegality table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Document ID</TableCell>
                      <TableCell>{getLegalityDocument?.data?.documentId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{getLegalityDocument?.data?.documentName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Active Date</TableCell>
                      <TableCell>
                        {getLegalityDocument?.data?.creationDate &&
                          moment(
                            getLegalityDocument?.data?.creationDate?.split(' ')[0],
                            'DD-MM-YYYY'
                          ).format('MMM DD, YYYY')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>{getLegalityDocument?.data?.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Internal Reference no</TableCell>
                      <TableCell>{getLegalityDocument?.data?.irn}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2}>
                {getLegalityDocument?.data?.invitations?.map((item, i) => {
                  return (
                    <Card key={`inv-${i}`}>
                      <div className="card-body">
                        <Box pr={2}>
                          <Avatar>
                            <AccountCircleRoundedIcon />
                          </Avatar>
                        </Box>
                        <Box>
                          <p>
                            <strong>{item.name}</strong>
                          </p>
                          {item.email && (
                            <p>
                              <small>{item.email}</small>
                            </p>
                          )}
                          {item.phone && (
                            <p>
                              <small>{item.phone}</small>
                            </p>
                          )}
                          <div
                            style={{ flex: 1, justifyContent: 'space-between' }}
                          >
                            <Chip
                              style={{ marginRight: 10, border: 0 }}
                              variant="outlined"
                              size="small"
                              label="Signed"
                              icon={
                                item.signed ? (
                                  <CheckCircleOutlineRoundedIcon
                                    style={{ color: 'green' }}
                                  />
                                ) : (
                                  <HighlightOffRoundedIcon
                                    style={{ color: 'red' }}
                                  />
                                )
                              }
                            />
                            {!item.signed && (
                              <>
                                <Chip
                                  style={{ marginRight: 10, border: 0 }}
                                  variant="outlined"
                                  size="small"
                                  label="Active"
                                  icon={
                                    item.active ? (
                                      <CheckCircleOutlineRoundedIcon
                                        style={{ color: 'green' }}
                                      />
                                    ) : (
                                      <HighlightOffRoundedIcon
                                        style={{ color: 'red' }}
                                      />
                                    )
                                  }
                                />
                                <Chip
                                  style={{ marginRight: 10, border: 0 }}
                                  variant="outlined"
                                  size="small"
                                  label="Expired"
                                  icon={
                                    item.expired ? (
                                      <CheckCircleOutlineRoundedIcon
                                        style={{ color: 'green' }}
                                      />
                                    ) : (
                                      <HighlightOffRoundedIcon
                                        style={{ color: 'red' }}
                                      />
                                    )
                                  }
                                />
                              </>
                            )}
                          </div>
                        </Box>
                      </div>
                      <div className="card-footer">
                        {item.active ? (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={ResendNotification}
                            size="small"
                          >
                            Resend Notification
                          </Button>
                        ) : null}
                        {/* <Button variant="outlined" color="secondary" size="small">Details</Button> */}
                        <SettingsIcon
                          fontSize={'small'}
                          color={'action'}
                          onClick={(e) => handleClick(e, item)}
                        />
                        <Popover
                          // id={id}
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={() => {
                            setAnchorEl(null)
                            setSelectedItemData({})
                          }}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <div className={classes.popover}>
                            {currentUser?.role_id == 1 ? (
                              <div
                                className={classes.icon}
                                onClick={() => {
                                  setOpen(true);
                                }}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                <Typography className={classes.text}>
                                  Delete
                                </Typography>
                              </div>
                            ) : null}
                            <div className={classes.icon} onClick={() => navigator.clipboard.writeText(selectedItemData?.signUrl).then(
                              () => {
                                setAnchorEl(null)
                                enqueueSnackbar('Sign URL copied successfully', {
                                  anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                  },
                                  variant: 'success',
                                })
                              },
                              () => {
                                enqueueSnackbar('Copy failed', {
                                  anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                  },
                                  variant: 'error',
                                })
                              }
                            )}>
                              <FileCopyOutlinedIcon fontSize='small' color={'action'} />
                              <Typography className={classes.text}>Copy link</Typography>
                            </div>
                          </div>
                        </Popover>
                      </div>
                      <Dialog
                        open={open}
                        onClose={() => {
                          setOpen(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogContent>
                          <DialogContentText className={classes.text}>
                            Do you want to delete the document?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            No
                          </Button>
                          <Button
                            onClick={handleDelete}
                            className={classes.button}
                            variant="contained"
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Card>
                  )
                })}
              </Box>
            </Box >
          </Grid >
        ) : null}
      </Grid >
    </Box >
  );
};

export default LeegalityLayout;
