async function testFetch(id) {
  const url = `https://api.encar.com/v1/readside/vehicle/${id}?include=ADVERTISEMENT`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://fem.encar.com/",
        "Accept": "application/json",
        "Accept-Language": "ko-KR,ko;q=0.9"
      }
    });
    if (!res.ok) {
      console.log(`ID ${id} failed with status ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`ID ${id}: price=${data.advertisement?.price} 만원`);
  } catch (err) {
    console.log(`ID ${id} error:`, err.message);
  }
}

async function run() {
  await testFetch(41999824);
  await testFetch(42003880);
}

run();
