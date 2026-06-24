import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";
import { LazyImage } from "../components/LazyImage";
import { SkeletonCarCard } from "../components/Skeleton";
import { carsApi } from "../services/api";
import { SHOW_PRICES } from "../config";

function CustomSelect({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full px-4 py-3 bg-transparent border rounded-lg text-sm text-left flex items-center justify-between transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        } ${open ? "border-white/40" : "border-white/20 hover:border-white/40"}`}
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <span className={selected ? "text-white/90" : "text-white/40"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-[9999] left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-black border border-white/20 rounded-xl shadow-2xl py-2">
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!value ? "bg-white/15 text-white border-l-2 border-white" : "text-white/60 hover:text-white hover:bg-white/8"}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt.value ? "bg-white/15 text-white border-l-2 border-white" : "text-white/70 hover:text-white hover:bg-white/8"}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



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

const sortOptions = [
  { value: "featured", label: "Sipas relevancës" },
  { value: "price-low", label: "Çmimi: ulët në të lartë" },
  { value: "price-high", label: "Çmimi: i lartë në të ulët" },
  { value: "year-new", label: "Viti: Më i ri" },
  { value: "year-old", label: "Viti: Më i vjetër" },
];

const yearOptions = Array.from({ length: 18 }, (_, i) => String(2026 - i));

const PREMIUM_BRANDS = [
  "Audi", "Bentley", "BMW", "Bugatti", "Ferrari", "Lamborghini",
  "Land Rover", "Lexus", "Maserati", "McLaren", "Mercedes",
  "Porsche", "Rolls-Royce", "Tesla", "Volvo",
];

const ALL_BRANDS = [
  ...PREMIUM_BRANDS,
  "Alfa Romeo", "Alpine", "Aston Martin", "Chevrolet", "Citroen", "Cupra",
  "Daewoo", "Dodge", "DS", "Fiat", "Ford", "Genesis", "Honda", "Hyundai", "Jaguar",
  "Jeep", "KG Mobility", "Kia", "Lotus", "Mazda", "Mini", "Mitsubishi",
  "Nissan", "Opel", "Pagani", "Peugeot", "Polestar", "Renault",
  "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Toyota",
  "Volkswagen",
];

const ALL_CATEGORIES = [
  "SUV", "Sedan", "Kupe", "Kabriolet", "Haxhbek",
  "Karavan", "Minivan", "Pickup", "Elektrik", "Performancë",
];

const MODELS_BY_BRAND = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "e-tron GT", "Q2", "Q3", "Q4 e-tron", "Q5", "Q6 e-tron", "Q7", "Q8", "R8", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8", "TT"],
  "Bentley": ["Azure", "Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "i3", "i4", "i5", "i7", "iX", "iX1", "iX3", "M2", "M3", "M4", "M5", "M8", "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "XM", "Z4"],
  "Bugatti": ["Bolide", "Chiron", "Divo", "Mistral", "La Voiture Noire", "Tourbillon", "Veyron"],
  "Ferrari": ["296 GTB", "296 GTS", "348", "360", "412", "456", "458", "488", "512", "599", "612", "812 Superfast", "812 GTS", "California", "Daytona SP3", "Enzo", "F8 Tributo", "F8 Spider", "F40", "F50", "GTC4Lusso", "LaFerrari", "Portofino", "Purosangue", "Roma", "SF90 Stradale", "SF90 Spider", "Testarossa"],
  "Lamborghini": ["Aventador", "Countach", "Diablo", "Gallardo", "Huracán", "Murciélago", "Revuelto", "Temerario", "Urus"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Lexus": ["CT", "ES", "GS", "GX", "IS", "LC", "LM", "LS", "LX", "NX", "RC", "RZ", "RX", "TX", "UX"],
  "Maserati": ["Ghibli", "GranCabrio", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  "McLaren": ["570S", "600LT", "650S", "720S", "765LT", "Artura", "Elva", "GT", "P1", "Senna", "Solus GT", "Speedtail"],
  "Mercedes": ["A-Class", "AMG GT", "AMG One", "B-Class", "C-Class", "CLA", "CLE", "CLS", "E-Class", "EQA", "EQB", "EQC", "EQE", "EQS", "EQT", "EQV", "G-Class", "GL-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "Maybach S-Class", "S-Class", "SL", "SLC", "V-Class"],
  "Porsche": ["718", "911", "918 Spyder", "Boxster", "Carrera GT", "Cayenne", "Cayman", "Macan", "Panamera", "Taycan"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Silver Ghost", "Spectre", "Wraith"],
  "Tesla": ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster"],
  "Volvo": ["C40", "EX30", "EX90", "S60", "S80", "S90", "V40", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],
  "Alfa Romeo": ["4C", "33 Stradale", "Giulia", "Giulietta", "Spider", "Stelvio", "Tonale"],
  "Alpine": ["A110", "A290"],
  "Aston Martin": ["DB11", "DB12", "DB5", "DB9", "DBS", "DBX", "Rapide", "Valhalla", "Valkyrie", "Vantage", "Vanquish", "Virgil"],
  "Chevrolet": ["Blazer", "Bolt", "Camaro", "Captiva", "Colorado", "Corvette", "Cruze", "Equinox", "Impala", "Malibu", "Silverado", "Spark", "Suburban", "Tahoe", "TrailBlazer", "Traverse", "Trax"],
  "Citroen": ["Ami", "Berlingo", "C1", "C2", "C3", "C3 Aircross", "C4", "C4 Cactus", "C5", "C5 Aircross", "C6", "DS", "SpaceTourer"],
  "Cupra": ["Ateca", "Born", "Formentor", "Leon", "Tavascan", "Terramar"],
  "Daewoo": ["Espero", "Kalos", "Lacetti", "Lanos", "Leganza", "Matiz", "Nexia", "Nubira", "Prince", "Rezzo", "Tacuma", "Tico"],
  "Dodge": ["Challenger", "Charger", "Durango", "Grand Caravan", "Hornet", "Journey", "Viper"],
  "DS": ["DS 3", "DS 4", "DS 7", "DS 9"],
  "Fiat": ["124 Spider", "500", "500L", "500X", "Doblo", "Ducato", "Fullback", "Panda", "Punto", "Qubo", "Scudo", "Tipo", "Talento"],
  "Ford": ["Bronco", "Edge", "Escape", "Explorer", "F-150", "Fiesta", "Focus", "Fusion", "Galaxy", "Grand C-MAX", "Kuga", "Maverick", "Mondeo", "Mustang", "Mustang Mach-E", "Puma", "Ranger", "S-MAX", "Tourneo", "Transit"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "Honda": ["Accord", "Civic", "CR-V", "CR-Z", "E", "HR-V", "Insight", "Jazz", "NSX", "Odyssey", "Pilot", "Ridgeline", "S2000", "Shuttle"],
  "Hyundai": ["Accent", "Bayon", "Elantra", "Genesis", "Grandeur", "i10", "i20", "i30", "i40", "IONIQ", "IONIQ 5", "IONIQ 6", "IONIQ 9", "Kona", "Nexo", "Palisade", "Santa Fe", "Sonata", "Staria", "Tucson", "Veloster", "Venue"],
  "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF", "XJ", "XK", "XJS"],
  "Jeep": ["Avenger", "Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wagoneer", "Wrangler"],
  "Kia": ["Carens", "Carnival", "Ceed", "EV6", "EV9", "K5", "K9", "Mohave", "Niro", "Optima", "Picanto", "ProCeed", "Rio", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Stonic", "Telluride", "XCeed"],
  "Lotus": ["Eletre", "Elise", "Emeya", "Emira", "Evija", "Evora", "Exige"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-70", "CX-80", "CX-90", "MX-30", "MX-5", "RX-7", "RX-8"],
  "Mini": ["Aceman", "Clubman", "Cooper", "Cooper S", "Countryman", "Electric", "John Cooper Works", "Paceman"],
  "Mitsubishi": ["ASX", "Colt", "Eclipse Cross", "L200", "Lancer", "Outlander", "Pajero", "Shogun", "Space Star", "Triton"],
  "KG Mobility": ["Korando", "Rexton", "Tivoli", "Torres"],
  "Nissan": ["370Z", "Ariya", "GT-R", "Juke", "Leaf", "Micra", "Murano", "Navara", "Note", "Pathfinder", "Patrol", "Primera", "Qashqai", "Skyline", "X-Trail", "Z"],
  "Opel": ["Adam", "Astra", "Cascada", "Combo", "Corsa", "Crossland", "Grandland", "Insignia", "Karl", "Mokka", "Rocks-e", "Vivaro", "Zafira"],
  "Pagani": ["Huayra", "Imola", "Utopia", "Zonda"],
  "Peugeot": ["108", "208", "2008", "3008", "308", "4008", "408", "5008", "508", "508", "e-208", "e-2008", "e-3008", "e-308", "Partner", "Rifter", "Traveller"],
  "Polestar": ["1", "2", "3", "4", "5"],
  "Renault": ["Arkana", "Austral", "Captur", "Clio", "Espace", "Kadjar", "Kangoo", "Laguna", "Master", "Megane", "Rafale", "Scenic", "Talisman", "Trafic", "Twingo", "Zoe"],
  "Seat": ["Alhambra", "Arona", "Ateca", "Ibiza", "Leon", "Mii", "Tarraco"],
  "Skoda": ["Citigo", "Enyaq", "Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Rapid", "Scala", "Superb", "Yeti"],
  "Smart": ["#1", "#3", "Forfour", "Fortwo"],
  "SsangYong": ["Korando", "Korando Family", "Musso", "Rexton", "Rodius", "Stavic", "Tivoli", "Tivoli XLV"],
  "Subaru": ["Ascent", "BRZ", "Forester", "Impreza", "Legacy", "Levorg", "Outback", "Solterra", "WRX", "XV"],
  "Suzuki": ["Across", "Alto", "Baleno", "Celerio", "Ignis", "Jimny", "S-Cross", "Swace", "Swift", "Vitara"],
  "Toyota": ["4Runner", "Aygo", "bZ4X", "C-HR", "Camry", "Celica", "Corolla", "FJ Cruiser", "GR Yaris", "GR86", "GT86", "Hiace", "Highlander", "Hilux", "Land Cruiser", "Mirai", "MR2", "Prado", "Prius", "Proace", "RAV4", "Sequoia", "Sienna", "Supra", "Tacoma", "Tundra", "Urban Cruiser", "Yaris", "Yaris Cross"],
  "Volkswagen": ["Amarok", "Arteon", "Beetle", "Caddy", "California", "Caravelle", "Golf", "ID.3", "ID.4", "ID.5", "ID.7", "ID.Buzz", "Jetta", "Lavida", "Nivus", "Passat", "Phaeton", "Polo", "Scirocco", "Sharan", "Taigo", "Taos", "T-Cross", "Tiguan", "Touareg", "Touran", "Transporter", "T-Roc", "Up!", "Virtus"],
};

const ITEMS_PER_PAGE = 9;

// Helper to get saved filters from localStorage
const getSavedFilters = () => {
  try {
    const saved = localStorage.getItem("collectionFilters");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading filters from localStorage:", e);
  }
  return null;
};

// Helper to generate pagination numbers with ellipses to prevent layout breaking
const getPageNumbers = (currentPage, totalPages) => {
  const maxButtons = 7;
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If near the beginning
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  // If near the end
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If in the middle
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export default function Collection() {
  // SEO optimization for collection page
  useSEO(seoContent.collection);

  // Initialize filters from localStorage or defaults
  const savedFilters = getSavedFilters();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [allCars, setAllCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(
    savedFilters?.selectedBrand || "",
  );
  const [selectedModel, setSelectedModel] = useState(
    savedFilters?.selectedModel || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    savedFilters?.selectedCategory || "",
  );
  const [selectedFuelType, setSelectedFuelType] = useState(
    savedFilters?.selectedFuelType || "",
  );
  const [selectedDrivetrain, setSelectedDrivetrain] = useState(
    savedFilters?.selectedDrivetrain || "",
  );
  const [selectedOrigin, setSelectedOrigin] = useState(
    savedFilters?.selectedOrigin || "",
  );
  const [yearFrom, setYearFrom] = useState(
    savedFilters?.yearFrom || "",
  );
  const [priceUpTo, setPriceUpTo] = useState(
    savedFilters?.priceUpTo || "",
  );
  const [kmUpTo, setKmUpTo] = useState(
    savedFilters?.kmUpTo || "",
  );
  const [sortBy, setSortBy] = useState(savedFilters?.sortBy || "featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    savedFilters?.searchQuery || "",
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      selectedBrand,
      selectedModel,
      selectedCategory,
      selectedFuelType,
      selectedDrivetrain,
      selectedOrigin,
      yearFrom,
      priceUpTo,
      kmUpTo,
      sortBy,
      searchQuery,
    };
    localStorage.setItem("collectionFilters", JSON.stringify(filters));
  }, [
    selectedBrand,
    selectedModel,
    selectedCategory,
    selectedFuelType,
    selectedDrivetrain,
    selectedOrigin,
    yearFrom,
    priceUpTo,
    kmUpTo,
    sortBy,
    searchQuery,
  ]);

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsContentLoading(true);
        const response = await carsApi.getActiveCars({ limit: 500 });
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
    if (selectedBrand) {
      result = result.filter((car) => car.brand === selectedBrand);
    }

    // Filter by model (partial match against car name)
    if (selectedModel) {
      const modelQuery = selectedModel.toLowerCase();
      result = result.filter((car) => car.name.toLowerCase().includes(modelQuery));
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((car) => car.category === selectedCategory);
    }

    // Filter by fuel type
    if (selectedFuelType) {
      result = result.filter((car) => car.fuel_type === selectedFuelType);
    }

    // Filter by drivetrain
    if (selectedDrivetrain) {
      result = result.filter((car) => car.drivetrain === selectedDrivetrain);
    }

    // Filter by origin
    if (selectedOrigin) {
      result = result.filter((car) =>
        selectedOrigin === "Kore e Jugut" ? car.encar_id : !car.encar_id
      );
    }

    // Filter by year from
    if (yearFrom) {
      result = result.filter((car) => car.year >= parseInt(yearFrom));
    }

    // Filter by max price
    if (priceUpTo) {
      result = result.filter((car) => car.price <= parseInt(priceUpTo));
    }

    // Filter by max km
    if (kmUpTo) {
      result = result.filter((car) => car.mileage <= parseInt(kmUpTo));
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

    setFilteredCars(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    allCars,
    selectedBrand,
    selectedModel,
    selectedCategory,
    selectedFuelType,
    selectedDrivetrain,
    selectedOrigin,
    yearFrom,
    priceUpTo,
    kmUpTo,
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

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedCategory("");
    setSelectedFuelType("");
    setSelectedDrivetrain("");
    setSelectedOrigin("");
    setYearFrom("");
    setPriceUpTo("");
    setKmUpTo("");
    setSortBy("featured");
    setSearchQuery("");
  };

  // Derived: available brands, models, categories from allCars
  const availableBrands = ALL_BRANDS;
  const availableModels = selectedBrand
    ? MODELS_BY_BRAND[selectedBrand] || []
    : [];
  const availableCategories = ALL_CATEGORIES;
  const availableFuelTypes = [...new Set(allCars.map((c) => c.fuel_type))].sort();
  const availableDrivetrains = [...new Set(allCars.map((c) => c.drivetrain).filter(Boolean))].sort();
  const availableOrigins = [...new Set(allCars.map((c) => c.encar_id ? "Kore e Jugut" : "Europe"))].sort().reverse();

  const activeFiltersCount =
    (selectedBrand ? 1 : 0) +
    (selectedModel ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedFuelType ? 1 : 0) +
    (selectedDrivetrain ? 1 : 0) +
    (selectedOrigin ? 1 : 0) +
    (yearFrom ? 1 : 0) +
    (priceUpTo ? 1 : 0) +
    (kmUpTo ? 1 : 0) +
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
              className={`text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Koleksioni<span className="text-white/30">.</span>
            </h1>
            <p
              className={`text-white/60 text-lg lg:text-xl max-w-2xl mx-auto transition-all duration-1000 delay-100 ${isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
                }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Eksploroni përzgjedhjen tonë të automjeteve më prestigjioze në
              botë
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Grid Section */}
      <section className="pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Filter Panel - Desktop & Mobile */}
          <div
            className={`relative z-20 mb-8 lg:mb-12 transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            {/* Mobile Toggle + Search row */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <div className="relative flex-1 mr-3">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" placeholder="Kërko makina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:border-white/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">{activeFiltersCount}</span>
                )}
              </button>
            </div>

            {/* Main filter card */}
            <div className={`bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <h3 className="text-lg font-bold text-white/90 mb-6 tracking-wide" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                Kërkim i detajuar
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Prodhuesi */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Prodhuesi</label>
                  <CustomSelect
                    value={selectedBrand}
                    onChange={(v) => { setSelectedBrand(v); setSelectedModel(""); }}
                    options={availableBrands.map((b) => ({ value: b, label: b }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Modeli */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Modeli</label>
                  <CustomSelect
                    value={selectedModel}
                    onChange={setSelectedModel}
                    options={availableModels.map((m) => ({ value: m, label: m }))}
                    placeholder="Të gjithë"
                    disabled={!selectedBrand}
                  />
                </div>

                {/* Karburanti */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Karburanti</label>
                  <CustomSelect
                    value={selectedFuelType}
                    onChange={setSelectedFuelType}
                    options={availableFuelTypes.map((f) => ({ value: f, label: f }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Terheqja */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Terheqja</label>
                  <CustomSelect
                    value={selectedDrivetrain}
                    onChange={setSelectedDrivetrain}
                    options={availableDrivetrains.map((d) => ({ value: d, label: d }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Prejardhja */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Prejardhja</label>
                  <CustomSelect
                    value={selectedOrigin}
                    onChange={setSelectedOrigin}
                    options={availableOrigins.map((o) => ({
                      value: o,
                      label: o === "Kore e Jugut" ? "🇰🇷 Kore e Jugut" : "🇪🇺 Europe",
                    }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Tipi */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Tipi</label>
                  <CustomSelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={availableCategories.map((c) => ({ value: c, label: c }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Viti nga */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Viti nga</label>
                  <CustomSelect
                    value={yearFrom}
                    onChange={setYearFrom}
                    options={yearOptions.map((y) => ({ value: y, label: y }))}
                    placeholder="Të gjithë"
                  />
                </div>

                {/* Çmimi deri */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Çmimi deri (€)</label>
                  <input
                    type="number" min="0" step="1000"
                    value={priceUpTo}
                    onChange={(e) => setPriceUpTo(e.target.value)}
                    placeholder="p.sh. 50000"
                    className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white/90 text-sm focus:outline-none focus:border-white/40 transition-colors placeholder-white/30"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                </div>

                {/* Km deri */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Km deri</label>
                  <input
                    type="number" min="0" step="5000"
                    value={kmUpTo}
                    onChange={(e) => setKmUpTo(e.target.value)}
                    placeholder="p.sh. 100000"
                    className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white/90 text-sm focus:outline-none focus:border-white/40 transition-colors placeholder-white/30"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                </div>
              </div>

              {/* Bottom row: count + sort + clear/search */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
                <span className="text-white/50 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {filteredCars.length} automjete
                </span>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="relative sort-dropdown">
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm transition-all ${isSortOpen ? "border-white/60 bg-white/10" : "border-white/30 hover:border-white/50 bg-black/50"
                        }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <span className="text-white/90 font-medium">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                      <svg className={`w-4 h-4 text-white/70 transition-transform ${isSortOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute right-0 top-full mt-3 w-56 py-3 bg-black border border-white/20 rounded-xl shadow-2xl transition-all z-[9999] backdrop-blur-md ${isSortOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-all ${sortBy === option.value ? "bg-white/15 text-white border-l-2 border-white" : "text-white/70 hover:text-white hover:bg-white/8"
                            }`}
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            {sortBy === option.value && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      Pastro të gjitha
                    </button>
                  )}

                  <button onClick={() => setIsFilterOpen(false)} className="px-6 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Kërko
                  </button>
                </div>
              </div>
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
                  className={`group relative transition-all duration-700 ${isLoaded
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
                        className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${car.isSold ? "grayscale" : ""}`}
                      />
                      {/* Sold Overlay */}
                      {car.isSold && (
                        <>
                          <div className="absolute inset-0 bg-black/40 z-10" />
                          <div className="absolute top-3 right-3 z-20">
                            <div className="px-3 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-full shadow-lg">
                              <span
                                className="text-xs font-semibold text-red-100 tracking-wider uppercase"
                                style={{
                                  fontFamily: "Montserrat, sans-serif",
                                }}
                              >
                                I Shitur
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Below Image */}
                    <div className="p-5 space-y-4">
                      {/* Top Row - Category and Year */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/70 tracking-wider uppercase"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {car.category}
                        </span>
                        {car.encar_id && (
                          <span
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400 tracking-wider uppercase"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Importuar nga Korea
                          </span>
                        )}
                        <span
                          className="text-sm text-white/50 ml-auto"
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
                          {SHOW_PRICES && car.discountPrice ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm text-red-400 line-through"
                                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                                >
                                  {formatPrice(car.price)}
                                </span>
                                <span
                                  className="text-xl font-bold text-white"
                                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                                >
                                  {formatPrice(car.discountPrice)}
                                </span>
                              </div>
                              <span className="text-[10px] text-white/40 block mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                Deri në Durrës
                              </span>
                            </div>
                          ) : SHOW_PRICES ? (
                            <div>
                              <span
                                className="text-xl font-bold text-white"
                                style={{ fontFamily: "Cera Pro, sans-serif" }}
                              >
                                {formatPrice(car.price)}
                              </span>
                              <span className="text-[10px] text-white/40 block mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                Deri në Durrës
                              </span>
                            </div>
                          ) : null}
                          <span
                            className="text-white/40 text-sm block mt-1"
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
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  currentPage === 1
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                {getPageNumbers(currentPage, totalPages).map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/40 text-xs sm:text-sm font-medium"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? "bg-white text-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  currentPage === totalPages
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
              Duke treguar {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
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
