import React, { useMemo } from "react"
// import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography"
// import Box from "@material-ui/core/Box"

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const UsersTable = ({ title, data, withRole }) => {
  const classes = useStyles()

  const columns = useMemo(() => {
    const d = [
      {
        label: "Name",
        name: "name",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Mobile Number",
        name: "mobile",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Email",
        name: "email",
        options: {
          filter: false,
          sort: true,
        },
      }
    ];

    return withRole ? [
      ...d,
      {
        label: "Role",
        name: "role_name",
        options: {
          filter: true,
          sort: true,
        },
      },
    ] : d;
  }, [withRole])

  const options = {
    filter: withRole ? true : false,
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    isRowSelectable: () => false,
  }

  return (
    <div>
      {Array.isArray(data) && data.length ? (
        <MUIDataTable
          title={
            <Typography className={classes.title} variant="h4" component="h4">
              {title}
            </Typography>
          }
          data={data}
          columns={columns}
          options={options}
        />
      ) : null}
    </div>
  )
}

export default UsersTable
