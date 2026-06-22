const Car = require("../models/Car");
const db = require("../config/db_connect");

// Local mapping fallback if Gemini API fails
const BRAND_MAP = {
  "제네시스": "Genesis",
  "현대": "Hyundai",
  "기아": "Kia",
  "쌍용": "SsangYong",
  "르노코리아": "Renault Korea",
  "르노삼성": "Renault Samsung",
  "쉐보레": "Chevrolet",
  "대우": "Daewoo",
  "벤츠": "Mercedes-Benz",
  "BMW": "BMW",
  "아우디": "Audi",
  "폭스바겐": "Volkswagen",
  "볼보": "Volvo",
  "렉서스": "Lexus",
  "토요타": "Toyota",
  "혼다": "Honda",
  "포드": "Ford",
  "지프": "Jeep",
  "랜드로버": "Land Rover",
  "포르쉐": "Porsche",
  "미니": "MINI",
  "푸조": "Peugeot",
  "재규어": "Jaguar",
  "인피니티": "Infiniti",
  "캐딜락": "Cadillac",
  "크라이슬러": "Chrysler",
  "마세라티": "Maserati",
  "벤틀리": "Bentley",
  "람보르기니": "Lamborghini",
  "페라리": "Ferrari"
};

const TRANSMISSION_MAP = {
  "오토": "Automatike",
  "수동": "Manuale",
  "세미오토": "Automatike",
  "CVT": "Automatike"
};

const FUEL_MAP = {
  "가솔린": "Benzin",
  "디젤": "Dizell",
  "LPG": "LPG",
  "하이브리드": "Hibrid",
  "전기": "Elektrik",
  "수소": "Hibrid"
};

const COLOR_MAP = {
  "흰색": "E bardhë",
  "검정색": "E zezë",
  "검정": "E zezë",
  "회색": "Hiri",
  "쥐색": "Hiri",
  "은색": "Argjend",
  "청색": "E kaltër",
  "파랑": "E kaltër",
  "빨강": "E kuqe",
  "적색": "E kuqe",
  "갈색": "E kaftë",
  "노랑": "E verdhë",
  "진주": "Perla"
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(prompt, apiKey, maxRetries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Gemini API returned ${res.status}${errBody ? `: ${errBody}` : ""}`);
      }

      const resData = await res.json();
      let rawText = resData.candidates[0].content.parts[0].text.trim();

      if (rawText.startsWith("```json")) {
        rawText = rawText.substring(7, rawText.length - 3).trim();
      } else if (rawText.startsWith("```")) {
        rawText = rawText.substring(3, rawText.length - 3).trim();
      }

      return JSON.parse(rawText);
    } catch (error) {
      const isRateLimit = error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("Too Many Requests");
      console.error(`❌ Gemini attempt ${attempt}/${maxRetries} failed: ${error.message}${isRateLimit ? " (rate limited)" : ""}`);

      if (attempt === maxRetries) throw error;
      if (isRateLimit) {
        const backoff = Math.min(attempt * 2000, 8000);
        console.log(`⏳ Waiting ${backoff}ms before retry...`);
        await sleep(backoff);
      } else {
        await sleep(1000);
      }
    }
  }
}

