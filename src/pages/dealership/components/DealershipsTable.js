import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAllDealership } from '../../../services/dealerships.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { useDebouncedState } from '@mantine/hooks';
import { getSignedUrl } from '../../../services/common.service';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { decrypt } from '../../../services/crypto.service';

const DealershipsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState('', 500);
  const [apiFilter, setApiFilter] = useState({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const apiFilterHeader = [
    { key: 'region_id', label: 'region', value: 'id', filterLabel: 'Region', apiUrl: 'regions/los', data: null, type: 'select' }
  ];
  const { data: dealershipsData = [], isFetching, refetch } = useQuery(['dealership-details', search, page, apiFilter], () => getAllDealership({ search, page, apiFilter }), {
    select: (res) => {
      const result = res?.data?.map((item, i) => {
        let pan = item?.pan;
        let gst = item?.gst;
        if (pan) {
          pan = decrypt(pan)
        }
        if (gst) {
          gst = decrypt(gst)
        }
        return {
          ...item,
          pan,
          gst,
        }
      })
      return {...res, data: result}
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    page != 1 && setPage(1)
  }, [search, apiFilter])

  const downloadReport = () => {
    setDownloadLoading(true)
    getAllDealership({ search, download: true })
      .then((res) => {
        getSignedUrl(res?.data?.[0]?.url)
          .then((res) => {
            window.open(res?.url, '_blank');
          })
          .catch(e => {
            displayNotification({
              message: e?.message || e,
              variant: 'error',
            })
          })
          .finally(() => {
            setDownloadLoading(false);
          })
      })
  }

  const history = useHistory();

  const handleRowClick = (rowData) => {
    const id = rowData?.id;
    if (id) {
      history.push(`/dealership/${id}`);
    }
  };

  const column = [
    {
      key: 'id',
      header: 'ID',
      enableColumnFilter: false,
      sorting: true,
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      sorting: true,
      // }, {
      //   key: 'sales_area',
      //   header: 'Sales Area',
      //   isHeaderDisplay: false,
    }, {
      key: 'loan_application_submitted_date',
      header: 'Submitted Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? format(new Date(value?.getValue()), 'dd-MMM-yyyy') : '-'}</span>,
      sorting: true,
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'pincode',
      header: 'Pincode',
    }, {
      key: 'gst',
      header: 'GST',
      enableColumnFilter: false,
    }, {
      key: 'pan',
      header: 'PAN',
      enableColumnFilter: false,
    },
  ]

  return (
    <div>
      <DataTableViewer
        allowSorting={true}
        rowData={dealershipsData?.data}
        column={column}
        title={'Dealership List'}
        loading={isFetching}
        excelDownload={true}
        onRowClick={handleRowClick}
        useAPIPagination
        totalNoOfRecords={dealershipsData?.total_records}
        count={dealershipsData?.total_records}
        page={page}
        setPage={setPage}
        apiFilter={apiFilter}
        setApiFilter={setApiFilter}
        apiFilterHeader={apiFilterHeader}
        totalNoOfPages={dealershipsData?.total_pages}
        apiSearch={setSearch}
        downloadQuery={{ query: downloadReport, isLoading: downloadLoading }}
      />
    </div>
  )
}


export default DealershipsTable;