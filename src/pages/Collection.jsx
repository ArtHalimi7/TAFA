import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";
import { LazyImage } from "../components/LazyImage";
import { SkeletonCarCard } from "../components/Skeleton";
import { carsApi } from "../services/api";

// Brand logos
import mercedesLogo from "../assets/images/mercedes.png";
import bmwLogo from "../assets/images/bmw.png";
import audiLogo from "../assets/images/audi.png";
import lamboLogo from "../assets/images/lambo.png";
import ferrariLogo from "../assets/images/ferrari.png";
import porscheLogo from "../assets/images/porsche.png";

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

const brands = [
  { name: "Ferrari", logo: ferrariLogo },
  { name: "Mercedes", logo: mercedesLogo },
  { name: "Lamborghini", logo: lamboLogo },
  { name: "BMW", logo: bmwLogo, filter: true },
  { name: "Porsche", logo: porscheLogo },
  { name: "Audi", logo: audiLogo },
];

const categories = [
  "Të gjitha",
  "Performancë",
  "Sedan",
  "Elektrik",
  "SUV",
  "Kupe",
];

const priceRanges = [
  { label: "Të gjitha çmimet", min: 0, max: Infinity },
  { label: "Nën €100K", min: 0, max: 100000 },
  { label: "€100K - €150K", min: 100000, max: 150000 },
  { label: "€150K - €200K", min: 150000, max: 200000 },
  { label: "Mbi €200K", min: 200000, max: Infinity },
];

const years = ["Të gjitha vitet", "2024", "2023", "2022", "2021"];

const sortOptions = [
  { value: "featured", label: "Sipas relevancës" },
  { value: "price-low", label: "Çmimi: ulët në të lartë" },
  { value: "price-high", label: "Çmimi: i lartë në të ulët" },
  { value: "year-new", label: "Viti: Më i ri" },
  { value: "year-old", label: "Viti: Më i vjetër" },
];

const ITEMS_PER_PAGE = 6;

