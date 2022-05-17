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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Formik } from 'formik';
import { head } from 'lodash';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { logger } from '../../config/logger';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getPotentialOpportunity,
} from '../../services/loans.service';
import LoaderButton from '../CommonComponents/Button/LoaderButton';
import { ViewData } from '../CommonComponents/FilePreview';
import Currency from '../Number/Currency';

const OpportunityReport = () => {
  usePageTitle('Opportunity Report');
  const [view, setView] = useState('state');
  const [potentialOpportunity, setPotentialOpportunity] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [orderDirection, setOrderDirection] = useState('asc');
  const total = head(potentialOpportunity?.total);

  useEffect(() => {
    getPotentialOpportunity(view)
      .then((data) => {
        setPotentialOpportunity(data);
        setRowData(data?.result);
      })
      .catch((e) => {
        logger(e);
      });
  }, [view]);

  const sortArray = (arr, orderBy, key) => {
    switch (orderBy) {
    case 'asc':
    default:
      return arr.sort((a, b) =>
        a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
      );
    case 'desc':
      return arr.sort((a, b) =>
        a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0
      );
    }
  };

  const handleSortRequest = (key) => {
    setRowData(sortArray(potentialOpportunity?.result, orderDirection, key));
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

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
              setRowData(data?.result);
            })
            .catch((e) => {
              logger(e);
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
                value={values?.conversion_ratio}
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
                value={values?.ticket_size}
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
              title="Potential Opportunity"
              value={
                <span style={{ fontSize: '1.4rem', color: '#3f51b5' }}>
                  <strong>
                    <Currency value={total?.total_average_ticket_count} />
                  </strong>
                  {' Crs'}
                </span>
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
              <TableCell onClick={() => handleSortRequest('name')}>
                <TableSortLabel active={true} direction={orderDirection}>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </TableSortLabel>
              </TableCell>
              <TableCell>IOCL</TableCell>
              <TableCell>HPCL</TableCell>
              <TableCell>BPCL</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Converted Dealer Count</TableCell>
              <TableCell
                style={{ width: '20%' }}
                onClick={() => handleSortRequest('average_ticket_count')}
              >
                <TableSortLabel active={true} direction={orderDirection}>
                  Proposed Exposure (in Crs)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowData)?.map((item, index) => (
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
    </>
  );
};

export default OpportunityReport;
