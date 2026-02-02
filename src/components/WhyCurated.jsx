import { useState, useEffect, useRef } from "react";

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
      title: "Rigorous Inspection",
      description:
        "Every vehicle undergoes our comprehensive 200-point inspection protocol. We verify authenticity, mechanical excellence, and pristine condition.",
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
      title: "Performance Verified",
      description:
        "Every car is dynamically tested to ensure peak performance. From acceleration to handling, we guarantee perfection.",
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
      title: "Genuine Provenance",
      description:
        "Complete history documentation. Service records, ownership transfers, and authenticity certificates included with every purchase.",
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
      title: "Fair Valuation",
      description:
        "Transparent pricing based on market data, condition, and rarity. No hidden markups or surprise fees.",
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
      title: "Lifetime Support",
      description:
        "Ownership never ends with us. Concierge service, maintenance guidance, and expert advice available 24/7.",
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
      title: "Bespoke Services",
      description:
        "Custom solutions including financing, insurance coordination, and specialized delivery options.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-48 bg-stone-50 text-black overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -right-1/4 w-200 h-200 rounded-full bg-black/2 blur-3xl transition-all duration-[2s] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <div
          className={`absolute -bottom-1/4 -left-1/4 w-150 h-150 rounded-full bg-black/1 blur-3xl transition-all duration-[2s] delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-20 lg:mb-32">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase text-black/40 mb-6 block"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Difference
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
            Why We're
            <br />
            <span className="text-black/40">Different</span>
          </h2>

          <p
            className={`text-lg lg:text-xl text-black/70 leading-relaxed max-w-2xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              transitionDelay: "200ms",
            }}
          >
            In a world of dealerships, we stand apart. Our commitment to
            excellence means every detail matters, from curation to clientele.
          </p>
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
              <div className="h-full flex flex-col p-8 lg:p-10 border border-black/20 hover:border-black/40 hover:bg-black/5 transition-all duration-500 rounded-lg">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span
                  className="text-5xl font-bold text-black/40 group-hover:text-black/60 transition-colors duration-300 mb-6"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full border border-black/30 flex items-center justify-center mb-6 text-black/60 group-hover:text-black/80 group-hover:border-black/60 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl lg:text-2xl font-bold mb-4 text-black"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-black/75 leading-relaxed grow group-hover:text-black/90 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 w-0 h-px bg-black/50 group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Statement */}
        <div
          className={`mt-20 lg:mt-32 pt-20 lg:pt-32 border-t border-black/20 max-w-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p
            className="text-2xl lg:text-3xl font-light leading-relaxed text-black"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            This isn't just about buying a car.
            <span className="block font-bold mt-4">
              It's about joining a legacy of excellence.
            </span>
          </p>

          {/* Signature line */}
          <div className="flex items-center gap-6 mt-10">
            <div className="w-12 h-px bg-black/50" />
            <span
              className="text-sm text-black/60 tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Excellence is our standard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
