import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import Currency from '../../../components/Number/Currency';
import { getDealershipSalesById, postDealershipSalesById } from '../../../services/dealerships.service';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';

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
  column,
  currentUser
}) => {
  const [info, setInfo] = useState([]);
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    if(id) {
      getDealershipSalesById(id)
        .then(data => setInfo(data))
        .catch(err => null)
    }
  }, [id]);

  const onTextChange = e => {
    const { name, value } = e.target;
    setApiData({
      ...apiData,
      [name]: value
    })
  }

  const saveNewSalesData = () => {
    if(Object.keys(apiData).length < 4) return null;
    const objBody = {
      user_id: currentUser.id, ...apiData
    }
    postDealershipSalesById(id, objBody)
      .then(res => {
        setInfo(res);
        setAddNewRow(false);
      })
      .catch(err => {
        console.log('Sales data save error - ', err);
      })
  }

  // if(Array.isArray(info) && !info.length)
  //   return (
  //     <SalesInfoWrapper>
  //       <Typography align={titleAlign} variant="h5">Sales data not available</Typography>
  //       <div style={{ textAlign: 'center', marginTop: 8, paddingBottom: 8 }}>
  //         <Button color="primary" variant="contained" size="small" onClick={() => null}>Add Sales Data</Button>
  //       </div>
  //     </SalesInfoWrapper>
  //   );

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
                    {row.to_year >= 2020 ?
                      <TableCell align="center" colSpan={2}>{row.ms?.toFixed(2)}</TableCell>
                      : <>
                        <TableCell align="right">{row.ms?.toFixed(2)}</TableCell>
                        <TableCell align="right">{row.hsd?.toFixed(2)}</TableCell>
                      </>}
                    <TableCell align="right">{(row.ms + row.hsd)?.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              }
              {
                addNewRow && (
                  <TableRow key={"new-row"}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        fullWidth={false}
                        label="From Year"
                        name="from_year"
                        type="number"
                        value={apiData.from_year}
                        onChange={onTextChange}
                      />
                      -
                      <TextInput
                        fullWidth={false}
                        label="To Year"
                        name="to_year"
                        type="number"
                        value={apiData.to_year}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="MS (KL)"
                        name="ms"
                        type="number"
                        value={apiData.ms}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="HSD (KL)"
                        name="hsd"
                        type="number"
                        value={apiData.hsd}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setAddNewRow(false);
                        }}>
                          <DeleteForeverRoundedIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        // className={classes.btnSuccess}
                        onClick={saveNewSalesData}>
                          <DoneRoundedIcon fontSize="small" />
                        </Button>
                    </TableCell>
                  </TableRow>

                )
              }
            </TableBody>
          </Table>
          <UserCan
            role={currentUser.role_name}
            perform={rulesList.dealership_edit}
            yes={() => (
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Button color="primary" variant="contained" size="small" onClick={() => setAddNewRow(true)}>Add Sales Data</Button>
              </div>
            )}
          />
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
                    {row.to_year >= 2020 ?
                      <TableCell align="center" colSpan={2}><Currency value={row.ms_rs?.toFixed(2)} /></TableCell>
                      : <>
                        <TableCell align="right"><Currency value={row.ms_rs?.toFixed(2)} /></TableCell>
                        <TableCell align="right"><Currency value={row.hsd_rs?.toFixed(2)} /></TableCell>
                      </>}
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