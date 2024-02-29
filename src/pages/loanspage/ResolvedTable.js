import { Grid, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllWithheldLoans } from '../../services/withheld.services';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const ResolvedTable = () => {
  const classes = useStyles()
  const { data = [], isLoading } = useQuery('withheld-loans', () => getAllWithheldLoans(1), { refetchOnWindowFocus: false });
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('id', {
      header: 'Dealership Id',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
    }),
    columnHelper.accessor('comments', {
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
    }),
  ];

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   rowsPerPage: 10,
  //   viewColumns: false,
  //   print: true,
  //   download: true,
  //   filter: true,
  //   isRowSelectable: () => false,
  //   onDownload: (buildHead, buildBody, columns, data) => {
  //     let Data = () => {
  //       let tempArray = []
  //       data.map((item, index) => {
  //         let buffer = []
  //         item.data.map((data, i) => {
  //           if (typeof (data) !== 'object') {
  //             buffer.push(data)
  //           } else {
  //             let result = data.map(obj => `${obj.comment}\n`)
  //             buffer.push(result)
  //           }
  //         })
  //         tempArray.push({ index: index, data: buffer })
  //       })
  //       return tempArray
  //     }
  //     return '\uFEFF' + buildHead(columns) + buildBody(Data())
  //   },
  // }

  return (
    <>
      <Grid item md={12}>
        <DataTableViewer
          rowData={data}
          filter={false}
          column={column}
          title={`Resolved Withheld Loans`}
          loading={isLoading}
        />
      </Grid>
    </>
  )
}
export default ResolvedTable;