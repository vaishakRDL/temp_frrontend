import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Divider,
    Stack,
    Switch,
    styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const COLORS = {
    primary: "#00979C", // Arduino teal
    secondary: "#006468",
    business: "#232323",
    education: "#FF6D2C",
    lightBg: "#FFFFFF",
    muted: "#757575",
    cardBorder: "#E0E0E0",
};

const PlanChip = styled(Box)(({ color }) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "16px",
    backgroundColor: color + "15",
    color: color,
    border: `1px solid ${color}30`,
}));

function PlansSection() {
    const navigate = useNavigate();
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            type: "FOR INDIVIDUALS",
            title: "Maker",
            subtitle: "For personal IoT Projects",
            price: isYearly ? "5.99" : "6.99",
            billing: "per month",
            color: COLORS.primary,
            features: [
                "1 user",
                "25 Things",
                "3 months data retention",
                "Advanced Editor AI Assistant",
                "Unlimited Editor with OTA updates",
            ],
            buttonText: "START NOW",
            highlight: true,
        },
        {
            type: "FOR BUSINESS",
            title: "Team",
            subtitle: "Perfect for small and medium businesses",
            price: isYearly ? "83.33" : "99.00",
            billing: "per month",
            color: COLORS.business,
            features: [
                "10 users included",
                "100 Things",
                "1 year data retention",
                "Unlimited Editor AI Assistant",
                "Shared space with role permissions",
                "White label",
                "Enterprise Standard support",
            ],
            buttonText: "START NOW",
            highlight: false,
        },
        {
            type: "FOR EDUCATION",
            title: "School",
            subtitle: "Learn Coding and IoT with classroom tools",
            price: "Custom",
            billing: "Tailor made plans",
            color: COLORS.education,
            features: [
                "Shared space with role permissions",
                "5 Things per Member",
                "6 months data retention",
                "Advanced Editor AI Assistant",
                "Course library",
                "Google Classroom integration",
            ],
            buttonText: "CONTACT US",
            highlight: false,
        },
    ];

    return (
        <Box id="plans-section" sx={{ py: 10, bgcolor: "white" }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: COLORS.business }}>
                        Scalable plans for every <span style={{ color: COLORS.primary }}>need</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: COLORS.muted, mb: 4 }}>
                        Kickstart your IoT journey for free, or explore our plans for more advanced features.
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Typography sx={{ fontWeight: isYearly ? 400 : 700, color: isYearly ? COLORS.muted : COLORS.business }}>
                            Monthly
                        </Typography>
                        <Switch
                            checked={isYearly}
                            onChange={() => setIsYearly(!isYearly)}
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: COLORS.primary,
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: COLORS.primary,
                                },
                            }}
                        />
                        <Typography sx={{ fontWeight: isYearly ? 700 : 400, color: isYearly ? COLORS.business : COLORS.muted }}>
                            Yearly <span style={{ color: COLORS.primary, fontSize: "0.8rem" }}>(SAVE 20%)</span>
                        </Typography>
                    </Stack>
                </Box>

                <Grid container spacing={4}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: "12px",
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    border: plan.highlight ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.cardBorder}`,
                                    position: "relative",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                    <PlanChip color={plan.color}>{plan.type}</PlanChip>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.business, mb: 1 }}>
                                        {plan.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: COLORS.muted, mb: 3, minHeight: "40px" }}>
                                        {plan.subtitle}
                                    </Typography>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, display: "inline" }}>
                                            {plan.price !== "Custom" && "$"}
                                            {plan.price}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: COLORS.muted, display: "inline", ml: 1 }}>
                                            {plan.billing}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 4 }} />

                                    <Stack spacing={2}>
                                        {plan.features.map((feature, idx) => (
                                            <Stack direction="row" spacing={1.5} key={idx} alignItems="flex-start">
                                                <CheckCircleIcon sx={{ fontSize: "1.2rem", color: plan.color, mt: 0.2 }} />
                                                <Typography variant="body2" sx={{ color: COLORS.business }}>
                                                    {feature}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </CardContent>
                                <Box sx={{ p: 4, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant={plan.highlight ? "contained" : "outlined"}
                                        onClick={() => plan.buttonText === "CONTACT US" ? window.location.href="mailto:contact@rdltech.in" : navigate("/register")}
                                        sx={{
                                            borderRadius: "50px",
                                            py: 1.5,
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            bgcolor: plan.highlight ? COLORS.primary : "transparent",
                                            color: plan.highlight ? "white" : COLORS.primary,
                                            borderColor: COLORS.primary,
                                            "&:hover": {
                                                bgcolor: plan.highlight ? COLORS.secondary : "rgba(0, 151, 156, 0.05)",
                                                borderColor: COLORS.secondary,
                                            },
                                        }}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Button
                        onClick={() => navigate("/features")}
                        sx={{
                            color: COLORS.primary,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "1.1rem",
                            "&:hover": { background: "none", textDecoration: "underline" }
                        }}
                    >
                        See full feature list &rsaquo;
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default PlansSection;