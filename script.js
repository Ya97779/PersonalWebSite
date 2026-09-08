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

  const closeMenu = ({ restoreFocus = false } = {}) => {
    const wasOpen = nav.classList.contains("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus && wasOpen) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu({ restoreFocus: true });
    }
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

function prepareRevealItems() {
  if (document.body.dataset.page === "interests") return;

  const standaloneSelectors = [
    ".section-heading",
    ".profile-grid",
    ".robot-shot",
    ".contact-section > .eyebrow",
    ".contact-section > h2",
    ".contact-actions",
    ".contact-email",
  ];

  document.querySelectorAll(standaloneSelectors.join(",")).forEach((item) => {
    item.classList.add("reveal");
  });

  const staggeredGroups = [
    ".route-grid",
    ".projects-list",
    ".project-gallery",
    ".timeline",
    ".capability-grid",
    ".skill-matrix-grid",
    ".wiki-flow",
  ];

  staggeredGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      group.classList.remove("reveal", "is-visible");

      Array.from(group.children).forEach((item, index) => {
        item.classList.add("reveal");
        item.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 65}ms`);
      });
    });
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!revealItems.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("motion-ready");

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

function setupScrollProgress() {
  if (document.body.dataset.page === "interests") return;

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.append(progressBar);

  let animationFrame = 0;

  const updateProgress = () => {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    animationFrame = 0;
  };

  const requestUpdate = () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
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
prepareRevealItems();
setupRevealAnimations();
setupScrollProgress();
setupHeroAtmosphere();
