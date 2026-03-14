import React from "react";
import { Box, Container, Typography, Grid, Paper, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import CloudIcon from "@mui/icons-material/Cloud";
import SensorsIcon from "@mui/icons-material/Sensors";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const COLORS = {
    primary: "#00979C",
    secondary: "#006468",
    bg: "#F8FBFB",
    textHeader: "#232323",
    textBody: "#5B5B5B",
};

const features = [
    {
        title: "Real-time Monitoring",
        description: "Monitor your IOT devices in real-time with zero latency. Get instant updates on sensor data.",
        icon: <MonitorHeartIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
    {
        title: "Advanced Analytics",
        description: "Transform raw data into actionable insights with our built-in analytics and visualization tools.",
        icon: <AnalyticsIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
    {
        title: "Enterprise Security",
        description: "End-to-end encryption for all your data. Secure access control and role-based permissions.",
        icon: <SecurityIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
    {
        title: "Cloud Connectivity",
        description: "Seamlessly connect your devices to the cloud. Access your dashboard from anywhere in the world.",
        icon: <CloudIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
    {
        title: "Scale with Ease",
        description: "Start small and grow big. Our infrastructure is built to handle millions of concurrent connections.",
        icon: <SpeedIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
    {
        title: "Custom Sensor Support",
        description: "Support for a wide range of industrial sensors and protocols. Plug and play compatibility.",
        icon: <SensorsIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    },
];

function FeaturesSection() {
    const navigate = useNavigate();

    return (
        <Box id="features" sx={{ py: 12, bgcolor: COLORS.bg }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: COLORS.primary, fontWeight: 700, letterSpacing: 2 }}
                    >
                        POWERFUL FEATURES
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 800, color: COLORS.textHeader, mt: 1, mb: 2 }}
                    >
                        Everything you need to <span style={{ color: COLORS.primary }}>Monitor</span>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: COLORS.textBody, maxWidth: "700px", mx: "auto", fontWeight: 400 }}
                    >
                        Our platform provides all the tools required to build, manage, and scale your industrial IOT solutions.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: "100%",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                                        bgcolor: "white",
                                        borderColor: COLORS.primary,
                                    },
                                }}
                            >
                                <Box sx={{
                                    mb: 3,
                                    width: 70,
                                    height: 70,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    bgcolor: COLORS.primary + "10",
                                }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: COLORS.textHeader }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.textBody, lineHeight: 1.7, fontSize: "1rem" }}>
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/features")}
                        sx={{
                            bgcolor: COLORS.primary,
                            color: "white",
                            px: 6,
                            py: 1.5,
                            borderRadius: "50px",
                            fontWeight: "bold",
                            fontSize: "1.05rem",
                            boxShadow: "0 10px 20px rgba(0, 151, 156, 0.2)",
                            "&:hover": {
                                bgcolor: COLORS.secondary,
                                transform: "scale(1.02)",
                            },
                            transition: "all 0.2s"
                        }}
                    >
                        SEE FULL FEATURE LIST & COMPARISON
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default FeaturesSection;
