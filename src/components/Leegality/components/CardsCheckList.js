import { Divider, Switch } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  container:{
    border: '1px dashed #ccc',
    borderRadius: 4,
    minWidth: 280,
    transition: '.2s',
    '&:hover': {
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
    }
  }
}))

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
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const [aadharSign, setAadharSign] = useState(true);
  const [virtualSign, setVirtualSign] = useState(true);
  const onPressItem = () => {
    onChange(!checked, data);
    setChecked(!checked);
  }
  const handleAadharSign = (event) => {
    setAadharSign(event.target.checked);
  };
  const handleVirtualSign = (event) => {
    setVirtualSign(event.target.checked)
  }

  return (
    <div style={{ display: 'flex', margin: 10 }}>
      <div className={classes.container}>
        <div className="card-body" onClick={onPressItem}>
          <div style={{display: 'flex', padding: 12, cursor: 'pointer'}}>
            <div>
              {
                checked ?
                  <CheckBoxOutlinedIcon style={{ color: green[300] }} />
                  : <CheckBoxOutlineBlankIcon color="primary" />
              }
            </div>
            <div style={{marginLeft: 10}}>
              <p><strong>{data.first_name} {data.last_name || ''}</strong></p>
              {data.email && <p><small>{data.email}</small></p>}
              {data.mobile && <p><small>{data.mobile}</small></p>}
            </div>
          </div>
        </div>
        {
          checked && (
            <div style={{display: 'flex', justifyContent: 'space-evenly', borderTop: '1px dashed #ccc'}}>
              <div className="toogle" style={{display:'flex', margin:'8px', alignItems: 'center'}}>
                <Switch
                  checked={aadharSign}
                  onChange={handleAadharSign}
                  size="small"
                  color="primary"
                  name="state"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <Typography style={{fontSize:'10px'}}>Aadhar Sign</Typography>
              </div>
              <Divider orientation="vertical" flexItem />
              <div style={{display:'flex',margin:'5px', alignItems: 'center'}}>
                <Switch
                  checked={virtualSign}
                  onChange={handleVirtualSign}
                  size="small"
                  color="primary"
                  name="state"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <Typography style={{fontSize:'10px'}} >Virtual Sign</Typography>
              </div>
            </div>
          )
        }
      </div>
      {/* {
        checked && (
          <div style={{ margin: '4px', border: '2px solid red'}}>
            <div className="toogle" style={{display:'flex',margin:'10px'}}>
              <Switch
                checked={aadharSign}
                onChange={handleAadharSign}
                size="small"
                color="primary"
                name="state"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <Typography style={{marginLeft:'8px',fontSize:'13px'}}>Aadhar Sign</Typography>
            </div>
            <div style={{display:'flex',margin:'10px'}}>
              <Switch
                checked={virtualSign}
                onChange={handleVirtualSign}
                size="small"
                color="primary"
                name="state"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <Typography style={{marginLeft:'8px',fontSize:'13px'}} >Virtual Sign</Typography>
            </div>
          </div>

        )
      } */}
    </div>
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