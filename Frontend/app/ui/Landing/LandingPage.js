"use client";

import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ModelsSection from "./ModelsSection";
import PricingSection from "./PricingSection";
import DemoSection from "./DemoSection";

import { scrollSpy } from "react-scroll";
import { useEffect } from "react";

const LandingPage = ({ isLoggedIn, userName, userEmail, userDate }) => {
  useEffect(() => {
    scrollSpy.update();
  }, []);

  return (
    <>
      <HeroSection isLoggedIn={isLoggedIn} />
      <AboutSection />
      <ModelsSection />
      <PricingSection />
      <DemoSection />
    </>
  );
};

export default LandingPage;
