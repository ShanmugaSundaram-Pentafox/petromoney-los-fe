import React from 'react';
import NumberFormat from 'react-number-format';

const Currency = ({ value, ...props }) => (
  <NumberFormat
    prefix="₹"
    thousandSeparator
    displayType="text"
    decimalScale={2}
    {...props}
    value={Number(value || 0)}
  />
);

export default Currency;