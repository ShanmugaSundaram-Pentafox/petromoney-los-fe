import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell as TableCellComp,
  TableContainer,
  TableRow,
  withStyles,
} from '@material-ui/core';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  getOmcList,
  getProductsMaster,
} from '../../../services/common.service';
import { numInWords } from '../../../utils/commonFunctions.util';
import { ViewData } from '../../CommonComponents/FilePreview';
import Currency from '../../Number/Currency';

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp);

const LeegalityAgreementTable = ({ loanAmount, dealership, dealers, applicants, guarantor, productId }) => {
  const [product, setProduct] = useState()
  const { data: products = [] } = useQuery(['products', productId], () => getProductsMaster(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setProduct(data.find(item => item.product_id === productId))
      }
    })
  const { data: omcs = [] } = useQuery('omcs', () => getOmcList(), { refetchOnWindowFocus: false })
  return (
    <Grid item md={8}>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Box>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <ViewData
                title="Date of Agreement"
                value={format(new Date(), 'dd-MM-yyyy')}
              />
              <ViewData
                title="Place of execution of Agreement"
                value="Chennai"
              />
            </div>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Dealership ID</TableCell>
                    <TableCell>{dealership?.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dealership Name</TableCell>
                    <TableCell>{dealership?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dealership Agreement Date</TableCell>
                    <TableCell>{dealership?.agreement_executed_on || '-NA-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dealership Address</TableCell>
                    <TableCell>{dealership?.address || '-NA-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>OMC</TableCell>
                    <TableCell>
                      {
                        omcs.find((item) => {
                          return item.id == dealership?.omc;
                        })?.name || '-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name of the Borrower</TableCell>
                    <TableCell>
                      {
                        dealers?.map((item) => {
                          return item?.first_name + ' ' + item?.last_name;
                        }).join(', ')
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Residence Address</TableCell>
                    <TableCell>
                      {
                        dealers?.map((item) => {
                          return item.address;
                        }).join(', ')
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name Of Co-Borrower</TableCell>
                    <TableCell>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return (item?.first_name ? item?.first_name + ' ' + item?.last_name : '-');
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-Mail Address Of Co-Borrower</TableCell>
                    <TableCell>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return item.email;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contact Number Of Co-Borrower</TableCell>
                    <TableCell>
                      {
                        applicants?.length ? applicants?.map((item) => {
                          return item.mobile;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Office/ Residential Address Of Co-Borrower
                    </TableCell>
                    <TableCell>
                      {
                        applicants.length ? applicants?.map((item) => {
                          return item.address;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name Of Guarantor</TableCell>
                    <TableCell>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return (item?.first_name + ' ' + item?.last_name);
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-Mail Address Of Guarantor</TableCell>
                    <TableCell>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return item.email;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contact Number Of Guarantor</TableCell>
                    <TableCell>
                      {
                        guarantor.length ? guarantor?.map((item) => {
                          return item.mobile;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Office/ Residential Address Of Guarantor
                    </TableCell>
                    <TableCell>
                      {
                        guarantor?.length ? guarantor?.map((item) => {
                          return item.address;
                        }).join(', ') : '-NA-'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loan Amount</TableCell>
                    <TableCell>
                      <Currency value={loanAmount} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loan Amount (In Words)</TableCell>
                    <TableCell>{numInWords(loanAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DPN Date</TableCell>
                    <TableCell>{format(new Date(), 'dd-MM-yyyy') || '-NA-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DPN Loan Amount</TableCell>
                    <TableCell>
                      <Currency value={loanAmount} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loan Cycle</TableCell>
                    <TableCell>{product?.tenure} days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interest Rate</TableCell>
                    <TableCell>{product?.interest} %</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Overdue Interest Rate</TableCell>
                    <TableCell>{product?.penal_interest} %</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Facility of Tenor</TableCell>
                    <TableCell>12 Months</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeegalityAgreementTable;
