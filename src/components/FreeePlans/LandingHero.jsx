import React from "react";
import { Box, Typography, Button, Stack, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dashboardMockup from "../../images/scada_dashboard_mockup.png";

const COLORS = {
    primary: "#00979C", // Arduino teal
    secondary: "#006468",
    lightBg: "#F7F9F9",
    textHeader: "#232323",
    textBody: "#5B5B5B",
};

function LandingHero() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/register");
    };

    const handleSeePlans = () => {
        const section = document.getElementById("plans-section");
        section?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box sx={{ bgcolor: COLORS.lightBg, pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 }, overflow: "hidden" }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    color: COLORS.textHeader,
                                    mb: 3,
                                    lineHeight: 1.1,
                                    fontSize: { xs: "2.5rem", md: "3.5rem" }
                                }}
                            >
                                Bring your IoT projects to life <span style={{ color: COLORS.primary }}>quickly</span>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: COLORS.textBody,
                                    mb: 5,
                                    fontWeight: 400,
                                    maxWidth: "500px",
                                    lineHeight: 1.6
                                }}
                            >
                                Build, control and monitor your connected projects with our advanced SCADA platform. Secure, scalable, and easy to use.
                            </Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleGetStarted}
                                    sx={{
                                        bgcolor: COLORS.primary,
                                        color: "white",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: "50px",
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        "&:hover": {
                                            bgcolor: COLORS.secondary,
                                        }
                                    }}
                                >
                                    GET STARTED FOR FREE
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={handleSeePlans}
                                    sx={{
                                        color: COLORS.primary,
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        "&:hover": {
                                            bgcolor: "rgba(0, 151, 156, 0.05)",
                                        }
                                    }}
                                >
                                    SEE PLANS &rsaquo;
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: "relative",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: "10%",
                                    left: "10%",
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "rgba(0, 151, 156, 0.1)",
                                    borderRadius: "20px",
                                    zIndex: 0
                                }
                            }}
                        >
                            <img
                                src={dashboardMockup}
                                alt="SCADA Dashboard Mockup"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "12px",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                    position: "relative",
                                    zIndex: 1
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default LandingHero;