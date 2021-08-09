import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0.5),
    color: theme.palette.grey[500],
  },
  downloadButton: {
    position: 'absolute',
    right: theme.spacing(7),
    top: theme.spacing(0.5),
    // color: theme.palette.blueGreyLight[300]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, onDownload, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5">{children}</Typography>
      {
        onDownload ? (
          <IconButton aria-label="close" className={classes.downloadButton}>
            <a href={onDownload} style={{ color: '#4682B4' }}><CloudDownloadOutlinedIcon /></a>
          </IconButton>
        ) : null
      }
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const FormDialog = (props) => {
  const {
    title,
    children,
    actions,
    open,
    onClose,
    onDownload,
  } = props;

  return (
    <Dialog onClose={onClose} aria-labelledby="form-dialog-title" open={open}>
      <DialogTitle id="form-dialog-title" onDownload={onDownload} onClose={onClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      {
        actions && (
          <DialogActions>
            {actions}
          </DialogActions>
        )
      }
    </Dialog>
  );
}

export default FormDialog;