/* Interacciones de la landing de Orah (portadas de OrahLanding.tsx). ES. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ───────── Tema (claro/oscuro) ───────── */
  (function theme() {
    const root = document.documentElement;
    try {
      const t = localStorage.getItem("orah-theme");
      if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    } catch (e) {}
    const btn = $("#mm-theme");
    if (btn) btn.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme");
      const dark = cur === "dark" || (!cur && matchMedia("(prefers-color-scheme: dark)").matches);
      const next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("orah-theme", next); } catch (e) {}
    });
  })();

  /* ───────── Carrusel del hero ───────── */
  (function hero() {
    const SLIDES = [
      { eyebrow: "Agendamiento, en movimiento",
        lines: [{ t: "Reservas" }, { t: "que se llenan", st: true }, { t: "solas,", st: true }, { t: "con ", ac: "Orah" }],
        desc: "Orah convierte tu disponibilidad en reservas confirmadas: sin llamadas, sin planillas, sin horas perdidas." },
      { eyebrow: "Tu agenda, siempre abierta",
        lines: [{ t: "Tus clientes" }, { t: "reservan", st: true }, { t: "cuando", st: true }, { t: "quieren" }],
        desc: "Una página pública para reservar a cualquier hora, desde el teléfono y en segundos." },
      { eyebrow: "Menos ausencias",
        lines: [{ t: "Menos" }, { t: "no-shows,", st: true }, { t: "más", st: true }, { t: "ocupación" }],
        desc: "Recordatorios por WhatsApp y confirmaciones automáticas que llenan tu semana." },
      { eyebrow: "Para cualquier rubro",
        lines: [{ t: "Un motor" }, { t: "de reservas", st: true }, { t: "para todo", st: true }, { t: "tu ", ac: "negocio" }],
        desc: "Clínicas, estética, hospedajes y más. Una sola plataforma, con la cara de tu marca." },
    ];
    const copy = $("#lp-copy");
    const dots = $$("#lp-dots button");
    if (!copy) return;
    let i = 0, timer = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(n) {
      const s = SLIDES[n];
      const h1 = s.lines.map((l) =>
        '<span class="l' + (l.st ? " st" : "") + '">' + l.t + (l.ac ? '<span class="ac">' + l.ac + "</span>" : "") + "</span>"
      ).join("");
      $(".lp-eyebrow", copy).textContent = s.eyebrow;
      $(".lp-h1", copy).innerHTML = h1;
      $(".lp-desc", copy).textContent = s.desc;
      dots.forEach((d, k) => d.setAttribute("aria-current", k === n ? "true" : "false"));
    }
    function go(n, animate) {
      if (n === i) return;
      if (animate && !reduce) {
        copy.classList.add("changing");
        setTimeout(() => { i = n; render(i); copy.classList.remove("changing"); }, 550);
      } else { i = n; render(i); }
    }
    function start() {
      if (timer) clearInterval(timer);
      if (reduce) return;
      timer = setInterval(() => go((i + 1) % SLIDES.length, true), 7000);
    }
    dots.forEach((d, k) => d.addEventListener("click", () => { go(k, true); start(); }));
    start();
  })();

  /* ───────── Mega-menú / buscador / drawer ───────── */
  const MENU = [
    { id: "producto", label: "Producto", pk: "Qué incluye",
      primary: [
        { t: "Agenda", href: "#producto" }, { t: "Página de reservas", href: "#producto" },
        { t: "Recordatorios por WhatsApp", href: "#producto" }, { t: "Pagos y señas", href: "#producto" },
        { t: "Equipo y multi-sucursal", href: "#producto" }, { t: "Reportes", href: "#producto" }],
      sk: "Empieza", secondary: [{ t: "Ver demo", href: "#producto", arrow: true }, { t: "Reservar una hora", href: "#producto", arrow: true }] },
    { id: "rubros", label: "Rubros", pk: "Para quién",
      primary: [{ t: "Clínicas y dental", href: "#producto" }, { t: "Estética y spa", href: "#producto" }, { t: "Hospedaje", href: "#producto" }, { t: "Barbería y peluquería", href: "#producto" }, { t: "Servicios profesionales", href: "#producto" }],
      sk: "¿No está tu rubro?", secondary: [{ t: "Hablemos", href: "#contacto", arrow: true }] },
    { id: "precios", label: "Precios", pk: "Planes",
      primary: [{ t: "Ver planes", href: "#producto" }, { t: "Comparar planes", href: "#producto" }],
      sk: "Dudas", secondary: [{ t: "Preguntas frecuentes", href: "#producto", arrow: true }] },
    { id: "recursos", label: "Recursos", pk: "Aprende",
      primary: [{ t: "Guías", href: "#recursos" }, { t: "Centro de ayuda", href: "#recursos" }, { t: "Casos de éxito", href: "#recursos" }],
      sk: "Soporte", secondary: [{ t: "Contacto", href: "#contacto", arrow: true }] },
  ];
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" class="mm-ic"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  (function mega() {
    const header = $("#mm"), mega = $("#mm-mega"), inner = $("#mm-mega-inner"), backdrop = $("#mm-backdrop");
    const btns = $$(".mm-navbtn");
    let open = null;
    function render(id) {
      const m = MENU.find((x) => x.id === id); if (!m) return;
      const prim = m.primary.map((l) => '<a href="' + l.href + '" class="mm-p-link">' + l.t + (l.arrow ? ARROW : "") + "</a>").join("");
      const sec = m.secondary.map((l) => '<a href="' + l.href + '" class="mm-s-link' + (l.arrow ? "" : " mm-s-sub") + '">' + l.t + (l.arrow ? ARROW : "") + "</a>").join("");
      inner.innerHTML =
        '<div class="mm-col-p"><div class="mm-kick">' + m.pk + '</div><div class="mm-plinks">' + prim + "</div></div>" +
        '<div class="mm-col-s"><div class="mm-kick">' + m.sk + '</div><div class="mm-slinks">' + sec + "</div></div>";
    }
    function show(id) {
      open = id; render(id);
      header.classList.add("mm-open"); mega.classList.add("show"); backdrop.hidden = false;
      btns.forEach((b) => b.classList.toggle("active", b.dataset.menu === id));
      btns.forEach((b) => b.setAttribute("aria-expanded", b.dataset.menu === id ? "true" : "false"));
    }
    function hide() {
      open = null; header.classList.remove("mm-open"); mega.classList.remove("show"); backdrop.hidden = true;
      btns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-expanded", "false"); });
    }
    btns.forEach((b) => {
      b.addEventListener("mouseenter", () => show(b.dataset.menu));
      b.addEventListener("focus", () => show(b.dataset.menu));
      b.addEventListener("click", () => (open === b.dataset.menu ? hide() : show(b.dataset.menu)));
    });
    header.addEventListener("mouseleave", hide);
    backdrop.addEventListener("click", hide);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
  })();

  (function search() {
    const open = $("#mm-search-open"), modal = $("#mm-search"), input = $("#mm-search-input"),
      close = $("#mm-search-close"), results = $("#mm-results");
    if (!open) return;
    const items = MENU.flatMap((m) => [...m.primary, ...m.secondary].map((l) => ({ l, section: m.label })));
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    function paint() {
      const q = norm(input.value.trim());
      const list = q ? items.filter((x) => norm(x.l.t).includes(q) || norm(x.section).includes(q)) : items;
      results.innerHTML = list.length
        ? list.map((x) => '<a href="' + x.l.href + '" class="mm-res"><span class="mm-res-t">' + x.l.t + '</span><span class="mm-res-sec">' + x.section + "</span></a>").join("")
        : '<div class="mm-empty">Sin resultados</div>';
    }
    function openM() { modal.hidden = false; input.value = ""; paint(); setTimeout(() => input.focus(), 30); }
    function closeM() { modal.hidden = true; }
    open.addEventListener("click", openM);
    close.addEventListener("click", closeM);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeM(); });
    input.addEventListener("input", paint);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeM(); });
  })();

  (function drawer() {
    const burger = $("#mm-burger"), drawer = $("#mm-drawer");
    if (!burger) return;
    drawer.innerHTML = MENU.map((m) =>
      '<div class="mm-dsec"><button type="button" class="mm-dbtn" data-d="' + m.id + '" aria-expanded="false">' + m.label +
      '<svg viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="mm-dlinks" hidden>' + [...m.primary, ...m.secondary].map((l) => '<a href="' + l.href + '">' + l.t + "</a>").join("") + "</div></div>"
    ).join("");
    burger.addEventListener("click", () => {
      const o = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", o ? "true" : "false");
    });
    $$(".mm-dbtn", drawer).forEach((b) => b.addEventListener("click", () => {
      const links = b.nextElementSibling, o = b.classList.toggle("open");
      b.setAttribute("aria-expanded", o ? "true" : "false");
      links.hidden = !o;
    }));
  })();

  /* ───────── Pestañas del producto ───────── */
  (function product() {
    const VIEWS = {
      agenda: { title: "Agenda", copy: "Tu semana, de un vistazo", detail: "Reservas organizadas por día y profesional.",
        body: '<div class="prd-agenda" aria-hidden="true"><div class="prd-days"><span>LU 12</span><span>MA 13</span><span>MI 14</span><span>JU 15</span></div><div class="prd-slots"><span>09:00</span><i class="a"></i><i></i><span>11:00</span><i class="b"></i><i class="c"></i><span>13:00</span><i></i><i class="a"></i></div></div>' },
      reservas: { title: "Reservas online", copy: "Una página para reservar", detail: "Tus clientes eligen un servicio y un horario disponible.",
        body: '<div class="prd-booking" aria-hidden="true"><span class="prd-booking-kicker">RESERVA TU HORA</span><strong>¿Qué necesitas hoy?</strong><div><i>◉</i><span><b>Evaluación dental</b><small>45 min · desde $25.000</small></span><em>›</em></div><div><i>◉</i><span><b>Limpieza dental</b><small>30 min · desde $18.000</small></span><em>›</em></div><button type="button" tabindex="-1">Continuar</button></div>' },
      gestion: { title: "Gestión", copy: "Servicios y equipo conectados", detail: "Consulta quién atiende y qué ofrece tu negocio.",
        body: '<div class="prd-management" aria-hidden="true"><div><span class="prd-avatar">CM</span><span><b>Dra. Camila Muñoz</b><small>Odontología general</small></span><em>Disponible</em></div><div><span class="prd-avatar alt">JP</span><span><b>Dr. Javier Pérez</b><small>Ortodoncia</small></span><em>Disponible</em></div><div class="prd-service-row"><span>Servicios activos</span><b>08</b></div></div>' },
      reportes: { title: "Reportes", copy: "Una lectura clara de la actividad", detail: "Explora indicadores de la agenda de demostración.",
        body: '<div class="prd-reports" aria-hidden="true"><div><small>Reservas esta semana</small><b>48</b><span>+12% vs. semana anterior</span></div><div class="prd-bars"><i style="height:42%"></i><i style="height:68%"></i><i style="height:54%"></i><i style="height:88%"></i><i style="height:62%"></i><i style="height:74%"></i><i style="height:35%"></i></div><div class="prd-bar-days"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div></div>' },
    };
    const tabs = $$("#prd-tabs button"), screen = $("#prd-screen"), title = $("#prd-screen-title"),
      body = $("#prd-screen-body"), ctitle = $("#prd-copy-title"), cdetail = $("#prd-copy-detail");
    if (!tabs.length) return;
    tabs.forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.view, v = VIEWS[id];
      tabs.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      screen.className = "prd-screen prd-screen-" + id;
      title.textContent = v.title; body.innerHTML = v.body;
      ctitle.textContent = v.copy; cdetail.textContent = v.detail;
    }));
  })();
})();
