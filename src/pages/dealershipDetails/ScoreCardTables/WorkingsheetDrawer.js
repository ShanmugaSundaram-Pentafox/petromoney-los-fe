import { Collapse, Paper, Tooltip, Typography } from '@material-ui/core';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import WorkingSheetTable from './WorkingSheetTable';
import { getScoreCard } from '../../../services/common.service';

const WorkingSheetDrawer = ({ id }) => {
  const [collapse, setCollapse] = useState(false);
  const { data: scoreCardData = [] } = useQuery('scorecard', () => getScoreCard(id), { refetchOnWindowFocus: false })
  return (
    <Paper variant='outlined' style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
      <Tooltip title={!collapse ? 'click to view the working sheet' : 'click to close the working sheet'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }} onClick={() => setCollapse(!collapse)}>
          <Typography variant='h6' style={{ cursor: 'pointer' }}>Working sheet</Typography>
          {collapse ? <ArrowDropDownSharp /> : <ArrowRightOutlined />}
        </div>
      </Tooltip>
      <Collapse in={collapse}>
        <div style={{ paddingLeft: 10, paddingBottom: 10, cursor: 'default' }}>
          <WorkingSheetTable data={scoreCardData?.working_sheet} />
        </div>
      </Collapse>
    </Paper>
  )
}
export default WorkingSheetDrawer;