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
  }
}));

const DealersTable = ({ id, editable, data, titleAlign, onClickAddMenu, currentUser, dealersClickRow, viewOnly }) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
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

    const apiURL = URL.dealers;
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
          queryClient.invalidateQueries(['dealers-coapplicant', id])
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

  if (!data || !data.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Dealers Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('DEALER')}>Add dealer</Button>
            </div>
          )
        }
      </div>
    );
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Dealer Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
            {
              editable || viewOnly ?
                <TableCell align="center">Action</TableCell> : null
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => editable || viewOnly ? dealersClickRow(e, row, 'DEALER') : null}>
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
                            <Tooltip title='Activate'>
                              <CheckCircleTwoToneIcon style={{ color: grey[500] }} />
                            </Tooltip>
                          ) : (
                            <Tooltip title='Deactivate'>
                              <CheckCircleTwoToneIcon style={{ color: green[200] }} />
                            </Tooltip>
                          )
                        }
                      </div>
                    </div>
                    {/* {deletable && <DeleteButton alertText={`Do you really want to delete this dealer named ${row?.first_name}?`} deleteAction={() => DeleteApplicant(row)} deleteModal={deleteModal} setDeleteModal={setDeleteModal} id={index} buttonType='icon' />} */}
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
            <CreditInfoSideWrapper dealershipId={id} data={rowData} currentUser={currentUser} onClose={() => setRowData()} />
          }
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        open={crimeData}
        onClose={()=> {setCrimeData()}}
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

export default DealersTable;