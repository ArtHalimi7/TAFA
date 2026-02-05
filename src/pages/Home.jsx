import React from "react";
import Hero from "../components/Hero";
import Showcase from "../components/Showcase";
import FeaturedCollection from "../components/FeaturedCollection";
import TheStandard from "../components/TheStandard";
import WhyCurated from "../components/WhyCurated";
import Footer from "../components/Footer";
import { useSEO, seoContent } from "../hooks/useSEO";

const Home = () => {
  // SEO optimization for homepage
  useSEO(seoContent.home);

  return (
    <>
      <Hero />
      <Showcase />
      <FeaturedCollection />
      <WhyCurated />
      <TheStandard />
      <Footer />
    </>
  );
};

export default Home;
