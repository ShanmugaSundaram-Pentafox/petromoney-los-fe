import {
  Typography,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputAdornment,
  Box,
  TableFooter,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import { makeStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import { head } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import { logger } from '../../config/logger';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getOpportunities,
  getPotentialOpportunity,
} from '../../services/loans.service';
import LoaderButton from '../CommonComponents/Button/LoaderButton';
import { ViewData } from '../CommonComponents/FilePreview';
import Currency from '../Number/Currency';

const useStyles = makeStyles(() => ({
  cardWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rootCard: {
    flex: '2 0 21%',
    margin: 8,
    padding: 16,
    minWidth: 220,
    backgroundColor: '#FFF',
    borderRadius: 6,
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
  },
  cardTitle: {
    fontSize: '1.4rem',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginTop: 8,
  },
  value: {
    fontSize: '28px',
    fontWeight: 'bolder',
  },
  valueTitle: {
    color: 'rgb(0,0,0,0.3)',
  },
  iconStyle: {
    position: 'absolute',
    color: 'rgb(0,0,0,0.03)',
    right: '-85px',
    top: '-10px',
    fontSize: 240,
    zIndex: '-1px',
  },
}));

const OpportunityReport = () => {
  usePageTitle('Opportunity Report');
  const classes = useStyles();
  const [opportunities, setOpportunities] = useState();
  const [view, setView] = useState('state');
  const [potentialOpportunity, setPotentialOpportunity] = useState([]);
  const total = head(potentialOpportunity?.total);

  useEffect(() => {
    getPotentialOpportunity(view)
      .then((data) => {
        setPotentialOpportunity(data);
      })
      .catch((e) => {
        logger(e)
      });
  },[view])

  useMount(() => {
    getOpportunities()
      .then(setOpportunities)
      .catch((e) => {
        logger(e)
      });
  });

  const vSchema = Yup.object().shape({
    conversion_ratio: Yup.number()
      .required('Enter Convertion Ratio')
      .min(1, '1% is minimum value')
      .max(100, '100% is maximum value'),
    ticket_size: Yup.number()
      .required('Enter Ticket Size')
      .min(1, '1Lacs in minimum value')
      .max(45, '45Lacs is maximum value'),
  });

  return (
    <>
      <Formik
        initialValues={{ conversion_ratio: 30, ticket_size: 15 }}
        validateOnBlur
        validationSchema={vSchema}
        validateOnChange={false}
        onSubmit={(values) => {
          getPotentialOpportunity(view, values)
            .then((data) => {
              setPotentialOpportunity(data);
            })
            .catch((e) => {
              logger(e)
            });
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <Paper
            style={{
              margin: 8,
              padding: 16,
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <TextField
                name="conversion_ratio"
                type="number"
                defaultValue={30}
                variant="outlined"
                label="Conversion Ratio"
                helperText={errors?.conversion_ratio}
                error={errors?.conversion_ratio}
                style={{ marginRight: 8 }}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
              />
              <TextField
                name="ticket_size"
                type="number"
                defaultValue={15}
                variant="outlined"
                label="Avg Ticket Size in Lacs"
                helperText={errors?.ticket_size}
                error={errors?.ticket_size}
                style={{ marginLeft: 8 }}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">Lacs</InputAdornment>
                  ),
                }}
              />
              <LoaderButton
                variant="outlined"
                color="primary"
                style={{ marginLeft: 16 }}
                onClick={handleSubmit}
              >
                Get Data
              </LoaderButton>
            </div>
            <ViewData
              title="Potential Opportunity (in Crs)"
              value={
                <Currency
                  value={total?.total_average_ticket_count}
                />
              }
            />
          </Paper>
        )}
      </Formik>
      <Box component={Paper} style={{ borderRadius: 4, margin: 8 }}>
        <div
          style={{
            margin: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Typography variant="h4">Potential Opportunity</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              defaultValue="state"
              value={view}
              onChange={(event) => setView(event.target.value)}
            >
              <FormControlLabel
                value="state"
                control={<Radio size="small" />}
                label="State Wise"
              />
              <FormControlLabel
                value="region"
                control={<Radio size="small" />}
                label="Region Wise"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{view.charAt(0).toUpperCase() + view.slice(1)}</TableCell>
              <TableCell>IOCL</TableCell>
              <TableCell>HPCL</TableCell>
              <TableCell>BPCL</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Converted Dealer Count</TableCell>
              <TableCell style={{ width: '20%' }}>
                Proposed Exposure (in Crs)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {potentialOpportunity?.result?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.IOCL}</TableCell>
                <TableCell>{item?.HPCL}</TableCell>
                <TableCell>{item?.BPCL}</TableCell>
                <TableCell>{item?.opportunities}</TableCell>
                <TableCell>{item?.converted_dealers_count}</TableCell>
                <TableCell>{item?.average_ticket_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                <strong>{total?.total_IOCL}</strong>
              </TableCell>
              <TableCell>
                <strong>{total?.total_HPCL}</strong>
              </TableCell>
              <TableCell>
                <strong>{total?.total_BPCL}</strong>
              </TableCell>
              <TableCell>
                <strong>{total?.total_opportunities}</strong>
              </TableCell>
              <TableCell>
                <strong>{total?.total_converted_dealers_count}</strong>
              </TableCell>
              <TableCell>
                <strong>{total?.total_average_ticket_count}</strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
      <div className={classes.cardWrapper}>
        <OpportunityCard
          title="Leads"
          currValue={opportunities?.current?.leads}
          projValue={opportunities?.projection?.leads}
          icon={PersonOutlinedIcon}
        />
        <OpportunityCard
          title="Convertion Count"
          currValue={opportunities?.current?.convertion_count}
          projValue={opportunities?.projection?.convertion_count}
          icon={CachedOutlinedIcon}
        />
        <OpportunityCard
          title="Avg. Time Taken"
          currValue={opportunities?.current?.average_time_taken}
          projValue={opportunities?.projection?.average_time_taken}
          icon={AccessTimeOutlinedIcon}
        />
        <OpportunityCard
          title="Rejection Count"
          currValue={opportunities?.current?.rejection_count}
          projValue={opportunities?.projection?.rejection_count}
          icon={CancelOutlinedIcon}
        />
        <OpportunityCard
          title="Amount Approved"
          currValue={opportunities?.current?.amount_approved}
          projValue={opportunities?.projection?.amount_approved}
          currency={true}
          icon={BeenhereOutlinedIcon}
        />
        <OpportunityCard
          title="Avg. Amount"
          currValue={opportunities?.current?.average_amount}
          projValue={opportunities?.projection?.average_amount}
          currency={true}
          icon={AccountBalanceOutlinedIcon}
        />
      </div>
    </>
  );
};

const OpportunityCard = ({
  title,
  currValue,
  projValue,
  currency = false,
  icon,
}) => {
  const classes = useStyles();
  const Icon = icon;
  return (
    <div className={classes.rootCard}>
      <Icon className={classes.iconStyle} />
      <div className={classes.cardTitle}>{title}</div>
      <div className={classes.content}>
        <span className={classes.value}>
          {currency ? <Currency value={currValue} /> : currValue}
        </span>
        <div className={classes.valueTitle}>Current</div>
      </div>
      <div className={classes.content}>
        <span className={classes.value}>
          {currency ? <Currency value={projValue} /> : projValue}
        </span>
        <Typography variant="body1" className={classes.valueTitle}>
          Projection
        </Typography>
      </div>
    </div>
  );
};

export default OpportunityReport;
