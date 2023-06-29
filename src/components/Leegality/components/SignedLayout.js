import { DialogContent, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import FilePreview from '../../CommonComponents/FilePreview';

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
            <FilePreview data={{ image: loansData?.document_url, type: loansData?.document_url?.endsWith('.pdf') }} />
          ) : null}
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default SignedLayout;
