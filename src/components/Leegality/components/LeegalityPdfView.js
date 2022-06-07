import { CircularProgress, Grid, Backdrop } from '@material-ui/core';
import React from 'react';
import PdfViewer from '../../CommonComponents/PdfViewer/PdfViewer';

const LeegalityPdfView = ({ pdfUrl, loading }) => {

  return (
    <Grid item sm={8} md={7} style={{position: 'relative'}}>
      {pdfUrl ? <PdfViewer height="70vh" file={pdfUrl} /> : null}
      <Backdrop open={loading} style={{zIndex: '2', position: 'absolute'}}>
        <CircularProgress size={25} style={{color: 'white'}} />
      </Backdrop>
    </Grid>
  );
};

export default LeegalityPdfView;
