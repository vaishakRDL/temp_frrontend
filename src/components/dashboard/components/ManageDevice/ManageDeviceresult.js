// import React, { useEffect, useState } from 'react'
// import { useUserAccess } from '../../../../context/UserAccessProvider';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import EditIcon from '@mui/icons-material/Edit';
// import NotificationBar from '../../../notification/ServiceNotificationBar';
// import DeleteConfirmationDailog from '../../../../utils/confirmDeletion';
// import { DataGrid } from '@mui/x-data-grid';
// import ManageDevcieToolbar from './ManageDevcieToolbar';
// import ManageDeviceModel from './ManageDeviceModel';
// import { Box, Card, CardContent, CardHeader, Checkbox, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Chip, alpha } from '@mui/material';
// import { DeviceDeleteService, DeviceManageDelete, DeviceManagementStatus, DeviceManageService, ProjectShowService, SearchDevicesFetchService } from '../../../../services/LoginPageService';
// import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
// import SensorsIcon from '@mui/icons-material/Sensors';
// import SettingsIcon from '@mui/icons-material/Settings';
// import ManageSensorDevice from './SensorDevice';
// import SensorDevice from './SensorDevice';
// import DeviceConfigModal from './DeviceConfigModal';

// function ManageDeviceresult({ locationId, }) {

//     const [selectAll, setSelectAll] = useState(false);
//     const columns = [
//         {
//             field: 'selected',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Select',
//             sortable: false,
//             width: 70,
//             align: 'center',
//             headerAlign: 'center',
//             renderHeader: () => (
//                 <Checkbox
//                     size="small"
//                     checked={selectAll}
//                     onChange={handleSelectAllChange}
//                     color="primary"
//                 />
//             ),
//             renderCell: (params) => (
//                 <Checkbox
//                     size="small"
//                     checked={params.row.selected || false}
//                     onChange={(e) => handleCheckboxChange(e, params.row.id)}
//                     color="primary"
//                 />
//             ),
//         },

//         {
//             field: 'deviceName',
//             headerName: 'Device Name',
//             minWidth: 150,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'deviceCategoryName',
//             headerName: 'Device Category',
//             minWidth: 130,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'deviceTag',
//             headerName: 'Device Tag',
//             description: 'This column has a value getter and is not sortable.',
//             sortable: false,
//             flex: 1,
//             align: 'center',
//             minWidth: 150,
//             headerAlign: 'center'
//         },

//         {
//             field: 'firmwareVersion',
//             headerName: 'Firm Ware',
//             description: 'This column has a value getter and is not sortable.',
//             sortable: false,
//             minWidth: 110,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'hardwareVersion',
//             headerName: 'H/W Model No.',
//             sortable: false,
//             minWidth: 120,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'deviceStatus',
//             headerName: 'Status',
//             minWidth: 120,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//             renderCell: (params) => {
//                 const isEnabled = params.value === 'enabled';
//                 return (
//                     <Chip
//                         label={isEnabled ? 'Enabled' : 'Disabled'}
//                         size="small"
//                         sx={{
//                             fontWeight: 600,
//                             backgroundColor: isEnabled ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1),
//                             color: isEnabled ? '#2e7d32' : '#d32f2f',
//                             border: `1px solid ${isEnabled ? alpha('#4caf50', 0.2) : alpha('#f44336', 0.2)}`,
//                         }}
//                     />
//                 );
//             }
//         },
//         {
//             field: 'actions',
//             type: 'actions',
//             headerName: 'Actions',
//             minWidth: 200,
//             flex: 1,
//             align: 'center',
//             cellClassName: 'actions',
//             disableClickEventBubbling: true,
//             getActions: (params) => [
//                 <EditData selectedRow={params.row} />,
//                 <DeleteData selectedRow={params.row} />,
//                 <ConfigData selectedRow={params.row} />,
//                 // <AppSettingsAltIconData selectedRow={params.row} />,
//             ],
//         },
//     ];

//     const handleCheckboxChange = (event, id) => {
//         const updatedRows = deviceList.map((row) =>
//             row.id === id ? { ...row, selected: event.target.checked } : row
//         );
//         setDeviceList(updatedRows);
//     };

