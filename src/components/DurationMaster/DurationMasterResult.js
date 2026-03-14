import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteConfirmationDailog from '../../utils/confirmDeletion';
import NotificationBar from '../notification/ServiceNotificationBar';
import DurationMasterToolbar from './DurationMasterToolbar';
import DurationMasterModule from './DurationMasterModule';
import { durationMasterCategory, durationMasterDelete } from '../../services/LoginPageService';

function DurationMasterResult() {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editDurationCategory, setEditDurationCategory] = useState(null);
    const [durationList, setDurationList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [deleteId, setDeleteId] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleEdit = useCallback((row) => {
        setIsAddButton(false);
        setEditDurationCategory(row);
        setOpen(true);
    }, []);

    const handleDelete = useCallback((row) => {
        setDeleteId(row.id);
        setDeleteDailogOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            {
                field: 'durationName',
                headerName: 'Duration Name',
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            // {
            //     field: 'durationValue',
            //     headerName: 'Duration Value',
            //     flex: 1,
            //     align: 'center',
            //     headerAlign: 'center',
            // },
            {
                field: 'months',
                headerName: 'Total Months',
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                flex: 1,
                align: 'center',
                headerAlign: 'center',
                getActions: (params) => [
                    <Tooltip title="Edit" key="edit">
                        <EditIcon
                            sx={{
                                color: '#1976d2',
                                cursor: 'pointer',
                                mx: 0.5,
                                transition: '0.2s',
                                '&:hover': { color: '#0d47a1', transform: 'scale(1.1)' },
                            }}
                            onClick={() => handleEdit(params.row)}
                        />
                    </Tooltip>,
                    <Tooltip title="Delete" key="delete">
                        <DeleteIcon
                            sx={{
                                color: '#d32f2f',
                                cursor: 'pointer',
                                mx: 0.5,
                                transition: '0.2s',
                                '&:hover': { color: '#b71c1c', transform: 'scale(1.1)' },
                            }}
                            onClick={() => handleDelete(params.row)}
                        />
                    </Tooltip>,
                ],
            },
        ],
        [handleEdit, handleDelete]
    );

    useEffect(() => {
        let active = true;
        setGridLoading(true);
        durationMasterCategory((dataObject) => {
            if (!active) return;
            setGridLoading(false);
            setDurationList(dataObject.data || []);
        }, () => {
            if (!active) return;
            setGridLoading(false);
        });
        return () => {
            active = false;
        };
    }, [refreshData]);

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message || 'Deleted successfully',
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => setDeleteDailogOpen(false), 2000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage || 'Deletion failed',
        });
        setTimeout(() => setDeleteDailogOpen(false), 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '90vh',
                backgroundColor: '#f4f6f8',
                p: 3,
            }}
        >
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <DurationMasterToolbar
                        setIsAddButton={setIsAddButton}
                        setEditDurationCategory={setEditDurationCategory}
                        setOpen={setOpen}
                        editDurationCategory={editDurationCategory}
                    />
                    <Box sx={{ height: 500, mt: 2 }}>
                        <DataGrid
                            rows={durationList}
                            columns={columns}
                            loading={isLoading}
                            getRowId={(row) => row.id}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 5, page: 0 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            disableRowSelectionOnClick
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
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                },
                            }}
                        />
                    </Box>

                    <DurationMasterModule
                        isAddButton={isAddButton}
                        editDurationCategory={editDurationCategory}
                        open={open}
                        setOpen={setOpen}
                        setRefreshData={setRefreshData}
                        openNotification={openNotification}
                        setNotification={setNotification}
                    />

                    <DeleteConfirmationDailog
                        open={deleteDailogOpen}
                        setOpen={setDeleteDailogOpen}
                        deleteId={deleteId}
                        deleteService={durationMasterDelete}
                        handleSuccess={deletehandleSuccess}
                        handleException={deletehandleException}
                    />

                    <NotificationBar
                        handleClose={handleClose}
                        notificationContent={openNotification.message}
                        openNotification={openNotification.status}
                        type={openNotification.type}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}

export default DurationMasterResult;
