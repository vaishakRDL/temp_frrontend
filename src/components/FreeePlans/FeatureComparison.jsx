import React from "react";
import {
    Box,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";

const COLORS = {
    primary: "#00979C", // Arduino teal
    secondary: "#006468",
    business: "#232323",
    education: "#FF6D2C",
    textPrimary: "#2D2D2D",
    textSecondary: "#757575",
    border: "#EEEEEE",
    rowHover: "#F9F9F9",
};

const featureGroups = [
    {
        name: "General",
        features: [
            { name: "Users", maker: "1", team: "10 included", school: "Classroom" },
            { name: "Things (Devices)", maker: "25", team: "100", school: "5 per student" },
            { name: "Data Retention", maker: "3 months", team: "1 year", school: "6 months" },
            { name: "Storage per Thing", maker: "100MB", team: "1GB", school: "250MB" },
        ],
    },
    {
        name: "Development Tools",
        features: [
            { name: "Online Web Editor", maker: true, team: true, school: true },
            { name: "Cloud Compiler", maker: true, team: true, school: true },
            { name: "OTA (Over-the-Air Updates)", maker: "Unlimited", team: "Unlimited", school: "Unlimited" },
            { name: "Editor AI Assistant", maker: "Advanced", team: "Unlimited", school: "Advanced" },
            { name: "Private Libraries", maker: false, team: true, school: true },
        ],
    },
    {
        name: "Infrastructure & Security",
        features: [
            { name: "Shared Spaces", maker: false, team: true, school: true },
            { name: "Role-based Access Control", maker: false, team: true, school: true },
            { name: "API Access", maker: true, team: true, school: true },
            { name: "Webhooks", maker: true, team: true, school: false },
            { name: "White Labeling", maker: false, team: true, school: false },
            { name: "Single Sign-On (SSO)", maker: false, team: "Enterprise only", school: true },
        ],
    },
    {
        name: "Education Features",
        features: [
            { name: "Google Classroom Integration", maker: false, team: false, school: true },
            { name: "Course Library", maker: false, team: false, school: true },
            { name: "Student Progress Tracking", maker: false, team: false, school: true },
        ],
    },
    {
        name: "Support",
        features: [
            { name: "Community Forum", maker: true, team: true, school: true },
            { name: "Email Support", maker: "Standard", team: "Priority", school: "Standard" },
            { name: "Dedicated Account Manager", maker: false, team: "Enterprise only", school: false },
        ],
    },
];

const FeatureValue = ({ value }) => {
    if (value === true) return <CheckIcon sx={{ color: COLORS.primary }} />;
    if (value === false) return <CloseIcon sx={{ color: "#D32F2F", opacity: 0.5 }} />;
    return (
        <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.textPrimary }}>
            {value}
        </Typography>
    );
};

function FeatureComparison() {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#FBFBFC", minHeight: "100vh", }}>
            <LandingNavbar />
            {/* Header Area */}
            <Box sx={{
                bgcolor: COLORS.business,
                color: "white",
                pt: { xs: 6, md: 8 },
                pb: { xs: 2, md: 2 },
                textAlign: "center",
                position: "relative"
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            letterSpacing: "-1px"
                        }}
                    >
                        Compare Our <span style={{ color: COLORS.primary }}>Features</span>
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400, maxWidth: "700px", mx: "auto", lineHeight: 1.6 }}>
                        A detailed breakdown of what's included in each plan to help you scale your IoT journey.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: "16px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    <Table stickyHeader aria-label="feature comparison table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        width: "34%",
                                        bgcolor: "#FAFAFA",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        py: 4,
                                        px: 5,
                                        color: COLORS.textPrimary,
                                        borderBottom: `2px solid ${COLORS.border}`,
                                    }}
                                >
                                    Features
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "22%",
                                        bgcolor: "#FAFAFA",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        color: COLORS.primary,
                                        py: 4,
                                        borderBottom: `2px solid ${COLORS.border}`,
                                    }}
                                >
                                    Maker
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "22%",
                                        bgcolor: "#FAFAFA",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        color: COLORS.business,
                                        py: 4,
                                        borderBottom: `2px solid ${COLORS.border}`,
                                    }}
                                >
                                    Team
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "22%",
                                        bgcolor: "#FAFAFA",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        color: COLORS.education,
                                        py: 4,
                                        borderBottom: `2px solid ${COLORS.border}`,
                                    }}
                                >
                                    School
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {featureGroups.map((group) => (
                                <React.Fragment key={group.name}>
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            sx={{
                                                bgcolor: "#F8F9FA",
                                                fontWeight: 700,
                                                color: COLORS.textSecondary,
                                                fontSize: "0.75rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "2px",
                                                py: 1.5,
                                                px: 5,
                                                borderBottom: `1px solid ${COLORS.border}`,
                                            }}
                                        >
                                            {group.name}
                                        </TableCell>
                                    </TableRow>
                                    {group.features.map((feature) => (
                                        <TableRow
                                            key={feature.name}
                                            sx={{
                                                "&:hover": { bgcolor: "#F9F9F9" },
                                                transition: "background-color 0.1s",
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    py: 2.5,
                                                    px: 5,
                                                    borderBottom: `1px solid ${COLORS.border}`,
                                                    verticalAlign: "middle"
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.textPrimary }}>
                                                    {feature.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" sx={{ borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle" }}>
                                                <FeatureValue value={feature.maker} />
                                            </TableCell>
                                            <TableCell align="center" sx={{ borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle" }}>
                                                <FeatureValue value={feature.team} />
                                            </TableCell>
                                            <TableCell align="center" sx={{ borderBottom: `1px solid ${COLORS.border}`, verticalAlign: "middle" }}>
                                                <FeatureValue value={feature.school} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ textAlign: "center", mt: 6, mb: 10 }}>
                    <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
                        Ready to get started? Join thousands of developers and businesses.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/login")}
                            sx={{
                                borderRadius: "50px",
                                px: 4,
                                py: 1.5,
                                fontWeight: "bold",
                                borderColor: COLORS.primary,
                                color: COLORS.primary,
                                textTransform: "none",
                                "&:hover": { borderColor: COLORS.secondary, bgcolor: "rgba(0,151,156,0.05)" }
                            }}
                        >
                            Try for Free
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/login")}
                            sx={{
                                borderRadius: "50px",
                                px: 4,
                                py: 1.5,
                                fontWeight: "bold",
                                bgcolor: COLORS.primary,
                                textTransform: "none",
                                "&:hover": { bgcolor: COLORS.secondary }
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Box>
                </Box>
            </Container>
            <LandingFooter />
        </Box>
    );
}

export default FeatureComparison;
