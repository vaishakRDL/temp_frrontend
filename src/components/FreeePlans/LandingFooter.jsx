import React from "react";
import { Box, Container, Grid, Typography, Link, Stack, IconButton, Divider } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const COLORS = {
    primary: "#00979C",
    bg: "#1A1A1A",
    textMuted: "#A0A0A0",
    white: "#FFFFFF",
};

function LandingFooter() {
    return (
        <Box sx={{ bgcolor: COLORS.bg, color: COLORS.white, pt: 10, pb: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={8}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 800, mb: 3 }}>
                            IOT <span style={{ color: COLORS.white }}>SCADA</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, lineHeight: 1.8, mb: 4 }}>
                            A complete platform to build, manage, and scale your industrial IOT solutions. 
                            Empowering industries with real-time data and actionable insights.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton sx={{ color: COLORS.white, "&:hover": { color: COLORS.primary } }}><FacebookIcon /></IconButton>
                            <IconButton sx={{ color: COLORS.white, "&:hover": { color: COLORS.primary } }}><TwitterIcon /></IconButton>
                            <IconButton sx={{ color: COLORS.white, "&:hover": { color: COLORS.primary } }}><LinkedInIcon /></IconButton>
                            <IconButton sx={{ color: COLORS.white, "&:hover": { color: COLORS.primary } }}><GitHubIcon /></IconButton>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Platform</Typography>
                        <Stack spacing={2}>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Features</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Solutions</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Security</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Enterprise</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Resources</Typography>
                        <Stack spacing={2}>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Documentation</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Help Center</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Community</Link>
                            <Link href="#" color="inherit" underline="none" sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.primary } }}>Tutorials</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Contact Us</Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 2 }}>
                            Email: contact@rdltech.in
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 2 }}>
                            Phone: +91 98765 43210
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                            Address: Hubballi, Karnataka, India
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 8, mb: 4, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                        Copyright © {new Date().getFullYear()} RDL Technologies Pvt Ltd - All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingFooter;
