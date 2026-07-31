import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// semana que arranca en lunes, como se usa en México
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/** Días del mes (month es 1-12). */
const diasDelMes = (year, month) => new Date(year, month, 0).getDate();

/** Cuántas celdas van antes del día 1, con la semana iniciando en lunes. */
const offsetInicial = (year, month) => (new Date(year, month - 1, 1).getDay() + 6) % 7;

// máximo de "carriles" de chips apilables por semana (los eventos que se
// traslapan bajan un carril; con más de 3 en el mismo día ya no cabrían)
const MAX_CARRILES = 3;

/**
 * Slide · Calendario interactivo, con la retícula al estilo de la app
 * Calendario de Apple: cuadrícula continua de líneas finas, número del día
 * arriba a la derecha, días de los meses vecinos atenuados y cada evento como
 * un chip con su nombre — los de varios días, como una barra que abarca sus
 * columnas. Los meses son botones en la parte superior.
 *
 * Datos que espera la slide:
 *   year: 2026
 *   months: [8, 9, 10, 11, 12]        → los botones, en orden
 *   events: [{ date: "2026-08-15", end: "2026-08-16", title: "…", note: "…" }]
 *
 * `end` es opcional (eventos de varios días). Las fechas van en YYYY-MM-DD y
 * se parsean a mano (no con `new Date(cadena)`) para que la zona horaria no
 * recorra el evento un día.
 */
