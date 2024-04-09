import { Avatar, Box, Flex, Menu, Space, Text } from '@mantine/core';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const LoginUserInfo = ({
  user,
  logout
}) => {
  const [show, setShow] = useState();
  const history = useHistory();
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
    <Box 
      visibleFrom="md"
      className="cursor-pointer"
      open={show} 
      ref={ref} 
      onClick={() => setShow(!show)}
      onKeyDown={() => setShow(!show)}
    >
      <Menu position="bottom-end" withArrow shadow="md" width={160}>
        <Menu.Target>
          <Flex align="center">
            <Text size="md" c="gray.7" fw="600">
              {user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1).toLowerCase()}
            </Text>
            <Space w="6" />

            {/* user initials avatar */}
            <Avatar src={null} color="blue" size="sm" radius="xl">
              {user.first_name?.substring(0, 2)}
            </Avatar>
          </Flex>
        </Menu.Target>

        <Menu.Dropdown p="8">
          <Menu.Item
            onClick={() => history.push('/profile')}
          >
            Profile
          </Menu.Item>
          <Space h="4" />
          <Menu.Item onClick={logout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
};

LoginUserInfo.propTypes = {
  open: PropTypes.bool
};

export default LoginUserInfo;