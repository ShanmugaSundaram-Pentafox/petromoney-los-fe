import { ActionIcon, ActionIconGroup, Badge, Box, Collapse, Flex, Grid, Paper, Text, Title } from '@mantine/core';
import { Typography, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@material-ui/core'
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import { IconEdit, IconFileMusic, IconFileTypePdf, IconFiles, IconPhoto, IconTrash, IconUpload } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { Button } from '../../../components/Mantine/Button/Button';
import { Tooltip } from '../../../components/Mantine/Tooltip/Tooltip';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { getSignedUrl } from '../../../services/common.service';
import { deleteDocsImage, editDocsImage } from '../../../services/dealerships.service';
import CheckAllowed from '../../rbac/CheckAllowed';

const imgFileTypes = ['jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg', 'png'];
const csvFileTypes = ['csv', 'xls', 'xlsx'];
const audioFileTypes = ['mp3', 'wav', 'm4a']

const DocPreview = ({ fileType, url, DocName, docId, updatedDateTime, file_name, fileId, dealershipId, editable, crimeCheck, currentUser, colSpan = { base: 12, sm: 3 } }) => {
  const queryClient = useQueryClient()
  const [imageModal, setImageModal] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, loading: false })
  const [editModal, setEditModal] = useState({ open: false })
  const { enqueueSnackbar } = useSnackbar();

  const handleDocDelete = (fileId) => {
    setDeleteModal({ ...deleteModal, loading: true })
    deleteDocsImage([fileId], dealershipId)
      .then((res) => {
        queryClient.invalidateQueries(['doc-checklist', dealershipId])
        setDeleteModal({ ...deleteModal, open: false, loading: false })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleDocNameEdit = () => {
    const d = { file_id: editModal?.fileId, file_url: editModal?.fileUrl, file_name: editModal?.name + '.' + fileType, file_type: fileType }
    editDocsImage(dealershipId, docId, d)
      .then((res) => {
        queryClient.invalidateQueries(['doc-checklist', dealershipId])
        setEditModal({ open: false })
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      });
  }
  const handleDownload = (fileUrl) => {
    getSignedUrl(fileUrl)
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

  return (
    <>
      {url ? (
        <Tooltip label={DocName ? `${file_name} (${updatedDateTime})` : 'click to view'} withArrow color={'gray'}>
          <Grid.Col span={colSpan}>
            <Box
              className="group relative h-32 flex items-center justify-center p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 border-dashed rounded transition-colors cursor-pointer"
              onClick={() => csvFileTypes.includes(fileType) ? handleDownload(url) : audioFileTypes.includes(fileType) ? handleDownload(url) : setImageModal({ open: true, image: url, type: fileType })}
            >
              {imgFileTypes.includes(fileType) ?
                <IconPhoto size={28} className="text-gray-500 group-hover:text-gray-600 transition-colors" />
                : fileType === 'pdf' ?
                  <IconFileTypePdf size={28} className="text-gray-500 group-hover:text-gray-600 transition-colors" />
                  : audioFileTypes.includes(fileType) ?
                    <IconFileMusic size={28} className="text-gray-500 group-hover:text-gray-600 transition-colors" />
                    : <IconFiles size={28} className="text-gray-500 group-hover:text-gray-600 transition-colors" />
              }

              {DocName && (
                <ActionIconGroup className="absolute bottom-1.5 right-1.5">
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.docChecklist} action={action_id?.docChecklist?.delete}>
                    <ActionIcon
                      color="red"
                      variant="light"
                      aria-label="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal({ open: true, fileId: fileId })
                      }}
                    >
                      <IconTrash size={13} />
                    </ActionIcon>
                  </CheckAllowed>

                  <CheckAllowed currentUser={currentUser} resource={resources_id?.docChecklist} action={action_id?.docChecklist?.edit}>
                    <ActionIcon
                      variant="light"
                      aria-label="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditModal({ open: true, fileId: fileId, fileUrl: url, fileName: file_name })
                      }}
                    >
                      <IconEdit size={13} />
                    </ActionIcon>
                  </CheckAllowed>
                </ActionIconGroup>
              )}
            </Box>

            {file_name && (
              <Title order={6} lineClamp={1} mt="6" c="gray.7">
                {file_name}
              </Title>
            )}

            {updatedDateTime && (
              <Text fz="12" mt="4" c="gray.7">
                {updatedDateTime}
              </Text>
            )}
          </Grid.Col>
        </Tooltip>
      ) : (
        <>
          {!crimeCheck && (
            <Grid.Col h="40">
              <Text fz="xs" c="gray.6" ta="center">No Documents!</Text>
            </Grid.Col>
          )}
        </>
      )}

      <FormDialog
        title={DocName}
        onDownload={imageModal?.image}
        open={imageModal?.open}
        onClose={() => setImageModal({ open: false })}
      >
        <FilePreview data={imageModal} />
      </FormDialog>

      <Dialog
        open={deleteModal?.open}
        onClose={() => setDeleteModal({ loading: false, open: false })}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <InfoCircleOutlined style={{ fontSize: 48, color: 'rgb(255,59,48)', margin: 16, marginBottom: 20 }} />
            <Typography variant='h3'>Are you sure?</Typography>
          </div>
          <DialogContentText style={{ textAlign: 'center' }}>Do you really want to delete this document? This process cannot be undone!</DialogContentText>
        </DialogContent>

        <div>
          <Button size='medium' variant='outlined' onClick={() => setDeleteModal({ open: false, loading: true })}>Cancel</Button>
          <Button variant='contained' size='medium' disabled={deleteModal?.loading} style={{ backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 15 }} onClick={() => !deleteModal?.loading ? handleDocDelete(deleteModal?.fileId) : null}>
            {deleteModal?.loading ? 'Deleting..' : 'Delete'}
          </Button>
        </div>
      </Dialog>

      {/* The modal is to edit the file name of the documents */}
      <Dialog
        open={editModal?.open}
        onClose={() => setEditModal({ open: false })}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>{editModal?.fileName}</DialogTitle>
        <DialogContent dividers>
          <Typography>Enter File name</Typography>
          <TextInput
            fullWidth
            placeholder='Enter file name...'
            rows={4}
            value={editModal.name}
            onChange={e => setEditModal({ ...editModal, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <div>
            <Button size='medium' variant='outlined' onClick={() => setEditModal({ open: false })}>Cancel</Button>
            <Button variant='contained' size='medium' color='primary' style={{ color: 'white', marginLeft: 15 }} onClick={handleDocNameEdit}>Save</Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}

const DocListPreview = ({ docName, upload, file, id, docId, dealershipId, editable, crimeCheck, currentUser, colSpan }) => {
  const [collapse, setCollapse] = useState(true);
  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  const showPaperStyle = docName || upload

  return (
    <Paper withBorder={showPaperStyle} radius={showPaperStyle ? 'md' : null} mb="md">
      {showPaperStyle && (
        <Flex p="sm" align="center" justify="space-between">
          {docName && (
            <Box onClick={() => handleCollapse()} className="flex items-center gap-2 cursor-pointer">
              <Text
                order={3}
                fw="600"
                className="text-gray-500 hover:text-blue-600"
              >
                {`${id}. ${docName}`}
              </Text>

              <Badge>
                {file[0].file_url && file?.length || 0}
              </Badge>
            </Box>
          )}

          {upload && (
            <CheckAllowed currentUser={currentUser} resource={resources_id?.docChecklist} action={action_id?.docChecklist?.upload}>
              <Button
                size="xs"
                variant="outline"
                leftSection={<IconUpload size={14} />}
                onClick={upload}
              >
                Upload
              </Button>
            </CheckAllowed>
          )}
        </Flex>
      )}

      <Collapse in={!collapse}>
        <Grid gutter="md" p={showPaperStyle ? 'sm' : '0'}>
          {file?.map((data, i) => {
            return (
              <DocPreview
                key={i}
                currentUser={currentUser}
                crimeCheck={crimeCheck}
                fileId={data?.file_id}
                docId={docId}
                dealershipId={dealershipId}
                fileType={data.file_type || 'pdf'}
                file_name={data.file_name}
                url={data?.file_url}
                DocName={docName}
                updatedDateTime={format(new Date(data?.created_date || data?.modified_date), 'dd/MM/yyyy hh:mm a')}
                editable={editable}
                colSpan={colSpan}
              />
            )
          })}
        </Grid>
      </Collapse>
    </Paper>
  )
}

export default DocListPreview