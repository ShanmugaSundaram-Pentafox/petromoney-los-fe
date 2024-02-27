import { Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles'
import MUIDataTable from 'mui-datatables'
import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { NavLink as RouterLink } from 'react-router-dom'
import { useMount } from 'react-use'
import { createStructuredSelector } from 'reselect'
import { getOmcList } from '../../../services/common.service'
import { getAllTransport, getTransportersOwnerById } from '../../../services/transports.service'
import { setAllTransports } from '../../../store/transports/transports.actions'
import { selectAllTransports } from '../../../store/transports/transports.selector'
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';




const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
    marginRight: 12,
  },
  button: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))
function getSteps() {
  return ['Add Transport Owner Information', 'Add Transport Information'];
}



const TransportsTable = ({ transports, setAllTransports, onRowClick, portal, transporterId }) => {


  const [loading, setLoading] = useState(false);
  const [omcs, setOmcs] = useState([]);
  const columnHelper = createColumnHelper();

  const classes = useStyles();

  const column = [
    columnHelper.accessor('transporter_id', {
      header: 'Code',
      cell: (value) => <RouterLink to={`/transports/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile Number',
    }),
    columnHelper.accessor('omc_value', {
      header: 'OMC',
    }),
  ]

  useMount(() => {
    if (portal) {
      setLoading(true)
      getTransportersOwnerById(transporterId)
        .then((data) => {
          setLoading(false)
          setAllTransports(data)
        })
        .catch((e) => {
          console.log(e);
          setLoading(false)
        })
    } else
      if (!transports.length) {
        setLoading(true)
        getAllTransport()
          .then((data) => {
            setAllTransports(data)
            setLoading(false)
            // setData(data)
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          })
      }
    getOmcList()
      .then((data) => {
        setOmcs(data);
      })
      .catch((e) => {
        console.log(e);
      });
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    print: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(transports[dataIndex].dealership_id, transports[dataIndex])
    },
  }

  return (
    <div>
      <DataTableViewer
        title={'Transporter List'}
        column={column}
        rowData={transports}
        onRowClick={i => onRowClick(i?.dealership_id, i)}
        loading={loading}
      />
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  transports: selectAllTransports,
})

const mapDispatchToProps = (dispatch) => ({
  setAllTransports: (data) => dispatch(setAllTransports(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransportsTable)
