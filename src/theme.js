import { createTheme } from '@material-ui/core/styles';
import { purple, red, grey } from '@material-ui/core/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[900],
        },
        secondary: red,
    },
});
export default theme;