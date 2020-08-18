import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Currency from '../../../components/Number/Currency';
import { getDealershipSalesById } from '../../../services/dealerships.service';

/**
{
  "dealership_id": 15257010,
  "from_year": 2016,
  "hsd": 593.77,
  "hsd_rs": 930.03,
  "ms": 729.0,
  "ms_rs": 1343.0,
  "tmf": 1523.8,
  "to_year": 2017
}
 */

const SalesInfoWrapper = styled.div`
  padding-top: 8px;
  h5 {
    // margin-top: 12px;
    // font-size: 18px;
    padding-left: 8px;
  }
`;

const SalesTableWrapper = styled.div`
  display: flex;
  padding: 4px 0;
  flex-direction: ${props => props.column ? 'column' : 'row'};

  > div {
    padding: 8px;
    &:last-child {
      // flex: 1;
      // padding-left: 12px;
    }
  }
`;

const SalesInfo = ({
  id,
  titleAlign,
  column
}) => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    if(id) {
      getDealershipSalesById(id)
        .then(data => setInfo(data))
        .catch(err => null)
    }
  }, [id])

  if(Array.isArray(info) && !info.length)
    return (
      <SalesInfoWrapper>
        <Typography align={titleAlign} variant="h5">Sales data not available</Typography>
        <div style={{ textAlign: 'center', marginTop: 8, paddingBottom: 8 }}>
          <Button color="primary" variant="contained" size="small" onClick={() => null}>Add/Modify Sales Data</Button>
        </div>
      </SalesInfoWrapper>
    );

  return (
    <SalesInfoWrapper>
      <Typography align={titleAlign} variant="h5">Sales History</Typography>
      <SalesTableWrapper column={column}>
        <div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sales Data(in KL)</TableCell>
                <TableCell align="center">MS</TableCell>
                <TableCell align="center">HSD</TableCell>
                <TableCell align="right">Total (in KL)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                info.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{row.from_year} - {row.to_year}</TableCell>
                    <TableCell align="right">{row.ms?.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.hsd?.toFixed(2)}</TableCell>
                    <TableCell align="right">{(row.ms + row.hsd)?.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Button color="primary" variant="contained" size="small" onClick={() => null}>Add/Modify Sales Data</Button>
          </div>
        </div>
        <div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sales Data(in Lakhs)</TableCell>
                <TableCell align="center">MS</TableCell>
                <TableCell align="center">HSD</TableCell>
                <TableCell align="right">Total (in Lakhs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                info.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{row.from_year} - {row.to_year}</TableCell>
                    <TableCell align="right"><Currency value={row.ms_rs?.toFixed(2)} /></TableCell>
                    <TableCell align="right"><Currency value={row.hsd_rs?.toFixed(2)} /></TableCell>
                    <TableCell align="right"><Currency value={(row.ms_rs + row.hsd_rs)?.toFixed(2)} /></TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </SalesTableWrapper>
      
    </SalesInfoWrapper>
  )
}

export default SalesInfo;