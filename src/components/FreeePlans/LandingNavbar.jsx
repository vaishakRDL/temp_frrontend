import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useScrollTrigger,
    Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const COLORS = {
    primary: "#00979C", // Arduino teal
    secondary: "#006468",
    text: "#232323",
    white: "#FFFFFF",
};

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function LandingNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: "How it works", id: "how-it-works" },
        { text: "Features", id: "features" },
        { text: "Solutions", id: "solutions" },
        { text: "Plans", id: "plans-section" },
    ];

    const handleScrollTo = (id) => {
        if (location.pathname !== "/") {
            navigate("/");
            // Wait for navigation and potential re-render before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 300);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ p: 2 }}>
            <Box 
                sx={{ display: "flex", alignItems: "center", cursor: "pointer", mb: 3 }} 
                onClick={() => { navigate("/"); setMobileOpen(false); }}
            >
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: "bold" }}>
                    IOT <span style={{ color: COLORS.text }}>SCADA</span>
                </Typography>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => handleScrollTo(item.id)}>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={() => navigate(token ? "/Dashboard" : "/login")}>
                    <ListItemText primary={token ? "DASHBOARD" : "LOGIN"} sx={{ color: COLORS.primary, fontWeight: "bold" }} />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll>
                <AppBar
                    elevation={scrolled ? 4 : 0}
                    sx={{
                        bgcolor: scrolled ? COLORS.white : "transparent",
                        color: COLORS.text,
                        transition: "all 0.3s ease-in-out",
                        borderBottom: scrolled ? "none" : "1px solid rgba(0,0,0,0.05)",
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar sx={{ justifyContent: "space-between", py: scrolled ? 1 : 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" style={{ marginRight: "10px" }}>
                                    <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00979C" />
                                    <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#00979C" />
                                </svg>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: ".1rem",
                                        color: COLORS.primary,
                                        display: { xs: "none", sm: "block" }
                                    }}
                                >
                                    IOT <span style={{ color: COLORS.text }}>SCADA</span>
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.text}
                                        onClick={() => handleScrollTo(item.id)}
                                        sx={{
                                            color: COLORS.text,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            fontSize: "0.95rem",
                                            "&:hover": { color: COLORS.primary, bgcolor: "transparent" }
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => navigate(token ? "/Dashboard" : "/login")}
                                        sx={{
                                            color: COLORS.text,
                                            fontWeight: "bold",
                                            display: { xs: "none", sm: "block" }
                                        }}
                                    >
                                        {token ? "DASHBOARD" : "LOGIN"}
                                    </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(token ? "/Dashboard" : "/login")}
                                    sx={{
                                        bgcolor: COLORS.primary,
                                        color: "white",
                                        borderRadius: "50px",
                                        px: 3,
                                        fontWeight: "bold",
                                        "&:hover": { bgcolor: COLORS.secondary }
                                    }}
                                >
                                    {token ? "DASHBOARD" : "OPEN APP"}
                                </Button>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ display: { md: "none" } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
                }}
            >
                {drawer}
            </Drawer>
            {/* Spacer for the fixed navbar */}
            <Toolbar sx={{ py: 2 }} />
        </>
    );
}

export default LandingNavbar;
