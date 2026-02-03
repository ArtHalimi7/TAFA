import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyImageContain } from "./LazyImage";
import { SkeletonFeaturedCard } from "./Skeleton";
import g63Image from "../assets/images/CARS/G63/1.jpg";
import a6Image from "../assets/images/CARS/A6/1.jpg";
import m4Image from "../assets/images/CARS/BMW/1.jpg";

export default function FeaturedCollection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Simulate content loading
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(contentTimer);
    };
  }, []);

  const vehicles = [
    {
      id: 1,
      name: "Mercedes-Benz G-Class G63",
      slug: "mercedes-g63",
      category: "SUV",
      price: "$179,000",
      image: g63Image,
    },
    {
      id: 2,
      name: "2015 BMW M4 Competition",
      slug: "bmw-m4-competition",
      category: "Performance",
      price: "$45,000",
      image: m4Image,
    },
    {
      id: 3,
      name: "2025 Audi A6 40TDI",
      slug: "audi-a6-40tdi",
      category: "Luxury Sedan",
      price: "$58,000",
      image: a6Image,
    },
  ];

  return (
    <section className="relative w-full py-20 lg:py-32 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/95 to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            Featured Collection
          </h2>
          <div
            className={`w-16 h-1 bg-white mx-auto mb-6 transition-all duration-1000 delay-100 ${
              isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transformOrigin: "center" }}
          />
          <p
            className={`text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Curated selection of the world's most prestigious automotive
            masterpieces
          </p>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {!showContent
            ? // Skeleton Loading State
              [...Array(3)].map((_, index) => (
                <SkeletonFeaturedCard key={index} />
              ))
            : vehicles.map((vehicle, index) => (
                <Link
                  to={`/car/${vehicle.slug}`}
                  key={vehicle.id}
                  className={`group relative transition-all duration-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {/* Card Container */}
                  <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative aspect-4/3 overflow-hidden">
                      <LazyImageContain
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Content Below Image */}
                    <div className="p-5 space-y-4">
                      {/* Category Badge */}
                      <div className="inline-block px-3 py-1 bg-white/10 rounded-full">
                        <span
                          className="text-xs font-medium text-white/70 tracking-widest uppercase"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {vehicle.category}
                        </span>
                      </div>

                      {/* Name */}
                      <h3
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        {vehicle.name}
                      </h3>

                      {/* Divider */}
                      <div className="w-full h-px bg-white/10" />

                      {/* Price and Arrow */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-lg font-semibold text-white"
                          style={{ fontFamily: "Cera Pro, sans-serif" }}
                        >
                          {vehicle.price}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-300">
                          <span className="text-white/50 group-hover:text-black transition-colors duration-300">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div
          className={`mt-8 flex justify-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
      </div>
    </section>
  );
}
