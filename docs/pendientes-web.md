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
