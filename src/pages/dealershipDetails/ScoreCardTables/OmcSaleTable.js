import { Box, makeStyles, Table, TableBody, TableCell as TableCellComp, TableContainer, TableFooter, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import { head } from 'lodash';
import React, { useState } from 'react'
import { ViewData } from '../../../components/CommonComponents/FilePreview'
import { getMonth as monthData } from '../../../utils/commonFunctions.util';

const useStyles = makeStyles(() => ({
    filterWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        border: '1px solid hsl(0, 0%, 90%)',
        backgroundColor: 'hsl(0, 0%, 100%)',
        minHeight: 32,
        boxSizing: 'border-box',
        padding: '0 4px',
      },
      filterItem: {
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 4,
        marginRight: 2,
        padding: '2px 4px',
        minWidth: 50,
        textAlign: 'center',
        border: 'none',
        backgroundColor: 'hsl(0, 0%, 100%)',
        transition: 'all .2s ease-in-out',
        '&:hover': {
          backgroundColor: 'hsl(0, 0%, 95%)',
        },
        '&.active': {
          backgroundColor: '#3f51b5',
          color: '#fff',
        },
        '&.disabled': {
          backgroundColor: 'hsl(0, 0%, 80%)',
          padding: '4px 8px',
          marginTop: 6,
          borderRadius: 8,
        },
        '&:last-child': {
          marginRight: 0,
          '&::after': {
            display: 'none',
          }
        }
    },
    subtitle: {
        color: 'rgba(0,0,0,0.4)',
        marginTop: 8
    }
}))

const TableCell = withStyles(() => ({
    root: {
      border: '1px solid #eeeeee',
    },
}))(TableCellComp)

