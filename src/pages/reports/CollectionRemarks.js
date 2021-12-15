import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import { Skeleton } from '@material-ui/lab';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemark, getReport } from '../../services/users.service';

const useStyles = makeStyles(theme => ({
  badge: {
    fontSize: 10,
    height: 15
  },
  icon: {
    color: 'rgb(0,0,0,0.4)',
    cursor: 'pointer'
  }
}))

const CollectionRemarks = () => {
  usePageTitle('Collection Remarks');
  const classes = useStyles();
  const [loans, setLoans] = useState([])
  const [remarksModal, setRemarksModal] = useState({open: false})

  const { isFetching } = useQuery('remarksData', () => getReport(), {
    onSuccess: (data) => {
      let buffer = []
      data.due.map(item => item.remarks?.length !==0 && buffer.push(item))
      data.overdue.map(item => item.remarks?.length !==0 && buffer.push(item))
      setLoans(buffer)
    },
    refetchOnWindowFocus: false
  })

  const { data: remarks=[] } = useQuery('remarks', () => getCollectionRemark(), {refetchOnWindowFocus: false})

  const columns = useMemo(() => {
    return [
      {
        name: 'prospectcode',
        label: 'Prospect Code',
        options: {
          filter: false,
        }
      },
      { name: 'applicant_name', label: 'Applicant Name' },
      {
        name: 'omc',
        label: 'OMC',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'disb_amt',
        label: 'Disbursed Amount',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'disb_date',
        label: 'Disbursed Date',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'prin_overdue',
        label: 'Print Due',
        options: {
          filter: false,
          display: false
        }
      },
      { name: 'cust_code', label: 'Customer Code' },
      { name: 'cust_region', label: 'Customer Region' },
      {
        name: 'int_overdue',
        label: 'Int Overdue',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'tot_due',
        label: 'Total Due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'remarks',
        label: 'Remarks',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return (
              value && (
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Badge classes={{ badge: classes.badge }} color="secondary" badgeContent={value?.length} max={99} onClick={() => value?.length && (setRemarksModal({open:true, data: value}))}>
                    <ChatIcon className={classes.icon} fontSize="small" />
                  </Badge>
                </div>
              )
            )
          }
        }
      },
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
    onDownload: (buildHead, buildBody, columns, data) => {
      let Data = () => {
        let array = []
        data.map((item, index) => {
          let buffer = []
          item.data.map((data, i) => {
            if(typeof(data) !== 'object'){
              buffer.push(data)
            } else {
              let est = data.map((obj, num) => {
                const rem = remarks?.find(d => d.id === obj.id)
                return(obj.options ? (rem.remarks+': '+obj?.options?.map(item => {return(`${Object.values(item)}, `)})) : (rem.remarks))
              })
              buffer.push(est.toString())
            }
          })
          array.push({index: index, data: buffer})
        })
        return array
      }
      return '\uFEFF' + buildHead(columns) + buildBody(Data())
    }
  };

  return (
    <div>
      {
        isFetching ? (
          <Grid item xs={12}>
            <Skeleton variant='rect' width='100%' height={400} />
          </Grid>
        ) : (
          <MUIDataTable 
            title="Remarks Table"
            columns={columns}
            options={options}
            data={loans}
          />
        )
      }
      <Dialog
        open={remarksModal?.open}
        onClose={() => setRemarksModal({open: false})}
      >
        <DialogTitle>Remarks</DialogTitle>
        <DialogContent style={{width: 400}}>
          {
            <ol style={{marginLeft: 15}}>
              {
                            remarksModal?.data?.map((data, i) => {
                              const rem = remarks?.find(d => d.id === data.id)
                              return(
                                <li key={i}>{rem?.remarks} {data?.options?.map((item, i)=> {return(<span key={i}>{`${Object.values(item)}, `}</span>)})}</li>
                              )
                            })
              }
            </ol>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksModal({open: false})} variant='outlined' size='small'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CollectionRemarks
