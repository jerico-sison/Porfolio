(() => {
  const loader = document.getElementById("loader");
  const year = document.getElementById("year");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const contactForm = document.getElementById("contactForm");
  const formHint = document.getElementById("formHint");
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (year) year.textContent = String(new Date().getFullYear());

  // Loader: keep it visible for a short moment for polish
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 600);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 450);
  } else {
    window.addEventListener("load", () => window.setTimeout(hideLoader, 450), { once: true });
  }

  // Mobile nav
  const closeNav = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  };

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks?.classList.toggle("is-open", !expanded);
  });

  navLinks?.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Custom cursor + hover highlight (desktop only)
  const hasFinePointer =
    window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches;
  if (hasFinePointer && cursorDot && cursorRing) {
    document.body.classList.add("cursor-active");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;

    const showCursor = () => {
      cursorDot.classList.add("is-visible");
      cursorRing.classList.add("is-visible");
    };
    const hideCursor = () => {
      cursorDot.classList.remove("is-visible");
      cursorRing.classList.remove("is-visible");
    };

    const tick = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      showCursor();
    });
    document.addEventListener("mouseenter", showCursor);
    document.addEventListener("mouseleave", hideCursor);

    const hoverTargets = "a, button, .btn, .projectCard, .card, .chip, .nav__link, h1, h2, h3, p, li";
    const setHoverState = (active) => {
      cursorRing.classList.toggle("is-hover", active);
      cursorDot.classList.toggle("is-hover", active);
    };

    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        setHoverState(true);
        el.classList.add("is-highlight");
      });
      el.addEventListener("mouseleave", () => {
        setHoverState(false);
        el.classList.remove("is-highlight");
      });
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Simple modal system for project previews
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector("[data-close]");
    (closeBtn instanceof HTMLElement ? closeBtn : null)?.focus?.();
  };

  const closeModal = (modal) => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const t = e.target;

    if (t instanceof HTMLElement && t.matches("[data-modal]")) {
      const id = t.getAttribute("data-modal");
      if (id) openModal(id);
    }

    const modal = t instanceof HTMLElement ? t.closest(".modal") : null;
    if (modal && t instanceof HTMLElement && t.hasAttribute("data-close")) {
      closeModal(modal);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = document.querySelector(".modal:not([hidden])");
    if (open instanceof HTMLElement) closeModal(open);
  });

  // Contact form: open mailto with prefilled message
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!(contactForm instanceof HTMLFormElement)) return;

    const fd = new FormData(contactForm);
    const name = String(fd.get("name") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !subject || !message) {
      if (formHint) formHint.textContent = "Please complete all fields.";
      return;
    }

    const fullSubject = `${subject} — from ${name}`;
    const body = `${message}\n\n---\nFrom: ${name}\nSent via portfolio site`;
    const mailto = `mailto:jericosison22@gmail.com?subject=${encodeURIComponent(
      fullSubject
    )}&body=${encodeURIComponent(body)}`;

    if (formHint) formHint.textContent = "Opening your email app…";
    window.location.href = mailto;
    window.setTimeout(() => {
      if (formHint) formHint.textContent = "If nothing happened, check your default email app settings.";
    }, 1500);
  });
})();

