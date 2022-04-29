import { Table, TableBody, TableCell as TableCellComp, TableContainer, TableHead, TableRow, withStyles, Typography, makeStyles } from '@material-ui/core'
import { head } from 'lodash'
import React from 'react'

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

const DeviationsInputTable = ({data, header}) => {
    const classes = useStyles()
    const header_data = head(header?.scorecard_master_data)

  return (
    <>
        <Typography variant='h6'>Deviation Details</Typography>
        {
             data?.deviations?.length ?
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>Fuel Credit Category</TableCell>
                            <TableCell colSpan={2} variant='body'>{header_data?.fuel_credit_category}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Final Approvers Level</TableCell>
                            <TableCell colSpan={2} variant='body'>{header_data?.final_approver_level}</TableCell>
                        </TableRow>
                    </TableHead>
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
                                        <TableCell>{item?.deviation}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer> : <Typography className={classes.subtitle} variant='body2'>No deviations found!</Typography>
        }
    </>
  )
}

export default DeviationsInputTable