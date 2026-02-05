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
      image.startsWith("http") ? image : `https://autosallontafa.com${image}`,
    );
    if (url) updateMeta("og:url", url);

    // Twitter
    updateMeta("twitter:title", title, true);
    updateMeta("twitter:description", description, true);
    updateMeta(
      "twitter:image",
      image.startsWith("http") ? image : `https://autosallontafa.com${image}`,
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
      "Auto TAFA | Vetura Luksoze në Shitje në Gjilan, Kosovë | Kerr në Shitje",
    description:
      "Auto TAFA - Saloni më eksklusiv i veturave në Gjilan, Kosovë. Kerr luksoze në shitje, merrjep vetura, Mercedes, BMW, Audi, Porsche. Vizitoni sallonin tonë për veturat më të mira.",
    keywords:
      "auto tafa, kerr ne shitje, vetura ne shitje, merrjep, auto sallon gjilan, vetura luksoze kosove, mercedes gjilan, bmw kosove, audi shitje, porsche kosove, auto shtëpi gjilan, makina ne shitje, vetura gjilan",
  },
  collection: {
    title: "Koleksioni i Veturave | Auto TAFA Gjilan | Kerr në Shitje Kosovë",
    description:
      "Shfletoni koleksionin tonë ekskluziv të veturave luksoze. Mercedes-Benz, BMW, Audi, Porsche dhe më shumë. Kerr në shitje në Gjilan, Kosovë.",
    keywords:
      "koleksion veturash, kerr ne shitje gjilan, mercedes shitje, bmw shitje kosove, audi ne shitje, vetura luksoze, auto pazar, makina gjilan, merrjep auto",
  },
  about: {
    title: "Rreth Nesh | Auto TAFA - Histori e Suksesit në Gjilan",
    description:
      "Njihuni me Auto TAFA - lideri në shitjen e veturave luksoze në Gjilan, Kosovë. Mbi 15 vjet eksperiencë, 500+ vetura të shitura, klientë të kënaqur.",
    keywords:
      "rreth auto tafa, auto sallon gjilan, histori auto tafa, kush jemi ne, auto dealer kosove, shitës veturash",
  },
  contact: {
    title: "Na Kontaktoni | Auto TAFA Gjilan | Telefon, Email, Lokacioni",
    description:
      "Kontaktoni Auto TAFA për të gjitha pyetjet tuaja. Vizitoni sallonin tonë në Gjilan ose na kontaktoni përmes telefonit apo emailit. Jemi këtu për ju!",
    keywords:
      "kontakt auto tafa, telefon auto tafa, adresa auto tafa, lokacioni gjilan, email auto tafa, auto sallon kontakt",
  },
  carDetail: (car = {}) => ({
    title: `${car.year || ""} ${car.make || ""} ${car.model || ""} | Auto TAFA Gjilan`,
    description: `${car.year || ""} ${car.make || ""} ${car.model || ""} në shitje te Auto TAFA. ${car.mileage ? `${car.mileage} km` : ""} ${car.transmission || ""}. Vizitoni sallonin tonë në Gjilan, Kosovë.`,
    keywords: `${car.make || ""} ${car.model || ""} shitje, ${car.make || ""} gjilan, kerr ${car.make || ""}, vetura ${car.make || ""} kosove`,
  }),
};

export default useSEO;
