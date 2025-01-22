import {
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { deleteRequestUrl } from '../../services/leegality.service';
import apiCall from '../../utils/api.util';
import FilePreview from '../CommonComponents/FilePreview';
import { Avatar, Badge, Box, Button, Grid, Group, Menu, Modal, Table, Text } from '@mantine/core';
import { IconCopy, IconSettings, IconSquareRoundedCheck, IconSquareRoundedX, IconTrash } from '@tabler/icons-react';
import { displayNotification } from '../CommonComponents/Notification/displayNotification';

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);

  .card-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 15px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;
const useStyles = makeStyles((theme) => ({
  popover: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    minWidth: '40px',
  },
  icon: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },
  text: {
    marginLeft: theme.spacing(1),
  },
}));

const LeegalityLayout = ({ docId, dealershipId, currentUser, setActiveState }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState({});
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const getLegalityDocument = useQuery({
    queryKey: ['getLegality-document', docId, dealershipId],
    queryFn: () => apiCall(`dealership/${dealershipId}/document/${docId}`),
    enabled: Boolean(docId && dealershipId),
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      setActiveState(data);
    },
    onError: (err) => {
      displayNotification({
        message: err.message,
        variant: 'error',
      })
      setActiveState();
    }
  })

  const ResendNotification = (item) => {
    apiCall('document/resend', {
      method: 'POST',
      body: { sign_url: item?.signUrl },
    })
      .then((res) => {
        displayNotification({
          message: res.message,
          variant: 'success',
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    let value = { signUrl: selectedItemData.url, document_id: getLegalityDocument?.data?.documentId };
    deleteRequestUrl(value)
      .then((res) => {
        setOpen(false)
        displayNotification({
          message: res,
          variant: 'success',
        })
      })
      .catch((err) => {
        displayNotification({
          message: err,
          variant: 'success',
        })
      });
  };

  return (
    <Box bgcolor="#fbfbfb">
      <Grid>
        <Grid.Col span={7} style={{ position: 'relative' }}>
          {docId && getLegalityDocument?.data?.file && (
            <FilePreview
              title="Leegality"
              data={{ image: getLegalityDocument?.data?.file, type: getLegalityDocument?.data?.file?.endsWith('.pdf') }}
              showDownload
            />
          )}
          <Backdrop
            open={getLegalityDocument?.isLoading}
            style={{ position: 'absolute', zIndex: '2' }}
          >
            <CircularProgress size={25} style={{ color: 'white' }} />
          </Backdrop>
        </Grid.Col>
        {getLegalityDocument?.data?.file ? (
          <Grid.Col span={5}>
            <Box pt={2} mb={'md'}>
              <Table.ScrollContainer>
                <Table striped>
                  <Table.Tbody style={{ fontSize: 12 }}>
                    <Table.Tr>
                      <Table.Td fw={600}>Document ID</Table.Td>
                      <Table.Td>{getLegalityDocument?.data?.documentId}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={600}>Name</Table.Td>
                      <Table.Td>{getLegalityDocument?.data?.documentName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={600}>Last Active Date</Table.Td>
                      <Table.Td>
                        {getLegalityDocument?.data?.creationDate &&
                          moment(
                            getLegalityDocument?.data?.creationDate?.split(' ')[0],
                            'DD-MM-YYYY'
                          ).format('MMM DD, YYYY')}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={600}>Status</Table.Td>
                      <Table.Td>{getLegalityDocument?.data?.status}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={600}>Internal Reference no</Table.Td>
                      <Table.Td >{getLegalityDocument?.data?.irn}</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              <Box mt={2}>
                {getLegalityDocument?.data?.invitations?.map((item, i) => {
                  return (
                    <Card key={`inv-${i}`}>
                      <div className="card-body">
                        <Box pr={2}>
                          <Avatar />
                        </Box>
                        <Box ml={'md'}>
                          <p>
                            <strong>{item.name}</strong>
                          </p>
                          {item.email && (
                            <p>
                              <small>{item.email}</small>
                            </p>
                          )}
                          {item.phone && (
                            <p>
                              <small>{item.phone}</small>
                            </p>
                          )}
                          <Group>
                            <Badge
                              p={0}
                              color='gray'
                              variant="transparent"
                              leftSection={
                                item.signed ? (
                                  <IconSquareRoundedCheck
                                    color='green'
                                    size={14}
                                  />
                                ) : (
                                  <IconSquareRoundedX
                                    color='red'
                                    size={14}
                                  />
                                )
                              }
                              size='sm'
                            >
                              Signed
                            </Badge>
                            {!item.signed && (
                              <>
                                <Badge
                                  p={0}
                                  color='gray'
                                  variant="transparent"
                                  leftSection={
                                    item.active ? (
                                      <IconSquareRoundedCheck
                                        color='green'
                                        size={14}
                                      />
                                    ) : (
                                      <IconSquareRoundedX
                                        color='red'
                                        size={14}
                                      />
                                    )
                                  }
                                  size='sm'
                                >
                                  Active
                                </Badge>
                                <Badge
                                  p={0}
                                  color='gray'
                                  variant="transparent"
                                  leftSection={
                                    item.expired ? (
                                      <IconSquareRoundedCheck
                                        color='green'
                                        size={14}
                                      />
                                    ) : (
                                      <IconSquareRoundedX
                                        color='red'
                                        size={14}
                                      />
                                    )
                                  }
                                  size='sm'
                                >
                                  Expired
                                </Badge>
                              </>
                            )}
                          </Group>
                        </Box>
                      </div>
                      <div className="card-footer">
                        {item.active ? (
                          <Button
                            variant="outline"
                            onClick={() => ResendNotification(item)}
                            size='compact-sm'
                          >
                            Resend Notification
                          </Button>
                        ) : null}
                        {/* <Button variant="outlined" color="secondary" size="small">Details</Button> */}
                        <Menu shadow="md" withArrow width={150} styles={{ dropdown: { zIndex: 9999, position: 'absolute' }, itemLabel: { fontSize: 14, color: 'gray' } }}>
                          <Menu.Target>
                            <IconSettings
                              color={'gray'}
                              onClick={() => setSelectedItemData(item)}
                            />
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconTrash color='gray' size={14} />}
                              onClick={() => {
                                setOpen(true);
                              }}
                            >
                              Delete
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCopy color='gray' size={14} />}
                              onClick={() => navigator.clipboard.writeText(selectedItemData?.signUrl).then(
                                () => {
                                  displayNotification({
                                    message: 'Sign URL copied successfully',
                                    variant: 'success',
                                  })
                                },
                                () => {
                                  displayNotification({
                                    message: 'Copy Failed',
                                    variant: 'error',
                                  })
                                }
                              )}
                            >
                              Copy Link
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                      <Modal
                        opened={open}
                        onClose={() => {
                          setOpen(false);
                        }}
                        title={'Are you sure?'}
                        size={'sm'}
                        styles={{ root: { zIndex: 9999, position: 'absolute' } }}
                      >
                        <Text>
                          Do you want to delete the document
                        </Text>
                        <Group justify={'flex-end'} mt={'md'}>
                          <Button
                            onClick={() => {
                              setOpen(false);
                            }}
                            variant='outline'
                            size='compact-md'
                          >
                            No
                          </Button>
                          <Button
                            onClick={handleDelete}
                            color='red'
                            size='compact-md'
                          >
                            Yes
                          </Button>
                        </Group>
                      </Modal>
                    </Card>
                  )
                })}
              </Box>
            </Box >
          </Grid.Col>
        ) : null}
      </Grid >
    </Box >
  );
};

export default LeegalityLayout;
