import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getLosLoanById,
  updateLosLoanStatus,
} from '../../../services/loans.service';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';

const useStyles = makeStyles(() => ({
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: 14,
  },
  thead: {
    backgroundColor: '#f8fafc',
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontWeight: 600,
    fontSize: 13,
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  row: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
    '&:nth-child(even)': {
      backgroundColor: '#fafafa',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: 30,
    color: '#94a3b8',
    fontWeight: 500,
  },
  loaderWrapper: {
    height: 100, // controls vertical space
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const LoansTable = ({ data = [], loading }) => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = React.useState({ status: false, data: '' });
  const loanId = showPanel.data?.loan_id;

  const queryClient = useQueryClient();

  const [reasonModal, setReasonModal] = React.useState({
    opened: false,
    action: null,
  });

  const [remarks, setRemarks] = React.useState('');

  const showLoanDetails = (loan) => {
    setShowPanel({ status: true, data: loan });
  };

  const closeLoanDetails = () => {
    setShowPanel({ status: false, data: '' });
  };

  const { mutate: changeStatus, isLoading: isUpdating } = useMutation(
    ({ action, remarks }) => updateLosLoanStatus(loanId, { action, remarks }),
    {
      onSuccess: (e) => {
        displayNotification({
          variant: 'success',
          message: e || 'Loan status updated successfully'
        })
        queryClient.invalidateQueries(['los-loan-status-count']);
        queryClient.invalidateQueries('los-loans-by-status');
        setReasonModal({ opened: false, action: null });
        setShowPanel({ status: false, data: '' });
        setRemarks('');
      },
      onError: (e) => {
        displayNotification({
          variant: 'error',
          message: e?.message || 'Failed to update loan status'
        })
      }
    }
  );

  const {
    data: loanDetails,
    isLoading,
    isError,
  } = useQuery(['los-loan-details', loanId], () => getLosLoanById(loanId), {
    enabled: !!loanId && showPanel.status,
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });

  return (
    <Box pt={2}>
      <Paper elevation={2} style={{ borderRadius: 12 }}>
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead className={classes.thead}>
              <tr>
                <th className={classes.th}>Loan ID</th>
                <th className={classes.th}>Applicant</th>
                <th className={classes.th}>Status</th>
                <th className={classes.th}>Amount</th>
                <th className={classes.th}>City</th>
                <th className={classes.th}>Purpose</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: 0 }}>
                    <div className={classes.loaderWrapper}>
                      <Loader size="lg" type="dots" />
                    </div>
                  </td>
                </tr>
              ) : data.length ? (
                data.map((loan) => (
                  <tr
                    key={loan.loan_id}
                    className={classes.row}
                    onClick={() => showLoanDetails(loan)}
                  >
                    <td className={classes.td}>{loan.loan_id}</td>

                    <td className={classes.td}>{loan.applicant_name}</td>

                    <td className={classes.td}>
                      <Badge color="blue" variant="light" size="sm">
                        {loan.status}
                      </Badge>
                    </td>

                    <td className={classes.td}>
                      ₹ {loan.amount_requested?.toLocaleString()}
                    </td>

                    <td className={classes.td}>{loan.city}</td>

                    <td className={classes.td}>{loan.loan_purpose}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={classes.emptyState}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>

      <RightSideDrawer
        size="50%"
        opened={showPanel.status}
        onClose={closeLoanDetails}
        title={
          loanDetails?.loan?.loan_id
            ? `Loan id: ${loanDetails.loan.loan_id}`
            : ''
        }
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 🔹 Scrollable Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 24,
            }}
          >
            {isLoading ? (
              <Stack spacing="md">
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={80} />
              </Stack>
            ) : isError ? (
              <Text color="red">Failed to load loan details</Text>
            ) : loanDetails ? (
              <>
                <Stack spacing="xl">
                  {/* 🔹 Loan Information */}
                  <Card shadow="sm" radius="md" withBorder>
                    <Group position="apart" mb="sm">
                      <Title order={4}>Loan Information</Title>
                      <Badge color="blue" variant="light">
                        {loanDetails.loan?.current_status}
                      </Badge>
                    </Group>

                    <Divider mb="sm" />

                    <SimpleGrid cols={2} spacing="sm">
                      <Text size="sm">
                        <strong>Loan ID:</strong> #{loanDetails.loan?.loan_id}
                      </Text>
                      <Text size="sm">
                        <strong>Amount:</strong> ₹{' '}
                        {loanDetails.loan?.amount_requested?.toLocaleString()}
                      </Text>
                      <Text size="sm">
                        <strong>Purpose:</strong>{' '}
                        {loanDetails.loan?.loan_purpose}
                      </Text>
                      <Text size="sm">
                        <strong>Type:</strong> {loanDetails.loan?.loan_types}
                      </Text>
                      <Text size="sm">
                        <strong>Tenure:</strong> {loanDetails.loan?.tenure}{' '}
                        months
                      </Text>
                      <Text size="sm">
                        <strong>Created:</strong>{' '}
                        {new Date(
                          loanDetails.loan?.created_date
                        ).toLocaleDateString()}
                      </Text>
                    </SimpleGrid>
                  </Card>

                  {/* 🔹 Main Applicant */}
                  <Card shadow="sm" radius="md" withBorder>
                    <Title order={4} mb="sm">
                      Main Applicant
                    </Title>
                    <Divider mb="sm" />

                    <SimpleGrid cols={2} spacing="sm">
                      <Text size="sm">
                        <strong>Name:</strong>{' '}
                        {loanDetails.main_applicant?.full_name}
                      </Text>
                      <Text size="sm">
                        <strong>Mobile:</strong>{' '}
                        {loanDetails.main_applicant?.mobile}
                      </Text>
                      <Text size="sm">
                        <strong>Age:</strong> {loanDetails.main_applicant?.age}
                      </Text>
                      <Text size="sm">
                        <strong>Gender:</strong>{' '}
                        {loanDetails.main_applicant?.gender}
                      </Text>
                      <Text size="sm">
                        <strong>PAN:</strong> {loanDetails.main_applicant?.pan}
                      </Text>
                      <Text size="sm">
                        <strong>Aadhar:</strong>{' '}
                        {loanDetails.main_applicant?.aadhar}
                      </Text>
                    </SimpleGrid>

                    <Text size="sm" mt="sm">
                      <strong>Address:</strong>{' '}
                      {loanDetails.main_applicant?.address}
                    </Text>
                  </Card>

                  {/* 🔹 Co-Applicants */}
                  {loanDetails.coapplicants?.length > 0 && (
                    <Stack spacing="lg">
                      {loanDetails.coapplicants.map((co, index) => (
                        <Card
                          key={co.coapplicant_id || index}
                          shadow="sm"
                          radius="md"
                          withBorder
                        >
                          {/* Header like Loan Info */}
                          <Group position="apart" mb="sm">
                            <Title order={4}>Co-Applicant {index + 1}</Title>

                            <Badge color="grape" variant="light">
                              {co.relationships || 'CO-APPLICANT'}
                            </Badge>
                          </Group>

                          <Divider mb="sm" />

                          {/* Details */}
                          <SimpleGrid cols={2} spacing="sm">
                            <Text size="sm">
                              <strong>Name:</strong> {co.full_name}
                            </Text>

                            <Text size="sm">
                              <strong>Mobile:</strong> {co.mobile}
                            </Text>

                            <Text size="sm">
                              <strong>Age:</strong> {co.age}
                            </Text>

                            <Text size="sm">
                              <strong>Gender:</strong> {co.gender}
                            </Text>

                            <Text size="sm">
                              <strong>PAN:</strong> {co.pan}
                            </Text>

                            <Text size="sm">
                              <strong>Aadhar:</strong> {co.aadhar}
                            </Text>

                            <Text size="sm">
                              <strong>DOB:</strong>{' '}
                              {co.dob
                                ? new Date(co.dob).toLocaleDateString()
                                : '-'}
                            </Text>

                            <Text size="sm">
                              <strong>State:</strong> {co.state || '-'}
                            </Text>
                          </SimpleGrid>

                          <Text size="sm" mt="sm">
                            <strong>Address:</strong> {co.address || '-'}
                          </Text>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </>
            ) : (
              <Text>No details found</Text>
            )}
          </div>

          {loanDetails && (
            <div
              style={{
                padding: 20,
                borderTop: '1px solid #e9ecef',
                background: '#fff',
              }}
            >
              <Group position="right">
                {loanDetails.loan?.current_status?.toLowerCase() !== 'draft' && (
                  <Button
                    color="red"
                    variant="outline"
                    onClick={() =>
                      setReasonModal({ opened: true, action: 'pushback' })
                    }
                  >
                    Pushback
                  </Button>
                )}

                {loanDetails.loan?.current_status?.toLowerCase() !== 'approved' && (
                  <Button
                    color="green"
                    onClick={() =>
                      setReasonModal({ opened: true, action: 'forward' })
                    }
                  >
                    Forward
                  </Button>
                )}
              </Group>
            </div>
          )}
        </div>
      </RightSideDrawer>

      <Modal
        opened={reasonModal.opened}
        onClose={() => {
          setReasonModal({ opened: false, action: null });
          setRemarks('');
        }}
        zIndex={999}
        title={
          reasonModal.action === 'pushback'
            ? 'Pushback Reason'
            : 'Forward to Next Status'
        }
        centered
      >
        <Stack>
          <Textarea
            placeholder="Enter remarks..."
            minRows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.currentTarget.value)}
          />

          <Group position="right">
            <Button
              variant="red"
              onClick={() => {
                setReasonModal({ opened: false, action: null });
                setRemarks('');
              }}
            >
              Cancel
            </Button>

            <Button
              loading={isUpdating}
              disabled={!remarks.trim()}
              color="green"
              onClick={() =>
                changeStatus({
                  action: reasonModal.action,
                  remarks,
                })
              }
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default LoansTable;
