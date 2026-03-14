

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { MeterDeployDeleteService, FetchCustomerService, MeterDeployFetchService, Showtagdata, TagManageDelete } from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';
import { useUserAccess } from '../../context/UserAccessProvider';

import {
    Tabs, Tab, Typography, Box, InputLabel, MenuItem, FormControl, Select, Stack, Grid, styled,
} from '@mui/material';
import DeleteConfirmationDailog from '../../utils/confirmDeletion';
import AddTagToolbar from './AddTagToolbar';
import AddTagModel from './AddTagModel';

export function AddTaglistresult({ locationDetails, deviceList, locationId }) {

    // const { locationId, branchId, facilityId, buildingId, floorId, zoneId } = locationDetails;


    const columns = [
        {
            field: 'devCategory',
            headerName: 'Device Category',
            flex: 1,
            headerAlign: 'center',
            align: 'center'

        },
        {
            field: 'devName',
            headerName: 'Devcie Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'tagName',
            headerName: 'Tag Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'slaveId',
            headerName: 'Slave Id',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'jsonType',
            headerName: 'JSON Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'unitsName',
            headerName: 'Units',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'functions',
            headerName: 'Functions',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'tagDisplayName',
            headerName: 'Sensor Tag Display Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'minWarningAlert',
            headerName: 'Min Warning Alert',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'maxWarningAlert',
            headerName: 'Max Warning Alert',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'minOutRangeAlert',
            headerName: 'Out Of Range Min',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'maxOutRangeAlert',
            headerName: 'Out Of Range Max',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />, <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [edittag, setEditTag] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const moduleAccess = useUserAccess()('device');


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [deviceId, setDeviceId] = useState('');


    // const handleSuccess = (dataObject) => {
    //     setGridLoading(false);
    //     setCustomerList(dataObject.data);
    // };

    // const handleException = (errorObject) => {
    // };

    // useEffect(() => {
    //     setGridLoading(true);
    //     MeterDeployFetchService({
    //         locationId, branchId, facilityId, buildingId, floorId, zoneId, deviceId
    //     }, handleSuccess, handleException);
    // }, [refreshData]);

    // useEffect(() => {
    //     MeterDeployFetchService({
    //         locationId, branchId, facilityId, buildingId, floorId, zoneId, deviceId
    //     }, handleSuccess, handleException);
    // }, [locationId, branchId, facilityId, buildingId, floorId, zoneId, deviceId]);


    function EditData(props) {
        return (
            <EditIcon
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsAddButton(false);
                    setEditTag(props.selectedRow);
                    // setDeviceId(props.selectedRow.deviceid);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return moduleAccess.delete && (
            <DeleteIcon
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
            />
        );
    }

    const handleClose = () => {
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
        Showtagdata({ locationId }, handleSuccess, handleException);
    }, [refreshData, locationId]);


    const handleSuccess = (dataObject) => {
        setGridLoading(false);
        setCustomerList(dataObject?.data || [])

    }

    const handleException = () => {

    }

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
            >
            </Grid>


            <div style={{ height: 250, width: '100%' }}>
                <AddTagToolbar
                    setIsAddButton={setIsAddButton}
                    setEditTag={setEditTag}
                    setOpen={setOpen}
                    // locationDetails={locationDetails}

                    showNotification={showNotification}
                />
                <div style={{ height: '56vh', width: '100%', padding: 0 }}>

                    <DataGrid
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
                        rows={customerList}
                        columns={columns}
                        pageSize={10}
                        rowHeight={38}
                        loading={isLoading}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                    />
                </div>
                <AddTagModel
                    isAddButton={isAddButton}
                    editTag={edittag}
                    open={open}
                    setOpen={setOpen}
                    setRefreshData={setRefreshData}
                    locationId={locationId}

                // locationDetails={locationDetails}
                // deviceId={deviceId}  // Pass the deviceId to the dialog component

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
                    deleteService={TagManageDelete}
                    handleSuccess={deletehandleSuccess}
                    handleException={deletehandleException}
                />
            </div>
        </>
    );
}