import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { saveDealerCreditInfo } from '../../../services/creditreport.service';
import GridTextField from './GridTextField';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(3)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const fields = [
  { key: "highest_dpd", label: "No of times of highest DPD" },
  { key: "highest_dpd_bracket", label: "Highest DPD bracket"},
  { key: "closed_loans_count", label: "No of Closed loans"},
  { key: "cibil_vintage", label: "Vintage with CIBIL bureau"},
  { key: "business_vintage", label: "Business Vintage"},
  { key: "cibil_score", label: "CIBIL Score"},
  { key: "internal_score", label: "Internal Score"}
];

const RowContent = ({ data, onChange }) => (
  <form noValidate autoComplete="off">
    <Grid container spacing={2}>
      {
        fields.map(row => (
          <GridTextField
            key={row.key}
            field={row.key}
            label={row.label}
            value={data[row.key]}
            onChange={onChange}
            />
        ))
      }
    </Grid>
  </form>
)

const RowData = ({ name, data, onEdit }) => {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Button onClick={onEdit} size="small" color="primary" variant="outlined">Edit</Button>
      </TableCell>
      <TableCell>{data.closed_loans_count || ''}</TableCell>
      <TableCell>{data.cibil_score || ''}</TableCell>
      <TableCell>{data.internal_score || ''}</TableCell>
    </TableRow>
  )
}

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const CreditInfoCard = ({
  dealership_id,
  applicants,
  creditInfoData,
  updateCreditData,
}) => {
  const classes = useStyles();
  const [modalStatus, setModalStatus] = useState({ open: false });

  const onSubmit = id => {
    const [dealer_id, coapplicant_id] = id.split("_");
    saveDealerCreditInfo(dealership_id, {
      dealer_id,
      coapplicant_id,
      ...creditInfoData[id]
    })
    .then(() => {
      handleModalClose();
    })
    .catch(e => null)
  }

  const handleModalClose = () => {
    setModalStatus({ open: false });
  }
  
  const handleModalOpen = data => {
    setModalStatus({ open: true, data });
  }

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Applicants</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>No of Closed loans</TableCell>
              <TableCell>CIBIL Score</TableCell>
              <TableCell>Internal Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((item, i) => (
              <RowData
                key={i}
                id={item.id}
                name={item.name}
                data={creditInfoData[item.id] || {}}
                onEdit={() => {
                  handleModalOpen({
                    ...(creditInfoData[item.id] || {}),
                    id: item.id,
                    name: item.name
                  })
                }}
              />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {
        modalStatus.data ? (
          <Dialog onClose={handleModalClose} aria-labelledby="credit-info-dialog" open={modalStatus.open}>
            <DialogTitle id="credit-info-dialog" onClose={handleModalClose}>
              Fill Dealer Info: {modalStatus.data.name}
            </DialogTitle>
            <DialogContent dividers>
              <RowContent
                data={modalStatus.data}
                onChange={updateCreditData(modalStatus.data.id)}
              />
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => onSubmit(modalStatus.data.id)} color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        ) : null
      }

    </Paper>
  )
}

export default CreditInfoCard;