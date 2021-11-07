import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react'

const Datatable = ({title, data, columns}) => {
    
    const options = {
        // filterType: 'checkbox',
        selectableRowsHeader: false,
        selectableRows: 'none',
        isRowSelectable: () => false,
        search: false,
        print: false,
        filter: false,
        download: false,
        viewColumns: false,
        rowsPerPage: 5
      };
    
    return (
        <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={options}
        />
    )
}

export default Datatable
