JavaScript

"use strict";

/* ==========================================
   NOVARA — ANIMATION ENGINE
   ========================================== */

window.NOVARA_ANIMATIONS = {

  init() {
    this.initReveal();
    this.initMouseEffects();
    this.initCounters();
    this.initSmoothScroll();
    this.initHeroParallax();

    console.log("NOVARA animations initialized.");
  },

  /* SCROLL REVEAL */

  initReveal() {
    const elements = document.querySelectorAll(
      ".world-card, .battle-card, .featured-card, .community-banner"
    );

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    elements.forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  },

  /* CARD MOUSE EFFECT */

  initMouseEffects() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll(".world-card, .battle-card").forEach(card => {

      card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        card.style.setProperty("--mouse-x", `${x * 100}%`);
        card.style.setProperty("--mouse-y", `${y * 100}%`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--mouse-x");
        card.style.removeProperty("--mouse-y");
      });

    });
  },

  /* COUNTER ANIMATION */

  initCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.counter);

        if (!Number.isFinite(target)) return;

        const duration = 1200;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          element.textContent = Math.round(target * eased).toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(element);
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
  },

  /* SMOOTH SCROLL */

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const id = link.getAttribute("href");
        const target = id && id.length > 1
          ? document.querySelector(id)
          : null;

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  },

  /* HERO PARALLAX */

  initHeroParallax() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const hero = document.querySelector(".hero-art");

    if (!hero) return;

    hero.addEventListener("mousemove", event => {
      const rect = hero.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      hero.style.transform =
        `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });

    hero.addEventListener("mouseleave", () => {
      hero.style.transform = "";
    });
  }

};

document.addEventListener("DOMContentLoaded", () => {
  window.NOVARA_ANIMATIONS.init();
});
  
