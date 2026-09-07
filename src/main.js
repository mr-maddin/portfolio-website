document.documentElement.classList.add("js");

// Mobiles Menü nach Klick auf einen Nav-Link schließen
const navToggle = document.getElementById("nav-toggle");
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.checked = false;
  });
});

// Scroll-Reveal-Animationen für About-Section und Projekt-Cards
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const animatedElements = document.querySelectorAll("[data-animate]");

if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
  animatedElements.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  animatedElements.forEach((el) => revealObserver.observe(el));
}
