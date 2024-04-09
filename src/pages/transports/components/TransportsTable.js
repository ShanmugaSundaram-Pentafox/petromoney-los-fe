import React, { useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { useMount } from 'react-use'
import { getOmcList } from '../../../services/common.service'
import { getAllTransport, getTransportersOwnerById } from '../../../services/transports.service'
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';

const TransportsTable = ({ onRowClick, portal, transporterId }) => {
  const [transports, setAllTransports] = useState();
  const [loading, setLoading] = useState(false);
  const [omcs, setOmcs] = useState([]);

  const column = [
    {
      key: 'transporter_id',
      header: 'Code',
      cell: (value) => <RouterLink to={`/transports/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'mobile',
      header: 'Mobile Number',
    }, {
      key: 'omc_value',
      header: 'OMC',
    },
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
        filter={false}
        rowData={transports}
        onRowClick={i => onRowClick(i?.dealership_id, i)}
        loading={loading}
      />
    </div>
  )
}


export default TransportsTable;
