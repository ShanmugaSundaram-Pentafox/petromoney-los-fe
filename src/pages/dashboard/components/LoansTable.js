import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, Loader } from '@mantine/core';

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
                    onClick={() => {}}
                  >
                    <td className={classes.td}>#{loan.loan_id}</td>

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

      {/* <RightSideDrawer
        size="70%"
        opened={showPanel.status}
        onClose={() => setShowPanel({ status: false })}
        title={
          showPanel.data?.loan_id
            ? `Loan #${showPanel.data.loan_id}`
            : ''
        }
      >
        <div style={{ padding: 24 }}>
          <p><strong>Applicant:</strong> {showPanel.data?.applicant_name}</p>
          <p><strong>Status:</strong> {showPanel.data?.status}</p>
          <p><strong>Amount:</strong> ₹ {showPanel.data?.amount_requested}</p>
        </div>
      </RightSideDrawer> */}
    </Box>
  );
};

export default LoansTable;
