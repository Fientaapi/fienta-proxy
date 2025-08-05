document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("events-list");

  fetch("https://fienta-proxy-duhf7jcq9-fientaapis-projects.vercel.app/api")
    .then(res => res.json())
    .then(data => {
      if (!data.events || data.events.length === 0) {
        container.innerHTML = "<p>Нет доступных событий.</p>";
        return;
      }

      data.events.forEach(e => {
        container.innerHTML += `
          <div>
            <h3>${e.title}</h3>
            <p>${e.duration_string}</p>
            <a href="${e.buy_tickets_url}" target="_blank">Купить билет</a>
          </div>
        `;
      });
    })
    .catch(err => {
      container.innerHTML = "<p>Ошибка загрузки событий.</p>";
      console.error(err);
    });
});
