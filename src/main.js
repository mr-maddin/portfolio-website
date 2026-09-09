/* ==========================================================================
   Portfolio Martin Weißkircher – Verhalten
   Vanilla JS, keine Abhängigkeiten. Alle Module prüfen, ob ihre Elemente
   vorhanden sind, damit dieselbe Datei auch auf Unterseiten läuft.
   ========================================================================== */

// Schriften werden lokal gebündelt (keine Anfragen an Google Fonts).
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/main.css";

/** Fallback-Adresse für das Kontaktformular, wenn kein Endpoint konfiguriert ist. */
const CONTACT_EMAIL = "martin.weisskircher@gmail.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.replace("no-js", "js");

initHeader();
initNav();
initScrollSpy();
initReveal();
initContactForm();
initFooterYear();

/* Header: Haarlinie erst nach dem ersten Scrollen einblenden ------------- */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Mobile Navigation ------------------------------------------------------ */
function initNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!header || !toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });

  // Beim Wechsel auf Desktop-Breite offenes Menü zurücksetzen
  window.matchMedia("(min-width: 48rem)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* Scrollspy: aktiven Navigationspunkt markieren -------------------------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll("[data-nav-link]")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const targets = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const hero = document.querySelector("[data-spy-reset]");
  if (hero) targets.unshift(hero);

  const setActive = (id) => {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75] }
  );

  targets.forEach((target) => observer.observe(target));
}

/* Scroll-Reveal für Projekte und Kontakt --------------------------------- */
function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* Kontaktformular -------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[data-submit]");
  const fields = [...form.querySelectorAll("input[required], textarea[required], select[required]")];

  // Endpoint kommt aus dem action-Attribut. Solange dort der Platzhalter
  // steht, wird stattdessen das E-Mail-Programm mit der Nachricht geöffnet.
  const endpoint = (form.getAttribute("action") || "").trim();
  const endpointReady = /^https?:\/\//.test(endpoint) && !endpoint.includes("DEINE_FORM_ID");

  // Eigene Validierung statt Browser-Blasen; ohne JS greift die native Prüfung.
  form.noValidate = true;

  const showStatus = (text, kind = "") => {
    status.textContent = text;
    status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  };

  const validateField = (field) => {
    const wrap = field.closest(".field");
    const error = wrap?.querySelector(".field-error");
    let message = "";

    if (field.validity.valueMissing) {
      message = "Bitte ausfüllen.";
    } else if (field.type === "email" && field.validity.typeMismatch) {
      message = "Bitte eine gültige E-Mail-Adresse angeben.";
    }

    field.setAttribute("aria-invalid", message ? "true" : "false");
    wrap?.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message;
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
      showStatus("Bitte prüfen Sie die markierten Felder.", "error");
      return;
    }

    const data = new FormData(form);

    // Honeypot ausgefüllt: still so tun, als wäre alles gut.
    if (data.get("_gotcha")) {
      form.reset();
      showStatus("Danke, Ihre Nachricht ist angekommen.", "ok");
      return;
    }

    if (!endpointReady) {
      openMailFallback(data);
      showStatus(
        `Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Nachricht. Falls nicht, schreiben Sie bitte direkt an ${CONTACT_EMAIL}.`,
        "ok"
      );
      return;
    }

    submit.disabled = true;
    form.classList.add("is-busy");
    form.setAttribute("aria-busy", "true");
    showStatus("Wird gesendet …");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      showStatus("Danke, Ihre Nachricht ist angekommen. Ich melde mich persönlich zurück.", "ok");
    } catch {
      showStatus(
        `Senden hat nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie direkt an ${CONTACT_EMAIL}.`,
        "error"
      );
    } finally {
      submit.disabled = false;
      form.classList.remove("is-busy");
      form.removeAttribute("aria-busy");
    }
  });

  function openMailFallback(data) {
    const subject = `Projektanfrage: ${data.get("topic") || "Allgemein"}`;
    const body = [`Name: ${data.get("name")}`, `E-Mail: ${data.get("email")}`, "", data.get("message")].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

/* Jahr im Footer --------------------------------------------------------- */
function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
