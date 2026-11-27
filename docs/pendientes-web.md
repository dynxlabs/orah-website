# Pendientes del sitio web (useorah.com)

> Lista viva de pendientes del **sitio público** de Orah (`orah-website`, GitHub Pages + Cloudflare).
> Los pendientes de la **app** (panel y reservas) viven en el repo de la app (`docs/pendientes-ui.md`).
>
> **Creado:** 2026-11-26 · Autor: DYNX Labs (Lyra)

---

## Abiertos

### WEB-01 · Rendimiento de la red neuronal del hero
**Observado por Arois (2026-11-26):** "se ve bien, pero la siento demasiado lenta".

- **Diagnóstico (medido):** la carga es rápida (≈16 KB en total, `DOMContentLoaded` <1 s). El costo está en la animación del canvas del hero (`assets/js/orb.js`): la esfera de red neuronal genera **~1.300 puntos** (hasta **~1.800** en pantallas grandes; fórmula `max(900, min(1800, w*h/150))`) y los recalcula/redibuja a **60 fps** (proyección 3D + aristas + señales + orden por profundidad en cada frame). Eso consume CPU y hace que el scroll y la interacción se sientan pesados.
- **Opciones propuestas (sin aplicar, a la espera de decisión de Arois):**
  - **A — Pausar fuera de viewport:** con `IntersectionObserver`, detener la animación cuando el hero sale de pantalla (al scrollear) y reanudarla al volver. **Sin impacto visual.**
  - **B — Reducir densidad y limitar fps:** bajar el tope de puntos (~1.800 → ~1.000) y cap a ~40 fps. La esfera se ve prácticamente igual y cuesta casi la mitad. **Cambio visual mínimo → requiere OK de Arois.**
- **Recomendación:** aplicar A + B.
- Estado: **pendiente** · Prioridad: normal.

---

## Hecho

### WEB-02 · Página pública `/producto/` con Aria multicanal
**Aprobado e implementado (2026-11-27).**

- Mockup `docs/mockup-producto.html` aprobado por Arois → implementado en `producto/index.html` (se sirve en `useorah.com/producto/`).
- Posicionamiento multicanal: hero "**Tu cliente escribe; Orah agenda.**", sección **Aria** (en desarrollo) con 6 canales activables, **Disponible hoy** (6 capacidades con estado real), **Próximamente** (multi-sucursal, recordatorios WhatsApp, pagos y señas), CTA y footer.
- Reutiliza `site.css` (`prd-*`) y Figtree; tema claro/oscuro con la clave `orah-theme` (igual que la landing); showcase interactivo de 4 vistas; **DYNX Labs** enlazado. Mantiene `noindex` temporal (quitar al publicar).
- Revisado a ojo en local (claro/oscuro/móvil), sin errores de consola ni recortes.
- **Publicado:** `useorah.com/producto/` en vivo (commit `a535214`).
- Detalle en `BITACORA.md` (entrada 2026-11-27).

### WEB-03 · Mega-menú estándar en todas las páginas
**Decisión de Arois (2026-11-27):** el mega-menú de la landing es la **cabecera estándar** de todas las páginas que creemos, **idéntico**.

- Implementado en `/producto/` (reemplaza su header propio por el mega-menú + `site.js`).
- Enlaces del menú actualizados en todo el sitio (`site.js`): a raíz (`/#sección`) para que naveguen desde cualquier página; las entradas de "Producto" llevan a `/producto/`.
- **Regla para páginas nuevas:** usar este mismo header (mega-menú + `site.js`), no un header propio.
- Detalle en `BITACORA.md` (entrada 2026-11-27).

### WEB-04 · Previews de Recordatorios por WhatsApp y Pagos y señas en el showcase de la landing
**Aprobado e implementado (2026-11-27).** Mockup: `docs/mockup-previews-landing.html`.

- El showcase de la landing pasa de 4 a **6 pestañas** (+ Recordatorios, + Pagos); ambas marcadas "función en desarrollo".
- **Recordatorios:** iPhone con marco Glaciar y Dynamic Island, interfaz **WhatsApp iOS 2026 (Liquid Glass)**, batería 79% y **hora real del visitante** (los mensajes, 8 y 7 min antes).
- **Pagos y señas:** checkout al nivel de la reserva (`prd-bk`) con SVG oficiales de Visa, Mastercard y American Express (`assets/brands/`, revisados sin scripts).
- Referencias a `site.css`/`site.js` versionadas (`?v=20261127b`) para que HTML, CSS y JS nuevos lleguen juntos.
