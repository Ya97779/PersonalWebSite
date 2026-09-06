function setActivePage() {
  const pagePaths = {
    home: "index.html",
    education: "education.html",
    projects: "projects.html",
    internship: "internship.html",
    skills: "skills.html",
    interests: "interests.html",
  };
  const activePage = document.body.dataset.page;

  document.querySelectorAll(".nav-links a[data-page-link]").forEach((link) => {
    const isActive = pagePaths[activePage] === link.getAttribute("href");
    link.toggleAttribute("aria-current", isActive);

    if (isActive) link.setAttribute("aria-current", "page");
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupDetailsLabels() {
  document.querySelectorAll("details[data-open-label]").forEach((details) => {
    const label = details.querySelector(".details-action-label");
    const closedLabel = details.dataset.openLabel;

    if (!label || !closedLabel) return;

    const updateLabel = () => {
      label.textContent = details.open ? closedLabel.replace(/^查看/, "收起") : closedLabel;
    };

    updateLabel();
    details.addEventListener("toggle", updateLabel);
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupHeroAtmosphere() {
  const hero = document.querySelector(".hero");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (!hero || reducedMotion || !finePointer) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--glow-x", `${x}%`);
    hero.style.setProperty("--glow-y", `${y}%`);
  });
}

setActivePage();
setupMobileMenu();
setupDetailsLabels();
setupRevealAnimations();
setupHeroAtmosphere();
