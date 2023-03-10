import { Box, Button, Divider, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import MUIDataTable from 'mui-datatables';
import React, { useState,useMemo } from 'react';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import { ViewData } from '../../components/CommonComponents/FilePreview';
import Currency from '../../components/Number/Currency';
import { getCollectionRemarkByLoanId, getLoanReportByDealershipId } from '../../services/users.service';

const useStyles = makeStyles(() => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '70vw'
  },
  sidePanelTitle: {
    padding: '8px 16px',
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
  }
}))

export const CollectionRemarksDrawer = ({ callback, rowData = [] }) => {
  const classes = useStyles();
  const [loanReport, setLoanReport] = useState({})

  const FetchRemarks = (loan_id) => {
    const dealershipRemarks = useQuery(['remarks-by-loan-id', loan_id], () => getCollectionRemarkByLoanId(loan_id), { refetchOnWindowFocus: false })
    return dealershipRemarks;
  }
  useMount(() => {
    getLoanReportByDealershipId(rowData[0])
      .then(res => {
        setLoanReport(res)
      })
      .catch(e => {
        console.log(e);
      })
  })

  const columns = useMemo(() => {
    return [
      {
        name: 'prospectcode',
        label: 'Prospect Code',
        options: {
          customBodyRender: (value) => rowData[7].map((row) => <div key={row?.prospectcode} style={{display:'flex',justifyContent:'space-between'}}><p>{value}</p> {row?.prospectcode === value ? <ChatOutlinedIcon style={{ fontSize: 13, marginLeft: 5, color: 'rgb(0,0,0,0.4)' }} /> : null}</div>)
        }

      },
      {
        name: 'disb_amount',
        label: 'Disb Amount',
        options: {
          customBodyRender: value => <Currency value={value} />
        }
      },
      { name: 'disb_date', label: 'Disb Date' },
      { name: 'duedate', label: 'Due date' },
      { name: 'prin_due', label: 'Prin Due' },
      { name: 'prin_overdue', label: 'Prin overdue' },
      { name: 'int_overdue', label: 'Int Overdue' },
      { name: 'penal_overdue', label: 'Penal Overdue' },
      { name: 'dpd', label: 'DPD' },
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    print: false,
    filter: false,
    rowsPerPage: 5,
    viewColumns:false,
    rowsPerPageOptions: [5, 10, 15],
    setRowProps: (row) => {
      if (row[6]) {
        return { style: { backgroundColor: '#ffb99b69' } }
      }
    },
  };


  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Remarks</div>
        <IconButton onClick={callback} size='small'>
          <CloseIcon />
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
          <div>
            <MUIDataTable
              title="Remarks"
              columns={columns}
              options={options}
              data={(loanReport?.due && loanReport?.overdue) ? [...loanReport?.due, ...loanReport?.overdue] : []}
            />
          </div>
          {
            rowData[7]?.map((item, i) => {
              const { data, isLoading } = item?.prospectcode && FetchRemarks(item.prospectcode)
              return (
                <div key={i} style={{ marginBottom: 20, marginTop: 16 }}>
                  <h4>Prospect code : {item?.prospectcode}</h4>
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

