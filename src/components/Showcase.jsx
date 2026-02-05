import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LazyImageContain } from "./LazyImage";
import { carsApi } from "../services/api";

// API Base URL for images
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

// Helper to get full image URL
const getImageUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  )
    return path;
  return `${API_BASE_URL}${path}`;
};

// Format price in EUR
const formatPrice = (price) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Showcase() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef(null);

  // Handle mouse movement for subtle parallax effect
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Fetch showcase vehicle from backend
  useEffect(() => {
    const fetchShowcaseCar = async () => {
      try {
        setIsLoading(true);
        const response = await carsApi.getShowcaseCar();
        if (response.success && response.data) {
          const car = response.data;
          setVehicle({
            id: car.id,
            name: car.name,
            slug: car.slug,
            tagline: car.tagline || "The Pinnacle of Automotive Excellence",
            category: car.category,
            brand: car.brand,
            status: car.status,
            price: car.price,
            discountPrice: car.discountPrice,
            formattedPrice: formatPrice(car.discountPrice || car.price),
            formattedOriginalPrice: car.discountPrice
              ? formatPrice(car.price)
              : null,
            year: car.year,
            mileage: car.mileage,
            engine: car.engine,
            horsepower: car.horsepower,
            torque: car.torque,
            acceleration: car.acceleration,
            topSpeed: car.top_speed,
            transmission: car.transmission,
            drivetrain: car.drivetrain,
            fuelType: car.fuel_type,
            exteriorColor: car.exterior_color,
            interiorColor: car.interior_color,
            image:
              car.images && car.images.length > 0
                ? getImageUrl(car.images[car.showcase_image || 0])
                : "/placeholder-car.jpg",
            images: car.images ? car.images.map(getImageUrl) : [],
            features: car.features || [],
            description: car.description,
          });
        } else {
          setVehicle(null);
        }
      } catch (err) {
        console.error("Error fetching showcase car:", err);
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowcaseCar();
  }, []);

  // Don't render if no showcase car is set
  if (!isLoading && !vehicle) {
    return null;
  }

  // Skeleton loading state
  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="mt-4 text-white/40 text-sm tracking-widest uppercase">
            Loading Showcase
          </p>
        </div>
      </section>
    );
  }

  const specs = [
    {
      label: "Fuqia",
      value: vehicle.horsepower ? `${vehicle.horsepower} HP` : null,
      icon: "⚡",
    },
    {
      label: "0-100 km/h",
      value: vehicle.acceleration ? `${vehicle.acceleration}s` : null,
      icon: "🚀",
    },
    {
      label: "Shpejtësia Max",
      value: vehicle.topSpeed ? `${vehicle.topSpeed} km/h` : null,
      icon: "💨",
    },
    { label: "Motori", value: vehicle.engine, icon: "🔧" },
  ].filter((spec) => spec.value);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      {/* Dramatic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient spotlight effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse 80% 50% at ${50 + mousePosition.x * 10}% ${40 + mousePosition.y * 10}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            transition: isHovering ? "none" : "background 0.5s ease-out",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Animated accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Crown/Exclusive Badge - Top Center */}
      <div
        className={`absolute top-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Crown Icon */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-amber-400/30 animate-pulse" />
            <svg
              className="w-8 h-8 text-amber-400 relative z-10 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>

          {/* Exclusive Label */}
          <div className="px-6 py-2 border border-amber-400/30 rounded-full backdrop-blur-sm bg-black/50">
            <span
              className="text-xs font-semibold text-amber-300 tracking-[0.3em] uppercase"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Podium
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        {/* Left Side - Vehicle Info (on desktop) */}
        <div
          className={`w-full lg:w-2/5 xl:w-1/3 lg:pr-8 xl:pr-16 mb-8 lg:mb-0 order-2 lg:order-1 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            {/* Category & Year */}
            <div className="flex items-center gap-4 mb-4">
              <span
                className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60 tracking-widest uppercase"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {vehicle.category}
              </span>
              <span
                className="text-white/40 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {vehicle.year}
              </span>
            </div>

            {/* Vehicle Name */}
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-[0.9]"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              {vehicle.name}
            </h2>

            {/* Tagline */}
            {vehicle.tagline && (
              <p
                className="text-white/50 text-lg lg:text-xl mb-8 italic"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                "{vehicle.tagline}"
              </p>
            )}

            {/* Elegant Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-linear-to-r from-white/20 to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-white/20" />
              <div className="flex-1 h-px bg-linear-to-l from-white/20 to-transparent" />
            </div>

            {/* Specs Grid */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="group p-4 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm opacity-60">{spec.icon}</span>
                      <span
                        className="text-xs text-white/40 uppercase tracking-wider"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {spec.label}
                      </span>
                    </div>
                    <p
                      className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Price Section */}
            <div className="mb-8">
              <p
                className="text-xs text-white/40 uppercase tracking-widest mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Çmimi Ekskluziv
              </p>
              <div className="flex items-baseline gap-3">
                {vehicle.formattedOriginalPrice && (
                  <span
                    className="text-xl text-red-400/70 line-through"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {vehicle.formattedOriginalPrice}
                  </span>
                )}
                <span
                  className="text-4xl lg:text-5xl font-bold text-white"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {vehicle.formattedPrice}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to={`/car/${vehicle.slug}`}
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-semibold tracking-wider uppercase text-sm overflow-hidden transition-all duration-500 hover:pr-12"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-amber-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10">Shiko Detajet</span>

              <svg
                className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2"
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
            </Link>

            {/* Sold Badge */}
            {vehicle.status === "sold" && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span
                  className="text-sm font-medium text-red-400 tracking-wider uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  I Shitur
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Vehicle Image */}
        <div
          className={`w-full lg:w-3/5 xl:w-2/3 order-1 lg:order-2 transition-all duration-1000 delay-500 ${
            isLoaded
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-8 scale-95"
          }`}
        >
          <div
            className="relative"
            style={{
              transform: isHovering
                ? `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
                : "none",
              transition: isHovering
                ? "transform 0.1s ease-out"
                : "transform 0.5s ease-out",
            }}
          >
            {/* Dramatic shadow/glow underneath the car */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-linear-to-t from-amber-500/10 to-transparent blur-3xl opacity-50" />

            {/* Main Image Container */}
            <div className="relative aspect-16/10 lg:aspect-video">
              {/* Ambient glow behind image */}
              <div
                className="absolute inset-0 scale-110 blur-3xl opacity-20"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
                }}
              />

              <LazyImageContain
                src={vehicle.image}
                alt={vehicle.name}
                className={`relative z-10 w-full h-full object-contain drop-shadow-2xl ${
                  vehicle.status === "sold" ? "grayscale-50" : ""
                }`}
              />

              {/* Subtle reflection effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/5 rounded-full animate-pulse opacity-50" />
            <div
              className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/5 rounded-full animate-pulse opacity-30"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-400/50 to-transparent transition-all duration-1000 delay-700 ${
          isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      />

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span
          className="text-xs text-white/30 tracking-widest uppercase"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-linear-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  );
}
