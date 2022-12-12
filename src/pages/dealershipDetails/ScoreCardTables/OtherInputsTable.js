import { Box, makeStyles, Table, TableBody, TableCell as TableCellComp, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import head from 'lodash-es/head';
import React from 'react'
import Currency from '../../../components/Number/Currency'

const useStyles = makeStyles(() => ({
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8
  }
}))

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp)

const OtherInputsTable = ({ data }) => {
  const classes = useStyles()
  const other_inputs_leverage_cals_data = head(data?.other_inputs_leverage_cals_data)
  const other_key_inputs = head(data?.other_key_inputs)

  return (
    <div>
      <Typography variant='h6'>Key Inputs</Typography>
      {
        other_key_inputs ?
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Particulars</TableCell>
                <TableCell>Inputs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                particulars?.map((field, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{field.label}</TableCell>
                      <TableCell>{other_key_inputs?.[field.key]}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table> : <Typography className={classes.subtitle} variant="body2">No data found!</Typography>
      }
      <Box pt={3}>
        <Typography variant='h6'>Turnover & Net Profit Calculations</Typography>
        {
          data?.other_inputs_turnover_data?.length ?
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} align='center'>Particulars</TableCell>
                  <TableCell>Latest FY</TableCell>
                  <TableCell>Previous FY</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='body'>{data?.other_inputs_turnover_data?.find(item => { return item.type === 'latest_fy' })?.year}</TableCell>
                  <TableCell variant='body'>{data?.other_inputs_turnover_data?.find(item => { return item.type === 'previous_fy' })?.year}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  netProfitField.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item?.label}</TableCell>
                        {
                          data?.other_inputs_turnover_data?.map(field => {
                            return (
                              <>
                                <TableCell>{field[item.key]}</TableCell>
                              </>
                            )
                          })
                        }
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table> : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
        }
      </Box>
      <Box pt={3}>
        <Typography variant='h6'>Leverage Calculations</Typography>
        {
          other_inputs_leverage_cals_data ?
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Particulars</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Net Worth (Equity+Reserves+Quasi Capital) (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.net_worth} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Existing Loan Obligations Outstanding (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.existing_loan_obligations_outstanding} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PM Exposure (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.pm_exposure} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Peak CC / OD Utilisation (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.average_peak_cc_od_utilisation} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Any Other Debt outstanding (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.any_other_debt_outstanding} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Debt Outstanding (Rs)</TableCell>
                  <TableCell><Currency value={other_inputs_leverage_cals_data?.total_debt_outstanding} /></TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#B4CFB0' }} >
                  <TableCell>Leverage (No of Times)</TableCell>
                  <TableCell>{other_inputs_leverage_cals_data?.leverage_no_of_times}</TableCell>
                </TableRow>
              </TableBody>
            </Table> : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
        }
      </Box>
    </div>
  )
}

export default OtherInputsTable;

export const particulars = [
  { key: 'product', label: 'Product' },
  { key: 'fuel_credit_category', label: 'Fuel Credit Category' },
  { key: 'omc_name', label: 'OMC Name' },
  { key: 'loan_application_id', label: 'Loan Application ID' },
  { key: 'fuel_credit_amount_req', label: 'Fuel Credit Amount Required (Rs)' },
  { key: 'existing_exposure_with_petromoney', label: 'Existing exposure with PetroMoney (Rs)' },
  { key: 'is_exisiting_exposure_with_pm_on_same_or_diff_outlet', label: 'Is Existing Exposure with PM on same outlet or different outlet' },
  { key: 'total_exposure', label: 'Total Exposure' },
  { key: 'fuel_credit_roi', label: 'Fuel Credit ROI (PA%)' },
  { key: 'cibil_score_of_main_individual_co_applicant', label: 'CIBIL score of Main Individual Co-applicant' },
  { key: 'is_cibil_clean', label: 'Is CIBIL Clean? (Yes/No)' },
  { key: 'start_date_with_omc', label: 'Start date with OMC' },
  { key: 'date_of_login_of_file_with_petromoney', label: 'Date of Login of the file with Petromoney' },
  { key: 'business_vintage_with_omc_in_years', label: 'Business Vintage with OMC in Years' },
  { key: 'foir_prior_to_current_petromoney_exposure', label: 'FOIR prior to Current Petromoney Exposure' },
  { key: 'vintage_with_main_banker', label: 'Vintage with Main Banker' },
  { key: 'number_of_inward_returns_in_last_6_months', label: 'Number of Inward returns in Last 6 Months' },
  { key: 'abb_to_proposed_pm_fixed_obligations', label: 'ABB to Proposed PM Fixed Obligations' },
  { key: 'change_in_net_profit_over_sales_for_last_2_years', label: 'Change in Net Profit over Sales % for Last 2 Years' },
  { key: 'inventory_as_on_31st_march_of_latest_completed_fy', label: 'Inventory as on 31st March of Latest Completed FY (Rs)' },
  { key: 'debtors_as_on_31st_march_of_latest_completed_fy', label: 'Debtors as on 31st March of Latest Completed FY (Rs)' },
  { key: 'number_of_other_services_at_fuel_station', label: 'Number of Other Services at Fuel Station' },
  { key: 'borrower_owning_any_other_immovable_property', label: 'Borrower owning any other immovable property (Yes/No)' },
  { key: 'pd_officers_overall_assessment', label: 'PD Officer"s Overall Assessment' },
];

export const netProfitField = [
  { label: 'Turnover (Rs)', key: 'turnover' },
  { label: 'Net Profit before tax (Rs)', key: 'net_profit_before_tax' },
  { label: 'NP %', key: 'np_percent' },
  { label: 'NP % Change', key: 'np_percent_change' },
  { label: 'Income tax for the Year (Rs)', key: 'income_tax_for_the_year' }
]