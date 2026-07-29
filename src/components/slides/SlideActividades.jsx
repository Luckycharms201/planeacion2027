import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Actividades — rejilla de actividades numeradas. Pensada para
 * listas largas (10+) que no caben legibles en una sola columna: se
 * reparten en dos columnas y cada una lleva su índice en acento.
 */
export default function SlideActividades({ slide }) {
  const items = slide.items ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(
        ".act-item",
        { opacity: 0, x: -20, duration: 0.42, stagger: 0.055 },
        "-=0.3"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-5 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-x-8 gap-y-4">
        {items.map((it, i) => {
          const texto = typeof it === "string" ? it : it.text;
          const nota = typeof it === "string" ? null : it.note;
          return (
            <div
              key={i}
              className="act-item flex items-start gap-4 rounded-xl border border-blue-700 bg-blue-900/40 px-6 py-4"
            >
              <span className="text-accent tabular shrink-0 text-2xl leading-tight font-black">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-text text-lg leading-snug font-semibold">
                  {texto}
                </p>
                {nota && (
                  <p className="text-text-dim mt-1 text-sm leading-snug">
                    {nota}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
