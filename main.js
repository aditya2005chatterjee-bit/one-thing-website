// One Thing landing page. No dependencies.

// Formspree endpoint for the iOS waitlist. Replace YOUR_FORM_ID with the ID
// from your Formspree form (formspree.io → your form → Integration).
// The form's `action` in index.html uses the same URL.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- headline reveal
   Each headline line starts partly dimmed into its section's background and
   fills in left-to-right as the section scrolls into view, line by line. The
   hero starts with its first line solid and "Every day." still sinking, and
   completes as you begin to scroll. */
const headlines = [...document.querySelectorAll("[data-reveal]")];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function progressFor(el) {
  const vh = window.innerHeight;
  if (el.dataset.reveal === "hero") {
    // 0.55 on load (line 1 solid, line 2 barely started) → 1 after ~40% of a screen.
    return 0.55 + 0.45 * clamp(window.scrollY / (vh * 0.4));
  }
  const top = el.getBoundingClientRect().top;
  // Starts when the headline enters the lower part of the screen,
  // complete once it's about a third of the way down.
  return clamp((vh * 0.92 - top) / (vh * 0.55));
}

function paint() {
  for (const el of headlines) {
    const lines = el.querySelectorAll(".line");
    const p = reduceMotion ? 1 : progressFor(el);
    lines.forEach((line, i) => {
      const lp = clamp(p * lines.length - i);
      line.style.setProperty("--p", lp.toFixed(3));
    });
  }
}

let queued = false;
function onScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    paint();
  });
}
paint();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

/* ---------------------------------------------------------------- fade-ins */
const revealables = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("in"));
}

/* ---------------------------------------------------------------- copy command */
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = document.querySelector(btn.dataset.copy)?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers: select the text so ⌘C works.
      const range = document.createRange();
      range.selectNodeContents(document.querySelector(btn.dataset.copy));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    clearTimeout(btn._reset);
    btn._reset = setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 1800);
  });
});

/* ---------------------------------------------------------------- waitlist form */
const form = document.getElementById("waitlist-form");
const status = document.getElementById("form-status");

function setStatus(text, kind = "") {
  status.textContent = text;
  status.className = `form-status mono ${kind}`;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus("Please enter a valid email address.", "err");
    form.email.focus();
    return;
  }
  if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
    setStatus("Waitlist isn't connected yet — add your Formspree form ID in main.js.", "err");
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  setStatus("Joining…");
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      form.reset();
      setStatus("You're on the list. We'll email you at launch.", "ok");
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = data.errors?.map((x) => x.message).join(", ");
      setStatus(msg || "Something went wrong. Please try again.", "err");
    }
  } catch {
    setStatus("Couldn't reach the server. Check your connection and try again.", "err");
  } finally {
    button.disabled = false;
  }
});

/* ---------------------------------------------------------------- download disclaimer
   The .dmg button opens the disclaimer instead of downloading. Only
   "I Accept, Let Me Download" starts the download; "No Thanks", Escape and
   clicking outside the card all just close it. The iOS waitlist isn't gated. */
const dmgLink = document.getElementById("dmg-link");
const modal = document.getElementById("dl-modal");

if (dmgLink && modal && typeof modal.showModal === "function") {
  const close = () => {
    if (modal.open) modal.close();
  };

  dmgLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("modal-open");
    modal.showModal();
    document.getElementById("dl-decline").focus(); // safe default for Enter
  });

  modal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    dmgLink.focus();
  });

  // Escape is handled by <dialog> itself: it closes, same as "No Thanks".

  // Click on the dimmed backdrop (the dialog element itself, outside the card).
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.getElementById("dl-decline").addEventListener("click", close);

  document.getElementById("dl-accept").addEventListener("click", () => {
    close();
    // Start the real download from the button's href.
    const a = document.createElement("a");
    a.href = dmgLink.href;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}
