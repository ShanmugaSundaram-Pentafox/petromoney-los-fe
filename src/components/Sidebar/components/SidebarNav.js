/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { useState, forwardRef, Fragment } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import InputIcon from '@material-ui/icons/Input';
import { List, ListItem, IconButton, Button, colors, Hidden } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ReportIcon from '@material-ui/icons/Report';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import { getAllExceptions, getTransportsExceptions } from '../../../services/loans.service';
import { useMount } from "react-use";
import Badge from '@material-ui/core/Badge';
import { connect } from 'react-redux';
import { resetCurrentUser } from '../../../store/user/user.actions';


const useStyles = makeStyles(theme => ({
  block1: {
    display: 'flex',
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
    color: "rgba(173, 173, 173, 1)",
    padding: '8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontSize: 13,
    fontWeight: theme.typography.fontWeightMedium
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
    padding: '6px 8px',
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
  const { pages, className, logout, ...rest } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [exceptions, setExceptions] = useState([]);
  const [transException, setTransException] = useState([]);
  const [check, setCheck] = React.useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  useMount(() => {
    getAllExceptions()
      .then((data) => {
        setExceptions(data)
      })
      .catch((e) => {
        console.log(e);
      });
    getTransportsExceptions()
      .then((data) => {
        setTransException(data)
      })
      .catch((e) => {
        console.log(e)
      })
  });
  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const handleClick = () => {
    setCheck((prev) => !prev);
  };
  const handleOpen = () => {
    setCheckStatus((prev) => !prev);
  }
  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        page.title !== "Loans" && page.title !== "Report" && page.title !== "Exception" ? (
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
        ) : page.title === "Loans" ? (
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
                // to={page.href}
                exact
              >
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
                {(check) ?
                  <div className={classes.iconArrow}><ExpandLessIcon /></div>
                  :
                  <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                }
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
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'All'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/blacklist'}
                  exact
                >
                  <Badge badgeContent={2} max={999} color="primary">
                    <div className={classes.icon}><BookmarkBorderIcon /></div>
                    {'Blacklist'}
                  </Badge>
                </Button>
              </ListItem>
            </Collapse>
          </Fragment>
        ) : page.title === "Report" ? (
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
                key={'Due'}
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  component={CustomRouterLink}
                  to={'/reports/due'}
                  exact
                >
                  <div className={classes.icon}><ReportIcon /></div>
                  {'Loan Due'}
                </Button>
              </ListItem>
              <ListItem
                className={classes.itemSub}
                disableGutters
                key={'Overdue'}
              >
                <Button
                  className={classes.button}
                  activeClassName={classes.active}
                  component={CustomRouterLink}
                  to={'/reports/overdue'}
                  exact
                >
                  <div className={classes.icon}><ReportProblemIcon /></div>
                  {'Loan Overdue'}
                </Button>
              </ListItem>
            </Collapse>

          </Fragment>

        ) : page.title === "Exception" ? (
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
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
                {(checkStatus) ?
                  <div className={classes.iconArrow}><ExpandLessIcon /></div>
                  :
                  <div className={classes.iconArrow}><ExpandMoreIcon /></div>
                }
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
                  to={'/loans/exceptions'}
                  exact
                >
                  <Badge badgeContent={exceptions.length} max={999} color="primary">
                    <div className={classes.icon}><AssessmentOutlinedIcon /></div>
                    Loans &nbsp;
                  </Badge>
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
                  to={'/transport/exceptions'}
                  exact
                >
                  <Badge badgeContent={transException.length} max={999} color="primary">
                    <div className={classes.icon}><AssessmentOutlinedIcon /></div>
                    Transports &nbsp;
                  </Badge>
                </Button>
              </ListItem>
            </Collapse>
          </Fragment>
        ) : null
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