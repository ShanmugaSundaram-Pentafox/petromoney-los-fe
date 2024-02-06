import { Avatar, Flex, Space, Text } from '@mantine/core';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const LoginUserInfoWrapper = styled.div`
    position: relative;

    .user-initials-wrapper {
      cursor: pointer;
      
      .caret {
        display: inline-block;
        width: 0;
        height: 0;
        color: #1f2937;
        border-top: 5px solid;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }
    }

    .header-dropdown {
      display: none;
      min-width: 152px;
      position: absolute;
      border-radius: 4px 0px 4px 4px;
      top: 100%;
      right: 4px;
      background: #1f2937;
      box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
      padding: 10px 0;
      margin-top: 16px;

      &:before {
        content: '';
        height: 0;
        width: 0;
        border-left: 16px solid transparent;
        border-bottom: 14px solid #1f2937;
        position: absolute;
        bottom: 100%;
        right: 0;
      }

      span {
        color: #FFFFFF;
        font-size: 13px;
        display: block;
        padding: 6px 12px;
        transition: all .4s ease;
        cursor: pointer;

        &:hover {
          padding-left: 16px; 
        }
      }
    }

    ${props => props.open && css`
      .header-dropdown {
        display: block;
      }
    `}
`;
export const LoginUserInfo = ({
  user,
  logout
}) => {
  const [show, setShow] = useState();
  let ref = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (!ref.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  });
  return (
    <LoginUserInfoWrapper open={show} ref={ref} onClick={() => setShow(!show)}>
      <Flex align="center" className="user-initials-wrapper">
        <Text size="md" fw="600">
          {user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1).toLowerCase()}
        </Text>
        <Space w="6" />

        {/* user initials avatar */}
        <Avatar src={null} color="cyan" size="sm" radius="xl">
          {user.first_name?.substring(0, 2)}
        </Avatar>
        <Space w="6" />
        <i className="caret"></i>
      </Flex>

      <div className="header-dropdown">
        <RouterLink to={'/profile'}><span>Profile</span></RouterLink>
        <span onClick={logout} onKeyDown={logout}>Logout</span>
      </div>
    </LoginUserInfoWrapper>
  );
};

LoginUserInfo.propTypes = {
  open: PropTypes.bool
};

export default LoginUserInfo;