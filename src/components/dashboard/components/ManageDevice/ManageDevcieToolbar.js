// import { Box, Fab, Stack, Typography, TextField, InputAdornment, Paper, Divider, Tooltip, IconButton, alpha } from '@mui/material'
// import React, { useRef, useState } from 'react'
// import AddIcon from '@mui/icons-material/Add';
// import DownloadIcon from '@mui/icons-material/Download';
// import UploadIcon from '@mui/icons-material/Upload';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import SearchIcon from '@mui/icons-material/Search';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { DeviceManagementStatus, DeviceManageService, DeviceModeStatus, SearchDevicesFetchService, UploadStandAloneXl } from '../../../../services/LoginPageService';
// import NotificationBar from '../../../notification/ServiceNotificationBar';
// import { DownloadManageDeviceService, DownloadStandAloneTemplate } from '../../../../services/DownloadCsvReportsService';
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { Menu, MenuItem } from "@mui/material";
// import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
// import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
// import ApplicationStore from '../../../../utils/localStorageUtil';


// function ManageDevcieToolbar(props) {
//     const { setRefreshData, projectId, setDeviceList, locationId, showNotification, onSearchChange } = props;
//     // const { Project } = props;
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const { userDetails } = ApplicationStore().getStorage('userDetails');

//     const handleSearchChange = (e) => {
//         const value = e.target.value;
//         setSearchTerm(value);
//         onSearchChange(value);
//     };

//     const handleRefresh = () => {
//         if (setRefreshData) {
//             setRefreshData(prev => !prev);
//         }
//     };


//     // Close menu
//     // const handleClose = () => {
//     //     setAnchorEl(null);
//     // };
//     // console.log("aqswdefr", props.showNotification)
//     // const [file, setFile] = useState(null);
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });
//     const handleAddMeter = () => {
//         const isSuperAdmin = userDetails?.userRole?.toLowerCase() === "superadmin";

//         if (locationId || isSuperAdmin) {
//             props.setIsAddButton(true);
//             props.setEditMdevice([]);
//             props.setOpen(true);
//         } else {
//             props.showNotification("error", "Please select a location before proceeding.");
//         }
//     };


//     const fileInputRef = useRef(null);

//     const handleItemImportSucess = (dataObject) => {
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//         setTimeout(() => {
//             handleClose();
//             // setOpen(false);
//         }, 2000);
//         setRefreshData((oldvalue) => !oldvalue);
//     }
//     const handleItemImportException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             handleClose();
//             // setOpen(false);
//         }, 2000);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };
//     const handleTemplateDownload = () => {
//         DownloadStandAloneTemplate(templateDownloadSuccess, templateDownloadException)
//     };
//     const templateDownloadSuccess = () => {

//     };

//     const handleException = (errorObject) => { }

//     const templateDownloadException = () => { }

//     const handleDownload = () => {
//         const selectedIds = props.deviceList
//             .filter((item) => item.selected === true)  // Filter the selected items
//             .map((data) => data.id);  // Extract only the ids of the selected items
//         DownloadManageDeviceService({
//             ids: selectedIds
//         }, handleDownloadSucess, handledownloadException)
//     };
//     const handleDownloadSucess = () => {
//         DeviceManageService({
//             project_id: projectId
//         }, handleSuccess, handleException);
//     };
//     const handleSuccess = (dataObject) => {
//         // setGridLoading(false);
//         // setMDeviceList(dataObject?.data || []);
//         setDeviceList(
//             (dataObject?.data || []).map((item) => ({
//                 ...item,
//                 selected: false, // Convert 1 to true, 0 to false
//             }))
//         );
//     };
//     const handledownloadException = () => {

//     };
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();

//             reader.onload = () => {
//                 if (reader.readyState === 2) {
//                     const fileData = reader.result;

//                     // Trigger the upload API call
//                     UploadStandAloneXl({
//                         file: fileData,
//                         project_id: projectId
//                     }, handleItemImportSucess, handleItemImportException);
//                 }
//             };

//             reader.readAsDataURL(file);
//         }
//     };

//     const handleUploadTemplate = () => {
//         // Trigger the file input click when the button is clicked
//         if (fileInputRef.current) {
//             fileInputRef.current.click();
//         }
//         handleClose();
//     };

