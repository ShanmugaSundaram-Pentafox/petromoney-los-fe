import { Grid, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllWithheldLoans } from '../../services/withheld.services';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const ResolvedTable = () => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles()
  const {data=[]} = useQuery('withheld-loans', () => getAllWithheldLoans(1), {refetchOnWindowFocus: false})

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership ID',
        name: 'id',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <div>{value}</div>
          },
        },
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Remarks',
        name: 'remarks',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: (value, tableMeta) => {
            return (
              value?.map((remark, i) => {
                return (
                  <div style={{ marginBottom: 12, display: 'flex' }} key={i}>
                    <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.remarks} {remark.comment && '- ' + remark.comment}</div>
                  </div>
                )
              })
            )
          },
        },
      },
    ]
  }, [])
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    viewColumns: false,
    print: true,
    download: true,
    filter: true,
    isRowSelectable: () => false,
    onDownload: (buildHead, buildBody, columns, data) => {
      let Data = () => {
        let tempArray = []
        data.map((item, index) => {
          let buffer = []
          item.data.map((data, i) => {
            if (typeof (data) !== 'object') {
              buffer.push(data)
            } else {
              let result = data.map(obj => `${obj.remarks} - ${obj.comment}\n`)
              buffer.push(result)
            }
          })
          tempArray.push({ index: index, data: buffer })
        })
        return tempArray
      }
      return '\uFEFF' + buildHead(columns) + buildBody(Data())
    },
  }

  return (
    <>
      <Grid item md={12}>
        {Array.isArray(data) && data.length ? (
          <MUIDataTable
            title={
              <Typography className={classes.title} variant="h5" component="h5">
                Resolved withheld loans
              </Typography>
            }
            data={data}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No resolved withheld loans found</Paper>)
        }
        {
          loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
        }
      </Grid>
    </>
  )
}
export default ResolvedTable;