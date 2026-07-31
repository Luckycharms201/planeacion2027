/**
 * Exporta la presentación completa a PDF, una slide por página.
 *
 *   npm run export:pdf              → export/Planeacion-2027.pdf
 *   npm run export:pdf -- --png     → conserva además los PNG por slide
 *
 * Cómo funciona: levanta `vite preview` sobre el build, abre cada slide en
 * Chrome headless con `?n=<slide>&noanim` (las entradas GSAP saltan a su
 * estado final) y captura el canvas base 1440×810 a 2×. Las páginas se
 * ensamblan en un PDF 16:9 sin recompresión: cada PNG se incrusta tal cual.
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { buildPdf } from "./png-to-pdf.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// fuera de dist/, que `vite build` borra en cada compilación
const OUT_DIR = path.join(ROOT, "export");
const SHOT_DIR = path.join(OUT_DIR, "slides-png");
const PDF_PATH = path.join(OUT_DIR, "Planeacion-2027.pdf");

// canvas de diseño (FitStage.BASE_W/BASE_H) y factor de escala de captura
const BASE_W = 1440;
const BASE_H = 810;
const SCALE = 2;

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// margen para que fuentes, imágenes y estados finales de GSAP se asienten
const SETTLE_MS = Number(process.env.SETTLE_MS ?? 1400);

const keepPng = process.argv.includes("--png");

/** Levanta `vite preview` y devuelve { url, stop }. */
async function startServer() {
  const proc = spawn("npx", ["vite", "preview", "--port", "4317", "--strictPort"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("vite preview no arrancó a tiempo")),
      30000
    );
    const onData = (buf) => {
      const m = String(buf).match(/https?:\/\/localhost:\d+/);
      if (m) {
        clearTimeout(timer);
        resolve(m[0]);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`vite preview terminó con código ${code}`));
    });
  });
  return { url, stop: () => proc.kill() };
}

/**
 * Páginas del PDF, derivadas de los datos de la presentación: una por slide,
 * salvo el calendario, que rinde una página por mes (`?mes=`) porque sus meses
 * son pestañas y en una sola captura sólo saldría el primero.
 */
async function buildPageList() {
  const { LIVE_SEQUENCE } = await import(
    path.join(ROOT, "src/data/presentation.js")
  );

  const pages = [];
  LIVE_SEQUENCE.forEach((slide, i) => {
    const n = i + 1;
    if (slide.type === "calendario") {
      const months = slide.months ?? [];
      for (const m of months) {
        pages.push({ query: `n=${n}&noanim&mes=${m}`, label: `${n}·mes${m}` });
      }
      if (months.length) return;
    }
    pages.push({ query: `n=${n}&noanim`, label: String(n) });
  });
  return pages;
}

async function main() {
  if (!existsSync(CHROME)) {
    throw new Error(
      `No encuentro Chrome en ${CHROME}. Define CHROME_PATH con la ruta correcta.`
    );
  }

  const pages = await buildPageList();
  console.log(`Exportando ${pages.length} páginas…`);

  await rm(SHOT_DIR, { recursive: true, force: true });
  await mkdir(SHOT_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--autoplay-policy=no-user-gesture-required",
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: BASE_W,
      height: BASE_H,
      deviceScaleFactor: SCALE,
    });

    for (const [i, { query, label }] of pages.entries()) {
      await page.goto(`${server.url}/?${query}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      // los videos quedan en su primer fotograma: sin animación no hay
      // reproducción que capturar, así que basta con dejar asentar el layout
      await page.evaluate(() => document.fonts?.ready);
      await new Promise((r) => setTimeout(r, SETTLE_MS));

      // el nombre lleva el índice de página delante para que el orden
      // alfabético de la carpeta sea el orden del PDF
      const file = path.join(
        SHOT_DIR,
        `${String(i + 1).padStart(3, "0")}-slide${label}.png`
      );
      await page.screenshot({
        path: file,
        clip: { x: 0, y: 0, width: BASE_W, height: BASE_H },
        captureBeyondViewport: false,
      });
      process.stdout.write(`  ${i + 1}/${pages.length}\r`);
    }
    console.log(`\nCapturas listas en ${path.relative(ROOT, SHOT_DIR)}`);
  } finally {
    await browser.close();
    server.stop();
  }

  const files = (await readdir(SHOT_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => path.join(SHOT_DIR, f));

  const pdf = await buildPdf(files);
  await writeFile(PDF_PATH, pdf);
  console.log(
    `PDF: ${path.relative(ROOT, PDF_PATH)} (${files.length} páginas, ${(
      pdf.length / 1e6
    ).toFixed(1)} MB)`
  );

  if (!keepPng) await rm(SHOT_DIR, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
