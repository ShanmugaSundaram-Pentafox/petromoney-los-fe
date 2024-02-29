import {
  Drawer,
  IconButton,
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import { format, parse } from 'date-fns';
import React, { useState } from 'react';
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
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { Button } from '@mantine/core';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

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
  const columnHelper = createColumnHelper();

  const actionable = !permissionCheck(
    currentUser.role_name,
    rulesList.external_view
  );

  const getAllNOCRequestQuery = useQuery({
    queryKey: ['noc-request', refresh],
    queryFn: () => getAllNocRequest(),
    select: (data) => {
      let d = data.map((item) => {
        const parsedDate = parse(item?.issued_date || undefined, 'dd-MM-yyyy', new Date());
        return {
          ...item,
          formated_date: format(parsedDate, 'MMM, yyyy'),
        }
      });
      return d;
    }
  });

  const onRowClick = (rowData) => {
    if (rowData?.status == 'approved' || rowData?.status == 'rejected') {
      displayNotification({
        message: `NOC is already ${rowData?.status}`,
        variant: 'warning'
      })
    }
    else {
      setOpenApproveModal(true);
      setRowData(rowData);
    }
  };

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('applicant_code', {
      header: 'Applicant Code',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('noc_type', {
      header: 'Type'
    }),
    columnHelper.accessor('disbursed_amount', {
      header: 'Disbursed Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('product_name', {
      header: 'Scheme'
    }),
    columnHelper.accessor('formated_date', {
      header: 'Issued Month'
    }),
    columnHelper.accessor('remarks', {
      header: 'Remarks',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (value) => {
        if (value?.getValue() == 'rejected') {
          return (
            <div>
              <CustomToken label={value?.getValue()} variant="error" icon="cross" />
            </div>
          );
        } else if (value?.getValue() == 'approved') {
          return (
            <div>
              <CustomToken label={value?.getValue()} variant="success" icon="tick" />
            </div>
          );
        } else return <CustomToken label={value?.getValue()} variant="warn" />;
      },
    }),
    columnHelper.accessor('noc_letter_url', {
      header: 'Documents',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div style={{ minWidth: 70 }}>
            {row?.original?.noc_letter_url ? (
              <Tooltip title="Download noc letter">
                <IconButton
                  size="small"
                  color="primary"
                  aria-label="application"
                  onClick={() =>
                    setOpenViewer({
                      ...openViewer,
                      open: true,
                      image: row?.original?.noc_letter_url,
                      type: row?.original?.noc_letter_url?.endsWith('.pdf')
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
    })
  ];

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => false,
  //   customToolbar: () => {
  //     return (
  //       // noc request raise permissions
  //       isAllowed(currentUser?.permissions, resources_id?.nocLetter, action_id?.nocLetter?.raiseRequest) ?
  //         <Button
  //           color="primary"
  //           variant="contained"
  //           onClick={() => setOpenModal(true)}
  //         >
  //           Raise Request
  //         </Button> : null
  //     );
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if (cellMeta.colIndex !== 6) {
  //       isAllowed(currentUser?.permissions, resources_id.nocLetter, action_id.nocLetter?.nocPreview) &&
  //         onRowClick(list[cellMeta.dataIndex], list[cellMeta.dataIndex]);
  //     }
  //   },
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={getAllNOCRequestQuery?.data}
        column={column}
        loading={getAllNOCRequestQuery?.isLoading}
        styles={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100vw" }}
        action={
          isAllowed(currentUser?.permissions, resources_id?.nocLetter, action_id?.nocLetter?.raiseRequest)
            ? <Button
              size='xs'
              onClick={() => setOpenModal(true)}
            >
              Raise Request
            </Button>
            : null
        }
        title={'NOC Application'}
      />
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
