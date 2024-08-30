const COLORS = {
  white: 'rgba(255, 255, 255, 1)',
  black: 'rgba(55, 57, 63, 1)',
  background: 'rgba(235, 238, 243, 1)',
  border: {
    light: 'rgba(224, 224, 224, 1)'
  },
  primary: {
    dark: 'rgba(29, 74, 144, 1)',
    main: 'rgba(0, 99, 255, 1)',
    light1: 'rgba(228, 237, 253, 1)',
    light2: 'rgba(208, 230, 255, 1)'
  },
  success: 'rgba(52, 146, 95, 1)',
  warning: {
    main: 'rgba(250, 166, 25, 1)',
    dark: 'rgba(198, 143, 37, 1)',
    tableWarn: '#fff50036',
  },
  error: {
    main: 'rgba(255, 33, 22, 1)',
    light: 'rgba(255, 240, 240, 1)',
    dark: 'rgb(240, 99, 96)'
  },
  text: {
    main: 'rgba(55, 57, 63, 1)',
    light1: 'rgba(173, 174, 177, 1)',
    light2: ' rgba(143, 143, 143, 1)',
    blue: '#1976d2'
  },
  icon: {
    download: 'rgba(64, 192, 87)'
  },
  orange: function (opacity = 100) { return `rgb(253 126 20 / ${opacity}%)` },
  gray: function (opacity = 100) { return `rgba(55, 57, 63, ${opacity}%)` },
  blue: function (opacity = 100) { return `rgba(0, 99, 255, ${opacity}%)` },
  teal: function (opacity = 100) { return `rgba(52, 146, 95, ${opacity}%)` },
  red: function (opacity = 100) { return `rgba(255, 33, 22, ${opacity}%)` },
  green: function (opacity = 100) { return `rgba(64, 192, 87, ${opacity}%)` },
}

export default COLORS
