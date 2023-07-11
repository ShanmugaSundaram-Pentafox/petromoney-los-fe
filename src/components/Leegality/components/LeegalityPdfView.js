import { CircularProgress, Grid, Backdrop } from '@material-ui/core';
import React from 'react';
import FilePreview from '../../CommonComponents/FilePreview';

const LeegalityPdfView = ({ pdfUrl, loading }) => {

  return (
    <Grid item sm={8} md={7} style={{ position: 'relative' }}>
      {pdfUrl ? <FilePreview height="70vh" data={{ image: pdfUrl, type: pdfUrl?.endsWith('.pdf') }} /> : null}
      <Backdrop open={loading} style={{ zIndex: 2, position: 'absolute' }}>
        <CircularProgress size={25} style={{ color: 'white' }} />
      </Backdrop>
    </Grid>
  );
};

export default LeegalityPdfView;
