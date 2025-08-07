document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-list");
  container.innerHTML = "<p>Načítání akcí...</p>";

  fetch("https://fienta-proxy-fientaapis-projects.vercel.app/api")
    .then((res) => {
      if (!res.ok) throw new Error("Chyba sítě");
      return res.json();
    })
    .then((data) => {
      const events = data.events;
      if (!events || events.length === 0) {
        container.innerHTML = "<p>Žádné akce nebyly nalezeny.</p>";
        return;
      }

      container.innerHTML = ""; // Vymazat načítací hlášku

      events.forEach((event) => {
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
        venue.textContent = event.venue;

        const descriptionWrapper = document.createElement("div");
        descriptionWrapper.className = "event-description-wrapper";

        const description = document.createElement("div");
        description.className = "event-description";
        description.innerHTML = event.description || "";
        description.style.display = "none";
        descriptionWrapper.appendChild(description);

        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.className = "event-buttons";

        const descriptionToggle = document.createElement("button");
        descriptionToggle.className = "event-description-toggle";
        descriptionToggle.textContent = "Zobrazit více";
        descriptionToggle.addEventListener("click", () => {
          const isVisible = description.style.display === "block";
          description.style.display = isVisible ? "none" : "block";
          descriptionToggle.textContent = isVisible ? "Zobrazit více" : "Skrýt";
        });

        const ticketButton = document.createElement("a");
        ticketButton.className = "event-buy-button";
        ticketButton.href = event.url;
        ticketButton.target = "_blank";
        ticketButton.rel = "noopener noreferrer";
        ticketButton.setAttribute("data-fienta-popup", event.url);
        ticketButton.textContent = "Koupit vstupenku";

        buttonsWrapper.appendChild(descriptionToggle);
        buttonsWrapper.appendChild(ticketButton);

        content.appendChild(title);
        content.appendChild(date);
        content.appendChild(venue);
        if (event.description) content.appendChild(descriptionWrapper);
        content.appendChild(buttonsWrapper);

        // Финальный card
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
