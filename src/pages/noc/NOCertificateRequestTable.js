import {
  Button,
  Drawer,
  IconButton,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import { format, parse } from 'date-fns';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import ApproveNocForm from './ApproveNocForm';
import RequestNocForm from './RequestNocForm';
import CustomToken from '../../components/CommonComponents/CustomToken';
import FilePreview from '../../components/CommonComponents/FilePreview';
import FormDialog from '../../components/CommonComponents/FormDialog/FormDialog';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../config/accessControl';
import { rulesList } from '../../config/userRules';
import { getAllNocRequest } from '../../services/noc.services';
import { isAllowed } from '../../utils/cerbos';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
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
  const { enqueueSnackbar } = useSnackbar();

  const actionable = !permissionCheck(
    currentUser.role_name,
    rulesList.external_view
  );
  useEffect(() => {
    setLoading(true);
    getAllNocRequest()
      .then((data) => {
        let d = data.map((item) => {
          const parsedDate = parse(item?.issued_date || undefined, 'dd-MM-yyyy', new Date());
          return {
            ...item,
            formated_date: format(parsedDate, 'MMM, yyyy'),
          }
        });
        setList(d);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [refresh]);

  const onRowClick = (rowData) => {
    if (rowData?.status == 'approved' || rowData?.status == 'rejected') {
      enqueueSnackbar(`NOC is already ${rowData?.status}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'warning',
      });
    }
    else {
      setOpenApproveModal(true);
      setRowData(rowData);
    }
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
          filter: false,
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
        label: 'Disbursed Amount',
        name: 'disbursed_amount',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <Currency value={value} />,
        },
      },
      {
        label: 'Product',
        name: 'product_name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <>{value}</>,
        },
      },
      {
        label: 'Issued Month',
        name: 'formated_date',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <>{value ? value : '-'}</>,
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
            if (value == 'rejected') {
              return (
                <div>
                  <CustomToken label={value} variant="error" icon="cross" />
                </div>
              );
            } else if (value == 'approved') {
              return (
                <div>
                  <CustomToken label={value} variant="success" icon="tick" />
                </div>
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
                          image: value,
                          type: value?.endsWith('.pdf')
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
        // noc request raise permissions
        isAllowed(currentUser?.permissions, resources_id?.nocLetter, action_id?.nocLetter?.raiseRequest) ?
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Raise Request
          </Button> : null
      );
    },
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 6) {
        isAllowed(currentUser?.permissions, resources_id.nocLetter, action_id.nocLetter?.nocPreview) &&
          onRowClick(list[cellMeta.dataIndex], list[cellMeta.dataIndex]);
      }
    },
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(list) ? (
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
        )
      }
      {
        loading && (
          <div style={{ textAlign: 'center' }}><CircularProgress /></div>
        )
      }
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
          currentUser={currentUser}
          callback={() => {
            setOpenApproveModal(false);
            setRefresh(!refresh);
          }}
          data={rowData}
        />
      </Drawer>
      <FormDialog className={classes.dialogBox} title={'NOC letter'} open={openViewer.open} onClose={() => setOpenViewer({ open: false })}>
        <FilePreview data={openViewer} />
      </FormDialog>
    </div>
  );
};

export default NOCertificateRequestTable;
