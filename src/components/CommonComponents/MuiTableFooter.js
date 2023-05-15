import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const MuiTableFooter = ({
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  useEffect(() => {
    onPageChange(page);
  }, [page, onPageChange]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return (
    <div className={classes.root}>
      <Pagination
        count={totalCount}
        page={page}
        onChange={handlePageChange}
        // color="primary"
        // size="large"
        // showFirstButton
        // showLastButton
      />
    </div>
  );
};

MuiTableFooter.propTypes = {
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default MuiTableFooter;
