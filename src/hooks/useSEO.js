import { useEffect } from "react";

/**
 * Custom hook for managing SEO meta tags dynamically
 * Compatible with React 19
 */
export const useSEO = ({
  title = "Auto TAFA | Vetura Luksoze në Gjilan, Kosovë",
  description = "Auto TAFA - Saloni më eksklusiv i veturave në Gjilan, Kosovë. Kerr luksoze në shitje, merrjep vetura, Mercedes, BMW, Audi, Porsche.",
  keywords = "auto tafa, kerr ne shitje, vetura ne shitje, merrjep, auto sallon gjilan",
  image = "/og-image.jpg",
  url = "",
  type = "website",
  noIndex = false,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tags
    const updateMeta = (property, content, isName = false) => {
      const attr = isName ? "name" : "property";
      let element = document.querySelector(`meta[${attr}="${property}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Primary meta tags
    updateMeta("description", description, true);
    updateMeta("keywords", keywords, true);

    // Robots
    if (noIndex) {
      updateMeta("robots", "noindex, nofollow", true);
    }

    // Open Graph
    updateMeta("og:title", title);
    updateMeta("og:description", description);
    updateMeta("og:type", type);
    updateMeta(
      "og:image",
      image.startsWith("http") ? image : `https://tafaleka.com${image}`,
    );
    if (url) updateMeta("og:url", url);

    // Twitter
    updateMeta("twitter:title", title, true);
    updateMeta("twitter:description", description, true);
    updateMeta(
      "twitter:image",
      image.startsWith("http") ? image : `https://tafaleka.com${image}`,
      true,
    );

    // Cleanup function
    return () => {
      // Reset to default on unmount (optional)
    };
  }, [title, description, keywords, image, url, type, noIndex]);
};

/**
 * SEO Component for adding JSON-LD structured data
 */
export const JsonLd = ({ data }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.id = `jsonld-${Math.random().toString(36).substr(2, 9)}`;
    document.head.appendChild(script);

    return () => {
      const element = document.getElementById(script.id);
      if (element) element.remove();
    };
  }, [data]);

  return null;
};

// SEO content for each page
export const seoContent = {
  home: {
    title:
      "Auto TAFA | Tafa Leka | Vetura Luksoze në Shitje në Gjilan, Kosovë",
    description:
      "Auto TAFA & Tafa Leka - Saloni më eksklusiv i veturave në Gjilan, Kosovë. Kerr luksoze në shitje, merrjep vetura, Mercedes, BMW, Audi, Porsche. Vizitoni AutoTafa sot.",
    keywords:
      "auto tafa, tafa leka, autotafa, kerr ne shitje, vetura ne shitje, merrjep, auto sallon gjilan, vetura luksoze kosove, mercedes gjilan, bmw kosove, audi shitje, porsche kosove, makina ne shitje, vetura gjilan",
  },
  collection: {
    title: "Koleksioni i Veturave | Auto TAFA | Tafa Leka | Kerr në Shitje",
    description:
      "Shfletoni koleksionin e Auto TAFA & Tafa Leka. Veturat më të mira luksoze: Mercedes-Benz, BMW, Audi, Porsche. Kerr në shitje në Gjilan, Kosovë.",
    keywords:
      "koleksion veturash, tafa leka vetura, auto tafa kerr, mercedes shitje, bmw shitje kosove, audi ne shitje, vetura luksoze, auto pazar, merrjep auto",
  },
  about: {
    title: "Rreth Nesh | Auto TAFA & Tafa Leka | Gjilan, Kosovë",
    description:
      "Njihuni me Auto TAFA & Tafa Leka - liderët në shitjen e veturave luksoze në Gjilan. Mbi 15 vjet eksperiencë në tregun e makinave në Kosovë.",
    keywords:
      "rreth auto tafa, kush eshte tafa leka, auto sallon gjilan, histori auto tafa, auto dealer kosove, shitës veturash",
  },
  contact: {
    title: "Na Kontaktoni | Auto TAFA | Tafa Leka | Lokacioni Gjilan",
    description:
      "Kontaktoni Auto TAFA & Tafa Leka për çdo pyetje. Vizitoni sallonin tonë në Gjilan ose na kontaktoni përmes telefonit apo emailit.",
    keywords:
      "kontakt auto tafa, telefon tafa leka, adresa auto tafa, lokacioni gjilan, auto sallon kontakt, makina ne shitje kontakt",
  },
  carDetail: (car = {}) => ({
    title: `${car.year || ""} ${car.make || ""} ${car.model || ""} | Auto TAFA Gjilan`,
    description: `${car.year || ""} ${car.make || ""} ${car.model || ""} në shitje te Auto TAFA. ${car.mileage ? `${car.mileage} km` : ""} ${car.transmission || ""}. Vizitoni sallonin tonë në Gjilan, Kosovë.`,
    keywords: `${car.make || ""} ${car.model || ""} shitje, ${car.make || ""} gjilan, kerr ${car.make || ""}, vetura ${car.make || ""} kosove`,
  }),
};

export default useSEO;
