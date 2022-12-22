import { Grid, Drawer, Paper, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useMount } from 'react-use';
import AddBlackListForm from './AddBlackListForm';
import Button from '../../components/CommonComponents/Button/Button';
import { action_id, resources_id } from '../../config/accessControl';
import { getAllDealership } from '../../services/dealerships.service';
import { deleteRemarks, getAllWithheldLoans, resolveRemarks } from '../../services/withheld.services';
import { isAllowed } from '../../utils/cerbos';


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const UnresolvedTable = ({currentUser}) => {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false);
  const [dealershipData, setDealershipData] = useState([]);
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const {data=[], isLoading} = useQuery('withheld-loans', () => getAllWithheldLoans(0), {refetchOnWindowFocus: false})


  useMount(() => {
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
        })
        queryClient.invalidateQueries('withheld-loans')
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
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
        })
        queryClient.invalidateQueries('withheld-loans')
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }

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
                    {
                      // Withheld resolve permission check
                      isAllowed(currentUser?.access, resources_id?.withheld, action_id?.withheld?.resolve) ?
                        <div onClick={() => handleResolve(remark.id)} style={{ marginLeft: 12 }}>
                          <Tooltip title="Click to resolve">
                            <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                          </Tooltip>
                        </div> : null
                    }
                    {
                      // withheld delete permission check
                      isAllowed(currentUser?.access, resources_id?.withheld, action_id?.withheld?.delete) ?
                        <div onClick={() => { handleDelete(remark.id) }} style={{ marginLeft: 12 }}>
                          <Tooltip title='Click to delete'>
                            <DeleteOutlineRounded style={{ color: '#ff6666' }} fontSize={'small'} />
                          </Tooltip>
                        </div> : null
                    }
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
    print: false,
    download: true,
    filter: true,
    isRowSelectable: () => false,
    customToolbar: () => 
    {
      return (
        // Withheld create permission check
        isAllowed(currentUser?.access, resources_id?.withheld, action_id?.withheld?.create) ?
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Add
          </Button> : null
      );
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      let Data = () => {
        let array = []
        data.map((item, index) => {
          let buffer = []
          item.data.map((data, i) => {
            if(typeof(data) !== 'object'){
              buffer.push(data)
            } else {
              let est = data.map((obj, num) => Object.values(obj)[2])
              buffer.push(est.toString())
            }
          })
          array.push({index: index, data: buffer})
        })
        return array
      }
      return '\uFEFF' + buildHead(columns) + buildBody(Data())
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
        ) : (!isLoading && <Paper style={{ padding: 10 }}>No unresolved withheld loans found</Paper>)
        }
        {
          isLoading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
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