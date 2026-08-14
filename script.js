const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель",
  "Май", "Июнь", "Июль", "Август",
  "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let birthdays = [];

document.addEventListener("DOMContentLoaded", async () => {
  const monthSelect = document.getElementById("month");

  MONTHS.forEach((name, i) => {
    const option = document.createElement("option");
    option.value = i + 1;
    option.textContent = name;
    monthSelect.appendChild(option);
  });

  try {
    const response = await fetch("data/birthdays.json", {
      cache: "no-store"
    });

    birthdays = await response.json();
  } catch (error) {
    console.error("Ошибка загрузки birthdays.json:", error);
    birthdays = [];
  }

  render();

  document
    .getElementById("birthday-form")
    .addEventListener("submit", addBirthday);

  document
    .getElementById("download")
    .addEventListener("click", downloadJSON);
});

function render() {
  renderMonths();
  renderSoon();
}

function renderMonths() {
  const container = document.getElementById("months");
  container.innerHTML = "";

  MONTHS.forEach((monthName, index) => {
    const monthNumber = index + 1;

    const people = birthdays
      .filter(p => Number(p.month) === monthNumber)
      .sort((a, b) => Number(a.day) - Number(b.day));

    const month = document.createElement("article");
    month.className = "month";

    const title = document.createElement("div");
    title.className = "month-title";
    title.textContent = `${monthName} · ${people.length}`;

    const list = document.createElement("ul");
    list.className = "month-list";

    if (people.length === 0) {
      const empty = document.createElement("li");
      empty.className = "month-empty";
      empty.textContent = "Пока никого нет.";
      list.appendChild(empty);
    }

    people.forEach(person => {
      const item = document.createElement("li");
      item.className = "person";

      item.innerHTML = `
        <div class="person-day">
          ${String(person.day).padStart(2, "0")}
        </div>
        <div class="person-name">
          ${escapeHTML(person.name)}
        </div>
        <div class="person-info">
          ${person.age ? `${person.age} лет` : ""}
          ${person.note ? ` · ${escapeHTML(person.note)}` : ""}
        </div>
      `;

      list.appendChild(item);
    });

    month.appendChild(title);
    month.appendChild(list);
    container.appendChild(month);
  });
}

function renderSoon() {
  const container = document.getElementById("soon-list");
  container.innerHTML = "";

  if (!birthdays.length) {
    container.textContent = "Добавь первый день рождения ниже.";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = birthdays
    .map(person => {
      let date = new Date(
        today.getFullYear(),
        Number(person.month) - 1,
        Number(person.day)
      );

      if (date < today) {
        date = new Date(
          today.getFullYear() + 1,
          Number(person.month) - 1,
          Number(person.day)
        );
      }

      return {
        person,
        date,
        days: Math.round(
          (date - today) / 86400000
        )
      };
    })
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  upcoming.forEach(item => {
    const element = document.createElement("div");
    element.className = "soon-item";

    element.innerHTML = `
      <div>
        <span class="soon-name">
          ${escapeHTML(item.person.name)}
        </span>
        <span class="soon-date">
          · ${String(item.person.day).padStart(2, "0")}.${String(item.person.month).padStart(2, "0")}
        </span>
      </div>
      <span class="soon-days">
        ${item.days === 0 ? "сегодня 🎉" : `через ${item.days} дней`}
      </span>
    `;

    container.appendChild(element);
  });
}

function addBirthday(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const day = Number(document.getElementById("day").value);
  const month = Number(document.getElementById("month").value);
  const age = document.getElementById("age").value;
  const note = document.getElementById("note").value.trim();

  if (!name || !day || !month) {
    alert("Заполни имя, день и месяц.");
    return;
  }

  birthdays.push({
    name,
    day,
    month,
    ...(age ? { age: Number(age) } : {}),
    ...(note ? { note } : {})
  });

  localStorage.setItem(
    "birthdays",
    JSON.stringify(birthdays)
  );

  render();

  event.target.reset();
}

function downloadJSON() {
  const blob = new Blob(
    [JSON.stringify(birthdays, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "birthdays.json";
  link.click();

  URL.revokeObjectURL(url);
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
