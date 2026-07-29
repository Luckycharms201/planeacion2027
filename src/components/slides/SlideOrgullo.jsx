import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Estrategia de Orgullo y Pertenencia.
 *
 * Misma jerarquía editorial que la slide de Prioridades (Objetivo →
 * Prioridad → Iniciativas), pero aquí el objetivo es uno solo: a la
 * izquierda el planteamiento en bloques etiquetados, a la derecha las
 * iniciativas como tarjetas con su desglose.
 */
export default function SlideOrgullo({ slide }) {
  const iniciativas = slide.iniciativas ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(".org-bloque", { opacity: 0, y: 20, duration: 0.55, stagger: 0.14 }, "-=0.3")
      .from(
        ".org-card",
        { opacity: 0, y: 32, filter: "blur(10px)", duration: 0.6, stagger: 0.15 },
        "-=0.3"
      )
      .from(".org-item", { opacity: 0, x: -16, duration: 0.4, stagger: 0.06 }, "-=0.35");
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-5 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="grid min-h-0 flex-1 grid-cols-[0.85fr_1.15fr] content-center items-start gap-10">
        {/* planteamiento */}
        <div className="flex flex-col gap-5">
          <div className="org-bloque">
            <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase">
              Objetivo
            </span>
            <p className="text-text mt-2 text-[15px] leading-relaxed font-bold">
              {slide.objetivo}
            </p>
          </div>

          <div className="org-bloque border-t border-blue-700/70 pt-5">
            <span className="text-text-dim text-[11px] font-semibold tracking-[0.3em] uppercase">
              Prioridad
            </span>
            <p className="text-text mt-2 text-[15px] leading-relaxed">
              {slide.prioridad}
            </p>
          </div>
        </div>

        {/* iniciativas */}
        <div>
          <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase">
            Iniciativas
          </span>

          <div className="mt-3 flex flex-col gap-4">
            {iniciativas.map((it, i) => (
              <div
                key={i}
                className="org-card group relative overflow-hidden rounded-2xl border border-blue-700 bg-blue-900/40 px-6 py-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-[0_0_30px_-10px_var(--color-accent)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                  }}
                />

                <div className="flex items-baseline gap-3">
                  <span className="text-accent tabular text-lg font-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-text text-lg leading-snug font-bold">
                    {it.title}
                  </h3>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {it.items?.map((b, bi) => (
                    <div key={bi} className="org-item flex items-start gap-3">
                      <span className="bg-accent mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" />
                      <p className="text-text-dim min-w-0 text-sm leading-snug">
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
