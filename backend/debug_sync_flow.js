require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });

const detailHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer": "https://fem.encar.com/",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9"
};

// Simulate the exact same flow as encarService.js for car.Id = 41904735
async function debugSync() {
  const carId = "41904735"; // car.Id from search results

  // Step 1: detail call (same as encarService.js)
  const detailUrl = `https://api.encar.com/v1/readside/vehicle/${carId}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT,PHOTOS`;
  const detailRes = await fetch(detailUrl, { headers: detailHeaders });
  const detailData = await detailRes.json();

  console.log("detailData.vehicleId:", detailData.vehicleId);
  console.log("typeof detailData.vehicleId:", typeof detailData.vehicleId);

  const vehicleId = detailData.vehicleId || carId;
  console.log("vehicleId used for inspection:", vehicleId);

  // Step 2: inspection call (same as encarService.js)
  const inspUrl = `https://api.encar.com/v1/readside/inspection/vehicle/${vehicleId}`;
  console.log("Fetching:", inspUrl);
  const inspRes = await fetch(inspUrl, { headers: detailHeaders });
  console.log("Inspection status:", inspRes.status);

  if (inspRes.ok) {
    const inspData = await inspRes.json();
    console.log("inspData.outers.length:", inspData.outers?.length);
    console.log("inspData !== null:", inspData !== null);
    console.log("inspData truthy:", !!inspData);
    console.log("JSON.stringify(inspData) starts:", JSON.stringify(inspData).slice(0, 50));
  } else {
    const txt = await inspRes.text();
    console.log("Inspection error body:", txt.slice(0, 200));
  }
}

debugSync().catch(console.error);
