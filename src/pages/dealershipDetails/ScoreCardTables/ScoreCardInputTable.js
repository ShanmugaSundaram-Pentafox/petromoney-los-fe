import { Table, TableCell as TableCellComp, TableContainer, TableHead, TableRow, TableBody, withStyles, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { head } from 'lodash';

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

let scoreCardSummary = [
    { label: 'Total Exposure with PetroMoney', key: 'total_exposure_with_petromoney' },
    { label: 'Bureau Score of Individual Co-app 1', key: 'bureau_score_of_individual_co_app_1'},
    { label: 'Business Vintage with OMC in Years', key: 'business_vintage_with_omc_in_years'},
    { label: 'No of Individual applicants', key: 'no_of_individual_applicants'},
    { label: 'Total Score Possible', key: 'total_score_possible'},
    { label: 'Final Score for the case', key: 'final_score_for_the_case'},
    { label: 'Finals Score %', key: 'finals_score_percent'}
]

const ScoreCardInputTable = ({data}) => {
    const classes = useStyles()
  return (
      <>
        <Typography variant='h6'>Score Card Details</Typography>
        {
            data?.score_card_data ?
            <TableContainer>
                <Table style={{width: '60%'}}>
                    <TableBody>
                        {
                            scoreCardSummary?.map((item, i) => {
                                return(
                                    <TableRow key={i}>
                                        <TableCell>{item?.label}</TableCell>
                                        <TableCell>{head(data?.score_card_summary_data)?.[item?.key]}</TableCell>
                                    </TableRow>
                                )
                            })
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
                            data?.score_card_data?.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item?.sr_no}</TableCell>
                                    <TableCell>{item?.attributes}</TableCell>
                                    <TableCell>{item?.lvl}</TableCell>
                                    <TableCell>{item?.weights}</TableCell>
                                    <TableCell>{item?.actual_input}</TableCell>
                                    <TableCell>{item?.lvl2_score_percent}</TableCell>
                                    <TableCell>{item?.lvl1_score}</TableCell>
                                    <TableCell>{item?.lvl1_max_score}</TableCell>
                                    <TableCell>{item?.lvl1_score_percent}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer> : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
        }
      </>
  )
}

export default ScoreCardInputTable