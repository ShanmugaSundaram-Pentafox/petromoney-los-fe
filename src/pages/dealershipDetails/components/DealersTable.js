import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMount } from 'react-use';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import { getDealersByDealershipId, getCoApplicantByDealershipId } from '../../../services/dealers.service';
import CreditInfoSideWrapper from "./CreditInfoSideWrapper";
import DealerEditSideWrapper from './DealerEditSideWrapper';
import AddIconButon from './AddIcon';

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: 8,
    },
    title: {
        paddingLeft: 8,
        marginBottom: 8
    },
    table: {
        // minWidth: 650,
        padding: 8
    },
    header: {
        display: 'flex',
        marginBottom: 8
    },
    footer: {
        paddingTop: 8,
        textAlign: 'right'
    },
    sidePanelWrapper: {
        width: '40vw',
        minWidth: 300
    },
    actionButtons: {
        // paddingTop: 8
    },
    tableRow: {
        cursor: 'pointer'
    },
    document: {
        display: 'inline-block',
        borderRadius: 2,
        lineHeight: 1,
    }
}));

const DealersTable = ({ id,data, titleAlign, showCreditForm, onClickAddMenu, formType, openCloseCreditForm, rowData, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
    const classes = useStyles();

    if (!data || !data.length)
        return (
            <div className={classes.wrapper}>
                <Typography variant="h5" align={titleAlign} className={classes.title}>No Dealers Found</Typography>
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Button color="primary" variant="contained" size="small" onClick={() => onClickAddMenu('DEALER')}>Add dealer</Button>
                </div>
            </div>
        );

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <Typography style={{ width: '90%', textAlign: 'center' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
            </div>
            <Table className={classes.table} size="small" aria-label="Dealers">
                <TableHead>
                    <TableRow>
                        <TableCell>Dealer Name</TableCell>
                        <TableCell align="center">Mobile</TableCell>
                        <TableCell align="center">Documents</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow className={classes.tableRow} key={row.id} onClick={e => dealersClickRow(e, row, 'DEALER')}>
                            <TableCell>{row.first_name}</TableCell>
                            <TableCell align="center">{row.mobile}</TableCell>
                            <TableCell align="center">
                                {row.aadhar_f_file_url && <TableCell style={{ border: 0 }} align="center">
                                    <a className={classes.document}
                                        href={row.aadhar_f_file_url} target="_blank" title={'Aadhar Front'}>{'Aadhar Front'}</a>

                                </TableCell>}
                                {row.aadhar_b_file_url && <TableCell style={{ border: 0 }} align="center">
                                    <a className={classes.document}
                                        href={row.aadhar_b_file_url} target="_blank" title={'Aadhar Back'}>{'Aadhar Back'}</a>

                                </TableCell>}
                                {row.pan_file_url && <TableCell style={{ border: 0 }} align="center">
                                    <a className={classes.document}
                                        href={row.pan_file_url} target="_blank" title={'PAN'}>{'PAN'}</a>
                                </TableCell>}
                                {!row.pan_file_url && !row.aadhar_b_file_url && !row.aadhar_f_file_url &&
                                    <TableCell style={{ border: 0 }} align="center">
                                        -
                  </TableCell>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.footer}>
                <div className={classes.actionButtons}>
                    <Button color="primary" variant="contained" size="small" onClick={() => openCloseCreditForm()}>Add Credit Information</Button>
                </div>
                <Drawer
                    anchor="right"
                    open={showCreditForm}
                    variant="temporary"
                >
                    <div className={classes.sidePanelWrapper}>
                        <CreditInfoSideWrapper dealershipId={id} data={data} currentUser={currentUser} onClose={() => openCloseCreditForm()} />
                    </div>
                </Drawer>
            </div>
        </div>
    )
}

export default DealersTable;