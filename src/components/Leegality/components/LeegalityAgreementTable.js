import { format } from 'date-fns';
import React from 'react';
import { useQuery } from 'react-query';
import {
  getOmcList,
  getProductsMaster,
} from '../../../services/common.service';
import { numInWords } from '../../../utils/commonFunctions.util';
import { ViewData } from '../../CommonComponents/FilePreview';
import Currency from '../../Number/Currency';
import { Box, Grid, Group, Table } from '@mantine/core';

const LeegalityAgreementTable = ({ loanAmount, dealership, dealers, applicants, guarantor, productId, type, dateValue }) => {
  const { data: product = {} } = useQuery(['products', productId], () => getProductsMaster(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.find(item => item.product_id === productId);
      },
      enabled: Boolean(productId)
    })

  const { data: omcs = [] } = useQuery('omcs', () => getOmcList(), { refetchOnWindowFocus: false })
  return (
    <Box style={{ width: '60%' }}>
      <Grid ml={4}>
        <Grid.Col span={12}>
          <Box>
            <Group justify='space-between'>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <ViewData
                  title="Date of Agreement"
                  value={format(dateValue, 'dd-MM-yyyy')}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <ViewData
                  title="Place of execution of Agreement"
                  value="Chennai"
                />
              </div>
            </Group>
            <Table striped mt={'sm'} style={{ fontSize: 12 }}>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Dealership ID</Table.Td>
                  <Table.Td>{dealership?.id}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Dealership Name</Table.Td>
                  <Table.Td>{dealership?.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Dealership Agreement Date</Table.Td>
                  <Table.Td>{dealership?.agreement_executed_on || '-NA-'}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Dealership Address</Table.Td>
                  <Table.Td>{dealership?.address || '-NA-'}</Table.Td>
                </Table.Tr>
                {type === 'loc' ? null : <>
                  <Table.Tr>
                    <Table.Td>OMC</Table.Td>
                    <Table.Td>
                      {
                        omcs.find((item) => {
                          return item.id == dealership?.omc;
                        })?.name || '-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Name of the Borrower</Table.Td>
                    <Table.Td>
                      {
                        dealers?.map((item) => {
                          return item?.first_name + ' ' + item?.last_name;
                        }).join(', ')
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Residence Address</Table.Td>
                    <Table.Td>
                      {
                        dealers?.map((item) => {
                          return item.address;
                        }).join(', ')
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Name Of Co-Borrower</Table.Td>
                    <Table.Td>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return (item?.first_name ? item?.first_name + ' ' + item?.last_name : '-');
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>E-Mail Address Of Co-Borrower</Table.Td>
                    <Table.Td>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return item.email;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Contact Number Of Co-Borrower</Table.Td>
                    <Table.Td>
                      {
                        applicants?.length ? applicants?.map((item) => {
                          return item.mobile;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Office/ Residential Address Of Co-Borrower
                    </Table.Td>
                    <Table.Td>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return item.address;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Name Of Guarantor</Table.Td>
                    <Table.Td>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return (item?.first_name + ' ' + item?.last_name);
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>E-Mail Address Of Guarantor</Table.Td>
                    <Table.Td>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return item.email;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Contact Number Of Guarantor</Table.Td>
                    <Table.Td>
                      {
                        guarantor.length ? guarantor?.map((item) => {
                          return item.mobile;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Office/ Residential Address Of Guarantor
                    </Table.Td>
                    <Table.Td>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return item.address;
                        }).join(', ') : '-NA-'
                      }
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Bank Name
                    </Table.Td>
                    <Table.Td>
                      {dealership?.bank_name}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Branch Name
                    </Table.Td>
                    <Table.Td>
                      {dealership?.bank_branch}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Bank A/C Number
                    </Table.Td>
                    <Table.Td>
                      {dealership?.account_no}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      IFS Code
                    </Table.Td>
                    <Table.Td>
                      {dealership?.ifsc}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      Bank A/C Type
                    </Table.Td>
                    <Table.Td>
                      {dealership?.account_type}
                    </Table.Td>
                  </Table.Tr>
                </>}
                <Table.Tr>
                  <Table.Td>Loan Amount</Table.Td>
                  <Table.Td>
                    <Currency value={loanAmount} />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Loan Amount (In Words)</Table.Td>
                  <Table.Td>{numInWords(loanAmount)}</Table.Td>
                </Table.Tr>
                {type === 'loc' ? (
                  <Table.Tr>
                    <Table.Td>Entity Name</Table.Td>
                    <Table.Td>{product?.entity_name}</Table.Td>
                  </Table.Tr>
                ) : <>
                  <Table.Tr>
                    <Table.Td>DPN Date</Table.Td>
                    <Table.Td>{format(dateValue, 'dd-MM-yyyy') || '-NA-'}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>DPN Loan Amount</Table.Td>
                    <Table.Td>
                      <Currency value={loanAmount} />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Loan Cycle</Table.Td>
                    <Table.Td>{product?.tenure} days</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Interest Rate</Table.Td>
                    <Table.Td>{product?.interest} %</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Overdue Interest Rate</Table.Td>
                    <Table.Td>{product?.penal_interest} %</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Facility of Tenor</Table.Td>
                    <Table.Td>12 Months</Table.Td>
                  </Table.Tr>
                </>}
              </Table.Tbody>
            </Table>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default LeegalityAgreementTable;
