import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ffac42',
      main: '#f47b00',
      dark: '#ba4c00',
      contrastText: '#fff',
    },
    secondary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    grey: {
      light: '#efefef',
      main: '#bdbdbd',
      dark: '#8d8d8d',
    },
  },
});
export default theme;