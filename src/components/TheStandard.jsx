import { useState, useEffect, useRef } from "react";
import logo from "../assets/images/logo.png";

export default function TheStandard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    { value: 500, suffix: "+", label: "Automjete të Përzgjedhura me Dorë" },
    { value: 20, suffix: " Vite", label: "Ekselencë në Industrinë Automobilistike" },
    { value: 12, suffix: " Marka", label: "Marka Premium të Kuruara" },
  ];

  const features = [
    { title: "Precizion", description: "Çdo detaj i kuruar dhe verifikuar" },
    { title: "Trashëgimi", description: "Dekada ekselence automobilistike" },
    { title: "Ekskluzivitet", description: "Vetëm më të mirat kalojnë filtrin" },
    { title: "Shërbim", description: "Mbështetje koncierge 24/7 e dedikuar" },
  ];

  return (
    <section
      className="relative w-full bg-black overflow-x-clip"
      ref={containerRef}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Column (text on top, horizontal stats below) | Desktop: Row with sticky left */}
        <div className="flex flex-col lg:flex-row lg:gap-16">
          {/* Left Side - Sticky Philosophy */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-16 lg:h-screen flex items-start lg:pt-20 z-20 bg-black">
              <div className="space-y-6 lg:space-y-12 py-12 lg:py-0 w-full">
                <div>
                  <h2
                    className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 lg:mb-6 transition-all duration-1000 ${
                      isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{
                      fontFamily: "Cera Pro, sans-serif",
                      lineHeight: "1.1",
                    }}
                  >
                    Standardi ynë<span className="text-white/30">.</span>
                  </h2>

                  <div
                    className={`space-y-4 lg:space-y-6 transition-all duration-1000 delay-200 ${
                      isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <p className="text-base lg:text-lg text-white/80 leading-relaxed">
                      Ne nuk shesim thjesht makina. Ne krijojmë përvoja për ata
                      që refuzojnë të komprometojnë.
                    </p>
                    <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                      Çdo automjet në koleksionin tonë i nënshtrohet një
                      procesi rigoroz të seleksionimit dhe inspektimit për të
                      siguruar që vetëm më të mirat të bëhen pjesë e ofertës sonë
                      ekskluzive.
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div
                  className={`grid grid-cols-2 gap-4 lg:gap-6 transition-all duration-1000 delay-300 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="space-y-1 lg:space-y-2 pb-3 lg:pb-4 border-b border-white/10 hover:border-white/30 transition-colors duration-300"
                    >
                      <h4
                        className="text-white font-semibold text-xs lg:text-sm tracking-widest uppercase"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {feature.title}
                      </h4>
                      <p className="text-white/50 text-xs">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Logo */}
                <div
                  className={`flex justify-center transition-all duration-1000 delay-400 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <img
                    src={logo}
                    alt="TAFA Logo"
                    className="h-16 lg:h-24 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Stats */}
          {/* Mobile: Horizontal scroll showcase | Desktop: Vertical scroll */}
          <div className="w-full lg:w-1/2 relative">
            {/* Vertical line accent - hidden on mobile */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />

            {/* Mobile horizontal scroll-on-scroll stats */}
            {/* Mobile: Each stat gets its own scroll section, slides in from right */}
            <div className="lg:hidden">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="min-h-[40vh] flex items-center justify-center overflow-hidden"
                >
                  <div className="flex flex-col items-center text-center px-4">
                    {/* Number + Suffix */}
                    <div className="flex items-baseline justify-center">
                      <span
                        className="text-6xl sm:text-7xl font-bold text-white"
                        style={{
                          fontFamily: "Cera Pro, sans-serif",
                        }}
                      >
                        {stat.isDecimal ? stat.value.toFixed(1) : stat.value}
                      </span>
                      <span className="text-xl sm:text-2xl text-white/50 ml-1">
                        {stat.suffix}
                      </span>
                    </div>
                    {/* Label */}
                    <p
                      className="text-sm sm:text-base text-white/60 mt-3"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {stat.label}
                    </p>
                    {/* Accent line */}
                    <div className="mt-4 h-px bg-linear-to-r from-transparent via-white/40 to-transparent mx-auto w-20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop vertical scroll stats */}
            <div className="hidden lg:block w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="h-screen flex items-center justify-end"
                >
                  <div className="flex flex-col items-end text-right pr-12">
                    {/* Main Number */}
                    <div className="relative mb-4 flex items-baseline justify-end">
                      <span
                        className="text-[10rem] xl:text-[12rem] font-bold text-white"
                        style={{
                          fontFamily: "Cera Pro, sans-serif",
                        }}
                      >
                        {stat.isDecimal ? stat.value.toFixed(1) : stat.value}
                      </span>
                      <span className="text-4xl xl:text-5xl text-white/50 ml-2">
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <p
                      className="text-xl xl:text-2xl text-white/70"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {stat.label}
                    </p>

                    {/* Accent line */}
                    <div className="mt-6 h-px bg-linear-to-l from-white/50 via-white/30 to-transparent ml-auto w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
