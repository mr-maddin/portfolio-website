// mock-data.js – Demo-Version von KeyMaster: statische Beispieldaten statt
// echter Supabase-Anbindung. Zeigt Übersicht + Schlüssel-Liste, Tabs werden
// clientseitig ohne Framework umgeschaltet (Vanilla JS).

const ACTIVITIES = [
  { icon: "arrow-up-right", text: "Bund „Hauptgebäude 1. OG“ an Frau Huber verliehen", time: "vor 12 Min." },
  { icon: "arrow-down-left", text: "Schlüssel „Turnsaal“ von Hr. Bauer zurückgegeben", time: "vor 47 Min." },
  { icon: "arrow-up-right", text: "Bund „Werkstatt“ an Fa. Elektro Steiner verliehen", time: "heute, 09:15" },
  { icon: "plus", text: "Neuer Schlüssel „Archiv Keller“ angelegt", time: "gestern, 16:40" },
  { icon: "arrow-down-left", text: "Schlüssel „Sitzungssaal“ von Fr. Winter zurückgegeben", time: "gestern, 14:02" },
];

const REMINDERS = [
  { label: "Reservierung", text: "Bund „Festsaal“ für Musikverein ab Fr. 18:00", pill: "yellow" },
  { label: "Überfällig", text: "Schlüssel „Lager“ seit 3 Tagen nicht zurückgegeben", pill: "red" },
  { label: "Reservierung", text: "Schlüssel „Sportplatz“ für Sa. reserviert", pill: "yellow" },
];

const KEYS = [
  { nr: "014", name: "Hauptgebäude 1. OG", ort: "Rathaus", status: "verliehen" },
  { nr: "021", name: "Turnsaal", ort: "Mittelschule", status: "verfügbar" },
  { nr: "032", name: "Werkstatt", ort: "Bauhof", status: "verliehen" },
  { nr: "045", name: "Archiv Keller", ort: "Rathaus", status: "verfügbar" },
  { nr: "051", name: "Sitzungssaal", ort: "Rathaus", status: "verfügbar" },
  { nr: "058", name: "Festsaal", ort: "Kulturhaus", status: "reserviert" },
  { nr: "063", name: "Lager", ort: "Bauhof", status: "verliehen" },
  { nr: "070", name: "Sportplatz", ort: "Sportanlage", status: "reserviert" },
];

const STATUS_PILL = {
  verfügbar: "pill pill-green",
  verliehen: "pill pill-red",
  reserviert: "pill pill-yellow",
};

function renderActivities() {
  const el = document.getElementById("activitiesList");
  el.innerHTML = ACTIVITIES.map(
    (a) => `
    <div class="flex items-center gap-3 text-[0.85rem]">
      <span class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-cyan-500 shrink-0">
        <i data-lucide="${a.icon}" width="14" height="14"></i>
      </span>
      <span class="flex-1 font-extralight">${a.text}</span>
      <span class="text-slate-500 text-[0.75rem] mono whitespace-nowrap">${a.time}</span>
    </div>`
  ).join("");
}

function renderReminders() {
  const el = document.getElementById("reminderList");
  el.innerHTML = REMINDERS.map(
    (r) => `
    <div class="flex flex-col gap-1 text-[0.85rem] border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <span class="${STATUS_PILL[r.pill === "red" ? "verliehen" : r.pill === "yellow" ? "reserviert" : "verfügbar"]} w-fit">${r.label}</span>
      <span class="font-extralight">${r.text}</span>
    </div>`
  ).join("");
}

function renderKeys() {
  const el = document.getElementById("keyList");
  el.innerHTML = KEYS.map(
    (k) => `
    <div class="grid grid-cols-[0.6fr_1.4fr_1fr_1fr] gap-2 items-center text-[0.85rem] py-2 border-b border-slate-800 last:border-0">
      <span class="mono text-slate-400">${k.nr}</span>
      <span class="font-extralight">${k.name}</span>
      <span class="text-slate-400 font-extralight">${k.ort}</span>
      <span class="${STATUS_PILL[k.status]} w-fit capitalize">${k.status}</span>
    </div>`
  ).join("");
}

function initTabs() {
  const links = document.querySelectorAll("[data-tab]");
  const titles = { uebersicht: "Übersicht", schluessel: "Schlüssel", personen: "Personen", report: "Report" };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;

      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      document.getElementById(`tab-${tab}`).classList.add("active");

      document.getElementById("pageTitle").textContent = titles[tab];
      document.getElementById("crumb").textContent = titles[tab];
    });
  });
}

renderActivities();
renderReminders();
renderKeys();
initTabs();
if (window.lucide) lucide.createIcons();
