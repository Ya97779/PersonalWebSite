const main = document.querySelector("main");
const journeySection = document.querySelector("#journey");
const projectsSection = document.querySelector("#projects");
const educationGroup = journeySection?.querySelector(".education-group");
const internshipGroup = journeySection?.querySelector(".journey-group:not(.education-group)");

if (main && journeySection && projectsSection) {
  main.insertBefore(journeySection, projectsSection);
}

if (journeySection && educationGroup && internshipGroup) {
  journeySection.insertBefore(educationGroup, internshipGroup);
}

const initialAnchor = window.location.hash.slice(1);
const initialTarget = initialAnchor ? document.getElementById(initialAnchor) : null;

if (initialTarget) {
  requestAnimationFrame(() => initialTarget.scrollIntoView());
}

const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
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

const hero = document.querySelector(".hero");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (hero && finePointer && !reducedMotion) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--glow-x", `${x}%`);
    hero.style.setProperty("--glow-y", `${y}%`);
  });
}
