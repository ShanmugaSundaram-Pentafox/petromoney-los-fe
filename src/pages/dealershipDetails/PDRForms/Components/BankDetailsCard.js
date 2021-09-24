import React from 'react';
import { ViewData } from '../../../../components/CommonComponents/FilePreview';
import Grid from '@material-ui/core/Grid';
import { deleteBankDetailsByID } from '../../../../services/PDReport.services';
import PreviewCard from '../../../../components/CommonComponents/Cards/PreviewCard';
import { useSnackbar } from 'notistack';


const BankDetailsCard = ({ id, data, editBankDetails }) => {
    const { enqueueSnackbar } = useSnackbar();


    const editBankRow = (rowData, rowIndex) => {
        editBankDetails(rowData, rowIndex)
    }
    const deleteBankRow = (row, index) => {
        deleteBankDetailsByID(row, id)
            .then(data => {
                console.log(data)
                enqueueSnackbar(data, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                }
                )
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    return (
        <Grid container spacing={2}>{
            data.map((item, i) => {
                return (
                    <Grid item md={6}>
                        <PreviewCard
                            onEdit={() => { editBankRow(item, i) }}
                            onDelete={() => deleteBankRow(item, i)}
                        >
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <ViewData title="Acc. Holder's name" value={item.account_name} />
                                    <ViewData title="Acc. type" value={item.account_type} />
                                    <ViewData title="Bank name" value={item.bank_name} />
                                    <ViewData title="IFSC code" value={item.ifsc} />
                                </Grid>
                                <Grid item md={6}>
                                    <ViewData title="Acc. number" value={item.account_no} />
                                    <ViewData title="Acc. since" value={item.account_since} />
                                    <ViewData title="Branch" value={item.bank_branch} />
                                    <ViewData title="Security" value={item.security} />
                                </Grid>
                            </Grid>
                        </PreviewCard>
                    </Grid>
                )
            })
        }
        </Grid>
    )

}

export default BankDetailsCard;