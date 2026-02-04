import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useSEO } from "../hooks/useSEO";
import { carsApi, uploadApi } from "../services/api";

// Admin PIN Code - Retrieved from environment variable for security
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "1234"; // Fallback for development

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

// Albanian translations for user-visible strings
const t = {
  seoTitle: "Paneli i Administrimit | Auto TAFA",
  seoDescription: "Paneli i administrimit për menaxhimin e Auto TAFA.",
  adminPortal: "Paneli i Administrimit",
  enterPin: "Shkruani PIN",
  enterAccessCode: "Vendosni kodin tuaj të qasjes",
  unlock: "Hap",
  incorrectPin: "PIN i pasaktë. Ju lutem provoni përsëri.",
  contactSupport: "Kontaktoni mbështetjen nëse keni harruar PIN-in",
  backToWebsite: "Kthehu te faqja",
  overview: "Përmbledhje",
  inventory: "Inventari",
  addVehicle: "Shtoni automjetin",
  failedLoadCars: "Ngarkimi i automjeteve dështoi",
  failedSaveCar: "Ruajtja e automjetit dështoi",
  failedDeleteCar: "Fshirja e automjetit dështoi",
  failedUpdateStatus: "Përditësimi i statusit dështoi",
  dashboardTitle: "Paneli",
  inventoryTitle: "Inventar",
  // Additional UI strings
  save: "Ruaj",
  cancel: "Anulo",
  delete: "Fshi",
  edit: "Ndrysho",
  view: "Shiko",
  logout: "Dil",
  searchPlaceholder: "Kërko automjetet...",
  noVehiclesFound: "Nuk u gjetën automjete",
  tryAdjustSearch: "Provo të rregullosh kërkimin.",
  addNewVehicle: "Shto Automjet të Ri",
  editVehicle: "Ndrysho Automjetin",
  year: "Viti",
  mileage: "Kilometrazhi",
  statusLabel: "Statusi",
  draft: "I papublikuar",
  active: "Aktiv",
  sold: "I shitur",
  exteriorColor: "Ngjyra e jashtme",
  interiorColor: "Ngjyra e brendshme",
  engine: "Motor",
  horsepower: "Kuaj Fuqi",
  torque: "Forca (Nm)",
  acceleration: "Përshpejtimi (s)",
  topSpeed: "Shpejtësia Maksimale",
  transmission: "Transmisioni",
  drivetrain: "Sistemi i tërheqjes",
  fuelType: "Lloji i karburantit",
  mpg: "MPG",
  vin: "VIN",
  imagesLabel: "Imazhe",
  chooseFiles: "Zgjidh skedaret",
  uploadImages: "Ngarko Imazhet",
  failedUploadSomeImages: "Ngarkimi i disa imazheve dështoi",
  statusUpdated: "Statusi u përditësua!",
  setAsDraft: "Vendos si Draft",
  setAsActive: "Vendos si Aktiv",
  activeListings: "Listime Aktive",
  totalViews: "Shikime Totale",
  manageInventory: "Menaxho Inventarin tënd",
  viewAndEditYourListings: "Shiko dhe modifiko listimet tuaja",
  viewPublicSite: "Shiko faqen publike",
  viewAll: "Shiko të gjitha →",
  deleteThisVehicle: "Të fshihet ky automjet?",
  confirmDelete: "Fshi",
  cancelBtn: "Anulo",
  saveChanges: "Ruaj Ndryshimet",
  upload: "Ngarko",
  actions: "Veprime",
  createdAt: "Krijuar më",
  viewsLabel: "Shikime",
  totalCars: "Automjete Totale",
  totalValue: "Vlera Totale",
  avgPrice: "Çmimi Mesatar",
  publish: "Publiko",
  cannotUndo: "Kjo veprim nuk mund të tërhiqet.",
  features: "Karakteristikat",
  descriptionLabel: "Përshkrimi",
  vehicleName: "Emri i automjetit",
  brandLabel: "Marka",
  categoryLabel: "Kategoria",
  priceLabel: "Çmimi",
  imagesUploadHint:
    "Ngarko imazhet e automjetit. Kliko ikonën me yll për të vendosur imazhin kryesor",
  clickToUploadImages: "Kliko për të ngarkuar imazhe",
  basicInfo: "Informacion Bazë",
  addToFeatured: "Shtoje te veturat e vequara",
};

