import {
  makeStyles,
  Table,
  TableBody,
  TableCell as TableCellComp,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import { head, sumBy } from 'lodash';
import React from 'react';
import Currency from '../../../components/Number/Currency';
import { getMonth as monthData } from '../../../utils/commonFunctions.util';

const useStyles = makeStyles(() => ({
  subtitle: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 8,
  },
  tableStyle: {
    marginTop: 16,
    width: '40%',
  },
}));

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp);

const BankingInputsTable = ({ data, header }) => {
  const classes = useStyles();
  const header_data = head(header?.scorecard_master_data);

  return (
    <div>
      <Typography variant="h6">Banking Details</Typography>
      {data?.bank_metadata?.length ? (
        data?.bank_metadata?.map((bank, i) => {
          return (
            <Table style={{ marginBottom: 16 }} key={i}>
              <TableHead>
                <TableCell colSpan={2}>Bank Verification Status</TableCell>
                <TableCell colSpan={2} variant="body">
                  {header_data?.bank_verification_status}
                </TableCell>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                  >{`Bank ${bank.bank_number}:`}</TableCell>
                  <TableCell colSpan={3} align="center">
                    Account Holder Name
                  </TableCell>
                  <TableCell colSpan={3} variant="body">
                    {bank?.account_holder_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bank Name</TableCell>
                  <TableCell colSpan={2} variant="body">
                    {bank?.bank_name}
                  </TableCell>
                  <TableCell>Account No.</TableCell>
                  <TableCell colSpan={2} variant="body">
                    {bank?.account_no}
                  </TableCell>
                  <TableCell colSpan={2}>Type of Account</TableCell>
                  <TableCell colSpan={2} variant="body">
                    {bank?.account_type}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Peak Utilisation Level</TableCell>
                  <TableCell>Sanctioned Limit/ DrawingPower</TableCell>
                  <TableCell>Uilisation Percentage</TableCell>
                  <TableCell>No of Inward Bounce</TableCell>
                  <TableCell>No of Outward Bounce</TableCell>
                  <TableCell>Balance on 5th</TableCell>
                  <TableCell>Balance on 15th</TableCell>
                  <TableCell>Balance on 25th</TableCell>
                  <TableCell>Average Monthly Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.bank_transaction_details
                  ?.filter((item) => {
                    return bank?.bank_number === item?.bank_number;
                  })
                  ?.map((row, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          {
                            monthData.find((month) => {
                              return month.value == row.month;
                            })?.label
                          }{' '}
                          - {row.year}
                        </TableCell>
                        <TableCell>
                          <Currency value={row?.peak_util_lvl} />
                        </TableCell>
                        <TableCell>
                          <Currency value={row?.sanctioned_limit} />
                        </TableCell>
                        <TableCell>
                          {row?.util_percent && row?.util_percent + '%'}
                        </TableCell>
                        <TableCell>{row?.no_of_inward_bounce}</TableCell>
                        <TableCell>{row?.no_of_outward_bounce}</TableCell>
                        <TableCell>
                          <Currency value={row?.bal_on_5th} />
                        </TableCell>
                        <TableCell>
                          <Currency value={row?.bal_on_15th} />
                        </TableCell>
                        <TableCell>
                          <Currency value={row?.bal_on_25th} />
                        </TableCell>
                        <TableCell>
                          <Currency value={row?.avg_mon_bal} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Average</TableCell>
                  <TableCell>
                    <Currency
                      value={
                        sumBy(
                          data?.bank_transaction_details?.filter((item) => {
                            return bank?.bank_number === item?.bank_number;
                          }),
                          'peak_util_lvl'
                        ) / 6?.toFixed(2)
                      }
                    />
                  </TableCell>
                  <TableCell colSpan={7} align="right">
                    ABB of last 6 months
                  </TableCell>
                  <TableCell>
                    <Currency
                      value={
                        sumBy(
                          data?.bank_transaction_details?.filter((item) => {
                            return bank?.bank_number === item?.bank_number;
                          }),
                          'avg_mon_bal'
                        ) / 6?.toFixed(2)
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          );
        })
      ) : (
        <Typography className={classes.subtitle} variant="body2">
          No banking details found!
        </Typography>
      )}
      {data?.bank_metadata?.length ? (
        <Table className={classes.tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>ABB for all Banks (Rs)</TableCell>
              <TableCell variant="body">
                <Currency
                  value={head(data?.banks_overall_stats)?.abb_for_all_banks}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Inward Bounces (Nos)</TableCell>
              <TableCell variant="body">
                {head(data?.banks_overall_stats)?.total_inward_bounces}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Peak CC / OD Utilisation (Rs)</TableCell>
              <TableCell variant="body">
                <Currency
                  value={head(data?.banks_overall_stats)?.avg_peak_util}
                />
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      ) : null}
    </div>
  );
};

export default BankingInputsTable;
