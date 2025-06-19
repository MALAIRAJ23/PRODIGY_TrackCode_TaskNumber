// Toggle menu with ARIA
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");

// Hide navbar on page load
window.addEventListener("DOMContentLoaded", function () {
  navbar.classList.remove("visible");
});

menuToggle.addEventListener("click", function () {
  const expanded = navMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", expanded);
});

// Navbar scroll show and highlight
window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    navbar.classList.add("visible");
  } else {
    navbar.classList.remove("visible");
  }

  // Highlight menu based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  let found = false;
  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 150;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (!found && top >= offset && top < offset + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
      found = true;
    }
  });
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', false);
    }
  });
});