// Translate details using Gemini API
async function translateCarDetails(car, spec, oneLineText, inspectionData, insuranceData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is not defined. Using fallback dictionaries.");
    return null;
  }

  // Extract accident details from inspection
  let accidentSummary = "";
  if (inspectionData && inspectionData.master) {
    const hasAccident = !!inspectionData.master.accdient;
    const hasSimpleRepair = !!inspectionData.master.simpleRepair;
    const tuning = !!inspectionData.master.detail?.tuning;
    
    accidentSummary += `- Historia e aksidenteve (Strukturore): ${hasAccident ? 'Po (Ka aksidente)' : 'Jo (Nuk ka aksidente)'}\n`;
    accidentSummary += `- Riparime të thjeshta (Pllaka/Pjesë të jashtme): ${hasSimpleRepair ? 'Po' : 'Jo'}\n`;
    accidentSummary += `- E modifikuar (Tuning): ${tuning ? 'Po' : 'Jo'}\n`;
    
    if (inspectionData.outers && inspectionData.outers.length > 0) {
      const repairs = inspectionData.outers.map(o => {
        const part = o.type?.title || "";
        const status = o.statusTypes?.map(s => s.title).join(", ") || "";
        return `${part} (${status})`;
      }).join(", ");
      accidentSummary += `- Pjesët e riparuara/ndërruara: ${repairs}\n`;
    }
  }

  // Extract insurance history
  let insuranceSummary = "";
  if (insuranceData) {
    insuranceSummary += `- Aksidente të regjistruara për këtë mjet: ${insuranceData.myAccidentCnt || 0} herë (Kosto totale e dëmeve: ${insuranceData.myAccidentCost ? insuranceData.myAccidentCost.toLocaleString() + ' KRW' : '0'})\n`;
    insuranceSummary += `- Dëme të shkaktuara ndaj të tjerëve: ${insuranceData.otherAccidentCnt || 0} herë\n`;
    insuranceSummary += `- Numri i ndryshimeve të pronarëve: ${insuranceData.ownerChangeCnt || 0}\n`;
    insuranceSummary += `- Humbje totale ose dëmtime nga përmbytjet: ${insuranceData.floodTotalLossCnt > 0 ? 'Po' : 'Jo'}\n`;
  }

  const prompt = `
You are an expert translator at an elite used-car dealership in Kosovo. 
Translate this used car data from Korean to Albanian. Keep terms professional and appropriate for a car dealership.
Return ONLY a valid JSON object (no markdown, no backticks, no wrap, just raw JSON) matching this exact schema:
{
  "name": "Translated Car Name (e.g., Hyundai Grandeur)",
  "brand": "Translated Brand (e.g. Hyundai)",
  "category": "One of: SUV, Sedan, Kupe, Kabriolet, Haxhbek, Karavan, Minivan",
  "transmission": "One of: Automatike, Manuale",
  "fuelType": "One of: Dizell, Benzin, Hibrid, Elektrik, LPG",
  "color": "Translated color (e.g. E bardhë, E zezë, Hiri, Argjend, E kaltër, E kuqe, E verdhë, E kaftë)",
  "tagline": "A short catchy tagline in Albanian (e.g. Importuar nga Korea - Në gjendje të shkëlqyer)",
  "description": "A detailed descriptive paragraph about the car in Albanian. Incorporate the accident history, simple repairs details, and owner change count seamlessly into the description in Albanian. Keep the tone professional, reassuring, and transparent, noting if there are owner changes, major accidents, or only simple panel repairs. Do not include pricing.",
  "features": ["Feature 1 in Albanian", "Feature 2 in Albanian", "Feature 3 in Albanian", "Accident/Repairs history bullet point in Albanian (e.g., 'Pa aksidente të rëndësishme', 'Vetëm riparime të thjeshta', '1 pronar i mëparshëm')"]
}

Source Data:
- Manufacturer: ${car.Manufacturer}
- Model: ${car.Model}
- Badge: ${car.Badge || ''}
- Fuel Type: ${car.FuelType || ''}
- Color: ${spec.colorName || ''}
- Transmission: ${spec.transmissionName || ''}
- Short Description: ${oneLineText || ''}
${accidentSummary ? `- Accident & Inspection History:\n${accidentSummary}` : ''}
${insuranceSummary ? `- Insurance History:\n${insuranceSummary}` : ''}
`;

  try {
    console.log(`🤖 Translating ${car.Manufacturer} ${car.Model}...`);
    const parsed = await callGeminiWithRetry(prompt, apiKey);
    console.log(`✅ Translation successful for ${car.Manufacturer} ${car.Model}`);
    return parsed;
  } catch (error) {
    console.error(`❌ Gemini translation failed for ${car.Manufacturer} ${car.Model}:`, error.message);
    return null;
  }
}

// Convert KRW (in 10,000s) to EUR
function convertPrice(priceInTenThousandKrw) {
  // Exchange rate: 1 EUR = 1,500 KRW
  // E.g., 3790 만원 = 37,900,000 KRW
  // 37,900,000 / 1500 = 25266.66 -> 25267 EUR
  const krw = priceInTenThousandKrw * 10000;
  return Math.round(krw / 1500);
}