const OmcSaleTable = ({data, header}) => {
    const classes = useStyles()
    const [tableView, setTableView] = useState({value: 'previous_fy', label: 'Previous FY'})
    const header_data = head(header?.scorecard_master_data)

    const onViewUpdate = type => (event) => {
        switch (type) {
        case 'previous_fy':
            setTableView({value: 'previous_fy', label: 'Previous FY'})
          break;
        case 'latest_completed_fy':
            setTableView({value: 'latest_completed_fy', label: 'Latest Completed FY'})
          break;
        case 'broken_period':
            setTableView({value: 'broken_period', label: 'Broken Period'})
          break;
        default:
          break;
        }
    }

  return (
    <div className={classes.root}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ViewData title="OMC Name" value={header_data?.omc_name} />
            <Box>
              <label style={{ color: 'hsl(0,0%,75%)' }}>Table View</label>
              <div className={classes.filterWrapper}>
                <div role="button" className={`${classes.filterItem} ${tableView?.value === 'previous_fy' && 'active'}`} onClick={onViewUpdate('previous_fy')} onKeyDown>Previous FY</div>
                <div role="button" className={`${classes.filterItem} ${tableView?.value === 'latest_completed_fy' && 'active'}`} onClick={onViewUpdate('latest_completed_fy')} onKeyDown>Latest FY</div>
                <div role="button" className={`${classes.filterItem} ${tableView?.value === 'broken_period' && 'active'}`} onClick={onViewUpdate('broken_period')} onKeyDown>Broken Period</div>
              </div>
            </Box>
        </div>
        <Typography variant="h6">OMC Sale Data</Typography>
        {
            data?.omc_sales_monthwise?.length ?
            <Table style={{marginTop: 8}}>
                <TableHead>
                    <TableRow>
                        <TableCell align='center' colSpan={6}>{tableView?.label}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sr.No</TableCell>
                        <TableCell>Month</TableCell>
                        <TableCell>MS(KL)</TableCell>
                        <TableCell>HSD(KL)</TableCell>
                        <TableCell>CNG/Auto LPG (Litres)</TableCell>
                        <TableCell>Total (KL)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.omc_sales_monthwise?.filter((item, i) => {return item?.type === tableView?.value})?.sort((a,b) => (a.month > b.month)?1:((b.month > a.month)? -1:0))?.sort((a,b) => (a.year > b.year)?1:((b.year > a.year)? -1:0))?.map((item,i) => {
                            return(
                                <TableRow key={i}>
                                    <TableCell>{i+1}</TableCell>
                                    <TableCell>{monthData.find(month => {return month.value == item.month})?.label} - {item.year}</TableCell>
                                    <TableCell>{item?.ms}</TableCell>
                                    <TableCell>{item?.hsd}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{item?.total}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
                <TableFooter style={{backgroundColor: '#f4f4f4'}}>
                    <TableRow>
                        <TableCell><strong>Total (KL)</strong></TableCell>
                        <TableCell />
                        {
                            data?.omc_sales_monthwise_total?.filter((item, i) => {return item?.type === tableView?.value})?.map((item, i) => {
                                return(
                                    <>
                                        <TableCell>{item?.ms}</TableCell>
                                        <TableCell>{item?.hsd}</TableCell>
                                        <TableCell>{item?.lpg}</TableCell>
                                        <TableCell>{item?.total}</TableCell>
                                    </>
                                )
                            })
                        }
                    </TableRow>
                    <TableRow>
                        <TableCell><strong>Avg (KL)</strong></TableCell>
                        <TableCell/>
                        {
                            data?.omc_sales_monthwise_avg?.filter((item, i) => {return item?.type === tableView?.value})?.map((item, i) => {
                                return(
                                    <>
                                        <TableCell>{item?.ms}</TableCell>
                                        <TableCell>{item?.hsd}</TableCell>
                                        <TableCell>{item?.lpg}</TableCell>
                                        <TableCell>{item?.total}</TableCell>
                                    </>
                                )
                            })
                        }
                    </TableRow>
                </TableFooter>
            </Table> 
            : <Typography className={classes.subtitle} variant='body2'>No OMC Sales data found!</Typography>
        } 

        <div style={{marginTop: 16}}>
            <Typography variant="h6">Annual Fuel Sale considered for Eligibility Calculation</Typography>
            {
                data?.omc_fuel_data_for_elig_calc_total?.length ?
                <TableContainer style={{display: 'flex', marginTop: 8}}>
                    <Table style={{borderRight: '1px solid rgba(0,0,0,0.3)'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2}>Sr.No</TableCell>
                                <TableCell rowSpan={2}>Fuel Credit Category</TableCell>
                                <TableCell colSpan={4} align="center">Total KL Considered</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>MS</TableCell>
                                <TableCell>HSD</TableCell>
                                <TableCell>CNG/Auto LPG</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.omc_fuel_data_for_elig_calc_total?.map((item, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{i+1}</TableCell>
                                            <TableCell>{item?.category}</TableCell>
                                            <TableCell>{item?.ms}</TableCell>
                                            <TableCell>{item?.hsd}</TableCell>
                                            <TableCell>{item?.lpg}</TableCell>
                                            <TableCell><strong>{item?.total}</strong></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} align="center">Average Monthly KL Considered</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>MS</TableCell>
                                <TableCell>HSD</TableCell>
                                <TableCell>CNG/Auto LPG</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.omc_fuel_data_for_elig_calc_avg?.map((item, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{item?.ms}</TableCell>
                                            <TableCell>{item?.hsd}</TableCell>
                                            <TableCell>{item?.lpg}</TableCell>
                                            <TableCell><strong>{item?.total}</strong></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer> 
                : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
            }
        </div>
        <div style={{marginTop: 16}}>
            <Typography variant="h6">Annual Fuel Sale considered in limit setting for standard category</Typography>
            {
                data?.omc_fuel_data_for_limit_setting_total?.length ?
                <TableContainer style={{display: 'flex', marginTop: 8}}>
                    <Table style={{borderRight: '1px solid rgba(0,0,0,0.3)'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2}>Sr.No</TableCell>
                                <TableCell rowSpan={2}>Fuel Credit Category</TableCell>
                                <TableCell colSpan={4} align="center">Total KL Considered</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>MS</TableCell>
                                <TableCell>HSD</TableCell>
                                <TableCell>CNG/Auto LPG</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.omc_fuel_data_for_limit_setting_total?.map((item, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{i+1}</TableCell>
                                            <TableCell>{item?.category}</TableCell>
                                            <TableCell>{item?.ms}</TableCell>
                                            <TableCell>{item?.hsd}</TableCell>
                                            <TableCell>{item?.lpg}</TableCell>
                                            <TableCell><strong>{item?.total}</strong></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} align="center">Average Monthly KL Considered</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>MS</TableCell>
                                <TableCell>HSD</TableCell>
                                <TableCell>CNG/Auto LPG</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.omc_fuel_data_for_limit_setting_avg?.map((item, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{item?.ms}</TableCell>
                                            <TableCell>{item?.hsd}</TableCell>
                                            <TableCell>{item?.lpg}</TableCell>
                                            <TableCell><strong>{item?.total}</strong></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer> 
                : <Typography className={classes.subtitle} variant='body2'>No data found!</Typography>
            }
        </div>
    </div>
  )
}

export default OmcSaleTable