//     const handleEnable = () => {
//         // Filter the selected items and extract their ids
//         const selectedIds = props.deviceList
//             .filter((item) => item.selected === true)  // Filter the selected items
//             .map((data) => data.id);  // Extract only the ids of the selected items

//         DeviceModeStatus({
//             selectAll: props.selectAll,  // Pass the selectAll state
//             deviceIds: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
//             mode: "Enable",  // motorStatus is set to "1"
//         }, statusSuccess, statusException);
//     };
//     const statusSuccess = (dataObject) => {
//         SearchDevicesFetchService({
//             locationId: props.locationId,
//         }, handleSuccess, handleException);
//         // setNotification({
//         //     status: true,
//         //     type: 'success',
//         //     message: dataObject.message,
//         // });
//     };

//     const statusException = (errorObject, errorMessage) => {

//     }
//     const handleDisable = () => {
//         // Filter the selected items and extract their ids
//         const selectedIds = props.deviceList
//             .filter((item) => item.selected === true)  // Filter the selected items
//             .map((data) => data.id);  // Extract only the ids of the selected items

//         DeviceModeStatus({
//             selectAll: props.selectAll,  // Pass the selectAll state
//             deviceIds: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
//             mode: "Disable",  // motorStatus is set to "1"
//         }, statusdisableSuccess, statusDisableException);
//     };
//     const statusdisableSuccess = (dataObject) => {
//         SearchDevicesFetchService({
//             locationId: props.locationId,
//         }, handleSuccess, handleException);
//         // setNotification({
//         //     status: true,
//         //     type: 'success',
//         //     message: dataObject.message,
//         // });
//     };

//     const statusDisableException = (errorObject, errorMessage) => {

//     };

//     return (
//         <Box sx={{ mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Typography variant="h4" sx={{ fontWeight: 600, color: '#051622', mr: 2 }}>
//                         Device Management
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: 'text.secondary', borderLeft: '2px solid #e0e0e0', pl: 2 }}>
//                         Configure and manage your inventory of physical devices
//                     </Typography>
//                 </Box>
//                 <Stack direction="row" spacing={1}>
//                     <Tooltip title="Actions">
//                         <IconButton
//                             onClick={handleClick}
//                             sx={{
//                                 color: '#051622',
//                                 backgroundColor: alpha('#051622', 0.05),
//                                 '&:hover': { backgroundColor: alpha('#051622', 0.1) }
//                             }}
//                         >
//                             <MoreVertIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Refresh Data">
//                         <IconButton onClick={handleRefresh} sx={{ color: '#051622' }}>
//                             <RefreshIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </Stack>
//             </Box>

//             <Paper
//                 elevation={0}
//                 sx={{
//                     p: 2,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 2,
//                     backgroundColor: '#fff',
//                     borderRadius: '12px',
//                     border: '1px solid #eef2f6',
//                     boxShadow: '0 2px 4px 0 rgba(0,0,0,0.02)'
//                 }}
//             >
//                 <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
//                     <TextField
//                         fullWidth
//                         size="small"
//                         placeholder="Search by Device Name or Tag..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon sx={{ color: 'text.secondary' }} />
//                                 </InputAdornment>
//                             ),
//                             sx: {
//                                 backgroundColor: '#f9fafb',
//                                 border: 'none',
//                                 '& fieldset': { border: 'none' },
//                                 borderRadius: '8px'
//                             }
//                         }}
//                         sx={{ maxWidth: 400 }}
//                     />
//                     <Divider orientation="vertical" flexItem />
//                     <Stack direction="row" spacing={1.5}>
//                         <Fab
//                             variant="extended"
//                             size="small"
//                             onClick={handleEnable}
//                             sx={{
//                                 backgroundColor: '#051622',
//                                 color: '#fff',
//                                 textTransform: 'none',
//                                 borderRadius: '8px',
//                                 px: 2,
//                                 height: 40,
//                                 boxShadow: 'none',
//                                 '&:hover': { backgroundColor: '#183b52', boxShadow: 'none' }
//                             }}
//                         >
//                             <PowerSettingsNewIcon sx={{ mr: 1, fontSize: 20 }} />
//                             Enable
//                         </Fab>

