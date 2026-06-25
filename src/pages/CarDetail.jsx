import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";
import { LazyImage } from "../components/LazyImage";
import { carsApi } from "../services/api";
import { SHOW_PRICES } from "../config";
import logo from "../assets/images/logo.png";
import mercedesLogo from "../assets/images/mercedes.png";
import bmwLogo from "../assets/images/bmw.png";
import audiLogo from "../assets/images/audi.png";
import vwLogo from "../assets/images/vw.png";
import porscheLogo from "../assets/images/porsche.png";
import alfaLogo from "../assets/images/alfa.png";
import bentleyLogo from "../assets/images/bentley.png";
import bugattiLogo from "../assets/images/bugatti.png";
import citroenLogo from "../assets/images/citroen.png";
import dodgeLogo from "../assets/images/dodge.png";
import ferrariLogo from "../assets/images/ferrari.png";
import lamboLogo from "../assets/images/lambo.png";
import landroverLogo from "../assets/images/landrover.png";
import peugeotLogo from "../assets/images/peugeot.png";
import renaultLogo from "../assets/images/renault.png";
import rollsroyceLogo from "../assets/images/rollsroyce.png";
import teslaLogo from "../assets/images/tesla.png";
import volvoLogo from "../assets/images/volvo.png";
import exteriorImg from "../assets/images/exterior.png";
import interiorImg from "../assets/images/interior.png";

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

const STATUS_MAP = {
  'X': { label: 'N', name: 'Nderrim (Zëvendësim)', color: 'bg-red-500 text-white' },
  'W': { label: 'R', name: 'Riparim (Panelim/saldim)', color: 'bg-blue-500 text-white' },
  'C': { label: 'K', name: 'Korrozion', color: 'bg-amber-600 text-white' },
  'A': { label: 'G', name: 'Gervishtje', color: 'bg-slate-600 text-white' },
  'U': { label: 'P', name: 'Parregullsi (Dent)', color: 'bg-green-600 text-white' },
  'T': { label: 'D', name: 'Demtim (Sipërfaqësor)', color: 'bg-amber-800 text-white' }
};

const getPinHexColor = (label) => {
  switch (label) {
    case "N": return "#EF4444";
    case "R": return "#3B82F6";
    case "K": return "#D97706";
    case "G": return "#6B7280";
    case "P": return "#10B981";
    default: return "#D97706";
  }
};

const getDotBgColor = (label) => {
  switch (label) {
    case "N": return "bg-red-500";
    case "R": return "bg-blue-500";
    case "K": return "bg-amber-500";
    case "G": return "bg-slate-400";
    case "P": return "bg-emerald-500";
    default: return "bg-amber-700";
  }
};

const getStatusBadgeStyle = (label) => {
  switch (label) {
    case "N": return "border border-red-500/30 bg-red-500/10 text-red-400";
    case "R": return "border border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "K": return "border border-amber-600/30 bg-amber-600/10 text-amber-500";
    case "G": return "border border-slate-500/30 bg-slate-500/10 text-slate-400";
    case "P": return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    default: return "border border-amber-800/30 bg-amber-800/10 text-amber-700";
  }
};

const EXTERIOR_COORDS = {
  'P021': { x: 95, y: 66, name: 'Parafango e parme (Majtas)' },
  'P031': { x: 80, y: 124, name: 'Dera e parme (Majtas)' },
  'P033': { x: 80, y: 177, name: 'Dera e pasme (Majtas)' },
  'P061': { x: 80, y: 252, name: 'Krahu i pasmë anësor (Majtas)' },
  'P071': { x: 45, y: 184, name: 'Pragu anësor (Majtas)' },

  'P012': { x: 200, y: 42, name: 'Suporti i radiatorit' },
  'P011': { x: 200, y: 52, name: 'Kapaku i motorrit' },
  'P042': { x: 200, y: 165, name: 'Tavani (Tavan)' },
  'P041': { x: 200, y: 258, name: 'Dera e bagazhit (Trunk)' },

  'P022': { x: 305, y: 66, name: 'Parafango e parme (Djathtas)' },
  'P032': { x: 320, y: 124, name: 'Dera e parme (Djathtas)' },
  'P034': { x: 320, y: 177, name: 'Dera e pasme (Djathtas)' },
  'P062': { x: 320, y: 252, name: 'Krahu i pasmë anësor (Djathtas)' },
  'P072': { x: 355, y: 184, name: 'Pragu anësor (Djathtas)' }
};

const INTERIOR_COORDS = {
  'P121': { x: 80, y: 120, name: 'Shtylla A (Majtas)' },
  'P123': { x: 80, y: 171, name: 'Shtylla B (Majtas)' },
  'P125': { x: 80, y: 222, name: 'Shtylla C (Majtas)' },
  'P127': { x: 45, y: 171, name: 'Shina anësore e tavanit (Majtas)' },

  'P111': { x: 200, y: 39, name: 'Traversa e parme' },
  'P112': { x: 165, y: 66, name: 'Këmba e parme (Majtas)' },
  'P113': { x: 235, y: 66, name: 'Këmba e parme (Djathtas)' },
  'P114': { x: 140, y: 96, name: 'Koshi i amortizatorit (Majtas)' },
  'P115': { x: 260, y: 96, name: 'Koshi i amortizatorit (Djathtas)' },
  'P116': { x: 200, y: 126, name: 'Paneli i shoferit / Tablieri' },
  'P131': { x: 200, y: 210, name: 'Paneli i pasmë i kabinës' },
  'P132': { x: 200, y: 276, name: 'Traversa e pasme' },
  'P133': { x: 200, y: 252, name: 'Dyshemeja e bagazhit' },
  'P134': { x: 165, y: 264, name: 'Këmba e pasme (Majtas)' },
  'P135': { x: 235, y: 264, name: 'Këmba e pasme (Djathtas)' },

  'P122': { x: 320, y: 120, name: 'Shtylla A (Djathtas)' },
  'P124': { x: 320, y: 171, name: 'Shtylla B (Djathtas)' },
  'P126': { x: 320, y: 222, name: 'Shtylla C (Djathtas)' },
  'P128': { x: 355, y: 171, name: 'Shina anësore e tavanit (Djathtas)' }
};

