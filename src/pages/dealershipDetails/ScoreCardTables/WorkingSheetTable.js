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
          <TableContainer style={{ maxHeight: '50vh' }}>
            {/* Summary data table */}
            <SummaryDataTable data={data} />
            {
              data?.ws_summary_data[0]?.profile_of_customer_and_business && (
                <>
                  <Typography variant='h6' className={classes.title}>Remarks</Typography>
                  <RemarksTable data={data} />
                </>
              )
            }
            {/* Demographics data */}
            {
              data?.ws_demographics_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Demographics Table</Typography>
                  <DemographicsTable data={data} />
                </>
              ) : null
            }
            {/* Shareholders data */}
            {
              data?.ws_shareholding_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Shareholding Details</Typography>
                  <ShareHoldingTable data={data} />
                </>
              ) : null
            }
            {/* Business analysis data */}
            {
              data?.ws_business_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Business Analysis</Typography>
                  <BusinessAnalysisTable data={data} />
                </>
              ) : null
            }
            {/* Monthly sales data */}
            {
              data?.ws_sales_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Monthly sales Details</Typography>
                  <MonthlySalesTable data={data} />
                </>
              ) : null
            }
            {
              data?.ws_faculty_sales_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Infrastructure Details</Typography>
                  <FacultySalesTable data={data} />
                </>
              ) : null
            }
            {/* Bunk details data table */}
            {
              data?.ws_bunk_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Faculty details</Typography>
                  <BunkDetailsTable data={data} />
                </>
              ) : null
            }
            {/* Faculty details bank data */}
            {
              data?.ws_faculty_bank_details?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Bank Account details</Typography>
                  <FacultyBankDetailsTable data={data} />
                </>
              ) : null
            }
            {/* Bank Statement Analysis */}
            {
              data?.ws_bank_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Bank Statement</Typography>
                  <BankDetailsTable data={data} />
                </>
              ) : null
            }
            {/* CIBIL Analysis */}
            {
              data?.ws_cibil_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>CIBIL Analysis</Typography>
                  <CibilAnalysisTable data={data} />
                </>) : null}

            {/* Reference table */}
            <Typography variant='h6' className={classes.title}>Reference Details</Typography>
            <ReferrenceTable data={data} />
            {/* Deviation table */}
            {
              data?.ws_deviation_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Deviation Details</Typography>
                  <DeviationTable data={data} />
                </>
              ) : null
            }
            {
              data?.ws_sanction_condition_data?.length ? (
                <>
                  <Typography variant='h6' className={classes.title}>Sanction Details</Typography>
                  <SanctionConditionTable data={data} />
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
  { label: 'Date of Incorporation / OMC date', key: 'omc_date' },
  { label: 'OMC', key: 'omc' },
  { label: 'PD done by', key: 'pd_done_by' },
  { label: 'Loan Amount', key: 'loan_amount' },
  { label: 'Rate of Interest %', key: 'rate_of_interest_in_percent' },
  { label: 'FOIR as per policy %', key: 'foir_as_per_policy' },
  { label: 'Leverage as per Policy', key: 'leverage_as_per_policy' },
  { label: 'Total regular customer bases', key: 'total_regular_customer_bases' },
  { label: 'Max credit period days / limit', key: 'max_credit_period_days' },
  { label: 'Total receivables ( latest) Rs.', key: 'total_receivables' },
  { label: 'Daily Cash Collection', key: 'daily_cash_collection' },
]

let workingSheetSummary2 = [
  { label: 'Outlet Land', key: 'outlet_land' },
  { label: 'Type of Entity', key: 'type_of_entity' },
  { label: 'PD date', key: 'pd_date' },
  { label: 'Loan Scheme', key: 'loan_scheme' },
  { label: 'Processing Key %', key: 'processing_fee_in_percent' },
  { label: 'Actual FOIR character', key: 'actual_foir' },
  { label: 'Actual Leverage', key: 'actual_leverage' },
  { label: 'Main customer (transports / Institutions )', key: 'main_customers' },
  { label: 'bad debts ( yearly)', key: 'bad_debts_yearly' },
  { label: 'Mode of collection ( cash / transfer)', key: 'mode_of_collection' },
]

let scoreCardReference = [
  { label: 'Reference 1', key: 'ref1' },
  { label: 'Reference 2', key: 'ref2' },
  { label: 'OMC official name and No', key: 'omc_official_name_and_no' },
  { label: 'Other information', key: 'additional_information' },
  { label: 'Any recent public developments which may impact sales ( road development / any other)', key: 'public_development_or_any_other' },
  { label: 'No of loads purchased per month', key: 'loads_purchased_per_month' },
  { label: 'No of outlets within 3 Kms', key: 'no_of_outlets_with_in_3km' },
]

let cibilAnalysis = [
  { label: 'Applicant name', key: 'applicant_name' },
  { label: 'Type ( thick / thin)', key: 'type_thick_or_thin' },
  { label: 'Vintage in CIBIL', key: 'vintage_cibil' },
  { label: 'Score', key: 'score' },
  { label: 'total No of DPD ( up to 30 days) in last 12 months', key: 'no_of_dpd_upto_30days_in_last_12_months' },
  { label: 'total No of DPD ( > 30 up to 90 days) in last 12 months', key: 'no_of_dpd_30_to_90days_in_last_12_months' },
  { label: 'total No of DPD ( > 90 days) in last 12 months', key: 'no_of_dpd_greater_90days_in_last_12_months' },
  { label: 'Loans / Credi card - WO/ Settled <=50K', key: 'settled' },
  { label: 'Enquiries in the last 6 months', key: 'enquiries_in_last_6_months' },

]

export const RemarksTable = ({ data }) => {
  return (
    data.length ? (
      ((data?.ws_summary_data[0]?.profile_of_customer_and_business)?.split('\n'))?.map((item, i) => (
        <div key={i}>
          <br />
          <Typography variant='body'>{`${item}`}</Typography>
        </div>
      ))) : <p style={{ textAlign: 'center' }}>No remarks found</p>
  )
}

export const DemographicsTable = ({ data }) => {
  return (
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
              <TableCell>{item?.applicant_type}</TableCell>
              <TableCell>{item?.applicant_name}</TableCell>
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
  )
}

export const ShareHoldingTable = ({ data }) => {
  return (
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
              <TableCell>{item?.partner_director_type}</TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.designation}</TableCell>
              <TableCell>{item?.stake}</TableCell>
              <TableCell>{item?.remarks}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

export const BusinessAnalysisTable = ({ data }) => {
  return (

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
              <TableCell>{item?.financial_year}</TableCell>
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
  )
}

export const MonthlySalesTable = ({ data }) => {
  return (
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
              <TableCell>{item?.fuel_type}</TableCell>
              <TableCell>{item?.average_sales}</TableCell>
              <TableCell>{item?.cash_sales}</TableCell>
              <TableCell>{item?.credit_sales}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

export const FacultySalesTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow />
        <TableRow>
          <TableCell>Sales Type</TableCell>
          <TableCell>No of Nozzle</TableCell>
          <TableCell>Margin per litre</TableCell>
          <TableCell>Average sales per day (KL)</TableCell>
          <TableCell>Storage tank capacity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data?.ws_faculty_sales_data?.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{(item?.fuel_type).toUpperCase()}</TableCell>
              <TableCell>{item?.no_of_nozzle}</TableCell>
              <TableCell>{item?.margin_per_liter}</TableCell>
              <TableCell>{item?.average_sales_per_day_in_kl}</TableCell>
              <TableCell>{item?.storage_tank_capacity}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

export const BunkDetailsTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow />
        <TableRow>
          <TableCell>Work schedule</TableCell>
          <TableCell>Manager</TableCell>
          <TableCell>Cashier/supervisor</TableCell>
          <TableCell>Driver</TableCell>
          <TableCell>Pump boys</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data?.ws_bunk_data?.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item?.work_schedule}</TableCell>
              <TableCell>{item?.manager}</TableCell>
              <TableCell>{item?.cashier_or_supervisor}</TableCell>
              <TableCell>{item?.driver}</TableCell>
              <TableCell>{item?.pump_boys}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

export const FacultyBankDetailsTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow />
        <TableRow>
          <TableCell>Bank Name</TableCell>
          <TableCell>Type of account ( EDFS / OD/CC/CA)</TableCell>
          <TableCell>Limit</TableCell>
          <TableCell>ROI %</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data?.ws_faculty_bank_details?.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item?.main_bank}</TableCell>
              <TableCell>{item?.type_of_account}</TableCell>
              <TableCell>{item?.max_limit}</TableCell>
              <TableCell>{item?.roi_in_percent}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
export const BankDetailsTable = ({ data }) => {
  return (
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
  )
}

export const CibilAnalysisTable = ({ data }) => {
  return (
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
  )
}
export const DeviationTable = ({ data }) => {
  return (
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
  )
}

export const SanctionConditionTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow />
        <TableRow>
          <TableCell>Sanction Condition</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data?.ws_sanction_condition_data?.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item?.sanction_condition}</TableCell>
              <TableCell>{item?.description}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

export const ReferrenceTable = ({ data }) => {
  return (
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
  )
}

export const SummaryDataTable = ({ data }) => {
  return (
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
  )
}