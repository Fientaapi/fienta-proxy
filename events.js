document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-list");
  container.innerHTML = "<p>Načítání akcí...</p>";

  // --- Определяем язык из URL ---
  let pathLang = window.location.pathname.split("/")[1].toLowerCase();
  if (pathLang === "") pathLang = "cs"; // дефолтный язык (чешский)

  // Нормализация для Fienta
  let apiLang = pathLang;
  if (pathLang === "ua") apiLang = "uk"; // Fienta ждёт "uk" вместо "ua"

  const supportedLangs = ["cs", "en", "ru", "ua"];
  let userLang = supportedLangs.includes(pathLang) ? pathLang : "cs";

  // --- Словарь UI текста ---
  const uiText = {
    cs: {
      loading: "Načítání akcí...",
      noEvents: "Žádné akce nebyly nalezeny.",
      showMore: "Zobrazit více",
      hide: "Skrýt",
      buyTicket: "Koupit vstupenku",
    },
    en: {
      loading: "Loading events...",
      noEvents: "No events found.",
      showMore: "Show more",
      hide: "Hide",
      buyTicket: "Buy ticket",
    },
    ru: {
      loading: "Загрузка мероприятий...",
      noEvents: "Мероприятия не найдены.",
      showMore: "Показать больше",
      hide: "Скрыть",
      buyTicket: "Купить билет",
    },
    ua: {
      loading: "Завантаження подій...",
      noEvents: "Події не знайдено.",
      showMore: "Показати більше",
      hide: "Сховати",
      buyTicket: "Купити квиток",
    },
  };

  container.innerHTML = `<p>${uiText[userLang].loading}</p>`;

  // --- Запрос с языком ---
  fetch(`https://fienta-proxy-fientaapis-projects.vercel.app/api?locale=${apiLang}`)
    .then((res) => {
      if (!res.ok) throw new Error("Chyba sítě");
      return res.json();
    })
    .then((data) => {
      const events = data.events;
      if (!events || events.length === 0) {
        container.innerHTML = `<p>${uiText[userLang].noEvents}</p>`;
        return;
      }

      container.innerHTML = ""; // очистить "loading"

      events.forEach((event) => {
        const eventDate = new Date(event.starts_at);
        const formattedDate = eventDate.toLocaleString(userLang, {
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
        descriptionToggle.textContent = uiText[userLang].showMore;
        descriptionToggle.addEventListener("click", () => {
          const isVisible = description.style.display === "block";
          description.style.display = isVisible ? "none" : "block";
          descriptionToggle.textContent = isVisible
            ? uiText[userLang].showMore
            : uiText[userLang].hide;
        });

        const ticketButton = document.createElement("a");
        ticketButton.className = "event-buy-button";
        ticketButton.href = event.url;
        ticketButton.target = "_blank";
        ticketButton.rel = "noopener noreferrer";
        ticketButton.setAttribute("data-fienta-popup", event.url);
        ticketButton.textContent = uiText[userLang].buyTicket;

        buttonsWrapper.appendChild(descriptionToggle);
        buttonsWrapper.appendChild(ticketButton);

        content.appendChild(title);
        content.appendChild(date);
        content.appendChild(venue);
        if (event.description) content.appendChild(descriptionWrapper);
        content.appendChild(buttonsWrapper);

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
