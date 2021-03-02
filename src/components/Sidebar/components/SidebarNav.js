/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ReportIcon from '@material-ui/icons/Report';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

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
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    // color: theme.palette.icon,
    // color: "rgba(34, 36, 68, 1)",
    width: 24,
    height: 24,
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
  const { pages, className, ...rest } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
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
      ))}
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
                <div className={classes.icon}><AssessmentIcon/></div>
                {'Report'}
              </div>
              {(checked)?
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
              <div className={classes.icon}><ReportIcon/></div>
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
              <div className={classes.icon}><ReportProblemIcon/></div>
              {'Loan Overdue'}
            </Button>
            
          </ListItem>
        </Collapse>
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;