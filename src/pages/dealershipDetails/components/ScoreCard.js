import { Typography, makeStyles, Button, Tabs, Tab, Box, CircularProgress, AppBar, Backdrop, IconButton, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import head from 'lodash-es/head';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { action_id, resources_id } from '../../../config/accessControl';
import { URL } from '../../../config/serverUrls';
import { getScoreCard, getSignedUrl } from '../../../services/common.service';
import CheckAllowed from '../../rbac/CheckAllowed';
import BankingInputsTable from '../ScoreCardTables/BankingInputsTable';
import BureauInputTable from '../ScoreCardTables/BureauInputTable';
import CamInputTable from '../ScoreCardTables/CamInputTable';
import CoappTable from '../ScoreCardTables/CoappTable';
import DeviationsInputTable from '../ScoreCardTables/DeviationsInputTable';
import FcEligibilityTable from '../ScoreCardTables/FcEligibilityTable';
import FixedObligationsTable from '../ScoreCardTables/FixedObligationsTable';
import OmcSaleTable from '../ScoreCardTables/OmcSaleTable';
import OtherInputsTable from '../ScoreCardTables/OtherInputsTable';
import ScoreCardInputTable from '../ScoreCardTables/ScoreCardInputTable';
import WorkingSheetTable from '../ScoreCardTables/WorkingSheetTable';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  tabsRoot: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '60vw',
    marginTop: 16
  },
  buttonRipple: {
    borderRadius: '10px 10px 0px 0px',
  },
  backdrop: { zIndex: '2', position: 'absolute', margin: '-16px' },
  backdropRoot: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  caption: { color: 'rgb(0,0,0,0.3)' }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  }
}

