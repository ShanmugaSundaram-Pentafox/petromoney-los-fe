import { createTheme, Button, Text, Title, Checkbox, TextInput } from '@mantine/core';

const defaultTheme = createTheme({
  fontSize: 12,
  white: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Poppins, sans-serif',
  black: '#323232',
  components: {
    Text: Text.extend({
      styles: ({
        root: { fontSize: 13, },
      }),
    }),
    Title: Title.extend({
      styles: ({
        root: { fontWeight: 600 },
      }),
    }),
    Checkbox: Checkbox.extend({
      styles: ({
        label: { fontSize: 13 },
      }),
    }),
    Button: Button.extend({
      styles: (theme, props) => ({
        label: {
          fontSize: props.size === 'md' || props.size === 'compact-md' ? theme.fontSizes.sm : undefined,
        },
        root: { fontSize: 13, },
      })
    }),
    TextInput: TextInput.extend({
      styles: (theme) => ({
        label: {
          color: theme.colors.gray[7],
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 4
        },
        input: {
          color: theme.colors.gray[9],
        },
        description: {
          marginTop: 4
        },
        error: {
          marginTop: 4
        }
      })
    })
  },
  dateFormat: 'DD/MM/YYYY',
  headings: {
    fontFamily: '\'Poppins\', \'Open Sans\', Roboto, sans-serif',
    fontWeight: 500,
    sizes: {
      h1: { fontSize: '30px', lineHeight: '35px' },
      h2: { fontSize: '1.5rem', lineHeight: '28px' },
      h3: { fontSize: '18px', lineHeight: '24px' },
      h4: { fontSize: '14px', lineHeight: '20px' },
      h5: { fontSize: '16px', lineHeight: '20px' },
      h6: { fontSize: '13px', lineHeight: '18px' },
    },
  },
});
// const theme = createTheme({
//   fontFamily: 'Poppins, Inter, Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
//   fontSize: 12,
//   components: {
//     Button: Button.extend({
//       styles: (theme, props) => ({
//         label: {
//           fontSize: props.size === 'md' || props.size === 'compact-md' ? theme.fontSizes.sm : undefined,
//         }
//       })
//     })
//   }
// });

export default defaultTheme;
