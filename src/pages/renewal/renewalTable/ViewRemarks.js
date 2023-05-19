import { Box, Divider, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import React, { useState, useEffect } from 'react';
import { getRenewalRemarks } from '../../../services/renewal.service';

const useStyles = makeStyles((theme) => ({
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  timelineItem: {
    '&.MuiTimelineItem-missingOppositeContent': {
      '&:before': {
        display: 'none'
      }
    },
  }

}));

const ViewRemarks = ({ filterType, loanId, handleClose }) => {
  const classes = useStyles();
  const [remarks, setRemarks] = useState([])

  useEffect(() => {
    getRenewalRemarks(loanId, filterType)
      .then((res) => {
        setRemarks(res)
      })
      .catch((err) => console.log('remarks fetch err >>>', err))
  }, [loanId])
  return (
    <div className={classes.sidePanelWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>{'Remark'}</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <Divider />
      <Timeline align="left">
        {
          remarks?.map((remark, id) => {
            return (
              <TimelineItem key={id} className={classes.timelineItem}>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <Box mt={'-2px'}>
                      <p size='12px'><strong>{remark.creator_name}</strong></p>
                      <p sx={{ fontSize: 9, marginTop: '-5px' }}>
                        ({remark?.remark_type})
                      </p>
                    </Box>
                    <Box mt={'-2px'}>
                      <p style={{ fontSize: 9 }}>
                        {remark?.created_date}
                      </p>
                    </Box>
                  </Box>
                  <div style={{ marginTop: 12 }}>
                    {remark?.reason ?
                      <Typography size='xs'>
                        Reason: {remark?.reason}
                      </Typography> : null
                    }
                    <Typography
                      size='xs'
                      sx={{
                        maxWidth: '80%',
                        maxHeight: 90,
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: remark?.remarks }}
                    />
                  </div>
                </TimelineContent>
              </TimelineItem>
            )
          })
        }
      </Timeline>
    </div>
  );
}

export default ViewRemarks