import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from 'mui-datatables';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: 0
  },
  tableWrapperCard: {

  }
}));

const options = {
  // filterType: 'checkbox',
  selectableRows: 'none',
  selectableRowsHeader: false,
  isRowSelectable: () => false
};

const InfoTable = ({ title, head, body, tableOptions={}, containerStyle }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={containerStyle}>
      {
        Array.isArray(body) && body.length ? (
          <MUIDataTable
            title={title ? <Typography className={classes.title} variant="h5" component="h5">{title}</Typography> : undefined}
            data={body}
            columns={head}
            options={{
              ...options,
              ...tableOptions
            }}
          />
        ) : 'Loading...'
      }
    </div>
  )
};

export default InfoTable;