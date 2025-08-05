document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-list");
  container.innerHTML = "<p>Načítání akcí...</p>";

  fetch("https://fienta-proxy-fientaapis-projects.vercel.app/api")
    .then((res) => {
      if (!res.ok) throw new Error("Chyba sítě");
      return res.json();
    })
    .then((data) => {
      if (!data || !data.data || data.data.length === 0) {
        container.innerHTML = "<p>Žádné akce nebyly nalezeny.</p>";
        return;
      }

      container.innerHTML = ""; // vyčistit zprávu o načítání

      data.data.forEach((event) => {
        const eventDate = new Date(event.start_date);
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

        const linkWrap = document.createElement("div");
        linkWrap.className = "event-link";
        const link = document.createElement("a");
        link.href = event.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Koupit vstupenku";

        linkWrap.appendChild(link);

        content.appendChild(title);
        content.appendChild(date);
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

