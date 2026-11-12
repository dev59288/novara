
"use strict";

/* ==========================================
   NOVARA — MAIN INTERACTION ENGINE
   ========================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* MOBILE MENU */

const menuButton = $(".menu-btn");
const navLinks = $(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* TOAST NOTIFICATIONS */

function showToast(message) {
  let toast = $(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.novaraToastTimer);

  window.novaraToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* SEARCH OVERLAY */

const searchButton = $("[data-search-open]");
const searchOverlay = $(".search-overlay");
const searchInput = $(".search-box input");

function openSearch() {
  if (!searchOverlay) {
    showToast("Search is coming soon!");
    return;
  }

  searchOverlay.classList.add("active");
  searchOverlay.setAttribute("aria-hidden", "false");

  setTimeout(() => searchInput?.focus(), 100);
}

function closeSearch() {
  searchOverlay?.classList.remove("active");
  searchOverlay?.setAttribute("aria-hidden", "true");
}

searchButton?.addEventListener("click", openSearch);

searchOverlay?.addEventListener("click", (event) => {
  if (event.target === searchOverlay) closeSearch();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSearch();

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();
    openSearch();
  }
});

/* SEARCH SUBMISSION */

searchInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const query = searchInput.value.trim();

  if (!query) {
    showToast("Type something to search!");
    return;
  }

  showToast(`Searching for "${query}" — more results coming soon.`);
});

/* NAVIGATION LINKS */

$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      event.preventDefault();
      return;
    }

    const target = $(targetId);

    if (!target) {
      event.preventDefault();
      showToast("This experience is coming soon!");
    }
  });
});

/* SCROLL REVEAL */

const revealElements = $$(".world-card, .battle-card, .featured-card, .community-banner");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(element => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

/* ACTIVE NAVIGATION */

const sections = $$("section[id]");
const navigationLinks = $$(".nav-links a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  sections.forEach(section => sectionObserver.observe(section));
}

/* BATTLE INTERACTIONS */

$$(".battle-card").forEach(card => {
  const options = card.querySelectorAll(".battle-option");

  options.forEach(option => {
    option.style.cursor = "pointer";

    option.addEventListener("click", () => {
      if (card.dataset.voted === "true") {
        showToast("You've already voted in this battle!");
        return;
      }

      const choice = option.querySelector("strong")?.textContent || "your choice";

      card.dataset.voted = "true";

      options.forEach(item => {
        item.style.opacity = item === option ? "1" : ".4";
      });

      showToast(`You chose ${choice}!`);
    });
  });
});

/* WORLD CARD INTERACTIONS */

$$(".world-card").forEach(card => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;

    const link = card.querySelector("a");

    if (link?.getAttribute("href")) {
      window.location.href = link.getAttribute("href");
    }
  });
});

/* COPYRIGHT YEAR */

const copyrightYear = $("[data-year]");

if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}

/* INITIALIZATION */

document.addEventListener("DOMContentLoaded", () => {
  console.log("NOVARA initialized successfully.");
});
