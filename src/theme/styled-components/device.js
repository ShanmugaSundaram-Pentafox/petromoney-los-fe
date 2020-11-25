const size = {
  xs: '767px', // 767px & below is mobile
  sm: '768px',
  md: '992px',
  lg: '1200px'
};

export const xs = () => `@media (max-width: ${size.xs})`;
export const sm = () => `@media (min-width: ${size.sm})`;
export const md = () => `@media (min-width: ${size.md})`;
export const lg = () => `@media (min-width: ${size.lg})`;
