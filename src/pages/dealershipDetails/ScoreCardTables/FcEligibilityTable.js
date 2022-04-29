import { Drawer, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@material-ui/core'
import { head, sumBy } from 'lodash'
import React, { useState } from 'react'
import Currency from '../../../components/Number/Currency'
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
    subtitle: {
        color: 'rgba(0,0,0,0.4)',
        marginTop: 8
    }
}))

const FcEligibilityTable = ({data}) => {
    const classes = useStyles()
    const [tableView, setTableView] = useState()
    const fc_eligibility_total_salary_data = head(data?.fc_eligibility_total_salary_data)
    const eligibilityFuelCredit = [
        {item: 'A', label: 'Income from Fuel Sales', key: null, input: null},
        {item: null, label: 'Annual Gross Income from sale of HSD', key: null, input: 'income_fuel_sales'},
        {item: null, label: 'Annual Gross Income from sale of MS', key: null, input: 'income_fuel_sales'},
        {item: null, label: 'Annual Gross Income from sale of CNG / Auto LPG', key: null, input: 'income_fuel_sales'},
        {item: null, label: 'Other Annual Gross Income (Lubricants etc.)', key: null, input: 'income_fuel_sales'},
        {item: null, label: 'Total Gross Income from Fuel Sale', key: 'fuel_sale_total_gross_income', input: null},
        {item: 'B1', label: 'Rental Income from OMC', key: '', input: null},
        {item: null, label: 'Lease of Land to the OMC (Rs per annum)', key: 'lease_of_land_to_omc', input: 'income_from_lease_of_land'},
        {item: null, label: 'Commission on transportation of Fuel (Rs per annum)', key: 'commision_on_fuel_transportation', input: 'commission_on_fuel_transportation'},
        {item: null, label: 'Total Rental Income', key: 'total_rental_income', input: null},
        {item: 'B2', label: 'Agricultural Income', key: null, input: null},
        {item: null, label: 'As per latest FY ITR', key: 'agri_inc_latest_fy_itr', input: null},
        {item: null, label: 'As per Previous FY ITR', key: 'agri_inc_prev_fy_itr', input: null},
        {item: null, label: 'Total Agricultural Income Considered', key: 'total_agricultural_income_considered', input: null},
        {item: 'C', label: 'Gross Income considered (A+B1+B2)', key: 'gross_income_considered', input: null},
        {item: 'D', label: 'Annual Expenses', key: null, input: null},
        {item: null, label: 'Electricity (From Financials / PD Report)', key: 'annual_exp_electricity', input: null},
        {item: null, label: 'Salaries', key: 'annual_exp_salaries', input: 'salaries'},
        {item: null, label: 'Truck Maintenance  (From Financials / PD Report)', key: 'annual_exp_truck_maintenance', input: null},
        {item: null, label: 'Fuel Transportation Expenses (From Financials / PD Report)', key: 'annual_exp_fuel_transport', input: null},
        {item: null, label: 'Loss of Fuel during Transportation', key: 'loss_of_fuel_during_transportation', input: 'loss_of_fuel_in_transportation'},
        {item: null, label: 'Insurance Premium (Annual)', key: 'annual_exp_insuracne_premium', input: null},
        {item: null, label: 'License Fee Recovery (LFR) Charges', key: 'annual_exp_license_fee_recovery', input: null},
        {item: null, label: 'Other running expenses (From Financials / PD Report)', key: 'annual_exp_other_runnings', input: null},
        {item: null, label: 'Total Expenses other than Depreciation, Interest & Tax', key: 'tot_expenses_other_than_depreciation_interest_tax', input: null},
        {item: 'E', label: 'EBIDTA (C-D)', key: 'ebidta', input: ''},
        {item: 'F', label: 'Existing Loan obligations in form of EMI (Annual Figure)', key: 'existing_loan_obligations', input: null},
        {item: 'G', label: 'Interest per annum on Working Capital Limits (Calculated)', key: 'interest_per_annum_on_working_capital_limits', input: 'interest_on_working_capitals'},
        {item: 'H', label: 'Total Annual Existing Obligations (F + G)', key: 'total_annual_existing_obligations', input: null},
        {item: 'I', label: 'Max FOIR % Considered', key: 'max_foir_percent', input: null},
        {item: 'J', label: '90 % of EBIDTA (E × 90 %)', key: '90_percent_of_ebidta', input: null},
        {item: 'K', label: 'Eligible for Loan as per FOIR (Yes / No)', key: 'eligible_for_loan_as_per_foir', input: null},
        {item: 'L', label: 'Max Monthly Interest possible on fuel credit', key: 'max_monthly_interest_possible_on_fuel_credit', input: null},
        {item: 'M', label: 'Applicable Interest Rate for Fuel Credit Per Annum %', key: 'applicable_interest_rate_for_fuel_credit_per_annum_percent', input: null},
        {item: 'N', label: 'Max Fuel Credit possible as per FOIR on EBITDA', key: 'max_fuel_credit_possible_as_per_foir_on_ebitda', input: null},
        {item: 'O', label: 'Score as per Scorecard', key: 'score_as_per_scorecard', input: null},
        {item: 'P', label: 'Score Impact on Fuel Credit Exposure %', key: 'score_impact_on_fuel_credit_exposure_percent', input: null},
        {item: 'Q', label: 'Max Fuel Credit Exposure Possible post Score Impact', key: 'max_fuel_credit_exposure_possible_post_score_impact', input: null},
        {item: 'R', label: 'Max Exposure Cap as per policy (Rs)', key: 'max_exposure_cap_as_per_policy', input: null},
        {item: 'S', label: 'Exisiting PetroMoney Exposures', key: 'exisiting_petromoney_exposures', input: null},
        {item: 'T', label: 'Max Loan Possible (After applying policy caps) (Rs)', key: 'max_loan_possible_after_applying_policy_caps', input: null},
        {item: 'U', label: 'Fuel Credit Amount Applied for (Rs)', key: 'fuel_credit_amount_applied', input: null},
        {item: 'V', label: 'Maximum Fuel Credit Limit Based on KL Sales', key: 'maximum_fuel_credit_limit_based_on_kl_sales', input: null},
        {item: 'W', label: 'Fuel Credit Amount to be given (Rs)', key: 'fuel_credit_amount_to_be_given', input: null},
        {item: 'X', label: 'Annual Interest on Fuel Credit Amount (Rs)', key: 'annual_interest_on_fuel_credit_amount', input: null},
        {item: 'Y', label: 'FOIR % for Fuel credit', key: 'foir_percent_for_fuel_credit', input: null},
        {item: 'Z', label: 'Eligibility', key: 'eligibility', input: null},
    ]

    const fuelSalesTable = [
        {tableName: 'Latest FY*', tableType: 'latest_fy'},
        {tableName: 'Previous FY', tableType: 'previous_fy'},
        {tableName: 'Considered', tableType: 'considered'}
    ]

    const fc_summary_data = head(data?.fc_summary_data)
  return (
    <div>
        <Typography variant='h6'>Eligibility Calculator for Fuel Credit</Typography>
        {
            fc_summary_data ?
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Particulars</TableCell>
                            <TableCell>Considered</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            eligibilityFuelCredit?.map((item, index) => {
                                return(
                                    <TableRow key={index}>
                                        <TableCell><strong>{item?.item}</strong></TableCell>
                                        <TableCell>{item?.label}</TableCell>
                                        <TableCell>{fc_summary_data?.[item?.key]}<span style={{cursor: 'pointer', color: '#1976d2', textDecoration: 'underlined', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}} onClick={() => setTableView(item?.input)}>{item?.input && '>>'}</span></TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer> : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
        }
        <Drawer
        anchor="right"
        open={tableView === 'income_fuel_sales'}
        onClose={() => setTableView()}
        variant="temporary"
        >
            <TableContainer>
                <div style={{margin: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='h5'>Income from Fuel Sales</Typography>
                    <IconButton onClick={() => setTableView()} size='small'><CloseIcon fontSize='small' /></IconButton>
                </div>
                {
                    fuelSalesTable?.map((table, index) => {
                        return(
                            <Table key={index}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={4} align='center'>{table?.tableName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>UOM</TableCell>
                                        <TableCell>Gross Margins Per Litre</TableCell>
                                        <TableCell>Amount (Rs)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.fc_eligibility_yearwise_data?.filter(item => {return item?.type === table?.tableType})?.map((field, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{field?.quantity}</TableCell>
                                                <TableCell>{field?.uom}</TableCell>
                                                <TableCell>{field?.gross_margin_per_yr}</TableCell>
                                                <TableCell><Currency value={field?.amount}/></TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell><strong>Total</strong></TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell><strong><Currency value={sumBy(data?.fc_eligibility_yearwise_data?.filter(item => {return item?.type === table?.tableType}), 'amount').toFixed(2)} /></strong></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        )
                    })
                }
            </TableContainer>
        </Drawer>
        <Drawer
        anchor="right"
        open={
            tableView === 'income_from_lease_of_land' ||
            tableView === 'commission_on_fuel_transportation' ||
            tableView === 'loss_of_fuel_in_transportation' ||
            tableView === 'interest_on_working_capitals'
        }
        onClose={() => setTableView()}
        variant="temporary"
        >
            <>
                <div style={{margin: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='h5'>
                        {
                            tableView === 'income_from_lease_of_land' && 'Income from Lease of Land to the OMC' ||
                            tableView === 'commission_on_fuel_transportation' && 'Commission on transportation of Fuel' ||
                            tableView === 'loss_of_fuel_in_transportation' && 'Loss of Fuel in transportation' ||
                            tableView === 'interest_on_working_capitals' && 'Interest on Working Capital i.e. on CC/OD Limits'
                        }
                    </Typography>
                    <IconButton onClick={() => setTableView()} size='small'><CloseIcon fontSize='small' /></IconButton>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Particulars</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data?.fc_eligibility_particulars?.filter(item => {return item?.type === tableView})?.map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{field?.particulars}</TableCell>
                                    <TableCell style={{minWidth: '10rem'}}>{field?.count}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </>
        </Drawer>
        <Drawer
        anchor="right"
        open={tableView === 'salaries'}
        onClose={() => setTableView()}
        variant="temporary"
        >
            <>
                <div style={{margin: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='h5'>Salary Workings</Typography>
                    <IconButton onClick={() => setTableView()} size='small'><CloseIcon fontSize='small' /></IconButton>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Particulars</TableCell>
                            <TableCell>No of Personnel Per Shift</TableCell>
                            <TableCell>Monthly Salary Considered per employee per shift</TableCell>
                            <TableCell>Shifts</TableCell>
                            <TableCell>Total Salary</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data?.fc_eligibility_salary_data?.map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{field?.particulars}</TableCell>
                                    <TableCell>{field?.no_of_personnel_per_shift}</TableCell>
                                    <TableCell><Currency value={field?.mon_salary_considered}/></TableCell>
                                    <TableCell>{field?.shifts}</TableCell>
                                    <TableCell><Currency value={field?.tot_salary}/></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell colSpan={2}>Total Salary Per Month</TableCell>
                            <TableCell />
                            <TableCell><Currency value={fc_eligibility_total_salary_data?.total_salary_per_month}/></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell colSpan={2}>Total Salary Per Annum</TableCell>
                            <TableCell />
                            <TableCell><Currency value={fc_eligibility_total_salary_data?.total_salary_per_annum}/></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell colSpan={2}>Total Salary per annum as per Latest Completed FY Financials</TableCell>
                            <TableCell />
                            <TableCell><Currency value={fc_eligibility_total_salary_data?.total_salary_per_annum_per_latest_fy}/></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </>

        </Drawer>
    </div>
  )
}

export default FcEligibilityTable