const categories = [
  "Performance",
  "Luxury Sedan",
  "Electric",
  "SUV",
  "Coupe",
  "Convertible",
];
const brands = [
  "Mercedes",
  "BMW",
  "Audi",
  "Volkswagen",
  "Jaguar",
  "Maserati",
  "Tesla",
  "Citroen",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Bentley",
  "Rolls-Royce",
];
const fuelTypes = [
  "Benzin",
  "Diesel",
  "Hibrid Diesel",
  "Hibrid Benzin",
  "Elektrik",
];

export default function Dashboard() {
  // Prevent dashboard from being indexed by search engines
  useSEO({
    title: t.seoTitle,
    description: t.seoDescription,
    noIndex: true,
  });

  // Loading state - only shows after authentication
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("tafa_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pinInputRef = useRef(null);

  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState(null);
  const [pendingImageFiles, setPendingImageFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "Performance",
    brand: "Mercedes",
    price: "",
    year: new Date().getFullYear(),
    mileage: "",
    exteriorColor: "",
    interiorColor: "",
    engine: "",
    horsepower: "",
    torque: "",
    acceleration: "",
    topSpeed: "",
    transmission: "",
    drivetrain: "",
    fuelType: "Benzin",
    mpg: "",
    vin: "",
    images: [],
    showcaseImage: 0,
    features: [""],
    description: "",
    status: "draft",
    isFeatured: false,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch cars from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCars();
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchCars = async () => {
    try {
      const response = await carsApi.getAllCars();
      if (response.success) {
        // Transform backend data to match frontend format
        const transformedCars = response.data.map((car) => ({
          ...car,
          exteriorColor: car.exterior_color,
          interiorColor: car.interior_color,
          topSpeed: car.top_speed,
          fuelType: car.fuel_type,
          showcaseImage: car.showcase_image,
          // Convert is_featured to boolean (MySQL returns 0/1)
          isFeatured: car.is_featured === 1 || car.is_featured === true,
          createdAt: car.created_at,
          views: car.views || 0,
        }));
        setCars(transformedCars);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      showNotification(t.failedLoadCars, "error");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await carsApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Focus PIN input on load
  useEffect(() => {
    if (!isAuthenticated && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isAuthenticated]);

  // Handle PIN input
  const handlePinChange = (e) => {
    const value = e.target.value;
    setPinInput(value);
    setPinError(false);
  };

  // Handle PIN submission
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsDashboardLoading(true);
      sessionStorage.setItem("tafa_admin_auth", "true");
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsDashboardLoading(false);
      }, 1200);
    } else {
      setPinError(true);
      setPinInput("");
      setTimeout(() => pinInputRef.current?.focus(), 100);
    }
  };

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("tafa_admin_auth");
    setIsAuthenticated(false);
    setPinInput(["", "", "", ""]);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isMobileSidebarOpen]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Filter cars based on search
  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Stats calculations (use API stats if available, otherwise calculate locally)
  const displayStats = stats || {
    totalCars: cars.length,
    activeCars: cars.filter((c) => c.status === "active").length,
    draftCars: cars.filter((c) => c.status === "draft").length,
    totalValue: cars.reduce((sum, c) => sum + (c.price || 0), 0),
    totalViews: cars.reduce((sum, c) => sum + (c.views || 0), 0),
    avgPrice:
      cars.length > 0
        ? cars.reduce((sum, c) => sum + (c.price || 0), 0) / cars.length
        : 0,
  };

  // Open modal for adding new car
  const openAddModal = () => {
    setPendingImageFiles([]);
    setFormData({
      name: "",
      tagline: "",
      category: "Performance",
      brand: "Mercedes",
      price: "",
      year: new Date().getFullYear(),
      mileage: "",
      exteriorColor: "",
      interiorColor: "",
      engine: "",
      horsepower: "",
      torque: "",
      acceleration: "",
      topSpeed: "",
      transmission: "",
      drivetrain: "",
      fuelType: "Benzin",
      mpg: "",
      vin: "",
      images: [],
      showcaseImage: 0,
      features: [""],
      description: "",
      status: "draft",
      isFeatured: false,
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  // Open modal for editing car
  const openEditModal = (car) => {
    setSelectedCar(car);
    setPendingImageFiles([]);
    setFormData({
      ...car,
      features: car.features && car.features.length > 0 ? car.features : [""],
      images: car.images || [],
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle feature change
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  // Add new feature field
  const addFeatureField = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  // Remove feature field
  const removeFeatureField = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store file references for upload during save
    setPendingImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newShowcaseIndex =
      formData.showcaseImage >= newImages.length
        ? Math.max(0, newImages.length - 1)
        : formData.showcaseImage > index
          ? formData.showcaseImage - 1
          : formData.showcaseImage;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      showcaseImage: newShowcaseIndex,
    }));
  };

  // Set showcase image
  const setShowcaseImage = (index) => {
    setFormData((prev) => ({ ...prev, showcaseImage: index }));
  };

  // Reorder images (drag and drop simulation)
  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Adjust showcase index if needed
    let newShowcaseIndex = formData.showcaseImage;
    if (formData.showcaseImage === fromIndex) {
      newShowcaseIndex = toIndex;
    } else if (
      fromIndex < formData.showcaseImage &&
      toIndex >= formData.showcaseImage
    ) {
      newShowcaseIndex--;
    } else if (
      fromIndex > formData.showcaseImage &&
      toIndex <= formData.showcaseImage
    ) {
      newShowcaseIndex++;
    }

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      showcaseImage: newShowcaseIndex,
    }));
  };

  // Save car (add or update)
  const handleSaveCar = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Upload pending images first
      let uploadedImageUrls = [];
      if (pendingImageFiles.length > 0) {
        try {
          const uploadResponse =
            await uploadApi.uploadImages(pendingImageFiles);
          if (uploadResponse.success) {
            uploadedImageUrls = uploadResponse.data.map((img) => img.url);
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          showNotification(t.failedUploadSomeImages, "error");
        }
      }

      // Combine existing URLs with new uploads and deduplicate
      const existingUrls = formData.images.filter(
        (img) => img && !img.startsWith("blob:") && !img.startsWith("data:"),
      );
      const allImages = [
        ...new Set([...existingUrls, ...uploadedImageUrls]),
      ].filter(Boolean);

      const cleanedFeatures = formData.features.filter((f) => f.trim() !== "");

      const carData = {
        name: formData.name,
        tagline: formData.tagline,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        exteriorColor: formData.exteriorColor,
        interiorColor: formData.interiorColor,
        engine: formData.engine,
        horsepower: Number(formData.horsepower) || null,
        torque: Number(formData.torque) || null,
        acceleration: Number(formData.acceleration) || null,
        topSpeed: Number(formData.topSpeed) || null,
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        fuelType: formData.fuelType,
        mpg: formData.mpg,
        vin: formData.vin,
        description: formData.description,
        status: formData.status,
        showcaseImage: formData.showcaseImage,
        isFeatured: formData.isFeatured,
        features: cleanedFeatures,
        images: allImages,
        slug: generateSlug(formData.name),
      };

      let response;
      if (modalMode === "add") {
        response = await carsApi.createCar(carData);
        if (response.success) {
          showNotification("Automjeti u shtua me sukses!");
          await fetchCars();
          await fetchStats();
        }
      } else {
        response = await carsApi.updateCar(selectedCar.id, carData);
        if (response.success) {
          showNotification("Automjeti u perditesua!");
          await fetchCars();
          await fetchStats();
        }
      }

      setIsModalOpen(false);
      setSelectedCar(null);
      setPendingImageFiles([]);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving car:", error);
      showNotification(error.message || t.failedSaveCar, "error");
      setIsSaving(false);
    }
  };

  // Delete car
  const handleDeleteCar = async (id) => {
    try {
      const response = await carsApi.deleteCar(id);
      if (response.success) {
        setCars((prev) => prev.filter((car) => car.id !== id));
        setDeleteConfirmId(null);
        showNotification("Automjeti u fshi me sukses!", "error");
        await fetchStats();
      }
    } catch (error) {
      console.error("Nuk u fshi automjeti:", error);
      showNotification(t.failedDeleteCar, "error");
    }
  };

  // Toggle car status
  const toggleCarStatus = async (id) => {
    try {
      const response = await carsApi.toggleStatus(id);
      if (response.success) {
        setCars((prev) =>
          prev.map((car) =>
            car.id === id ? { ...car, status: response.data.status } : car,
          ),
        );
        showNotification(t.statusUpdated);
        await fetchStats();
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të statusit:", error);
      showNotification(t.failedUpdateStatus, "error");
    }
  };

  // Toggle car featured status
  const toggleFeatured = async (car) => {
    try {
      const newFeaturedStatus = !car.isFeatured;
      const response = await carsApi.updateCar(car.id, {
        ...car,
        isFeatured: newFeaturedStatus,
      });
      if (response.success) {
        setCars((prev) =>
          prev.map((c) =>
            c.id === car.id ? { ...c, isFeatured: newFeaturedStatus } : c,
          ),
        );
        showNotification(
          newFeaturedStatus
            ? "Automjeti u shtua te të veçuarat!"
            : "Automjeti u hoq nga të veçuarat!",
        );
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të veçimit:", error);
      showNotification("Ndryshimi dështoi", "error");
    }
  };

  // Toggle car sold status
  const toggleSoldStatus = async (car) => {
    try {
      const newStatus = car.status === "sold" ? "active" : "sold";
      const response = await carsApi.updateCar(car.id, {
        ...car,
        status: newStatus,
      });
      if (response.success) {
        setCars((prev) =>
          prev.map((c) => (c.id === car.id ? { ...c, status: newStatus } : c)),
        );
        showNotification(
          newStatus === "sold"
            ? "Automjeti u shënua si i shitur!"
            : "Automjeti nuk është më i shitur!",
        );
        await fetchStats();
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të statusit:", error);
      showNotification("Ndryshimi dështoi", "error");
    }
  };

  // Sidebar navigation items
  const navItems = [
    {
      id: "overview",
      label: t.overview,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "inventory",
      label: t.inventory,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "add",
      label: t.addVehicle,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
  ];

  // Simple Admin Loading Screen (after PIN entry)
  if (isDashboardLoading) {
    return (
      <div className="fixed inset-0 bg-black z-100 flex items-center justify-center">
        {/* Simple loader */}
        <div className="flex flex-col items-center">
          {/* Logo with subtle pulse */}
          <div className="relative mb-8">
            <div
              className="absolute -inset-4 rounded-full blur-xl opacity-20 bg-white"
              style={{ animation: "admin-pulse 2s ease-in-out infinite" }}
            />
            <img
              src={logo}
              alt="TAFA"
              className="relative w-16 h-16 object-contain"
            />
          </div>

          {/* Simple spinner */}
          <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>

        <style>{`
          @keyframes admin-pulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/2 blur-3xl transition-all duration-[2s] ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          />
          <div
            className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/1 blur-3xl transition-all duration-[2s] delay-300 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          />
        </div>

        <div
          className={`relative z-10 w-full max-w-md transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-block">
              <h1
                className="text-3xl font-bold tracking-wide mb-2"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                TAFA<span className="text-white/30">.</span>
              </h1>
            </Link>
            <p
              className="text-sm text-white/40 uppercase tracking-[0.3em]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t.adminPortal}
            </p>
          </div>

          {/* PIN Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                {t.enterPin}
              </h2>
              <p
                className="text-sm text-white/50"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t.enterAccessCode}
              </p>
            </div>

            {/* PIN Input */}
            <form onSubmit={handlePinSubmit} className="mb-6">
              <input
                ref={pinInputRef}
                type="password"
                value={pinInput}
                onChange={handlePinChange}
                placeholder={t.enterPin}
                className={`w-full px-4 py-3 text-center text-lg font-medium bg-white/5 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  pinError
                    ? "border-red-500/50 text-red-400 animate-shake"
                    : "border-white/10 text-white placeholder-white/30 focus:border-white/40"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
              <button
                type="submit"
                className="w-full mt-4 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-300 text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t.unlock}
              </button>
            </form>

            {/* Error Message */}
            {pinError && (
              <p
                className="text-center text-sm text-red-400 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t.incorrectPin}
              </p>
            )}

            {/* Help Text */}
            <p
              className="text-center text-xs text-white/30"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t.contactSupport}
            </p>
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
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
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t.backToWebsite}
            </Link>
          </div>
        </div>

        {/* CSS for shake animation */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-black border-r border-white/10 transition-all duration-300 ${
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${isSidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <Link to="/" className="flex items-center gap-2">
                <span
                  className="text-xl font-bold tracking-wide"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  TAFA
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  Admin
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg
                className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "add") {
                    openAddModal();
                  } else {
                    setActiveTab(item.id);
                  }
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {!isSidebarCollapsed && (
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {!isSidebarCollapsed && (
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Kthehu ne faqe
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {!isSidebarCollapsed && (
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.logout}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                {activeTab === "overview" ? t.dashboardTitle : t.inventoryTitle}
              </h1>
              <p
                className="text-sm text-white/50"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {activeTab === "overview"
                  ? "Mire se vini. Menaxho inventarin tënd."
                  : "Manage your vehicle inventory"}
              </p>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden sm:block">
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
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>

              {/* Add Vehicle Button */}
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-all duration-300"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">{t.addVehicle}</span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pb-4 sm:hidden">
            <div className="relative">
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
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all duration-300"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div
          className={`p-6 lg:p-8 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  {
                    label: "Vetura Totale",
                    value: displayStats.totalCars,
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    ),
                    color: "from-blue-500/20 to-blue-500/5",
                  },
                  {
                    label: t.activeListings,
                    value: displayStats.activeCars,
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    color: "from-green-500/20 to-green-500/5",
                  },
                  {
                    label: "Vlera e Portofolit",
                    value: formatPrice(displayStats.totalValue),
                    icon: (
                      <svg
                        className="w-6 h-6"
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
                    color: "from-purple-500/20 to-purple-500/5",
                  },
                  {
                    label: t.totalViews,
                    value: displayStats.totalViews.toLocaleString(),
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ),
                    color: "from-amber-500/20 to-amber-500/5",
                  },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`relative overflow-hidden p-6 bg-linear-to-br ${stat.color} border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-white/5 rounded-xl text-white/60">
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-2xl lg:text-3xl font-bold mb-1"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-sm text-white/50"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <button
                  onClick={openAddModal}
                  className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        Shto Automjet te Ri
                      </h3>
                      <p
                        className="text-sm text-white/50"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Listoje nje automjet te ri ne shitje
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("inventory")}
                  className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        Manage Inventory
                      </h3>
                      <p
                        className="text-sm text-white/50"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {t.viewAndEditYourListings}
                      </p>
                    </div>
                  </div>
                </button>

                <Link
                  to="/collection"
                  className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 text-left sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ fontFamily: "Cera Pro, sans-serif" }}
                      >
                        {t.viewPublicSite}
                      </h3>
                      <p
                        className="text-sm text-white/50"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Shikoni koleksionin tuaj
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Recent Vehicles */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    Veturat e Fundit
                  </h2>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t.viewAll}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredCars.slice(0, 3).map((car, index) => (
                    <div
                      key={car.id}
                      className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="relative aspect-16/10 bg-white/5 overflow-hidden">
                        {car.images && car.images.length > 0 ? (
                          <img
                            src={car.images[car.showcaseImage || 0]}
                            alt={car.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-white/20"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              car.status === "active"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {car.status === "active" ? t.active : t.draft}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="font-semibold mb-1 line-clamp-1"
                              style={{ fontFamily: "Cera Pro, sans-serif" }}
                            >
                              {car.name}
                            </h3>
                            <p
                              className="text-sm text-white/50"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {car.year} • {car.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p
                            className="text-lg font-bold"
                            style={{ fontFamily: "Cera Pro, sans-serif" }}
                          >
                            {formatPrice(car.price)}
                          </p>
                          <div className="flex items-center gap-2">
                            {/* Featured Indicator */}
                            <button
                              onClick={() => toggleFeatured(car)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                car.isFeatured
                                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                  : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-yellow-400"
                              }`}
                              title={
                                car.isFeatured
                                  ? "Hiq nga të veçuarat"
                                  : "Shto te të veçuarat"
                              }
                            >
                              <svg
                                className="w-4 h-4"
                                fill={car.isFeatured ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>
                            {/* Sold Indicator */}
                            <button
                              onClick={() => toggleSoldStatus(car)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                car.status === "sold"
                                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-red-400"
                              }`}
                              title={
                                car.status === "sold"
                                  ? "Hiq statusin e shitur"
                                  : "Shëno si të shitur"
                              }
                            >
                              <svg
                                className="w-4 h-4"
                                fill={
                                  car.status === "sold"
                                    ? "currentColor"
                                    : "none"
                                }
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
                            </button>
                            <button
                              onClick={() => openEditModal(car)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title={t.edit}
                            >
                              <svg
                                className="w-4 h-4 text-white/60"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    All Vehicles
                  </h2>
                  <p
                    className="text-sm text-white/50 mt-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {filteredCars.length} vehicle
                    {filteredCars.length !== 1 ? "s" : ""} in inventory
                  </p>
                </div>
              </div>

              {/* Vehicles List */}
              {filteredCars.length > 0 ? (
                <div className="space-y-4">
                  {filteredCars.map((car, index) => (
                    <div
                      key={car.id}
                      className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 lg:w-64 aspect-16/10 sm:aspect-auto sm:h-auto bg-white/5 shrink-0">
                          {car.images && car.images.length > 0 ? (
                            <img
                              src={car.images[car.showcaseImage || 0]}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full min-h-30 flex items-center justify-center">
                              <svg
                                className="w-10 h-10 text-white/20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="font-semibold text-lg"
                                style={{ fontFamily: "Cera Pro, sans-serif" }}
                              >
                                {car.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  car.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {car.status === "active" ? t.active : t.draft}
                              </span>
                            </div>
                            <p
                              className="text-sm text-white/50 mb-3"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {car.year} • {car.brand} • {car.category} •{" "}
                              {car.mileage.toLocaleString()} km
                            </p>
                            <p
                              className="text-xl font-bold"
                              style={{ fontFamily: "Cera Pro, sans-serif" }}
                            >
                              {formatPrice(car.price)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Toggle Status */}
                            <button
                              onClick={() => toggleCarStatus(car.id)}
                              className={`p-2.5 rounded-xl transition-all duration-300 ${
                                car.status === "active"
                                  ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                              }`}
                              title={
                                car.status === "active"
                                  ? t.setAsDraft
                                  : t.publish
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>

                            {/* Featured Indicator */}
                            <button
                              onClick={() => toggleFeatured(car)}
                              className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                                car.isFeatured
                                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                  : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-yellow-400"
                              }`}
                              title={
                                car.isFeatured
                                  ? "Hiq nga të veçuarat"
                                  : "Shto te të veçuarat"
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill={car.isFeatured ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>

                            {/* Sold Indicator */}
                            <button
                              onClick={() => toggleSoldStatus(car)}
                              className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                                car.status === "sold"
                                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-red-400"
                              }`}
                              title={
                                car.status === "sold"
                                  ? "Hiq statusin e shitur"
                                  : "Shëno si të shitur"
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill={
                                  car.status === "sold"
                                    ? "currentColor"
                                    : "none"
                                }
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
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => openEditModal(car)}
                              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                              title={t.edit}
                            >
                              <svg
                                className="w-5 h-5 text-white/60"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            {/* View */}
                            <Link
                              to={`/car/${car.slug}`}
                              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                              title={t.view}
                            >
                              <svg
                                className="w-5 h-5 text-white/60"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteConfirmId(car.id)}
                              className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-white/60 hover:text-red-400"
                              title={t.delete}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {deleteConfirmId === car.id && (
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
                          <div className="text-center">
                            <p
                              className="text-lg font-semibold mb-2"
                              style={{ fontFamily: "Cera Pro, sans-serif" }}
                            >
                              {t.deleteThisVehicle}
                            </p>
                            <p
                              className="text-sm text-white/50 mb-6"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {t.cannotUndo}
                            </p>
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-5 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-colors"
                              >
                                {t.cancelBtn}
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car.id)}
                                className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                              >
                                {t.confirmDelete}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {t.noVehiclesFound}
                  </h3>
                  <p
                    className="text-white/50 mb-6"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {searchQuery
                      ? t.tryAdjustSearch
                      : "Shto automjetin tënd të parë për të filluar."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={openAddModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-all"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {t.addVehicle}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl mx-4 my-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                {modalMode === "add" ? t.addNewVehicle : t.editVehicle}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
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

            {/* Form */}
            <form onSubmit={handleSaveCar} className="p-6 space-y-8">
              {/* Basic Info */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.basicInfo}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.vehicleName + " *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Mercedes-AMG GT 63 S"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.brandLabel + " *"}
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {brands.map((brand) => (
                        <option key={brand} value={brand} className="bg-black">
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.categoryLabel + " *"}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-black">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.priceLabel + " *"}
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="185000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.year + " *"}
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max="2030"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.mileage}
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="1250"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.statusLabel}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <option value="draft" className="bg-black">
                        {t.draft}
                      </option>
                      <option value="active" className="bg-black">
                        {t.active}
                      </option>
                      <option value="sold" className="bg-black">
                        {t.sold}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Appearance
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.exteriorColor}
                    </label>
                    <input
                      type="text"
                      name="exteriorColor"
                      value={formData.exteriorColor}
                      onChange={handleInputChange}
                      placeholder="Obsidian Black Metallic"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.interiorColor}
                    </label>
                    <input
                      type="text"
                      name="interiorColor"
                      value={formData.interiorColor}
                      onChange={handleInputChange}
                      placeholder="Nappa Leather Red/Black"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Performanca & Të dhënat
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.engine}
                    </label>
                    <input
                      type="text"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      placeholder="4.0L V8 Biturbo"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.horsepower}
                    </label>
                    <input
                      type="number"
                      name="horsepower"
                      value={formData.horsepower}
                      onChange={handleInputChange}
                      placeholder="630"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.torque}
                    </label>
                    <input
                      type="number"
                      name="torque"
                      value={formData.torque}
                      onChange={handleInputChange}
                      placeholder="850"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      0-100 km/h (sec)
                    </label>
                    <input
                      type="number"
                      name="acceleration"
                      value={formData.acceleration}
                      onChange={handleInputChange}
                      step="0.1"
                      placeholder="3.5"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.topSpeed}
                    </label>
                    <input
                      type="number"
                      name="topSpeed"
                      value={formData.topSpeed}
                      onChange={handleInputChange}
                      placeholder="315"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.transmission}
                    </label>
                    <input
                      type="text"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      placeholder="9-speed Automatic"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      {t.drivetrain}
                    </label>
                    <input
                      type="text"
                      name="drivetrain"
                      value={formData.drivetrain}
                      onChange={handleInputChange}
                      placeholder="All-Wheel Drive"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      Karburanti
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {fuelTypes.map((fuel) => (
                        <option key={fuel} value={fuel} className="bg-black">
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      L/100km
                    </label>
                    <input
                      type="text"
                      name="mpg"
                      value={formData.mpg}
                      onChange={handleInputChange}
                      placeholder="8.5"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                      VIN
                    </label>
                    <input
                      type="text"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      placeholder="WDD2173421A000000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.imagesLabel}
                </h3>
                <p
                  className="text-sm text-white/50 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.imagesUploadHint}
                </p>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                          formData.showcaseImage === index
                            ? "border-amber-500"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Showcase Badge */}
                        {formData.showcaseImage === index && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-black text-xs font-semibold rounded">
                            SHOWCASE
                          </div>
                        )}

                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {/* Set as Showcase */}
                          <button
                            type="button"
                            onClick={() => setShowcaseImage(index)}
                            className={`p-2 rounded-lg transition-colors ${
                              formData.showcaseImage === index
                                ? "bg-amber-500 text-black"
                                : "bg-white/20 hover:bg-amber-500 hover:text-black"
                            }`}
                            title="Set as Showcase"
                          >
                            <svg
                              className="w-5 h-5"
                              fill={
                                formData.showcaseImage === index
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>

                          {/* Move Left */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              title="Move Left"
                            >
                              <svg
                                className="w-5 h-5"
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
                          )}

                          {/* Move Right */}
                          {index < formData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              title="Move Right"
                            >
                              <svg
                                className="w-5 h-5"
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
                          )}

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2"
                >
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span
                    className="text-sm text-white/50"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t.clickToUploadImages}
                  </span>
                </button>
              </div>

              {/* Features */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.features}
                </h3>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        placeholder="e.g. AMG Carbon Fiber Trim"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
                        >
                          <svg
                            className="w-5 h-5"
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
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:border-white/40 hover:text-white/70 transition-all flex items-center justify-center gap-2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                      Add Feature
                    </span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3
                  className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.descriptionLabel}
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell the story of this vehicle..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5 cursor-pointer accent-white"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm uppercase tracking-widest text-white/70 cursor-pointer hover:text-white transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.addToFeatured}
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Duke ruajtur...
                    </>
                  ) : modalMode === "add" ? (
                    t.addVehicle
                  ) : (
                    t.saveChanges
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500/20 border-green-500/30 text-green-400"
              : "bg-red-500/20 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <svg
                className="w-5 h-5"
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
            ) : (
              <svg
                className="w-5 h-5"
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
            )}
            <span style={{ fontFamily: "Montserrat, sans-serif" }}>
              {notification.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
