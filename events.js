document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-list");
  container.innerHTML = "<p>Načítání akcí...</p>";

  // Определяем язык пользователя
  let userLang = navigator.language.split("-")[0].toLowerCase();
  if (userLang === "uk") userLang = "ua"; // чтобы браузер uk → ua

  // Поддерживаем только выбранные языки, иначе fallback на en
  const supportedLangs = ["cs", "en", "ru", "ua"];
  if (!supportedLangs.includes(userLang)) userLang = "en";

  // Словарь переводов
  const translations = {
    cs: {
      loading: "Načítání akcí...",
      noEvents: "Žádné akce nebyly nalezeny.",
      showMore: "Zobrazit více",
      hide: "Skrýt",
      buy: "Koupit vstupenku",
      error: "Chyba při načítání akcí"
    },
    en: {
      loading: "Loading events...",
      noEvents: "No events found.",
      showMore: "Show more",
      hide: "Hide",
      buy: "Buy ticket",
      error: "Error loading events"
    },
    ru: {
      loading: "Загрузка событий...",
      noEvents: "События не найдены.",
      showMore: "Показать больше",
      hide: "Скрыть",
      buy: "Купить билет",
      error: "Ошибка при загрузке событий"
    },
    ua: {
      loading: "Завантаження подій...",
      noEvents: "Події не знайдено.",
      showMore: "Показати більше",
      hide: "Приховати",
      buy: "Купити квиток",
      error: "Помилка при завантаженні подій"
    }
  };

  container.innerHTML = `<p>${translations[userLang].loading}</p>`;

  fetch(`https://fienta-proxy-fientaapis-projects.vercel.app/api?locale=${userLang}`)
    .then((res) => {
      if (!res.ok) throw new Error(translations[userLang].error);
      return res.json();
    })
    .then((data) => {
      const events = data.events;
      if (!events || events.length === 0) {
        container.innerHTML = `<p>${translations[userLang].noEvents}</p>`;
        return;
      }

      container.innerHTML = ""; // очистить "Loading..."

      events.forEach((event) => {
        const eventDate = new Date(event.starts_at);

        // Локализация даты
        const formattedDate = eventDate.toLocaleString(userLang === "ua" ? "uk" : userLang, {
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
        descriptionToggle.textContent = translations[userLang].showMore;
        descriptionToggle.addEventListener("click", () => {
          const isVisible = description.style.display === "block";
          description.style.display = isVisible ? "none" : "block";
          descriptionToggle.textContent = isVisible
            ? translations[userLang].showMore
            : translations[userLang].hide;
        });

        const ticketButton = document.createElement("a");
        ticketButton.className = "event-buy-button";
        ticketButton.href = event.url;
        ticketButton.target = "_blank";
        ticketButton.rel = "noopener noreferrer";
        ticketButton.setAttribute("data-fienta-popup", event.url);
        ticketButton.textContent = translations[userLang].buy;

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
      container.innerHTML = `<p>${translations[userLang].error}: ${err.message}</p>`;
      console.error(err);
    });
});
