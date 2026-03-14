// import {
//     Box,
//     Card,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     Typography,
//     CircularProgress
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { AccessProfile } from '../../services/LoginPageService';

// const AccessProfileResult = ({ refreshData }) => {
//     const [profiles, setProfiles] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         fetchProfiles();
//     }, [refreshData]);

//     const fetchProfiles = () => {
//         setIsLoading(true);
//         AccessProfile(
//             (data) => {
//                 setProfiles(data.data || []);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error('Error fetching access profiles:', error);
//                 setIsLoading(false);
//             }
//         );
//     };

//     const renderPermissionIcon = (hasAccess) => {
//         if (hasAccess === true || hasAccess === 1 || hasAccess === 'enabled') {
//             return <CheckCircleIcon color="success" fontSize="small" />;
//         }
//         return <CancelIcon color="error" fontSize="small" sx={{ opacity: 0.5 }} />;
//     };

//     // Define the columns based on the user requirement
//     // "profile Name", "Dashboard", "User", "SCADA", etc.
//     // Assuming the API returns keys that map to these. 
//     // If keys are different, we might need to adjust mapAccessKey.
//     const columns = [
//         { label: 'Access Profile', key: 'accessProfile', width: '20%' },
//         { label: 'Dashboard', key: 'dashboard' },
//         { label: 'User', key: 'user' },
//         { label: 'SCADA', key: 'scada' },
//         { label: 'Change Password', key: 'changePassword' },
//         { label: 'Location', key: 'locationDetails' }, // Assuming location is locationDetails or similar
//         { label: 'Device', key: 'device' },
//         { label: 'Masters', key: 'masters' },
//         { label: 'Settings', key: 'settings' },
//         { label: 'Sensor Log', key: 'sensorLog' }
//     ];

//     return (
//         <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
//             <Box sx={{ minWidth: 1050, overflowX: 'auto' }}>
//                 {isLoading ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//                         <CircularProgress />
//                     </Box>
//                 ) : (
//                     <Table>
//                         <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                             <TableRow>
//                                 {columns.map((col, index) => (
//                                     <TableCell
//                                         key={col.key}
//                                         align={index === 0 ? 'left' : 'center'}
//                                         sx={{
//                                             fontWeight: 'bold',
//                                             textTransform: 'uppercase',
//                                             fontSize: '0.75rem',
//                                             color: '#555',
//                                             width: col.width || 'auto'
//                                         }}
//                                     >
//                                         {col.label}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {profiles.map((profile, index) => (
//                                 <TableRow hover key={profile.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                                     <TableCell>
//                                         <Typography
//                                             color="textPrimary"
//                                             variant="subtitle2"
//                                             sx={{ fontWeight: 600 }}
//                                         >
//                                             {profile.accessProfile}
//                                         </Typography>
//                                     </TableCell>
//                                     {columns.slice(1).map((col) => (
//                                         <TableCell key={col.key} align="center">
//                                             {renderPermissionIcon(profile[col.key])}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))}
//                             {profiles.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
//                                         <Typography variant="body2" color="textSecondary">
//                                             No access profiles found.
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 )}
//             </Box>
//         </Card>
//     );
// };

// export default AccessProfileResult;

import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { AccessProfile, AccessProfileManageListdata } from "../../services/LoginPageService";

const AccessProfileResult = ({ refreshData }) => {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfiles();
    }, [refreshData]);

    const fetchProfiles = () => {
        setIsLoading(true);
        AccessProfileManageListdata(
            (data) => {
                setProfiles(data?.data || []);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching access profiles:", error);
                setIsLoading(false);
            }
        );
    };
    const renderPermissionIcon = (value) => {
        const enabled = Number(value) === 1;

        return enabled ? (
            <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 22 }} />
        ) : (
            <CancelIcon sx={{ color: "#dc2626", fontSize: 22, opacity: 0.7 }} />
        );
    };


    const columns = [
        { label: "Access Profile", key: "accessProfile", minWidth: 200 },
        { label: "Dashboard", key: "dashboard" },
        { label: "User", key: "user" },
        { label: "SCADA", key: "scada" },
        { label: "Change Password", key: "changePassword" },
        { label: "Location", key: "location" }, // ✅ corrected
        { label: "Device", key: "device" },
        { label: "Masters", key: "masters" },
        { label: "Settings", key: "settings" },
        { label: "Sensor Log", key: "sensorLog" }
    ];

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <Card
                sx={{
                    width: "100%",
                    borderRadius: 3,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}
            >
                <TableContainer sx={{ overflowX: "auto" }}>
                    {isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 200
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table stickyHeader>

                            {/* HEADER */}
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableCell
                                            key={col.key}
                                            align={index === 0 ? "left" : "center"}
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: "0.85rem",
                                                backgroundColor: "#f8fafc",
                                                color: "#0f172a",
                                                borderBottom: "2px solid #e2e8f0",
                                                minWidth: col.minWidth || 120
                                            }}
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            {/* BODY */}
                            <TableBody>
                                {profiles.length > 0 ? (
                                    profiles.map((profile, index) => (
                                        <TableRow
                                            key={profile.id || index}
                                            sx={{
                                                transition: "0.2s ease",
                                                "&:nth-of-type(even)": {
                                                    backgroundColor: "#fafafa"
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#f1f5f9"
                                                }
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#1e293b"
                                                }}
                                            >
                                                {profile.accessProfile}
                                            </TableCell>

                                            {columns.slice(1).map((col) => (
                                                <TableCell key={col.key} align="center">
                                                    {renderPermissionIcon(profile[col.key])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            align="center"
                                            sx={{ py: 5 }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                No Plans found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    )}
                </TableContainer>
            </Card>
        </Box>
    );
};

export default AccessProfileResult;

