(() => {
  const mobileNav = document.querySelector(".mobile-bottom-nav");

  mobileNav?.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link || !mobileNav.contains(link)) return;

    mobileNav.querySelectorAll("a").forEach((item) => item.removeAttribute("aria-current"));
    link.setAttribute("aria-current", "location");
  });

  const filters = document.querySelector("#filters");
  const filterButtons = filters?.querySelectorAll("[data-filter]") ?? [];

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  filters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button || !filters.contains(button)) return;

    const category = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = category !== "Semua" && card.dataset.category !== category;
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
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
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  const groups = [
    [".hero-kicker", ".hero h1", ".hero-bottom", ".scribble"],
    [".section-intro > *", ".project-card"],
    [".about-heading > *", ".person"],
    [".manifesto > *"],
    ["footer > *"],
  ];
  const observed = new WeakSet();

  function observeElements(elements) {
    let delayIndex = 0;

    elements.forEach((element) => {
      if (observed.has(element)) return;

      observed.add(element);
      element.classList.add("scroll-reveal");
      element.style.setProperty("--scroll-delay", `${(delayIndex % 4) * 80}ms`);
      observer.observe(element);
      delayIndex += 1;
    });
  }

  groups.forEach((selectors) => {
    observeElements(document.querySelectorAll(selectors.join(", ")));
  });

  if (document.visibilityState === "visible") {
    document.documentElement.classList.add("scroll-effects");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      document.documentElement.classList.remove("scroll-effects");
    }
  });

  const projectGrid = document.querySelector("#projectGrid");
  if (projectGrid) {
    const projectObserver = new MutationObserver((changes) => {
      changes.forEach((change) => {
        change.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          const cards = node.matches(".project-card")
            ? [node]
            : node.querySelectorAll(".project-card");
          observeElements(cards);
        });
      });
    });

    projectObserver.observe(projectGrid, { childList: true, subtree: true });
  }
})();