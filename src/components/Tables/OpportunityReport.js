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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core/styles';
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
import { Table } from '@mantine/core';

const useStyles = makeStyles(theme => ({
  totalamount: {
    padding: '20px 30px 20px 30px',
    backgroundColor: '#FfFfFf',
    borderRadius: 4,
    minWidth: '170px'
  },
  getdata: {
    padding: '30px 30px 30px 30px',
    backgroundColor: '#FfFfFf',
    borderRadius: 4,
    flexGrow: '2'
  },
  currencyvalue: {
    fontSize: '2rem',
    color: '#3f51b5'
  },
  crs: {
    color: '#a9a9a9',
    fontWeight: '900',
    fontSize: '1.3rem',
    alignSelf: 'flex-end',
    marginBottom: '3px'
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#888'
  }
}))

const OpportunityReport = () => {
  usePageTitle('Opportunity Report');
  const classes = useStyles();
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
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f3f3f3',
              gap: '18px'
            }}
          >
            <div className={classes.totalamount}>
              {/* title="Potential Opportunity" */}
              <span style={{ display: 'flex', gap: '5px' }}>
                <strong style={{ alignSelf: 'flex-end' }}>
                  <Currency value={total?.total_average_ticket_count} className={classes.currencyvalue} />
                </strong>
                <span className={classes.crs}>Crs</span>
              </span>
              <span className={classes.title}>Potential Opportunity</span>
            </div>
            <div className={classes.getdata}>
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
        <Table horizontalSpacing="md" style={{ fontSize: '12px' }} striped highlightOnHover>
          <Table.Thead style={{ background: 'rgba(228, 237, 253, 1)' }}>
            <Table.Tr>
              <Table.Th onClick={() => handleSortRequest('name')}>
                {/* <TableSortLabel active={true} direction={orderDirection}> */}
                {view.charAt(0).toUpperCase() + view.slice(1)}
                {/* </TableSortLabel> */}
              </Table.Th>
              <Table.Th>IOCL</Table.Th>
              <Table.Th>HPCL</Table.Th>
              <Table.Th>BPCL</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Converted Dealer Count</Table.Th>
              <Table.Th
                style={{ width: '20%' }}
                onClick={() => handleSortRequest('average_ticket_count')}
              >
                {/* <TableSortLabel active={true} direction={orderDirection}> */}
                Proposed Exposure (in Crs)
                {/* </TableSortLabel> */}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(rowData)?.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item?.name}</Table.Td>
                <Table.Td>{item?.IOCL}</Table.Td>
                <Table.Td>{item?.HPCL}</Table.Td>
                <Table.Td>{item?.BPCL}</Table.Td>
                <Table.Td>{item?.opportunities}</Table.Td>
                <Table.Td>{item?.converted_dealers_count}</Table.Td>
                <Table.Td>{item?.average_ticket_count}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Td>
              <strong>Total</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_IOCL}</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_HPCL}</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_BPCL}</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_opportunities}</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_converted_dealers_count}</strong>
            </Table.Td>
            <Table.Td>
              <strong>{total?.total_average_ticket_count}</strong>
            </Table.Td>
          </Table.Tfoot>
        </Table>
      </Box>
    </>
  );
};

export default OpportunityReport;
