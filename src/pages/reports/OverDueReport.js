import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ChatIcon from '@material-ui/icons/Chat';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemark, getReport } from '../../services/users.service';

const useStyles = makeStyles(theme => ({
  root: {
  },
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  },
  opac: {
    color: 'rgb(0,0,0,0.4)'
  }
}));

const OverDueTable = () => {
  const classes = useStyles();

  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState()
  const [remarkOptions, setRemarkOptions] = useState()
  const [remarksModal, setRemarksModal] = useState({open: false})
  useMount(async () => {
    setLoading(true)
    getReport()
      .then((data) => {
        setLoading(false);
        setLoans(data.overdue)
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
    
    getCollectionRemark()
      .then(setRemarks)
      .catch(e => {console.log(e)})
      
    // getCollectionRemarkOptions()
    //   .then(setRemarkOptions)
    //   .catch(e => {console.log(e)})
  })
  usePageTitle('Report')
  const columns = useMemo(() => {
    return [
      { name: 'applicant_code', label: 'Applicant Code' },
      {
        name: 'prospectcode',
        label: 'Prospect Code',
        options: {
          filter: false,
          display: false
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
        name: 'penal_overdue',
        label: 'Penal Overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
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
              value ? (
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Badge color="primary" badgeContent={value?.length} max={99} onClick={() => value?.length && (setRemarksModal({open:true, data: value}))}>
                    <ChatIcon style={{color: 'grey'}} fontSize="small" />
                  </Badge>
                </div>
              ) : null
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
    <div className={classes.root}>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={'Loan Overdue Reports'}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No overdue Reports found</Paper>
      }
      <Dialog
        open={remarksModal?.open}
        onClose={() => setRemarksModal({open: false})}
      >
        <DialogTitle>Overdue Remarks</DialogTitle>
        <DialogContent style={{width: 400}}>
          {
              remarksModal?.data?.length ? (
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
              ) : ( <Typography variant="body1" className={classes.opac}>No Remarks</Typography> )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksModal({open: false})}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default OverDueTable