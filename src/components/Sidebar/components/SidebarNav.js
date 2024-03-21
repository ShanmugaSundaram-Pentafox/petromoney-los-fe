import { List, ListItem } from '@mantine/core';
import InputIcon from '@material-ui/icons/Input';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
// import { rulesList } from '../../../config/userRules';
import { resetCurrentUser } from '../../../store/user/user.actions';
import { Link } from '../../Mantine/Link/Link';
// import { permissionCheck } from '../../UserCan/UserCan';


const SidebarNav = props => {
  const { navLinks, logout, currentUser, ...rest } = props;
  const history = useHistory();
  const location = useLocation();

  return (
    <List
      {...rest}
      listStyleType="none"
      className="flex flex-col"
    >
      {/* {navLinks.map((link) => {
        return (
          <>
            {link.name !== 'Loans' && link.name !== 'Transports' && link.name !== 'Report' && link.name !== 'Passbook' && link.name !== 'Credit Reload' ? (
              <li key={link.name}>
                <Link 
                  label={link.name}
                  leftSection={link.icon}
                  onClick={() => history.push(link.href)}
                  active={location.pathname === link.href}
                />
              </li>
            ) : link.name === 'Loans' ? (
              <li key={link.name}>
                <Link 
                  label={link.name}
                  leftSection={link.icon}
                  childrenOffset={28}
                >
                  <Link 
                    key={'All'}
                    onClick={() => history.push(link.href)}
                    label={'Fuel Loans'}
                    leftSection={link.icon}
                    active={location.pathname === link.href}
                  />
                  <Link 
                    key={'All'}
                    onClick={() => history.push('/vehicle-loan')}
                    label={'Vehicle Loans'}
                    leftSection={link.icon}
                    active={location.pathname === '/vehicle-loan'}
                  />
                </Link>
              </li>
            ) : link.name === 'Credit Reload' ? (
              <li key={link.name}>
                <Link
                  label={link.name}
                  leftSection={link.icon}
                  childrenOffset={28}
                >
                  <Link
                    key={'Credit'}
                    label="New"
                    leftSection={link.icon}
                    onClick={() => history.push('/credit/reload/new/reports')}
                    active={location.pathname === '/credit/reload/new/reports'}
                  />
                  <Link
                    key={'All'}
                    label="Processed"
                    leftSection={link.icon}
                    onClick={() => history.push('/credit/reload/processed/reports')}
                    active={location.pathname === '/credit/reload/processed/reports'}
                  />
                </Link>
              </li>
            ) : link.name === 'Transports' ? (
              <li key={link.name}>
                <Link
                  label={link.name}
                  leftSection={link.icon}
                  childrenOffset={28}
                > 
                  <Link 
                    key={'List'}
                    onClick={() => history.push('/transports')}
                    label="Transports List" 
                    leftSection={link.icon}
                  />
                  <Link
                    key={'Passbook'}
                    onClick={() => history.push('/transports/fastag/details')}
                    label="Passbook"
                    leftSection={link.icon}
                  />
                </Link>
              </li>
            ) : link.name === 'Report' ? (
              <li key={'Reports'}>
                <Link
                  label="Report"
                  leftSection={link.icon}
                  childrenOffset={28}
                >
                  {permissionCheck(currentUser.role_name, rulesList.opportunity_report) && (
                    <Link
                      key={'projection'}
                      onClick={() => history.push('/reports/opportunities')}
                      label="Opportunity Report"
                      leftSection={link.icon}
                    />
                  )}
                  
                  <Link
                    key={'LosLms'}
                    onClick={() => history.push('/report/dpd')}
                    label="DPD Report"
                    leftSection={link.icon}
                  />
                </Link>
              </li>
            ) : link.name === 'Passbook' ? (
              <li key={link.name}>
                <Link
                  label={link.name}
                  leftSection={link.icon}
                  childrenOffset={28}
                >
                  <Link
                    key={'LosLms'}
                    label="Dealer Passbook"
                    leftSection={link.icon}
                    onClick={() => history.push('/passbook')}
                  />
                  <Link
                    key={'LosLms'}
                    label="Transport Passbook"
                    leftSection={link.icon}
                    onClick={() => history.push('/transport/fastag/details')}
                  />
                </Link>  
              </li>
            ) : null}
          </>
        )
      })} */}

      {navLinks.map((link, i) => {
        return (
          <ListItem
            key={link.name + i}
            styles={{
              itemWrapper: {
                width: '100%'
              },
              itemLabel: {
                width: '100%'
              },
            }}
          >
            <Link
              label={link.name}
              leftSection={link.icon}
              p={0}
              onClick={() => history.push(link.href)}
              active={location.pathname === link.href}
              childrenOffset={28}
            >
              {link.links?.map((subLinks, index) => {
                return (
                  <Link
                    key={index}
                    onClick={() => history.push(subLinks.href)}
                    label={subLinks.name}
                    leftSection={subLinks.icon}
                    active={location.pathname === subLinks.href}
                  />
                )
              })}
            </Link>
          </ListItem>
        )
      })}

      <ListItem hiddenFrom="lg">
        <Link
          label="Logout"
          leftSection={<InputIcon />}
          onClick={logout}
        />
      </ListItem>
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