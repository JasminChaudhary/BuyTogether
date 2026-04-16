import React from "react";
import HeroSection from "../../components/home/hero-section";
import HowItWorksSection from "../../components/home/how-it-works-section";
import FeaturedListingsSection from "../../components/home/featured-listings-section";
import TestimonialsSection from "../../components/home/testimonials-section";
import CommunitySection from "../../components/home/community-section";
import CTASection from "../../components/home/cta-section";

const UserLanding = () => {
    return (
        <div>
            <HeroSection />
            <HowItWorksSection />
            <CommunitySection />
            <FeaturedListingsSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
};

export default UserLanding;
