import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LazyImage } from "./LazyImage";
import bgImage from "../assets/images/bg.jpg";
import mercedesLogo from "../assets/images/mercedes.png";
import bmwLogo from "../assets/images/bmw.png";
import audiLogo from "../assets/images/audi.png";
import lamboLogo from "../assets/images/lambo.png";
import ferrariLogo from "../assets/images/ferrari.png";
import porscheLogo from "../assets/images/porsche.png";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Slight delay to trigger animations

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative h-[70vh] lg:min-h-screen w-full overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* Background Image - revealed on the right side */}
      <div
        className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Image container with mask gradient - full on mobile, masked on desktop */}
        <div
          className="absolute inset-0 lg:mask-gradient"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)",
          }}
        >
          {/* Hero background image - not lazy loaded for LCP optimization */}
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/5 lg:bg-linear-to-r lg:from-black/80 lg:via-black/60 lg:to-black/20" />
      </div>

      {/* Main content - Side by side layout on desktop */}
      <div className="relative z-10 flex h-[70vh] lg:min-h-screen w-full">
        {/* Left Content */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-12 lg:pl-32 xl:pl-40 w-full lg:w-1/2">
          {/* Overline */}
          <div
            className={`mb-4 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/70"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Premium Automotive
            </span>
          </div>

          {/* Main heading - Inline, larger on mobile */}
          <h1
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <span
              className="inline text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-black text-white whitespace-nowrap"
              style={{
                fontFamily: "Cera Pro, sans-serif",
                fontWeight: "900",
                letterSpacing: "-0.03em",
              }}
            >
              AUTO TAFA
            </span>
          </h1>

          {/* Subtitle - Tighter spacing */}
          <p
            className={`mt-4 max-w-md text-base sm:text-lg text-white/80 font-light leading-relaxed transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.02em",
              transitionDelay: "0.2s",
            }}
          >
            Luxury automobiles for the discerning collector.
          </p>

          {/* CTA Button - Tighter spacing */}
          <div
            className={`mt-8 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.3s" }}
          >
            <Link
              to="/collection"
              className="group relative inline-flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full backdrop-blur-sm bg-black/30 text-white font-medium tracking-widest uppercase text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Explore Collection
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile Brand Showcase */}
          <div className="lg:hidden mt-24 w-full">
            <div
              className={`flex flex-wrap justify-center gap-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0.4s" }}
            >
              {[
                { name: "Ferrari", logo: ferrariLogo },
                { name: "Mercedes", logo: mercedesLogo },
                { name: "Lamborghini", logo: lamboLogo },
                { name: "BMW", logo: bmwLogo, filter: true },
                { name: "Porsche", logo: porscheLogo },
              ].map((brand, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center cursor-default"
                >
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width="56"
                    height="56"
                    loading="lazy"
                    decoding="async"
                    className="w-13 h-13 sm:w-14 sm:h-14 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    style={
                      brand.filter ? { filter: "brightness(0) invert(1)" } : {}
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Brand Logos (Desktop) */}
        <div className="hidden lg:flex items-center justify-center w-1/2 pl-24 xl:pl-20">
          <div
            className={`grid grid-cols-3 gap-8 xl:gap-12 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{ transitionDelay: "0.5s" }}
          >
            {[
              { name: "Ferrari", logo: ferrariLogo },
              { name: "Mercedes", logo: mercedesLogo },
              { name: "Lamborghini", logo: lamboLogo },
              { name: "BMW", logo: bmwLogo, filter: true },
              { name: "Porsche", logo: porscheLogo },
              { name: "Audi", logo: audiLogo },
            ].map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-default group"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width="96"
                  height="96"
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 xl:w-24 xl:h-24 object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                  style={
                    brand.filter ? { filter: "brightness(0) invert(1)" } : {}
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Center - Glassy Button Style */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "0.6s" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-full backdrop-blur-sm bg-black/30 hover:bg-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer group"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span
            className="text-xs font-medium tracking-wide text-white/70 group-hover:text-white transition-colors duration-300"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Scroll
          </span>
          <svg
            className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
