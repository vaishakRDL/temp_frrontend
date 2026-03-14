import React, { useState } from "react";
import { 
    TextField, 
    IconButton, 
    Box, 
    Typography, 
    Paper, 
    Link,
    Stack,
    Container
} from "@mui/material";
import { ArrowBack, EmailOutlined } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import NotificationBar from "../components/notification/ServiceNotificationBar";
import "./LoginPage.css";

const COLORS = {
    primary: "#00979C",
    secondary: "#006468",
    textHeader: "#232323",
    textMuted: "#757575",
};

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({
        status: false,
        type: "success",
        message: "",
    });

    const handleBackToLogin = (e) => {
        if (e) e.preventDefault();
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        // Simulate API call to send reset email
        setTimeout(() => {
            setLoading(false);
            setEmailSent(true);
            setNotification({
                status: true,
                type: "success",
                message: "Reset link has been sent to your email!",
            });
        }, 1500);
    };

    return (
        <Box className="login-container">
            <Paper elevation={0} className="login-card">
                <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton onClick={handleBackToLogin} sx={{ color: COLORS.primary }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.textHeader, flexGrow: 1 }}>
                        Forgot Password?
                    </Typography>
                </Box>

                {!emailSent ? (
                    <>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 4, lineHeight: 1.6 }}>
                            No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                error={!!error}
                                helperText={error}
                                variant="outlined"
                                className="login-input"
                                placeholder="Enter your email"
                                required
                                autoFocus
                            />

                            <LoadingButton
                                fullWidth
                                type="submit"
                                variant="contained"
                                loading={loading}
                                className="login-button"
                                sx={{ py: 2, mt: 2 }}
                            >
                                SEND RESET LINK
                            </LoadingButton>
                        </form>
                    </>
                ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                        <Box 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                borderRadius: "50%", 
                                bgcolor: COLORS.primary + "15", 
                                color: COLORS.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 3
                            }}
                        >
                            <EmailOutlined sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Check your email
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 4, lineHeight: 1.6 }}>
                            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                        </Typography>
                        <LoadingButton
                            fullWidth
                            variant="outlined"
                            onClick={() => setEmailSent(false)}
                            sx={{
                                color: COLORS.primary,
                                borderColor: COLORS.primary,
                                borderRadius: "50px",
                                py: 1.5,
                                fontWeight: "bold",
                                "&:hover": { borderColor: COLORS.secondary, bgcolor: COLORS.primary + "05" }
                            }}
                        >
                            DIDN'T RECEIVE? TRY AGAIN
                        </LoadingButton>
                    </Box>
                )}

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Link 
                        component="button" 
                        onClick={handleBackToLogin} 
                        sx={{ color: COLORS.primary, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
                    >
                        Back to Login
                    </Link>
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

export default ForgotPasswordPage;
