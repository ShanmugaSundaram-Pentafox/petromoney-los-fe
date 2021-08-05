import { colors } from '@material-ui/core';
import palette from './palette';

export default {
  fontFamily: "'Nunito Sans', 'Open Sans', Roboto, sans-serif",
  fontWeightMedium: 600,
  h1: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '30px',
    // letterSpacing: '-0.24px',
    lineHeight: '35px'
  },
  h2: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '24px',
    // letterSpacing: '-0.24px',
    lineHeight: '28px'
  },
  h3: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '20px',
    // letterSpacing: '-0.06px',
    lineHeight: '24px'
  },
  h4: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '16px',
    // letterSpacing: '-0.06px',
    lineHeight: '20px'
  },
  h5: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '16px',
    // letterSpacing: '-0.05px',
    lineHeight: '20px'
  },
  h6: {
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: '14px',
    // letterSpacing: '-0.05px',
    lineHeight: '18px'
  },
  subtitle1: {
    color: palette.text.primary,
    fontSize: '14px',
    // letterSpacing: '-0.05px',
    lineHeight: '18px'
  },
  subtitle2: {
    color: palette.text.secondary,
    fontWeight: 400,
    fontSize: '14px',
    // letterSpacing: '-0.05px',
    lineHeight: '18px'
  },
  body1: {
    color: palette.text.primary,
    fontSize: '13px',
    // letterSpacing: '-0.05px',
    lineHeight: '18px'
  },
  body2: {
    color: colors.grey[900],
    fontSize: '12px',
    // letterSpacing: '-0.04px',
    lineHeight: '16px'
  },
  button: {
    color: palette.text.primary,
    fontSize: '14px'
  },
  caption: {
    color: palette.text.secondary,
    fontSize: '11px',
    // letterSpacing: '0.33px',
    lineHeight: '13px'
  },
  overline: {
    color: palette.text.secondary,
    fontSize: '11px',
    fontWeight: 600,
    // letterSpacing: '0.33px',
    lineHeight: '13px',
    textTransform: 'uppercase'
  }
};