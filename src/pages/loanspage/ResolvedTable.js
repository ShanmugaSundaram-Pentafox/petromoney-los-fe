import { Grid, } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { getAllWithheldLoans } from '../../services/withheld.services';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import moment from 'moment';

const ResolvedTable = () => {
  const { data = [], isLoading } = useQuery('withheld-loans-resolved', () => getAllWithheldLoans(1), { refetchOnWindowFocus: false });
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
      key: 'with_held_by',
      header: 'Withheld By',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.withheld_by || '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'resolved_by',
      header: 'Resolved By',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.withheld_by || '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'resolved_date',
      header: 'WithHeld Date',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.withheld_date ? moment(remark?.withheld_date, 'YYYY-MM-DD').format('DD-MM-YYYY') : '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'resolved_date',
      header: 'Resolved Date',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.resolved_date ? moment(remark?.resolved_date, 'YYYY-MM-DD').format('DD-MM-YYYY') : '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'comments',
      header: 'Resolution',
      cell: (value) => {
        return (
          value?.getValue()?.map((remark, i) => {
            return (
              <div style={{ width: 250 }} key={i}>
                <div style={{
                  minWidth: 250, maxWidth: 250,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{remark.comment && remark.comment}</div>
              </div>
            )
          })
        )
      },
    }, {
      key: 'remarks',
      header: 'Remarks',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div style={{ width: 250 }} key={i}>
                <div
                  dangerouslySetInnerHTML={{ __html: remark?.remarks }}
                  style={{
                    minWidth: 250, maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} />
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