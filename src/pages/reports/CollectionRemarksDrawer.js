import { Box, Button, Divider, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import { useQuery } from 'react-query';
import { ViewData } from '../../components/CommonComponents/FilePreview';
import Currency from '../../components/Number/Currency';
import { sumBy } from 'lodash';
import { getCollectionRemarkByLoanId, getLoanReportByDealershipId } from '../../services/users.service';

const useStyles = makeStyles(() => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '60vw'
  },
  sidePanelTitle: {
    padding: '15px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  btnDelete: {
    '&.MuiButton-root': { color: '#ef5350' },
    border: '1px #ef5350 solid',
    margin: 2
  },
  btnEdit: {
    '&.MuiButton-root': { color: '#2196f3' },
    border: '1px #2196f3 solid',
    margin: 2
  },
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
  },
}))

export const CollectionRemarksDrawer = ({ callback, rowData = [] }) => {
  const classes = useStyles();
  const [loanReport, setLoanReport] = useState({})
  let combined = loanReport?.due && loanReport?.overdue && [...loanReport?.due, ...loanReport?.overdue]

  const FetchRemarks = (loan_id) => {
    const dealershipRemarks = useQuery(['remarks-by-loan-id', loan_id], () => getCollectionRemarkByLoanId(loan_id), { refetchOnWindowFocus: false })
    return dealershipRemarks;
  }
  
  useMount(() => {
    getLoanReportByDealershipId(rowData[0])
    .then(setLoanReport)
    .catch(e => {
      console.log(e);
    })
  })

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Remarks</div>
        <IconButton onClick={callback} size='small'>
          <CloseIcon fontSize='size' />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <Grid container spacing={1}>
              <Grid item md={3}>
                <ViewData title='Dealership ID' value={rowData[0]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='Applicant Name' value={rowData[1]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='Region' value={rowData[2]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='OMC' value={rowData[3]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='Total Disbursed Amount' value={rowData[4]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='Total Due' value={rowData[5]} />
              </Grid>
              <Grid item md={3}>
                <ViewData title='Total Overdue' value={rowData[6]} />
              </Grid>
            </Grid>
          </Box>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
            <Typography variant="h6">Due & Overdue</Typography>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prospect Code</TableCell>
                <TableCell>Disb Amount</TableCell>
                <TableCell>Disb Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Prin Due</TableCell>
                <TableCell>Prin Overdue</TableCell>
                <TableCell>Int Overdue</TableCell>
                <TableCell>Penal Overdue</TableCell>
                <TableCell>DPD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                loanReport.due?.map((item, i) => {
                  return(
                    <TableRow key={i} style={{backgroundColor: '#ffec9b69'}}>
                      <TableCell>{item.prospectcode}</TableCell>
                      <TableCell><Currency value={item.disb_amt} /></TableCell>
                      <TableCell>{item.disb_date}</TableCell>
                      <TableCell>{item.duedate}</TableCell>
                      <TableCell><Currency value={item.prin_due} /></TableCell>
                      <TableCell><Currency value={item.prin_overdue} /></TableCell>
                      <TableCell><Currency value={item.int_overdue} /></TableCell>
                      <TableCell><Currency value={item.penal_overdue} /></TableCell>
                      <TableCell>{item.dpd}</TableCell>
                    </TableRow>
                  )
                })
              }
              {
                loanReport?.overdue?.map((item, i) => {
                  return(
                    <TableRow key={i} style={{backgroundColor: '#ffb99b69'}}>
                      <TableCell>{item.prospectcode}</TableCell>
                      <TableCell><Currency value={item.disb_amt} /></TableCell>
                      <TableCell>{item.disb_date}</TableCell>
                      <TableCell>{item.duedate}</TableCell>
                      <TableCell><Currency value={item.prin_due} /></TableCell>
                      <TableCell><Currency value={item.prin_overdue} /></TableCell>
                      <TableCell><Currency value={item.int_overdue} /></TableCell>
                      <TableCell><Currency value={item.penal_overdue} /></TableCell>
                      <TableCell>{item.dpd}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
            <TableFooter>
              <TableRow style={{ backgroundColor: '#f2f2f0' }}>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><Currency value={sumBy(combined, 'disb_amt')} /></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell><Currency value={sumBy(combined, 'prin_due')} /></TableCell>
                <TableCell><Currency value={sumBy(combined, 'prin_overdue')} /></TableCell>
                <TableCell><Currency value={sumBy(combined, 'int_overdue')} /></TableCell>
                <TableCell><Currency value={sumBy(combined, 'penal_overdue')} /></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {
            rowData[7]?.map((item, i) => {
              const { data, isLoading } = item?.prospectcode && FetchRemarks(item.prospectcode)
              return (
                <div key={i} style={{ marginBottom: 20,marginTop:16 }}>
                  <h4 style={{ marginBottom: 8 }}>Prospect code : {item?.prospectcode}</h4>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Remark</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Created date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        !isLoading && data?.map((item, j) => {
                          return (
                            <TableRow key={j}>
                              <TableCell><p key={j}>{item?.remarks_value} <span>{Object.values(item?.details)}</span></p></TableCell>
                              <TableCell>{item?.last_modified_by_value}</TableCell>
                              <TableCell>{item?.created_date}</TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant="outlined" startIcon={<NavigateBeforeRoundedIcon />} onClick={callback}>Back</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