//     const handleSelectAllChange = (event) => {
//         setSelectAll(event.target.checked);
//         const isChecked = event.target.checked;
//         const updatedRows = deviceList.map(row => {
//             return { ...row, selected: isChecked };
//         });
//         setDeviceList(updatedRows);
//     };


//     const handleEnable = () => {
//         // Filter the selected items and extract their ids
//         const selectedIds = deviceList
//             .filter((item) => item.selected === true)  // Filter the selected items
//             .map((data) => data.id);  // Extract only the ids of the selected items

//         DeviceManagementStatus({
//             selectAll: selectAll,  // Pass the selectAll state
//             ids: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
//             mode: "1",  // Mode is set to "1"
//         }, statusSuccess, statusException);
//     };
//     const statusSuccess = (dataObject) => {
//         // Handle the successful response here
//         DeviceManageService({
//             project_id: Project
//         }, handleSuccess, handleException);
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//     };

//     const statusException = (errorObject, errorMessage) => {

//     }
//     const handleDisable = () => {
//         // Filter the selected items and extract their ids
//         const selectedIds = deviceList
//             .filter((item) => item.selected === true)  // Filter the selected items
//             .map((data) => data.id);  // Extract only the ids of the selected items

//         DeviceManagementStatus({
//             selectAll: selectAll,  // Pass the selectAll state
//             ids: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
//             mode: "0",  // Mode is set to "1"
//         }, statusdisableSuccess, statusDisableException);
//     };
//     const statusdisableSuccess = (dataObject) => {
//         // Handle the successful response here
//         DeviceManageService({
//             project_id: Project
//         }, handleSuccess, handleException);
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//     };

//     const statusDisableException = (errorObject, errorMessage) => {

//     };
//     const [deviceList, setDeviceList] = useState([]);
//     const [centerLat, setCenterLat] = useState(23.500);
//     const [centerLng, setCenterLng] = useState(80.500);
//     // console.log("11111", centerLat, centerLng)

//     const [open, setOpen] = useState(false);
//     const [sensoropen, setSensorOpen] = useState(false);
//     const [isAddButton, setIsAddButton] = useState(true);
//     const [editMdevice, setEditMdevice] = useState([]);
//     const [MdeviceList, setMDeviceList] = useState([]);
//     // console.log("MdeviceListMdeviceList", MdeviceList)
//     const [ProjectList, setProjectList] = useState([]);
//     const [Project, setProject] = useState('');
//     const [isLoading, setGridLoading] = useState(true);
//     const [refreshData, setRefreshData] = useState(false);
//     const [deleteId, setDeleteId] = useState('');
//     const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//     const [configOpen, setConfigOpen] = useState(false);
//     const [selectedDevice, setSelectedDevice] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     // const moduleAccess = useUserAccess()('ManageDevice');
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });
//     // useEffect(() => {
//     //     DeviceManageService({
//     //         project_id: Project
//     //     }, handleSuccess, handleException);
//     //     ProjectShowService(handleProjectSuccess, handleProjectException);

//     // }, [refreshData, Project]);

//     const handleProjectSuccess = (dataObject) => {
//         // setGridLoading(false);
//         setProjectList(dataObject);
//     };
//     const handleProjectException = (errorObject) => {
//     };
//     // const handleSuccess = (dataObject) => {
//     //     setGridLoading(false);
//     //     // setMDeviceList(dataObject?.data || []);
//     //     setMDeviceList(
//     //         (dataObject?.data || []).map((item) => ({
//     //             ...item,
//     //             selected: false, // Convert 1 to true, 0 to false
//     //         }))
//     //     );
//     // };

//     // const handleException = (errorObject) => {
//     // };
//     function EditData(props) {
//         return (
//             <EditIcon
//                 style={{ cursor: 'pointer' }}
//                 onClick={(event) => {
//                     event.stopPropagation();
//                     setIsAddButton(false);
//                     setEditMdevice(props.selectedRow);
//                     // setProject(props.selectedRow.project_id);
//                     locationId ? (
//                         setOpen(true)
//                     ) : (
//                         showNotification("error", "Please select a Location before proceeding."))

