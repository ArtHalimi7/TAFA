import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";
import { LazyImage } from "../components/LazyImage";
import { SkeletonGallery } from "../components/Skeleton";
import { carsApi } from "../services/api";
import logo from "../assets/images/logo.png";

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

export default function CarDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [specsVisible, setSpecsVisible] = useState(true);
  const [galleryVisible, setGalleryVisible] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const specsRef = useRef(null);
  const featuresRef = useRef(null);
  const galleryRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(true);

  // Fetch car data from backend
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const response = await carsApi.getCarBySlug(slug);
        if (response.success) {
          // Transform backend data
          const carData = response.data;
          const showcaseIdx = carData.showcase_image || 0;
          setCar({
            ...carData,
            exteriorColor: carData.exterior_color,
            interiorColor: carData.interior_color,
            topSpeed: carData.top_speed,
            fuelType: carData.fuel_type,
            showcaseImage: showcaseIdx,
            // Transform images to full URLs
            images: (carData.images || []).map((img) => getImageUrl(img)),
          });
          // Set initial active image to showcase image
          setActiveImageIndex(showcaseIdx);
        } else {
          setError("Vehicle not found");
        }
      } catch (err) {
        console.error("Error fetching car:", err);
        setError("Failed to load vehicle details");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCar();
    }
  }, [slug]);

  // Dynamic SEO for car detail page
  useSEO(
    seoContent.carDetail({
      year: car?.year || "",
      make: car?.name?.split(" ")[0] || "",
      model: car?.name || "",
      mileage: car?.mileage || 0,
      transmission: car?.transmission || "",
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animate price counting
  useEffect(() => {
    if (isLoaded && car && car.price) {
      const duration = 1500;
      const startTime = Date.now();
      const target = car.price;

      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setAnimatedPrice(Math.floor(target * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedPrice(target);
        }
      };
      animate();
    }
  }, [isLoaded, car]);

  // Intersection observers for sections
  useEffect(() => {
    const specsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSpecsVisible(true);
      },
      { threshold: 0.2 },
    );

    const featuresObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFeaturesVisible(true);
      },
      { threshold: 0.2 },
    );

    const galleryObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setGalleryVisible(true);
      },
      { threshold: 0.2 },
    );

    if (specsRef.current) specsObserver.observe(specsRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);
    if (galleryRef.current) galleryObserver.observe(galleryRef.current);

    return () => {
      specsObserver.disconnect();
      featuresObserver.disconnect();
      galleryObserver.disconnect();
    };
  }, []);

  // Keyboard navigation for gallery modal
  useEffect(() => {
    if (!car || !car.images) return;

    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;

      if (e.key === "Escape") {
        setIsGalleryOpen(false);
      } else if (e.key === "ArrowRight") {
        setModalImageIndex((prev) => (prev + 1) % car.images.length);
      } else if (e.key === "ArrowLeft") {
        setModalImageIndex(
          (prev) => (prev - 1 + car.images.length) % car.images.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, car]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGalleryOpen]);

  // Autoplay for hero image slider - starts from showcase image
  useEffect(() => {
    if (
      !isLoaded ||
      isGalleryOpen ||
      !car ||
      !car.images ||
      car.images.length <= 1
    )
      return;

    // Small delay to ensure showcase image is displayed first
    const startDelay = setTimeout(() => {
      const autoplayInterval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % car.images.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(autoplayInterval);
    }, 1000); // Wait 1 second before starting autoplay

    return () => clearTimeout(startDelay);
  }, [isLoaded, isGalleryOpen, car]);

  const openGallery = (index) => {
    setModalImageIndex(index);
    setIsGalleryOpen(true);
  };

  const nextImage = () => {
    if (!car || !car.images) return;
    setActiveImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    if (!car || !car.images) return;
    setActiveImageIndex(
      (prev) => (prev - 1 + car.images.length) % car.images.length,
    );
  };

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    setTouchEnd(endX);

    // Detect swipe direction
    if (!touchStart) return;
    const distance = touchStart - endX;
    const isLeftSwipe = distance > 50; // Swipe left (next image)
    const isRightSwipe = distance < -50; // Swipe right (previous image)

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const specs = car
    ? [
        { label: "Kuaj-fuqi", value: car.horsepower, suffix: "HP" },
        { label: "Tërheqje", value: car.torque, suffix: "Nm" },
        {
          label: "0-100 km/h",
          value: car.acceleration,
          suffix: "s",
          isDecimal: true,
        },
        { label: "Shpejtësia maksimale", value: car.topSpeed, suffix: "km/h" },
      ]
    : [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Duke ngarkuar detajet e mjetit...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            Mjeti nuk u gjend
          </h1>
          <p className="text-white/60 mb-8">
            {error || "Mjeti që po kërkoni nuk ekziston."}
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
          >
            ← Kthehu tek Koleksioni
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24">
        {/* Breadcrumbs */}
        <nav
          className={`px-4 sm:px-6 lg:px-8 mb-4 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
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
                  Faqja kryesore
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  to="/collection"
                  className="text-white/50 hover:text-white transition-colors duration-300"
                >
                  Koleksioni
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white truncate max-w-50 sm:max-w-none">
                {car.name}
              </li>
            </ol>
          </div>
        </nav>

        {/* Main Image */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div
            className="relative max-w-7xl mx-auto aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* All images stacked with fade transitions */}
            {car.images &&
              car.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    activeImageIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              ))}

            {/* Left Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-white/20 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 hover:border-white/40 transition-all duration-300 group"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-white/20 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 hover:border-white/40 transition-all duration-300 group"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image Navigation Dots */}
            <div
              className={`absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "0.8s" }}
            >
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-6 sm:w-12 h-0.5 sm:h-1 rounded-full transition-all duration-500 overflow-hidden ${
                    activeImageIndex === index
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                >
                  {activeImageIndex === index && (
                    <div
                      className="absolute inset-y-0 left-0 bg-white/70 rounded-full"
                      style={{
                        animation: "slideProgress 5s linear forwards",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Autoplay progress animation */}
            <style>{`
            @keyframes slideProgress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
          </div>
        </div>

        {/* Hero Content - Below Image */}
        <div className="py-10 sm:py-12 lg:py-16 px-6 sm:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Left Content */}
              <div className="lg:col-span-2 text-center sm:text-left">
                {/* Category Badge */}
                <div
                  className={`inline-block mb-4 transition-all duration-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: "0.2s" }}
                >
                  <span
                    className="px-4 py-1.5 border border-white/30 rounded-full text-xs font-medium tracking-[0.2em] uppercase text-white/80"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {car.category}
                  </span>
                </div>

                {/* Car Name */}
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 transition-all duration-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    fontFamily: "Cera Pro, sans-serif",
                    letterSpacing: "-0.02em",
                    transitionDelay: "0.3s",
                  }}
                >
                  {car.name}
                </h1>

                {/* Tagline */}
                <p
                  className={`text-lg sm:text-xl lg:text-2xl text-white/60 mb-8 transition-all duration-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 300,
                    transitionDelay: "0.4s",
                  }}
                >
                  {car.tagline}
                </p>

                {/* Quick Stats Row */}
                <div
                  className={`flex flex-wrap gap-6 sm:gap-10 lg:gap-16 justify-center sm:justify-start transition-all duration-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: "0.5s" }}
                >
                  <div className="flex flex-col">
                    <span
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {car.year}
                    </span>
                    <span
                      className="text-xs text-white/50 uppercase tracking-widest mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Viti
                    </span>
                  </div>
                  <div className="w-px h-12 bg-white/20 hidden sm:block" />
                  <div className="flex flex-col">
                    <span
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {car.mileage.toLocaleString()}
                    </span>
                    <span
                      className="text-xs text-white/50 uppercase tracking-widest mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kilometra
                    </span>
                  </div>
                  <div className="w-px h-12 bg-white/20 hidden sm:block" />
                  <div className="flex flex-col">
                    <span
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {formatPrice(animatedPrice)}
                    </span>
                    <span
                      className="text-xs text-white/50 uppercase tracking-widest mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Çmimi
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Logo */}
              <div
                className={`hidden lg:flex items-center justify-center mt-12 transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "0.6s" }}
              >
                <img
                  src={logo}
                  alt="TAFA Logo"
                  className="w-full h-auto max-w-[200px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Specs Section */}
      <section
        ref={specsRef}
        className="relative py-20 lg:py-32 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Section Header */}
          <div className="mb-12 lg:mb-20">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${
                specsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Performanca<span className="text-white/30">.</span>
            </h2>
            <p
              className={`text-white/60 max-w-xl transition-all duration-1000 delay-100 ${
                specsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Fuqia e pastër takohet me inxhinierinë e rafinuar. Numrat që
              përcaktojnë përsosmërinë.
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`group relative p-6 lg:p-8 border border-white/10 rounded-lg hover:border-white/30 transition-all duration-500 ${
                  specsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {spec.isDecimal ? spec.value.toFixed(1) : spec.value}
                    </span>
                    <span
                      className="text-lg sm:text-xl text-white/50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {spec.suffix}
                    </span>
                  </div>
                  <p
                    className="text-xs sm:text-sm text-white/50 uppercase tracking-widest"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {spec.label}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Engine & Drivetrain Details */}
          <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div
              className={`space-y-6 transition-all duration-1000 ${
                specsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="space-y-4">
                {[
                  { label: "Motor", value: car.engine },
                  { label: "Transmision", value: car.transmission },
                  { label: "Tërheqja", value: car.drivetrain },
                  { label: "Lloji i karburantit", value: car.fuelType },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-3 border-b border-white/10 group hover:border-white/30 transition-colors duration-300"
                  >
                    <span
                      className="text-white/50 text-sm uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-white text-sm lg:text-base font-medium group-hover:translate-x-1 transition-transform duration-300"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`space-y-6 transition-all duration-1000 ${
                specsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="space-y-4">
                {[
                  { label: "Ngjyra e jashtme", value: car.exteriorColor },
                  { label: "Ngjyra e interierit", value: car.interiorColor },
                  { label: "Konsum i karburantit", value: car.mpg },
                  { label: "VIN", value: car.vin },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-3 border-b border-white/10 group hover:border-white/30 transition-colors duration-300"
                  >
                    <span
                      className="text-white/50 text-sm uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-white text-sm lg:text-base font-medium group-hover:translate-x-1 transition-transform duration-300"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative py-20 lg:py-32 bg-linear-to-b from-black via-neutral-950 to-black"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Section Header */}
          <div className="mb-12 lg:mb-20 text-center">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${
                featuresVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Veçoritë<span className="text-white/30">.</span>
            </h2>
            <div
              className={`w-16 h-1 bg-white mx-auto mb-6 transition-all duration-1000 delay-100 ${
                featuresVisible
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-0"
              }`}
              style={{ transformOrigin: "center" }}
            />
            <p
              className={`text-white/60 max-w-xl mx-auto transition-all duration-1000 delay-200 ${
                featuresVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              I pajisur me teknologjinë dhe mjeshtërinë më të mirë
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {car.features.map((feature, index) => (
              <div
                key={feature}
                className={`group relative p-5 lg:p-6 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 transition-all duration-500 cursor-default min-h-18 flex items-center ${
                  featuresVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + index * 50}ms` }}
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Check icon */}
                  <div className="shrink-0 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                    <svg
                      className="w-3 h-3 text-white/60 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-sm lg:text-base text-white/80 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div
            className={`mt-16 lg:mt-24 max-w-3xl mx-auto text-center transition-all duration-1000 ${
              featuresVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <p
              className="text-lg lg:text-xl text-white/70 leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
            >
              {car.description}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        ref={galleryRef}
        className="relative py-20 lg:py-32 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Section Header */}
          <div className="mb-12 lg:mb-16">
            <div className="flex items-end justify-between">
              <div>
                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${
                    galleryVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  Galeria<span className="text-white/30">.</span>
                </h2>
                <p
                  className={`text-white/60 transition-all duration-1000 delay-100 ${
                    galleryVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Eksploro çdo kënd të këtij kryevepri
                </p>
              </div>
              <div
                className={`hidden sm:flex items-center gap-2 text-white/50 text-sm transition-all duration-1000 delay-200 ${
                  galleryVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Klikoni për të zmadhuar</span>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {car.images.map((image, index) => (
              <button
                key={index}
                onClick={() => openGallery(index)}
                className={`group relative aspect-4/3 overflow-hidden rounded-lg transition-all duration-700 ${
                  galleryVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Image */}
                <LazyImage
                  src={image}
                  alt={`${car.name} - View ${index + 1}`}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

                {/* Expand Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-white/10 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Image Number */}
                <div
                  className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {index + 1} / {car.images.length}
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/60 rounded-tr-lg transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/0 group-hover:border-white/60 rounded-bl-lg transition-colors duration-300" />
              </button>
            ))}
          </div>

          {/* View All Button - for when you have more images */}
          {car.images.length > 8 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => openGallery(0)}
                className="px-8 py-3 border border-white/30 text-white/80 font-medium tracking-wider uppercase text-sm hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300 rounded-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Shiko të gjitha {car.images.length} fotografitë
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Price & Info */}
            <div className="text-center lg:text-left">
              <p
                className="text-sm text-white/50 uppercase tracking-widest mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Çmimi i listuar
              </p>
              <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                <span
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {formatPrice(car.price)}
                </span>
              </div>
              <p
                className="mt-4 text-white/50 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Financim i disponueshëm • Pranohen këmbime
              </p>
            </div>

            {/* Right side - CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  navigate("/contact", {
                    state: { carName: car.name, carSlug: slug },
                  })
                }
                className="group px-10 py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] rounded-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span className="flex items-center justify-center gap-3">
                  Rezervo Termin
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
                </span>
              </button>
              <a
                href="tel:+38344666662"
                className="group flex items-center justify-center gap-2.5 px-6 py-3.5 border border-white/30 rounded-full backdrop-blur-md bg-black/60 hover:bg-black/80 hover:border-white/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium tracking-wide text-white">
                  Na kontaktoni
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/98 flex flex-col"
          onClick={() => setIsGalleryOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6">
            {/* Image Counter */}
            <div
              className="text-white/60 text-sm tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white font-medium">
                {modalImageIndex + 1}
              </span>
              <span className="mx-2">/</span>
              <span>{car.images.length}</span>
            </div>

            {/* Car Name */}
            <div
              className="hidden sm:block text-white/80 text-sm tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {car.name}
            </div>

            {/* Close Button */}
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              onClick={() => setIsGalleryOpen(false)}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Main Image Area */}
          <div
            className="flex-1 flex items-center justify-center px-2 sm:px-16 lg:px-24 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-6 lg:left-12 z-10 w-10 h-10 sm:w-14 sm:h-14 items-center justify-center border border-white/20 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 group flex"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={car.images[modalImageIndex]}
                alt={`${car.name} - View ${modalImageIndex + 1}`}
                className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain select-none transition-opacity duration-300 pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-6 lg:right-12 z-10 w-10 h-10 sm:w-14 sm:h-14 items-center justify-center border border-white/20 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 group flex"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Mobile Swipe Hint */}
            <div
              className="absolute sm:bottom-20 bottom-24 left-1/2 -translate-x-1/2 sm:hidden text-white/40 text-xs tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Rrëshqit për të naviguar
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div
            className="pt-2 sm:pt-3 pb-4 sm:pb-6 px-4 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 lg:w-24 lg:h-16 rounded-md overflow-hidden transition-all duration-300 ${
                    modalImageIndex === index
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Keyboard hint */}
            <div
              className="hidden sm:flex justify-center mt-3 gap-4 text-white/30 text-xs"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/50">
                  ←
                </kbd>
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/50">
                  →
                </kbd>
                <span className="ml-1">Lëviz</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/50">
                  ESC
                </kbd>
                <span className="ml-1">Mbyll</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <button className="group w-14 h-14 bg-black/70 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-95 hover:bg-black/90 hover:border-white/40 transition-all duration-300">
          <div className="relative">
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {/* Pulse ring animation */}
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-30" />
          </div>
        </button>
      </div>
    </main>
  );
}
