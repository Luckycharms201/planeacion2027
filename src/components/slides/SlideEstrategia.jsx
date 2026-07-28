import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Estrategia de Formación — dos frentes numerados, uno por columna,
 * con su desglose en viñetas. Misma gramática de tarjeta que Prioridades:
 * numeral gigante de fondo, filo de luz superior y hover con halo de acento.
 */
export default function SlideEstrategia({ slide }) {
  const blocks = slide.blocks ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(
        ".est-card",
        { opacity: 0, y: 40, filter: "blur(12px)", duration: 0.7, stagger: 0.16 },
        "-=0.25"
      )
      .from(".est-item", { opacity: 0, x: -18, duration: 0.4, stagger: 0.06 }, "-=0.4");
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-6 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="grid min-h-0 flex-1 grid-cols-2 content-center items-stretch gap-8">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="est-card group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-blue-700 bg-blue-900/40 p-9 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-accent)] hover:shadow-[0_0_34px_-10px_var(--color-accent)]"
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
              className="pointer-events-none absolute -top-4 -right-1 text-[8rem] leading-none font-black text-blue-500/10 select-none"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative z-10 flex items-baseline gap-3">
              <span className="text-accent text-3xl font-black tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-text text-3xl font-extrabold tracking-tight">
                {b.title}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {b.items?.map((it, ii) => (
                <div key={ii} className="est-item flex items-start gap-3.5">
                  <span className="bg-accent mt-[11px] h-2 w-2 shrink-0 rotate-45" />
                  <p className="text-text min-w-0 text-lg leading-snug">
                    {it}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
