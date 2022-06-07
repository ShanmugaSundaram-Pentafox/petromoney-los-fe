import { DialogContent, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import PdfViewer from '../../CommonComponents/PdfViewer/PdfViewer';

const useStyles = makeStyles(() => ({
  content: {
    overflowY: 'auto',
  },
}));

const SignedLayout = ({ loansData }) => {
  const classes = useStyles();
  return (
    <DialogContent dividers className={classes.content}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          {loansData?.document_url ? (
            <PdfViewer file={loansData?.document_url} />
          ) : null}
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default SignedLayout;
