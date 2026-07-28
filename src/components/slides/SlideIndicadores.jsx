import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";
import CountUp from "../dataviz/CountUp";

/**
 * Slide 2 · Indicadores — tablero de resultados del ciclo.
 *
 * Cada indicador es una tarjeta con tres lecturas:
 *   1. la cifra del ciclo actual (count-up) y su cambio contra el anterior,
 *   2. una mini gráfica de dos columnas (ciclo pasado → actual) atravesada
 *      por la línea de meta, que deja ver de un golpe si se creció y si se
 *      alcanzó el objetivo,
 *   3. el porcentaje de avance contra esa meta.
 *
 * Cada gráfica se escala a su propio máximo — las tarjetas se comparan por
 * FORMA (creció / se quedó corto / rebasó la línea), no por altura absoluta,
 * porque los indicadores van de 65 a 3,381 y una escala común los aplanaría.
 *
 * El acento cyan queda reservado al TOTAL, que es el dato principal.
 */

const POS = "#7fe3b0";
const NEG = "#ff8098";

const pct1 = (n) => `${(n * 100).toFixed(1)}%`;
const num = (n) => n.toLocaleString("es-MX");

/** Flecha de tendencia. `up` decide dirección y color. */
function Trend({ up }) {
  return (
    <svg
      viewBox="0 0 10 8"
      width="10"
      height="8"
      aria-hidden="true"
      style={{ transform: up ? "none" : "rotate(180deg)" }}
    >
      <path d="M5 0 L10 8 L0 8 Z" fill="currentColor" />
    </svg>
  );
}

/* gutters de la mini gráfica: columna de año a la izquierda, cifra a la derecha */
const LABEL_W = 44;
const VALUE_W = 46;
const GUTTER = 9;

/**
 * Mini gráfica: dos barras horizontales (ciclo pasado, apagada / ciclo actual,
 * en azul) sobre un riel común, atravesadas por la línea vertical de la meta.
 * La escala reserva un 6 % de aire para que la barra más larga no toque el
 * borde, y la meta se vuelve el punto de referencia visual de la tarjeta.
 */
