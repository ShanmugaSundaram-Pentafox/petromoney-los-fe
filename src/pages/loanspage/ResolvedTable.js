import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core";
import { useMount } from 'react-use';
import { getAllWithheldLoans } from '../../services/withheld.services';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const ResolvedTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])
  const classes = useStyles()

  useMount(() => {
    getAllWithheldLoans(1)
      .then((data) => {
        setData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })

  const columns = useMemo(() => {
    return [
      {
        label: "Dealership ID",
        name: "id",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <div>{value}</div>
          },
        },
      },
      {
        label: "Name",
        name: "name",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: "Region",
        name: "region",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "Remarks",
        name: "remarks",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: (value, tableMeta) => {
            return (
              value?.map((remark) => {
                return (
                  <div style={{ marginBottom: 12, display: 'flex' }}>
                    <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.remarks}</div>
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
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    viewColumns: false,
    print: true,
    download: true,
    filter: true,
    isRowSelectable: () => false,

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