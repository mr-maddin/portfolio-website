const border = document.querySelector(".white-img");
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function updateBorder(e) {
  if (e.matches) {
    border.style.border = "1px solid rgba(0, 0, 0, 0.1)";
  }
}

updateBorder(darkModeQuery);
darkModeQuery.addEventListener("change", updateBorder);
