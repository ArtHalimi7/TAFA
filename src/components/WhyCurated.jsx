import { useState, useEffect, useRef } from "react";
import logo from "../assets/images/logo.png";

export default function WhyCurated() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      number: "01",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      title: "Inspektim rigoroz",
      description:
        "Çdo automjet i nënshtrohet protokollit tonë gjithëpërfshirës të inspektimit prej 200 pikash. Ne verifikojmë autenticitetin dhe përsosmërinë mekanike.",
    },
    {
      number: "02",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Performancë e Verifikuar",
      description:
        "Çdo makinë testohet në mënyrë dinamike për të siguruar performancën maksimale. Nga përshpejtimi te manovrimi, ne synojmë performancë optimale.",
    },
    {
      number: "03",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.828 14.828a4 4 0 01-5.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Histori e Qartë",
      description:
        "Dokumentacion i plotë historik. Regjistrimet e serviseve, transferimet e pronësisë dhe certifikatat e autenticitetit përfshihen me çdo blerje.",
    },
    {
      number: "04",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Vlerësim i Drejtë",
      description:
        "Çmim transparent bazuar në të dhënat e tregut dhe gjendjen e automjetit. Pa tarifa të fshehura.",
    },
    {
      number: "05",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      title: "Proces i Thjeshtë",
      description:
        "Nga kontakti i parë deri te marrja e makinës, gjithçka mbahet e drejtpërdrejtë dhe pa komplikime.",
    },
    {
      number: "06",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: "Komunikim i Drejtë",
      description:
        "Flasim hapur për çdo detaj të automjetit. Pa presion. Pa surpriza.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-48 bg-[#1a1a1a] text-white overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -right-1/4 w-200 h-200 rounded-full bg-white/8 blur-3xl transition-all duration-[2s] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <div
          className={`absolute -bottom-1/4 -left-1/4 w-150 h-150 rounded-full bg-white/6 blur-3xl transition-all duration-[2s] delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        {/* Header with Logo */}
        <div className="grid lg:grid-cols-3 gap-12 items-start mb-20 lg:mb-32">
          {/* Left Content - 2 columns on large */}
          <div className="lg:col-span-2 max-w-3xl">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6 block"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Diferenca
              </span>
            </div>

            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "Cera Pro, sans-serif",
                transitionDelay: "100ms",
              }}
            >
              Pse jemi
              <br />
              <span className="text-white/50">Ndryshe</span>
            </h2>

            <p
              className={`text-lg lg:text-xl text-white/75 leading-relaxed max-w-2xl transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                transitionDelay: "200ms",
              }}
            >
              Në një treg me shumë autosallone, ne dallohemi. Angazhimi ynë ndaj
              përsosmërisë do të thotë që çdo detaj ka rëndësi.
            </p>
          </div>

          {/* Right Logo - Positioned top right with dark overlay, mobile responsive */}
          <div
            className={`absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-96 lg:h-96 -top-2 sm:-top-20 lg:-top-20 right-1 sm:-right-24 lg:-right-32 transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative w-full h-full">
              {/* Logo */}
              <img
                src={logo}
                alt="TAFA Logo"
                className="relative w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`group relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Card */}
              <div className="h-full flex flex-col items-start p-8 lg:p-10 border border-white/15 hover:border-white/35 hover:bg-white/8 transition-all duration-500 rounded-lg">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span
                  className="text-5xl font-bold text-white/45 group-hover:text-white/65 transition-colors duration-300 mb-6"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center mb-6 text-white/65 group-hover:text-white/85 group-hover:border-white/55 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl lg:text-2xl font-bold mb-4 text-white h-16 flex items-start"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-white/80 leading-relaxed grow group-hover:text-white/95 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 w-0 h-px bg-white/45 group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Statement */}
        <div
          className={`mt-20 lg:mt-32 pt-20 lg:pt-32 border-t border-white/15 max-w-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p
            className="text-2xl lg:text-3xl font-light leading-relaxed text-white"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Kjo nuk është thjesht për të blerë një makinë.
            <span className="block font-bold mt-4">
              Bëhet fjalë për besim të ndërtuar ndër vite.
            </span>
          </p>

          {/* Signature line */}
          <div className="flex items-center gap-6 mt-10">
            <div className="w-12 h-px bg-white/45" />
            <span
              className="text-sm text-white/65 tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Përsosmëria është standardi ynë
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
