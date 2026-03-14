// import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import CustomerModal from './CustomerModalComponent';
// import { CustomerListToolbar } from './customer-list-toolbar';
// import { CustomerDelete, CustomerDeleteService, customerShowList, FetchCustomerService } from '../../services/LoginPageService';
// import NotificationBar from '../notification/ServiceNotificationBar';
// import ConfirmPassword from '../user/passwordConfirmComponent';
// import { Box, Card, CardContent } from '@mui/material';
// import DeleteConfirmationDailog from '../../utils/confirmDeletion';

// export function CustomerListResults() {
//   const columns = [

//     {
//       field: 'custId',
//       headerName: 'Customer Id',
//       width: 130,
//       headerAlign: 'center',
//       flex: 1,

//     },
//     {
//       field: 'customerName',
//       headerName: 'Customer Name',
//       width: 170,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',

//     },
//     // {
//     //   field: 'duration',
//     //   headerName: 'Duration',
//     //   width: 170,
//     //   headerAlign: 'center',
//     //   flex: 1,
//     //   align: 'center',

//     // },
//     {
//       field: 'renewalDate',
//       headerName: 'Renewal Date',
//       width: 170,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',

//     },
//     {
//       field: 'primaryNo',
//       headerName: 'Primary Phone No',
//       width: 170,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',

//     },
//     {
//       field: 'secondaryNo',
//       headerName: 'Secondary Phone No',
//       width: 170,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',

//     },
//     {
//       field: 'email',
//       headerName: 'Email Id',
//       width: 230,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',


//     },
//     {
//       field: 'alternativeEmail',
//       headerName: 'Alternative Email',
//       width: 230,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',


//     },
//     {
//       field: 'phoneNo',
//       headerName: 'Phone',
//       width: 120,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',
//     },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 160,
//       headerAlign: 'center',
//       flex: 1,
//       align: 'center',
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       width: 100,
//       cellClassName: 'actions',
//       disableClickEventBubbling: true,
//       getActions: (params) => [
//         <EditData selectedRow={params.row} />, <DeleteData selectedRow={params.row} />,
//       ],
//     },
//   ];

//   const [open, setOpen] = useState(false);
//   const [isAddButton, setIsAddButton] = useState(true);
//   const [editCustomer, setEditCustomer] = useState([]);
//   const [customerList, setCustomerList] = useState([]);
//   const [isLoading, setGridLoading] = useState(true);
//   const [deleteId, setDeleteId] = useState('');
//   const [password, setConfirmPassword] = useState('');
//   const [btnReset, setBtnReset] = useState(false);
//   const [refreshData, setRefreshData] = useState(false);
//   const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);

//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: 'error',
//     message: '',
//   });

//   const handleShowSuccess = (dataObject) => {
//     setGridLoading(false);
//     setCustomerList(dataObject.data);
//   };

//   const handleShowException = (errorObject) => {
//   };

//   useEffect(() => {
//     setGridLoading(true);
//     customerShowList(handleShowSuccess, handleShowException);
//   }, [refreshData]);



//   const deletehandleSuccess = (dataObject) => {
//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setRefreshData((oldvalue) => !oldvalue);
//   };

//   const deletehandleException = (errorObject, errorMessage) => {
//     setNotification({
//       status: true,
//       type: 'error',
//       message: errorMessage,
//     });
//   };

//   function EditData(props) {
//     return (
//       <EditIcon
//         style={{ cursor: 'pointer' }}
//         onClick={(event) => {
//           event.stopPropagation();
//           setIsAddButton(false);
//           setEditCustomer(props.selectedRow);
//           setOpen(true);
//         }}
//       />
//     );
//   }

//   function DeleteData(props) {
//     return (
//       <DeleteIcon
//         onClick={() => {
//           setDeleteId(props.selectedRow.id);
//           setDeleteDailogOpen(true)
//         }}
//         style={{ cursor: 'pointer' }}
//       />
//     );
//   }

//   const handleClose = () => {
//     setNotification({
//       status: false,
//       type: '',
//       message: '',
//     });
//   };

//   return (
//     <Box sx={{ width: '100%', height: '85vh' }}>
//       <Card className={'mt-[15px]'} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '12px' }}>
//         <CardContent className={'min-h-[550px]'} style={{ border: 'none', boxShadow: 'none' }}>

