import { Box, Table, TableBody, TableCell as TableCellComp, TableContainer, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import { head } from 'lodash';
import React from 'react'
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import Currency from '../../../components/Number/Currency';

const TableCell = withStyles(() => ({
    root: {
      border: '1px solid #eeeeee',
    },
}))(TableCellComp)

const CamInputTable = ({data}) => {
    const caseSummary = head(data?.case_summary_data)
    const cam_miscellaneous_data = head(data?.cam_miscellaneous_data)

  return (
    <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant='h6'>Case Summary</Typography>
            <ViewData title="Date" value='10/12/2020' />
        </div>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Particulars</TableCell>
                        <TableCell colSpan={4}>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Loan Application ID</TableCell>
                        <TableCell colSpan={4}>{caseSummary?.loan_app_id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Fuel Category</TableCell>
                        <TableCell colSpan={4}>{caseSummary?.fuel_category}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name of Fuel Station</TableCell>
                        <TableCell colSpan={4}>{caseSummary?.fuel_station_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Business Entity Type</TableCell>
                        <TableCell colSpan={4}>{caseSummary?.business_entity_type}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Internal PM Score for the case</TableCell>
                        <TableCell colSpan={4}>{caseSummary?.internal_pm_score}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant='head'>Demographics</TableCell>
                        <TableCell variant='head'>Name</TableCell>
                        <TableCell variant='head'>CIBIL Score</TableCell>
                        <TableCell variant='head'>PM Score</TableCell>
                        <TableCell variant='head'>Vintage/Age (Yrs)</TableCell>
                    </TableRow>
                    {
                        data?.demographics_data?.map((field, i) => (
                            <TableRow key={i}>
                                <TableCell>{field?.demographics}</TableCell>
                                <TableCell>{field?.name}</TableCell>
                                <TableCell>{field?.cibil_score}</TableCell>
                                <TableCell>{field?.pm_score}</TableCell>
                                <TableCell>{field?.vintage}</TableCell>
                            </TableRow>
                        ))
                    }
                    <TableRow>
                        <TableCell colSpan={2}>Loan Amount (Rs)</TableCell>
                        <TableCell colSpan={3}><Currency value={caseSummary?.loan_amt}/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Applicable interest Rate Per Annum %</TableCell>
                        <TableCell colSpan={3}>{caseSummary?.applicable_interest_rate_per_annum}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Loan Tenure</TableCell>
                        <TableCell colSpan={3}>{caseSummary?.loan_tenure}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Annual Interest on Fuel Credit (Rs)</TableCell>
                        <TableCell colSpan={3}><Currency value={caseSummary?.annual_interest_on_fuel_credit}/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>FOIR %</TableCell>
                        <TableCell colSpan={3}>{caseSummary?.foir_percent}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box pt={2}>
                <Typography variant='h6'>Deviations From Policy</Typography>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Deviation Particulars</TableCell>
                        <TableCell>Policy Norm</TableCell>
                        <TableCell>Actual</TableCell>
                        <TableCell>Logic for Deviations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.deviation_from_policy_data?.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell>{item?.deviation_particulars}</TableCell>
                                <TableCell>{item?.policy_norm}</TableCell>
                                <TableCell>{item?.actual}</TableCell>
                                <TableCell>{item?.logic_for_deviation}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Box pt={2}>
                <Typography variant='h6'>Credit Managers Key observations</Typography>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Observation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.cam_comments?.filter(item => {return item?.type === 'key_observations'})?.map((field, i) => (
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{field?.comments}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Table style={{marginTop: 16}}>
                <TableBody>
                    <TableRow>
                        <TableCell>Recommendation of Credit Manager</TableCell>
                        <TableCell>{cam_miscellaneous_data?.credit_manager_recommendation}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Decision</TableCell>
                        <TableCell>{cam_miscellaneous_data?.decision}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box pt={2}>
                <Typography variant='h6'>Approval Conditions/Rejection Reasons</Typography>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Observation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.cam_comments?.filter(item => {return item?.type === 'approval_conditions'})?.map((field, i) => (
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{field?.comments}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Table style={{marginTop: 16}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Recommending Officer&apos;s Name</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Signature</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{cam_miscellaneous_data?.recommending_officer_name}</TableCell>
                        <TableCell>{cam_miscellaneous_data?.recommending_officer_designation}</TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
                <TableHead>
                    <TableRow>
                        <TableCell>Name of Approver</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Signature</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{cam_miscellaneous_data?.approver_name}</TableCell>
                        <TableCell>{cam_miscellaneous_data?.approver_officer_designation}</TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default CamInputTable