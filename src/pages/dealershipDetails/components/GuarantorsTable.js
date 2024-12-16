import { ActionIcon, Divider, Flex, Table, Title } from '@mantine/core';
import { Dialog, DialogContent, DialogContentText, Tooltip, DialogTitle } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import { IconCircleCheck, IconReload } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import CreditInfoSideWrapper from './CreditInfoSideWrapper';
import CrimeInfoSideWrapper from './CrimeInfoSideWrapper';
import { applicantTypes } from './DealersTable';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import { action_id, resources_id } from '../../../config/accessControl';
import { updateApplicantType } from '../../../services/dealers.service';
import { addApplicants } from '../../../services/fileUpload.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

// const useStyles = makeStyles((theme) => ({
//   wrapper: {
//     padding: 8,
//   },
//   title: {
//     paddingLeft: 8,
//     marginBottom: 8,
//   },
//   table: {
//     padding: 8,
//   },
//   header: {
//     display: 'flex',
//     marginBottom: 8,
//   },
//   tableRow: {
//     cursor: 'pointer',
//     '&:hover': {
//       backgroundColor: '#fafafa',
//     },
//   },
//   sidePanelWrapper: {
//     width: '40vw',
//     minWidth: 300,
//   },
// }));

const GuarantorsTable = ({
  id,
  editable,
  guarantorsData,
  titleAlign,
  onClickAddMenu,
  currentUser,
  dealersClickRow,
}) => {
  const classes = {};
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [crimeData, setCrimeData] = useState();
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [openChangeTypeDialog, setopenChangeTypeDialog] = useState(false)
  const [updatedApplicantType, setUpdatedApplicantType] = useState();
  const [openFilePreview, setOpenFilePreview] = useState({ open: false });

  const deleteApplicant = (values) => {
    const obj = { ...values, is_active: values.is_active == 1 ? 0 : 1 };
    const resObj = compareObject(values, obj, { category: values?.category })
    let apiUrl = `applicant/${id}/${values?.id}/active`;
    addApplicants(resObj, currentUser, apiUrl, values?.id)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setOpenDialog({ open: false })
        queryClient.invalidateQueries(['dealership-applicants', id])
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        setOpenDialog({ open: false })
      })
  };

  const handleUpdate = (data) => {
    // if (data?.is_main_applicant) {
    //   enqueueSnackbar('Do not change the main applicant. Instead, select someone else to be the main applicant for the dealership.', {
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right',
    //     },
    //     variant: 'error',
    //   })

    // }
    // else {
    setRowData(data)
    setopenChangeTypeDialog(true)
    // }
  }
  const saveApplicantTypeUpdate = () => {
    updateApplicantType(rowData?.id, { applicant_type: updatedApplicantType.toUpperCase(), dealership_id: rowData?.dealership_id })
      .then((res) => {
        setRowData()
        setopenChangeTypeDialog(false)
        queryClient.invalidateQueries('dealership-applicants')
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        setRowData()
        setopenChangeTypeDialog(false)
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  return (
    (guarantorsData?.length > 0) && (
      <>
        <Divider mb="xl" />
        <Title order={3} mb="sm">Guarantors</Title>
        <Table.ScrollContainer minWidth={500} pb={0}>
          <Table highlightOnHover aria-label="Dealers" mb="6px">
            <Table.Thead bg="gray.1" fz="xs">
              <Table.Tr>
                <Table.Th>Guarantor Name</Table.Th>
                <Table.Th>Mobile</Table.Th>
                <Table.Th ta="center">Documents</Table.Th>
                <Table.Th ta="center">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody fz="sm">
              {guarantorsData?.map((row, index) => (
                <Table.Tr key={row.id}>
                  <Table.Td
                    className="cursor-pointer"
                    onClick={e => dealersClickRow(e, row, 'GUARANTOR')}
                  >
                    {row.first_name}
                  </Table.Td>
                  <Table.Td
                    className="cursor-pointer"
                    onClick={e => dealersClickRow(e, row, 'GUARANTOR')}
                  >
                    {row.mobile}
                  </Table.Td>

                  <Table.Td>
                    <Flex align="center" justify="center" gap="6">
                      {row.aadhar_file_url && (
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => {
                            setOpenFilePreview({
                              open: true,
                              image: row.aadhar_file_url,
                              type: row?.aadhar_file_url?.endsWith('.pdf')
                            })
                          }}
                        >
                          Aadhaar
                        </Button>
                      )}

                      {row.pan_file_url && (
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => {
                            setOpenFilePreview({
                              open: true,
                              image: row.pan_file_url,
                              type: row?.pan_file_url?.endsWith('.pdf')
                            })
                          }}
                        >
                          PAN
                        </Button>
                      )}

                      {!row.pan_file_url && !row.aadhar_file_url && '-'}
                    </Flex>
                  </Table.Td>

                  <Table.Td onClick={e => e.stopPropagation()}>
                    <Flex align="center" justify="center" gap="6">
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.guarantorCrimeCheck}>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setCrimeData(row)}
                        >
                          Crime check
                        </Button>
                      </CheckAllowed>

                      <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.guarantorCreditCheck}>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setRowData(row)}
                        >
                          Credit Info
                        </Button>
                      </CheckAllowed>

                      {/* guarantor status change permission */}
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.guarantorStatus}>
                        <ActionIcon
                          variant="subtle"
                          color={row.is_active == 0 ? 'gray' : 'green'}
                          aria-label={row.is_active == 0 ? 'Activate' : 'Deactivate'}
                          onClick={() => setOpenDialog({ open: true, data: row })}
                        >
                          <Tooltip title={row.is_active == 0 ? 'Activate' : 'Deactivate'}>
                            {row.is_active == 0 ? (
                              <IconCircleCheck size={20} />
                            ) : (
                              <IconCircleCheck size={20} />
                            )}
                          </Tooltip>
                        </ActionIcon>
                      </CheckAllowed>

                      <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.applicantTypeChange}>
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          aria-label=""
                          onClick={() => handleUpdate(row)}
                        >
                          <Tooltip title='Change type'>
                            <IconReload size={20} />
                          </Tooltip>
                        </ActionIcon>
                      </CheckAllowed>
                    </Flex>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Dialog
          open={openDialog?.open}
          onClose={() => setOpenDialog({ ...openDialog, open: false })}
          maxWidth='xs'
          fullWidth
        >
          <DialogContent>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <InfoCircleOutlined style={{ fontSize: 48, margin: 16, marginBottom: 20, color: openDialog?.data?.is_active ? 'rgb(255,59,48)' : 'rgb(62, 175, 118)' }} />
              <Typography variant='h3'>Are you sure?</Typography>
            </div>
            <DialogContentText style={{ textAlign: 'center' }}>{`Do you really want to delete ${openDialog?.data?.first_name}?`}</DialogContentText>
          </DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19 }}>
            <Button size='xs' variant='outline' onClick={() => setOpenDialog({ ...openDialog, open: false })}>Cancel</Button>
            <Button size='xs' style={openDialog?.data?.is_active == 1 ? { backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 16 } : { backgroundColor: 'rgb(62, 175, 118)', color: 'white', marginLeft: 16 }} onClick={() => deleteApplicant(openDialog?.data)}>
              {openDialog?.data?.is_active == 1 ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </Dialog>
        <Dialog
          open={openChangeTypeDialog}
          onClose={() => { setopenChangeTypeDialog(false); setRowData() }}
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle>Update applicant Type</DialogTitle>
          <DialogContent>
            <Select
              isClearable
              onChange={(e) => setUpdatedApplicantType(e?.value)}
              options={applicantTypes}
              menuPlacement='bottom'
              menuPosition='fixed'
              maxMenuHeight='200px'
            />
          </DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 20, marginTop: 20 }}>
            <Button size='xs' variant='outline' onClick={() => setopenChangeTypeDialog(false)}>Cancel</Button>
            <Button size='xs' style={{ backgroundColor: 'rgb(62, 175, 118)', color: 'white', marginLeft: 16 }} onClick={() => saveApplicantTypeUpdate(rowData)}>Update</Button>
          </div>
        </Dialog>
        <RightSideDrawer anchor="right" opened={rowData && !openChangeTypeDialog} variant="temporary" onClose={() => setRowData()} >
          <div className={classes.sidePanelWrapper}>
            {
              <CreditInfoSideWrapper
                dealershipId={id}
                data={rowData}
                currentUser={currentUser}
                onClose={() => setRowData()}
              />
            }
          </div>
        </RightSideDrawer>
        <RightSideDrawer
          anchor="right"
          opened={crimeData}
          onClose={() => {
            setCrimeData();
          }}
          variant="temporary"
        >
          <div className={classes.sidePanelWrapper}>
            {
              <CrimeInfoSideWrapper
                dealershipId={id}
                data={crimeData}
                currentUser={currentUser}
                onClose={() => setCrimeData()}
              />
            }
          </div>
        </RightSideDrawer>
        <FormDialog className={classes.dialogBox} onDownload={openFilePreview?.image} open={openFilePreview?.image} onClose={() => setOpenFilePreview({ open: false })}>
          <FilePreview data={openFilePreview} />
        </FormDialog>
      </>
    ));
};

export default GuarantorsTable;
