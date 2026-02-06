import { useState, useEffect, useRef } from "react";
import {
  ClipboardCheck,
  Zap,
  Clock,
  Scale,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import logo from "../assets/images/logo.png";

export default function WhyCurated() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      number: "01",
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Inspektim rigoroz",
      description:
        "Çdo automjet i nënshtrohet protokollit tonë gjithëpërfshirës të inspektimit te detajuar. Ne verifikojmë autenticitetin dhe përsosmërinë mekanike.",
    },
    {
      number: "02",
      icon: <Zap className="w-8 h-8" />,
      title: "Performancë e Verifikuar",
      description:
        "Çdo makinë testohet në mënyrë dinamike për të siguruar performancën maksimale. Nga përshpejtimi te manovrimi, ne synojmë performancë optimale.",
    },
    {
      number: "03",
      icon: <Clock className="w-8 h-8" />,
      title: "Histori e Qartë",
      description:
        "Dokumentacion i plotë historik. Regjistrimet e serviseve, transferimet e pronësisë dhe certifikatat e autenticitetit përfshihen me çdo blerje.",
    },
    {
      number: "04",
      icon: <Scale className="w-8 h-8" />,
      title: "Vlerësim i Drejtë",
      description:
        "Çmim transparent bazuar në të dhënat e tregut dhe gjendjen e automjetit. Pa tarifa të fshehura.",
    },
    {
      number: "05",
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Proces i Thjeshtë",
      description:
        "Nga kontakti i parë deri te marrja e makinës, gjithçka kryhet në mënyrë të drejtpërdrejtë dhe pa komplikime.",
    },
    {
      number: "06",
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Komunikim i Drejtë",
      description:
        "Flasim hapur për çdo detaj të automjetit. Pa presion. Pa surpriza.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-[#1a1a1a] text-white overflow-hidden"
    >
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
              <div className="h-full flex flex-col items-start p-8 lg:p-10 border border-white/15 hover:border-white/35 bg-white/8 transition-all duration-500 rounded-lg">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span
                  className="text-5xl font-bold text-white/45 group-hover:text-white/65 transition-colors duration-300 mb-6"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {feature.number}
                </span>

                {/* Icon (no circle/border) */}
                <div className="w-12 h-12 flex items-center justify-center mb-6 text-white/65 group-hover:text-white/85 transition-all duration-300">
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
          className={`mt-10 lg:mt-16 pt-8 lg:pt-12 border-t border-white/15 max-w-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p
            className="text-2xl lg:text-3xl font-light leading-relaxed text-white"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Nuk është thjeshtë një blerje makine.
            <span className="block font-bold mt-4">
              Është besim i ndërtuar ndër vite.
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
      {/* Bottom gradient to smoothly fade from #1a1a1a to black for the next section */}
      <div className="absolute left-0 right-0 bottom-0 h-96 lg:h-144 pointer-events-none bg-linear-to-b from-[#1a1a1a] via-[#000000] to-black opacity-100" />
    </section>
  );
}
