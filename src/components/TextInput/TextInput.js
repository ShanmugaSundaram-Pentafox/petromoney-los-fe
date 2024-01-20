import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import styled, { css } from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  align-items: ${props => props.top ? 'flex-start' : 'center'};
  justify-content: flex-end;
  flex-direction: ${props => props.direction ? 'column' : 'row'};

  .input-label {
    font-size: 12px;
    width: ${props => props.labelWidth ? props.labelWidth : '15'}%;
    margin-right: 8px;
    text-align: right;
    padding: 0;
    color: #242424;
    ${props => props.direction ? css`
      color: #444444;
      width: auto;
      text-align: left;
      font-weight: 600;
      ` : undefined}
  }

  .text-field {
    margin: 4px 0;
    background-color: #fff;
  }
`;

export const InputFieldWrapper = styled.div`
  display: flex;
  align-items: 'flex-start';
  justify-content: flex-end;
  flex-direction: column;
`;

export const InputLabel = styled.label`
  width: auto;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  padding: 4px 0;
  color: #242424;
`;

const useStyles = makeStyles((theme) => ({
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
}))
const TextInput = ({
  alignTop,
  direction,
  labelText,
  labelWidth,
  readOnly,
  placeholder,
  inputProps,
  onChange = () => null,
  money,
  date,
  select,
  number,
  ...restProps
}) => {
  const classes = useStyles()
  return (
    <InputWrapper direction={direction} top={alignTop} labelWidth={labelWidth}>
      {labelText ? <label className="input-label">{labelText}</label> : null}
      <TextField
        className={classes.number}
        fullWidth
        size="small"
        variant="outlined"
        type={number ? 'number' : 'string'}
        inputProps={{
          className: classes.input,
          readOnly,
          placeholder,
          ...inputProps
        }}
        back
        onChange={e => {
          const v = e?.target?.value;
          if (number && isNaN(parseFloat(Number(v)))) {
            return;
          }
          onChange(e);
        }}
        InputProps={{
          startAdornment: money && <InputAdornment position="start"><span style={{ fontFamily: 'sans-serif' }}>₹</span></InputAdornment>,
        }}
        select={select}
        SelectProps={{
          native: true,
        }}
        {...restProps}
      />
    </InputWrapper>
  )
}
export default TextInput