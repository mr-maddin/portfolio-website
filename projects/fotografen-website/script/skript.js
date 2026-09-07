/*const btn = document.querySelector("#nav-btn");
const navLinks = document.querySelector(".nav-links");

btn.addEventListener("click", function (event) {
  if (!btn.classList.contains("is-active")) {
    btn.style.transform = "rotate(45deg)";
    btn.classList.add("is-active");
    navLinks.classList.add("is-active");
  } else {
    btn.style.transform = "";
    btn.classList.remove("is-active");
    navLinks.classList.remove("is-active");
  }
});
*/

const btn = document.querySelector("#nav-btn");
const navLinks = document.querySelector(".nav-links");

btn.addEventListener("click", function (event) {
  if (!btn.classList.contains("is-active")) {
    btn.style.transform = "rotate(45deg)";
    btn.classList.add("is-active");
    navLinks.classList.add("is-active");
    // Übergangsdauer für das Erscheinen der Nav-Links ändern
    navLinks.style.transitionDuration = "0.4s"; // 0.3 Sekunden für den Slide-Effekt
  } else {
    btn.style.transform = "";
    btn.classList.remove("is-active");
    // Übergangsdauer für das Verschwinden der Nav-Links ändern
    navLinks.style.transitionDuration = "0.8s"; // 0.8 Sekunden für das Verblassen
    // Verzögerung für das Verblassen hinzufügen, damit der Slide-Effekt beendet wird, bevor die Nav-Links verschwinden
    setTimeout(() => {
      navLinks.classList.remove("is-active");
    }, 300); // Verzögerung um 0.3 Sekunden, um sicherzustellen, dass der Slide-Effekt abgeschlossen ist
  }
});
