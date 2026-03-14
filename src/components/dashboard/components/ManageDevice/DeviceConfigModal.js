import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, Box, Typography,
    List, ListItemText, ListItemButton, Divider, Button,
    Zoom, Stack, IconButton, FormControl, alpha
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import RouterIcon from '@mui/icons-material/Router';
import TimerIcon from '@mui/icons-material/Timer';
import StorageIcon from '@mui/icons-material/Storage';
import LanIcon from '@mui/icons-material/Lan';
import InputIcon from '@mui/icons-material/Input';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import WifiIcon from '@mui/icons-material/Wifi';
import SdCardIcon from '@mui/icons-material/SdCard';
import LockIcon from '@mui/icons-material/Lock';
import BackupIcon from '@mui/icons-material/Backup';

// Sub-components
import RtuSettings from './subComponents/RtuSettings';
import CommonPollingInterval from './subComponents/CommonPollingInterval';
import CommonRegisterGroup from './subComponents/CommonRegisterGroup';
import DifferentPollingInterval from './subComponents/DifferentPollingInterval';
import ModbusTcpMaster from './subComponents/ModbusTcpMaster';
import DeviceSettings from './subComponents/DeviceSettings';
import AnalogSettings from './subComponents/AnalogSettings';
import DigitalInputSettings from './subComponents/DigitalInputSettings';
import IOSettings from './subComponents/IOSettings';
import ConnectivitySettings from './subComponents/ConnectivitySettings';
import OfflineData from './subComponents/OfflineData';
import ChangePassword from './subComponents/ChangePassword';
import BackupAndRestore from './subComponents/BackupAndRestore';
import { DeviceConfigSetupAddService, DeviceWriteService, DeviceReadService } from "../../../../services/LoginPageService";

