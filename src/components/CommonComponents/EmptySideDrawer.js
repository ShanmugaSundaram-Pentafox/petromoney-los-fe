import { Flex, Text } from '@mantine/core';
import { IconCircleX } from '@tabler/icons-react';
import React from 'react';
import { RightSideDrawer } from '../Mantine/RightSideDrawer/RightSideDrawer';

const EmptySideDrawer = ({
  title, 
  callback
}) => {
  return (
    <RightSideDrawer
      opened
      onClose={callback}
      title={title}
    >
      <Flex direction="column" align="center" justify="center" className="grow h-full gap-2">
        <IconCircleX size={48} stroke={1} className="text-gray-300" />
        <Text c="gray.6" ta="center">No data found for this dealership <br />Please try again later</Text>
      </Flex>
    </RightSideDrawer>
  )
}

export default EmptySideDrawer