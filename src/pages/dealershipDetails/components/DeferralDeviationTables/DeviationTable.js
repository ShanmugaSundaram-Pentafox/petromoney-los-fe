import { useQuery } from 'react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import DataTableViewer from '../../../../components/ReactTable/DataTableViewer';
import { getDeferralDataList } from '../../../../services/deferralDeviation.service';

const DeviationTable = ({ dealershipId, status }) => {
  const columnHelper = createColumnHelper();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState({ label: 'Show 10', value: 10 });
  const [deferralId, setDeferralId] = useState();
  const [opened, { open, close }] = useDisclosure(false);


  useEffect(() => {
    page != 1 && setPage(1)
  }, [search])

  const { data: deferralData = [], isLoading, refetch } = useQuery({
    queryKey: ['get-deferral'],
    queryFn: () => getDeferralDataList(dealershipId, 'deviation', status),
    refetchOnWindowFocus: false
  });



  const onClickAction = (value) => {
    return (
      <span
        style={{ color: '#0063FF', cursor: 'pointer' }}
      >
        {value.getValue()}
      </span>
    );
  };



  const column = [
    {
      key: 'party_id',
      header: 'Customer ID',
      enableColumnFilter: false,
    }, {
      key: 'party_name',
      header: 'Customer Name',
      enableColumnFilter: false,
    }, {
      key: 'applicant_type',
      header: 'Applicant Type',
    }, {
      key: 'applicant_name',
      header: 'Applicant Name',
      enableColumnFilter: false,
    }, {
      key: 'checklist_name',
      header: 'Document type',
    }, {
      key: 'due_date',
      header: 'Due Date',
      enableColumnFilter: false,
    }, {
      key: 'maker_name',
      header: 'Maker',
      isHeaderDownload: false,
      enableColumnFilter: false,
    },
  ]
  return (
    <>
      <DataTableViewer
        column={column}
        rowData={deferralData}
        title={'Deviations'}
        count={deferralData?.length}
        onRowClick={(e) => { }}
        loading={isLoading}
        excelDownload
        filter={false}
      />

    </>
  );
};

export default DeviationTable;