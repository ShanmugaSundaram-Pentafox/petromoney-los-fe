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
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import LinkIcon from '@material-ui/icons/Link';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActivityBox from './components/ActivityBox';
import { deleteRequestUrl } from '../../services/leegality.service';
import apiCall from '../../utils/api.util';
import PdfViewer from '../CommonComponents/PdfViewer/PdfViewer';

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

const LeegalityLayout = ({ docId, dealershipId, currentUser }) => {
  const [auditTrails, setAuditTrails] = useState([]);
  const [docDetails, setDocDetails] = useState({});
  const [successStatus, setSuccessStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState({});
  const [open, setOpen] = useState(false);
  // const [signUrl, setSignUrl] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const handleClick = (event, cardData) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemData(cardData)
  };

  useEffect(() => {
    setLoading(true);
    apiCall(`dealership/${dealershipId}/document/${docId}`)
      .then((res) => {
        if (res.status === 'SUCCESS') {
          if (res.data?.status) {
            setLoading(false);
            setDocDetails(res?.data?.data);
          }
        } else {
          setLoading(false);
          console.log('>> Document Details status error >> ', res);
          setDocDetails();
        }
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        console.log(err);
        setDocDetails();
      });

    apiCall(`document/trail/${docId}`)
      .then((res) => {
        if (res.status === 'SUCCESS') {
          if (res.data?.status) {
            setAuditTrails(res?.data?.data.auditTrails);
          }
        } else {
          console.log('>> Document Trail Status error >> ', res);
          setAuditTrails();
        }
      })
      .catch((err) => {
        console.log(err);
        setAuditTrails();
      });
  }, []);

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
        // setTimeout(() => {
        //   setSuccessStatus(res.message || 'Notification send successfully')
        // }, 1500)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    let value = { signUrl: selectedItemData.url, document_id: docDetails?.documentId };
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

  const ActivateDealer = () => {
    setLoading(true);
    apiCall(`document/reactivate/${docId}`)
      .then((res) => {
        apiCall(`dealership/${dealershipId}/document/${docId}`)
          .then((res) => {
            if (res.status === 'SUCCESS') {
              if (res.data?.status) {
                setLoading(false);
                setDocDetails(res?.data?.data);
              }
            } else {
              setLoading(false);
              console.log('>> Document Details status error >> ', res);
              setDocDetails();
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            setDocDetails();
          });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <Box bgcolor="#fbfbfb">
      <Grid container spacing={2}>
        <Grid item sm={6} style={{ position: 'relative' }}>
          {docId && docDetails?.file && (
            <PdfViewer
              title="Some Random File"
              file={docDetails?.file}
              showDownload
            />
          )}
          <Backdrop
            open={loading}
            style={{ position: 'absolute', zIndex: '2' }}
          >
            <CircularProgress size={25} style={{ color: 'white' }} />
          </Backdrop>
        </Grid>
        {docDetails?.file ? (
          <Grid item sm={3}>
            <Box pt={2}>
              <TableContainer>
                <Table aria-label="leegality table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Document ID</TableCell>
                      <TableCell>{docDetails?.documentId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{docDetails?.documentName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Active Date</TableCell>
                      <TableCell>
                        {docDetails?.creationDate &&
                          moment(
                            docDetails?.creationDate?.split(' ')[0],
                            'DD-MM-YYYY'
                          ).format('MMM DD, YYYY')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>{docDetails?.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Internal Reference no</TableCell>
                      <TableCell>{docDetails?.irn}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2}>
                {docDetails?.invitations?.map((item, i) => {
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
                        ) : (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={ActivateDealer}
                            size="small"
                          >
                            Activate
                          </Button>
                        )}
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
                            <div
                              className={classes.icon}
                              onClick={() =>
                                navigator.clipboard.writeText(selectedItemData.signUrl)
                              }
                            >
                              <LinkIcon fontSize="small" />
                              <Typography className={classes.text}>
                                Copy link
                              </Typography>
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
                            Do you want to disable the user?
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
                  )})}
              </Box>
            </Box>
          </Grid>
        ) : null}

        <Grid item sm={3}>
          <Box>
            {auditTrails.map((item, i) => (
              <ActivityBox key={'act-' + i} {...item} />
            ))}
            {successStatus && (
              <Box pt={2} pl={3} color="success.main">
                {successStatus}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeegalityLayout;
