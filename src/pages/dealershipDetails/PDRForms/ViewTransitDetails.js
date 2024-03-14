import { Box, Tooltip, Typography, makeStyles } from '@material-ui/core';
import { Attachment } from '@material-ui/icons';
import { TimelineOppositeContent } from '@material-ui/lab';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { getTransitDetailsById } from '../../../services/pdc.service';

const useStyles = makeStyles((theme) => ({
  timelineItem: {
    '&.MuiTimelineItem-missingOppositeContent': {
      '&:before': {
        display: 'none'
      }
    },
  }

}));

const ViewTransitDetails = ({ dealershipId }) => {
  const classes = useStyles();
  const [imageModal, setImageModal] = useState({});
  const { data: remarks } = useQuery(['pdc-transit-details', dealershipId], () => getTransitDetailsById(dealershipId), {
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      {
        (remarks?.length > 0) && (
          <Typography variant='h6' style={{ marginBottom: 12, marginTop: 20 }}>Track Details</Typography>
        )
      }
      <Timeline position="alternate" align='left'>
        {
          remarks?.map((remark, id) => {
            return (
              <TimelineItem key={id} className={classes.timelineItem}>
                <TimelineOppositeContent style={{ maxWidth: 100 }} color="text.secondary">
                  <p style={{ textTransform: 'capitalize' }}>{remark?.event_type?.replace(/_/g, ' ')}</p>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                    }}
                  >
                    <Box mt={'-2px'}>
                      <p size='12px'><strong>{remark.created_by}</strong></p>
                    </Box>
                    <Box mt={'-2px'} ml={20}>
                      <p style={{ fontSize: 9 }}>
                        {moment(remark?.event_date).format('DD-MM-YYYY')} {moment(remark?.event_date, 'HH:mm:ss').format('hh:mm:ss A')}
                      </p>
                    </Box>
                  </Box>
                  {remark?.pdc_cheque_ids ?
                    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Typography size='xs' >
                        Cheque IDs: {remark?.pdc_cheque_ids}
                      </Typography>
                      {remark?.pod
                        ? <Tooltip title={'Click to view the '}>
                          <Attachment style={{ color: '#b0b0b0', cursor: 'pointer' }} onClick={() => setImageModal({ open: true, image: remark?.pod, type: remark?.pod?.endsWith('.pdf') })} />
                        </Tooltip>
                        : null
                      }
                    </div>
                    : null
                  }
                </TimelineContent>
              </TimelineItem>
            )
          })
        }
      </Timeline>
      <FormDialog className={classes.dialogBox} title={''} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
    </div>
  );
}

export default ViewTransitDetails;