window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("visible", "scrolled");
    } else {
      navbar.classList.remove("visible", "scrolled");
    }
  });

