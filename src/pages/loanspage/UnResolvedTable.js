import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core"; import Button from '../../components/CommonComponents/Button/Button';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Tooltip } from '@material-ui/core';
import { Drawer } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import AddBlackListForm from './AddBlackListForm';
import { deleteRemarks, getAllWithheldLoans, resolveRemarks } from '../../services/withheld.services';
import { useSnackbar } from 'notistack';
import { useMount } from 'react-use';
import { getAllDealership } from '../../services/dealerships.service';



const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const UnresolvedTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])
  const [dealershipData, setDealershipData] = useState([]);
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();

  useMount(() => {
    getAllWithheldLoans(0)
      .then((data) => {
        setData(data)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e);
      })
    getAllDealership()
      .then((data) => {
        setDealershipData(data.map(({ id }) => ({
          label: id,
          value: id
        })))
      })
      .catch((e) => {
        console.log(e);
      })
  })

  const handleResolve = (id) => {
    resolveRemarks(id)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        }
        )
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        }
        )
      })
  }
  const handleDelete = (id) => {
    deleteRemarks(id)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        }
        )
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        }
        )
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      })
  }

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
                    <div onClick={() => handleResolve(remark.id)} style={{ marginLeft: 12 }}>
                      <Tooltip title="Click to resolve">
                        <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                      </Tooltip>
                    </div>
                    <div onClick={() => { handleDelete(remark.id) }} style={{ marginLeft: 12 }}>
                      <Tooltip title='Click to delete'>
                        <DeleteOutlineRounded style={{ color: "#ff6666" }} fontSize={'small'} />
                      </Tooltip>
                    </div>
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
    print: false,
    download: true,
    filter: true,
    isRowSelectable: () => false,
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
      );
    }

  }

  return (
    <>
      <Grid item md={12}>
        {Array.isArray(data) ? (
          <MUIDataTable
            title={
              <Typography className={classes.title} variant="h5" component="h5">
                Unresolved withheld loans
              </Typography>
            }
            data={data}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No unresolved withheld loans found</Paper>)
        }
        {
          loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
        }
      </Grid>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        {
          <AddBlackListForm data={dealershipData} callback={() => setOpenModal(false)} />
        }
      </Drawer>
    </>
  )
}
export default UnresolvedTable;