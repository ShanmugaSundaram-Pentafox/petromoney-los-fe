import { Box, Title, Text } from '@mantine/core';
import React from 'react';
import LoginForm from './loginForm';
import classes from './loginNew.module.css';
const packageJson = require('../../../package.json');

const LoginNew = () => {
  return (
    <Box className={classes.root}>
      <Box className={classes.text_content}>
        <Title className={classes.title_text}>LOS</Title>
        <Text size='xs' className={classes.ver_text}>
          <strong>v{packageJson.version}</strong>
        </Text>
      </Box>
      <LoginForm />
    </Box>
  );
};

export default LoginNew;
