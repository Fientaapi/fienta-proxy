export default async function handler(req, res) {
  const apiKey = process.env.6b9c99327de86e3a69ca478ed818c3f0;

  const response = await fetch("https://fienta.com/api/events", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
