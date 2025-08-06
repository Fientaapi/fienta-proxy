document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-list");
  container.innerHTML = "<p>Načítání akcí...</p>";

  fetch("https://fienta-proxy-fientaapis-projects.vercel.app/api")
    .then((res) => {
      if (!res.ok) throw new Error("Chyba sítě");
      return res.json();
    })
    .then((data) => {
      if (!data || !data.events || data.events.length === 0) {
        container.innerHTML = "<p>Žádné akce nebyly nalezeny.</p>";
        return;
      }

      container.innerHTML = "";

      data.events.forEach((event) => {
  const eventDate = new Date(event.starts_at);
  const formattedDate = eventDate.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const card = document.createElement("div");
  card.className = "event-card";

  const img = document.createElement("img");
  img.className = "event-image";
  img.src = event.image_url || "https://via.placeholder.com/280x160?text=Bez+obrázku";
  img.alt = event.title;

  const content = document.createElement("div");
  content.className = "event-content";

  const title = document.createElement("a");
  title.className = "event-title";
  title.href = event.url;
  title.target = "_blank";
  title.rel = "noopener noreferrer";
  title.textContent = event.title;

  const date = document.createElement("div");
  date.className = "event-date";
  date.textContent = formattedDate;

  const venue = document.createElement("div");
  venue.className = "event-venue";
  venue.textContent = event.venue || "";

  const description = document.createElement("div");
  description.className = "event-description";
  description.innerHTML = event.description || "";

  const linkWrap = document.createElement("div");
  linkWrap.className = "event-link";
  const link = document.createElement("a");
  link.href = event.buy_tickets_url || event.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Koupit vstupenku";

  linkWrap.appendChild(link);

  content.appendChild(title);
  content.appendChild(date);
  if (venue.textContent) content.appendChild(venue);
  if (event.description) content.appendChild(description);
  content.appendChild(linkWrap);

  card.appendChild(img);
  card.appendChild(content);

  container.appendChild(card);
});
    })
    .catch((err) => {
      container.innerHTML = `<p>Chyba při načítání akcí: ${err.message}</p>`;
      console.error(err);
    });
});
