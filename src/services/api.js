// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ============ CARS API ============

export const carsApi = {
  // Get all active cars (public)
  getActiveCars: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return apiCall(`/cars/public${queryString ? `?${queryString}` : ""}`);
  },

  // Get featured cars for homepage
  getFeaturedCars: async (limit = 3) => {
    return apiCall(`/cars/featured?limit=${limit}`);
  },

  // Get showcase car (the single most exclusive car)
  getShowcaseCar: async () => {
    return apiCall("/cars/showcase");
  },

  // Get car by slug (public)
  getCarBySlug: async (slug) => {
    return apiCall(`/cars/slug/${slug}`);
  },

  // Get all cars (admin)
  getAllCars: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return apiCall(`/cars${queryString ? `?${queryString}` : ""}`);
  },

  // Get car by ID (admin)
  getCarById: async (id) => {
    return apiCall(`/cars/${id}`);
  },

  // Get dashboard stats
  getStats: async () => {
    return apiCall("/cars/stats");
  },

  // Create new car
  createCar: async (carData) => {
    return apiCall("/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  },

  // Update car
  updateCar: async (id, carData) => {
    return apiCall(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  },

  // Delete car
  deleteCar: async (id) => {
    return apiCall(`/cars/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle car status
  toggleStatus: async (id) => {
    return apiCall(`/cars/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};

// ============ CONTACT API ============

export const contactApi = {
  // Submit contact inquiry (public)
  submitInquiry: async (data) => {
    return apiCall("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get all inquiries (admin)
  getAllInquiries: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return apiCall(`/contact${queryString ? `?${queryString}` : ""}`);
  },

  // Get inquiry by ID (admin)
  getInquiryById: async (id) => {
    return apiCall(`/contact/${id}`);
  },

  // Update inquiry status (admin)
  updateStatus: async (id, status) => {
    return apiCall(`/contact/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Delete inquiry (admin)
  deleteInquiry: async (id) => {
    return apiCall(`/contact/${id}`, {
      method: "DELETE",
    });
  },

  // Get inquiry counts (admin)
  getCounts: async () => {
    return apiCall("/contact/counts");
  },
};

// ============ UPLOAD API ============

export const uploadApi = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiCall("/upload/single", {
      method: "POST",
      body: formData,
    });
  },

  // Upload multiple images
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return apiCall("/upload/multiple", {
      method: "POST",
      body: formData,
    });
  },

  // Delete image
  deleteImage: async (filename) => {
    return apiCall(`/upload/${filename}`, {
      method: "DELETE",
    });
  },

  // Get full URL for image
  getImageUrl: (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL.replace("/api", "")}${path}`;
  },
};

// ============ HEALTH CHECK ============

export const healthCheck = async () => {
  return apiCall("/health");
};

// Default export with all APIs
const api = {
  cars: carsApi,
  contact: contactApi,
  upload: uploadApi,
  healthCheck,
};

export default api;
