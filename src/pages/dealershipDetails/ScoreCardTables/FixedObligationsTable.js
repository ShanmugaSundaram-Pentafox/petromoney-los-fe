import { Table, TableBody, TableCell as TableCellComp, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core'
import React from 'react'
import Currency from '../../../components/Number/Currency'

const TableCell = withStyles(() => ({
    root: {
      border: '1px solid #eeeeee',
    },
}))(TableCellComp)

const FixedObligationsTable = ({data}) => {

  return (
      <TableContainer>
          <Table>
              <TableHead>
                  <TableRow>
                      <TableCell>Lender Name</TableCell>
                      <TableCell>Loan Type</TableCell>
                      <TableCell>Sanctioned Amount / DP</TableCell>
                      <TableCell>Loan in Name of</TableCell>
                      <TableCell>Loan Ownership</TableCell>
                      <TableCell>Secured or Unsecured</TableCell>
                      <TableCell>ROI% avilable</TableCell>
                      <TableCell>ROI% as per records</TableCell>
                      <TableCell>ROI% as per Policy</TableCell>
                      <TableCell>Facility Tenure Available</TableCell>
                      <TableCell>Facility Tenure as per records (Mths)</TableCell>
                      <TableCell>Facility Tenure as per Policy (Mths)</TableCell>
                      <TableCell>EMI Available</TableCell>
                      <TableCell>EMI as per records (Rs)</TableCell>
                      <TableCell>EMI as per Policy (Rs)</TableCell>
                      <TableCell>Monthly Oblig (Rs)</TableCell>
                      <TableCell>Principal Outstanding (Rs)</TableCell>
                      <TableCell>Balance Tenure (Mths)</TableCell>
                      <TableCell>Loan Vintage (Mths)</TableCell>
                      <TableCell>Consider in Obligations</TableCell>
                      <TableCell>Reason for not considering in obligations</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {
                      data?.fixed_obligations?.map((item, i) => {
                        return(
                            <TableRow key={i}>
                                <TableCell>{item.lender_name}</TableCell>
                                <TableCell>{item.loan_type}</TableCell>
                                <TableCell><Currency value={item.sanctioned_amt}/></TableCell>
                                <TableCell>{item.loan_in_name_of}</TableCell>
                                <TableCell>{item.loan_ownership}</TableCell>
                                <TableCell>{item.secured_or_unsecured}</TableCell>
                                <TableCell>{item.roi_percent_available}</TableCell>
                                <TableCell>{item.roi_percent_as_per_rec}</TableCell>
                                <TableCell>{item.roi_percent_as_per_policy}</TableCell>
                                <TableCell>{item.facility_tenure_avail}</TableCell>
                                <TableCell>{item.facility_tenure_as_per_rec}</TableCell>
                                <TableCell>{item.facility_tenure_as_per_policy}</TableCell>
                                <TableCell>{item.emi_avail}</TableCell>
                                <TableCell><Currency value={item.emi_as_per_rec}/></TableCell>
                                <TableCell><Currency value={item.emi_as_per_policy}/></TableCell>
                                <TableCell><Currency value={item.mon_oblig}/></TableCell>
                                <TableCell><Currency value={item.principle_outstanding}/></TableCell>
                                <TableCell>{item.bal_tenure}</TableCell>
                                <TableCell>{item.loan_vintage}</TableCell>
                                <TableCell>{item.consider_in_obligations}</TableCell>
                                <TableCell>{item.reason_for_not_considering_obligs}</TableCell>
                            </TableRow>
                        )
                      })
                  }
              </TableBody>
          </Table>
      </TableContainer>
  )
}

export default FixedObligationsTable