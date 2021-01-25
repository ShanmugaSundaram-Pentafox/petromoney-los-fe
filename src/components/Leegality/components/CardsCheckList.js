import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RadioButtonUncheckedRoundedIcon from '@material-ui/icons/RadioButtonUncheckedRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

const Card = styled.div`
  background-color: #fff;
  /* margin-bottom: 10px; */
  /* border-radius: 4px; */
  position: relative;
  box-shadow: 0 1px 3px -1px rgba(0,0,0,.2);
  cursor: pointer;
  transform: scale(1);
  transition: all 0.35s ease-in-out;

  &:hover {
    transform: scale(1.015);
    background-color: #c8e6c9;
  }

  .card-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;

const CardItem = ({ onChange, data }) => {
  const [checked, setChecked] = useState(false);

  const onPressItem = async () => {
    await setChecked(!checked);
    onChange(checked, data);
  }

  return (
    <Card onClick={onPressItem}>
      <div className="card-body">
        <Box pr={2}>
          <Avatar style={{ backgroundColor: '#fafafa' }}>
            {
              checked ? 
                <CheckCircleOutlineRoundedIcon style={{ color: 'green' }} />
                : <RadioButtonUncheckedRoundedIcon color="primary" />
            }
          </Avatar>
        </Box>
        <Box>
          <p><strong>{data.first_name} {data.last_name || ''}</strong></p>
          {data.email && <p><small>{data.email}</small></p>}
          {data.mobile && <p><small>{data.mobile}</small></p>}
        </Box>
      </div>
    </Card>
  )
}

const CardsCheckList = ({ data, onChange }) => {

  return (
    <Box>
      {
        data?.map((item, i) => {
          return (
            <CardItem
              key={`check-${i}`}
              data={item}
              onChange={onChange}
            />
          )
        })
      }
    </Box>
  )
}

export default CardsCheckList;