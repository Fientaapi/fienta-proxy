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

      container.innerHTML = ""; // Vymazat načítací zprávu

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

        // Obrázek
        const img = document.createElement("img");
        img.className = "event-image";
        img.src = event.image_url || "https://via.placeholder.com/280x160?text=Bez+obrázku";
        img.alt = event.title;

        // Obsah karty
        const content = document.createElement("div");
        content.className = "event-content";

        // Název akce
        const title = document.createElement("a");
        title.className = "event-title";
        title.href = event.url;
        title.target = "_blank";
        title.rel = "noopener noreferrer";
        title.textContent = event.title;

        // Datum a čas
        const date = document.createElement("div");
        date.className = "event-date";
        date.textContent = `Datum: ${formattedDate}`;

        // Místo konání
        const location = document.createElement("div");
        location.className = "event-location";
        location.textContent = `Místo: ${event.location || "Neuvedeno"}`;

        // Město
        const city = document.createElement("div");
        city.className = "event-city";
        if (event.city) {
          city.textContent = `Město: ${event.city}`;
        }

        // Popis
        const description = document.createElement("div");
        description.className = "event-description";
        description.textContent = event.description || "Popis není k dispozici.";

        // Cenové rozpětí
        const price = document.createElement("div");
        price.className = "event-price";
        price.textContent = event.price_range
          ? `Cena: ${event.price_range} ${event.currency || ""}`
          : "Cena není uvedena.";

        // Odkaz na zakoupení
        const linkWrap = document.createElement("div");
        linkWrap.className = "event-link";
        const link = document.createElement("a");
        link.href = event.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Koupit vstupenku";

        // Poskládání karty
        linkWrap.appendChild(link);
        content.appendChild(title);
        content.appendChild(date);
        content.appendChild(location);
        if (event.city) content.appendChild(city);
        content.appendChild(description);
        content.appendChild(price);
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
