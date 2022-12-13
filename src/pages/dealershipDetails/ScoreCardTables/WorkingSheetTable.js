import { Table, TableCell as TableCellComp, TableContainer, TableHead, TableRow, TableBody, withStyles, Typography, makeStyles } from '@material-ui/core'
import head from 'lodash-es/head';
import React from 'react'

const useStyles = makeStyles(() => ({
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
  }
}))

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp)

const WorkingSheetTable = ({ data }) => {
  const classes = useStyles();

  return (
    <>
      {
        data?.ws_summary_data?.length ?
          <TableContainer>
            {/* Summary data table */}
            <Table style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <TableBody>
                  {
                    workingSheetSummary1?.map((item, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{item?.label}</TableCell>
                          <TableCell>{head(data?.ws_summary_data)?.[item?.key]}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
                <TableBody>
                  {
                    workingSheetSummary2?.map((item, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{item?.label}</TableCell>
                          <TableCell>{head(data?.ws_summary_data)?.[item?.key]}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </div>

            </Table>
            {/* demographics data table */}
            {
              data?.ws_demographics_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Demographics Table</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Demographics</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Contact Details</TableCell>
                        <TableCell>CIBIL Score</TableCell>
                        <TableCell>Crime check</TableCell>
                        <TableCell>Relationship</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_demographics_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.demographics}</TableCell>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.age}</TableCell>
                            <TableCell>{item?.contact_details}</TableCell>
                            <TableCell>{item?.cibil_score}</TableCell>
                            <TableCell>{item?.crime_check}</TableCell>
                            <TableCell>{item?.relationship}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null}

            {/* Share holding data table */}
            {
              data?.ws_shareholding_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Shareholding Details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Shareholding Pattern</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Stake</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_shareholding_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.shareholding_pattern}</TableCell>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.designation}</TableCell>
                            <TableCell>{item?.stake}</TableCell>
                            <TableCell>{item?.remarks}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>

              ) : null
            }
            {/* Business analysis table */}
            {
              data?.ws_business_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Business Analysis</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>ITR filled data</TableCell>
                        <TableCell>Turnover</TableCell>
                        <TableCell>Net Profit</TableCell>
                        <TableCell>Secured and Unsecured Loans</TableCell>
                        <TableCell>Leverage(Incl loan proposed)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_business_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.year}</TableCell>
                            <TableCell>{item?.itr_filled_date}</TableCell>
                            <TableCell>{item?.turn_over}</TableCell>
                            <TableCell>{item?.net_profit}</TableCell>
                            <TableCell>{item?.secured_unsecured_loans}</TableCell>
                            <TableCell>{item?.leverage}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
            {/* Montly sales table */}
            {
              data?.ws_sales_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Monthly sales Details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sales in KL ( Month )</TableCell>
                        <TableCell>Average sales ( Month )</TableCell>
                        <TableCell>Cash sales (%)</TableCell>
                        <TableCell>credit sales (%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_sales_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.sale_in_kl}</TableCell>
                            <TableCell>{item?.average_sales}</TableCell>
                            <TableCell>{item?.cash_sales}</TableCell>
                            <TableCell>{item?.credit_sales}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
            {/* Summary data */}
            <Table style={{ width: '60%' }}>
              <TableBody>
                {
                  workingSheetSummary3?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item?.label}</TableCell>
                        <TableCell>{head(data?.ws_summary_data)?.[item?.key]}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
            {/* Faculty sales data table */}
            {
              data?.ws_faculty_sales_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Infrastructure Details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow />
                      <TableRow>
                        <TableCell>Faculty for sales.</TableCell>
                        <TableCell>MS</TableCell>
                        <TableCell>HSD</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_faculty_sales_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.faculty_for_sales}</TableCell>
                            <TableCell>{item?.ms}</TableCell>
                            <TableCell>{item?.hsd}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
            {/* Bunk details data table */}
            {
              data?.ws_bunk_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Faculty details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow />
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>No of Packs</TableCell>
                        <TableCell>No of Shifts</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_bunk_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.no_of_pax}</TableCell>
                            <TableCell>{item?.no_of_shifts}</TableCell>
                            <TableCell>{(item?.no_of_pax * item?.no_of_shifts)}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
            {/* Bank Statement Analysis */}
            {
              data?.ws_bank_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Bank Statement</Typography>
                  <Table>
                    <TableHead>
                      <TableRow />
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>NO. OF DEBITS</TableCell>
                        <TableCell>SUM OF DEBITS</TableCell>
                        <TableCell>NO. OF CREDITS</TableCell>
                        <TableCell>SUM OF CREDITS</TableCell>
                        <TableCell>OMC TRANSACTION</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_bank_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.month}</TableCell>
                            <TableCell>{item?.no_of_debits}</TableCell>
                            <TableCell>{item?.sum_of_debits}</TableCell>
                            <TableCell>{item?.no_of_credits}</TableCell>
                            <TableCell>{item?.sum_of_credits}</TableCell>
                            <TableCell>{item?.omc_transaction}</TableCell>
                            <TableCell>{item?.remarks}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
            {/* CIBIL Analysis */}
            {
              data?.ws_cibil_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>CIBIL Analysis</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.No</TableCell>
                        <TableCell>Particulars</TableCell>
                        <TableCell>Main Applicant (Entity)</TableCell>
                        <TableCell>Individual Co-applicant No 1 (Main Individual Co-applicant)</TableCell>
                        <TableCell>Individual Co-applicant No 2</TableCell>
                        <TableCell>Individual Co-applicant No 3</TableCell>
                        <TableCell>Individual Co-applicant No 4</TableCell>
                        <TableCell>Individual Co-applicant No 5</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        cibilAnalysis?.map((field, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{field?.label}</TableCell>
                              {
                                data?.ws_cibil_data?.map((item, i) => {
                                  return (
                                    <TableCell key={i}>{item?.[field?.key]}</TableCell>
                                  )
                                })
                              }
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </>) : null}

            {/* Reference table */}
            <Typography variant='h6' className={classes.title}>Reference Details</Typography>
            <Table style={{ width: '60%' }}>
              <TableBody>
                {
                  scoreCardReference?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item?.label}</TableCell>
                        <TableCell>{head(data?.ws_references_data)?.[item?.key]}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
            {/* Deviation table */}
            {
              data?.ws_deviation_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Deviation Details</Typography>
                  <Table>
                    <TableHead>
                      <TableRow />
                      <TableRow>
                        <TableCell>Deviation</TableCell>
                        <TableCell>Nature of Deviation</TableCell>
                        <TableCell>Mitigents</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data?.ws_deviation_data?.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item?.deviation}</TableCell>
                            <TableCell>{item?.nature_of_deviation}</TableCell>
                            <TableCell>{item?.mitigents}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </>
              ) : null
            }
          </TableContainer> : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
      }
    </>
  )
}

export default WorkingSheetTable;

// splitted the data from single array only for clear UI need

let workingSheetSummary1 = [
  { label: 'Date of Incorporation / OMC date', key: 'doi' },
  { label: 'OMC', key: 'omc' },
  { label: 'PD done by', key: 'pd_done_by' },
  { label: 'Loan Amount', key: 'loan_amount' },
  { label: 'Rate of Interest %', key: 'rate_of_interest' },
  { label: 'FOIR as per policy', key: 'foir' },
  { label: 'Leverage as per Policy', key: 'leverage' },
]

let workingSheetSummary2 = [
  { label: 'Outlet Land', key: 'outlet_land' },
  { label: 'Type of Entity', key: 'type_of_entity' },
  { label: 'PD date', key: 'pd_date' },
  { label: 'Loan Scheme', key: 'loan_scheme' },
  { label: 'Processing Key %', key: 'processing_fee' },
  { label: 'Actual FOIR character', key: 'actual_foir' },
]


let workingSheetSummary3 = [
  { label: 'Total regular customer bases', key: 'total_regular_customer_bases' },
  { label: 'Main customer (transports / Institutions )', key: 'main_customers' },
  { label: 'Max credit period days / limit', key: 'max_credit_period' },
  { label: 'bad_debts', key: 'bad debts ( yearly)' },
  { label: 'Mode of collection ( cash / transfer)', key: 'mode_of_collection' },
  { label: 'Total receivables ( latest) Rs.', key: 'total_receivables' },
]

let scoreCardReference = [
  { label: 'Reference 1', key: 'ref1' },
  { label: 'Reference 2', key: 'ref2' },
  { label: 'OMC official name and No', key: 'omc_official_name' },
  { label: 'Other information', key: 'additional_info' },
  { label: 'Any recent public developments which may impact sales ( road development / any other)', key: 'public_development' },
  { label: 'No of loads purchased per month', key: 'loads_pur_per_month' },
]

let cibilAnalysis = [
  { label: 'Type ( thick / thin)', key: 'name' },
  { label: 'Vintage in CIBIL', key: 'type_thick_thin' },
  { label: 'Vintage in CIBIL', key: 'vintage_cibil' },
  { label: 'Score', key: 'score' },
  { label: 'total No of DPD ( up to 30 days) in last 12 months', key: 'dpd_upto_30days' },
  { label: 'total No of DPD ( > 30 up to 90 days) in last 12 months', key: 'dpd_30_to_90days' },
  { label: 'total No of DPD ( > 90 days) in last 12 months', key: 'dpd_greater_90days' },
  { label: 'Loans / Credi card - WO/ Settled <=50K', key: 'settled' },
  { label: 'Enquiries in the last 6 months', key: 'enquiries' },

]