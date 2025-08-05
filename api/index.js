export default async function handler(req, res) {
  const organizerId = process.env.FIENTA_ORGANIZER_ID;

  const resp = await fetch(`https://fienta.com/api/v1/public/events?organizer=32694`);
  if (!resp.ok) {
    const error = await resp.json();
    return res.status(resp.status).json({ error });
  }
  const data = await resp.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
