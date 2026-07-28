import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide de aprendizajes (lista editorial de una línea por punto). A diferencia
 * de `retos`, cada punto es un enunciado suelto —sin frase guía + descripción—,
 * así que se marca con viñeta de acento en vez de índice numerado.
 */
export default function SlideAprendizajes({ slide }) {
  const items = slide.items ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(
        ".sh-title",
        { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 },
        "-=0.2"
      )
      .from(
        ".apr-row",
        { opacity: 0, x: -28, duration: 0.55, stagger: 0.12 },
        "-=0.3"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-6 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        {items.map((text, i) => (
          <div
            key={i}
            className="apr-row flex items-center gap-5 rounded-2xl border border-blue-700 bg-blue-900/40 px-7 py-5"
          >
            <span className="bg-accent mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" />
            <p className="text-text min-w-0 text-xl font-semibold leading-snug">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