//           <div style={{ height: 400, width: '100%' }}>
//             <CustomerListToolbar
//               setIsAddButton={setIsAddButton}
//               setEditCustomer={setEditCustomer}
//               setOpen={setOpen}
//             />
//             <DataGrid
//               rows={customerList}
//               columns={columns}
//               pageSize={5}
//               loading={isLoading}
//               rowsPerPageOptions={[5]}
//               disableSelectionOnClick
//               sx={{
//                 '& .MuiDataGrid-footerContainer': {
//                   borderTop: 'none', // This removes the top line above pagination
//                 },
//                 border: 'none',
//                 // marginTop: '-14px'
//               }}
//             />
//             {/* <ConfirmPassword
//               open={btnReset}
//               passwordSubmit={passwordSubmit}
//               setConfirmPassword={setConfirmPassword}
//               setBtnReset={setBtnReset}
//             /> */}
//             <DeleteConfirmationDailog
//               open={deleteDailogOpen}
//               setOpen={setDeleteDailogOpen}
//               deleteId={deleteId}
//               deleteService={CustomerDelete}
//               handleSuccess={deletehandleSuccess}
//               handleException={deletehandleException}
//             />
//             <CustomerModal
//               isAddButton={isAddButton}
//               customerData={editCustomer}
//               open={open}
//               setOpen={setOpen}
//               setRefreshData={setRefreshData}
//             />
//             <NotificationBar
//               handleClose={handleClose}
//               notificationContent={openNotification.message}
//               openNotification={openNotification.status}
//               type={openNotification.type}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Grid, TextField, MenuItem, Card, CardContent, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Settings, Receipt, Payment, DateRange } from '@mui/icons-material';

import CustomerModal from './CustomerModalComponent';

import { CustomerListToolbar } from './customer-list-toolbar';
import {
  CustomerDelete,
  customerShowList,
  CustomerLockService,
  CustomerRenewalService
} from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';

import DeleteConfirmationDailog from '../../utils/confirmDeletion';

