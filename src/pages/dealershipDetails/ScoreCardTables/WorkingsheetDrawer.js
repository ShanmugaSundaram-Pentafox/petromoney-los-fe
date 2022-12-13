import { Collapse, Paper, Typography } from '@material-ui/core';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import React,{ useState } from 'react';
import { useQuery } from 'react-query';
import WorkingSheetTable from './WorkingSheetTable';
import { getScoreCard } from '../../../services/common.service';

const WorkingSheetDrawer = ({ id }) => {
  const [collapse, setCollapse] = useState(false);
  const { data: scoreCardData = [] } = useQuery('scorecard', () => getScoreCard(id), { refetchOnWindowFocus: false })
  return (
    <Paper variant='outlined' style={{ marginTop: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }} onClick={() => setCollapse(!collapse)}>
        <Typography variant='h6' style={{ cursor: 'pointer' }}>Working sheet</Typography>
        {collapse ? <ArrowDropDownSharp /> : <ArrowRightOutlined />}
      </div>
      <Collapse in={collapse}>
        <div style={{ paddingLeft: 10, paddingBottom: 10 }}>
          <WorkingSheetTable data={scoreCardData?.working_sheet} />
        </div>
      </Collapse>
    </Paper>
  )
}
export default WorkingSheetDrawer;