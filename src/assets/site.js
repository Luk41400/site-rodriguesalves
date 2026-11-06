const header = document.querySelector("[data-header]");
const menu = header?.querySelector(".menu-toggle");
const nav = header?.querySelector(".nav");
document.documentElement.classList.add("js");

if (menu && nav) {
  const narrow = matchMedia("(max-width: 920px)");
  const items = Array.from(nav.querySelectorAll("a"), link => ({
    link,
    section: document.querySelector(link.hash),
    mobileOnly: link.classList.contains("nav-mobile"),
    top: 0
  }));
  let current = nav.querySelector(".on");

  function placePill() {
    if (narrow.matches) return;
    nav.style.setProperty("--pw", current.offsetWidth + "px");
    nav.style.setProperty("--px", current.offsetLeft + "px");
    nav.style.setProperty("--po", "1");
  }

  function setMenu(open, restoreFocus = false) {
    menu.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
    nav.inert = narrow.matches && !open;
    if (restoreFocus) menu.focus();
  }

  function updateNavigation() {
    const y = scrollY + 155;
    let active = items[0].link;
    for (const { link, top, mobileOnly } of items) {
      if (top <= y && (!mobileOnly || narrow.matches)) active = link;
    }
    if (active === current) return;
    current.classList.remove("on");
    current.removeAttribute("aria-current");
    current = active;
    current.classList.add("on");
    current.setAttribute("aria-current", "location");
    placePill();
  }

  function measureNavigation() {
    const y = scrollY;
    for (const item of items) item.top = item.section.getBoundingClientRect().top + y;
    updateNavigation();
    placePill();
  }

  menu.hidden = false;
  setMenu(false);
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  for (const { link, section } of items) {
    link.addEventListener("click", () => {
      if (!narrow.matches) return;
      setMenu(false);
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    });
  }
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) setMenu(false, true);
  });
  header.addEventListener("focusout", event => {
    if (header.classList.contains("menu-open") && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  document.addEventListener("click", event => {
    if (header.classList.contains("menu-open") && !header.contains(event.target)) setMenu(false);
  });
  narrow.addEventListener("change", () => {
    setMenu(false);
    measureNavigation();
  });
  window.addEventListener("resize", measureNavigation);
  document.fonts?.ready.then(measureNavigation);
  if ("ResizeObserver" in window) new ResizeObserver(measureNavigation).observe(document.querySelector("main"));

  let frame = 0;
  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      header.classList.toggle("scrolled", scrollY > 20);
      updateNavigation();
    });
  }, { passive: true });
  header.classList.toggle("scrolled", scrollY > 20);
  measureNavigation();
}

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("pending");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.05 });

  for (const element of document.querySelectorAll("[data-reveal]")) {
    if (element.getBoundingClientRect().top < innerHeight) continue;
    element.classList.add("pending");
    observer.observe(element);
  }
}

const mapButton = document.querySelector("[data-map-toggle]");
if (mapButton) {
  const frame = document.querySelector("[data-map]");
  mapButton.hidden = false;
  mapButton.addEventListener("click", () => {
    frame.src = frame.dataset.src;
    frame.hidden = false;
    mapButton.closest(".map-cover").hidden = true;
    frame.focus();
  });
}

const form = document.querySelector("[data-draft]");
if (form) {
  const fieldset = form.querySelector("fieldset");
  const button = form.querySelector("button[type=submit]");
  const buttonLabel = form.querySelector("[data-submit-label]");
  const status = form.querySelector("[role=status]");
  const fallback = form.querySelector(".manual-copy");
  const fallbackText = fallback.querySelector("textarea");
  const next = form.querySelector(".draft-next");
  const requiredText = fieldset.querySelectorAll('input[type="text"][required], textarea[required]');

  function clearResult() {
    status.textContent = "";
    delete status.dataset.state;
    fallback.hidden = true;
    fallbackText.value = "";
    next.hidden = true;
  }

  fieldset.addEventListener("input", event => {
    event.target.setCustomValidity("");
    clearResult();
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    clearResult();
    for (const field of requiredText) {
      field.setCustomValidity(field.value.trim() ? "" : "Preencha este campo com texto.");
    }
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = data.get("nome").trim();
    const email = data.get("email").trim();
    const phone = data.get("telefone").trim();
    const subject = data.get("assunto").trim();
    const message = data.get("mensagem").trim();
    const draft = [
      "Olá, gostaria de entrar em contato com o escritório.",
      "",
      "Nome: " + name,
      "E-mail: " + email,
      ...(phone ? ["Telefone: " + phone] : []),
      "Assunto: " + subject,
      "",
      message,
      "",
      "Autorizo o uso destes dados para responder ao meu contato."
    ].join("\n");

    fieldset.disabled = true;
    button.setAttribute("aria-busy", "true");
    buttonLabel.textContent = "Copiando…";
    status.textContent = "Preparando o rascunho…";

    try {
      await navigator.clipboard.writeText(draft);
      status.dataset.state = "success";
      status.textContent = "Rascunho copiado. Abra o Instagram para colar e enviar a mensagem.";
    } catch {
      status.dataset.state = "error";
      status.textContent = "A cópia automática está indisponível. Copie o rascunho abaixo.";
      fallbackText.value = draft;
      fallback.hidden = false;
      fallbackText.focus();
      fallbackText.select();
    } finally {
      fieldset.disabled = false;
      button.removeAttribute("aria-busy");
      buttonLabel.textContent = "Copiar mensagem";
      next.hidden = false;
      if (fallback.hidden && document.activeElement === document.body) next.focus();
    }
  });
  fieldset.disabled = false;
}

const year = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date());
for (const element of document.querySelectorAll("[data-year]")) element.textContent = year;
