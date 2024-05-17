import { Grid, } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { getAllWithheldLoans } from '../../services/withheld.services';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const ResolvedTable = () => {
  const { data = [], isLoading } = useQuery('withheld-loans-resolved', () => getAllWithheldLoans(1), { refetchOnWindowFocus: false });
  console.log(data);
  const column = [
    {
      key: 'id',
      header: 'Dealership Id',
    }, {
      key: 'name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'resolved_by',
      header: 'Resolved By',
    }, {
      key: 'comments',
      header: 'Reason',
      cell: (value) => {
        return (
          value?.getValue()?.map((remark, i) => {
            return (
              <div style={{ marginBottom: 12, display: 'flex' }} key={i}>
                <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.comment && remark.comment}</div>
              </div>
            )
          })
        )
      },
    },
  ];

  return (
    <>
      <Grid item md={12}>
        <DataTableViewer
          rowData={data}
          filter={false}
          column={column}
          title={'Resolved Withheld Loans'}
          loading={isLoading}
        />
      </Grid>
    </>
  )
}
export default ResolvedTable;