import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React from 'react';

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