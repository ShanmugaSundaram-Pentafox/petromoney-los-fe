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
import { resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getProductsMaster } from '../../../services/common.service';
import { isAllowed } from '../../../utils/cerbos';

const LoanInfoWrapper = styled.div`
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: rgba(0, 160, 0, 0.15);
`;

const LoanInfo = ({
  data: row,
  status,
  newInfo,
  currentUser,
  editable,
  updateNewLoanInfo,
  viewable
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({ amount_approved: newInfo?.amount_approved });

  useEffect(() => {
    getProductsMaster()
      .then((data) => {
        setProducts(data)
        if (row.product_id) {
          const re = data.find(d => d.product_id == row.product_id)
          setSelectedProduct({ ...re, disabled: status !== 'loan_approval' && status !== 'submitted' && status !== 'loan_review' } || {})
        }
      })
      .catch(() => null)
    if (status === 'disbursement_approval') {
      updateNewLoanInfo({
        ...newInfo,
        amount_disbursed: newInfo.amount_approved
      })
    }
  }, [row?.product_id, status]);
  return (
    <>
      <LoanInfoWrapper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loan Type</TableCell>
              <TableCell>Interest %</TableCell>
              <TableCell>Penal Interest %</TableCell>
              <TableCell align="right">Amount</TableCell>
              {viewable && <TableCell align="right">Amount Approved</TableCell>}
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
                  disabled={selectedProduct?.disabled || !isAllowed(currentUser?.permissions, resources_id.dashboard,'edit_loantype')}
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
              {/* option to edit requested amount of the loan in submit and review queue */}
              <TableCell align="right">
                {
                  ['submitted','loan_review']?.includes(status) ? (
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          number
                          fullWidth={false}
                          defaultValue={row?.amount_requested}
                          onChange={e => {
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_requested: e.target.value
                            })
                          }}
                        />
                      )}
                      no={() => <Currency value={row?.amount_requested} />}
                    />
                  )
                    : <Currency value={row?.amount_requested} />
                }
              </TableCell>
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
                          defaultValue={row?.amount_requested}
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
                    : viewable && <Currency value={row?.amount_approved} />
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
                          defaultValue={row?.amount_approved}
                          onChange={e => {
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_disbursed: e.target.value || row?.amount_approved
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