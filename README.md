<p align="center">
  <img src="assets/icons/logo.svg" alt="DYNX Orah" width="220">
</p>

<p align="center">
  <strong>Agenda más. Trabaja menos.</strong>
</p>

<p align="center">
  Sitio web público de <strong>DYNX Orah</strong> · <a href="https://useorah.com">useorah.com</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/estado-En%20construcci%C3%B3n-yellow?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/idioma-ES%20%7C%20EN%20%7C%20PT--BR-orange?style=flat-square" alt="Idioma">
  <img src="https://img.shields.io/badge/hosting-GitHub%20Pages%20%2B%20Cloudflare-blue?style=flat-square" alt="Hosting">
  <img src="https://img.shields.io/badge/licencia-Proprietary-red?style=flat-square" alt="Licencia">
</p>

---

## Qué es DYNX Orah

**DYNX Orah** es la plataforma de reservas y agendamiento de [DYNX Labs](https://dynxlabs.com) que convierte cada hora disponible en una cita confirmada: sin llamadas, sin planillas, sin horas perdidas.

Este repositorio contiene el **sitio web público** de Orah (marketing y SEO). El acceso al producto —panel de empresas clientes y panel interno— vive en subdominios propios y **no** se sirve desde aquí.

| Dominio | Qué sirve | Dónde |
|---|---|---|
| **useorah.com** | Sitio público de marketing (este repo) | GitHub Pages + Cloudflare |
| **app.useorah.com** | Panel de empresas clientes (con login) | App (Vercel + Supabase) |
| **admin.useorah.com** | Panel interno de DYNX Labs | App (Vercel + Supabase) |

> El estándar técnico y de SEO de este sitio replica el de [dynxlabs.com](https://github.com/dynxlabs/dynxlabs.github.io), adaptado a Orah (trilingüe e identidad propia).

---

## Características principales

Objetivo del sitio. Cada elemento se marca como implementado a medida que se integra en `main`.

- **Sitio trilingüe**: español en `/es/` (versión por defecto), inglés en `/en/` y portugués en `/pt-br/`.
- **SEO internacional**: canonical autorreferente, `hreflang` recíproco (`es`, `en`, `pt-br` y `x-default` hacia español), JSON-LD localizado y un único `sitemap.xml` con las alternativas de idioma.
- **HTML prerenderizado**: el contenido y los metadatos están en el HTML inicial, sin depender de JavaScript para indexarse.
- **Datos estructurados**: Organization, Product/SoftwareApplication y WebSite en la home; BreadcrumbList; FAQPage en preguntas frecuentes.
- **Protocolos de rastreo y contacto**: `robots.txt` con política de crawlers de IA, `llms.txt`, `security.txt` (RFC 9116) e IndexNow.
- **Accesibilidad WCAG 2.1 AA** verificada con axe-core en todas las páginas.
- **Calidad automatizada**: cada cambio pasa por un build reproducible y una auditoría SEO en GitHub Actions.
- **Identidad propia de Orah**: tipografía Figtree, acento teal y modo claro/oscuro, reutilizando el diseño de la landing del producto.

---

## Arquitectura

```
                                   FLUJO DE PUBLICACIÓN

  [Fuentes]                        [Build]                      [Publicación]
      |                               |                               |
      v                               v                               v
  +------------------+   npm run   +--------------------+   main   +--------------+
  | Páginas raíz     |   build     | build-i18n         |  ------> | GitHub Pages |
  | locales/         | ----------> | sitemap · robots   |          | (origen)     |
  | assets/          |             |                    |          +--------------+
  +------------------+             +--------------------+                 |
                                             |                           v
                                 /es/ /en/ /pt-br/ sitemap       +--------------+
                                             |                   | Cloudflare   |
                                             v                   | DNS · TLS ·  |
                                   +--------------------+        | Email Routing|
                                   | Auditoría SEO (CI) |        +--------------+
                                   +--------------------+                |
                                                                        v
                                                                 [Visitantes y
                                                                  buscadores]
```

**Flujo completo:**
1. El contenido se edita en las **fuentes**: las páginas de la raíz, los textos en `locales/` y los recursos en `assets/`.
2. El **build** genera las páginas de `/es/`, `/en/` y `/pt-br/`, el `sitemap.xml` y el `robots.txt`.
3. **SEO CI** valida cada pull request: build reproducible, canonical, hreflang, JSON-LD, sitemap, enlaces, metadatos y calidad HTML.
4. Al integrar en `main`, **GitHub Pages** publica el sitio y **Cloudflare** lo sirve con TLS. IndexNow avisa a los buscadores de las URLs que cambiaron.

---

## Estrategia SEO

Se implementa siguiendo la misma referencia que dynxlabs.com. Cada elemento indica su estado.

### 1. Indexación y arquitectura de idiomas

| Elemento | Implementación | Estado |
|---|---|---|
| Rutas por idioma | `/es/`, `/en/` y `/pt-br/`. El idioma lo determina la ruta. | ⚪ Pendiente |
| Canonical | Autorreferente en cada página, sin parámetros | ⚪ Pendiente |
| Hreflang | `es`, `en`, `pt-br` y `x-default` hacia español | ⚪ Pendiente |
| Sitemap | Un único `sitemap.xml` con las URLs y sus alternativas de idioma | ⚪ Pendiente |
| Contenido en HTML inicial | Los textos se hornean en el build, no dependen de JavaScript | ⚪ Pendiente |

### 2. Rastreo, IA y contacto

| Elemento | Implementación | Estado |
|---|---|---|
| `robots.txt` | `Allow: /`. Bloqueo a crawlers de entrenamiento (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`); permitidos los de búsqueda y citación. Incluye `Sitemap:`. | ⚪ Pendiente |
| `llms.txt` | Resumen para modelos de lenguaje (ES + EN + PT-BR). | ⚪ Pendiente |
| IndexNow | Aviso de URLs cambiadas a `api.indexnow.org` en cada push a `main`. | ⚪ Pendiente |
| `security.txt` | `/.well-known/security.txt` (RFC 9116). | ⚪ Pendiente |

### 3. Datos estructurados

| Elemento | Implementación | Estado |
|---|---|---|
| Home | Organization, Product/SoftwareApplication, WebSite | ⚪ Pendiente |
| FAQ | FAQPage | ⚪ Pendiente |
| Breadcrumbs | BreadcrumbList | ⚪ Pendiente |

### 4. Medición

| Elemento | Implementación | Estado |
|---|---|---|
| GA4 | Activo con Consent Mode y banner de cookies propio | ⚪ Pendiente |
| Search Console | Propiedad de dominio `useorah.com` | ⚪ Pendiente |
| Bing Webmaster Tools | Sitemap enviado | ⚪ Pendiente |

---

## Metodología

El trabajo SEO sigue este orden (el mismo de dynxlabs.com):

1. **Línea base** antes de tocar nada: estado técnico del repo y métricas de Search Console, Bing y GA4.
2. **Priorizar** con matriz impacto / esfuerzo. Primero lo que no requiere configuración externa.
3. **Lotes** de cambios relacionados.
4. **Una rama y un PR por cambio**, con la auditoría en verde antes del PR.
5. **Revisión a las 4 semanas.** Ningún cambio se juzga antes de la revisión.

---

## Estructura del repositorio

```
orah-website/
|
+-- .github/
|   +-- workflows/                       SEO CI, publicación e IndexNow (pendiente)
|
+-- index.html, producto.html, ...       Fuentes de las páginas principales
+-- 404.html                             Página de error (noindex)
|
+-- es/, en/, pt-br/                      Sitio publicado (generado)
+-- locales/                             Textos de la interfaz (es/en/pt-br)
+-- assets/                              CSS, JavaScript, iconos e imágenes
|   +-- icons/logo.svg                   Logo de Orah
+-- scripts/                             Build y auditoría SEO
|
+-- sitemap.xml                          Generado
+-- robots.txt                           Política de rastreo
+-- llms.txt                             Resumen para modelos de lenguaje
+-- CNAME                                Dominio personalizado (useorah.com)
+-- _config.yml                          Excluye del sitio los archivos del repositorio
+-- README.md
```

> No edites a mano `en/`, `es/`, `pt-br/`, `sitemap.xml` ni demás salidas del build.

---

## Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| HTML / CSS / JavaScript | ES6+ | Sitio estático |
| Figtree (Google Fonts) | — | Tipografía (identidad Orah) |
| Node.js | 22 | Build y auditoría |
| GitHub Pages | — | Publicación de `main` |
| Cloudflare | Plan Free | DNS, proxy, TLS y Email Routing |
| GitHub Actions | — | SEO CI, publicación e IndexNow |

---

## Componentes

| Componente | Estado |
|---|---|
| Sitio trilingüe ES / EN / PT-BR | ⚪ Pendiente |
| robots.txt, llms.txt, security.txt | ⚪ Pendiente |
| IndexNow | ⚪ Pendiente |
| SEO CI | ⚪ Pendiente |
| Dominio useorah.com en GitHub Pages + Cloudflare | ⚪ Pendiente |

---

## Verificación

```bash
npm ci
npm run build
npm test
```

**Comprobaciones manuales en producción (cuando el dominio esté activo):**

```bash
curl -sI https://useorah.com/robots.txt
curl -s  https://useorah.com/llms.txt | head -5
curl -s  https://useorah.com/.well-known/security.txt
```

---

## Document Authority

### Autor

**Arois Monsalve**
Founder & CEO
**DYNX Labs**

### Desarrollo y mantenimiento

| Rol | Responsable |
|---|---|
| Ingeniería Líder & Arquitecta de Producto | Lyra (Claude Code) |
| QA & Performance | Lyra (Claude Code) |
| Aprobación y dirección de producto | Arois Monsalve |

---

## Sitio web

🌐 **[useorah.com](https://useorah.com/)** (en construcción)

---

## Seguridad

> ⚠️ Este repositorio es **público**. El código y el contenido son propiedad de DYNX Labs.

- No incluir tokens, API keys, credenciales ni archivos `.env` en commits.
- El sitio no usa secretos: los workflows de GitHub Actions no requieren ninguno.
- Para reportar una vulnerabilidad, usa el formulario de contacto del sitio.

---

## Última actualización

**26 Nov 2026** — Repositorio creado. Sitio público de Orah en GitHub Pages + Cloudflare, replicando el estándar SEO de dynxlabs.com. Próximo paso: estructura base, dominio useorah.com y portado de la landing del producto.

---

## Aviso legal

```
Copyright (c) 2026 Dynamic Neuromorphic Labs SpA (DYNX Labs)
Todos los derechos reservados.

Este software es propiedad exclusiva de Dynamic Neuromorphic Labs SpA.
Su uso, copia, modificación o distribución sin autorización expresa y
por escrito de DYNX Labs está estrictamente prohibida.

Web: https://useorah.com/
```
