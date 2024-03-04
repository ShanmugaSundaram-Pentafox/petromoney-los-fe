import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import React from 'react';
import { getSignedUrl } from '../../../services/common.service';
import { Box, Modal } from '@mantine/core';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
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

  const handleClick = () => {
    if (onDownload) {
      getSignedUrl(onDownload)
        .then(res => {
          window.open(res?.url)
        })
        .catch(err => console.log(' getSignedUrl err >>>', err))
    }
  }
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5">{children}</Typography>
      {
        onDownload ? (
          <IconButton aria-label="close" className={classes.downloadButton} onClick={handleClick}>
            <CloudDownloadOutlinedIcon />
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
    maxWidth,
  } = props;

  return (
    <Modal
      onClose={onClose}
      opened={open}
      maw={maxWidth}
      size={'auto'}
      title={title}
      onDownload={onDownload}
    >
      {children}
      {
        actions && (
          <Box>
            {actions}
          </Box>
        )
      }
    </Modal>
  );
}

export default FormDialog;