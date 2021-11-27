import { Select as MSelect } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import apiCall from '../../../utils/api.util';


const LoanInfoWrapper = styled.div`
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: rgba(0, 160, 0, 0.15);
`;

const ViewMoreBtn = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  padding: 5px;
  padding-top: 15px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(176,176,176,0.75) 100%);
  transition: all .35s ease-in-out;

  &:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(176,176,176,0.90) 100%);
  }
`;

const testProducts = [
  {
    product_id: 1,
    product_name: 'FUEL 18',
    interest: 18
  },
  {
    product_id: 2,
    product_name: 'FUEL 28',
    interest: 28
  },
];


const LoanInfo = ({
  data: row,
  status,
  newInfo,
  currentUser,
  editable,
  updateNewLoanInfo
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    apiCall('business/products')
      .then(res => {
        if (res.status === 'SUCCESS') {
          setProducts(res.data || testProducts);
          if (row.product_id) {
            const re = res.data.find(d => d.product_id == row.product_id)
            setSelectedProduct({ ...re, disabled: status !== 'loan_approval' } || {})
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [row?.product_id]);
  return (
    <>
      <LoanInfoWrapper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loan Type</TableCell>
              <TableCell>Interest %</TableCell>
              <TableCell>Penal Interest %</TableCell>
              <TableCell align="right">Req. Amount</TableCell>
              <TableCell align="right">Amount Approved</TableCell>
              {
                ['disbursed', 'disbursement_approval'].includes(status) ? <TableCell align="right">Disbursement Amount</TableCell> : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={row?.id}>
              <TableCell scope="row" component="th">
                <MSelect
                  fullWidth
                  native
                  placeholder={'Select Loan Product'}
                  value={selectedProduct?.product_id}
                  disabled={selectedProduct?.disabled || !editable}
                  onChange={e => {
                    const d = products.find(i => i.product_id == e.target.value)
                    setSelectedProduct(d)
                    updateNewLoanInfo({
                      ...newInfo,
                      product_id: e.target.value
                    })
                  }}
                  style={{
                    color: '#333'
                  }}
                >
                  {/* <option value="">Choose Loan type</option> */}
                  {
                    products.map(item => <option key={item.product_id} value={item.product_id}>{item.product_name}</option>)
                  }
                </MSelect>
              </TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.interest}</strong></TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.penal_interest}</strong></TableCell>
              <TableCell align="right"><Currency value={row?.amount_requested} /></TableCell>
              <TableCell align="right">
                {
                  status === 'loan_approval' ? (
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          number
                          fullWidth={false}
                          value={newInfo?.amount_approved}
                          onChange={e => {
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_approved: e.target.value
                            })
                          }}
                        />
                      )}
                      no={() => <Currency value={row?.amount_approved} />}
                    />
                  )
                    : <Currency value={row?.amount_approved} />
                }
              </TableCell>
              {
                status === 'disbursement_approval' ? (
                  <TableCell align="right">
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          number
                          fullWidth={false}
                          value={newInfo.amount_disbursed}
                          onChange={e => {
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_disbursed: e.target.value
                            })
                          }}
                        />
                      )}
                      no={() => <Currency value={row?.amount_disbursed} />}
                    />
                  </TableCell>
                ) : (status == 'disbursed' ? (
                  <TableCell align="right">
                    <Currency value={row?.amount_disbursed} />
                  </TableCell>
                ) : null)
              }
            </TableRow>
          </TableBody>
        </Table>
      </LoanInfoWrapper>
    </>
  )
}

export default LoanInfo;