const optionCategories = [
  {
    title: "Siguri",
    items: [
      { name: "Mbrojtja e bllokimit të frenave (ABS)", codes: ["001"] },
      { name: "Anti-rrëshqitje (TCS)", codes: ["019"] },
      { name: "Airbag (anësor)", codes: ["020"] },
      { name: "Airbag (Ulëse Shoferi)", codes: ["026", "027"] },
      { name: "Airbag (perde)", codes: ["056"] },
      { name: "Pajisje Kontrolli e Stabilitetit (ESC)", codes: ["055"] },
      { name: "Senzorë Parkimi (Përpara, Prapa)", codes: ["032", "085"] },
      { name: "Senzor Presioni Gomash (TPMS)", codes: ["033"] },
      { name: "Kamera pasme", codes: ["058"] },
      { name: "Pamje 360 Gradë", codes: ["087"] },
      { name: "Sistem Paralajmërimi Largimi nga Korsia (LDWS)", codes: ["088"] },
      { name: "Sistem Alarmi", codes: ["021"] },
      { name: "Frenë Elektronike e Parkimit (EPB)", codes: ["094"] }
    ]
  },
  {
    title: "Jashte/Brenda",
    items: [
      { name: "Rrota alumini", codes: ["017"] },
      { name: "Tavan panoramik", codes: ["010"] },
      { name: "Pasqyrë anësore e palosshme elektrike", codes: ["024"] },
      { name: "Pasqyrë ECM", codes: ["030"] },
      { name: "Dritë Përpara (HID, LED)", codes: ["075"] },
      { name: "Bagazh elektrik", codes: ["059"] },
      { name: "Drita Automatike", codes: ["097"] },
      { name: "Senzorë Shiu", codes: ["081"] }
    ]
  },
  {
    title: "Uleset",
    items: [
      { name: "Ulëse me Lëkurë", codes: ["014"] },
      { name: "Ulëse me Ngrohje (Përpara, Prapa)", codes: ["022", "063"] }
    ]
  },
  {
    title: "Komoditet/Media",
    items: [
      { name: "Monitor AV për Ulëset e Përparme", codes: ["004"] },
      { name: "Navigacion", codes: ["005"] },
      { name: "Kyçje elektrike e dyerve", codes: ["006"] },
      { name: "Dritare elektrike", codes: ["007"] },
      { name: "Drejtëkll elektrik", codes: ["008"] },
      { name: "Kyçje pa tela e dyerve", codes: ["015"] },
      { name: "Kondicionim automatik", codes: ["023"] },
      { name: "Kontroll i largët i timonit", codes: ["031"] },
      { name: "Çelës inteligjent", codes: ["057"] },
      { name: "Terminal USB", codes: ["072"] },
      { name: "Kontroll Automatik i Shpejtësisë (Adaptiv)", codes: ["079"] },
      { name: "Timon i Ngrohur", codes: ["082"] },
      { name: "Timon i rregullueshëm elektrik", codes: ["083"] },
      { name: "Shifte me Panele", codes: ["084"] },
      { name: "Ekran i Projektuar në Xham (HUD)", codes: ["095"] },
      { name: "Bluetooth", codes: ["096"] }
    ]
  }
];

const getStatusByCode = (inners, code) => {
  if (!inners) return null;
  const findNode = (nodes, targetCode) => {
    for (const node of nodes) {
      if (node.type && node.type.code === targetCode) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children, targetCode);
        if (found) return found;
      }
    }
    return null;
  };
  const node = findNode(inners, code);
  return node && node.statusType ? node.statusType.title : null;
};

const translateStatus = (krStatus, isLeakCheck = false) => {
  if (!krStatus) return { text: 'Në rregull', color: 'text-emerald-500' };
  const val = krStatus.trim();
  if (val === '양호' || val === '정상' || val === '적정') {
    return { text: 'Në rregull', color: 'text-emerald-500' };
  }
  if (val === '없음') {
    return { text: isLeakCheck ? 'Nuk ka rrjedhje' : 'Në rregull', color: 'text-emerald-500' };
  }
  if (val === '미세누유' || val === '미세누수') {
    return { text: 'Rrjedhje e lehtë', color: 'text-amber-500 font-medium' };
  }
  if (val === '누유' || val === '누수') {
    return { text: 'Rrjedhje', color: 'text-red-500 font-semibold' };
  }
  if (val === '부족') {
    return { text: 'Nivel i ulët', color: 'text-amber-500 font-medium' };
  }
  if (val === '과da') { // Note: original code had '과다' but handled case-insensitive
    return { text: 'Nivel i lartë', color: 'text-amber-500 font-medium' };
  }
  if (val === '과다') {
    return { text: 'Nivel i lartë', color: 'text-amber-500 font-medium' };
  }
  if (val === '불량') {
    return { text: 'Me defekt', color: 'text-red-500 font-semibold' };
  }
  if (val === '있음') {
    return { text: 'Ka rrjedhje', color: 'text-red-500 font-semibold' };
  }
  return { text: krStatus, color: 'text-white' };
};

const extractCC = (engineStr) => {
  if (!engineStr) return 1995;
  const str = String(engineStr).toLowerCase();

  const ccMatch = str.match(/(\d{1,3}[\s,.]?\d{3})\s*cc/);
  if (ccMatch) {
    return parseInt(ccMatch[1].replace(/[\s,.]/g, ""), 10);
  }

  const standaloneMatch = str.match(/\b(1\d{3}|2\d{3}|3\d{3})\b/);
  if (standaloneMatch) {
    return parseInt(standaloneMatch[1], 10);
  }

  const literMatch = str.match(/\b([1-5]\.\d)\s*l?\b/);
  if (literMatch) {
    const liters = parseFloat(literMatch[1]);
    if (liters === 2.0) return 1995;
    if (liters === 3.0) return 2995;
    if (liters === 2.5) return 2495;
    return Math.round(liters * 1000);
  }

  return 1995;
};

