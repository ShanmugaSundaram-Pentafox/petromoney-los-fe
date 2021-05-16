import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
// import { pdfjs, Document, Page } from 'react-pdf'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
// import throttle from 'lodash/throttle';
import styled from 'styled-components';
import { downloadPDF } from '../../../services/common.service';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Wrapper = styled.div`
  position: relative;
  display:flex;
  .react-pdf__Page__svg {
    box-shadow: 0 0 5px rgba(0,0,0,.2);
    border: 1px solid #d3d3d3;
    background: #fff;
    border-radius: 4px;
  }
`;

const FooterActions = styled.div`
  padding: 20px;
  position: absolute;
  z-index: 2;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const PdfViewer = ({ title, file, isBase64, height='100Vh', showDownload }) => {
  // const pdfWrapperRef = useRef()
  // const [width, setWidth] = useState(400);
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // const setPDFWidth = () => {
  //   const w = pdfWrapperRef.current.offsetWidth - 40;
  //   setWidth(w)
  // }

  // const throttledSetPDFWidth = throttle(setPDFWidth, 500)

  // useEffect(() => {
  //   setPDFWidth()
  //   window.addEventListener('resize', throttledSetPDFWidth);

  //   return () => {
  //     window.removeEventListener('resize', throttledSetPDFWidth)
  //   }
  // }, []);

  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // }

  return (
    <Wrapper>
      <Box p={2} bgcolor="#f8f8f8" height={height} style={{flex:1}} >
        <iframe src={isBase64 ? `data:application/pdf;base64,${file}` : file} width="100%" height="100%" frameBorder="0" ></iframe>
        {/* <Document
          renderMode="svg"
          file={isBase64 ? `data:application/pdf;base64,${file}` : file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={width} />
        </Document> */}
      </Box>
      {/* <FooterActions>
        <strong><small>Page {pageNumber} of {numPages}</small></strong>
        <Box display="flex">
          <ButtonGroup color="primary" aria-label="outlined primary button group" style={{ backgroundColor: '#fff' }}>
            <Button onClick={() => {
              if(pageNumber-1 > 0) {
                setPageNumber(pageNumber-1)
              }
            }}>
              <ChevronLeftRoundedIcon />
            </Button>
            <Button onClick={() => {
              if(pageNumber+1 <= numPages) {
                setPageNumber(pageNumber+1)
              }
            }}>
              <ChevronRightRoundedIcon />
            </Button>
          </ButtonGroup>
          {
            showDownload && (
              <IconButton color="primary" size="small" onClick={() => downloadPDF({ file, isBase64, name: title })}>
                <GetAppRoundedIcon />
              </IconButton>
            )
          }
        </Box>
      </FooterActions> */}
    </Wrapper>
  )
}

export default PdfViewer;