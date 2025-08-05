export default async function handler(req, res) {
  const apiKey = process.env.FIENTA_API_KEY;

  const response = await fetch("https://fienta.com/api/events", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
