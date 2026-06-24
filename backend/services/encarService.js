const Car = require("../models/Car");
const db = require("../config/db_connect");
const pricingService = require("./pricingService");

// Local mapping fallback if Gemini API fails
const BRAND_MAP = {
  "제네시스": "Genesis",
  "현대": "Hyundai",
  "기아": "Kia",
  "쌍용": "SsangYong",
  "KG모빌리티": "KG Mobility",
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

// Korean-to-English model name mapping
const MODEL_NAME_MAP = {
  // Hyundai
  "아반떼": "Avante",
  "쏘나타": "Sonata",
  "그랜저": "Grandeur",
  "투싼": "Tucson",
  "싼타페": "Santa Fe",
  "팰리세이드": "Palisade",
  "코나": "Kona",
  "아이오닉": "Ioniq",
  "아이오닉5": "Ioniq 5",
  "아이오닉6": "Ioniq 6",
  "베뉴": "Venue",
  "스타리아": "Staria",
  "포터": "Porter",
  "스타렉스": "Starex",
  "맥스크루즈": "Maxcruz",
  "벨로스터": "Veloster",
  "i30": "i30",
  "i10": "i10",
  "i20": "i20",
  "ix35": "ix35",
  "넥쏘": "Nexo",
  "캐스퍼": "Casper",
  // Kia
  "쏘렌토": "Sorento",
  "스포티지": "Sportage",
  "카니발": "Carnival",
  "모닝": "Morning",
  "레이": "Ray",
  "니로": "Niro",
  "EV6": "EV6",
  "EV9": "EV9",
  "셀토스": "Seltos",
  "스팅어": "Stinger",
  "K3": "K3",
  "K5": "K5",
  "K7": "K7",
  "K8": "K8",
  "K9": "K9",
  "포르테": "Forte",
  "프라이드": "Pride",
  "카덴자": "Cadenza",
  // Genesis
  "G70": "G70",
  "G80": "G80",
  "G90": "G90",
  "GV60": "GV60",
  "GV70": "GV70",
  "GV80": "GV80",
  // SsangYong / KG Mobility
  "티볼리": "Tivoli",
  "코란도": "Korando",
  "렉스턴": "Rexton",
  "토레스": "Torres",
  // Renault Korea / Samsung
  "QM6": "QM6",
  "XM3": "XM3",
  "SM6": "SM6",
  "SM3": "SM3",
  "아르카나": "Arkana",
  "콜레오스": "Koleos",
  "스파크": "Spark",
  "제네시스": "Genesis",
};

// General Korean words that can appear alongside model names
const GENERAL_KOREAN_WORDS = {
  "그랜드": "Grand",
  "더 넥스트": "The Next",
  "넥스트": "Next",
};

const PREMIUM_BRANDS = [
  "Audi", "BMW", "Mercedes-Benz", "Mercedes", "Porsche",
  "Land Rover", "Jaguar", "Maserati", "Ferrari", "Lamborghini",
  "Bentley", "Rolls-Royce", "McLaren", "Aston Martin"
];

// Normalize brand names to match the frontend ALL_BRANDS list
const BRAND_NORMALIZE = {
  "Mercedes-Benz": "Mercedes",
  "Renault Korea": "Renault",
  "Renault Samsung": "Renault",
};

// Replace Korean text with English using map, keeping any suffixes/prefixes
function translateWithMap(map, text, stripTrailingKorean = false) {
  if (!text) return text;
  // Exact match first
  if (map[text]) return map[text];
  // Substring match - replace longest matched Korean key with English value
  let bestKey = null;
  let bestVal = null;
  let bestLen = 0;
  for (const [key, val] of Object.entries(map)) {
    if (text.includes(key) && key.length > bestLen) {
      bestKey = key;
      bestVal = val;
      bestLen = key.length;
    }
  }
  if (bestKey) {
    let result = text.replace(bestKey, bestVal);
    if (stripTrailingKorean) {
      result = result.replace(/[\uAC00-\uD7AF()\s]+$/, "").trim();
    }
    return result;
  }
  return text;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

async function callGeminiWithRetry(prompt, apiKey, maxRetries = 2) {
  for (let modelIdx = 0; modelIdx < GEMINI_MODELS.length; modelIdx++) {
    const model = GEMINI_MODELS[modelIdx];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
          const isClientError = res.status >= 400 && res.status < 500 && res.status !== 429;
          if (isClientError) {
            console.warn(`⚠️ Model ${model} not available (${res.status}), trying next...`);
            break;
          }
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
        console.error(`❌ Gemini ${model} attempt ${attempt}/${maxRetries} failed: ${error.message}${isRateLimit ? " (rate limited)" : ""}`);

        if (attempt === maxRetries) {
          if (modelIdx < GEMINI_MODELS.length - 1) {
            console.log(`🔄 Trying next model: ${GEMINI_MODELS[modelIdx + 1]}`);
          }
          break;
        }
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

  console.error("❌ All Gemini models exhausted, falling back to dictionary translation");
  return null;
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

// ── Exchange Rate ─────────────────────────────────────────────────────────
// Cached for the lifetime of a single sync run
let _cachedRate = null;

/**
 * Fetch a live EUR → KRW rate from Frankfurter API.
 * Falls back to a reasonable default if the call fails.
 */
async function fetchEurKrwRate() {
  if (_cachedRate) return _cachedRate;
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=KRW', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    _cachedRate = body.rates.KRW;
    console.log(`💱 Live EUR/KRW rate: ${_cachedRate}`);
    return _cachedRate;
  } catch (err) {
    const fallback = 1750;
    console.warn(`⚠️ Failed to fetch EUR/KRW rate (${err.message}), using fallback ${fallback}`);
    _cachedRate = fallback;
    return fallback;
  }
}

/**
 * Convert Encar KRW price (in 10 000× units) → EUR listing price
 * using the tiered pricing engine with zero-loss guarantee.
 *
 * @param {number} priceInTenThousandKrw  Encar price (e.g. 3490 = 34,900,000 KRW)
 * @param {number} eurKrwRate             Live rate
 * @param {string} [brand]                Vehicle brand for competitive adjustment
 * @returns {{ price: number, pricingData: object }}
 */
function convertPrice(priceInTenThousandKrw, eurKrwRate, brand) {
  const krwPrice = priceInTenThousandKrw * 10000;
  const result = pricingService.calculatePrice(krwPrice, eurKrwRate, {
    brand,
    _debug: true,
  });
  return {
    price: result.listingPrice,
    pricingData: result,
  };
}

// Sync latest listings from Encar
async function syncEncarListings(limit = 30, isDomestic = true, sortBy = "ModifiedDate", pages = 1) {
  console.log(`🚀 Starting Encar Sync (Domestic: ${isDomestic}, Limit: ${limit}, Sort: ${sortBy}, Pages: ${pages})`);
  const logs = [];
  let importedCount = 0;
  let skippedCount = 0;

  try {
    // Fetch live EUR/KRW rate once for the entire sync run
    const eurKrwRate = await fetchEurKrwRate();

    // 1. Fetch latest listings from Encar — both domestic AND foreign pools
    // Domestic (CarType.Y) = Korean brands (Hyundai, Kia, Genesis, etc.)
    // Foreign (CarType.N) = Imported brands (BMW, Mercedes, Audi, Porsche, etc.)
    const fetchPool = async (carType) => {
      const allPageResults = [];
      for (let page = 0; page < pages; page++) {
        const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.${carType}.)&sr=%7C${sortBy}%7C${page * limit}%7C${limit}`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Referer": "https://www.encar.com/",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ko-KR,ko;q=0.9"
          }
        });
        if (!res.ok) throw new Error(`Encar ${carType} page ${page + 1} failed with status ${res.status}`);
        const data = await res.json();
        const results = data.SearchResults || [];
        allPageResults.push(...results);
        console.log(`  ${carType} page ${page + 1}/${pages}: ${results.length} cars`);
        if (results.length < limit) break; // No more results
      }
      return allPageResults;
    };
    const pools = isDomestic
      ? ["CarType.Y", "CarType.N"]
      : ["CarType.N", "CarType.Y"];

    const [firstResults, secondResults] = await Promise.allSettled(
      pools.map(p => fetchPool(p))
    );

    const first = firstResults.status === "fulfilled" ? firstResults.value : [];
    const second = secondResults.status === "fulfilled" ? secondResults.value : [];

    const [domesticResults, foreignResults] = isDomestic
      ? [first, second]
      : [second, first];

    // Merge and deduplicate by car Id (prefer domestic first)
    const seenIds = new Set();
    const allSearchResults = [];
    for (const car of [...domesticResults, ...foreignResults]) {
      if (!seenIds.has(car.Id)) {
        seenIds.add(car.Id);
        allSearchResults.push(car);
      }
    }

    console.log(`Found ${domesticResults.length} domestic + ${foreignResults.length} foreign = ${allSearchResults.length} unique listings`);

    // 2. Process each listing
    for (const car of allSearchResults) {
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

      // Fetch detail page data with PHOTOS and OPTIONS include
      const detailUrl = `https://api.encar.com/v1/readside/vehicle/${car.Id}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT,PHOTOS,OPTIONS`;
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
      const options = detailData.options || null;
      
      const priceKrw = ad.price || car.Price || 0;
      if (!priceKrw || priceKrw <= 0) {
        console.log(`[Encar ID ${car.Id}] Skipping — no valid price`);
        skippedCount++;
        continue;
      }
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
      const manufacturerName = translateWithMap(BRAND_MAP, car.Manufacturer, true) || car.Manufacturer;
      const year = spec.year || parseInt(car.FormYear) || 0;
      // Skip cars older than 2016
      if (year > 0 && year < 2016) {
        console.log(`[Encar ID ${car.Id}] Skipping car from ${year} (before 2016)`);
        skippedCount++;
        continue;
      }

      const hasKorean = /[\uAC00-\uD7AF]/.test(car.Model);
      let modelName = car.Model;
      if (hasKorean) {
        modelName = translateWithMap(MODEL_NAME_MAP, modelName);
        modelName = translateWithMap(GENERAL_KOREAN_WORDS, modelName);
        modelName = modelName.replace(/^[\s]*더\s*뉴\s*/i, "").replace(/^[\s]*올\s*뉴\s*/i, "").replace(/^[\s]*뉴\s*/i, "New ").trim();
        // Strip any remaining standalone Korean characters
        modelName = modelName.replace(/[\uAC00-\uD7AF]+\s*/g, "").trim();
      }
      let name = `${manufacturerName} ${modelName}`;
      let brand = manufacturerName;
      brand = BRAND_NORMALIZE[brand] || brand;
      const isPremium = PREMIUM_BRANDS.includes(brand);
      let category = isDomestic && !isPremium ? "SUV" : "Sedan";
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
        brand = BRAND_NORMALIZE[brand] || brand;
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

      // Price conversion — after brand is finalized
      const { price: priceEur, pricingData: priceBreakdown } = convertPrice(priceKrw, eurKrwRate, brand);

      // Normalize fuel type variants that Gemini sometimes returns in English
      const FUEL_NORMALIZE = {
        diesel: "Dizell", dizell: "Dizell",
        benzin: "Benzin", benzine: "Benzin", gasoline: "Benzin",
        hibrid: "Hibrid", hybrid: "Hibrid",
        elektrik: "Elektrik", electric: "Elektrik",
        lpg: "LPG", gas: "LPG",
      };
      fuelType = FUEL_NORMALIZE[fuelType.toLowerCase()] || fuelType;

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
        encarPriceKrw: priceKrw * 10000, // full KRW price
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
        pricingData: priceBreakdown,
        status: "active", // Published immediately
        showcaseImage: 0,
        isFeatured: 0,
        isShowcase: 0,
        isSold: 0,
        images: imageList,
        features: features,
        options: options
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
