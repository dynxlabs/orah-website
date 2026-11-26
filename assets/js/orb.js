/* Red neuronal 3D del hero (Petróleo). Portado 1:1 desde OrahLanding.tsx. */
(function () {
  const canvas = document.getElementById("orb-canvas");
  const visual = document.getElementById("lp-visual");
  if (!canvas || !visual) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0, height = 0, dpr = 1;
  let particles = [];
  let edges = [];
  let signals = [];
  let pulses = [];
  let time = 0, lastFrame = 0, raf = 0, sigAcc = 0;

  const pointer = { x: 0, y: 0, tnx: 0, tny: 0, nx: 0, ny: 0, active: false };

  function readPalette() {
    const el = document.documentElement;
    const dark =
      el.getAttribute("data-theme") === "dark" ||
      (el.getAttribute("data-theme") !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    return dark
      ? { pSat: 70, pLight: 60, edge: "96,196,208",
          halo: ["rgba(96,196,208,.20)", "rgba(96,196,208,.08)", "rgba(96,196,208,.02)", "rgba(96,196,208,0)"],
          signal: "150,232,240", orbit: ["rgba(96,196,208,.14)", "rgba(130,210,220,.10)"] }
      : { pSat: 56, pLight: 33, edge: "14,94,104",
          halo: ["rgba(14,94,104,.15)", "rgba(14,94,104,.07)", "rgba(14,94,104,.02)", "rgba(14,94,104,0)"],
          signal: "16,120,132", orbit: ["rgba(14,94,104,.12)", "rgba(20,110,120,.09)"] };
  }
  let pal = readPalette();

  function resize() {
    const rect = visual.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    particles = []; edges = []; signals = [];
    const count = Math.round(Math.max(900, Math.min(1800, (width * height) / 150)));
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      particles.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r,
        seed: Math.random() * Math.PI * 2, phase: Math.random() * Math.PI * 2,
        size: 0.48 + Math.random() * 1.05, hue: 182 + Math.random() * 14 });
    }
    const linked = new Set();
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const near = [];
      for (let j = Math.max(0, i - 34); j < Math.min(particles.length, i + 35); j++) {
        if (i === j) continue;
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < 0.018) near.push([d, j]);
      }
      near.sort((m, n) => m[0] - n[0]);
      for (const pair of near.slice(0, 3)) {
        const j = pair[1];
        const key = i < j ? i + ":" + j : j + ":" + i;
        if (!linked.has(key)) { linked.add(key); edges.push([i, j]); }
      }
    }
  }

  const maxSig = () => Math.min(26, Math.max(6, Math.floor(edges.length / 55)));
  const smooth = (t) => t * t * (3 - 2 * t);

  function draw(ts = 0) {
    const dt = Math.min(32, ts - (lastFrame || ts));
    lastFrame = ts;
    ctx.clearRect(0, 0, width, height);
    time += reduce ? 0 : dt * 0.00042;

    pointer.nx += (pointer.tnx - pointer.nx) * 0.07;
    pointer.ny += (pointer.tny - pointer.ny) * 0.07;

    const mobile = width < 600;
    const breathe = 1 + (reduce ? 0 : Math.sin(time * 0.8) * 0.014);
    const scale = Math.min(width, height) * (mobile ? 0.405 : 0.425) * breathe;
    const cx = width * (0.52 + pointer.nx * 0.02);
    const cy = height * (0.49 + pointer.ny * 0.02);

    const rotY = time * 0.32 + pointer.nx * 0.22;
    const rotX = -0.2 + Math.sin(time * 0.46) * 0.1 + pointer.ny * 0.16;
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    const proj = new Array(particles.length);

    const halo = ctx.createRadialGradient(cx, cy, scale * 0.04, cx, cy, scale * 1.48);
    halo.addColorStop(0, pal.halo[0]); halo.addColorStop(0.42, pal.halo[1]);
    halo.addColorStop(0.76, pal.halo[2]); halo.addColorStop(1, pal.halo[3]);
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, scale * 1.48, 0, Math.PI * 2); ctx.fill();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const wa = Math.sin(p.x * 7.4 + time * 2 + p.seed) * 0.031;
      const wb = Math.cos(p.z * 8.2 - time * 1.4 + p.phase) * 0.023;
      const wc = Math.sin(p.y * 10.5 + time * 0.9 + p.seed) * 0.015;
      const wd = Math.sin((p.x + p.z) * 5.5 + time * 1.1) * 0.012;
      const deform = 1 + wa + wb + wc + wd;
      const px = p.x * deform, py = p.y * deform, pz = p.z * deform;
      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      const y1 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;
      const persp = 2.9 / (2.9 + z2 * 0.48);
      let sx = cx + x1 * scale * persp;
      let sy = cy + y1 * scale * persp;
      if (pointer.active) {
        const dx = sx - pointer.x, dy = sy - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) { const force = smooth(1 - dist / 120) * 15; sx += (dx / dist) * force; sy += (dy / dist) * force; }
      }
      proj[i] = { sx, sy, z: z2, size: p.size * persp, hue: p.hue };
    }

    ctx.lineCap = "round";
    for (const e of edges) {
      const a = proj[e[0]], b = proj[e[1]];
      const dx = a.sx - b.sx, dy = a.sy - b.sy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 44) continue;
      const depth = (a.z + b.z + 2) / 4;
      const alpha = (0.035 + depth * 0.1) * (1 - distance / 58);
      if (alpha <= 0.012) continue;
      ctx.strokeStyle = "rgba(" + pal.edge + "," + alpha + ")";
      ctx.lineWidth = 0.45 + depth * 0.42;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    }

    if (!reduce) {
      sigAcc += dt;
      while (sigAcc > 60 && signals.length < maxSig() && edges.length) {
        sigAcc -= 60;
        signals.push({ e: edges[(Math.random() * edges.length) | 0], t: 0, speed: 0.55 + Math.random() * 0.7 });
      }
    }
    signals = signals.filter((s) => s.t < 1);
    for (const s of signals) {
      s.t += reduce ? 1 : (dt / 1000) * s.speed;
      const a = proj[s.e[0]], b = proj[s.e[1]];
      const dx = a.sx - b.sx, dy = a.sy - b.sy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 90) continue;
      const t = Math.min(1, s.t);
      const sx = a.sx + (b.sx - a.sx) * t;
      const sy = a.sy + (b.sy - a.sy) * t;
      const fade = Math.sin(Math.PI * t);
      ctx.strokeStyle = "rgba(" + pal.signal + "," + (0.5 * fade) + ")";
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(sx, sy); ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = "rgba(" + pal.signal + "," + (0.9 * fade) + ")";
      ctx.arc(sx, sy, 1.9 + fade * 1.1, 0, Math.PI * 2); ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.34 + Math.sin(time * 0.3) * 0.045);
    ctx.strokeStyle = pal.orbit[0]; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.ellipse(0, 0, scale * 1.06, scale * 0.36, 0, 0.1, Math.PI * 1.88); ctx.stroke();
    ctx.rotate(1.02);
    ctx.strokeStyle = pal.orbit[1];
    ctx.beginPath(); ctx.ellipse(0, 0, scale * 0.98, scale * 0.31, 0, 0.12, Math.PI * 1.84); ctx.stroke();
    ctx.restore();

    pulses = pulses.filter((p) => p.life < 1);
    for (const pulse of pulses) {
      pulse.life += reduce ? 1 : dt / 1050;
      const r = pulse.life * scale * 1.28;
      ctx.beginPath(); ctx.arc(pulse.x, pulse.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + pal.signal + "," + ((1 - pulse.life) * 0.38) + ")";
      ctx.lineWidth = 1.1; ctx.stroke();
    }

    proj.sort((a, b) => a.z - b.z);
    for (const p of proj) {
      const depth = (p.z + 1) / 2;
      const alpha = 0.34 + depth * 0.58;
      const radius = p.size * (0.76 + depth * 0.5);
      if (depth > 0.56) {
        ctx.beginPath();
        ctx.fillStyle = "hsla(" + p.hue + "," + pal.pSat + "%," + (pal.pLight + 8) + "%," + (0.05 + depth * 0.07) + ")";
        ctx.arc(p.sx, p.sy, radius * 3.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = "hsla(" + p.hue + "," + (pal.pSat + depth * 10) + "%," + (pal.pLight + depth * 18) + "%," + alpha + ")";
      ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2); ctx.fill();
    }

    if (!reduce) raf = requestAnimationFrame(draw);
  }

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top;
    pointer.tnx = (pointer.x / Math.max(1, rect.width) - 0.5) * 2;
    pointer.tny = (pointer.y / Math.max(1, rect.height) - 0.5) * 2;
    pointer.active = true;
  };
  const onLeave = () => { pointer.active = false; pointer.tnx = 0; pointer.tny = 0; };
  const onClick = (e) => {
    const rect = canvas.getBoundingClientRect();
    pulses.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, life: 0 });
  };
  visual.addEventListener("pointermove", onMove);
  visual.addEventListener("pointerleave", onLeave);
  visual.addEventListener("click", onClick);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onTheme = () => { pal = readPalette(); };
  mq.addEventListener("change", onTheme);
  const mo = new MutationObserver(onTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const ro = new ResizeObserver(resize);
  ro.observe(visual);
  resize();
  draw();
})();
