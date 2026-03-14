import { Box, Fab, Stack, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const DurationMasterToolbar = (props) => {
    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            <Typography
                sx={{ m: 1 }}
                variant="h5"
            >
                Duration Config
            </Typography>
            <Box
                sx={{ m: 1 }}
                onClick={() => {
                    props.setIsAddButton(true);
                    props.setEditDurationCategory(null);
                    props.setOpen(true);
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        variant="extended"
                        size="medium"
                        sx={{
                            backgroundColor: "#051622", color: "#ffff",
                            "&:hover": {
                                backgroundColor: "#183b52", 
                            },
                        }}
                    >
                        <AddIcon sx={{ mr: 1 }} />
                        Add Duration
                    </Fab>
                </Stack>
            </Box>
        </Box>
    );
};

export default DurationMasterToolbar;
