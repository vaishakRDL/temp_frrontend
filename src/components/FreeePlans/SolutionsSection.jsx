import React from "react";
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Link } from "@mui/material";

const COLORS = {
    primary: "#00979C",
    secondary: "#006468",
    textHeader: "#232323",
    textBody: "#5B5B5B",
};

const solutions = [
    {
        title: "Smart Factory",
        category: "Industrial",
        description: "Optimizing production lines with real-time sensor monitoring and predictive maintenance algorithms.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Agriculture 4.0",
        category: "Agriculture",
        description: "Automated precision farming through soil moisture sensing, automated irrigation, and weather tracking.",
        image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Smart Logistics",
        category: "Logistics",
        description: "End-to-end fleet tracking and environmental monitoring for sensitive cargo in transit.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    },
];

function SolutionsSection() {
    return (
        <Box id="solutions" sx={{ py: 12, bgcolor: "white" }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography 
                        variant="overline" 
                        sx={{ color: COLORS.primary, fontWeight: 700, letterSpacing: 2 }}
                    >
                        OUR SOLUTIONS
                    </Typography>
                    <Typography 
                        variant="h3" 
                        sx={{ fontWeight: 800, color: COLORS.textHeader, mt: 1, mb: 2 }}
                    >
                        Tailored for your <span style={{ color: COLORS.primary }}>Industry</span>
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ color: COLORS.textBody, maxWidth: "700px", mx: "auto", fontWeight: 400 }}
                    >
                        Explore how our SCADA platform can be adapted to various industrial requirements and use cases.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {solutions.map((sol, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: "100%", 
                                    borderRadius: "16px", 
                                    overflow: "hidden",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "translateY(-5px)" }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={sol.image}
                                    alt={sol.title}
                                />
                                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                    <Chip 
                                        label={sol.category} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: COLORS.primary + "15", 
                                            color: COLORS.primary, 
                                            fontWeight: 700,
                                            mb: 2,
                                            borderRadius: "4px"
                                        }} 
                                    />
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: COLORS.textHeader }}>
                                        {sol.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: COLORS.textBody, lineHeight: 1.8, fontSize: "1rem" }}>
                                        {sol.description}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 4, pt: 0 }}>
                                    <Link 
                                        href="#" 
                                        sx={{ 
                                            color: COLORS.primary, 
                                            fontWeight: "bold", 
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            "&:hover": { color: COLORS.secondary }
                                        }}
                                    >
                                        LEARN MORE &rsaquo;
                                    </Link>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default SolutionsSection;
