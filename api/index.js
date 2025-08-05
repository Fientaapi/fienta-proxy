export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ✅ Разрешить CORS
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch("https://fienta.com/api/v1/public/events?organizer=32694");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Ошибка прокси", detail: err.message });
  }
}
