import { Grid, Title } from '@mantine/core';
import { IconFileDatabase, IconRefresh } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import DocListPreview from './DocListPreview';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { Button } from '../../../components/Mantine/Button/Button';
import { Divider } from '../../../components/Mantine/Divider/Divider';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import {
  getCrimeInfo,
  getCrimeReport,
} from '../../../services/dealers.service';

const CrimeInfoSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
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
    <>
      {/* Drawer content */}
      <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ViewData
              title="Name"
              value={data?.first_name}
              style={{ marginBottom: 0 }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ViewData
              title="User Type"
              value={data?.category}
              style={{ marginBottom: 0 }}
            />
          </Grid.Col>
          
          {editMode ? (
            <Grid.Col mt="sm">
              <Button
                variant="light" 
                leftSection={<IconRefresh size={18} />}
                onClick={refreshCrimeReport}
              >
                Refresh Crime Report
              </Button>
            </Grid.Col>  
          ) : (
            <Grid.Col mt="sm">
              <Button
                variant="outline"
                leftSection={<IconFileDatabase size={20} />}
                onClick={crimeReport}
              >
                Check Crime Data
              </Button>
            </Grid.Col>
          )}
        </Grid>  
        
        <Divider my="lg" />

        <Title order={4} mb="xs">Crime Reports</Title>

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
              colSpan={{ base: 12, sm: 6 }}
            />
          ))}
      </div>
    </>
  );
};

export default CrimeInfoSideWrapper;
