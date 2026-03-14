import React, { useState } from "react";
import { 
    TextField, 
    IconButton, 
    InputAdornment, 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Checkbox, 
    FormControlLabel,
    Link,
    Stack,
    Grid
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import NotificationBar from "../components/notification/ServiceNotificationBar";
import "./LoginPage.css"; // Reuse login styles

const COLORS = {
    primary: "#00979C",
    secondary: "#006468",
    textHeader: "#232323",
    textMuted: "#757575",
    border: "#E0E0E0",
};

function RegistrationPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({
        status: false,
        type: "success",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.companyName) newErrors.companyName = "Company name is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "You must agree to the terms";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setNotification({
                status: true,
                type: "success",
                message: "Account created successfully! Redirecting to login...",
            });
            setTimeout(() => navigate("/login"), 2000);
        }, 1500);
    };

    return (
        <Box className="login-container" sx={{ py: 4 }}>
            <Paper elevation={0} className="login-card" sx={{ maxWidth: "550px !important" }}>
                <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton onClick={() => navigate("/login")} sx={{ color: COLORS.primary }}>
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" style={{ marginBottom: "8px" }}>
                            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00979C" />
                            <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#00979C" />
                        </svg>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.textHeader }}>
                            Create your account
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                            Join thousands of users monitoring their IOT infrastructure.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <IconButton 
                            sx={{ 
                                flex: 1, 
                                border: `1px solid ${COLORS.border}`, 
                                borderRadius: "6px",
                                py: 1
                            }}
                        >
                            <svg width="64" height="24" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </IconButton>
                        <IconButton 
                            sx={{ 
                                flex: 1, 
                                border: `1px solid ${COLORS.border}`, 
                                borderRadius: "6px"
                            }}
                        >
                            <svg width="64" height="24" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#24292e" />
                            </svg>
                        </IconButton>
                        <IconButton 
                            sx={{ 
                                flex: 1, 
                                border: `1px solid ${COLORS.border}`, 
                                borderRadius: "6px"
                            }}
                        >
                            <svg width="64" height="24" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.661 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </IconButton>
                    </Stack>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />
                        <Typography variant="body2" sx={{ px: 2, color: COLORS.textMuted }}>or Signup with</Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                variant="outlined"
                                className="login-input"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                variant="outlined"
                                className="login-input"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                                className="login-input"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                error={!!errors.companyName}
                                helperText={errors.companyName}
                                variant="outlined"
                                className="login-input"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                variant="outlined"
                                className="login-input"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                                className="login-input"
                            />
                        </Grid>
                    </Grid>

                    <FormControlLabel
                        control={
                            <Checkbox 
                                name="agreeTerms" 
                                checked={formData.agreeTerms} 
                                onChange={handleChange} 
                                sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                                I agree to the <Link href="#" sx={{ color: COLORS.primary, fontWeight: 700 }}>Terms of Service</Link> and <Link href="#" sx={{ color: COLORS.primary, fontWeight: 700 }}>Privacy Policy</Link>.
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />
                    {errors.agreeTerms && (
                        <Typography variant="caption" color="error" sx={{ mt: -2, mb: 2, display: "block" }}>
                            {errors.agreeTerms}
                        </Typography>
                    )}

                    <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={loading}
                        className="login-button"
                        sx={{ py: 2 }}
                    >
                        CREATE ACCOUNT
                    </LoadingButton>
                </form>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                        Already have an account?{" "}
                        <Link 
                            component="button" 
                            onClick={() => navigate("/login")} 
                            sx={{ color: COLORS.primary, fontWeight: 700, textDecoration: "none" }}
                        >
                            Sign In here
                        </Link>
                    </Typography>
                </Box>
            </Paper>

            <NotificationBar
                handleClose={() => setNotification(prev => ({ ...prev, status: false }))}
                notificationContent={notification.message}
                openNotification={notification.status}
                type={notification.type}
            />
        </Box>
    );
}

export default RegistrationPage;
