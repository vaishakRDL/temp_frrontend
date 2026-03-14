// import React, { useState } from 'react';
// import { Box, Container } from '@mui/material';
// import AccessProfileModal from './AccessProfileModalComponent';
// import AccessProfileResult from './AccessProfileResult';
// import AccessProfileToolbar from './AccessProfileToolbar';

// const AccessProfileList = () => {
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [refreshData, setRefreshData] = useState(false);

//     return (
//         <Box
//             component="main"
//             sx={{
//                 flexGrow: 1,
//                 py: 8
//             }}
//         >
//             <Container maxWidth={false}>
//                 <AccessProfileToolbar onAddClick={() => setIsAddModalOpen(true)} />
//                 <Box sx={{ mt: 3 }}>
//                     <AccessProfileResult refreshData={refreshData} />
//                 </Box>
//             </Container>
//             <AccessProfileModal
//                 open={isAddModalOpen}
//                 setOpen={setIsAddModalOpen}
//                 setRefreshData={setRefreshData}
//             />
//         </Box>
//     );
// };

// export default AccessProfileList;
import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccessProfileModal from "./AccessProfileModalComponent";
import AccessProfileResult from "./AccessProfileResult";

const AccessProfileList = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #eef2f7 0%, #ffffff 100%)",
                py: 5
            }}
        >
            <Container
                maxWidth="xl"
                disableGutters   // 🔥 THIS removes left & right spacing
            >
                {/* 🔹 Header Section */}
                <Box
                    sx={{
                        mb: 5,
                        p: 4,
                        borderRadius: 4,
                        background: "linear-gradient(90deg, #212121 0%, #212121 100%)",
                        color: "#fff",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                Plans
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ opacity: 0.85, mt: 1 }}
                            >
                                Manage role-based permissions and system access control
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsAddModalOpen(true)}
                            sx={{
                                backgroundColor: "#fff",
                                color: "#1e3c72",
                                fontWeight: 600,
                                px: 3,
                                borderRadius: 3,
                                textTransform: "none",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                "&:hover": {
                                    backgroundColor: "#f1f5f9"
                                }
                            }}
                        >
                            Add plans
                        </Button>
                    </Stack>
                </Box>

                {/* 🔹 Table Section */}
                <AccessProfileResult refreshData={refreshData} />

            </Container>

            {/* 🔹 Modal */}
            <AccessProfileModal
                open={isAddModalOpen}
                setOpen={setIsAddModalOpen}
                setRefreshData={setRefreshData}
            />
        </Box>
    );
};

export default AccessProfileList;