function MiniBars({ prev, curr, meta, prevLabel, currLabel }) {
  const top = Math.max(prev, curr, meta ?? 0) * 1.06;
  const w = (v) => `${(v / top) * 100}%`;
  const hitMeta = meta !== null && curr >= meta;

  const bars = [
    { v: prev, label: prevLabel, current: false },
    { v: curr, label: currLabel, current: true },
  ];

  return (
    <div className="relative">
      {/* línea de meta: referencia vertical que cruza ambas barras y sobresale
          arriba y abajo para que no se confunda con un corte de la barra */}
      {meta !== null && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: LABEL_W + GUTTER,
            right: VALUE_W + GUTTER,
            top: -5,
            bottom: -5,
          }}
        >
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: w(meta),
              width: 2,
              marginLeft: -1,
              background: "rgba(234,240,255,0.7)",
              boxShadow: "0 0 8px -1px rgba(234,240,255,0.6)",
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center" style={{ gap: GUTTER }}>
            <span
              className="text-text-dim tabular shrink-0 text-right"
              style={{ width: LABEL_W, fontSize: 10 }}
            >
              {b.label}
            </span>

            <div
              className="relative flex-1 overflow-hidden rounded-full"
              style={{ height: 26, background: "rgba(138,155,196,0.10)" }}
            >
              <div
                className="ind-bar h-full rounded-full"
                style={{
                  width: w(b.v),
                  transformOrigin: "left center",
                  background: b.current
                    ? hitMeta
                      ? "linear-gradient(90deg, var(--color-blue-500), #8fbcff)"
                      : "linear-gradient(90deg, var(--color-blue-700), var(--color-blue-500))"
                    : "rgba(138,155,196,0.45)",
                }}
              />
            </div>

            <span
              className="tabular shrink-0 font-semibold"
              style={{
                width: VALUE_W,
                fontSize: 12,
                color: b.current ? "var(--color-text)" : "var(--color-text-dim)",
              }}
            >
              {num(b.v)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tarjeta de un indicador. */
function IndicadorCard({ row, prevLabel, currLabel, delay }) {
  const change = row.curr / row.prev - 1;
  const up = change >= 0;
  const vsMeta = row.meta ? row.curr / row.meta : null;

  return (
    <div
      className="ind-card ind-hoverable flex flex-col justify-between rounded-2xl"
      style={{
        padding: 20,
        background:
          "linear-gradient(158deg, rgba(21,52,138,0.38), rgba(12,26,58,0.55))",
        border: "1px solid rgba(138,155,196,0.16)",
      }}
    >
      <div>
        <p
          className="text-text-dim font-semibold uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.18em", lineHeight: 1.3 }}
        >
          {row.name}
        </p>

        <div className="mt-2.5 flex items-baseline gap-2.5">
          <span
            className="text-text font-display font-black tracking-tight"
            style={{ fontSize: 48, lineHeight: 1 }}
          >
            <CountUp value={row.curr} duration={1.8} delay={delay} />
          </span>
          <span
            className="flex items-center gap-1 font-semibold"
            style={{ fontSize: 13, color: up ? POS : NEG }}
          >
            <Trend up={up} />
            {pct1(Math.abs(change))}
          </span>
        </div>
      </div>

      <MiniBars
        prev={row.prev}
        curr={row.curr}
        meta={row.meta}
        prevLabel={prevLabel}
        currLabel={currLabel}
      />

      <div
        className="flex items-baseline justify-between border-t pt-2.5"
        style={{ borderColor: "rgba(138,155,196,0.14)", fontSize: 11.5 }}
      >
        {vsMeta !== null ? (
          <>
            <span className="tabular">
              <span
                className="font-semibold"
                style={{ color: vsMeta >= 1 ? POS : "var(--color-text)" }}
              >
                {pct1(vsMeta)}
              </span>
              <span className="text-text-dim"> de la meta</span>
            </span>
            <span className="text-text-dim tabular">{num(row.meta)}</span>
          </>
        ) : (
          <span className="text-text-dim">Sin meta definida</span>
        )}
      </div>
    </div>
  );
}

/**
 * Panel de un total. `accent` lo marca como el dato principal de la pantalla
 * (único con cyan); el resto usa el mismo tratamiento neutro de las tarjetas.
 */
function TotalPanel({ label, note, prev, curr, meta, prevLabel, accent, delay }) {
  const change = curr / prev - 1;
  const vsMeta = curr / meta;

  return (
    <div
      className="ind-hero ind-hoverable flex flex-col justify-between rounded-2xl"
      style={{
        padding: "14px 22px 16px",
        width: 330,
        background: accent
          ? "linear-gradient(140deg, rgba(70,229,255,0.10), rgba(12,26,58,0.6))"
          : "linear-gradient(158deg, rgba(21,52,138,0.38), rgba(12,26,58,0.55))",
        border: accent
          ? "1px solid rgba(70,229,255,0.28)"
          : "1px solid rgba(138,155,196,0.16)",
        boxShadow: accent ? "0 0 46px -14px rgba(70,229,255,0.5)" : "none",
      }}
    >
      <div>
        <p
          className="text-text-dim font-semibold uppercase"
          style={{ fontSize: 10, letterSpacing: "0.26em" }}
        >
          {label}
        </p>
        {note && (
          <p
            className="text-text-dim"
            style={{ fontSize: 9.5, lineHeight: 1.35, marginTop: 3 }}
          >
            {note}
          </p>
        )}

        <div className="mt-1 flex items-baseline gap-3">
          <span
            className={`font-display font-black tracking-tight ${
              accent ? "text-accent" : "text-text"
            }`}
            style={{ fontSize: 56, lineHeight: 1 }}
          >
            <CountUp value={curr} duration={2.2} delay={delay} />
          </span>
          <span
            className="flex items-center gap-1.5 font-semibold"
            style={{ fontSize: 14, color: change >= 0 ? POS : NEG }}
          >
            <Trend up={change >= 0} />
            {pct1(Math.abs(change))}
          </span>
        </div>

        <p className="text-text-dim tabular" style={{ fontSize: 11, marginTop: 2 }}>
          {num(prev)} en {prevLabel}
        </p>
      </div>

      <div className="mt-2.5">
        <div
          className="relative w-full overflow-hidden rounded-full"
          style={{ height: 9, background: "rgba(138,155,196,0.16)" }}
        >
          <div
            className="ind-hero-fill h-full rounded-full"
            style={{
              width: `${Math.min(vsMeta, 1) * 100}%`,
              transformOrigin: "left center",
              background: accent
                ? "linear-gradient(90deg, var(--color-blue-500), var(--color-accent))"
                : "linear-gradient(90deg, var(--color-blue-700), var(--color-blue-500))",
            }}
          />
        </div>
        <div
          className="mt-1.5 flex items-baseline justify-between tabular"
          style={{ fontSize: 11 }}
        >
          <span className="text-text font-semibold">
            {pct1(vsMeta)} de la meta
          </span>
          <span className="text-text-dim">{num(meta)}</span>
        </div>
      </div>
    </div>
  );
}

