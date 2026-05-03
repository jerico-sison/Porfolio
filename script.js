/**
 * Porfolio — client-side behaviour (Jerico G. Sison)
 *
 * Responsibilities:
 *  - Boot: dismiss branded loader after load; stamp current year in footer.
 *  - Navigation: toggle fullscreen mobile menu; sync aria-expanded; lock body scroll (.nav-open);
 *    close on Escape, link click, or breakpoint returning to desktop width.
 *  - Scroll UX: IntersectionObserver adds .is-in to .reveal elements once; progress bar tracks depth.
 *  - Pointer UX (optional): custom cursor when (any-pointer: fine); eased follower ring;
 *    highlight interactive targets under cursor; suspend while typing in form controls.
 *  - Contact: validate fields; build mailto URL; surface status copy for the visitor.
 *
 * Dependencies: none (vanilla DOM APIs only). Assumes matching IDs in index.html.
 */
(() => {
  const loader = document.getElementById("loader");
  const year = document.getElementById("year");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const contactForm = document.getElementById("contactForm");
  const formHint = document.getElementById("formHint");

  if (year) year.textContent = String(new Date().getFullYear());

  /* --- Loader: brief visibility then remove from DOM to avoid blocking interactions --- */
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

  /* --- Primary navigation (mobile overlay + desktop uninterrupted) --- */
  const closeNav = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    const nextOpen = !expanded;
    navToggle.setAttribute("aria-expanded", String(nextOpen));
    navLinks?.classList.toggle("is-open", nextOpen);
    document.body.classList.toggle("nav-open", nextOpen);
  });

  navLinks?.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => {
    if (e.matches) closeNav();
  });

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
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* --- Scroll progress: horizontal scale tied to scrollTop / scrollable height --- */
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const docEl = document.documentElement;
    const scrollable = docEl.scrollHeight - docEl.clientHeight;
    const pct = scrollable > 0 ? docEl.scrollTop / scrollable : 0;
    scrollProgressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /*
   * Custom cursor (desktop-style pointers only):
   * Uses matchMedia("(any-pointer: fine)") so a connected mouse still qualifies on hybrid PCs.
   * Ring position eases toward the dot via requestAnimationFrame. Hover targets resolved with
   * elementFromPoint + closest() to avoid brittle per-node listeners.
   */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  const mqAnyFinePointer = window.matchMedia("(any-pointer: fine)");
  const canUseCursor = () =>
    mqAnyFinePointer.matches && cursorDot instanceof HTMLElement && cursorRing instanceof HTMLElement;

  const hoverInterest =
    "a,button,.btn,.projectCard,.projectShowcase,.card,.experienceCard,.aboutCard,.skillCard,.timeItem,.educationPath,.chip,.nav__link,.nav__toggle,.skip-link,label,input,textarea,select,summary,[role='button'],.contactValue,.footer__top,h1,h2,h3,p,li";

  if (canUseCursor()) {
    document.body.classList.add("cursor-active");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let highlightEl = null;

    const showCursor = () => {
      cursorDot.classList.add("is-visible");
      cursorRing.classList.add("is-visible");
    };

    const setHoverUi = (active) => {
      cursorRing.classList.toggle("is-hover", active);
      cursorDot.classList.toggle("is-hover", active);
    };

    const updateHighlight = () => {
      let next = null;
      try {
        const under = document.elementFromPoint(x, y);
        next =
          under instanceof Element && typeof under.closest === "function"
            ? under.closest(hoverInterest)
            : null;
      } catch {
        next = null;
      }
      setHoverUi(Boolean(next));
      if (highlightEl && highlightEl !== next) highlightEl.classList.remove("is-highlight");
      highlightEl = next;
      highlightEl?.classList.add("is-highlight");
    };

    const tick = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);

    window.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        showCursor();
        updateHighlight();
      },
      { passive: true }
    );

    const disableCustomCursor = () => {
      document.body.classList.remove("cursor-active");
      cursorDot.classList.remove("is-visible", "is-hover");
      cursorRing.classList.remove("is-visible", "is-hover");
      highlightEl?.classList.remove("is-highlight");
      highlightEl = null;
    };

    document.addEventListener("focusin", (e) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) {
        disableCustomCursor();
      }
    });
    document.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        const a = document.activeElement;
        if (!(a instanceof HTMLInputElement || a instanceof HTMLTextAreaElement || a instanceof HTMLSelectElement)) {
          if (canUseCursor()) document.body.classList.add("cursor-active");
        }
      });
    });

    const onMqChange = () => {
      if (!canUseCursor()) disableCustomCursor();
      else document.body.classList.add("cursor-active");
    };
    mqAnyFinePointer.addEventListener("change", onMqChange);
  }

  /* --- Contact: mailto hand-off (no server endpoint in static hosting) --- */
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

    const fullSubject = `${subject} (from ${name})`;
    const body = `${message}\n\n---\nFrom: ${name}\nSent via portfolio`;
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
