import { IconButton, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import RotateLeftOutlinedIcon from '@material-ui/icons/RotateLeftOutlined';
import SpeedOutlinedIcon from '@material-ui/icons/SpeedOutlined';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import DocListPreview from './DocListPreview';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import {
  getCrimeInfo,
  getCrimeReport,
} from '../../../services/dealers.service';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: 9,
  },
}));

const CrimeInfoSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const editable = permissionCheck(
    currentUser.role_name,
    rulesList.external_view
  );
  const queryClient = useQueryClient();
  const { data: crimeData } = useQuery('crime', () => getCrimeInfo(data?.id, data?.category?.toLowerCase()), {
    onSuccess: (data) => {
      if (data?.length) {
        setEditMode(true);
      } else {
        setEditMode(false);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const refreshCrimeReport = () => {
    let type = data?.category?.toLowerCase();
    let url = `${data?.id}/crimecheck?type=${type}&crimewatch=1`;
    getCrimeReport(url)
      .then((data) => {
        queryClient.invalidateQueries('crime');
        enqueueSnackbar(data, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      });
  };

  const crimeReport = () => {
    let app_type = data?.category?.toLowerCase();
    let url = `${data?.id}/crimecheck?type=${app_type}`;
    getCrimeReport(url)
      .then((data) => {
        enqueueSnackbar(data, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        queryClient.invalidateQueries('crime');
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      });
  };

  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.sidePanelTitle}>
        <Typography variant="h4">
          Credit Information ({data?.pan || '-'})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </div>
      <div className={classes.sidePanelFormContentWrapper}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <ViewData
              title="Name"
              value={data?.first_name}
              style={{ marginBottom: 0 }}
            />
          </Grid>
          <Grid item md={6}>
            <ViewData
              title="User Type"
              value={data?.category}
              style={{ marginBottom: 0 }}
            />
          </Grid>
        </Grid>
        <div style={{ margin: 10 }}>
          <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 20 }}>
            {editMode ? (
              <Grid
                item
                md={12}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<RotateLeftOutlinedIcon />}
                    style={{ marginLeft: 8 }}
                    onClick={refreshCrimeReport}
                  >
                    Refresh Crime Report
                  </Button>
                </div>
              </Grid>
            ) : (
              <Grid md={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginTop: 10 }}
                  onClick={crimeReport}
                  startIcon={<SpeedOutlinedIcon />}
                >
                  Check Crime Data
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
        <Typography variant="h6">Crime Reports</Typography>
        <div>
          {Array.isArray(crimeData) &&
            crimeData.map((row, i) => (
              <DocListPreview
                crimeCheck
                file={row.file_data}
                docId={row?.request_id}
                key={i}
                id={i + 1}
                dealershipId={data?.id}
                editable={editable}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CrimeInfoSideWrapper;
