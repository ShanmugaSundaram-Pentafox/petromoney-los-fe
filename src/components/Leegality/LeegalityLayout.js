import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import styled from 'styled-components';
import moment from 'moment';
import ActivityBox from './components/ActivityBox';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PdfViewer from '../CommonComponents/PdfViewer/PdfViewer';
import apiCall from '../../utils/api.util';

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 5px 0 rgba(0,0,0,.4);

  .card-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 15px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;

const LeegalityLayout = ({ docId='JoijOnS' }) => {
  const [auditTrails, setAuditTrails] = useState([]);
  const [docDetails, setDocDetails] = useState({});

  useEffect(() => {

    apiCall(`document/details/${docId}`)
    .then(res => {
      if(res.status === "SUCCESS") {
        if(res.data?.status) {
          setDocDetails(res?.data?.data)
        }
      } else {
        console.log('>> Document Details status error >> ', res)
      }
    })
    .catch(err => {
      console.log(err)
    });

    apiCall(`document/trail/${docId}`)
    .then(res => {
      if(res.status === "SUCCESS") {
        if(res.data?.status) {
          setAuditTrails(res?.data?.data.auditTrails)
        }
      } else {
        console.log('>> Document Trail Status error >> ', res);
      }
    })
    .catch(err => {
      console.log(err)
    });
  }, [])

  return (
    <Box bgcolor="#fbfbfb">
      <Grid container spacing={2}>
        <Grid item sm={6}>
          {docDetails?.file && <PdfViewer title="Some Random File" file={docDetails.file} isBase64 showDownload />}
        </Grid>
        <Grid item sm={3}>
          <Box pt={2}>
            <TableContainer>

              <Table aria-label="leegality table">
                <TableBody>
                  <TableRow>
                    <TableCell>Document ID</TableCell>
                    <TableCell>{docDetails?.documentId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{docDetails?.documentName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last Active Date</TableCell>
                    <TableCell>{docDetails?.creationDate && moment(docDetails?.creationDate?.split(" ")[0], "DD-MM-YYYY").format('MMM DD, YYYY')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{docDetails?.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Internal Reference no</TableCell>
                    <TableCell>{docDetails?.irn}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2}>
              {
                docDetails?.invitations?.map((item, i) => (
                  <Card key={`inv-${i}`}>
                    <div className="card-body">
                      <Box pr={2}>
                        <Avatar>
                          <AccountCircleRoundedIcon />
                        </Avatar>
                      </Box>
                      <Box>
                        <p><strong>{item.name}</strong></p>
                        {item.email && <p><small>{item.email}</small></p>}
                        {item.phone && <p><small>{item.phone}</small></p>}
                        <div style={{ flex:1, justifyContent: 'space-between' }}>
                          <Chip style={{ marginRight: 10, border: 0 }} variant="outlined" size="small" label="Signed" icon={item.signed ? <CheckCircleOutlineRoundedIcon style={{ color: 'green' }} /> : <HighlightOffRoundedIcon style={{ color: 'red' }} />} />
                          {
                            !item.signed && (
                              <>
                                <Chip style={{ marginRight: 10, border: 0 }} variant="outlined" size="small" label="Active" icon={item.active ? <CheckCircleOutlineRoundedIcon style={{ color: 'green' }} /> : <HighlightOffRoundedIcon style={{ color: 'red' }} />} />
                                <Chip style={{ marginRight: 10, border: 0 }} variant="outlined" size="small" label="Expired" icon={item.expired ? <CheckCircleOutlineRoundedIcon style={{ color: 'green' }} /> : <HighlightOffRoundedIcon style={{ color: 'red' }} />} />
                              </>
                            )
                          }
                        </div>
                      </Box>
                    </div>
                    <div className="card-footer">
                      <Button variant="outlined" color="secondary" size="small">Details</Button>
                    </div>
                  </Card>
                ))
              }
            </Box>
          </Box>
        </Grid>
        <Grid item sm={3}>
          <Box>
            {
              auditTrails.map((item, i) => (
                <ActivityBox key={'act-'+i} {...item} />
              ))
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LeegalityLayout;