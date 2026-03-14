import React from "react";
import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import HubIcon from "@mui/icons-material/Hub";
import AssessmentIcon from "@mui/icons-material/Assessment";

const COLORS = {
    primary: "#00979C",
    secondary: "#006468",
    textHeader: "#232323",
    textBody: "#5B5B5B",
};

const steps = [
    {
        title: "Connect Devices",
        description: "Connect your hardware using standard protocols like MQTT, HTTP, and Modbus.",
        icon: <SettingsInputAntennaIcon sx={{ fontSize: 50 }} />,
    },
    {
        title: "Configure Dashboard",
        description: "Organize your data into beautiful, interactive dashboards with no code required.",
        icon: <HubIcon sx={{ fontSize: 50 }} />,
    },
    {
        title: "Monitor & Analyze",
        description: "Track performance and get deep insights with real-time data visualization.",
        icon: <AssessmentIcon sx={{ fontSize: 50 }} />,
    },
];

function HowItWorks() {
    return (
        <Box id="how-it-works" sx={{ py: 12, bgcolor: "white" }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 10 }}>
                    <Typography 
                        variant="overline" 
                        sx={{ color: COLORS.primary, fontWeight: 700, letterSpacing: 2 }}
                    >
                        THE PROCESS
                    </Typography>
                    <Typography 
                        variant="h3" 
                        sx={{ fontWeight: 800, color: COLORS.textHeader, mt: 1 }}
                    >
                        How It <span style={{ color: COLORS.primary }}>Works</span>
                    </Typography>
                </Box>

                <Grid container spacing={8} justifyContent="center">
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Stack alignItems="center" textAlign="center" spacing={3}>
                                <Box 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        borderRadius: "50%", 
                                        bgcolor: COLORS.primary + "15", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        color: COLORS.primary,
                                        position: "relative"
                                    }}
                                >
                                    {step.icon}
                                    <Box 
                                        sx={{ 
                                            position: "absolute", 
                                            top: 0, 
                                            right: 0, 
                                            width: 30, 
                                            height: 30, 
                                            bgcolor: COLORS.primary, 
                                            color: "white", 
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem"
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.textHeader }}>
                                    {step.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: COLORS.textBody, lineHeight: 1.6, maxWidth: "250px" }}>
                                    {step.description}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default HowItWorks;
