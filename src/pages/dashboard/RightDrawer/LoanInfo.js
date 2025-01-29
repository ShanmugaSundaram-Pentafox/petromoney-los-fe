import { Box, Group, Select, Table } from '@mantine/core';
import { makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan from '../../../components/UserCan/UserCan';
import { resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getProductsMaster } from '../../../services/common.service';
import { isAllowed } from '../../../utils/cerbos';


const useStyles = makeStyles(theme => ({
  tablerowheader: {
    textAlign: 'right',
  }
}))

const LoanInfo = ({
  data: row,
  status,
  newInfo,
  currentUser,
  type,
  updateNewLoanInfo,
  viewable
}) => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({ amount_approved: newInfo?.amount_approved });

  useEffect(() => {
    getProductsMaster()
      .then((data) => {
        setProducts(data?.filter(i => i?.is_show))
        if (row.product_id) {
          const re = data.find(d => d.product_id == row.product_id)
          setSelectedProduct({
            ...re,
            disabled: status !== 'loan_approval' && status !== 'submitted' && status !== 'loan_review' && status !== '' && status == 'approved' && status == 'rejected'
          } || {})
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
      <Box p="sm" bg="indigo.0" mb="md" className="rounded-lg">
        {type === 'enhancement' || type === 're-onboarding' && (
          <Group gap={20} m={'xs'}>
            <Group gap={6}>
              <ViewData title='Old Product' value={newInfo?.old_product_name} />
            </Group>
            <Group gap={6}>
              <ViewData style={{ marginLeft: 10 }} title='Old loan Amount' value={<Currency value={newInfo?.old_loan_amount} />} />
            </Group>
          </Group>
        )}

        <Table
          classNames={{
            table: '!text-xs',
            th: 'whitespace-nowrap'
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Loan Type</Table.Th>
              <Table.Th className={classes.tablerowheader}>Interest %</Table.Th>
              <Table.Th className={classes.tablerowheader}>Penal Interest %</Table.Th>
              
              <Table.Th className={classes.tablerowheader}>Amount</Table.Th>
              {viewable && (
                <Table.Th className={classes.tablerowheader}>Amount Approved</Table.Th>
              )}
              {['disbursed', 'disbursement_approval'].includes(status) ? (
                <Table.Th className={classes.tablerowheader}>Disbursement Amount</Table.Th>
              ) : null}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <Table.Tr key={row?.id}>
              <Table.Td>
                <Select
                  value={String(selectedProduct?.product_id)}
                  disabled={selectedProduct?.disabled || !isAllowed(currentUser?.permissions, resources_id.dashboard, 'edit_loantype')}
                  data={products.map((item) => ({
                    value: String(item.product_id),
                    label: item.product_name,
                  }))}
                  styles={{ dropdown: { zIndex: 999999 } }}
                  onChange={(value) => {
                    console.log('VALUE : ', typeof (value))
                    console.log('TYPE : ', typeof (updateNewLoanInfo))
                    const d = products.find(i => i.product_id == parseInt(value))
                    setSelectedProduct(d)
                    updateNewLoanInfo && updateNewLoanInfo(!['approved', 'rejected'].includes(status) ? {
                      product_id: parseInt(value)
                    } : {
                      ...newInfo,
                      product_id: parseInt(value)
                    })
                  }}
                  comboboxProps={{ shadow: 'md' }}
                />
              </Table.Td>

              <Table.Td scope="row" component="th" align='right'>
                <strong>{selectedProduct?.interest}</strong>
              </Table.Td>

              <Table.Td scope="row" component="th" align='right'>
                <strong>{selectedProduct?.penal_interest}</strong>
              </Table.Td>

              {/* option to edit requested amount of the loan in submit and review queue */}
              {type === 'enhancement' || type === 're-onboarding' ? (
                <Table.Td align="right">
                  {
                    !['approved', 'rejected']?.includes(status) ? (
                      <UserCan
                        role={currentUser.role_name}
                        perform={rulesList.loan_approval}
                        yes={() => (
                          <TextInput
                            money
                            number
                            fullWidth={false}
                            defaultValue={newInfo?.new_loan_amount}
                            onChange={e => {
                              updateNewLoanInfo({
                                loan_amount: e.target.value
                              })
                            }}
                          />
                        )}
                        no={() => <Currency value={newInfo?.new_loan_amount} />}
                      />
                    )
                      : <Currency value={newInfo?.new_loan_amount} />
                  }
                </Table.Td>
              ) : (type === 'renewal' ? (
                <Table.Td align="right">
                  <Currency value={newInfo?.new_loan_amount} />
                </Table.Td>
              ) : (
                <Table.Td align="right">
                  {
                    ['submitted', 'loan_review']?.includes(status) ? (
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
                </Table.Td>
              ))}

              {status === 'loan_approval' ? (
                <Table.Td align="right">
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
                </Table.Td>
              ) : viewable && 
                <Table.Td align="right">
                  <Currency value={row?.amount_approved} />
                </Table.Td>
              }

              {['disbursement_approval', 'disbursed']?.includes(status) ? (
                <Table.Td align='right'>
                  <Currency value={row?.amount_disbursed} />
                </Table.Td>
              ): null}
            </Table.Tr>
          </Table.Tbody>
        </Table>

        {/* <Table size="small">
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
                  disabled={selectedProduct?.disabled || !isAllowed(currentUser?.permissions, resources_id.dashboard, 'edit_loantype')}
                  onChange={e => {
                    const d = products.find(i => i.product_id == e.target.value)
                    setSelectedProduct(d)
                    updateNewLoanInfo(!['approved', 'rejected'].includes(status) ? {
                      product_id: e.target.value
                    } : {
                      ...newInfo,
                      product_id: e.target.value
                    })
                  }}
                  style={{
                    color: '#333'
                  }}
                >
                  {/* <option value="">Choose Loan type</option> *
                  {
                    products.map(item => <option key={item.product_id} value={item.product_id}>{item.product_name}</option>)
                  }
                </MSelect>
              </TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.interest}</strong></TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.penal_interest}</strong></TableCell>
              {/* option to edit requested amount of the loan in submit and review queue *
              {
                type === 'enhancement' || type === 're-onboarding' ? (
                  <TableCell align="right">
                    {
                      !['approved', 'rejected']?.includes(status) ? (
                        <UserCan
                          role={currentUser.role_name}
                          perform={rulesList.loan_approval}
                          yes={() => (
                            <TextInput
                              money
                              number
                              fullWidth={false}
                              defaultValue={newInfo?.new_loan_amount}
                              onChange={e => {
                                updateNewLoanInfo({
                                  loan_amount: e.target.value
                                })
                              }}
                            />
                          )}
                          no={() => <Currency value={newInfo?.new_loan_amount} />}
                        />
                      )
                        : <Currency value={newInfo?.new_loan_amount} />
                    }
                  </TableCell>
                ) : (type === 'renewal' ? (
                  <TableCell align="right">
                    <Currency value={newInfo?.new_loan_amount} />
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    {
                      ['submitted', 'loan_review']?.includes(status) ? (
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
                ))
              }
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
        </Table> */}
      </Box>
    </>
  )
}

export default LoanInfo;