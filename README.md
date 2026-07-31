# Mejores Prácticas Monterrey · EXATEC 360

Presentación web interactiva **hub-and-spoke** (no es un slideshow lineal): un hub
central tipo constelación del que salen las secciones. Construida con **React + Vite +
GSAP + Tailwind v4**.

## Correr en local

```bash
npm install
npm run dev      # http://localhost:5173
```

- `npm run build` — bundle de producción en `dist/`
- `npm run preview` — sirve el build localmente
- `#lab` — laboratorio temporal de primitivas de dato (ej. `localhost:5173/#lab`)

## Exportar a PDF

```bash
npm run export:pdf            # → export/Planeacion-2027.pdf (una página por slide)
npm run export:pdf -- --png   # conserva además los PNG en export/slides-png/
```

Compila, abre cada slide en Chrome headless con `?n=<slide>&noanim` (las entradas
GSAP saltan a su estado final), captura el canvas 1440×810 a 2× y arma un PDF 16:9
sin pérdida. Usa el Chrome instalado; si está en otra ruta, pásala en `CHROME_PATH`.
Son 45 páginas para 41 slides: el Calendario rinde una por mes (`?mes=<1-12>`,
que también sirve como deep link de QA). Los videos salen como fotograma fijo.

## Navegación

- **Hub:** `← →` mueven el foco entre grupos · `Enter` entra al grupo (zoom de cámara)
- **Sección:** `← →` recorren la secuencia global 1→13 · `Esc` vuelve al hub
- Click y hover también funcionan

## Estructura

```
src/
  data/presentation.js   ← ÚNICA fuente de verdad (grupos → slides → datos)
  hooks/                 ← useNavigation, useSlideTimeline
  components/
    Hub/                 ← constelación + geometría orbital
    Stage/               ← FitStage (escala 16:9), Stage, SlideShell
    slides/              ← un componente por tipo de slide
    dataviz/             ← CountUp, DotGrid, ZoomScale, iMessageThread
    ui/                  ← Placeholder, Highlight, SlideHeading, AmbientBackground
    dev/DataLab.jsx      ← preview de primitivas (#lab), se puede borrar
```

13 slides en 3 grupos: **Regreso a Casa** (1–6), **Agrupaciones** (7–12),
**Líderes de Generación** (13).

## Contenido pendiente de reemplazar

Todo vive en `src/data/presentation.js` (busca los comentarios `PLACEHOLDER`):

- **Videos** (slides 2, 9, 11): marcos `VIDEO #n` por reemplazar.
- **Fotos**: cada `Placeholder` tiene un `#n` y una nota.
- **Slide 6 · NPS**: valores `editions[]` y `comments[]` reales.
- **Slide 8 · Talleres** y **12 · Monto**: numeralia/montos reales.
- **Slide 10 · Torneos**: pendiente de ampliar (`pending: true`).

## Deploy a Cloudflare Pages

**Opción A — conectar el repo (recomendado, auto-deploy en cada push):**
en Cloudflare Pages crea un proyecto desde este repo con:

- Build command: `npm run build`
- Build output directory: `dist`

**Opción B — subida directa:**

```bash
npm run deploy   # build + wrangler pages deploy dist
```

(Requiere estar autenticado en Wrangler: `npx wrangler login`.)
