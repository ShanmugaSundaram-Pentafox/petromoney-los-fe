import { Collapse, makeStyles, Paper, Typography } from '@material-ui/core';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { BankDetailsTable, BunkDetailsTable, BusinessAnalysisTable, CibilAnalysisTable, DemographicsTable, DeviationTable, FacultyBankDetailsTable, FacultySalesTable, MonthlySalesTable, ReferrenceTable, RemarksTable, ShareHoldingTable, SummaryDataTable } from './WorkingSheetTable';
import { getScoreCard } from '../../../services/common.service';

const useStyles = makeStyles(() => ({
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8
  },
  collapseCard:
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  }
}))

const WorkingSheetDrawer = ({ id }) => {
  const classes = useStyles()
  const [collapse, setCollapse] = useState();
  const { data } = useQuery('scorecard', () => getScoreCard(id), { refetchOnWindowFocus: false })

  const scoreCardData = data?.working_sheet

  const tableData = [
    { id: 1, name: 'Summary data', component: <SummaryDataTable data={scoreCardData} /> },
    { id: 2, name: 'Remarks', component: <RemarksTable data={scoreCardData} /> },
    { id: 3, name: 'Demographics data', component: <DemographicsTable data={scoreCardData} /> },
    { id: 4, name: 'Shareholding details', component: <ShareHoldingTable data={scoreCardData} /> },
    { id: 5, name: 'Business Analysis', component: <BusinessAnalysisTable data={scoreCardData} /> },
    { id: 6, name: 'Monthly Sales details', component: <MonthlySalesTable data={scoreCardData} /> },
    { id: 7, name: 'Infrastructure details', component: <FacultySalesTable data={scoreCardData} /> },
    { id: 8, name: 'Faculty details', component: <BunkDetailsTable data={scoreCardData} /> },
    { id: 9, name: 'Bank Account details', component: <FacultyBankDetailsTable data={scoreCardData} /> },
    { id: 10, name: 'Bank Statement details', component: <BankDetailsTable data={scoreCardData} /> },
    { id: 11, name: 'CIBIL Analysis', component: <CibilAnalysisTable data={scoreCardData} /> },
    { id: 12, name: 'Reference details', component: <ReferrenceTable data={scoreCardData} /> },
    { id: 13, name: 'Deviation details', component: <DeviationTable data={scoreCardData} /> }
  ]

  const handleClick = (id) => {
    if (id == collapse)
      setCollapse();
    else
      setCollapse(id);
  }
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant='h3' component='h3' style={{ cursor: 'pointer' }}>Working sheet</Typography>
      {
        scoreCardData?.ws_summary_data[0] ? (tableData?.map(item => {
          return (
            <Paper variant='outlined' key={item?.id} style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
              <div className={classes.collapseCard} onClick={() => handleClick(item.id)}>
                <Typography variant='h6' style={{ cursor: 'pointer' }}>{item?.name}</Typography>
                {collapse == item?.id ? <ArrowDropDownSharp /> : <ArrowRightOutlined />}
              </div>
              <Collapse in={collapse == item?.id}>
                {item.component}
              </Collapse>
            </Paper>
          )
        })) : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
      }
    </div>
  )
}
export default WorkingSheetDrawer;