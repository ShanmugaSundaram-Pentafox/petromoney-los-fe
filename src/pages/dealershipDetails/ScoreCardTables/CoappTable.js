import { Table, TableBody, TableCell as TableCellComp, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core'
import { head } from 'lodash'
import React from 'react'

const TableCell = withStyles(() => ({
    root: {
      border: '1px solid #eeeeee',
    },
}))(TableCellComp)

const coAppHeader = [
    { label: 'Total Score Possible', key: 'total_score_possible'},
    { label: 'Final Score', key: 'final_score_for_the_case'},
    { label: 'Finals Score %', key: 'finals_score_percent'},
    { label: 'Bureau Review for Individual Co-app', key: 'co_applicant_name'}
]

const CoappTable = ({data, type}) => {
    const co_app_score_data = data?.co_app_score_data?.filter(item => {return item?.type === type})
    const co_app_summary_data = head(data?.co_app_summary_data?.filter(item => {return item?.type === type}))

  return (
    <div>
        <TableContainer>
            <Table style={{width: '60%'}}>
                <TableBody>
                    {
                        coAppHeader?.map((field, i) => (
                            <TableRow key={i}>
                                <TableCell>{field?.label}</TableCell>
                                <TableCell>{co_app_summary_data?.[field?.key]}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Attributes</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Actual Input</TableCell>
                        <TableCell>Level 2 Score %</TableCell>
                        <TableCell>Level 1 Score</TableCell>
                        <TableCell>Level 1 Max Score</TableCell>
                        <TableCell>Level 1 Score %</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        co_app_score_data?.map((field, i) => (
                            <TableRow key={i}>
                                <TableCell>{field?.sr_no}</TableCell>
                                <TableCell>{field?.attributes}</TableCell>
                                <TableCell>{field?.lvl}</TableCell>
                                <TableCell>{field?.weights}</TableCell>
                                <TableCell>{field?.actual_input}</TableCell>
                                <TableCell>{field?.lvl2_score_percent}</TableCell>
                                <TableCell>{field?.lvl1_score}</TableCell>
                                <TableCell>{field?.lvl1_max_score}</TableCell>
                                <TableCell>{field?.lvl1_score_percent}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default CoappTable