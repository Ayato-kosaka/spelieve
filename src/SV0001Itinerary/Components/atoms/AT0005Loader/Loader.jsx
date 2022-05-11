import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';



const AT0005Loader = (props) => {
    return(
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )
}
export default AT0005Loader;