// Sync latest listings from Encar
async function syncEncarListings(limit = 20, isDomestic = true) {
  console.log(`🚀 Starting Encar Sync (Domestic: ${isDomestic}, Limit: ${limit})`);
  const logs = [];
  let importedCount = 0;
  let skippedCount = 0;

  try {
    // 1. Fetch latest listings from Encar
    // Domestic = CarType.Y, Foreign = CarType.N
    const queryCarType = isDomestic ? "CarType.Y" : "CarType.N";
    const searchUrl = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.${queryCarType}.)&sr=%7CModifiedDate%7C0%7C${limit}`;
    
    const listRes = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://www.encar.com/",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "ko-KR,ko;q=0.9"
      }
    });

    if (!listRes.ok) {
      throw new Error(`Encar search list request failed with status ${listRes.status}`);
    }

    const listData = await listRes.json();
    const searchResults = listData.SearchResults || [];
    console.log(`Found ${searchResults.length} listings on Encar`);

    // 2. Process each listing
    for (const car of searchResults) {
      const encarId = `encar_${car.Id}`;

      // Check if car already exists
      const [existing] = await db.query("SELECT id, inspection_data FROM cars WHERE encar_id = ? LIMIT 1", [encarId]);
      let isUpdateMissingInspection = false;
      let existingCarId = null;
      if (existing && existing.length > 0) {
        const existingCar = existing[0];
        if (!existingCar.inspection_data) {
          console.log(`[Encar ID ${encarId}] Already imported but missing inspection data. Fetching details and updating...`);
          isUpdateMissingInspection = true;
          existingCarId = existingCar.id;
        } else {
          console.log(`[Encar ID ${encarId}] Already imported, skipping.`);
          skippedCount++;
          continue;
        }
      }

      // Fetch detail page data with PHOTOS include
      const detailUrl = `https://api.encar.com/v1/readside/vehicle/${car.Id}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT,PHOTOS`;
      const detailHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://fem.encar.com/",
        "Accept": "application/json",
        "Accept-Language": "ko-KR,ko;q=0.9"
      };

      const detailRes = await fetch(detailUrl, { headers: detailHeaders });

      if (!detailRes.ok) {
        console.warn(`[Encar ID ${car.Id}] Failed to fetch vehicle details, skipping.`);
        continue;
      }

      const detailData = await detailRes.json();
      const spec = detailData.spec || {};
      const ad = detailData.advertisement || {};
      
      const priceKrw = ad.price || car.Price || 0;
      const priceEur = convertPrice(priceKrw);
      const oneLineText = ad.oneLineText || "";

      // Fetch Accident & Insurance Details dynamically using vehicleId
      let inspectionData = null;
      let insuranceData = null;
      const vehicleId = detailData.vehicleId || car.Id;
      const vehicleNo = detailData.vehicleNo;

      // 1. Fetch Inspection / Accident record
      try {
        const inspUrl = `https://api.encar.com/v1/readside/inspection/vehicle/${vehicleId}`;
        const inspRes = await fetch(inspUrl, { headers: detailHeaders });
        if (inspRes.ok) {
          inspectionData = await inspRes.json();
          console.log(`[Encar ID ${car.Id}] Inspection data fetched: vehicleId=${vehicleId}, outers=${inspectionData.outers?.length ?? 0}, inners=${inspectionData.inners?.length ?? 0}`);
        } else {
          console.warn(`[Encar ID ${car.Id}] Inspection API returned ${inspRes.status} for vehicleId=${vehicleId}`);
        }
      } catch (err) {
        console.warn(`[Encar ID ${car.Id}] Failed to fetch inspection data:`, err.message);
      }

      // 2. Fetch Insurance record
      if (vehicleNo) {
        try {
          const recUrl = `https://api.encar.com/v1/readside/record/vehicle/${vehicleId}/open?vehicleNo=${encodeURIComponent(vehicleNo)}`;
          const recRes = await fetch(recUrl, { headers: detailHeaders });
          if (recRes.ok) {
            insuranceData = await recRes.json();
          }
        } catch (err) {
          console.warn(`[Encar ID ${car.Id}] Failed to fetch insurance record:`, err.message);
        }
      }

      // 3. Translate and map fields
      const manufacturerName = BRAND_MAP[car.Manufacturer] || car.Manufacturer;
      let name = `${manufacturerName} ${car.Model}`;
      let brand = manufacturerName;
      let category = isDomestic ? "SUV" : "Sedan";
      let transmission = TRANSMISSION_MAP[spec.transmissionName] || "Automatike";
      let fuelType = FUEL_MAP[car.FuelType] || FUEL_MAP[spec.fuelName] || "Benzin";
      let color = COLOR_MAP[spec.colorName] || spec.colorName || "E hirtë";
      let tagline = "Importuar nga Korea - Në gjendje të shkëlqyer";
      let description = `Mjet i importuar direkt nga Koreja e Jugut. Në gjendje shumë të mirë teknike dhe vizuale. Transmisioni ${transmission}, karburanti ${fuelType.toLowerCase()}.`;
      let features = ["Sistemi i navigimit", "Kamera e pasme", "Sistemi i klimës", "Sistemet e sigurisë ABS/ESP"];

      // Try Gemini translation with rich inspection and insurance details
      const translated = await translateCarDetails(car, spec, oneLineText, inspectionData, insuranceData);
      // Delay to avoid hitting Gemini rate limits
      await sleep(1500);
      if (translated) {
        name = translated.name || name;
        brand = translated.brand || brand;
        category = translated.category || category;
        transmission = translated.transmission || transmission;
        fuelType = translated.fuelType || fuelType;
        color = translated.color || color;
        tagline = translated.tagline || tagline;
        description = translated.description || description;
        if (translated.features && translated.features.length > 0) {
          features = translated.features;
        }
      }

      // Parse photos - Get all high-resolution photos from details API
      const imageList = [];
      const detailPhotos = detailData.photos || [];
      if (detailPhotos.length > 0) {
        // Sort photos numerically by code (e.g. 001, 002...) to prevent scrambling and keep cover photo first
        detailPhotos.sort((a, b) => {
          const codeA = parseInt(a.code) || 999;
          const codeB = parseInt(b.code) || 999;
          return codeA - codeB;
        });

        detailPhotos.forEach(p => {
          if (p.path) {
            imageList.push(`https://ci.encar.com${p.path}`);
          }
        });
      } else {
        // Fallback to listing thumbnails
        if (car.Photos && car.Photos.length > 0) {
          car.Photos.slice(0, 20).forEach(p => {
            if (p.location) {
              imageList.push(`https://ci.encar.com${p.location}`);
            }
          });
        } else if (car.Photo) {
          const loc = car.Photo.endsWith(".jpg") ? car.Photo : `${car.Photo}001.jpg`;
          imageList.push(`https://ci.encar.com${loc}`);
        }
      }

      // Ensure we have at least one image
      if (imageList.length === 0) {
        imageList.push("https://ci.encar.com/carpicture02/pic4212/42129581_001.jpg"); // default mock fallback
      }

      // Generate slug
      const slugBase = `${brand}-${name}-${encarId}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // Model spec numbers
      const displacement = spec.displacement ? `${(spec.displacement / 1000).toFixed(1)}L` : "2.0L";
      const engineStr = `${displacement} ${fuelType}`;

      // Assemble car database payload
      const carPayload = {
        encar_id: encarId,
        name: name,
        slug: slugBase,
        tagline: tagline,
        category: category,
        brand: brand,
        price: priceEur,
        year: spec.year || parseInt(car.FormYear) || 2020,
        mileage: spec.mileage || car.Mileage || 0,
        exteriorColor: color,
        interiorColor: "E zezë",
        engine: engineStr,
        horsepower: spec.horsepower || null,
        torque: spec.torque || null,
        acceleration: 0.0,
        topSpeed: 200,
        transmission: transmission,
        drivetrain: "AWD",
        fuelType: fuelType,
        mpg: "7.5 L/100km",
        vin: detailData.vin ? `${detailData.vin}-${car.Id}` : `KOR${car.Id}${Math.floor(100 + Math.random() * 900)}`, // Unique Encar VIN or fallback
        description: description,
        inspectionData: inspectionData,
        status: "active", // Published immediately
        showcaseImage: 0,
        isFeatured: 0,
        isShowcase: 0,
        isSold: 0,
        images: imageList,
        features: features
      };

      try {
        if (isUpdateMissingInspection) {
          console.log(`[Encar ID ${encarId}] Updating inspection data for car ID ${existingCarId}, inspectionData is ${inspectionData ? 'non-null' : 'null'}`);
          await db.query(
            "UPDATE cars SET inspection_data = ? WHERE id = ?",
            [inspectionData ? JSON.stringify(inspectionData) : null, existingCarId]
          );
          console.log(`✅ [Encar ID ${encarId}] Updated missing inspection data for car ID ${existingCarId}`);
          logs.push(`Përditësuar raporti i gjendjes për ID ${car.Id}`);
          importedCount++;
        } else {
          console.log(`[Encar ID ${encarId}] Creating car, inspectionData is ${carPayload.inspectionData ? 'non-null' : 'null'}`);
          const createdCar = await Car.create(carPayload);
          console.log(`✅ [Encar ID ${encarId}] Successfully imported as: ${createdCar.name} (${createdCar.price} €)`);
          logs.push(`U importua me sukses: ${createdCar.name} (${createdCar.brand}) - ${createdCar.price} €`);
          importedCount++;
        }
      } catch (err) {
        console.error(`❌ [Encar ID ${encarId}] Failed to save to database:`, err.message);
        logs.push(`Dështoi importimi i ID ${car.Id}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error("Encar sync general failure:", error);
    throw error;
  }

  return {
    success: true,
    importedCount,
    skippedCount,
    logs
  };
}

module.exports = { syncEncarListings };
