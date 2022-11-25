import { Drawer, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { green, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import CreditInfoSideWrapper from './CreditInfoSideWrapper';
import CrimeInfoSideWrapper from './CrimeInfoSideWrapper';
import { URL } from '../../../config/serverUrls';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  header: {
    display: 'flex',
    marginBottom: 8
  },
  footer: {
    paddingTop: 8,
    textAlign: 'right'
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
  actionButtons: {
    // paddingTop: 8
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fafafa',
    }
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
    marginRight: 3,
    marginBottom: 4,
    padding: 4,
  }
}));

const CoApplicantsTable = ({ id, editable, coApplicantsData, titleAlign, onClickAddMenu, currentUser, dealersClickRow, deletable, viewOnly }) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [crimeData, setCrimeData] = useState();


  const DeleteApplicant = (values) => {
    const formData = new FormData();
    let obj = {};
    Object.keys(obj).forEach((key) => {
      formData.append(key, obj[key]);
    });
    if (values.is_active == 1) {
      formData.append('is_active', 0)
    }
    else {
      formData.append('is_active', 1)
    }

    const apiURL = URL.coApplicants;
    let url = `${apiURL}/${id}`;
    if (values.id) {
      url += `/${values.id}`;
    }
    fetch(`${URL.base}${url}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then(res => {
        return res.json()
      })
      .then(({ status, message, data }) => {
        if (status == 'SUCCESS') {
          queryClient.invalidateQueries(['co-applicants', id])
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          }
          )
        }
        else {
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          }
          )
        }
      })
      .catch(e => {
        enqueueSnackbar(e.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        }
        )
      })
  }


  if (!coApplicantsData || !coApplicantsData.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No CoApplicants Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('COAPPLICANT')}>Add CoApplicants</Button>
            </div>
          )
        }
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Co-Applicants</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Co Applicant Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
            {
              editable || viewOnly ?
                <TableCell align="center">Action</TableCell> : null
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {coApplicantsData.map((row, index) => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => editable || viewOnly ? dealersClickRow(e, row, 'COAPPLICANT') : null}>
              <TableCell>
                {row.first_name}&nbsp;&nbsp;
              </TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
              <TableCell align="center">
                {row.aadhar_f_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_f_file_url} target="_blank" title={'Aadhar Front'} rel="noreferrer">{'Aadhar Front'}</a>

                </TableCell>}
                {row.aadhar_b_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_b_file_url} target="_blank" title={'Aadhar Back'} rel="noreferrer">{'Aadhar Back'}</a>

                </TableCell>}
                {row.pan_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.pan_file_url} target="_blank" title={'PAN'} rel="noreferrer">{'PAN'}</a>
                </TableCell>}
                {!row.pan_file_url && !row.aadhar_b_file_url && !row.aadhar_f_file_url &&
                  <TableCell style={{ border: 0 }} align="center">
                    -
                  </TableCell>}
              </TableCell>
              {
                editable || viewOnly ?
                  <TableCell align="right" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Button style={{ marginRight: 12 }} size='small' variant='outlined' color='secondary' onClick={() => setCrimeData(row)}>Crime check</Button>
                      <Button size='small' variant='outlined' color='secondary' onClick={() => setRowData(row)}>Credit Info</Button>
                      <div style={{ marginLeft: 12 }} onClick={() => DeleteApplicant(row)}>
                        {
                          row.is_active == 0 ? (
                            <Tooltip title='Deactivate'>
                              <CheckCircleTwoToneIcon style={{ color: grey[500] }} />
                            </Tooltip>
                          ) : (
                            <Tooltip title='Activate'>
                              <CheckCircleTwoToneIcon style={{ color: green[200] }} />
                            </Tooltip>
                          )
                        }
                      </div>
                    </div>
                    {/* {deletable && <DeleteButton alertText={`Do you really want to delete this co-applicant named ${row?.first_name}?`} deleteAction={() => DeleteApplicant(row)} deleteModal={deleteModal} setDeleteModal={setDeleteModal} id={index} buttonType='icon' />} */}
                  </TableCell> : null
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Drawer
        anchor="right"
        open={rowData}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          {
            // !dealerData?.isLoading && !coApplicantsData?.isLoading &&
            <CreditInfoSideWrapper dealershipId={id} data={rowData} currentUser={currentUser} onClose={() => setRowData()} />
          }
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        open={crimeData}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          {
            <CrimeInfoSideWrapper dealershipId={id} data={crimeData} currentUser={currentUser} onClose={() => setCrimeData()} />
          }
        </div>
      </Drawer>
    </div>
  )
}

export default CoApplicantsTable;