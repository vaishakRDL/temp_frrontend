import {
    Box,
    Button,
    Typography
} from '@mui/material';

export const AccessProfileToolbar = (props) => (
    <Box {...props}>
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1
            }}
        >
            <Typography
                sx={{ m: 1 }}
                variant="h4"
            >
                Plans
            </Typography>
            <Box sx={{ m: 1 }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={props.onAddClick}
                >
                    Add Plans
                </Button>
            </Box>
        </Box>
    </Box>
);

export default AccessProfileToolbar;