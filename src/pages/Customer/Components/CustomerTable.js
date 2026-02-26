import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { getAllCustomers } from '../../../services/customerOnboarding.service';

const CustomerTable = () => {
  const [page, setPage] = useState(1);

  const { data: dealershipsData, isFetching } = useQuery(
    ['main-applicants', page],
    () => getAllCustomers({ page }),
    {
      select: (res) => {
        const applicants = res?.data?.main_applicants || [];

        const formatted = applicants.map((item) => ({
          applicant_id: item?.applicant_id,
          loan_id: item?.loan_details?.loan_id || '-',
          full_name: item?.full_name || '-',
          aadhar: item?.aadhar || '-',
          pan: item?.pan || '-',
          amount_requested: item?.loan_details?.amount_requested || '-',
          loan_purpose: item?.loan_details?.loan_purpose || '-',
          address: item?.address || '-',
        }));

        return {
          data: formatted,
          total_records: res?.data?.total || 0,
          total_pages: Math.ceil((res?.data?.total || 0) / 10), // adjust if needed
        };
      },
      refetchOnWindowFocus: false,
    }
  );

  const history = useHistory();

  const handleRowClick = (rowData) => {
    const { applicant_id, loan_id } = rowData || {};

    if (!applicant_id) return;

    history.push({
      pathname: '/customers/onboard',
      state: {
        applicant_id,
        loan_id,
        isExisting: !!loan_id, // true if loan exists
      },
    });
  };

  const column = useMemo(
    () => [
      {
        key: 'applicant_id',
        header: 'Applicant ID',
        sorting: true,
      },
      {
        key: 'loan_id',
        header: 'Loan ID',
        sorting: true,
      },
      {
        key: 'full_name',
        header: 'Full Name',
        sorting: true,
      },
      {
        key: 'aadhar',
        header: 'Aadhar',
      },
      {
        key: 'pan',
        header: 'PAN',
      },
      {
        key: 'amount_requested',
        header: 'Amount Requested',
        cell: (value) => {
          const amount = value?.getValue();
          return amount !== '-'
            ? `₹${Number(amount).toLocaleString('en-IN')}`
            : '-';
        },
      },
      {
        key: 'loan_purpose',
        header: 'Loan Purpose',
      },
      {
        key: 'address',
        header: 'Address',
      },
    ],
    []
  );

  return (
    <div>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          leftIcon={<IconPlus size={18} />}
          onClick={() => history.push('/customers/onboard')}
          color="blue"
        >
          Onboard Customer
        </Button>
      </div>
      <DataTableViewer
        allowSorting={true}
        rowData={dealershipsData?.data || []}
        column={column}
        title={'Customer List'}
        loading={isFetching}
        excelDownload={false}
        onRowClick={handleRowClick}
        useAPIPagination
        totalNoOfRecords={dealershipsData?.total_records}
        page={page}
        filter={false}
        setPage={setPage}
        totalNoOfPages={dealershipsData?.total_pages}
        apiSearch={false}
      />
    </div>
  );
};

export default CustomerTable;
