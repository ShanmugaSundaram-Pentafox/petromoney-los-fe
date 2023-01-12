import { TableContainer, TableRow, TableHead, TableCell as TableCellComp, Table, TableBody, withStyles, Typography, makeStyles } from '@material-ui/core'
import head from 'lodash-es/head'
import React from 'react'

const useStyles = makeStyles(() => ({
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8
  },
  tableStyle: {
    marginTop: 8
  }
}))

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp)

const BureauInputTable = ({ data, header }) => {
  const classes = useStyles();
  const header_data = head(header?.scorecard_master_data)

  let Particulars = [
    { key: 'name', label: 'Name' },
    { key: 'vintage', label: 'Vintage/Age (Years)' },
    { key: 'commercial_bureau', label: 'Commercial Bureau Used' },
    { key: 'cmr_cibil_score', label: 'CMR Equivalent/CIBIL Score' },
    { key: 'co_pm_score', label: 'PM Score of Individual Co-applicants' },
    { key: 'cibil_enquiry_cnt', label: 'No of CIBIL enquiries in last 6 months' },
    { key: 'vintage_with_credit_bureau', label: 'Vintage with Credit Bureau in Years' },
    { key: 'loans_closed_with_no_negative_status', label: 'No of loans closed with no negative status (current bal zero)' },
    { key: 'loans_in_bureau_report', label: 'Loans in Bureau Report (Yes/No)' },
    { key: 'highest_dpt_bracket_for_loans', label: 'Highiest DPD Bracket (in last 6 months) - For Loans' },
    { key: 'no_of_times_in_highest_dpt_for_loans', label: 'No of times in highiest DPD (in last 6 months) - For Loans' },
    { key: 'credit_card_in_bureau_report', label: 'Credit Card in Bureau Report (Yes/No)' },
    { key: 'highest_dpt_bracket_for_credit_cards', label: 'Highiest DPD Bracket (in last 6 months) - For Credit Cards' },
    { key: 'no_of_times_in_highest_dpt_for_credit_cards', label: 'No of times in highiest DPD (in last 6 months) - For Credit Cards' },
    { key: 'status_for_loans_and_credit_cards', label: 'Status - For Loans & Credit Cards' }
  ]

  return (
    <>
      <Typography variant='h6'>Demographics & Credit Bureau Inputs</Typography>
      {
        data?.demo_bureau_inputs?.length ?
          <TableContainer className={classes.tableStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name of Fuel Station</TableCell>
                  <TableCell variant='body'>{header_data?.fuel_station_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Entity Type</TableCell>
                  <TableCell variant='body'>{header_data?.entity_type}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
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
                  Particulars.map((field, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{field?.label}</TableCell>
                        {
                          data?.demo_bureau_inputs?.map((item, i) => {
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
          </TableContainer> : <Typography className={classes.subtitle} variant='body2'>No credit bureau data found!</Typography>
      }
    </>
  )
}

export default BureauInputTable