export default function Collection() {
  // SEO optimization for collection page
  useSEO(seoContent.collection);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [allCars, setAllCars] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState(null);

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsContentLoading(true);
        const response = await carsApi.getActiveCars();
        if (response.success) {
          // Transform backend data
          const transformedCars = response.data.map((car) => ({
            ...car,
            // Get first image or placeholder
            image:
              car.images && car.images.length > 0
                ? getImageUrl(car.images[0])
                : "/placeholder-car.jpg",
          }));
          setAllCars(transformedCars);
          setFilteredCars(transformedCars);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setFetchError("Ngarkimi i automjeteve dështoi");
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchCars();
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter cars based on selections
  useEffect(() => {
    let result = [...allCars];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query),
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((car) => selectedBrands.includes(car.brand));
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((car) => car.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(
      (car) =>
        car.price >= selectedPriceRange.min &&
        car.price <= selectedPriceRange.max,
    );

    // Filter by year
    if (selectedYear !== "All Years") {
      result = result.filter((car) => car.year === parseInt(selectedYear));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        result.sort((a, b) => b.year - a.year);
        break;
      case "year-old":
        result.sort((a, b) => a.year - b.year);
        break;
      default:
        // Featured - keep original order
        break;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredCars(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    allCars,
    selectedBrands,
    selectedCategory,
    selectedPriceRange,
    selectedYear,
    sortBy,
    searchQuery,
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSortOpen && !e.target.closest(".sort-dropdown")) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSortOpen]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName],
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory("All");
    setSelectedPriceRange(priceRanges[0]);
    setSelectedYear("All Years");
    setSortBy("featured");
    setSearchQuery("");
  };

  const activeFiltersCount =
    selectedBrands.length +
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedPriceRange.label !== "All Prices" ? 1 : 0) +
    (selectedYear !== "All Years" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
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
                  Faqja kryesore
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white">Koleksioni</li>
            </ol>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            <h1
              className={`text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Koleksioni<span className="text-white/30">.</span>
            </h1>
            <p
              className={`text-white/60 text-lg lg:text-xl max-w-2xl mx-auto transition-all duration-1000 delay-100 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Eksploroni përzgjedhjen tonë të automjeteve më të prestigjioze në
              botë
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Grid Section */}
      <section className="pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Filter Bar */}
          <div
            className={`mb-8 lg:mb-12 transition-all duration-1000 delay-200 relative z-50 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              {/* Mobile Search */}
              <div className="relative flex-1 mr-3">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Kërko makina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:border-white/40 transition-colors duration-300"
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden lg:flex items-center justify-between gap-6 pb-6 border-b border-white/10">
              {/* Search Box */}
              <div className="relative w-72">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Kërko me emër, markë..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-transparent border border-white/20 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                  >
                    <svg
                      className="w-3 h-3 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Brand Filters */}
              <div className="flex items-center gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => toggleBrand(brand.name)}
                    className={`group relative w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      selectedBrands.includes(brand.name)
                        ? "border-white bg-white/15 scale-110"
                        : "border-white/30 hover:border-white/60 hover:bg-white/5"
                    }`}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className={`w-7 h-7 object-contain transition-all duration-300 ${
                        selectedBrands.includes(brand.name)
                          ? "opacity-100 brightness-110"
                          : "opacity-70 group-hover:opacity-100 group-hover:brightness-110"
                      }`}
                      style={
                        brand.filter
                          ? { filter: "brightness(0) invert(1)" }
                          : {}
                      }
                    />
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-5">
                <span className="text-white/50 text-sm">
                  {filteredCars.length} automjete
                </span>

                {/* Custom Sort Dropdown */}
                <div className="relative sort-dropdown">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm transition-all duration-300 ${
                      isSortOpen
                        ? "border-white/60 bg-white/10"
                        : "border-white/30 hover:border-white/50 bg-black/50"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span className="text-white/90 font-medium">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full mt-3 w-56 py-3 bg-black border border-white/20 rounded-xl shadow-2xl transition-all duration-300 z-9999 backdrop-blur-md ${
                      isSortOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 group relative ${
                          sortBy === option.value
                            ? "bg-white/15 text-white border-l-2 border-white"
                            : "text-white/70 hover:text-white hover:bg-white/8"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option.label}</span>
                          {sortBy === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300 underline underline-offset-4"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Pastro të gjitha
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="hidden lg:flex items-center gap-3 mt-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-white text-black"
                      : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ${
              isFilterOpen ? "max-h-150 opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 border border-white/10 rounded-xl space-y-6">
              {/* Brands */}
              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Markat
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {brands.map((brand) => (
                    <button
                      key={brand.name}
                      onClick={() => toggleBrand(brand.name)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                        selectedBrands.includes(brand.name)
                          ? "border-white bg-white/15 scale-105"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className={`w-10 h-10 object-contain transition-all duration-300 ${
                          selectedBrands.includes(brand.name)
                            ? "opacity-100 brightness-110"
                            : "opacity-70"
                        }`}
                        style={
                          brand.filter
                            ? { filter: "brightness(0) invert(1)" }
                            : {}
                        }
                      />
                      <span
                        className={`text-xs transition-colors duration-300 ${
                          selectedBrands.includes(brand.name)
                            ? "text-white"
                            : "text-white/60"
                        }`}
                      >
                        {brand.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Kategoria
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-white text-black"
                          : "border border-white/20 text-white/70"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Gama e Çmimeve
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        selectedPriceRange.label === range.label
                          ? "bg-white text-black"
                          : "border border-white/20 text-white/70"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Viti
                </h3>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        selectedYear === year
                          ? "bg-white text-black"
                          : "border border-white/20 text-white/70"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Rendit sipas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        sortBy === option.value
                          ? "bg-white text-black"
                          : "border border-white/20 text-white/70"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 border border-white/20 rounded-lg text-sm text-white/70 hover:border-white/40 hover:text-white transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Pastro të gjitha filtrat
                </button>
              )}
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {isContentLoading
              ? // Skeleton Loading State
                [...Array(6)].map((_, index) => <SkeletonCarCard key={index} />)
              : paginatedCars.map((car, index) => (
                  <Link
                    to={`/car/${car.slug}`}
                    key={`${car.id}-${index}-${currentPage}`}
                    className={`group relative transition-all duration-700 ${
                      isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${100 + index * 50}ms` }}
                  >
                    {/* Card */}
                    <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
                      {/* Image Container */}
                      <div className="relative aspect-4/3 overflow-hidden">
                        <LazyImage
                          src={car.image}
                          alt={car.name}
                          className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Content Below Image */}
                      <div className="p-5 space-y-4">
                        {/* Top Row - Category and Year */}
                        <div className="flex items-center justify-between">
                          <span
                            className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/70 tracking-wider uppercase"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {car.category}
                          </span>
                          <span
                            className="text-sm text-white/50"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {car.year}
                          </span>
                        </div>

                        {/* Name */}
                        <h3
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: "Cera Pro, sans-serif" }}
                        >
                          {car.name}
                        </h3>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/10" />

                        {/* Price and Mileage Row */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span
                              className="text-xl font-bold text-white"
                              style={{ fontFamily: "Cera Pro, sans-serif" }}
                            >
                              {formatPrice(car.price)}
                            </span>
                            <span
                              className="text-white/40 text-sm ml-2"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {car.mileage.toLocaleString()} km
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                            <svg
                              className="w-4 h-4 text-white/50 group-hover:text-black transition-colors duration-300"
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
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute -inset-0.5 bg-linear-to-r from-white/20 via-white/5 to-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                  </Link>
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  currentPage === 1
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? "bg-white text-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  currentPage === totalPages
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Results Info */}
          {filteredCars.length > 0 && (
            <p
              className="text-center text-white/40 text-sm mt-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Tregohen {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCars.length)} nga{" "}
              {filteredCars.length} automjete
            </p>
          )}

          {/* Empty State */}
          {filteredCars.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-white/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Nuk u gjetën automjete
              </h3>
              <p
                className="text-white/50 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Provoni të rregulloni filtrat për të parë më shumë rezultate
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Pastro filtrat
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
