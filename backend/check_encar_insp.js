const detailHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer": "https://fem.encar.com/",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9"
};

async function check() {
  const carId = "41904735";
  const detailUrl = `https://api.encar.com/v1/readside/vehicle/${carId}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT,PHOTOS`;
  try {
    const detailRes = await fetch(detailUrl, { headers: detailHeaders });
    const detailData = await detailRes.json();
    console.log("Detail status:", detailRes.status);
    console.log("Detail vehicleId:", detailData.vehicleId);
    console.log("Detail vehicleNo:", detailData.vehicleNo);
    console.log("Detail keys:", Object.keys(detailData));
    if (detailData.vehicleId) {
      const inspUrl = `https://api.encar.com/v1/readside/inspection/vehicle/${detailData.vehicleId}`;
      const inspRes = await fetch(inspUrl, { headers: detailHeaders });
      console.log("Inspection status:", inspRes.status);
      if (inspRes.ok) {
        const data = await inspRes.json();
        console.log("Inspection keys:", Object.keys(data));
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

check();
