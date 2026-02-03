import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/bg.jpg";
import logo from "../assets/images/logo.png";
import { useSEO, seoContent } from "../hooks/useSEO";

export default function About() {
  // SEO optimization for about page
  useSEO(seoContent.about);

  const [isLoaded, setIsLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [philosophyVisible, setPhilosophyVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    years: 0,
    cars: 0,
    clients: 0,
    brands: 0,
  });

  const statsRef = useRef(null);
  const philosophyRef = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observers
  useEffect(() => {
    const createObserver = (ref, setVisible) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(true);
        },
        { threshold: 0.2 },
      );
    };

    const statsObserver = createObserver(statsRef, setStatsVisible);
    const philosophyObserver = createObserver(
      philosophyRef,
      setPhilosophyVisible,
    );
    const storyObserver = createObserver(storyRef, setStoryVisible);

    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (philosophyRef.current)
      philosophyObserver.observe(philosophyRef.current);
    if (storyRef.current) storyObserver.observe(storyRef.current);

    return () => {
      statsObserver.disconnect();
      philosophyObserver.disconnect();
      storyObserver.disconnect();
    };
  }, []);

  // Animate stats when visible
  useEffect(() => {
    if (statsVisible) {
      const duration = 2000;
      const startTime = Date.now();
      const targets = { years: 20, cars: 500, clients: 1200, brands: 12 };

      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          years: Math.floor(targets.years * easeOut),
          cars: Math.floor(targets.cars * easeOut),
          clients: Math.floor(targets.clients * easeOut),
          brands: Math.floor(targets.brands * easeOut),
        });

        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    }
  }, [statsVisible]);

  const stats = [
    { value: animatedStats.years, suffix: "+", label: "Vite" },
    { value: animatedStats.cars, suffix: "+", label: "Automjete" },
    { value: animatedStats.clients, suffix: "+", label: "Klientë" },
    { value: animatedStats.brands, suffix: "", label: "Marka" },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section - Full Screen with Background Image */}
      <section className="relative h-[60vh] sm:min-h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Breadcrumbs - Fixed at top below navbar */}
        <nav
          className={`absolute top-20 lg:top-24 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="max-w-7xl mx-auto">
            <ol
              className="flex items-center gap-2 text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <li>
                <Link
                  to="/"
                  className="text-white/50 hover:text-white transition-colors duration-300"
                >
                  Shtëpia
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white">Rreth Nesh</li>
            </ol>
          </div>
        </nav>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt="AUTO TAFA Showroom"
            className="w-full h-full object-cover"
          />
          {/* Sophisticated overlay - dark from bottom, subtle overall */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content - Positioned in center */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            {/* Overline */}
            <div
              className={`mb-4 sm:mb-6 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase text-white/60"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Themeluar në 2006 — Gjilan, Kosovë
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className={`transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "Cera Pro, sans-serif",
                letterSpacing: "-0.03em",
                transitionDelay: "0.3s",
              }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold">
                Ne nuk bindemi tregut.
              </span>
              <span
                className="block text-xl sm:text-2xl lg:text-4xl font-light text-white/50 mt-2 sm:mt-3 lg:mt-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ne e udhëheqim atë.
              </span>
            </h1>
          </div>
        </div>

        {/* Logo - Bottom Right */}
        <div className="absolute bottom-6 sm:bottom-12 right-6 sm:right-12 lg:right-24 z-20">
          <img
            src={logo}
            alt="Logoja e AUTO TAFA"
            className="h-16 sm:h-20 lg:h-24 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>

      {/* Philosophy Section - The "Different" Element */}
      <section
        ref={philosophyRef}
        className="relative py-32 lg:py-48 overflow-hidden"
      >
        {/* Large Typography Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-[20vw] font-bold text-white/1.5 whitespace-nowrap transition-all duration-[2s] ${
              philosophyVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            FILOZOFIJA
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Philosophy Content - Asymmetric Layout */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-0">
            {/* Left Side - Statement */}
            <div className="lg:col-span-5 lg:col-start-1">
              <div
                className={`transition-all duration-1000 ${
                  philosophyVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <span
                  className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8 block"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Besimi Ynë
                </span>
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  Standard pa
                  <br />
                  <span className="text-white/30">kompromis</span>
                </h2>
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div
                className={`transition-all duration-1000 ${
                  philosophyVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="space-y-8">
                  <p
                    className="text-xl lg:text-2xl text-white/70 leading-relaxed"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Çdo automjet përzgjidhet mbi bazën e cilësisë, historikut dhe gjendjes.
                    Asgjë më pak se maksimumi.
                  </p>

                  {/* Minimal accent */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-px bg-white/30" />
                    <span
                      className="text-sm text-white/40 tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Që nga 2006
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean Horizontal Strip */}
      <section ref={statsRef} className="relative border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-12 lg:py-16 ${index < 3 ? "lg:border-r lg:border-white/10" : ""} ${index < 2 ? "max-lg:border-b max-lg:border-white/10" : ""} ${index % 2 === 0 ? "max-lg:border-r max-lg:border-white/10" : ""} transition-all duration-700 ${
                  statsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-2xl lg:text-3xl text-white/30 font-bold"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {stat.suffix}
                    </span>
                  </div>
                  <p
                    className="text-xs text-white/40 uppercase tracking-[0.2em] mt-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Refined */}
      <section ref={storyRef} className="relative py-32 lg:py-48">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="max-w-4xl">
            {/* Section Label */}
            <div
              className={`transition-all duration-1000 ${
                storyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8 block"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Historia Jonë
              </span>
            </div>

            {/* Story Heading */}
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 lg:mb-16 transition-all duration-1000 ${
                storyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "Cera Pro, sans-serif",
                transitionDelay: "100ms",
              }}
            >
              Lindur në Gjilan.
              <br />
              <span className="text-white/30">Ndërtuar mbi besim.</span>
            </h2>

            {/* Story Content - Two Column Text */}
            <div
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 transition-all duration-1000 ${
                storyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div
                className="space-y-6 text-white/60"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <p className="text-lg leading-relaxed">
                  Në vitin 2006, në zemrën e Kosovës, AUTO TAFA  hapi dyert
                  me një vizion që shkonte përtej shitjes së automjeteve. Ne
                  vendosëm të krijonim një strehë për ata që kuptojnë se një
                  makinë është më shumë se transporti—ajo është një shprehje e
                  identitetit.
                </p>
                <p className="text-lg leading-relaxed">
                  Që nga dita e parë, ne funksionuam sipas një parimi të
                  thjeshtë: trajto çdo klient si familje, dhe çdo automjet si
                  një vepër arti.
                </p>
              </div>
              <div
                className="space-y-6 text-white/60"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <p className="text-lg leading-relaxed">
                  Sot, ne qëndrojmë si destinacioni kryesor i Gjilanit për
                  koleksionistë dhe entuziastë të përzgjedhur. Reputacioni ynë
                  nuk matet me shifrat e shitjeve—ajo matet me marrëdhënie që
                  zgjaten për brezat.
                </p>
                <p className="text-lg leading-relaxed">
                  Ne nuk thjesht shesim makina. Ne ju ndihmojmë të gjeni atë që
                  flet me shpirtin tuaj.
                </p>
              </div>
            </div>

            {/* Signature */}
            <div
              className={`mt-16 lg:mt-24 pt-8 border-t border-white/10 flex items-center gap-6 transition-all duration-1000 ${
                storyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <span
                className="text-white/30 text-sm tracking-wider"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                — AUTO TAFA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Three Pillars */}
      <section className="relative py-32 lg:py-48 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Section Header */}
          <div className="mb-20 lg:mb-32">
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Çfarë na Udhëzon
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Tre shtyllat<span className="text-white/30">.</span>
            </h2>
          </div>

          {/* Values - Horizontal Layout */}
          <div className="grid lg:grid-cols-3 gap-px bg-white/10">
            {[
              {
                num: "01",
                title: "Përsosmëria",
                text: "Përfeksion në çdo detaj. Nga automjetet që gjendjemi në përvojën që ne ofrojmë—ne nuk pranojmë më pak.",
              },
              {
                num: "02",
                title: "Integriteti",
                text: "Transparencë e plotë. Pa agjenda të fshehta, pa surpriza. Besimi juaj është valuta jonë më e vlefshme.",
              },
              {
                num: "03",
                title: "Trashëgimi",
                text: "Marrëdhënie mbi transaksionet. Ne ndërtojmë lidhje që zgjaten për brezat, jo vetëm deri në shitje.",
              },
            ].map((value) => (
              <div
                key={value.num}
                className="bg-black p-10 lg:p-16 group hover:bg-white/2 transition-colors duration-500"
              >
                <span
                  className="text-sm text-white/20 mb-8 block"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {value.num}
                </span>
                <h3
                  className="text-2xl lg:text-3xl font-bold mb-6 text-white"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-500"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="relative py-32 lg:py-48 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Location tag */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <svg
                className="w-4 h-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span
                className="text-xs tracking-[0.3em] uppercase text-white/40"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Gjilan, Kosovë
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Na Vizitoni<span className="text-white/30">.</span>
            </h2>

            <p
              className="text-xl text-white/50 mb-12"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Përjetoni ndryshimin vetë.
            </p>

            {/* Contact Info - Horizontal */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-16 text-white/60"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="text-lg">Hën — Sht: 9:00 – 19:00</span>
              <span className="hidden sm:block text-white/20">|</span>
              <span className="text-lg">+383 44 666 662</span>
            </div>

            {/* CTA Button */}
            <button
              className="group inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-medium tracking-widest uppercase text-sm transition-all duration-300 hover:bg-neutral-100"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Planifiko një Vizitë
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