export default function SlideIndicadores({ slide }) {
  const rows = slide.rows ?? [];
  const total = slide.total;

  /**
   * Total ajustado: el total del Excel menos las filas excluidas. Se resta
   * (en vez de sumar el resto) para que herede exactamente lo que ese total
   * contenga, sea lo que sea.
   */
  const alt = slide.totalExcluding;
  const excluded = alt
    ? rows.filter((r) => alt.exclude.includes(r.name))
    : [];
  const altTotal = alt
    ? ["prev", "curr", "meta"].reduce(
        (acc, k) => ({
          ...acc,
          [k]: excluded.reduce((sum, r) => sum - (r[k] ?? 0), total[k]),
        }),
        {}
      )
    : null;

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(
        ".sh-title",
        { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 },
        "-=0.2"
      )
      // clearProps: al terminar la entrada, GSAP deja un transform inline que
      // le ganaría al scale del hover (:hover está en hoja de estilo). Se
      // limpia para devolverle el control al CSS.
      .from(
        ".ind-hero",
        {
          opacity: 0,
          x: 30,
          duration: 0.7,
          stagger: 0.1,
          clearProps: "transform",
        },
        "-=0.4"
      )
      .from(
        ".ind-hero-fill",
        { scaleX: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.3"
      )
      .from(
        ".ind-card",
        {
          opacity: 0,
          y: 26,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.75"
      )
      .from(
        ".ind-bar",
        { scaleX: 0, duration: 0.8, stagger: 0.04, ease: "power3.out" },
        "-=0.35"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-4 py-1">
      {/* encabezado + totales, en la misma banda para ganar altura abajo */}
      <div className="flex items-center justify-between gap-8">
        <SlideHeading kicker={slide.kicker} title={slide.title} />

        {/* el total completo va a la derecha: la lectura izquierda→derecha
            termina en el panel con acento, que es el dato principal */}
        <div className="flex items-stretch gap-4">
          {altTotal && (
            <TotalPanel
              label={alt.label}
              note={`sin ${excluded.map((r) => r.name).join(" ni ")}`}
              prev={altTotal.prev}
              curr={altTotal.curr}
              meta={altTotal.meta}
              prevLabel={slide.prevLabel}
              delay={0.3}
            />
          )}

          <TotalPanel
            label={`Total ${slide.currLabel}`}
            /* la nota va en ambos paneles para que las cifras queden a la
               misma altura y el contraste entre los dos totales sea explícito */
            note="todos los indicadores"
            prev={total.prev}
            curr={total.curr}
            meta={total.meta}
            prevLabel={slide.prevLabel}
            accent
            delay={0.42}
          />
        </div>
      </div>

      {/* rejilla de indicadores */}
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-4">
        {rows.map((row, i) => (
          <IndicadorCard
            key={row.name}
            row={row}
            prevLabel={slide.prevLabel}
            currLabel={slide.currLabel}
            delay={0.35 + i * 0.07}
          />
        ))}
      </div>
    </div>
  );
}
