import {
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
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { Button } from '@mantine/core';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import { RightSideDrawer } from '../../components/Mantine/RightSideDrawer/RightSideDrawer';

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
  const [rowData, setRowData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState();
  const [openApproveModal, setOpenApproveModal] = useState();
  const [openViewer, setOpenViewer] = useState({ open: false });

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
          formated_date: format(parsedDate, 'dd MMM, yyyy'),
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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
    }, {
      key: 'applicant_code',
      header: 'Applicant Code',
      enableColumnFilter: false,
    }, {
      key: 'noc_type',
      header: 'Type'
    }, {
      key: 'approved_amount',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'disbursed_amount',
      header: 'Disbursed Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'product_name',
      header: 'Scheme'
    }, {
      key: 'formated_date',
      header: 'Issued Month'
    }, {
      key: 'remarks',
      header: 'Remarks',
      enableColumnFilter: false,
    }, {
      key: 'status',
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
    }, {
      key: 'noc_letter_url',
      header: 'Documents',
      enableColumnFilter: false,
      isHeaderDownload: false,
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
    },
  ];

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={getAllNOCRequestQuery?.data}
        column={column}
        loading={getAllNOCRequestQuery?.isLoading}
        styles={{ overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100vw' }}
        onRowClick={(i) => { isAllowed(currentUser?.permissions, resources_id.nocLetter, action_id.nocLetter?.nocPreview) && onRowClick(i) }}
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
        excelDownload
      />
      <RightSideDrawer
        opened={openModal}
        onClose={() => {
          setOpenModal(false);
          setRowData({});
        }}
        size='md'
        title={'NOC Request Form'}
      >
        <RequestNocForm
          callback={() => {
            setOpenModal(false);
            setRefresh(!refresh);
          }}
          data={rowData}
        />
      </RightSideDrawer>
      <RightSideDrawer
        opened={openApproveModal}
        onClose={() => {
          setOpenApproveModal(false);
          setRowData({});
        }}
        title={'Approve NOC Form'}
      >
        <ApproveNocForm
          currentUser={currentUser}
          callback={() => {
            setOpenApproveModal(false);
            setRefresh(!refresh);
          }}
          data={rowData}
        />
      </RightSideDrawer>
      <FormDialog className={classes.dialogBox} title={'NOC letter'} open={openViewer.open} onClose={() => setOpenViewer({ open: false })}>
        <FilePreview data={openViewer} />
      </FormDialog>
    </div>
  );
};

export default NOCertificateRequestTable;
