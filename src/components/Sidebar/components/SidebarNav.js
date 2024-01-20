/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import { List, ListItem, Button, colors, Hidden } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import BookIcon from '@material-ui/icons/Book';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputIcon from '@material-ui/icons/Input';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, forwardRef, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { rulesList } from '../../../config/userRules';
import { resetCurrentUser } from '../../../store/user/user.actions';
import { permissionCheck } from '../../UserCan/UserCan';


const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
  },
  block1: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  block2: {
    display: 'flex',
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemSub: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 15
  },
  button: {
    // color: colors.blueGrey[200],
    color: 'rgba(173, 173, 173, 1)',
    padding: '8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontSize: 13,
    fontWeight: 500
  },
  icon: {
    // color: theme.palette.icon,
    // color: "rgba(34, 36, 68, 1)",
    width: 24,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  iconArrow: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(3)
  },
  active: {
    padding: '10px 8px',
    backgroundColor: 'rgba(248, 213, 138, 1)',
    color: colors.blueGrey[800],
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: 'rgba(34, 36, 68, 1)'
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, logout, currentUser, ...rest } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [tap, setTap] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [checkCredit, setCheckCredit] = useState(false);
  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const handleCredit = () => {
    setCheckCredit((prev) => !prev);
  };
  const handleClick = () => {
    setCheck((prev) => !prev);
  };
  const handleTap = () => {
    setTap((prev) => !prev);
  }
  const handleOpen = () => {
    setCheckStatus((prev) => !prev);
  }
  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        page.title !== 'Loans' && page.title !== 'Transports' && page.title !== 'Report' && page.title !== 'Passbook' && page.title !== 'Credit Reload' ? (
          <ListItem
            className={classes.item}
            disableGutters
            key={page.title}
          >
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={page.href}
              exact
            >
              <div className={classes.icon}>{page.icon}</div>
              {page.title}
            </Button>
          </ListItem>
        ) : page.title === 'Loans' ? (
          <Fragment key={page.title}>
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                onClick={handleClick}
                exact
              >
                <div className={classes.block1}>
                  <div className={classes.block2}>
                    <div className={classes.icon}>{page.icon}</div>
                    {page.title}
                  </div>
                  {(check) ?
                    <div className={classes.iconArrow}><ExpandLessIcon /></div>
                    :
                    <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                  }
                </div>
              </Button>
            </ListItem>
            <Collapse in={check} >
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'All'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={page.href}
                  exact
                >
                  <div className={classes.icon}><BookmarkBorderIcon /></div>
                  {'Fuel Loans'}
                </Button>
              </ListItem>
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'All'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/vehicle-loan'}
                  exact
                >
                  <div className={classes.icon}><BookmarkBorderIcon /></div>
                  {'Vehicle Loans'}
                </Button>
              </ListItem>
            </Collapse>
          </Fragment>
        ) : page.title === 'Credit Reload' ? (
          <Fragment key={page.title}>
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                onClick={handleCredit}
                exact
              >
                <div className={classes.block1}>
                  <div className={classes.block2}>
                    <div className={classes.icon}>{page.icon}</div>
                    {page.title}
                  </div>
                  {(checkCredit) ?
                    <div className={classes.iconArrow}><ExpandLessIcon /></div>
                    :
                    <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                  }
                </div>
              </Button>
            </ListItem>
            <Collapse in={checkCredit} >
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'Credit'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/credit/reload/new/reports'}
                  exact
                >
                  <div className={classes.icon}><BookmarkBorderIcon /></div>
                  {'New'}
                </Button>
              </ListItem>
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'All'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/credit/reload/processed/reports'}
                  exact
                >
                  <div className={classes.icon}><BookmarkBorderIcon /></div>
                  {'Processed'}
                </Button>
              </ListItem>
            </Collapse>
          </Fragment>
        ) : page.title === 'Transports' ? (
          <Fragment key={page.title}>
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                onClick={handleTap}
                exact
              >
                <div className={classes.block1}>
                  <div className={classes.block2}>
                    <div className={classes.icon}><LocalShippingIcon /></div>
                    {page.title}
                  </div>
                  {(tap) ?
                    <div className={classes.iconArrow}><ExpandLessIcon /></div>
                    :
                    <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                  }

                </div>
              </Button>
            </ListItem>
            <Collapse in={tap} >
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'List'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/transports'}
                  exact
                >
                  <div className={classes.icon}><ListAltIcon /></div>
                  {'Transports List'}
                </Button>
              </ListItem>
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'Passbook'}
              >
                <Button
                  className={classes.button}
                  activeClassName={classes.active}
                  component={CustomRouterLink}
                  to={'/transport/fastag/details'}
                  exact
                >
                  <div className={classes.icon}><BookIcon /></div>
                  {'Passbook'}
                </Button>
              </ListItem>
            </Collapse>
          </Fragment>

        ) :
          page.title === 'Report' ? (
            <Fragment key={page.title}>
              <ListItem
                className={classes.item}
                disableGutters
                key={'Reports'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  onClick={handleChange}
                  exact
                >
                  <div className={classes.block1}>
                    <div className={classes.block2}>
                      <div className={classes.icon}><AssessmentIcon /></div>
                      {'Report'}
                    </div>
                    {(checked) ?
                      <div className={classes.iconArrow}><ExpandLessIcon /></div>
                      :
                      <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                    }

                  </div>
                </Button>
              </ListItem>
              <Collapse in={checked} >
                <ListItem
                  className={classes.itemSub}
                  disableGutters
                  key={'projection'}
                >
                  {
                    permissionCheck(currentUser.role_name, rulesList.opportunity_report) &&
                    <Button
                      className={classes.button}
                      activeClassName={classes.active}
                      component={CustomRouterLink}
                      to={'/reports/opportunities'}
                      exact
                    >
                      <div className={classes.icon}><BarChartOutlinedIcon /></div>
                      {'Opportunity Report'}
                    </Button>
                  }
                </ListItem>
                <ListItem
                  className={classes.itemSub}
                  disableGutters
                  key={'LosLms'}
                >
                  <Button
                    className={classes.button}
                    activeClassName={classes.active}
                    component={CustomRouterLink}
                    to={'/report/dpd'}
                    exact
                  >
                    <div className={classes.icon}><AssessmentOutlinedIcon /></div>
                    DPD Report &nbsp;
                  </Button>
                </ListItem>
              </Collapse>
            </Fragment>

          ) : page.title === 'Passbook' ? (
            <Fragment>
              <ListItem
                className={classes.item}
                disableGutters
                key={page.title}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  onClick={handleOpen}
                  exact
                >
                  <div className={classes.block1}>
                    <div className={classes.block2}>
                      <div className={classes.icon}>{page.icon}</div>
                      {page.title}
                    </div>
                    {(checkStatus) ?
                      <div className={classes.iconArrow}><ExpandLessIcon /></div>
                      :
                      <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                    }
                  </div>
                </Button>
              </ListItem>
              <Collapse in={checkStatus}>
                <ListItem
                  className={classes.itemSub}
                  disableGutters
                  key={'LosLms'}
                >
                  <Button
                    className={classes.button}
                    activeClassName={classes.active}
                    component={CustomRouterLink}
                    to={'/passbook'}
                    exact
                  >
                    <div className={classes.icon}><AssessmentOutlinedIcon /></div>
                    Dealer Passbook &nbsp;
                  </Button>
                </ListItem>
                <ListItem
                  className={classes.itemSub}
                  disableGutters
                  key={'LosLms'}
                >
                  <Button
                    className={classes.button}
                    activeClassName={classes.active}
                    component={CustomRouterLink}
                    to={'/transport/fastag/details'}
                    exact
                  >
                    <div className={classes.icon}><AssessmentOutlinedIcon /></div>
                    Transport Passbook &nbsp;
                  </Button>
                </ListItem>
              </Collapse>
            </Fragment>) : null
      ))}
      <Hidden lgUp>
        <ListItem
          className={classes.item}
          disableGutters
        >
          <Button
            className={classes.button}
            color="inherit"
            onClick={logout}
          >
            <div className={classes.icon}><InputIcon /></div>
            {'Logout'}
          </Button>
        </ListItem>
      </Hidden>
    </List>
  );
};
SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
})


export default connect(undefined, mapDispatchToProps)(SidebarNav);