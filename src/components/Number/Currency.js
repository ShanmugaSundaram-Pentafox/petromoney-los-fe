import { MantineProvider } from '@mantine/core';
import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';

const Currency = ({ value, ...props }) => {
  const amount = typeof value == 'string' ? parseInt(value?.replace(/,|₹/g, '')) : parseInt(value)
  return (
    <span style={{ fontFamily: 'sans-serif' }}>₹&nbsp;<span style={{ fontFamily: 'Poppins, sans-serif' }}>{Intl.NumberFormat('en-IN').format(Math.round(parseFloat(value) * 100) / 100) || 0}</span></span>
  );
};

export default Currency;

// <NumberFormat
//   prefix="₹ "
//   thousandSeparator
//   thousandsGroupStyle='lakh'
//   displayType="text"
//   decimalScale={2}
//   {...props}
//   value={Number(value || 0)}
// />

/**
* Returns a number in Indian numbering system as a String
*
* @param {Number/String} number The integer to be converted.
* @param {Number} decimals The number of digits needed after decimal point.
* @return {String} Converted number as a String in Indian numbering unit.
*/

export const ConvertCurrencyWithUnit = ({ amount = 0, decimalValues = 2 }) => {
  // handled the currency converter
  const convertCurrency = (number = amount, decimals = decimalValues, recursiveCall) => {
    const decimalPoints = decimals;
    const noOfLakhs = number / 100000;
    let displayStr;
    let isPlural;
    // Rounds off digits to decimalPoints decimal places
    function roundOf(integer) {
      return +integer.toLocaleString(undefined, {
        minimumFractionDigits: decimalPoints,
        maximumFractionDigits: decimalPoints,
      });
    }

    if (noOfLakhs >= 1 && noOfLakhs <= 99) {
      const lakhs = roundOf(noOfLakhs);
      isPlural = lakhs > 1 && !recursiveCall;
      displayStr = `${lakhs} Lakh${isPlural ? 's' : ''}`;
    } else if (noOfLakhs >= 100) {
      const crores = roundOf(noOfLakhs / 100);
      const crorePrefix = crores >= 100000 ? convertCurrency(crores, decimals, true) : crores;
      isPlural = crores > 1 && !recursiveCall;
      displayStr = `${crorePrefix} Cr${isPlural ? 's.' : ''}`;
    } else {
      displayStr = roundOf(number);
    }
    return displayStr
  }
  return (
    <span style={{ fontFamily: 'sans-serif' }}>₹&nbsp;<span style={{ fontFamily: 'Poppins, sans-serif' }}>{convertCurrency()}</span></span>
  )
}