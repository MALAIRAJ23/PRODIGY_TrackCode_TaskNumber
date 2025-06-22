// Toggle menu with ARIA
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");

// Hide navbar on page load
window.addEventListener("DOMContentLoaded", function () {
  navbar.classList.remove("visible");
  navbar.classList.remove("scrolled");
});

menuToggle.addEventListener("click", function () {
  const expanded = navMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", expanded);
});

// Enhanced scroll behavior with color changes
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Show/hide navbar
  if (scrollTop > 50) {
    navbar.classList.add("visible");
  } else {
    navbar.classList.remove("visible");
  }
  
  // Add scrolled class for color changes
  if (scrollTop > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
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
  
  lastScrollTop = scrollTop;
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

// Add smooth hover effects for desktop
if (window.innerWidth > 768) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', false);
  }
});
