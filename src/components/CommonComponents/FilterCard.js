import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import Select, { components } from 'react-select'


const multiValueContainer = ({ selectProps, data }) => {
  const label = data.label;
  const allSelected = selectProps.value;
  const index = allSelected?.findIndex(selected => selected?.label === label);
  const isLastSelected = index === allSelected?.length - 1;
  const labelSuffix = isLastSelected ? '' : ', ';
  const val = `${label}${labelSuffix}`;
  return val;
};

const Option = (props) => {
  return (
    <components.Option {...props} >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label>&nbsp;{props.label}</label>
      </div>
    </components.Option>
  );
};

export const Selector = ({ options, value, setValue, title }) => {
  return (
    <>
      <Box style={{ width: 180 }}>
        <label style={{ color: 'hsl(0,0%,75%)' }}>{title}</label>
        <Select
          options={options}
          isMulti={true}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isClearable
          value={value}
          isSearchable={false}
          components={{
            MultiValueContainer: multiValueContainer,
            Option,
          }}
          onChange={(selectedOption, triggeredAction) => {
            if (triggeredAction?.action === 'clear') {
              setValue([{ value: 0, label: 'ALL' }])
            } else {
              setValue(selectedOption.filter(item => item.label !== 'ALL'))
            }
          }}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: 'hsl(0, 0%, 90%)',
              minHeight: 29,
              marginRight: 10,
              '&:hover': {
                boxShadow: 'none',
                minHeight: 29,
              },
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              maxHeight: '29px',
              padding: '0 6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'initial'
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              maxHeight: '29px',
              '> div': {
                padding: 5
              }
            }),
            indicatorContainer: (provided) => ({
              ...provided,
            })
          }}
        />
      </Box>
    </>
  )
}

export const filterStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'nowrap',
      }
    }
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    border: '1px solid hsl(0, 0%, 90%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    minHeight: 32,
    boxSizing: 'border-box',
    padding: '0 4px',
  },
  filterItem: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 2,
    padding: '2px 4px',
    minWidth: 50,
    textAlign: 'center',
    border: 'none',
    backgroundColor: 'hsl(0, 0%, 100%)',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      backgroundColor: 'hsl(0, 0%, 95%)',
    },
    '&.active': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
    '&.disabled': {
      backgroundColor: 'hsl(0, 0%, 80%)',
      padding: '4px 8px',
      marginTop: 6,
      borderRadius: 8,
    },
    '&:last-child': {
      marginRight: 0,
      '&::after': {
        display: 'none',
      }
    }
  },
}))