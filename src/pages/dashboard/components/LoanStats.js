import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import DashCard from '../../../components/CommonComponents/Cards/DashCard';

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'nowrap',
      }
    }
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    border: '1px solid hsl(0, 0%, 90%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    minHeight: 32,
    boxSizing: 'border-box',
    padding: '0 4px',
  },
  filterItem: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 2,
    padding: '2px 4px',
    minWidth: 50,
    textAlign: 'center',
    border: 'none',
    backgroundColor: 'hsl(0, 0%, 100%)',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      backgroundColor: 'hsl(0, 0%, 95%)',
    },
    '&.active': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
    '&.disabled': {
      backgroundColor: 'hsl(0, 0%, 80%)',
      padding: '4px 8px',
      marginTop: 6,
      borderRadius: 8,
    },
    '&:last-child': {
      marginRight: 0,
      '&::after': {
        display: 'none',
      }
    }
  },
}))

const LoanStats = ({ selectedStatsCard, handleClick, chartData, totalLoans }) => {
  const classes = useStyles();

  return (
    <Box p={2} pt={1} borderRadius={4} bgcolor="background.paper">
      <Box pb={1} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
        <Typography variant='h5' style={{ fontWeight: 500 }}>Loans&apos; Statistics {totalLoans ? `(${totalLoans})` : null}</Typography>
      </Box>
      <Box className={classes.card} borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="nowrap">
        {
          chartData.map((item, i) => (
            <DashCard key={i} noBorder={i === chartData.length - 1} value={item.count} text={item.name} amount={item.amount} selected={item.name === selectedStatsCard} action={() => handleClick(item.name)} />
          ))
        }
      </Box>
    </Box>
  )
}

export default LoanStats;
