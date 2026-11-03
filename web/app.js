(() => {
  document.documentElement.classList.add("js");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const form = document.getElementById("contact-form");
  const fallback = document.getElementById("contact-fallback");
  const endpoint = window.QADAM_CONFIG?.contactEndpoint;
  if (!form || !fallback || !endpoint) return;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return;
  } catch {
    return;
  }
  form.hidden = false;
  fallback.hidden = true;
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = "";
    status.className = "form-status";
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.textContent = "Sending…";
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
          message: data.message,
          website: data.website || ""
        }),
        cache: "no-store"
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Your message could not be sent. Please try again or email us directly.");
      }
      form.reset();
      status.textContent = "Thank you. Your message was sent.";
      status.classList.add("success");
    } catch (error) {
      status.textContent = error.message || "Your message could not be sent. Please email us directly.";
      status.classList.add("error");
    } finally {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  });
})();