//                         <Fab
//                             variant="extended"
//                             size="small"
//                             onClick={handleDisable}
//                             sx={{
//                                 backgroundColor: '#fff',
//                                 color: '#051622',
//                                 border: '1px solid #eef2f6',
//                                 textTransform: 'none',
//                                 borderRadius: '8px',
//                                 px: 2,
//                                 height: 40,
//                                 boxShadow: 'none',
//                                 '&:hover': { backgroundColor: '#f9fafb', boxShadow: 'none' }
//                             }}
//                         >
//                             <SettingsPowerIcon sx={{ mr: 1, fontSize: 20 }} />
//                             Disable
//                         </Fab>

//                         <Fab
//                             variant="extended"
//                             size="small"
//                             onClick={handleAddMeter}
//                             sx={{
//                                 backgroundColor: '#051622',
//                                 color: '#fff',
//                                 textTransform: 'none',
//                                 borderRadius: '8px',
//                                 px: 2,
//                                 height: 40,
//                                 boxShadow: 'none',
//                                 '&:hover': { backgroundColor: '#183b52', boxShadow: 'none' }
//                             }}
//                         >
//                             <AddIcon sx={{ mr: 1, fontSize: 20 }} />
//                             Add Device
//                         </Fab>
//                     </Stack>
//                 </Box>
//             </Paper>

//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: '12px',
//                         mt: 1,
//                         boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
//                         border: '1px solid #f0f2f5'
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleDownload} sx={{ py: 1.5, px: 2 }}>
//                     <DownloadIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
//                     <Typography variant="body2">Download List</Typography>
//                 </MenuItem>
//                 <MenuItem onClick={handleTemplateDownload} sx={{ py: 1.5, px: 2 }}>
//                     <ArrowDownwardIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
//                     <Typography variant="body2">Download Template</Typography>
//                 </MenuItem>
//                 <MenuItem onClick={handleUploadTemplate} sx={{ py: 1.5, px: 2 }}>
//                     <UploadIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
//                     <Typography variant="body2">Upload Data</Typography>
//                 </MenuItem>
//             </Menu>

//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//             />
//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />
//         </Box>
//     )
// }

// export default ManageDevcieToolbar
import { Box, Fab, Stack, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DeviceManagementStatus, DeviceManageService, DeviceModeStatus, SearchDevicesFetchService, UploadStandAloneXl } from '../../../../services/LoginPageService';
import NotificationBar from '../../../notification/ServiceNotificationBar';
import { DownloadManageDeviceService, DownloadStandAloneTemplate } from '../../../../services/DownloadCsvReportsService';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, IconButton } from "@mui/material";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import ApplicationStore from '../../../../utils/localStorageUtil';


