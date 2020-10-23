import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextInput from '../../../components/TextInput/TextInput';
import Currency from '../../../components/Number/Currency';
import ExpensesTable from './ExpensesTable';
import IncomeTable from './IncomeTable';
import { postDealershipFinancialsById, getDealershipFinancialsById } from '../../../services/dealerships.service';
import { useMount } from 'react-use';

const useStyles = makeStyles(theme => ({
  row: {
    paddingRight: 4,
    paddingBottom: 14
  },
  lastRow: {
    paddingRight: 4,
    paddingBottom: 0
  },
  stepperRoot: {
    padding: 0,
    paddingTop: 16
  },
  stepTitle: {
    '& .MuiStepLabel-label.MuiStepLabel-active': {
      fontSize: 15,
      fontWeight: 600
    }
  },
  sidePanelTitle: {
    fontSize: 18,
    padding: '8px 4px',
    marginBottom: 8,
    borderBottom: '1px dashed #ccc',
    background: '#f6f6f6'
  },
  textLabel: {
    fontSize: 14,
    paddingBottom: 8
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}));

const Text = ({ children }) => {
  const classes = useStyles();
  return <Typography className={classes.textLabel} variant="p">{children}</Typography>
}

const Row = ({ text, value, children }) => {
  return (
    <TableRow>
      <TableCell>{text}</TableCell>
      <TableCell>{children || <strong>{value}</strong>}</TableCell>
    </TableRow>
  )
}

const CreditReportForm = ({ id, editable, data, values, errors, onChange, setValues, currentUser }) => {
  const classes = useStyles();
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  return (
    <Grid container>
      <Grid {...gridItem}>
        <Grid item md={6}>
          <TextInput
            readOnly={!editable}
            label="Business Vintage with OMC"
            name="business_vintage"
            type="number"
            value={values.business_vintage || ""}
            onChange={onChange}
            />
        </Grid>
      </Grid>
      <Grid {...gridItem}>
        <Grid container>
          <Grid {...gridItem}>
            <Typography className={classes.sidePanelTitle} variant="h4">Financials</Typography>
            <Table className={classes.table} size="small" aria-label="Financials">
              <TableHead>
                <TableRow>
                  <TableCell>Latest Financial Year {values.from_year ? `${values.from_year}_${values.to_year}` : ''}</TableCell>
                  <TableCell>Previous Financial Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2019 - 2020</TableCell>
                  <TableCell>2018 - 2019</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <FinanceFormData
                      id={id}
                      type={'latest_fy'}
                      data={data.latest_fy}
                      values={values.latest_fy || {}}
                      errors={errors}
                      editable={editable}
                      btnLabel={'Latest FY'}
                      currentUser={currentUser}
                    />
                  </TableCell>
                  <TableCell>
                    <FinanceFormData
                      id={id}
                      type={'previous_fy'}
                      data={data.previous_fy}
                      values={values.previous_fy || {}}
                      errors={errors}
                      editable={editable}
                      btnLabel={'Previous FY'}
                      currentUser={currentUser}
                    />
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell colSpan={2}>
                    <Text>Change in net profit over sales % for last 2 years <strong>{`-%`}</strong></Text>
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>          
          </Grid>
          {/* <Grid {...gridItem} md={6}>
            <Grid {...gridItem}>
              <TextInput
                select
                readOnly
                label="Latest Financial Year"
                name="latest_fy"
                value={`${values.from_year}_${values.to_year}`}
                onChange={onChange}
                SelectProps={{
                  native: true,
                }}
                >
                  <option value="2020_2021">FY 2020-2021</option>
              </TextInput>
            </Grid>
            <FinanceFormData
              data={data.latest_fy}
              values={values.latest_fy || {}}
              errors={errors}
              btnLabel={'Latest FY'}
              onSave={v => saveFinanceData('latest_fy', v)}
            />
          </Grid> */}
          {/* <Grid {...gridItem} md={6}>
            <Grid {...gridItem}>
              <TextInput
                select
                readOnly
                label="Previous Financial Year"
                name="previous_fy"
                value={`${values.from_year}_${values.to_year}`}
                onChange={onChange}
                SelectProps={{
                  native: true,
                }}
                >
                  <option value="2019_2020">FY 2019-2020</option>
              </TextInput>
            </Grid>
            <FinanceFormData
              data={data.previous_fy}
              values={values.previous_fy || {}}
              errors={errors}
              btnLabel={'Previous FY'}
              onSave={v => saveFinanceData('previous_fy', v)}
            />
          </Grid> */}
        </Grid>
        {/* <Grid item>
          <Typography className={classes.textLabel} variant="p">
            Change in net profit over sales % for last 2 years <strong>{`Change%`}</strong>
          </Typography>
        </Grid> */}
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">General Factors</Typography>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          readOnly={!editable}
          label="Vintage with main banker"
          name="vintage_with_banker"
          type="number"
          value={values.vintage_with_banker || ""}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          readOnly={!editable}
          label="No of inward returns(last 6 months)"
          name="inward_returns"
          type="number"
          value={values.inward_returns || ""}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          readOnly={!editable}
          label="No of other services"
          name="other_services_count"
          value={values.other_services_count}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          readOnly={!editable}
          label="Social score"
          name="social_score"
          value={values.social_score}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          readOnly={!editable}
          label="PD Officer Assessment"
          name="pd_officer_remarks"
          value={values.pd_officer_remarks}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="Very Poor">Very Poor</option>
          <option value="Poor">Poor</option>
          <option value="Fair">Fair</option>
          <option value="Good">Good</option>
          <option value="Excellent">Excellent</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">Sales Margin</Typography>
        <Text>Total Gross Income from Fuel Sale <strong>{values.gross_income_fuel ? <Currency value={values.gross_income_fuel} /> : '-'}</strong></Text>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">Income</Typography>
        <IncomeTable id={id} editable={editable} currentUser={currentUser} />
      </Grid>
      <Grid {...gridItem}>
        <Text>Total Income <strong><Currency value={values.total_income} /></strong></Text>
      </Grid>
      <Grid {...gridItem}>
        <Text>Gross Income Considered <strong><Currency value={values.gross_income_considered} /></strong></Text>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">Expenses</Typography>
        <ExpensesTable id={id} editable={editable} currentUser={currentUser} />
      </Grid>
      <Grid {...gridItem}>
        <Text>Total Expenses other than Depreciation, Interest &amp; Tax <strong><Currency value={values.total_expense} /></strong></Text>
      </Grid>
      <Grid {...gridItem}>
        <Text>EBIDTA (Gross Income - All Expenses) <strong><Currency value={values.ebidta} /></strong></Text>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">Obligations</Typography>
        <Table className={classes.table} size="small" aria-label="Expenses">
          <TableBody>
            <Row text={`Existing Loan Obligations in form of EMI`}>
              <TextInput
                money
                readOnly={!editable}
                name="current_loans_emi"
                type="number"
                value={values.current_loans_emi || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Interest PA on Working Capital Limits (From P&L)`}>
              <TextInput
                money
                readOnly={!editable}
                name="interest"
                type="number"
                value={values.interest || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Total Existing Obligations`} value={<Currency value={values.total_obligations} />} />
          </TableBody>
        </Table>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.sidePanelTitle} variant="h4">Eligibility</Typography>
        <Table className={classes.table} size="small" aria-label="Expenses">
          <TableBody>
            <Row text={`FOIR % Considered`} value={`${values.foir}`} />
            <Row text={`FOIR % EBIDTA`} value={values.foir_ebidta} />
            <Row text={`Eligibility for Loan`} value={values.is_loan ? 'Yes' : '-'} />
            <Row text={`Max monthly interest possible on fuel credit`} value={values.max_loan_interest} />
            <Row text={`Applicable Interest Rate for Loan per Annum %`} value={values.applicable_interest} />
            <Row text={`Max Loan possible as per FOIR on EBIDTA`} value={values.max_loan_foir} />
            <Row text={`Annual Turnover (Rs)`}>
              <TextInput
                money
                readOnly={!editable}
                name="turnover"
                type="number"
                value={values.turnover || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`% of Turnover to be considered for Loan`}>
              <TextInput
                readOnly={!editable}
                name="max_loan_turnover"
                type="number"
                value={values.max_loan_turnover || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Max Loan possible as per Turnover criteria`} value={<Currency value={values.max_loan_possible} />} />
            <Row text={`Score as per Scorecard`}>
              <TextInput
                readOnly={!editable}
                name="score"
                type="number"
                value={values.score || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Score Impact`} value={values.score_impact} />
            <Row text={`Max Loan Exposure Possible post Score Impact`} value={values.max_loan_score} />
            <Row text={`Max Exposure Cap as per policy (RS)`}>
              <TextInput
                money
                readOnly={!editable}
                name="max_loan_cap"
                type="number"
                value={values.max_loan_cap || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Existing PetroMoney Exposure`} value={values.pm_exposure} />
            <Row text={`Max Loan Possible (after applying policy caps) (Rs)`} value={<Currency value={values.final_loan_value} />} />
            <Row text={`Loan Amount applied for (Rs)`}>
              <TextInput
                money
                readOnly={!editable}
                name="approved_loan_amount"
                type="number"
                value={values.approved_loan_amount || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Loan Amount to be given (Rs)`}>
              <TextInput
                money
                readOnly={!editable}
                name="final_loan_amount"
                type="number"
                value={values.final_loan_amount || ""}
                onChange={onChange}
                />
            </Row>
            <Row text={`Annual Interest on Loan Amount (Rs)`} value={<Currency value={values.loan_interest} />} />
            <Row text={`FOIR % on fuel credit`} value={values.foir_percentage*100} />
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

const FinanceFormData = ({ id, editable, type, data, btnLabel, values={}, errors,  currentUser }) => {
  const classes = useStyles();
  const [financeData, setFinanceData] = useState(values);
  const [financeErrors, setFinanceErrors] = useState({});
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  useMount(() => {
    getDealershipFinancialsById(id)
      .then(res => {
        setFinanceData(res);
        const d = (res[0] || {}).to_year == 2020 && type == 'latest_fy' ? res[0] : res[1]; 
        setFinanceData(d || {});
      })
      .catch(err => {
        console.log('Finance data fetch error - ', type, err)
      })
  })

  const onTextChange = e => {
    const { name, value } = e.target;
    setFinanceData({
      ...financeData,
      [name]: value
    })
  }

  const validateFinanceData = () => {
    // TODO: need to add validation
    postDealershipFinancialsById(id, { type, user_id: currentUser.id, ...financeData })
      .then(res => {
        setFinanceData(res)
      })
      .catch(err => {
        console.log('Finance form save error - ', type, err)
      })
  }

  return (
    <Grid container>
      <Grid {...gridItem}>
        <Grid item>
          <TextInput
            money
            readOnly={!editable}
            label="Turnover"
            name="turnover"
            type="number"
            value={financeData.turnover || ""}
            onChange={onTextChange}
            />
        </Grid>
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          money
          readOnly={!editable}
          label="Net Profit before Tax"
          name="net_profit"
          type="number"
          value={financeData.net_profit || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          disabled
          readOnly
          label="NP %"
          name="net_profit_percentage"
          type="number"
          value={((financeData.net_profit_percentage || 0) * 100) || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          disabled
          readOnly
          label="NP % Change"
          name="net_profit_change_percentage"
          type="number"
          value={financeData.net_profit_change_percentage || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          money
          readOnly={!editable}
          label="Income tax for the year"
          name="it_paid"
          type="number"
          value={financeData.it_paid || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          money
          readOnly={!editable}
          label="Net Worth (Equity + Reserves)"
          name="networth"
          type="number"
          value={financeData.networth || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          money
          readOnly={!editable}
          label="Value if assets owned by family members"
          name="assets_value"
          type="number"
          value={financeData.assets_value || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          money
          readOnly={!editable}
          label="Total loan amount outstanding"
          name="loan_os"
          type="number"
          value={financeData.loan_os || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          disabled
          readOnly
          label="Leverage (No of Times)"
          name="leverage"
          type="number"
          value={financeData.leverage || ""}
          onChange={onTextChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <Text>Change in net profit over sales % for last 2 years <strong>{financeData.change_in_profit_over_sales}%</strong></Text>
      </Grid>
      {
        editable && (
          <Grid {...gridItem} className={classes.lastRow}>
            <Button
              variant="contained"
              className={classes.btnSuccess}
              onClick={validateFinanceData}>Save {btnLabel}</Button>
          </Grid>
        )
      }
    </Grid>
  )
}

export default CreditReportForm;
