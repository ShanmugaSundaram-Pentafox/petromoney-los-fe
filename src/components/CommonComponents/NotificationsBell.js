import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const highlightCircle = () => keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(249, 178, 51, 0.6); 
    }
    70% {
        box-shadow: 0 0 0 8px transparent; 
    }
    100% {
        box-shadow: 0 0 0 0 transparent;    
    } 
`;

const NotificationsBellWrapper = styled.span`
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    padding: 8px;
    cursor: pointer;

    &:hover {
        background-color: rgba(221, 221, 221, .8);
    }

    &:before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        right: 10px;
        top: 8px;
        display: block;
        background-color: #f9b233;
        border-radius: 100%;
        background-clip: padding-box;
        box-shadow: 0 0 0 0 rgba(249, 178, 51, 0.6);
        animation: ${highlightCircle} 2s;
        -webkit-animation: ${highlightCircle} 2s 300ms 0 ease;
        animation-iteration-count: infinite;
    }
`;

export const NotificationsBell = ({
  action= () => {}
}) => {
  return (
    <NotificationsBellWrapper onClick={action}>
      <NotificationsIcon />
    </NotificationsBellWrapper>
  );
};

NotificationsBell.propTypes = {
  action: PropTypes.func
};

export default NotificationsBell;