const ScoreCard = ({ currentUser, dealership_id }) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('Uploading score card')
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState();
  const { data: scoreCardData = [] } = useQuery('scorecard', () => getScoreCard(dealership_id), { refetchOnWindowFocus: false })
  const metaData = head(scoreCardData?.metadata?.scorecard_meta)

  const scoreCardTabs = [
    'OMC Sale Data',
    'Demo & Bureau Inputs',
    'Other Inputs',
    'Banking Inputs',
    'Fixed Obligations',
    'FC Eligibility',
    'Deviations',
    'CAM',
    'Score Card',
    'PD sheet',
  ]

  const delay = async (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const loaderNotifications = [
    'Analyzing OMC Sale Data...',
    'Analyzing Bureau inputs...',
    'Analyzing Banking inputs...',
    'Analyzing ITR, P&L inputs...',
    'Calculating Deviations...',
    'Checking Eligibility...',
    'Almost done!'
  ]

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleDownload = () => {
    if (metaData?.file_url) {
      getSignedUrl(metaData?.file_url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  }

  const onChangeHandler = (event) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', event.target.files[0])
    event.target.type = 'submit';
    event.target.type = 'file';
    fetch(`${URL.base}dealership/${dealership_id}/scorecard`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then(res => {
        return res.json()
      })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          const notify = async () => {
            for (let i = 0; i < loaderNotifications.length; i++) {
              setNotification(loaderNotifications[i])
              if (i + 1 == loaderNotifications?.length) {
                setLoading(false)
                queryClient.invalidateQueries('scorecard')
                enqueueSnackbar(message, {
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  variant: 'success'
                })
              }
              await delay(1500)
            }
          }
          notify()
        }
        else {
          setLoading(false)
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        }
      })
      .catch(e => {
        setLoading(false)
        enqueueSnackbar('Error Uploading File', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={classes.title}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5">Eligibility Score Card</Typography>
          {
            metaData?.uploaded_date &&
              <Typography variant="caption" className={classes.caption}>Uploaded On: {metaData?.uploaded_date || '-'}</Typography>
          }
          {
            metaData?.uploaded_by &&
              <Typography variant="caption" className={classes.caption}>Uploaded By: {metaData?.uploaded_by || '-'}</Typography>
          }
        </div>
        <div>
          {
            metaData?.file_url &&
              <Tooltip title="Download Score Card">
                <IconButton size="small" style={{ marginRight: 12 }} onClick={handleDownload}>
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
          }
          {/* // scorecard sheet upload permission check */}
          <CheckAllowed currentUser={currentUser} resource={resources_id.scoreCard} action={action_id.scoreCard.upload}>
            <Button
              variant='outlined'
              color='primary'
              name='csv'
              id='file'
              component="label"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} /> : <PublishIcon fontSize='small' />}
            >Upload score card
              <input
                type="file"
                hidden
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={onChangeHandler}
              />
            </Button>
          </CheckAllowed>
        </div>
      </div>
      <div className={classes.tabsRoot}>
        <AppBar position='static' color='default' style={{ zIndex: '0' }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor="primary"
            indicatorColor='primary'
            variant='scrollable'
            scrollButtons='auto'
          >
            {
              scoreCardTabs?.map((title, i) => {
                return (
                  <Tab label={title} key={i} style={{ margin: 0 }} {...a11yProps(i)} TouchRippleProps={{ classes: { root: classes.buttonRipple } }} />
                )
              })
            }
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
          <OmcSaleTable data={scoreCardData?.omc_sale_sheet} header={scoreCardData?.headers_across_sheets} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <BureauInputTable data={scoreCardData?.demo_and_bureau_inputs_sheet} header={scoreCardData?.headers_across_sheets} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <OtherInputsTable data={scoreCardData?.other_inputs_sheet} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <BankingInputsTable data={scoreCardData?.banking_inputs_sheet} header={scoreCardData?.headers_across_sheets} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <FixedObligationsTable data={scoreCardData?.fixed_obligations_sheet} />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <FcEligibilityTable data={scoreCardData?.fc_eligibility_sheet} />
        </TabPanel>
        <TabPanel value={tabValue} index={6}>
          <DeviationsInputTable data={scoreCardData?.deviations_sheet} header={scoreCardData?.headers_across_sheets} />
        </TabPanel>
        <TabPanel value={tabValue} index={7}>
          <CamInputTable data={scoreCardData?.cam_sheet} header={scoreCardData?.headers_across_sheets} />
        </TabPanel>
        <TabPanel value={tabValue} index={8}>
          <ScoreCardInputTable data={scoreCardData?.scorecard_sheet} />
        </TabPanel>
        <TabPanel value={tabValue} index={9}>
          <WorkingSheetTable data={scoreCardData?.working_sheet} />
        </TabPanel>
        <TabPanel value={tabValue} index={10}>
          <CoappTable data={scoreCardData?.co_app_sheet} type='co_app_1' />
        </TabPanel>
        <TabPanel value={tabValue} index={11}>
          <CoappTable data={scoreCardData?.co_app_sheet} type='co_app_2' />
        </TabPanel>
        <TabPanel value={tabValue} index={12}>
          <CoappTable data={scoreCardData?.co_app_sheet} type='co_app_3' />
        </TabPanel>
        <TabPanel value={tabValue} index={13}>
          <CoappTable data={scoreCardData?.co_app_sheet} type='co_app_4' />
        </TabPanel>
        <TabPanel value={tabValue} index={14}>
          <CoappTable data={scoreCardData?.co_app_sheet} type='co_app_5' />
        </TabPanel>
      </div>
      <Backdrop open={loading} className={classes.backdrop} >
        <div className={classes.backdropRoot}>
          <CircularProgress style={{ color: 'white' }} size={25} />
          <Typography variant='body1' style={{ color: 'white', marginLeft: 16 }}>{notification}</Typography>
        </div>
      </Backdrop>
      <FormDialog title={'Score card'} open={openModal?.open} onClose={() => setOpenModal({ open: false })}>
        <FilePreview data={openModal} />
      </FormDialog>
    </div>
  )
}

export default ScoreCard