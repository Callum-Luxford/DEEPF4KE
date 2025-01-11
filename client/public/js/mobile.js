// MOBILE NAV
const menu = document.querySelector(".menu-button");
const nav_links = document.querySelector(".nav-links");

menu.addEventListener("click", () => {
  menu.classList.toggle("open");
  nav_links.classList.toggle("open");
});

document.querySelectorAll(".nav-links").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    nav_links.classList.remove("open");
  })
);
// MOBILE NAV