const calculateCustoms = (price, cc, year) => {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  let category = 0;
  if (cc >= 2000 && cc <= 2999) {
    category = 1;
  } else if (cc >= 3000) {
    category = 2;
  }

  let excise = 0;
  if (age <= 1) {
    excise = 0;
  } else if (age <= 2) {
    excise = category === 0 ? 100 : category === 1 ? 150 : 300;
  } else if (age <= 3) {
    excise = category === 0 ? 200 : category === 1 ? 300 : 500;
  } else if (age <= 4) {
    excise = category === 0 ? 300 : category === 1 ? 400 : 700;
  } else if (age <= 5) {
    excise = category === 0 ? 400 : category === 1 ? 500 : 900;
  } else if (age <= 6) {
    excise = category === 0 ? 400 : category === 1 ? 500 : 1000;
  } else if (age <= 8) {
    excise = category === 0 ? 450 : category === 1 ? 550 : 1100;
  } else if (age <= 9) {
    excise = category === 0 ? 600 : category === 1 ? 600 : 1500;
  } else if (age <= 10) {
    excise = category === 0 ? 700 : category === 1 ? 800 : 1800;
  } else if (age <= 12) {
    excise = category === 0 ? 900 : category === 1 ? 1200 : 2400;
  } else if (age <= 15) {
    excise = category === 0 ? 1200 : category === 1 ? 1700 : 3100;
  } else {
    excise = category === 0 ? 1500 : category === 1 ? 2200 : 3900;
  }

  // Vlera bazë doganore = Çmimi (përfshin transportin)
  const baseValue = price;
  const importTax = baseValue * 0.10;
  const vat = (baseValue + excise + importTax) * 0.18;
  const total = excise + importTax + vat;

  return {
    excise,
    importTax,
    vat,
    total,
    isProhibited: age > 10
  };
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
  const [similarCars, setSimilarCars] = useState([]);
  const specsRef = useRef(null);
  const featuresRef = useRef(null);
  const galleryRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(true);

  // Customs Calculator State
  const [priceInput, setPriceInput] = useState(0);
  const [ccInput, setCcInput] = useState(1995);
  const [yearInput, setYearInput] = useState(new Date().getFullYear());

  const motorChecks = [
    { label: 'Gjendja e funksionimit (në punë boshe)', code: 's003', isLeak: false },
    { label: 'Rrjedhja e vajit rreth kapakut të kokës së motorit', code: 's004', isLeak: true },
    { label: 'Rrjedhja e vajit në kokën e motorit', code: 's005', isLeak: true },
    { label: 'Rrjedhja e vajit rreth bllokut dhe karterit të vajit', code: 's006', isLeak: true },
    { label: 'Qarkullimi i vajit', code: 's007', isLeak: false },
    { label: 'Rrjedhja e ujit ftohës nga izoluesi i kokës së motorit', code: 's008', isLeak: true },
    { label: 'Rrjedhja e ujit ftohës nga pompa e ujit', code: 's009', isLeak: true },
    { label: 'Rrjedhja e ujit ftohës nga radiatori', code: 's010', isLeak: true },
    { label: 'Sasia e ujit ftohës (antifreeze)', code: 's011', isLeak: false }
  ];

  const transChecks = [
    { label: 'Rrjedhja e vajit nga transmisioni', code: 's013', isLeak: true, fallbackCode: 's016' },
    { label: 'Qarkullimi i vajit të transmisionit', code: 's014', isLeak: false, fallbackCode: 's018' },
    { label: 'Gjendja e funksionimit (në punë boshe)', code: 's015', isLeak: false, fallbackCode: 's019' }
  ];

  const steerChecks = [
    { label: 'Rrjedhja e vajit nga koka e timonit', code: 's023', isLeak: true },
    { label: 'Pompa e vajit të timonit', code: 's025', isLeak: false },
    { label: 'Ingranazhet drejtuese dhe sistemi elektrik', code: 's024', isLeak: false },
    { label: 'Nyja e drejtimit', code: 's038', isLeak: false },
    { label: 'Koka e shufrës së drejtimit dhe nyja sferike', code: 's026', isLeak: false },
    { label: 'Tubi i presionit të lartë të drejtimit', code: 's039', isLeak: false }
  ];

  const renderPins = (isInterior) => {
    if (!car || !car.inspectionData || !car.inspectionData.outers) return null;

    const coordsMap = isInterior ? INTERIOR_COORDS : EXTERIOR_COORDS;

    return car.inspectionData.outers
      .filter((o) => o.type && o.type.code && coordsMap[o.type.code])
      .map((o, idx) => {
        const coord = coordsMap[o.type.code];
        const mainStatus = o.statusTypes && o.statusTypes[0]
          ? o.statusTypes[0]
          : { code: "X", title: "Nderrim" };
        const statusInfo = STATUS_MAP[mainStatus.code] || {
          label: "D",
          name: "Demtim",
          color: "bg-amber-800 text-white",
        };
        const pinColor = getPinHexColor(statusInfo.label);

        return (
          <g key={idx} className="group cursor-pointer pointer-events-auto transition-transform duration-200 hover:scale-110 origin-center">
            {/* Pulsing glow ring */}
            <circle
              cx={coord.x}
              cy={coord.y}
              r="13"
              className="animate-pulse opacity-25 fill-current"
              style={{ color: pinColor }}
            />
            {/* Outer border & Fill */}
            <circle
              cx={coord.x}
              cy={coord.y}
              r="9.5"
              className="stroke-white/80 stroke-[1.5]"
              style={{ fill: pinColor }}
            />
            {/* Centered label */}
            <text
              x={coord.x}
              y={coord.y + 3}
              textAnchor="middle"
              className="text-[9px] font-extrabold fill-white pointer-events-none select-none"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {statusInfo.label}
            </text>
            <title>{`${coord.name}: ${statusInfo.name} (${mainStatus.title})`}</title>
          </g>
        );
      });
  };

  const brandLogos = {
    Mercedes: mercedesLogo,
    BMW: bmwLogo,
    Audi: audiLogo,
    Volkswagen: vwLogo,
    Porsche: porscheLogo,
    "Alfa Romeo": alfaLogo,
    Bentley: bentleyLogo,
    Bugatti: bugattiLogo,
    Citroen: citroenLogo,
    Dodge: dodgeLogo,
    Ferrari: ferrariLogo,
    Lamborghini: lamboLogo,
    "Land Rover": landroverLogo,
    Peugeot: peugeotLogo,
    Renault: renaultLogo,
    "Rolls-Royce": rollsroyceLogo,
    Tesla: teslaLogo,
    Volvo: volvoLogo,
  };

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

  // Fetch similar cars
  useEffect(() => {
    const fetchSimilarCars = async () => {
      if (!car || !car.category) return;
      try {
        const response = await carsApi.getActiveCars({
          category: car.category,
        });
        if (response.success && response.data) {
          // Filter out the current car and get up to 4 similar cars
          const filtered = response.data
            .filter((c) => c.slug !== slug)
            .slice(0, 4);
          setSimilarCars(
            filtered.map((c) => ({
              ...c,
              images: (c.images || []).map((img) => getImageUrl(img)),
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching similar cars:", err);
      }
    };

    if (car && car.category) {
      fetchSimilarCars();
    }
  }, [car, slug]);

  // Initialize customs calculator values when car loads
  useEffect(() => {
    if (car) {
      setPriceInput(car.discountPrice || car.price || 0);
      setYearInput(Number(car.year) || new Date().getFullYear());
      setCcInput(extractCC(car.engine));
    }
  }, [car]);

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
      // Animate to discount price if available, otherwise original price
      const target = car.discountPrice || car.price;

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
      { label: "Kuaj-fuqi", value: car.horsepower, suffix: "PS" },
      { label: "Tërheqje", value: car.torque, suffix: "Nm" },
      {
        label: "0-100 km/h",
        value: car.acceleration,
        suffix: "s",
        isDecimal: true,
      },
    ].filter(s => s.value != null && s.value !== "" && Number(s.value) !== 0)
    : [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const customsData = calculateCustoms(priceInput, ccInput, yearInput);
  const rawTotalRKS = (priceInput || 0) + customsData.total;
  const roundedTotalRKS = Math.ceil(rawTotalRKS / 100) * 100;
  const roundedCustomsTotal = Math.max(0, roundedTotalRKS - (priceInput || 0));

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
            className="relative max-w-7xl mx-auto aspect-video sm:aspect-2/1 lg:aspect-21/9 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity duration-300"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => openGallery(activeImageIndex)}
          >
            {/* All images stacked with fade transitions */}
            {car.images &&
              car.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeImageIndex === index ? "opacity-100" : "opacity-0"
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
              className={`absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20 transition-all duration-1000 ${isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
              style={{ transitionDelay: "0.8s" }}
            >
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-6 sm:w-12 h-0.5 sm:h-1 rounded-full transition-all duration-500 overflow-hidden ${activeImageIndex === index
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
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
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
                  className={`inline-flex items-center gap-3 mb-4 transition-all duration-1000 ${isLoaded
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
                  {car.encar_id && (
                    <div className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full shadow-lg">
                      <span
                        className="text-xs font-semibold text-blue-400 tracking-wider uppercase"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Importuar nga Korea
                      </span>
                    </div>
                  )}
                  {/* Sold Badge */}
                  {car.isSold && (
                    <div className="px-4 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-full shadow-lg">
                      <span
                        className="text-xs font-semibold text-red-100 tracking-wider uppercase"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        I Shitur
                      </span>
                    </div>
                  )}
                </div>

                {/* Car Name */}
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 transition-all duration-1000 ${isLoaded
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
                  className={`text-lg sm:text-xl lg:text-2xl text-white/60 mb-8 transition-all duration-1000 ${isLoaded
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
                  className={`flex flex-wrap gap-6 sm:gap-10 lg:gap-16 justify-center sm:justify-start transition-all duration-1000 ${isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                    }`}
                  style={{ transitionDelay: "0.5s" }}
                >
                  <div className="flex flex-col">
                    <span
                      className="text-xl sm:text-4xl lg:text-5xl font-bold"
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
                      className="text-xl sm:text-4xl lg:text-5xl font-bold"
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
                  {SHOW_PRICES && <div className="flex flex-col">
                    {car.discountPrice ? (
                      <>
                        <span
                          className="text-sm sm:text-lg text-red-400 line-through"
                          style={{ fontFamily: "Cera Pro, sans-serif" }}
                        >
                          {formatPrice(car.price)}
                        </span>
                        <span
                          className="text-xl sm:text-4xl lg:text-5xl font-bold"
                          style={{ fontFamily: "Cera Pro, sans-serif" }}
                        >
                          {formatPrice(animatedPrice)}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-xl sm:text-4xl lg:text-5xl font-bold"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        {formatPrice(animatedPrice)}
                      </span>
                    )}
                    <span
                      className="text-xs text-white/50 uppercase tracking-widest mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Çmimi deri në Kosovë
                    </span>
                  </div>}
                </div>
              </div>

              {/* Right Logo */}
              <div
                className={`hidden lg:flex items-center justify-center mt-12 transition-all duration-1000 ${isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: "0.6s" }}
              >
                {car?.brand && brandLogos[car.brand] ? (
                  <img
                    src={brandLogos[car.brand]}
                    alt={`${car.brand} Logo`}
                    className="w-full h-auto max-w-48 object-contain"
                  />
                ) : (
                  <img
                    src={logo}
                    alt="TAFA Logo"
                    className="w-full h-auto max-w-50 object-contain"
                  />
                )}
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
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${specsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Performanca<span className="text-white/30">.</span>
            </h2>
            <p
              className={`text-white/60 max-w-xl transition-all duration-1000 delay-100 ${specsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Fuqia e pastër, e ndërtuar mbi inxhinieri të rafinuar. Numra që
              flasin vetë.
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`group relative p-6 lg:p-8 border border-white/10 rounded-lg hover:border-white/30 transition-all duration-500 ${specsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  } flex items-center justify-center`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 text-center">
                  <div className="flex flex-col items-center gap-1 mb-2">
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
              className={`space-y-6 transition-all duration-1000 ${specsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="space-y-4">
                {[
                  { label: "Motori", value: car.engine },
                  { label: "Transmisioni", value: car.transmission },
                  { label: "Sistemi i tërheqjes", value: car.drivetrain },
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
              className={`space-y-6 transition-all duration-1000 ${specsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="space-y-4">
                {[
                  { label: "Ngjyra e jashtme", value: car.exteriorColor },
                  { label: "Ngjyra e interierit", value: car.interiorColor },
                  {
                    label: "Konsumi i kombinuar",
                    value: car.mpg ? `${car.mpg} L/100KM` : "-",
                  },
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

      {/* Options & Features Section */}
      <section
        ref={featuresRef}
        className="relative py-20 lg:py-32 bg-linear-to-b from-black via-neutral-950 to-black border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {/* Section Header */}
          <div className="mb-12 lg:mb-20 text-center">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${featuresVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Opsionet e veturës<span className="text-white/30">.</span>
            </h2>
            <div
              className={`w-16 h-1 bg-white mx-auto mb-6 transition-all duration-1000 delay-100 ${featuresVisible
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
                }`}
              style={{ transformOrigin: "center" }}
            />
            <p
              className={`text-white/60 max-w-xl mx-auto transition-all duration-1000 delay-200 ${featuresVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {car.options
                ? "Lista e detajuar e pajisjeve dhe opsioneve të integruara në këtë automjet, e ndarë sipas kategorive."
                : "I pajisur me teknologjinë dhe mjeshtërinë më të mirë"}
            </p>
          </div>

          {/* Conditional rendering based on options presence */}
          {car.options ? (
            /* Options Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {optionCategories.map((cat) => {
                const activeItems = cat.items.filter((item) =>
                  item.codes.some((code) => {
                    const standard = car.options.standard || [];
                    const choice = car.options.choice || [];
                    const etc = car.options.etc || [];
                    return (
                      standard.includes(code) ||
                      choice.includes(code) ||
                      etc.includes(code)
                    );
                  })
                );

                if (activeItems.length === 0) return null;

                // Sleek monochromatic styling variables
                const catColor = "text-white/80 border-white/10 bg-white/5";
                const glowColor = "from-white/5";
                let catIcon = null;

                if (cat.title === "Siguri") {
                  catIcon = (
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  );
                } else if (cat.title === "Jashte/Brenda") {
                  catIcon = (
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  );
                } else if (cat.title === "Uleset") {
                  catIcon = (
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 002 2H3a2 2 0 002-2V5zM3 13h18M5 17h14M8 21h8"
                      />
                    </svg>
                  );
                } else {
                  catIcon = (
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  );
                }

                return (
                  <div
                    key={cat.title}
                    className="relative group p-6 lg:p-8 bg-neutral-900/30 border border-white/10 rounded-xl hover:border-white/20 hover:bg-neutral-900/50 transition-all duration-500 shadow-2xl overflow-hidden"
                  >
                    {/* Glowing color gradient on hover */}
                    <div
                      className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <h3
                      className="text-xl font-bold mb-6 tracking-wide border-b border-white/15 pb-3 flex items-center justify-between z-10 relative"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${catColor}`}>
                          {catIcon}
                        </div>
                        <span className="text-white">{cat.title}</span>
                      </div>
                      <span className="text-xs font-normal text-white/40 font-mono">
                        {activeItems.length} pajisje
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
                      {activeItems.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          {/* Active check icon */}
                          <div className="shrink-0 w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 text-white/80"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span
                            className="text-sm text-white/80"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback Features Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {car.features &&
                car.features.map((feature, index) => (
                  <div
                    key={feature}
                    className={`group relative p-5 lg:p-6 bg-neutral-900/30 border border-white/10 rounded-xl hover:border-white/20 hover:bg-neutral-900/50 transition-all duration-500 shadow-xl overflow-hidden cursor-default min-h-18 flex items-center ${featuresVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                      }`}
                    style={{ transitionDelay: `${300 + index * 50}ms` }}
                  >
                    {/* Glowing background on hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-3 w-full relative z-10">
                      {/* Check icon */}
                      <div className="shrink-0 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/15 transition-all duration-300">
                        <svg
                          className="w-3 h-3 text-white/80 group-hover:text-white transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
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
          )}

          {/* Description */}
          {car.description && (
            <div
              className={`mt-16 lg:mt-24 max-w-3xl mx-auto text-center transition-all duration-1000 ${featuresVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: "800ms" }}
            >
              <p
                className="text-lg lg:text-xl text-white/70 leading-relaxed font-light"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {car.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Visual Condition Report Section (Encar Cars Only) */}
      {car && car.inspectionData && (
        <section className="relative py-20 lg:py-32 bg-neutral-950/40 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">

            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                Raporti i gjendjes<span className="text-white/30">.</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Raporti teknik i detajuar i aksidenteve dhe gjendjes mekanike, i certifikuar nga inspektimi zyrtar në Korenë e Jugut.
              </p>
            </div>

            {/* Accident Report Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-10">

              {/* Panel 1: Jashtë (Exterior) */}
              <div className="group relative flex flex-col bg-neutral-900/30 rounded-3xl p-6 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.03)]">
                {/* Title & Info Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest" style={{ fontFamily: "Montserrat" }}>
                      Inspektimi i Jashtëm
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-wide mt-0.5" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                      Raporti i Aksidenteve
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded text-white/40 uppercase">
                    Exterior
                  </span>
                </div>

                {/* Drawing Container */}
                <div className="relative w-full max-w-[400px] aspect-[4/3] bg-neutral-950/60 rounded-2xl p-4 flex items-center justify-center mx-auto shadow-inner overflow-hidden">

                  {/* Tech corners */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 rounded-tl" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 rounded-tr" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 rounded-bl" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 rounded-br" />

                  {/* Scanning line effect */}
                  <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan pointer-events-none" />

                  <img
                    src={exteriorImg}
                    alt="Jashtë"
                    className="absolute inset-0 w-full h-full object-contain p-2 opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                  />
                  <svg viewBox="0 0 400 300" className="relative w-full h-full select-none pointer-events-none">
                    {renderPins(false)}
                  </svg>
                </div>
              </div>

              {/* Panel 2: Brenda (Interior) */}
              <div className="group relative flex flex-col bg-neutral-900/30 rounded-3xl p-6 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.03)]">
                {/* Title & Info Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest" style={{ fontFamily: "Montserrat" }}>
                      Inspektimi i Brendshëm
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-wide mt-0.5" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                      Korniza & Struktura
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded text-white/40 uppercase">
                    Interior
                  </span>
                </div>

                {/* Drawing Container */}
                <div className="relative w-full max-w-[400px] aspect-[4/3] bg-neutral-950/60 rounded-2xl p-4 flex items-center justify-center mx-auto shadow-inner overflow-hidden">

                  {/* Tech corners */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 rounded-tl" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 rounded-tr" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 rounded-bl" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 rounded-br" />

                  {/* Scanning line effect */}
                  <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan pointer-events-none" />

                  <img
                    src={interiorImg}
                    alt="Brenda"
                    className="absolute inset-0 w-full h-full object-contain p-2 opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                  />
                  <svg viewBox="0 0 400 300" className="relative w-full h-full select-none pointer-events-none">
                    {renderPins(true)}
                  </svg>
                </div>
              </div>

            </div>

            {/* Local scanning animation styles */}
            <style>{`
              @keyframes scanline {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 0.5; }
                90% { opacity: 0.5; }
                100% { top: 100%; opacity: 0; }
              }
              .animate-scan {
                animation: scanline 6s linear infinite;
              }
            `}</style>

            {/* Legend Row */}
            <div className="max-w-5xl mx-auto my-12">
              <div className="bg-neutral-900/40 rounded-2xl p-6 shadow-lg">
                <div className="text-[10px] uppercase tracking-widest text-white/40 text-center mb-4 font-bold" style={{ fontFamily: "Montserrat" }}>
                  Legjenda e Inspektimit
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3.5 justify-center text-[11px] lg:text-xs">
                  {Object.entries(STATUS_MAP).map(([code, info]) => {
                    const labelColor = info.label === "N"
                      ? "bg-red-500/10 text-red-400"
                      : info.label === "R"
                        ? "bg-blue-500/10 text-blue-400"
                        : info.label === "K"
                          ? "bg-amber-600/10 text-amber-500"
                          : info.label === "G"
                            ? "bg-slate-500/10 text-slate-400"
                            : info.label === "P"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-800/10 text-amber-700";

                    const dotBg = info.label === "N"
                      ? "bg-red-500"
                      : info.label === "R"
                        ? "bg-blue-500"
                        : info.label === "K"
                          ? "bg-amber-500"
                          : info.label === "G"
                            ? "bg-slate-400"
                            : info.label === "P"
                              ? "bg-emerald-500"
                              : "bg-amber-700";

                    return (
                      <div key={code} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full ${labelColor} transition-all duration-300 hover:scale-105 hover:bg-white/5`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotBg} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotBg}`}></span>
                        </span>
                        <span className="font-semibold">{info.label}</span>
                        <span className="text-white/60 font-light" style={{ fontFamily: "Montserrat" }}>{info.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Render detected repairs description list */}
            {car.inspectionData.outers && car.inspectionData.outers.length > 0 && (
              <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-neutral-900/20 rounded-3xl p-6 lg:p-8 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest" style={{ fontFamily: "Montserrat" }}>
                      Defektet dhe Ndërhyrjet e Detektuara
                    </h4>
                  </div>
                  <div style={{ fontFamily: "Montserrat" }}>
                    {car.inspectionData.outers
                      .filter(o => {
                        const code = o.type?.code;
                        return EXTERIOR_COORDS[code] || INTERIOR_COORDS[code];
                      })
                      .map((o, idx) => {
                        const outerName = EXTERIOR_COORDS[o.type?.code]?.name || INTERIOR_COORDS[o.type?.code]?.name;
                        const firstStatusCode = o.statusTypes?.[0]?.code;
                        const mappedStatus = STATUS_MAP[firstStatusCode];
                        const badgeStyle = mappedStatus ? getStatusBadgeStyle(mappedStatus.label) : "border border-white/10 bg-white/5 text-white/70";
                        const statusesStr = o.statusTypes?.map(s => {
                          const mapped = STATUS_MAP[s.code];
                          return mapped ? mapped.name : s.title;
                        }).join(", ") || "";
                        return (
                          <div key={idx} className="flex justify-between items-center py-4 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-all duration-300 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="relative flex h-1.5 w-1.5 shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${mappedStatus ? getDotBgColor(mappedStatus.label) : "bg-white"} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${mappedStatus ? getDotBgColor(mappedStatus.label) : "bg-white"}`}></span>
                              </span>
                              <span className="text-white/80 font-light">{outerName}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${badgeStyle}`}>
                              {statusesStr}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Mechanical Status Checklist (Sleek & Monochromatic) */}
            {car.inspectionData.inners && (
              <div className="mb-16">
                {/* Section Header */}
                <div className="mb-10 text-center md:text-left">
                  <h3 className="text-2xl font-bold tracking-wide text-white uppercase" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                    Gjendja Mekanike & Pajisjet<span className="text-white/30">.</span>
                  </h3>
                  <div className="w-16 h-0.5 bg-white/20 mt-3 mx-auto md:mx-0" />
                </div>

                {/* 2-Column Symmetric List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-8" style={{ fontFamily: "Montserrat" }}>

                  {/* Column 1: Motori */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/10 pb-2.5">
                      Motori
                    </h4>
                    <div className="divide-y divide-white/5">
                      {motorChecks.map((check) => {
                        const raw = getStatusByCode(car.inspectionData.inners, check.code);
                        const status = translateStatus(raw, check.isLeak);
                        return (
                          <div key={check.code} className="flex justify-between items-center py-3 border-b border-white/5 hover:border-white/10 transition-colors duration-300 text-sm">
                            <span className="text-white/60 font-light pr-4">{check.label}</span>
                            <span className={`font-medium shrink-0 ${status.color || 'text-white'}`}>{status.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Transmisioni & Drejtimi */}
                  <div className="space-y-8">
                    {/* Transmisioni */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/10 pb-2.5">
                        Transmisioni
                      </h4>
                      <div className="divide-y divide-white/5">
                        {transChecks.map((check) => {
                          const raw = getStatusByCode(car.inspectionData.inners, check.code) ||
                            (check.fallbackCode ? getStatusByCode(car.inspectionData.inners, check.fallbackCode) : null);
                          const status = translateStatus(raw, check.isLeak);
                          return (
                            <div key={check.code} className="flex justify-between items-center py-3 border-b border-white/5 hover:border-white/10 transition-colors duration-300 text-sm">
                              <span className="text-white/60 font-light pr-4">{check.label}</span>
                              <span className={`font-medium shrink-0 ${status.color || 'text-white'}`}>{status.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Drejtimi */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/10 pb-2.5">
                        Drejtimi
                      </h4>
                      <div className="divide-y divide-white/5">
                        {steerChecks.map((check) => {
                          const raw = getStatusByCode(car.inspectionData.inners, check.code);
                          const status = translateStatus(raw, check.isLeak);
                          return (
                            <div key={check.code} className="flex justify-between items-center py-3 border-b border-white/5 hover:border-white/10 transition-colors duration-300 text-sm">
                              <span className="text-white/60 font-light pr-4">{check.label}</span>
                              <span className={`font-medium shrink-0 ${status.color || 'text-white'}`}>{status.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Explanatory notes */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8 mt-16 text-white/70 text-xs sm:text-sm space-y-4">
              <h4 className="text-md font-bold uppercase tracking-wider text-white mb-6" style={{ fontFamily: "Montserrat" }}>
                Sqarime / Shënime / Informacion shpjegues
              </h4>
              <ol className="list-decimal pl-5 space-y-3.5 leading-relaxed" style={{ fontFamily: "Montserrat" }}>
                <li>Një automjet konsiderohet i aksidentuar vetëm nëse ka pasur riparime me saldim ose zëvendësim në pjesët kryesore të strukturës.</li>
                <li>Për panelet si Paneli i pasmë anësor (quarter panel), Paneli i kulmit (roof panel) dhe Pragu anësor (side sill panel), vetëm në rast prerjeje dhe saldimi do të regjistrohen si aksident.</li>
                <li>Riparimet në pjesë të jashtme si Kapotë (hood), Parafango (fender), dyer, Dera e bagazhit (trunk lid), si dhe parakolp dhe prapakolp (bumpers) nuk konsiderohen aksident, por riparime të thjeshta.</li>
                <li>Gjurmët e vajit ose gjurmët e ujit ftohës (antifreeze) shfaqen si pasojë e konsumimit normal të pjesëve.</li>
                <li>Rrjedhja e vajit ose e ujit ftohës është gjendja kur lëngu grumbullohet dhe bie nga pjesa përkatëse.</li>
                <li>Korrozioni nënkupton shkatërrimin e sipërfaqes metalike nga reagimet kimike dhe nuk përfshin vetëm ndryshkun sipërfaqësor.</li>
                <li>Përmbytja konsiderohet kur motori, transmisioni ose pajisje të tjera kryesore kanë shenja të qarta që kanë qenë të fundosura nën ujë.</li>
                <li>Ky inspektim nuk është bërë nga kompania jonë burimore por nga pala koreane para se vetura të dalë në shitje. Inspektimi nga kompania jonë bëhet para se klienti ta bëjë blerjen e veturës.</li>
                <li>Nuk ju rekomandojmë blerje të veturës që i mungon raporti i inspektimit paraprak, e veçanërisht kur mungon raporti i sigurimit.</li>
                <li>Të gjitha të dhënat dhe informacionet e paraqitura në këtë raport janë marrë nga encar.com dhe kompania jonë i prezanton vetëm për qëllime informuese.</li>
                <li>Kompania jonë nuk mban përgjegjësi për saktësinë, plotësinë ose gabimet e mundshme në përmbajtjen e raportit. Burimet e raporteve janë në encar.com.</li>
                <li>Raporti pasqyron gjendjen e automjetit vetëm në momentin e inspektimit dhe nuk përbën garanci për gjendjen e ardhshme të tij.</li>
                <li>Raportet dhe të dhënat e publikuara mund të ndryshojnë ose përditësohen nga burimi origjinal (encar.com) pa paralajmërim paraprak.</li>
              </ol>
            </div>

          </div>
        </section>
      )}

      {/* Dogana Kalkulator Section */}
      <section className="relative py-20 lg:py-32 bg-neutral-900/10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                Kalkulatori i Doganës<span className="text-white/30">.</span>
              </h2>
              <p className="text-white/60" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Llogaritni detyrimet e zhdoganimit për importin e këtij automjeti në Republikën e Kosovës.
              </p>
            </div>

            {/* Main Calculator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/40 p-6 lg:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
              {/* Inputs Column */}
              <div className="space-y-6" style={{ fontFamily: "Montserrat" }}>
                <h3 className="text-md font-bold uppercase tracking-widest text-white/40 mb-2">
                  Të dhënat e Automjetit
                </h3>

                {/* Hidden price input */}
                <input type="hidden" value={priceInput} readOnly />

                {/* CC input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">
                    Kubikazha e Motorit (CC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={ccInput || ""}
                      onChange={(e) => setCcInput(Number(e.target.value))}
                      className="w-full bg-neutral-950/60 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-white font-medium focus:border-white/30 focus:outline-none transition-all duration-300"
                      placeholder="P.sh. 2000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs font-medium uppercase">CC</span>
                  </div>
                  <span className="text-[10px] text-white/30 leading-relaxed">
                    ≤ 1999 CC: Kategoria 0 | 2000-2999 CC: Kategoria 1 | ≥ 3000 CC: Kategoria 2
                  </span>
                </div>

                {/* Year Select input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">
                    Viti i Prodhimit
                  </label>
                  <select
                    value={yearInput}
                    onChange={(e) => setYearInput(Number(e.target.value))}
                    className="w-full bg-neutral-950/60 border border-white/10 rounded-xl py-3.5 px-4 text-white font-medium focus:border-white/30 focus:outline-none transition-all duration-300"
                  >
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                      <option key={yr} value={yr} className="bg-neutral-950 text-white">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Outputs Column */}
              <div className="flex flex-col justify-between bg-neutral-950/40 rounded-2xl p-6 border border-white/5 shadow-inner">
                <div className="space-y-6" style={{ fontFamily: "Montserrat" }}>
                  <h3 className="text-md font-bold uppercase tracking-widest text-white/40">
                    Kalkulimi i Detajuar
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                      <span className="text-white/60 font-light">Tatimi i Importit (10%)</span>
                      <span className="font-semibold text-white">{formatPrice(customsData.importTax)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                      <span className="text-white/60 font-light">Akciza (sipas moshës/CC)</span>
                      <span className="font-semibold text-white">{formatPrice(customsData.excise)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                      <span className="text-white/60 font-light">TVSH (18%)</span>
                      <span className="font-semibold text-white">{formatPrice(customsData.vat)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-end" style={{ fontFamily: "Montserrat" }}>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Shuma e Doganës
                      </span>
                      <span className="text-xs text-white/40 font-light mt-0.5">
                        (Totali i taksave)
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white/90" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                      {formatPrice(roundedCustomsTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-4 border-t border-white/5" style={{ fontFamily: "Montserrat" }}>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                        Kostoja Totale (RKS)
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-yellow-400" style={{ fontFamily: "Cera Pro, sans-serif" }}>
                      {formatPrice(roundedTotalRKS)}
                    </span>
                  </div>

                  {customsData.isProhibited && (
                    <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed" style={{ fontFamily: "Montserrat" }}>
                      <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="font-bold block uppercase tracking-wider text-[10px] mb-1">Vërejtje Importi</span>
                        Veturat më të vjetra se 10 vite (para vitit {new Date().getFullYear() - 10}) nuk lejohen të importohen në Kosovë!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info footer notes */}
            <div className="bg-white/5 rounded-xl p-5 mt-6 text-white/50 text-[11px] leading-relaxed space-y-2.5" style={{ fontFamily: "Montserrat" }}>
              <div className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">
                Mënyra e përllogaritjes:
              </div>
              <ul className="list-disc pl-4 space-y-1.5">
                <li><strong>Tatimi i importit:</strong> 10% e vlerës doganore.</li>
                <li><strong>Akciza:</strong> Tarifë fikse e bazuar në vjetërsinë dhe kategorinë e motorit (CC) të veturës.</li>
                <li><strong>TVSH:</strong> 18% e aplikuar mbi shumën (Vlera Doganore + Akciza + Tatimi i importit).</li>
                <li><strong>Kostoja Totale (RKS):</strong> Vlera Doganore + Dogana (Tatimi + Akciza + TVSH). Ky llogaritës është vetëm orientues.</li>
              </ul>
            </div>

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
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${galleryVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                    }`}
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  Galeria<span className="text-white/30">.</span>
                </h2>
                <p
                  className={`text-white/60 transition-all duration-1000 delay-100 ${galleryVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                    }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Eksploro çdo kënd të këtij automjeti
                </p>
              </div>
              <div
                className={`hidden sm:flex items-center gap-2 text-white/50 text-sm transition-all duration-1000 delay-200 ${galleryVisible ? "opacity-100" : "opacity-0"
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
                <span>Kliko për zmadhim</span>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {car.images.map((image, index) => (
              <button
                key={index}
                onClick={() => openGallery(index)}
                className={`group relative aspect-4/3 overflow-hidden rounded-lg transition-all duration-700 ${galleryVisible
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

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <section className="relative py-20 lg:py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            {/* Section Header */}
            <div className="mb-12 lg:mb-16">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Automjete të ngjashme<span className="text-white/30">.</span>
              </h2>
              <p
                className="text-white/60 max-w-2xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Eksploroni më shumë përjekëpje të ngjashme nga koleksioni ynë i
                kuruar
              </p>
            </div>

            {/* Similar Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map((similarCar) => (
                <Link
                  key={similarCar.id}
                  to={`/car/${similarCar.slug}`}
                  className="group relative overflow-hidden rounded-lg transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                    {similarCar.images && similarCar.images[0] ? (
                      <LazyImage
                        src={similarCar.images[0]}
                        alt={similarCar.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
                  </div>

                  {/* Car Info */}
                  <div className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-colors duration-500 rounded-b-lg">
                    <h3
                      className="font-bold text-lg text-white mb-1 group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {similarCar.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 text-xs text-white/50">
                        <span>{similarCar.year}</span>
                        <span>•</span>
                        <span>{similarCar.mileage.toLocaleString()} km</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      {SHOW_PRICES && similarCar.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs text-red-400 line-through"
                            style={{ fontFamily: "Cera Pro, sans-serif" }}
                          >
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(similarCar.price)}
                          </span>
                          <span
                            className="text-white font-semibold"
                            style={{ fontFamily: "Cera Pro, sans-serif" }}
                          >
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(similarCar.discountPrice)}
                          </span>
                        </div>
                      ) : SHOW_PRICES ? (
                        <p
                          className="text-white font-semibold"
                          style={{ fontFamily: "Cera Pro, sans-serif" }}
                        >
                          {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(similarCar.price)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/60 rounded-tr-lg transition-colors duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 w-full py-10 lg:py-20">
          <div className="grid grid-cols-1 gap-8 lg:gap-12 items-start">
            {/* Left side - Price & Info */}
            <div className="text-center">
              <p
                className="text-sm text-white/50 uppercase tracking-widest mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Çmimi deri në Kosovë
              </p>
              <div className="flex items-baseline justify-center gap-3">
                {SHOW_PRICES && <>
                  {car.discountPrice && (
                    <span
                      className="text-xl sm:text-2xl text-red-400 line-through"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {formatPrice(car.price)}
                    </span>
                  )}
                  <span
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {formatPrice(car.discountPrice || car.price)}
                  </span>
                </>}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                <button
                  onClick={() =>
                    navigate("/contact", {
                      state: { carName: car.name, carSlug: slug },
                    })
                  }
                  className="w-full sm:w-auto group px-8 py-3 bg-white text-black font-semibold tracking-widest uppercase text-xs sm:text-sm transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] rounded-lg"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Rezervo Termin
                    <svg
                      className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
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
                {car.encar_id ? (
                  <>
                    <a
                      href="tel:+38349955797"
                      className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-3 border border-white/30 rounded-full backdrop-blur-md bg-black/60 hover:bg-black/80 hover:border-white/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                        <svg
                          className="w-3 h-3 text-white"
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
                      <span className="text-xs sm:text-sm font-medium tracking-wide text-white">
                        Kore: +383 49 955 797
                      </span>
                    </a>
                    <a
                      href="tel:+38346472472"
                      className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-3 border border-white/30 rounded-full backdrop-blur-md bg-black/60 hover:bg-black/80 hover:border-white/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                        <svg
                          className="w-3 h-3 text-white"
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
                      <span className="text-xs sm:text-sm font-medium tracking-wide text-white">
                        Kore: +383 46 472 472
                      </span>
                    </a>
                  </>
                ) : (
                  <a
                    href="tel:+38344666662"
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-3 border border-white/30 rounded-full backdrop-blur-md bg-black/60 hover:bg-black/80 hover:border-white/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <svg
                        className="w-3 h-3 text-white"
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
                    <span className="text-xs sm:text-sm font-medium tracking-wide text-white">
                      Evropë: +383 44 666 662
                    </span>
                  </a>
                )}
              </div>

              {/* Logo */}
              <div className="mt-8 hidden sm:flex justify-center">
                <img
                  src={logo}
                  alt="TAFA Logo"
                  className="h-56 object-contain opacity-80"
                />
              </div>
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
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex(
                  (prev) => (prev - 1 + car.images.length) % car.images.length,
                );
              }}
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
                className="max-w-full max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-200px)] lg:max-h-[75vh] object-contain select-none transition-opacity duration-300 pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) => (prev + 1) % car.images.length);
              }}
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
          </div>

          {/* Thumbnail Strip */}
          <div
            className="lg:hidden mt-auto pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 relative z-50 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`relative shrink-0 w-20 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 rounded-md overflow-visible transition-all duration-300 z-50 ${modalImageIndex === index
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
      <a
        href={car.encar_id ? "tel:+38349955797" : "tel:+38344666662"}
        className="fixed bottom-6 right-6 lg:hidden z-40 group w-14 h-14 bg-black/70 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-95 hover:bg-black/90 hover:border-white/40 transition-all duration-300"
      >
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
      </a>
    </main>
  );
}
