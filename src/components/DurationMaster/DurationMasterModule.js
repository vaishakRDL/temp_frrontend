import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { durationMasterAdd, durationMasterEdit } from '../../services/LoginPageService';

const DurationMasterModule = ({ open, setOpen, isAddButton, editDurationCategory, setRefreshData, setNotification }) => {
    const [durationName, setDurationName] = useState('');
    const [durationValue, setDurationValue] = useState('');
    const [durationMonths, setDurationMonths] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        if (editDurationCategory && !isAddButton) {
            setId(editDurationCategory.id);
            setDurationName(editDurationCategory.durationName || '');
            setDurationMonths(editDurationCategory.months || '');
        } else {
            setId('');
            setDurationName('');
            setDurationMonths('');
        }
    }, [editDurationCategory, isAddButton, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            durationName,
            months: Number(durationMonths)
        };

        if (isAddButton) {
            durationMasterAdd(payload, handleSuccess, handleException);
        } else {
            durationMasterEdit({ ...payload, id }, handleSuccess, handleException);
        }
    };

    const handleSuccess = (res) => {
        setNotification({
            status: true,
            type: 'success',
            message: res.message || 'Success',
        });
        setOpen(false);
        setTimeout(() => {
            handleClose();
        }, 3000);
        setRefreshData((oldvalue) => !oldvalue);
    };

    const handleException = (err, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage || 'An error occurred',
        });
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '40%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle sx={{ letterSpacing: '1px', textAlign: 'center', fontSize: " 22px" }}>
                {isAddButton ? 'Add Duration' : 'Edit Duration'}
            </DialogTitle>
            <DialogContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md -space-y-px">
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={12} sm={12} md={4} lg={6} xl={6}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="Duration Name"
                                    type="text"
                                    value={durationName}
                                    variant="outlined"
                                    placeholder="e.g. Monthly"
                                    fullWidth
                                    required
                                    onChange={(e) => setDurationName(e.target.value)}
                                    autoComplete="off"
                                />
                            </Grid>
                            {/* 
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="Duration Value"
                                    type="text"
                                    value={durationValue}
                                    variant="outlined"
                                    placeholder="e.g. monthly"
                                    fullWidth
                                    required
                                    onChange={(e) => setDurationValue(e.target.value)}
                                    autoComplete="off"
                                />
                            </Grid> */}

                            <Grid item xs={12} sm={12} md={4} lg={6} xl={6}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="Total Months"
                                    type="number"
                                    value={durationMonths}
                                    variant="outlined"
                                    placeholder="e.g. 1"
                                    fullWidth
                                    required
                                    onChange={(e) => setDurationMonths(e.target.value)}
                                    autoComplete="off"
                                />
                            </Grid>
                        </Grid>

                        <div className="rounded-md -space-y-px float-right">
                            <Button type="submit">
                                {isAddButton ? 'Add' : 'Update'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DurationMasterModule;
