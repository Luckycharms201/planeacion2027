import { useSlideTimeline } from "../../hooks/useSlideTimeline";

/**
 * Slide · Prioridades e Iniciativas del Área — pantalla-manifiesto.
 *
 * Concepto: "crear vinculaciones con propósito" se dibuja literalmente:
 * un hilo de luz recorre la pantalla y enciende tres nodos; de cada nodo
 * nace un pilar. La entrada es coreografiada (título → subtítulo con
 * gradiente → el hilo se tiende → los nodos pulsan → los pilares suben
 * → su contenido cae en cascada). Al pasar el mouse cada pilar se eleva
 * con un halo de acento, como en Indicadores.
 *
 * Cada pilar: numeral gigante de fondo (watermark), etiqueta "Prioridad
 * 0N", el enunciado en negritas y su desglose — el pilar 1 mapea
 * aniversario → enfoque con chips de acento; los otros dos listan
 * audiencias/frentes con marcadores de diamante.
 */
export default function SlidePrioridades({ slide }) {
  const pillars = slide.pillars ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".pri-title", { opacity: 0, y: 26, filter: "blur(10px)", duration: 0.7 })
      .from(".pri-sub", { opacity: 0, y: 16, duration: 0.55 }, "-=0.35")
      .from(
        ".pri-linea",
        { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power2.inOut" },
        "-=0.15"
      )
      .from(
        ".pri-nodo",
        { scale: 0, opacity: 0, duration: 0.45, stagger: 0.18, ease: "back.out(2.5)" },
        "-=0.75"
      )
      .from(
        ".pri-card",
        { opacity: 0, y: 46, filter: "blur(12px)", duration: 0.75, stagger: 0.16 },
        "-=0.35"
      )
      .from(
        ".pri-item",
        { opacity: 0, x: -16, duration: 0.4, stagger: 0.045 },
        "-=0.45"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-3 py-1">
      {/* encabezado: título + subtítulo-tesis con gradiente de acento */}
      <div>
        <h2 className="pri-title text-text font-display text-4xl font-extrabold tracking-tight">
          {slide.title}
        </h2>
        <p
          className="pri-sub mt-1.5 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-accent) 0%, var(--color-blue-500) 70%)",
          }}
        >
          {slide.subtitle}
        </p>
      </div>

      {/* el hilo de vinculación: línea + un nodo por pilar */}
      <div className="relative h-6 shrink-0" aria-hidden="true">
        <div
          className="pri-linea absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-accent) 12%, var(--color-blue-500) 50%, var(--color-accent) 88%, transparent 100%)",
            opacity: 0.55,
          }}
        />
        {/* misma retícula que los pilares → cada nodo cae exactamente al
            centro de su tarjeta */}
        <div className="grid h-full grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <span key={n} className="flex items-center justify-center">
              <span className="pri-nodo relative">
                <span
                  className="bg-accent block h-3 w-3 rounded-full"
                  style={{ boxShadow: "0 0 18px 2px var(--color-accent)" }}
                />
                <span className="border-accent/30 absolute -inset-2 rounded-full border" />
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* los tres pilares */}
      <div className="grid min-h-0 flex-1 grid-cols-3 items-stretch gap-6">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="pri-card group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-blue-700 bg-blue-900/40 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-accent)] hover:shadow-[0_0_34px_-10px_var(--color-accent)]"
          >
            {/* filo de luz superior */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
              }}
            />
            {/* numeral gigante de fondo */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -right-1 text-[5.5rem] leading-none font-black text-blue-500/10 select-none"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Objetivo Estratégico */}
            <div>
              <span className="text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
                Objetivo Estratégico {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-text relative z-10 mt-1.5 text-[15px] leading-snug font-bold">
                {p.objetivo}
              </p>
            </div>

            {/* Prioridad */}
            <div className="border-t border-blue-700/70 pt-3">
              <span className="text-text-dim text-[10px] font-semibold tracking-[0.25em] uppercase">
                Prioridad
              </span>
              <p className="text-text mt-1.5 text-[13px] leading-snug">
                {p.prioridad}
              </p>
            </div>

            {/* Iniciativas */}
            <div className="flex min-h-0 flex-col border-t border-blue-700/70 pt-3">
              <span className="text-accent text-[10px] font-semibold tracking-[0.25em] uppercase">
                Iniciativas
              </span>
              <p className="text-text mt-1.5 text-[13px] leading-snug font-semibold">
                {p.iniciativa}
              </p>

              <div className="mt-2.5 flex flex-col gap-2">
                {/* mapa aniversario → enfoque */}
                {p.map?.map((m, mi) => (
                  <div key={mi} className="pri-item border-l-2 border-blue-700 pl-3">
                    <span className="bg-accent/10 text-accent border-accent/40 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide">
                      {m.tag}
                    </span>
                    <p className="text-text-dim mt-0.5 text-[12.5px] leading-snug">
                      {m.focus}
                    </p>
                  </div>
                ))}

                {/* lista simple */}
                {p.items?.map((it, ii) => (
                  <div key={ii} className="pri-item flex items-center gap-2.5">
                    <span className="bg-accent h-1.5 w-1.5 shrink-0 rotate-45" />
                    <span className="text-text text-[13px] font-semibold leading-snug">
                      {it}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