export default function SlideCalendario({ slide }) {
  const year = slide.year ?? new Date().getFullYear();
  const months = slide.months ?? [8, 9, 10, 11, 12];
  // ?mes=<1-12> abre el calendario en ese mes (deep link de QA y de la
  // exportación a PDF, que saca una página por mes)
  const [selected, setSelected] = useState(() => {
    const m = Number(new URLSearchParams(window.location.search).get("mes"));
    return months.includes(m) ? m : months[0];
  });

  const { porDia, estrellas, lista, semanas } = useMemo(() => {
    const desdeISO = (s) => {
      const [y, m, d] = String(s ?? "").split("-").map(Number);
      return y && m && d ? new Date(y, m - 1, d) : null;
    };
    const etiqueta = (dt) =>
      `${String(dt.getDate()).padStart(2, "0")} ${MESES_CORTOS[dt.getMonth()]}`;

    const inicioMes = new Date(year, selected - 1, 1);
    const finMes = new Date(year, selected, 0);

    // eventos recortados al mes visible: {ini, fin} en número de día.
    // Los cumpleaños (star: true) no generan chip: marcan el día con una
    // estrellita junto al número y entran a la lista con estrella.
    const porDia = new Map(); // día → cuántos eventos lo tocan
    const estrellas = new Set();
    const recortados = [];
    const lista = [];
    for (const ev of slide.events ?? []) {
      const ini = desdeISO(ev.date);
      if (!ini) continue;
      const fin = desdeISO(ev.end) ?? ini;
      if (fin < inicioMes || ini > finMes) continue;

      const desde = ini < inicioMes ? inicioMes : ini;
      const hasta = fin > finMes ? finMes : fin;
      if (ev.star) {
        estrellas.add(desde.getDate());
      } else {
        for (let d = desde.getDate(); d <= hasta.getDate(); d++) {
          porDia.set(d, (porDia.get(d) ?? 0) + 1);
        }
        recortados.push({ ini: desde.getDate(), fin: hasta.getDate(), ev });
      }
      lista.push({
        ...ev,
        day: desde.getDate(),
        label:
          fin > ini ? `${etiqueta(ini)} – ${etiqueta(fin)}` : etiqueta(ini),
      });
    }
    lista.sort((a, b) => a.day - b.day);

    // retícula por semanas; los huecos se rellenan con los días del mes
    // anterior/siguiente, atenuados (como hace Apple)
    const total = diasDelMes(year, selected);
    const inicio = offsetInicial(year, selected);
    const prevTotal = diasDelMes(
      selected === 1 ? year - 1 : year,
      selected === 1 ? 12 : selected - 1
    );
    const numSemanas = Math.ceil((inicio + total) / 7);

    const semanas = [];
    for (let w = 0; w < numSemanas; w++) {
      const celdas = [];
      for (let c = 0; c < 7; c++) {
        const dia = w * 7 + c - inicio + 1;
        if (dia < 1) {
          celdas.push({ key: `p${c}`, num: prevTotal + dia, fuera: true });
        } else if (dia > total) {
          celdas.push({ key: `s${c}`, num: dia - total, fuera: true });
        } else {
          celdas.push({ key: `d${dia}`, num: dia, fuera: false, dia });
        }
      }

      // barras de evento de esta semana: recorte al renglón + carril libre
      const primero = w * 7 - inicio + 1;
      const ultimo = primero + 6;
      const barras = [];
      for (const r of recortados) {
        const s = Math.max(r.ini, primero, 1);
        const e = Math.min(r.fin, ultimo, total);
        if (s > e) continue;
        barras.push({
          s,
          e,
          ev: r.ev,
          // si continúa fuera del renglón, la barra no se redondea de ese lado
          sigueIzq: r.ini < s,
          sigueDer: r.fin > e,
        });
      }
      barras.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s));
      const carriles = [];
      for (const b of barras) {
        let l = 0;
        while (
          l < carriles.length &&
          carriles[l].some((o) => !(b.e < o.s || b.s > o.e))
        ) {
          l++;
        }
        if (l >= MAX_CARRILES) continue;
        (carriles[l] ??= []).push(b);
        b.carril = l;
        b.col = (inicio + b.s - 1) % 7; // 0-6
        b.span = b.e - b.s + 1;
      }

      semanas.push({ celdas, barras: barras.filter((b) => b.carril !== undefined) });
    }

    return { porDia, estrellas, lista, semanas };
  }, [slide.events, year, selected]);

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(
        ".sh-title",
        { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 },
        "-=0.2"
      )
      .from(".cal-mes", { opacity: 0, y: 16, duration: 0.4, stagger: 0.07 }, "-=0.3")
      .from(".cal-panel", { opacity: 0, y: 24, duration: 0.6 }, "-=0.15");
  });

  /**
   * Transición al cambiar de mes: las celdas entran barriendo en la dirección
   * del salto (a la derecha si avanzas de mes, a la izquierda si retrocedes) y
   * los eventos del costado aparecen escalonados detrás.
   *
   * No corre en el montaje inicial: de eso ya se encarga la timeline de
   * entrada de la slide, y encimarlas se vería como un doble rebote.
   */
  const mesPrevio = useRef(selected);
  const montado = useRef(false);

  useLayoutEffect(() => {
    const anterior = mesPrevio.current;
    mesPrevio.current = selected;
    if (!montado.current) {
      montado.current = true;
      return;
    }

    const dir = selected >= anterior ? 1 : -1;
    const ctx = gsap.context(() => {
      gsap.from(".cal-celda", {
        opacity: 0,
        x: 22 * dir,
        scale: 0.94,
        duration: 0.34,
        ease: "power2.out",
        stagger: { each: 0.008, from: dir > 0 ? "start" : "end" },
      });
      gsap.from(".cal-lista-item", {
        opacity: 0,
        x: 18,
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.06,
      });
    }, scope);

    return () => ctx.revert();
  }, [selected, scope]);

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-6 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      {/* selector de mes */}
      <div className="flex flex-wrap gap-3">
        {months.map((m) => {
          const activo = m === selected;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={activo}
              onClick={(e) => {
                setSelected(m);
                // sin foco pegado: Space/Enter avanzan la presentación
                e.currentTarget.blur();
              }}
              className={[
                "cal-mes cursor-pointer rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors duration-200",
                activo
                  ? "border-accent bg-accent text-bg-deep"
                  : "text-text border-blue-700 bg-blue-900/50 hover:border-blue-500 hover:bg-blue-900",
              ].join(" ")}
            >
              {MESES[m - 1]}
            </button>
          );
        })}
      </div>

      <div className="cal-panel grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* retícula del mes, estilo Apple Calendar */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-blue-700 bg-blue-900/40 p-5">
          <div className="mb-2 grid grid-cols-7">
            {DIAS.map((d) => (
              <span
                key={d}
                className="text-text-dim pr-2.5 text-right text-[10px] font-semibold tracking-[0.25em] uppercase"
              >
                {d}
              </span>
            ))}
          </div>

          {/* gap-px sobre un fondo tenue = líneas finas de la retícula */}
          <div className="border-blue-700/50 bg-blue-700/50 flex min-h-0 flex-1 flex-col gap-px overflow-hidden rounded-lg border">
            {semanas.map((sem, wi) => (
              <div key={wi} className="relative grid flex-1 grid-cols-7 gap-px">
                {sem.celdas.map((c) => (
                  <div
                    key={c.key}
                    className={[
                      "cal-celda p-1.5 text-right",
                      c.fuera ? "bg-blue-900/20" : "bg-bg-deep/70",
                    ].join(" ")}
                  >
                    {!c.fuera && estrellas.has(c.dia) && (
                      <span className="text-accent mr-1 align-middle text-[11px] leading-none">
                        ★
                      </span>
                    )}
                    <span
                      className={[
                        "tabular text-sm font-semibold leading-none",
                        c.fuera
                          ? "text-text-dim/30"
                          : porDia.has(c.dia) || estrellas.has(c.dia)
                            ? "text-text"
                            : "text-text-dim",
                      ].join(" ")}
                    >
                      {c.num}
                    </span>
                  </div>
                ))}

                {/* chips de evento: barra continua sobre las columnas del rango */}
                {sem.barras.map((b, bi) => (
                  <div
                    key={bi}
                    className="cal-celda bg-accent/20 absolute flex items-center overflow-hidden"
                    style={{
                      left: `calc(${(b.col * 100) / 7}% + 3px)`,
                      width: `calc(${(b.span * 100) / 7}% - 6px)`,
                      top: `${26 + b.carril * 19}px`,
                      height: "16px",
                      borderRadius: `${b.sigueIzq ? 0 : 4}px ${b.sigueDer ? 0 : 4}px ${b.sigueDer ? 0 : 4}px ${b.sigueIzq ? 0 : 4}px`,
                    }}
                    title={b.ev.title}
                  >
                    <span className="text-accent truncate px-1.5 text-[10px] font-semibold leading-none">
                      {b.ev.title}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* eventos del mes */}
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <span className="text-text-dim text-xs tracking-[0.3em] uppercase">
            Eventos · {MESES[selected - 1]}
          </span>

          {lista.length === 0 ? (
            <p className="text-text-dim text-sm leading-snug">
              Sin eventos cargados para este mes.
            </p>
          ) : (
            /* con muchos eventos (octubre) las tarjetas se compactan para que
               el mes completo quepa sin scroll */
            <div
              className={[
                "flex min-h-0 flex-col overflow-y-auto pr-1",
                lista.length >= 7 ? "gap-1.5" : "gap-2.5",
              ].join(" ")}
            >
              {lista.map((ev, i) => (
                <div
                  key={i}
                  className={[
                    "cal-lista-item flex rounded-xl border border-blue-700 bg-blue-900/40 px-4",
                    lista.length >= 7
                      ? "items-center gap-3 py-1.5"
                      : "items-start gap-4 py-3",
                  ].join(" ")}
                >
                  <span className="text-accent tabular shrink-0 text-sm font-black whitespace-nowrap">
                    {ev.label}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={[
                        "text-text text-sm font-bold leading-snug",
                        lista.length >= 7 ? "truncate" : "",
                      ].join(" ")}
                    >
                      {ev.star && (
                        <span className="text-accent mr-1.5">★</span>
                      )}
                      {ev.title}
                    </p>
                    {ev.note && lista.length < 7 && (
                      <p className="text-text-dim mt-0.5 text-xs leading-snug">
                        {ev.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
