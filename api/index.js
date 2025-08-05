export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Для preflight-запросов
  }

  try {
    const response = await fetch('https://fienta.com/api/v1/public/events?organizer=32694');
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'API fetch error', details: error.message });
  }
}