function ManageDevcieToolbar(props) {
    const { setRefreshData, projectId, setDeviceList, locationId, showNotification } = props;
    // const { Project } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const { userDetails } = ApplicationStore().getStorage('userDetails');


    // Close menu
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // console.log("aqswdefr", props.showNotification)
    // const [file, setFile] = useState(null);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const handleAddMeter = () => {
        const isSuperAdmin = userDetails?.userRole?.toLowerCase() === "superadmin";

        if (locationId || isSuperAdmin) {
            props.setIsAddButton(true);
            props.setEditMdevice([]);
            props.setOpen(true);
        } else {
            props.showNotification("error", "Please select a location before proceeding.");
        }
    };


    const fileInputRef = useRef(null);

    const handleItemImportSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            // setOpen(false);
        }, 2000);
        setRefreshData((oldvalue) => !oldvalue);
    }
    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            handleClose();
            // setOpen(false);
        }, 2000);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const handleTemplateDownload = () => {
        DownloadStandAloneTemplate(templateDownloadSuccess, templateDownloadException)
    };
    const templateDownloadSuccess = () => {

    };

    const handleException = (errorObject) => { }

    const templateDownloadException = () => { }

    const handleDownload = () => {
        const selectedIds = props.deviceList
            .filter((item) => item.selected === true)  // Filter the selected items
            .map((data) => data.id);  // Extract only the ids of the selected items
        DownloadManageDeviceService({
            ids: selectedIds
        }, handleDownloadSucess, handledownloadException)
    };
    const handleDownloadSucess = () => {
        DeviceManageService({
            project_id: projectId
        }, handleSuccess, handleException);
    };
    const handleSuccess = (dataObject) => {
        // setGridLoading(false);
        // setMDeviceList(dataObject?.data || []);
        setDeviceList(
            (dataObject?.data || []).map((item) => ({
                ...item,
                selected: false, // Convert 1 to true, 0 to false
            }))
        );
    };
    const handledownloadException = () => {

    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    const fileData = reader.result;

                    // Trigger the upload API call
                    UploadStandAloneXl({
                        file: fileData,
                        project_id: projectId
                    }, handleItemImportSucess, handleItemImportException);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleUploadTemplate = () => {
        // Trigger the file input click when the button is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        handleClose();
    };

    const handleEnable = () => {
        // Filter the selected items and extract their ids
        const selectedIds = props.deviceList
            .filter((item) => item.selected === true)  // Filter the selected items
            .map((data) => data.id);  // Extract only the ids of the selected items

        DeviceModeStatus({
            selectAll: props.selectAll,  // Pass the selectAll state
            deviceIds: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
            mode: "Enable",  // motorStatus is set to "1"
        }, statusSuccess, statusException);
    };
    const statusSuccess = (dataObject) => {
        SearchDevicesFetchService({
            locationId: props.locationId,
        }, handleSuccess, handleException);
        // setNotification({
        //     status: true,
        //     type: 'success',
        //     message: dataObject.message,
        // });
    };

    const statusException = (errorObject, errorMessage) => {

    }
    const handleDisable = () => {
        // Filter the selected items and extract their ids
        const selectedIds = props.deviceList
            .filter((item) => item.selected === true)  // Filter the selected items
            .map((data) => data.id);  // Extract only the ids of the selected items

        DeviceModeStatus({
            selectAll: props.selectAll,  // Pass the selectAll state
            deviceIds: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
            mode: "Disable",  // motorStatus is set to "1"
        }, statusdisableSuccess, statusDisableException);
    };
    const statusdisableSuccess = (dataObject) => {
        SearchDevicesFetchService({
            locationId: props.locationId,
        }, handleSuccess, handleException);
        // setNotification({
        //     status: true,
        //     type: 'success',
        //     message: dataObject.message,
        // });
    };

    const statusDisableException = (errorObject, errorMessage) => {

    };

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
            <Typography sx={{ m: 1 }} variant="h5">
                Device Management
            </Typography>
            <Box sx={{ m: 1 }} >
                <Stack direction="row" spacing={2}>
                    {/* <IconButton onClick={handleClick}> */}
                    {/* <Fab
                        size="small"
                        color="primary"
                        aria-label="menu"
                        sx={{
                            backgroundColor: "#051622",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#183b52" },
                        }}
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </Fab> */}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleDownload}>
                            <DownloadIcon sx={{ mr: 1 }} />
                            Download
                        </MenuItem>
                        <MenuItem onClick={handleTemplateDownload}>
                            <ArrowDownwardIcon sx={{ mr: 1 }} />
                            Template Download
                        </MenuItem>
                        <MenuItem onClick={handleUploadTemplate}>
                            <UploadIcon sx={{ mr: 1 }} />
                            Upload Template
                        </MenuItem>
                    </Menu>

                    {/* Hidden file input for uploading */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />


                    <Fab variant="extended" size="small" color="primary" aria-label="add"
                        onClick={handleEnable} sx={{
                            backgroundColor: "#051622", color: "#ffff",
                            "&:hover": {
                                backgroundColor: "#183b52", // Change to your desired hover color
                            },
                        }}>
                        <PowerSettingsNewIcon sx={{ mr: 1 }} />
                        Enable
                    </Fab>



                    <Fab variant="extended" size="small" color="primary" aria-label="add"
                        onClick={handleDisable} sx={{
                            backgroundColor: "#051622", color: "#ffff",
                            "&:hover": {
                                backgroundColor: "#183b52", // Change to your desired hover color
                            },
                        }}>
                        <SettingsPowerIcon sx={{ mr: 1 }} />
                        Disable
                    </Fab>

                    <Fab variant="extended" size="small" color="primary"
                        aria-label="add"
                        onClick={handleAddMeter}
                        sx={{
                            backgroundColor: "#051622", color: "#ffff",
                            "&:hover": {
                                backgroundColor: "#183b52", // Change to your desired hover color
                            },
                        }}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add Device
                    </Fab>
                </Stack>

            </Box>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    )
}

export default ManageDevcieToolbar