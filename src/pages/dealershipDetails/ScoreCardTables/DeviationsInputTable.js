import { Table, TableBody, TableCell as TableCellComp, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core'
import React from 'react'

const TableCell = withStyles(() => ({
    root: {
      border: '1px solid #eeeeee',
    },
}))(TableCellComp)

const DeviationsInputTable = ({data}) => {

  return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Sr.No</TableCell>
                    <TableCell>Deviation Particulars</TableCell>
                    <TableCell>Deviation Code</TableCell>
                    <TableCell>Policy Standard</TableCell>
                    <TableCell>Deviation from policy Allowed</TableCell>
                    <TableCell>Actual Value</TableCell>
                    <TableCell>Deviation<br/>1.Policy Norms Met<br/>2.Deviation From Policy<br/>3.Not Allowed to Deviate</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    data?.deviations?.map((item, i) => {
                        return(
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{item?.deviation_particulars}</TableCell>
                                <TableCell>{item?.deviation_code}</TableCell>
                                <TableCell>{item?.policy_std}</TableCell>
                                <TableCell>{item?.deviation_fm_policy_allowed}</TableCell>
                                <TableCell>{item?.actual_val}</TableCell>
                                <TableCell>{item?.deviation_particulars}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    </TableContainer>
  )
}

export default DeviationsInputTable