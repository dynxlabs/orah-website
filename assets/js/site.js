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
    { id: "producto", label: "Producto", pk: "La plataforma",
      primary: [
        { t: "Reserva multicanal con Aria", href: "/producto/#aria" },
        { t: "Qué incluye hoy", href: "/producto/#capacidades" },
        { t: "Próximamente", href: "/producto/#roadmap" }],
      sk: "Empieza", secondary: [{ t: "Ver la demo", href: "/#producto", arrow: true }] },
    { id: "rubros", label: "Rubros", pk: "Para quién",
      primary: [{ t: "Clínicas y dental", href: "/#producto" }, { t: "Estética y spa", href: "/#producto" }, { t: "Hospedaje", href: "/#producto" }, { t: "Barbería y peluquería", href: "/#producto" }, { t: "Servicios profesionales", href: "/#producto" }],
      sk: "¿No está tu rubro?", secondary: [{ t: "Hablemos", href: "/#contacto", arrow: true }] },
    { id: "precios", label: "Precios", pk: "Planes",
      primary: [{ t: "Ver planes", href: "/#producto" }, { t: "Comparar planes", href: "/#producto" }],
      sk: "Dudas", secondary: [{ t: "Preguntas frecuentes", href: "/#producto", arrow: true }] },
    { id: "recursos", label: "Recursos", pk: "Aprende",
      primary: [{ t: "Guías", href: "/#recursos" }, { t: "Centro de ayuda", href: "/#recursos" }, { t: "Casos de éxito", href: "/#recursos" }],
      sk: "Soporte", secondary: [{ t: "Contacto", href: "/#contacto", arrow: true }] },
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
        body: '<div class="prd-ag" aria-hidden="true"><aside class="prd-ag-side"><div class="prd-ag-month">Noviembre<small>2026</small></div><div class="prd-ag-grp"><h5>Servicios<span>Esta semana</span></h5><div class="prd-ag-row"><i class="sq c-con"></i>Consulta general<b>6</b></div><div class="prd-ag-row"><i class="sq c-lim"></i>Limpieza dental<b>5</b></div><div class="prd-ag-row"><i class="sq c-bla"></i>Blanqueamiento<b>4</b></div></div><div class="prd-ag-grp"><h5>Profesionales</h5><div class="prd-ag-row"><i class="av">AR</i>Dra. Ana Rivas<b>10</b></div><div class="prd-ag-row"><i class="av alt">LF</i>Dr. Luis Fuentes<b>5</b></div></div></aside><div class="prd-ag-cal"><div class="prd-ag-wkh"><span></span><span>Lun 23</span><span>Mar 24</span><span>Mié 25</span><span class="on">Jue 26</span><span>Vie 27</span></div><div class="prd-ag-grid"><span class="todaycol" style="grid-column:5;grid-row:1/4"></span><span class="hr" style="grid-row:1">09</span><span class="hr" style="grid-row:2">11</span><span class="hr" style="grid-row:3">13</span><span class="ev c-lim" style="grid-column:2;grid-row:1">09:00</span><span class="ev c-con" style="grid-column:2;grid-row:2">11:00</span><span class="ev c-con" style="grid-column:3;grid-row:1">08:30</span><span class="ev c-lim" style="grid-column:3;grid-row:2">10:00</span><span class="ev c-bla" style="grid-column:4;grid-row:2">09:30</span><span class="ev c-bla" style="grid-column:5;grid-row:1">08:00</span><span class="ev c-con" style="grid-column:5;grid-row:3">12:00</span><span class="ev c-lim" style="grid-column:6;grid-row:1">10:00</span><span class="ev c-bla" style="grid-column:6;grid-row:2">11:00</span></div></div></div>' },
      reservas: { title: "Reservas online", copy: "Una página para reservar", detail: "Tus clientes eligen un servicio y un horario disponible.",
        body: '<div class="prd-bk" aria-hidden="true"><div class="prd-bk-head"><span class="prd-bk-logo">CS</span><span class="prd-bk-biz"><b>Clínica Dental Sonrisa</b><small>Abierto hoy · cierra a las 17:00</small></span></div><div class="prd-bk-prog"><i class="on"></i><i></i><i></i></div><div class="prd-bk-step">Paso 1 de 3</div><strong class="prd-bk-q">¿Qué necesitas?</strong><div class="prd-bk-chips"><span class="on">Todos</span><span>Consultas</span><span>Limpieza</span><span>Estética</span></div><div class="prd-bk-svc"><span class="prd-bk-dur">30<small>min</small></span><span class="prd-bk-nm"><b>Consulta general</b><small>Evaluación y diagnóstico</small></span><span class="prd-bk-pr">$25.000</span></div><div class="prd-bk-svc sel"><span class="prd-bk-dur">45<small>min</small></span><span class="prd-bk-nm"><b>Limpieza dental</b><small>Profilaxis y destartraje</small></span><span class="prd-bk-pr">$35.000</span><em class="prd-bk-ck">✓</em></div><div class="prd-bk-svc"><span class="prd-bk-dur">60<small>min</small></span><span class="prd-bk-nm"><b>Blanqueamiento</b><small>Sesión en clínica</small></span><span class="prd-bk-pr">$120.000</span></div><div class="prd-bk-bar"><span class="prd-bk-sel"><b>Limpieza dental</b><small>45 min · $35.000</small></span><button type="button" tabindex="-1">Continuar</button></div></div>' },
      gestion: { title: "Gestión", copy: "Servicios y equipo conectados", detail: "Consulta quién atiende y qué ofrece tu negocio.",
        body: '<div class="prd-tm" aria-hidden="true"><div class="prd-tm-head"><b>Equipo</b><small>3 profesionales · 3 boxes</small></div><div class="prd-tm-card"><span class="prd-avatar">AR</span><span class="prd-tm-info"><b>Dra. Ana Rivas</b><small>Odontología general · Box 1</small><span class="prd-tm-chips"><i class="c-con">Consulta</i><i class="c-lim">Limpieza</i><i class="c-bla">Blanqueamiento</i></span></span><span class="prd-tm-n"><b>9</b><small>esta semana</small></span></div><div class="prd-tm-card"><span class="prd-avatar alt">LF</span><span class="prd-tm-info"><b>Dr. Luis Fuentes</b><small>Endodoncista · Box 2</small><span class="prd-tm-chips"><i class="c-con">Consulta</i><i class="c-lim">Limpieza</i><i class="c-endo">Endodoncia</i></span></span><span class="prd-tm-n"><b>5</b><small>esta semana</small></span></div><div class="prd-tm-card"><span class="prd-avatar alt2">PS</span><span class="prd-tm-info"><b>Dra. Paula Soto</b><small>Ortodoncista · Box 3</small><span class="prd-tm-chips"><i class="c-orto">Ortodoncia</i><i class="c-orto">Control de ortodoncia</i></span></span><span class="prd-tm-n"><b>3</b><small>esta semana</small></span></div></div>' },
      reportes: { title: "Reportes", copy: "Una lectura clara de la actividad", detail: "Explora indicadores de la agenda de demostración.",
        body: '<div class="prd-rp" aria-hidden="true"><div class="prd-rp-kpis"><div><small>Reservas semana</small><b>15</b></div><div><small>Ingresos est.</small><b>$805.000</b></div><div><small>Nuevos · nov</small><b>2</b></div><div><small>Ocupación</small><b>59%</b></div></div><div class="prd-rp-box"><h6>Reservas por día<span>15 esta semana</span></h6><div class="prd-rp-days"><span class="prd-rp-day"><b>3</b><s class="tr"><s class="fl" style="height:100%"></s></s><em>L</em></span><span class="prd-rp-day"><b>3</b><s class="tr"><s class="fl" style="height:100%"></s></s><em>M</em></span><span class="prd-rp-day"><b>2</b><s class="tr"><s class="fl" style="height:67%"></s></s><em>M</em></span><span class="prd-rp-day on"><b>3</b><s class="tr"><s class="fl" style="height:100%"></s></s><em>J</em></span><span class="prd-rp-day"><b>3</b><s class="tr"><s class="fl" style="height:100%"></s></s><em>V</em></span><span class="prd-rp-day"><b>1</b><s class="tr"><s class="fl" style="height:33%"></s></s><em>S</em></span><span class="prd-rp-day"><b>0</b><s class="tr"><s class="fl" style="height:5%"></s></s><em>D</em></span></div></div><div class="prd-rp-box"><h6>Reservas por servicio<span>3 servicios</span></h6><div class="prd-rp-row c-con"><span class="rl"><i></i>Consulta general</span><span class="rt"><s style="width:100%"></s></span><b>6</b></div><div class="prd-rp-row c-lim"><span class="rl"><i></i>Limpieza dental</span><span class="rt"><s style="width:83%"></s></span><b>5</b></div><div class="prd-rp-row c-bla"><span class="rl"><i></i>Blanqueamiento</span><span class="rt"><s style="width:67%"></s></span><b>4</b></div></div></div>' },
    };
    const tabs = $$("#prd-tabs button"), screen = $("#prd-screen"), title = $("#prd-screen-title"),
      body = $("#prd-screen-body"), ctitle = $("#prd-copy-title"), cdetail = $("#prd-copy-detail");
    if (!tabs.length) return;
    // Cada pestaña resalta su tarjeta en la lista de la derecha.
    const FEAT = { agenda: "agenda", reservas: "reservas", gestion: "equipo", reportes: "reportes" };
    const feats = $$(".prd-feature-list .prd-feature");
    const markFeature = (id) => feats.forEach((f) => f.classList.toggle("on", f.id === FEAT[id]));
    markFeature("agenda");
    tabs.forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.view, v = VIEWS[id];
      tabs.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      screen.className = "prd-screen prd-screen-" + id;
      title.textContent = v.title; body.innerHTML = v.body;
      ctitle.textContent = v.copy; cdetail.textContent = v.detail;
      markFeature(id);
    }));
  })();
})();
