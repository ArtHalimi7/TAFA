const detailHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer": "https://fem.encar.com/",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9"
};

async function traceSync() {
  // These are the encar car.Id values (from the search results) for our imported cars
  const carIds = [
    { listingId: "41904735", encar_id: "encar_41904735" },
    { listingId: "42179408", encar_id: "encar_42179408" },
    { listingId: "42207947", encar_id: "encar_42207947" },
    { listingId: "41894506", encar_id: "encar_41894506" },
    { listingId: "41543767", encar_id: "encar_41543767" },
  ];

  for (const c of carIds) {
    const detailUrl = `https://api.encar.com/v1/readside/vehicle/${c.listingId}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT,PHOTOS`;
    const detailRes = await fetch(detailUrl, { headers: detailHeaders });
    const detailData = await detailRes.json();
    const vehicleId = detailData.vehicleId || c.listingId;
    const vehicleNo = detailData.vehicleNo;

    const inspUrl = `https://api.encar.com/v1/readside/inspection/vehicle/${vehicleId}`;
    const inspRes = await fetch(inspUrl, { headers: detailHeaders });
    const inspStatus = inspRes.status;

    let inspData = null;
    if (inspRes.ok) {
      inspData = await inspRes.json();
    } else {
      const txt = await inspRes.text();
      console.log(`   Insp error body (${c.listingId}):`, txt.slice(0, 200));
    }

    console.log(`Car ${c.encar_id}: listingId=${c.listingId}, vehicleId=${vehicleId}, vehicleNo=${vehicleNo}, inspStatus=${inspStatus}, inspDataNull=${inspData === null}`);
    if (inspData) {
      console.log(`   outers.length=${inspData.outers?.length ?? 'N/A'}, inners.length=${inspData.inners?.length ?? 'N/A'}`);
    }
  }
}

traceSync().catch(console.error);