const DeviceConfigModal = ({ open, onClose, deviceData }) => {
    const [activeCategory, setActiveCategory] = useState("RTU Com.Port Settings");
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [reading, setReading] = useState(false);
    const [rtuSettings, setRtuSettings] = useState({
        baudRate: "18",
        dataBit: "08",
        parity: "00",
        stopBit: "01"
    });

    const handleChange = useCallback((field) => (event) => {
        setRtuSettings((prev) => ({ ...prev, [field]: event.target.value }));
    }, []);

    const handleRead = useCallback(() => {
        setReading(true);
        DeviceReadService((data) => {
            setReading(false);
            if (data && data.fields && data.fields.length >= 4) {
                setRtuSettings({
                    baudRate: data.fields[0],
                    dataBit: data.fields[1],
                    parity: data.fields[2],
                    stopBit: data.fields[3]
                });
            }
        }, (errStatus, errMsg) => {
            setReading(false);
            console.error("Read Error:", errMsg);
            alert("Failed to read settings from device: " + (errMsg || "Unknown error"));
        });
    }, []);

    // Auto-read when entering RTU settings
    useEffect(() => {
        if (open && activeCategory === "RTU Com.Port Settings") {
            handleRead();
        }
    }, [open, activeCategory, handleRead]);

    const handleSave = useCallback(() => {
        setSaving(true);
        const payload = {
            fields: [
                rtuSettings.baudRate,
                rtuSettings.dataBit,
                rtuSettings.parity,
                rtuSettings.stopBit
            ]
        };

        DeviceWriteService(payload, (data) => {
            setSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
            if (data.deviceReply === "OK") {
                console.log("Device execution success:", data.message);
            }
        }, (errStatus, errMsg) => {
            setSaving(false);
            alert("Failed to save settings: " + (errMsg || "Unknown error"));
        });
    }, [rtuSettings]);

    const categories = useMemo(() => [
        { name: "Modbus RTU (Master)", isHeader: true, icon: <SettingsInputComponentIcon fontSize="small" /> },
        { name: "RTU Com.Port Settings", indent: 1, icon: <RouterIcon fontSize="small" /> },
        { name: "Common Polling Interval", indent: 1, icon: <TimerIcon fontSize="small" /> },
        { name: "Common Register Group", indent: 1, icon: <StorageIcon fontSize="small" /> },
        { name: "Different Polling Interval", indent: 1, icon: <TimerIcon fontSize="small" /> },
        { name: "Modbus TCP Master", indent: 1, icon: <LanIcon fontSize="small" /> },
        { name: "Device Settings", indent: 1, icon: <SettingsIcon fontSize="small" /> },
        { name: "I/O Settings", isHeader: true, icon: <InputIcon fontSize="small" /> },
        { name: "Analog", indent: 1, icon: <ShowChartIcon fontSize="small" /> },
        { name: "Digital Input", indent: 1, icon: <ToggleOnIcon fontSize="small" /> },
        { name: "Settings", indent: 1, icon: <SettingsIcon fontSize="small" /> },
        { name: "Connectivity Settings", isHeader: true, icon: <WifiIcon fontSize="small" /> },
        { name: "Network & Protocol", indent: 1, icon: <LanIcon fontSize="small" /> },
        { name: "Offline Data Settings", isHeader: true, icon: <SdCardIcon fontSize="small" /> },
        { name: "Offline Data", indent: 1, icon: <SdCardIcon fontSize="small" /> },
        { name: "Access Control", isHeader: true, icon: <LockIcon fontSize="small" /> },
        { name: "Change Password", indent: 1, icon: <LockIcon fontSize="small" /> },
        { name: "System Maintenance", isHeader: true, icon: <BackupIcon fontSize="small" /> },
        { name: "Backup and Restore", indent: 1, icon: <BackupIcon fontSize="small" /> }
    ], []);

    const renderContent = () => {
        switch (activeCategory) {
            case "RTU Com.Port Settings":
                return <RtuSettings
                    rtuSettings={rtuSettings}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    handleRead={handleRead}
                    saving={saving}
                    reading={reading}
                    isSaved={isSaved}
                />;
            case "Common Polling Interval":
                return <CommonPollingInterval />;
            case "Common Register Group":
                return <CommonRegisterGroup />;
            case "Different Polling Interval":
                return <DifferentPollingInterval />;
            case "Modbus TCP Master":
                return <ModbusTcpMaster />;
            case "Device Settings":
                return <DeviceSettings />;
            case "Analog":
                return <AnalogSettings />;
            case "Digital Input":
                return <DigitalInputSettings />;
            case "Settings":
                return <IOSettings />;
            case "Network & Protocol":
                return <ConnectivitySettings />;
            case "Offline Data":
                return <OfflineData />;
            case "Change Password":
                return <ChangePassword />;
            case "Backup and Restore":
                return <BackupAndRestore />;
            default:
                return (
                    <Box sx={{ height: "100%", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", gap: 2, opacity: 0.6 }}>
                        <Box sx={{ p: 3, borderRadius: '50%', backgroundColor: '#f1f5f9' }}>
                            <SettingsIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>{activeCategory}</Typography>
                        <Typography variant="body2" color="text.disabled">Configuration options for this category are coming soon.</Typography>
                    </Box>
                );
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Zoom}>
            {/* Header */}
            <DialogTitle sx={{
                backgroundColor: "#051622", color: "#fff",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                px: 3, py: 1.5, boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)', zIndex: 1100
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Device Configuration</Typography>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: alpha('#fff', 0.2) }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {deviceData?.deviceName || "Unspecified Device"}
                    </Typography>
                </Stack>
                <IconButton onClick={onClose} sx={{ color: "#fff", '&:hover': { backgroundColor: alpha('#fff', 0.1) } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: "flex", backgroundColor: '#fcfdfe' }}>
                {/* Sidebar */}
                <Box sx={{
                    width: 280,
                    borderRight: "1px solid #eef2f6",
                    backgroundColor: "#fff",
                    overflowY: "auto",
                    flexShrink: 0
                }}>
                    <List disablePadding sx={{ py: 2 }}>
                        {categories.map((cat, index) => (
                            <React.Fragment key={cat.name}>
                                {cat.isHeader ? (
                                    <Box sx={{ px: 3, mt: index === 0 ? 0 : 3, mb: 1 }}>
                                        <Typography variant="caption" sx={{
                                            fontSize: "0.7rem", fontWeight: 800,
                                            color: '#94a3b8', textTransform: "uppercase", letterSpacing: '1.5px'
                                        }}>
                                            {cat.name}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ListItemButton
                                        onClick={() => setActiveCategory(cat.name)}
                                        sx={{
                                            mx: 1.5, borderRadius: '12px', mb: 0.5, py: 1.5,
                                            backgroundColor: activeCategory === cat.name ? alpha("#051622", 0.05) : "transparent",
                                            '&:hover': { backgroundColor: alpha("#051622", 0.03) },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <Box sx={{ mr: 2, display: 'flex', color: activeCategory === cat.name ? '#051622' : '#64748b' }}>
                                            {cat.icon}
                                        </Box>
                                        <ListItemText
                                            primary={cat.name}
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight: activeCategory === cat.name ? 700 : 500,
                                                color: activeCategory === cat.name ? '#051622' : '#475569'
                                            }}
                                        />
                                        {activeCategory === cat.name && (
                                            <ChevronRightIcon fontSize="small" sx={{ color: '#051622' }} />
                                        )}
                                    </ListItemButton>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>

                {/* Content Panel */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    {renderContent()}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DeviceConfigModal;