import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

export const NotificationSidebarWrapper = styled.aside`
    min-width: 100%;
    background: #FFFFFF;
    padding: 48px 24px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: scroll;
    transition: all 0.3s;
    margin-right: -100%;
    z-index: 110;

    @media(min-width: 768px) {
        min-width: 416px;
        max-width: 416px;
        box-shadow: -2px 0px 8px rgba(0, 0, 0, 0.13);
    }

    .notification-card {
        position: relative;
        padding: 24px 112px 24px 0;
        border-bottom: 1px solid #7D7D7D;
        cursor: pointer;

        span {
            display: block;
            color: #121212;
            font-size: 16px;
            line-height: 20px;

            i {
                position: absolute;
                top: 26px;
                right: 0;
                font-size: 11px;
                font-style: normal;
                line-height: 15px;
            }

            &.title {
                font-weight: 500;
                margin-bottom: 6px;
            }

            &.txt {
                color: #43414E;
                font-size: 13px;
                line-height: 16px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                /* autoprefixer: on */
                overflow: hidden;
            }
        }
    }

    .close-icon {
        position: absolute;
        top: 16px;
        right: 24px;
        cursor: pointer;
    }
    
    ${props => props.show && css`  
        margin-right: 0;
    `}
`;

const NotificationSidebar = ({
  showNotification= false ,
  closeButton= () => {}
}) => {
  return (
    <NotificationSidebarWrapper show={showNotification}>
      <CloseIcon className="close-icon" onClick={closeButton} />

      {[1,2,3,4,5].map((data, index) => {
        return (
          <div className="notification-card" key={index}>
            <span className="title">
              Notificaion Title
              <i>Yesterday, 12:20</i>
            </span>
            <span className="txt">New Loand request from this Dealership.</span>
          </div>
        );
      })}
    </NotificationSidebarWrapper>
  );
};

NotificationSidebar.propTypes = {
  showNotification: PropTypes.bool,
  closeButton: PropTypes.func
};

export default NotificationSidebar;
