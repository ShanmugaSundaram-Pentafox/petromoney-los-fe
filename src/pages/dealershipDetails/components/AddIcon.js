import { Menu, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useState } from 'react';

const options = [
  'Add Dealer',
  'Add Co-Applicants',
  'Add Guarantor'
];

const AddIconButton = ({ onClickAddMenu }) => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleMenuItemClick = (event, index, type) => {
    setSelectedIndex(index);
    onClickAddMenu(type)
  };

  return (
    <Menu
      shadow="md"
      width={180}
      position="bottom-end"
      withArrow
      transitionProps={{ transition: 'rotate-left', duration: 150 }}
    >
      <Menu.Target>
        <Button size='xs' leftSection={<IconPlus size={16} />}>
          Add
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {options.map((option, index) => (
          <Menu.Item
            key={option}
            onClick={(event) => {
              const text = event.target.textContent === 'Add Dealer' ? 'DEALER' : event.target.textContent === 'Add Guarantor' ? 'GUARANTOR' : 'COAPPLICANT'
              handleMenuItemClick(event, index, text)
            }}
          >
            {option}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export default AddIconButton;