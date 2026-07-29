import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Día EXATEC — planteamiento del evento y sus cuatro pilares.
 *
 * El texto de intro va a la izquierda como manifiesto; los pilares, a la
 * derecha, cada uno como una tarjeta con su verbo en grande y las palabras
 * clave que lo aterrizan. Al pasar el mouse la tarjeta se eleva con halo,
 * igual que en Indicadores y Prioridades.
 */
export default function SlideDiaExatec({ slide }) {
  const pilares = slide.pilares ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(".dia-intro", { opacity: 0, y: 18, duration: 0.6 }, "-=0.3")
      .from(
        ".dia-pilar",
        { opacity: 0, y: 30, filter: "blur(10px)", duration: 0.6, stagger: 0.12 },
        "-=0.35"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-5 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-10">
        {/* planteamiento */}
        <div className="dia-intro">
          <span className="text-accent text-[11px] font-semibold tracking-[0.35em] uppercase">
            El evento
          </span>
          <p className="text-text mt-4 text-lg leading-relaxed">
            {slide.intro}
          </p>
        </div>

        {/* pilares */}
        <div>
          <span className="text-text-dim text-[11px] font-semibold tracking-[0.3em] uppercase">
            4 pilares principales
          </span>
          <div className="mt-4 grid grid-cols-2 gap-5">
            {pilares.map((p, i) => (
              <div
                key={i}
                className="dia-pilar group relative overflow-hidden rounded-2xl border border-blue-700 bg-blue-900/40 px-6 py-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-[0_0_30px_-10px_var(--color-accent)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                  }}
                />
                <h3 className="text-text text-3xl font-extrabold tracking-tight">
                  {p.verbo}
                </h3>
                <p className="text-accent mt-2 text-[15px] leading-snug font-semibold">
                  {p.claves.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
