import { Typography } from '@material-ui/core';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react'
import { useMount } from 'react-use';
import usePageTitle from '../../hooks/usePageTitle';
import { getOpportunities } from '../../services/loans.service';
import Currency from '../Number/Currency';

const useStyles = makeStyles(() => ({
  cardWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    // flexBasis: '33.33%',
    justifyContent: 'space-between',
  },
  rootCard: {
    flex: '2 0 21%',
    margin: 8,
    padding: 16,
    minWidth: 220,
    backgroundColor: '#FFF',
    borderRadius: 6,
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    // flexDirection: 'column',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
  },
  cardTitle: {
    fontSize: '1.4rem',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginTop: 8
  },
  value: {
    fontSize: '28px',
    fontWeight: 'bolder'
  },
  valueTitle: {
    color: 'rgb(0,0,0,0.3)'
  },
  iconStyle: {
    position: 'absolute', color: 'rgb(0,0,0,0.03)', right: '-85px', top: '-10px', fontSize: 240, zIndex: '-1px'
  }
}))

const OpportunityReport = () => {
  usePageTitle('Opportunity Report');
  const classes = useStyles();
  const [opportunities, setOpportunities] = useState();

  useMount(() => {
    getOpportunities()
      .then(setOpportunities)
      .catch(e => {
        console.log(e)
      })
  })

  return (
    <div className={classes.cardWrapper}>
      <OpportunityCard title='Leads' currValue={opportunities?.current?.leads} projValue={opportunities?.projection?.leads} icon={PersonOutlinedIcon} />
      <OpportunityCard title='Convertion Count' currValue={opportunities?.current?.convertion_count} projValue={opportunities?.projection?.convertion_count} icon={CachedOutlinedIcon} />
      <OpportunityCard title='Avg. Time Taken' currValue={opportunities?.current?.average_time_taken} projValue={opportunities?.projection?.average_time_taken} icon={AccessTimeOutlinedIcon} />
      <OpportunityCard title='Rejection Count' currValue={opportunities?.current?.rejection_count} projValue={opportunities?.projection?.rejection_count} icon={CancelOutlinedIcon} />
      <OpportunityCard title='Amount Approved' currValue={opportunities?.current?.amount_approved} projValue={opportunities?.projection?.amount_approved} currency={true} icon={BeenhereOutlinedIcon} />
      <OpportunityCard title='Avg. Amount' currValue={opportunities?.current?.average_amount} projValue={opportunities?.projection?.average_amount} currency={true} icon={AccountBalanceOutlinedIcon} />
    </div>
  )
}

const OpportunityCard = ({title, currValue, projValue, currency=false, icon}) => {
  const classes = useStyles();
  const Icon = icon;
  return(
    <div className={classes.rootCard}>
      <Icon className={classes.iconStyle} />
      <div className={classes.cardTitle}>{title}</div>
      <div className={classes.content}>
        <span className={classes.value}>{currency ? <Currency value={currValue} /> : currValue}</span>
        <div className={classes.valueTitle}>Current</div>
      </div>
      <div className={classes.content}>
        <span className={classes.value}>{currency ? <Currency value={projValue} /> : projValue}</span>
        <Typography variant='body1' className={classes.valueTitle}>Projection</Typography>
      </div>
    </div>
  )
}

export default OpportunityReport