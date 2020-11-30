import React from 'react';
import styled, { css } from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const InputWrapper = styled.div`
  display: flex;
  align-items: ${props => props.top ? 'flex-start' : 'center'};
  justify-content: flex-end;
  flex-direction: ${props => props.direction ? 'column' : 'row'};

  .input-label {
    font-size: 13px;
    width: ${props => props.labelWidth ? props.labelWidth : "15"}%;
    margin-right: 8px;
    text-align: right;
    padding: 4px 0;
    color: #242424;
    ${props => props.direction ? css`
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

const TextInput = ({
  alignTop,
  direction,
  labelText,
  labelWidth,
  readOnly,
  placeholder,
  inputProps,
  onChange,
  money,
  ...restProps
}) => (
  <InputWrapper direction={direction} top={alignTop} labelWidth={labelWidth}>
    {labelText ? <label className="input-label">{labelText}</label> : null}
    <TextField
      className="text-field"
      fullWidth
      size="small"
      variant="outlined"
      inputProps={{
        readOnly,
        placeholder,
        ...inputProps
      }}
      back
      onChange={onChange}
      InputProps={{
        startAdornment: money && <InputAdornment position="start">₹</InputAdornment>,
      }}
      {...restProps}
      />
  </InputWrapper>
)

export default TextInput