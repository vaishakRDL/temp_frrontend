import React from "react";
import LandingNavbar from "../components/FreeePlans/LandingNavbar";
import LandingHero from "../components/FreeePlans/LandingHero";
import PlansSection from "../components/FreeePlans/PlansSection";
import HowItWorks from "../components/FreeePlans/HowItWorks";
import FeaturesSection from "../components/FreeePlans/FeaturesSection";
import SolutionsSection from "../components/FreeePlans/SolutionsSection";
import LandingFooter from "../components/FreeePlans/LandingFooter";

function LandingPage() {

    return (
        <div style={{ backgroundColor: '#FFFFFF' }}>
            <LandingNavbar />
            <LandingHero />
            <HowItWorks />
            <FeaturesSection />
            <SolutionsSection />
            <PlansSection />
            <LandingFooter />
        </div>
    );
}

export default LandingPage;