import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    FormControlLabel,
    Switch,
    Typography,
    Divider,
    Box,
    Paper
} from '@mui/material';
import { AccessProfileAdd } from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';

const AccessProfileModal = ({ open, setOpen, setRefreshData }) => {
    const [profileName, setProfileName] = useState('');
    const [permissions, setPermissions] = useState({
        dashboard: false,
        user: false,
        scada: false,
        changePassword: false,
        location: false,
        device: false,
        masters: false,
        settings: false,
        sensorLog: false,
    });

    const [notification, setNotification] = useState({
        status: false,
        type: '',
        message: '',
    });

    const handlePermissionChange = (event) => {
        setPermissions({
            ...permissions,
            [event.target.name]: event.target.checked
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Transform boolean values to "1" or "" strings
        const formattedPermissions = Object.keys(permissions).reduce((acc, key) => {
            acc[key] = permissions[key] ? "1" : "";
            return acc;
        }, {});

        const payload = {
            accessProfile: profileName,
            ...formattedPermissions
        };

        AccessProfileAdd(payload, handleSuccess, handleError);
    };

    const handleSuccess = (data) => {
        setNotification({ status: true, type: 'success', message: 'Profile added successfully' });
        setRefreshData(old => !old);
        setTimeout(() => {
            setOpen(false);
            setProfileName('');
            setNotification({ status: false, type: '', message: '' });
            resetPermissions();
        }, 1500);
    };

    const resetPermissions = () => {
        setPermissions({
            dashboard: false,
            user: false,
            scada: false,
            changePassword: false,
            location: false,
            device: false,
            masters: false,
            settings: false,
            sensorLog: false,
            profileMaster: false,
            customer: false
        });
    }

    const handleCancel = () => {
        setOpen(false);
        setProfileName('');
        setNotification({ status: false, type: '', message: '' });
        resetPermissions();
    };

    const handleError = (error) => {
        setNotification({ status: true, type: 'error', message: 'Failed to add Plans' });
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ pb: 1, backgroundColor: '#f9fafb', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#111827' }}>
                    Add Plans
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, color: '#111827', fontWeight: 'bold' }}>
                                Profile Details
                            </Typography>
                            <TextField
                                fullWidth
                                label="Profile Name"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                required
                                placeholder="e.g. Site Manager"
                                variant="outlined"
                                size="small"
                                sx={{ backgroundColor: '#fff' }}
                            />
                        </Grid>

                        {/* <Grid item xs={12}>
                            <Divider />
                        </Grid> */}

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#111827', fontWeight: 'bold' }}>
                                Module Permissions
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9fafc' }}>
                                <Grid container spacing={2}>
                                    {Object.keys(permissions).map((key) => (
                                        <Grid item xs={12} sm={6} md={4} key={key}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#2196f3',
                                                        backgroundColor: '#f5f9ff',
                                                        boxShadow: '0 2px 5px rgba(33, 150, 243, 0.15)'
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Typography>
                                                <Switch
                                                    checked={permissions[key]}
                                                    onChange={handlePermissionChange}
                                                    name={key}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                color="inherit"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!profileName}
                            >
                                Create Profile
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <NotificationBar
                openNotification={notification.status}
                type={notification.type}
                notificationContent={notification.message}
                handleClose={() => setNotification({ status: false, type: '', message: '' })}
            />
        </Dialog>
    );
};

export default AccessProfileModal;
