import {
  Button,
  Dialog,
  DialogContent,
  Drawer,
  IconButton,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import ApproveNocForm from './ApproveNocForm';
import RequestNocForm from './RequestNocForm';
import CustomToken from '../../components/CommonComponents/CustomToken';
import PdfViewer from '../../components/CommonComponents/PdfViewer/PdfViewer';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getAllNocRequest } from '../../services/noc.services';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8',
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  },
  anchorTag: {
    textDecoration: 'none',
    color: '#d35178',
  },
}));

const NOCertificateRequestTable = ({ currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState();
  const [openApproveModal, setOpenApproveModal] = useState();
  const [openViewer, setOpenViewer] = useState({ open: false });
  const [list, setList] = useState();

  const actionable = !permissionCheck(
    currentUser.role_name,
    rulesList.external_view
  );
  console.log('open Viewer >>>', openViewer);
  useEffect(() => {
    setLoading(true);
    getAllNocRequest()
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [refresh]);

  const onRowClick = (rowData) => {
    setOpenApproveModal(true);
    setRowData(rowData);
  };

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value}</>;
          },
        },
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>;
          },
        },
      },
      {
        label: 'Applicant code',
        name: 'applicant_code',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <span>{value}</span>,
        },
      },
      {
        label: 'Type',
        name: 'noc_type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <>{value}</>,
        },
      },
      {
        label: 'Remarks',
        name: 'remarks',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => <>{value ? value : '-'}</>,
        },
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          customBodyRender: (value, tableMeta) => {
            if (value === 'rejected') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div>
                    <CustomToken label={value} variant="error" icon="cross" />
                  </div>
                </Tooltip>
              );
            } else if (value === 'Approved') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div>
                    <CustomToken label={value} variant="success" icon="tick" />
                  </div>
                </Tooltip>
              );
            } else return <CustomToken label={value} variant="warn" />;
          },
          filter: false,
        },
      },
      {
        label: 'Documents',
        name: 'noc_letter_url',
        options: {
          filter: false,
          sort: false,
          display: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              <div style={{ minWidth: 70 }}>
                {value ? (
                  <Tooltip title="Download noc letter">
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label="application"
                      onClick={() =>
                        setOpenViewer({
                          ...openViewer,
                          open: true,
                          file: value,
                        })
                      }
                    >
                      <DescriptionIcon style={{ width: 19 }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </div>
            );
          },
        },
      },
    ];
  }, [list]);
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Raise Request
        </Button>
      );
    },
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 6) {
        currentUser.role_id == 1 &&
        onRowClick(list[cellMeta.dataIndex].dealership_id, list[cellMeta.dataIndex]);
      }
    },
  };

  return (
    <div className={classes.root}>
      {Array.isArray(list) && list.length !== 0 ? (
        <MUIDataTable
          title={
            <Typography className={classes.title} variant="h4" component="h4">
              {'NOC Applications'} ({list.length})
            </Typography>
          }
          data={list}
          columns={columns}
          options={options}
        />
      ) : (
        !loading && <Paper style={{ padding: 10 }}>No Request found</Paper>
      )}
      {loading && (
        <div style={{ textAlign: 'center' }}>
          {' '}
          <CircularProgress />
        </div>
      )}
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setRowData({});
        }}
        variant="temporary"
      >
        <RequestNocForm
          callback={() => {
            setOpenModal(false);
            setRefresh(!refresh);
          }}
          data={rowData}
        />
      </Drawer>
      <Drawer
        anchor="right"
        open={openApproveModal}
        onClose={() => {
          setOpenApproveModal(false);
          setRowData({});
        }}
        variant="temporary"
      >
        <ApproveNocForm
          callback={() => {
            setOpenApproveModal(false);
            setRefresh(!refresh);
          }}
          data={rowData}
        />
      </Drawer>
      <Dialog
        open={openViewer.open}
        onClose={() => {
          setOpenViewer({ ...openViewer, open: false });
        }}
        fullWidth
      >
        <DialogContent>
          <PdfViewer file={openViewer?.file} loading={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NOCertificateRequestTable;