export function CustomerListResults() {
  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editCustomer, setEditCustomer] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [deleteId, setDeleteId] = useState('');
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [lockTarget, setLockTarget] = useState(null);

  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [renewalTarget, setRenewalTarget] = useState(null);
  const [renewalData, setRenewalData] = useState({
    po: '',
    amount: '',
    duration: '',
    date: ''
  });


  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  /* =======================
     Fetch Customer List
  ======================== */
  useEffect(() => {
    let active = true;
    setGridLoading(true);

    customerShowList(
      (data) => {
        if (!active) return;
        setCustomerList(data.data || []);
        setGridLoading(false);
      },
      () => {
        if (!active) return;
        setGridLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, [refreshData]);

  /* =======================
     Handlers
  ======================== */
  const handleEdit = useCallback((row) => {
    setIsAddButton(false);
    setEditCustomer(row);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((row) => {
    setDeleteId(row.id);
    setDeleteDailogOpen(true);
  }, []);

  const handleLockClick = useCallback((row) => {
    setLockTarget(row);
    setLockDialogOpen(true);
  }, []);

  const handleLockConfirm = useCallback(() => {
    if (!lockTarget) return;
    const newStatus = lockTarget.status === 1 ? 0 : 1;
    CustomerLockService({ id: lockTarget.id, status: newStatus }, (res) => {
      setNotification({
        status: true,
        type: 'success',
        message: res.message || `Customer ${newStatus === 'Locked' ? 'Locked' : 'Unlocked'} successfully`,
      });
      setRefreshData(prev => !prev);
      setLockDialogOpen(false);
    }, (error, message) => {
      setNotification({
        status: true,
        type: 'error',
        message: message || 'Failed to update customer status',
      });
      setLockDialogOpen(false);
    });
  }, [lockTarget]);

  const handleRenewalClick = useCallback((row) => {
    setRenewalTarget(row);
    setRenewalData({
      po: '',
      amount: '',
      duration: '',
      date: ''
    });
    setRenewalDialogOpen(true);
  }, []);

  const calculateRenewalDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleRenewalDataChange = (field, value) => {
    setRenewalData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'duration') {
        const months = { monthly: 1, quarterly: 3, yearly: 12 }[value] || 0;
        newData.date = calculateRenewalDate(months);
      }
      return newData;
    });
  };

  const handleRenewalConfirm = useCallback(() => {
    if (!renewalTarget) return;
    const payload = {
      id: renewalTarget.id,
      poDetails: renewalData.po,
      amount: renewalData.amount,
      duration: renewalData.duration,
      renewalDate: renewalData.date
    };

    CustomerRenewalService(payload, (res) => {
      setNotification({
        status: true,
        type: 'success',
        message: res.message || 'Customer renewed successfully',
      });
      setRefreshData(prev => !prev);
      setRenewalDialogOpen(false);
    }, (error, message) => {
      setNotification({
        status: true,
        type: 'error',
        message: message || 'Failed to renew customer',
      });
    });
  }, [renewalTarget, renewalData]);


  const handleCloseNotification = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setRefreshData((prev) => !prev);
  };

  const deletehandleException = (_, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  };

  /* =======================
     Columns (Memoized)
  ======================== */
  const columns = useMemo(
    () => [
      {
        field: 'custId',
        headerName: 'Customer Id',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'customerName',
        headerName: 'Customer Name',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'renewalDate2',
        headerName: 'Renewal Date',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'primaryNo',
        headerName: 'Primary Phone No',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'email',
        headerName: 'Email Id',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: params.value === 1 ? alpha('#d32f2f', 0.1) : alpha('#2e7d32', 0.1),
              color: params.value === 1 ? '#d32f2f' : '#2e7d32',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {params.value === 1 ? 'Locked' : 'Active'}
          </Box>
        )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        flex: 1.2,
        getActions: (params) => [
          <Tooltip title="Edit" key="edit">
            <EditIcon
              sx={{
                color: '#1976d2',
                cursor: 'pointer',
                mx: 0.5,
                transition: '0.2s',
                '&:hover': { color: '#0d47a1', transform: 'scale(1.1)' }
              }}
              onClick={() => handleEdit(params.row)}
            />
          </Tooltip>,
          <Tooltip title={params.row.status === 1 ? "Lock Already Active (Renew to Unlock)" : "Lock Customer"} key="lock">
            {params.row.status === 1 ? (
              <LockIcon
                sx={{
                  color: '#bdbdbd',
                  cursor: 'not-allowed',
                  mx: 0.5,
                }}
              />
            ) : (
              <LockOpenIcon
                sx={{
                  color: '#2e7d32',
                  cursor: 'pointer',
                  mx: 0.5,
                  transition: '0.2s',
                  '&:hover': { color: '#1b5e20', transform: 'scale(1.1)' }
                }}
                onClick={() => handleLockClick(params.row)}
              />
            )}
          </Tooltip>,
          <Tooltip title={params.row.status === 0 ? "Renewal Not Required" : "Renew Subscription"} key="renewal">
            <AutorenewIcon
              sx={{
                color: params.row.status === 0 ? '#bdbdbd' : '#9c27b0',
                cursor: params.row.status === 0 ? 'not-allowed' : 'pointer',
                mx: 0.5,
                transition: '0.2s',
                '&:hover': {
                  color: params.row.status === 0 ? '#bdbdbd' : '#7b1fa2',
                  transform: params.row.status === 0 ? 'none' : 'scale(1.1)'
                }
              }}
              onClick={() => params.row.status === 1 && handleRenewalClick(params.row)}
            />
          </Tooltip>,

          <Tooltip title="Delete" key="delete">

            <DeleteIcon
              sx={{
                color: '#d32f2f',
                cursor: 'pointer',
                mx: 0.5,
                transition: '0.2s',
                '&:hover': { color: '#b71c1c', transform: 'scale(1.1)' }
              }}
              onClick={() => handleDelete(params.row)}
            />
          </Tooltip>,
        ],
      },
    ],
    [handleEdit, handleDelete, handleLockClick]
  );

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
        {/* Header */}
        {/* <Box
          sx={{
            px: 3,
            py: 2,
            background: 'linear-gradient(90deg, #000000, #1f1f1f)',
            color: '#fff',
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Customer Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage and monitor customer records
          </Typography>
        </Box> */}

        <CardContent sx={{ p: 3 }}>
          <CustomerListToolbar
            setIsAddButton={setIsAddButton}
            setEditCustomer={setEditCustomer}
            setOpen={setOpen}
          />

          <Box sx={{ height: 500, mt: 2 }}>
            <DataGrid
              rows={customerList}
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
            />
          </Box>

          <DeleteConfirmationDailog
            open={deleteDailogOpen}
            setOpen={setDeleteDailogOpen}
            deleteId={deleteId}
            deleteService={CustomerDelete}
            handleSuccess={deletehandleSuccess}
            handleException={deletehandleException}
          />

          <Dialog
            open={lockDialogOpen}
            onClose={() => setLockDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: { borderRadius: '16px', p: 1 }
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
              {lockTarget?.status === 'Locked' ? (
                <LockOpenIcon sx={{ fontSize: 80, color: '#2e7d32' }} />
              ) : (
                <LockIcon sx={{ fontSize: 80, color: '#ed6c02' }} />
              )}
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {lockTarget?.status === 'Locked' ? 'Unlock Customer?' : 'Lock Customer?'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Are you sure you want to {lockTarget?.status === 'Locked' ? 'unlock' : 'lock'}
                <Box component="span" sx={{ fontWeight: 700, color: '#000', mx: 0.5 }}>
                  {lockTarget?.customerName}
                </Box>?
              </Typography>
              {lockTarget?.status !== 'Locked' && (
                <Typography variant="body2" sx={{ mt: 2, color: '#d32f2f', fontStyle: 'italic' }}>
                  This will restrict the customer's access until unlocked.
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, pt: 2 }}>
              <Button
                onClick={() => setLockDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderRadius: '10px',
                  px: 4,
                  color: '#555',
                  borderColor: '#ccc',
                  '&:hover': { borderColor: '#999', backgroundColor: '#f5f5f5' }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLockConfirm}
                variant="contained"
                sx={{
                  borderRadius: '10px',
                  px: 4,
                  backgroundColor: lockTarget?.status === 'Locked' ? '#2e7d32' : '#ed6c02',
                  '&:hover': {
                    backgroundColor: lockTarget?.status === 'Locked' ? '#1b5e20' : '#e65100',
                  }
                }}
              >
                {lockTarget?.status === 'Locked' ? 'Confirm Unlock' : 'Confirm Lock'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Renewal Dialog */}
          <Dialog
            open={renewalDialogOpen}
            onClose={() => setRenewalDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: '20px', p: 1 }
            }}
          >
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
              color: '#00bcd4',
              fontWeight: 700,
              fontSize: '1.25rem',
              textAlign: 'center',
              py: 2,
              mb: 2,
              borderRadius: '16px 16px 0 0'
            }}>
              Customer Renewal - {renewalTarget?.customerName}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="PO Details"
                    value={renewalData.po}
                    onChange={(e) => handleRenewalDataChange('po', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Receipt sx={{ color: '#00bcd4', mr: 1, fontSize: 20 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={renewalData.amount}
                    onChange={(e) => handleRenewalDataChange('amount', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Payment sx={{ color: '#00bcd4', mr: 1, fontSize: 20 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Duration"
                    value={renewalData.duration}
                    onChange={(e) => handleRenewalDataChange('duration', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                    }}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="New Renewal Date"
                    value={renewalData.date}
                    variant="outlined"
                    disabled
                    InputProps={{
                      startAdornment: <DateRange sx={{ color: '#00bcd4', mr: 1, fontSize: 20 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, pt: 2 }}>
              <Button
                onClick={() => setRenewalDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1,
                  color: '#555',
                  borderColor: '#ccc',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#999', backgroundColor: '#f5f5f5' }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenewalConfirm}
                variant="contained"
                disabled={!renewalData.po || !renewalData.amount || !renewalData.duration}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #183b52 0%, #0a2840 100%)',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
              >
                Confirm Renewal
              </Button>
            </DialogActions>
          </Dialog>

          <CustomerModal

            isAddButton={isAddButton}
            customerData={editCustomer}
            open={open}
            setOpen={setOpen}
            setRefreshData={setRefreshData}
          />

          <NotificationBar
            handleClose={handleCloseNotification}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />
        </CardContent>
      </Card>
    </Box>
  );
}