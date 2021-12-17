import { Badge, Grid, makeStyles } from '@material-ui/core';
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
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      { name: 'cust_region', label: 'Customer Region' },
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
          display: false
        }
      },
      {
        name: 'remarks',
        label: 'Remarks',
        options: {
          filter: false,
          sort: true,
          // display: false,
          customBodyRender: value => {
            return (
              value && (
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Badge classes={{ badge: classes.badge }} color="secondary" badgeContent={value?.length} max={99} >
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
    },
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
      return(
        <React.Fragment>
          <tr>
            <td colSpan={6}>
              <div style={{margin: 7, marginLeft: 60}}>
                <label><strong>Remarks</strong></label>
                <div style={{width: '25rem', marginTop: 5}}>
                  {
                    rowData[7].map((data, i) => {
                      const rem = remarks?.find(d => d.id === data.id)
                      return(<p key={i}><span style={{color:'rgb(0,0,0,0.4)'}}>{i+1}. </span>{rem?.remarks} {data?.options?.map((item,i) => {return(<span key={i}>{`${Object.values(item)},`}</span>)})}</p>)
                    })
                  }
                </div>
              </div>
            </td>
          </tr>
        </React.Fragment>
      )
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
            title="Remarks"
            columns={columns}
            options={options}
            data={loans}
          />
        )
      }
    </div>
  )
}

export default CollectionRemarks
