// mock-dashboard.js – Demo-Variante von dashboard.js aus der echten Raumplaner-App.
// Die Status-Logik (Frei/Belegt, nächste Buchung) ist 1:1 übernommen; statt der
// echten Electron/Supabase-Anbindung (window.bookingsAPI) werden hier Mockdaten
// relativ zur aktuellen Uhrzeit erzeugt, damit die Demo immer plausibel aussieht.

const LIST_ROOMS = new Set(["room3", "room6"]);
const LOOKAHEAD_DAYS = 70;

const DAY_INDEX = { Sonntag: 0, Montag: 1, Dienstag: 2, Mittwoch: 3, Donnerstag: 4, Freitag: 5, Samstag: 6 };
const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function timeStr(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ---- Mockdaten relativ zu "jetzt" erzeugen ----
function buildMockBookings(now) {
  const today = WEEKDAY_NAMES[now.getDay()];
  const tomorrow = WEEKDAY_NAMES[addDays(now, 1).getDay()];

  return {
    // Turnsaal MMS: gerade belegt
    room1: [{ day: today, start: timeStr(addMinutes(now, -30)), end: timeStr(addMinutes(now, 45)), title: "Volleyball-Training" }],
    // Turnsaal VS: frei, nächste Buchung heute Abend
    room2: [{ day: today, start: timeStr(addMinutes(now, 180)), end: timeStr(addMinutes(now, 240)), title: "Turnverein Übungsstunde" }],
    // Bewegungsraum: frei, nächste Buchung morgen
    room4: [{ day: tomorrow, start: "09:00", end: "10:30", title: "Kindergarten-Turnen" }],
    // Balletraum: gerade belegt
    room5: [{ day: today, start: timeStr(addMinutes(now, -15)), end: timeStr(addMinutes(now, 60)), title: "Ballettschule Proben" }],
    // Sitzungssaal (Listen-Raum): frei, nächste Sitzung in 2 Tagen
    room3: [{ day: isoDate(addDays(now, 2)), start: "18:00", end: "20:00", title: "Gemeinderatssitzung" }],
    // Sitzungszimmer (Listen-Raum): gerade belegt
    room6: [{ day: isoDate(now), start: timeStr(addMinutes(now, -20)), end: timeStr(addMinutes(now, 40)), title: "Ausschuss-Besprechung" }],
  };
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function parseDate(dateStr) {
  return dateStr ? new Date(dateStr + "T00:00") : null;
}

function dateInRange(date, from, to) {
  const f = parseDate(from);
  const t = parseDate(to);
  if (f && date < f) return false;
  if (t && date > t) return false;
  return true;
}

function occurrenceStart(dayMidnight, time) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(dayMidnight);
  d.setHours(h, m, 0, 0);
  return d;
}

// ---- Grid-Räume (Turnsaal MMS/VS, Bewegungsraum, Balletraum) ----
function computeGridRoomStatus(bookings, now) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  const todayWeekday = WEEKDAY_NAMES[now.getDay()];

  const occupied = bookings.some((b) => {
    if (b.day !== todayWeekday) return false;
    if (!dateInRange(todayMidnight, b.dateFrom, b.dateTo)) return false;
    return toMinutes(b.start) <= nowMinutes && nowMinutes < toMinutes(b.end);
  });

  let next = null;
  bookings.forEach((b) => {
    const targetIdx = DAY_INDEX[b.day];
    if (targetIdx === undefined) return;

    for (let add = 0; add <= LOOKAHEAD_DAYS; add++) {
      const candidate = new Date(todayMidnight);
      candidate.setDate(candidate.getDate() + add);
      if (candidate.getDay() !== targetIdx) continue;
      if (add === 0 && toMinutes(b.end) <= nowMinutes) continue;
      if (!dateInRange(candidate, b.dateFrom, b.dateTo)) continue;

      const start = occurrenceStart(candidate, b.start);
      if (!next || start < next.start) next = { start, booking: b };
      break;
    }
  });

  return { occupied, next };
}

// ---- Listen-Räume (Sitzungssaal, Sitzungszimmer) ----
function computeListRoomStatus(bookings, now) {
  const occupied = bookings.some((b) => {
    const start = new Date(`${b.day}T${b.start}`);
    const end = new Date(`${b.day}T${b.end}`);
    return start <= now && now < end;
  });

  let next = null;
  bookings.forEach((b) => {
    const start = new Date(`${b.day}T${b.start}`);
    const end = new Date(`${b.day}T${b.end}`);
    if (end <= now) return;
    if (!next || start < next.start) next = { start, booking: b };
  });

  return { occupied, next };
}

// ---- Formatierung ----
function formatRelativeDay(date, now) {
  const d0 = new Date(now);
  d0.setHours(0, 0, 0, 0);
  const d1 = new Date(date);
  d1.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d1 - d0) / 86400000);
  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Morgen";
  return WEEKDAY_NAMES[d1.getDay()];
}

function formatNextBooking(next, now) {
  if (!next) return "Keine Buchung geplant";
  const day = formatRelativeDay(next.start, now);
  const time = next.start.toTimeString().slice(0, 5);
  return `${day}, ${time} Uhr – ${next.booking.title}`;
}

// ---- Rendering ----
function renderRoomCard(card, mockBookings, now) {
  const roomId = card.dataset.room;
  const dot = card.querySelector("[data-status-dot]");
  const label = card.querySelector("[data-status-label]");
  const nextEl = card.querySelector("[data-next-booking]");

  const bookings = mockBookings[roomId] || [];
  const { occupied, next } = LIST_ROOMS.has(roomId) ? computeListRoomStatus(bookings, now) : computeGridRoomStatus(bookings, now);

  dot.classList.remove("frei", "belegt");
  dot.classList.add(occupied ? "belegt" : "frei");
  label.textContent = occupied ? "Belegt" : "Frei";
  nextEl.textContent = `Nächste Buchung: ${formatNextBooking(next, now)}`;
}

const now = new Date();
const mockBookings = buildMockBookings(now);
document.querySelectorAll("[data-room]").forEach((card) => renderRoomCard(card, mockBookings, now));