//                 }}
//             />
//         )
//     };
//     function SensorData(props) {
//         return (
//             <SensorsIcon
//                 style={{ cursor: 'pointer' }}
//                 onClick={(event) => {
//                     event.stopPropagation();
//                     setIsAddButton(false);
//                     setEditMdevice(props.selectedRow);
//                     // setProject(props.selectedRow.project_id);
//                     setSensorOpen(true);

//                 }}
//             />
//         )
//     };
//     function DeleteData(props) {
//         return (
//             <DeleteIcon

//                 style={{ cursor: 'pointer' }}
//                 onClick={() => {
//                     setDeleteId(props.selectedRow.id);
//                     setDeleteDailogOpen(true)
//                 }}
//             />
//         );
//     };
//     function ConfigData(props) {
//         return (
//             <SettingsIcon
//                 style={{ cursor: 'pointer' }}
//                 onClick={(event) => {
//                     event.stopPropagation();
//                     setSelectedDevice(props.selectedRow);
//                     setConfigOpen(true);
//                 }}
//             />
//         );
//     };
//     const handleClose = () => {
//         setSensorOpen(false)
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     const showNotification = (type, message) => {
//         setNotification({
//             status: true,
//             type: type,
//             message: message,
//         });
//     };

//     const deletehandleSuccess = (dataObject) => {
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//         setRefreshData((oldvalue) => !oldvalue);
//         setTimeout(() => {
//             handleClose();
//             setDeleteDailogOpen(false);
//         }, 3000);
//     };

//     const deletehandleException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             handleClose();
//         }, 3000);
//     };


//     useEffect(() => {
//         SearchDevicesFetchService({
//             locationId,
//         }, handleSuccess, handleException);
//     }, [locationId, refreshData]);

//     const handleSuccess = (dataObject) => {
//         setGridLoading(false);
//         const data = dataObject?.data || [];
//         if (data.length > 0 && !Project) {
//             setProject(data[0].projectId || '');
//         }
//         setDeviceList(
//             data.map((item) => ({
//                 ...item,
//                 selected: false,
//             }))
//         );
//     };

//     const handleException = () => {
//     };

//     const filteredRows = React.useMemo(() => {
//         return deviceList.filter((row) => {
//             const searchStr = searchTerm.toLowerCase();
//             return (
//                 row.deviceName?.toLowerCase().includes(searchStr) ||
//                 row.deviceTag?.toLowerCase().includes(searchStr) ||
//                 row.deviceCategoryName?.toLowerCase().includes(searchStr)
//             );
//         });
//     }, [deviceList, searchTerm]);

//     return (
//         <Box sx={{ width: '100%', height: 'calc(100vh - 120px)', p: 3, backgroundColor: '#f5f7f9' }}>
//             <Card sx={{
//                 height: '90%',
//                 boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
//                 borderRadius: '16px',
//                 overflow: 'hidden',
//                 border: '1px solid #eef2f6'
//             }}>
//                 <CardContent sx={{
//                     height: '100%',
//                     p: 3,
//                     display: 'flex',
//                     flexDirection: 'column'
//                 }}>

//                     <ManageDevcieToolbar
//                         setIsAddButton={setIsAddButton}
//                         setEditMdevice={setEditMdevice}
//                         setOpen={setOpen}
//                         locationId={locationId}
//                         showNotification={showNotification}
//                         deviceList={deviceList}
//                         setDeviceList={setDeviceList}
//                         selectAll={selectAll}
//                         setSelectAll={setSelectAll}
//                         onSearchChange={(value) => setSearchTerm(value)}
//                         setRefreshData={setRefreshData}
//                         projectId={Project}
//                     />

//                     <Box sx={{
//                         flexGrow: 1,
//                         width: '100%',
//                         height: 480, // Fixed height for Grid
//                         '& .super-app-theme--header': {
//                             backgroundColor: '#f8f9fa',
//                             color: '#475467',
//                             fontWeight: 600,
//                         },
//                     }}>
//                         <DataGrid
//                             disableColumnMenu
//                             disableColumnFilter
//                             disableColumnSort
//                             sortModel={[]}
//                             sx={{
//                                 border: 'none',
//                                 backgroundColor: '#fff',
//                                 '& .MuiDataGrid-columnHeaders': {
//                                     backgroundColor: '#f8f9fa',
//                                     color: '#475467',
//                                     fontWeight: 600,
//                                     borderBottom: '1px solid #f0f2f5',
//                                 },
//                                 '& .MuiDataGrid-cell': {
//                                     borderBottom: '1px solid #f0f2f5',
//                                 },
//                                 '& .MuiDataGrid-row:hover': {
//                                     backgroundColor: '#f9fafb',
//                                 },
//                                 '& .MuiDataGrid-footerContainer': {
//                                     borderTop: 'none',
//                                 },
//                                 '& .MuiDataGrid-columnHeaderTitle': {
//                                     fontWeight: 700,
//                                     fontSize: '0.85rem',
//                                     letterSpacing: '0.5px',
//                                 }
//                             }}
//                             rows={filteredRows}
//                             columns={columns}
//                             pageSize={10}
//                             rowsPerPageOptions={[10, 25, 50]}
//                             pagination
//                             autoHeight={false}
//                             rowHeight={55}
//                             loading={isLoading}
//                             disableSelectionOnClick
//                         />
//                     </Box>
//                     {/* </div> */}
//                     <ManageDeviceModel
//                         isAddButton={isAddButton}
//                         editMdevice={editMdevice}
//                         open={open}
//                         setOpen={setOpen}
//                         setRefreshData={setRefreshData}
//                         //   locationDetails={locationDetails}
//                         projectId={Project}
//                         centerCoord={{ lat: centerLat, lng: centerLng }}
//                         locationId={locationId}

//                     />
//                     <NotificationBar
//                         handleClose={handleClose}
//                         notificationContent={openNotification.message}
//                         openNotification={openNotification.status}
//                         type={openNotification.type}
//                     />
//                     <DeleteConfirmationDailog
//                         open={deleteDailogOpen}
//                         setOpen={setDeleteDailogOpen}
//                         deleteId={deleteId}
//                         deleteService={DeviceDeleteService}
//                         handleSuccess={deletehandleSuccess}
//                         handleException={deletehandleException}
//                     />
//                     <DeviceConfigModal
//                         open={configOpen}
//                         onClose={() => setConfigOpen(false)}
//                         deviceData={selectedDevice}
//                     />
//                     <SensorDevice open={sensoropen} onClose={handleClose} selectedRow={editMdevice} />

//                 </CardContent>
//             </Card>
//         </Box >
//     )
// }

// export default ManageDeviceresult

import React, { useEffect, useState } from 'react'
import { useUserAccess } from '../../../../context/UserAccessProvider';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import NotificationBar from '../../../notification/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../../../utils/confirmDeletion';
import { DataGrid } from '@mui/x-data-grid';
import ManageDevcieToolbar from './ManageDevcieToolbar';
import ManageDeviceModel from './ManageDeviceModel';
import { Box, Card, CardContent, CardHeader, Checkbox, Fab, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DeviceDeleteService, DeviceManageDelete, DeviceManagementStatus, DeviceManageService, ProjectShowService, SearchDevicesFetchService } from '../../../../services/LoginPageService';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import SensorsIcon from '@mui/icons-material/Sensors';
import ManageSensorDevice from './SensorDevice';
import SensorDevice from './SensorDevice';
import DeviceConfigModal from './DeviceConfigModal';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ApplicationStore from '../../../../utils/localStorageUtil';


function ManageDeviceresult({ locationId, }) {
    const { userDetails } = ApplicationStore().getStorage('userDetails');

    const [selectAll, setSelectAll] = useState(false);
    const columns = [
        {
            field: 'selected',
            headerClassName: 'super-app-theme--header',
            headerName: '',
            sortable: false,
            width: 70,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
                <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    icon={<CheckBoxOutlineBlankIcon sx={{ color: '#ffffff' }} />}
                    checkedIcon={<CheckBoxIcon sx={{ color: '#ffffff' }} />}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected}
                    onChange={(e) => handleCheckboxChange(e, params.row.id)}
                    icon={<CheckBoxOutlineBlankIcon sx={{ color: '#000000' }} />}
                    checkedIcon={<CheckBoxIcon sx={{ color: '#000000' }} />}
                />
            ),
        },

        {
            field: 'deviceName',
            headerName: 'Device Name',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'deviceCategoryName',
            headerName: 'Device Category',
            minWidth: 130,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'deviceTag',
            headerName: 'Device Tag',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 1,
            align: 'center',
            minWidth: 150,
            headerAlign: 'center'
        },

        {
            field: 'firmwareVersion',
            headerName: 'Firm Ware',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            minWidth: 110,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'hardwareVersion',
            headerName: 'H/W Model No.',
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            flex: 1,
            align: 'center',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
                <ConfigData selectedRow={params.row} />,
                // <AppSettingsAltIconData selectedRow={params.row} />,
            ],
        },
    ];

    const handleCheckboxChange = (event, id) => {
        const updatedRows = deviceList.map((row) =>
            row.id === id ? { ...row, selected: event.target.checked } : row
        );
        setDeviceList(updatedRows);
    };

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const isChecked = event.target.checked;
        const updatedRows = deviceList.map(row => {
            return { ...row, selected: isChecked };
        });
        setDeviceList(updatedRows);
    };


    const handleEnable = () => {
        // Filter the selected items and extract their ids
        const selectedIds = deviceList
            .filter((item) => item.selected === true)  // Filter the selected items
            .map((data) => data.id);  // Extract only the ids of the selected items

        DeviceManagementStatus({
            selectAll: selectAll,  // Pass the selectAll state
            ids: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
            mode: "1",  // Mode is set to "1"
        }, statusSuccess, statusException);
    };
    const statusSuccess = (dataObject) => {
        // Handle the successful response here
        DeviceManageService({
            project_id: Project
        }, handleSuccess, handleException);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    };

    const statusException = (errorObject, errorMessage) => {

    }
    const handleDisable = () => {
        // Filter the selected items and extract their ids
        const selectedIds = deviceList
            .filter((item) => item.selected === true)  // Filter the selected items
            .map((data) => data.id);  // Extract only the ids of the selected items

        DeviceManagementStatus({
            selectAll: selectAll,  // Pass the selectAll state
            ids: selectedIds,  // Pass the ids array directly (e.g., [125, 126, 121, 122])
            mode: "0",  // Mode is set to "1"
        }, statusdisableSuccess, statusDisableException);
    };
    const statusdisableSuccess = (dataObject) => {
        // Handle the successful response here
        DeviceManageService({
            project_id: Project
        }, handleSuccess, handleException);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    };

    const statusDisableException = (errorObject, errorMessage) => {

    };
    const [deviceList, setDeviceList] = useState([]);
    const [centerLat, setCenterLat] = useState(23.500);
    const [centerLng, setCenterLng] = useState(80.500);
    // console.log("11111", centerLat, centerLng)

    const [open, setOpen] = useState(false);
    const [sensoropen, setSensorOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editMdevice, setEditMdevice] = useState([]);
    const [MdeviceList, setMDeviceList] = useState([]);
    // console.log("MdeviceListMdeviceList", MdeviceList)
    const [ProjectList, setProjectList] = useState([]);
    const [Project, setProject] = useState('');
    const [isLoading, setGridLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    // const moduleAccess = useUserAccess()('ManageDevice');
    const [configOpen, setConfigOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    // useEffect(() => {
    //     DeviceManageService({
    //         project_id: Project
    //     }, handleSuccess, handleException);
    //     ProjectShowService(handleProjectSuccess, handleProjectException);

    // }, [refreshData, Project]);

    const handleProjectSuccess = (dataObject) => {
        // setGridLoading(false);
        setProjectList(dataObject);
    };
    const handleProjectException = (errorObject) => {
    };
    // const handleSuccess = (dataObject) => {
    //     setGridLoading(false);
    //     // setMDeviceList(dataObject?.data || []);
    //     setMDeviceList(
    //         (dataObject?.data || []).map((item) => ({
    //             ...item,
    //             selected: false, // Convert 1 to true, 0 to false
    //         }))
    //     );
    // };

    // const handleException = (errorObject) => {
    // };
    function EditData(props) {
        return (
            <EditIcon
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsAddButton(false);
                    setEditMdevice(props.selectedRow);
                    // setProject(props.selectedRow.project_id);
                    locationId || userDetails?.userRole?.toLowerCase() === 'superadmin' ? (
                        setOpen(true)
                    ) : (
                        showNotification("error", "Please select a Location before proceeding."))

                }}
            />
        )
    };
    function SensorData(props) {
        return (
            <SensorsIcon
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsAddButton(false);
                    setEditMdevice(props.selectedRow);
                    // setProject(props.selectedRow.project_id);
                    setSensorOpen(true);

                }}
            />
        )
    };
    function DeleteData(props) {
        return (
            <DeleteIcon

                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true)
                }}
            />
        );
    };
    function ConfigData(props) {
        return (
            <SettingsIcon
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                    event.stopPropagation();
                    setSelectedDevice(props.selectedRow);
                    setConfigOpen(true);
                }}
            />
        );
    };

    const handleClose = () => {
        setSensorOpen(false)
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const showNotification = (type, message) => {
        setNotification({
            status: true,
            type: type,
            message: message,
        });
    };

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    };


    useEffect(() => {
        SearchDevicesFetchService({
            locationId,
        }, handleSuccess, handleException);
    }, [locationId, refreshData]);

    const handleSuccess = (dataObject) => {
        setGridLoading(false);
        setDeviceList(
            (dataObject?.data || []).map((item) => ({
                ...item,
                selected: false, // Convert 1 to true, 0 to false
            }))
        );
    };

    const handleException = () => {
    };

    return (
        <Box sx={{ width: '100%', height: '85vh', padding: '20px' }}>
            {/* <Card className={'mt-[15px]'} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '12px', paddingTop: '25px' }}> */}
            {/* <CardHeader

                /> */}
            <CardContent className={'min-h-[550px]'} style={{ border: 'none', marginTop: '-40px' }}>

                {/* <div style={{ height: 250, width: '100%' }}> */}

                <ManageDevcieToolbar
                    setIsAddButton={setIsAddButton}
                    setEditMdevice={setEditMdevice}
                    setOpen={setOpen}
                    locationId={locationId}
                    showNotification={showNotification}
                    deviceList={deviceList}
                    setDeviceList={setDeviceList}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                />
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex"
                >

                </Grid>
                <div style={{ height: '57.8vh', width: '100%', padding: 0 }}>

                    <DataGrid
                        disableColumnMenu
                        disableColumnFilter
                        disableColumnSort
                        sortModel={[]}
                        sx={{
                            border: 'none',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            '& .MuiDataGrid-columnHeaders': {
                                background: 'linear-gradient(90deg, #1a1a1a, #333)',
                                color: '#fff',
                                fontWeight: 600,
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid rgba(0,0,0,0.04)',
                                py: '8px',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: 'none',
                            },
                            // Apply colors based on deviceStatus
                            '& .enabled': {
                                backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.12)',
                                },
                            },
                            '& .disabled': {
                                backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.12)',
                                },
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                            }
                        }}
                        rows={deviceList}
                        columns={columns}
                        pageSize={10}
                        rowHeight={45}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        getRowClassName={(params) =>
                            params.row.deviceStatus === 'enabled' ? 'enabled' : 'disabled'
                        }
                    />
                    {/* </div> */}
                    <ManageDeviceModel
                        isAddButton={isAddButton}
                        editMdevice={editMdevice}
                        open={open}
                        setOpen={setOpen}
                        setRefreshData={setRefreshData}
                        //   locationDetails={locationDetails}
                        projectId={Project}
                        centerCoord={{ lat: centerLat, lng: centerLng }}
                        locationId={locationId}

                    />
                    <NotificationBar
                        handleClose={handleClose}
                        notificationContent={openNotification.message}
                        openNotification={openNotification.status}
                        type={openNotification.type}
                    />
                    <DeleteConfirmationDailog
                        open={deleteDailogOpen}
                        setOpen={setDeleteDailogOpen}
                        deleteId={deleteId}
                        deleteService={DeviceDeleteService}
                        handleSuccess={deletehandleSuccess}
                        handleException={deletehandleException}
                    />
                    <DeviceConfigModal
                        open={configOpen}
                        onClose={() => setConfigOpen(false)}
                        deviceData={selectedDevice}
                    />
                </div>
                <SensorDevice open={sensoropen} onClose={handleClose} selectedRow={editMdevice} />

            </CardContent>
            {/* </Card> */}
        </Box >
    )
}

export default ManageDeviceresult


