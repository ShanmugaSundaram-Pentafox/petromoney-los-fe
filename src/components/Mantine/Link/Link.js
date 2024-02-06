import { NavLink } from '@mantine/core'
import React from 'react';

export const Link = ({
  key,
  color,
  variant= 'filled',
  href,
  active,
  label,
  description,
  leftSection,
  rightSection,
  onClick, 
  disabled,
  childrenOffset,
  defaultOpened,
  children,
  visibleFrom
}) => {
  return (
    <NavLink
      key={key}
      color={color}
      variant={variant}
      href={href}
      active={active}
      label={label}
      description={description}
      leftSection={leftSection}
      rightSection={rightSection}
      onClick={onClick}
      // style={style}
      disabled={disabled}
      childrenOffset={childrenOffset}
      defaultOpened={defaultOpened}
      visibleFrom={visibleFrom}
      styles={{
        children: {
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }}
    >
      {children}
    </NavLink>    
  )
}