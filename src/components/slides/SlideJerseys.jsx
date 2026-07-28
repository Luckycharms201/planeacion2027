import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";
import Placeholder from "../ui/Placeholder";
import CountUp from "../dataviz/CountUp";

/**
 * Slide · Jerseys — misma gramática que Torneos: tarjeta única con el monto
 * recaudado como héroe en acento, la numeralia debajo y el medio al costado.
 * Aquí el medio es un video vertical, así que ocupa una columna angosta y
 * alta (en Torneos la foto es horizontal y toma media tarjeta).
 */
export default function SlideJerseys({ slide }) {
  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(
        ".jer-card",
        { opacity: 0, y: 40, filter: "blur(12px)", duration: 0.8 },
        "-=0.2"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-6 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      <div className="jer-card flex min-h-0 flex-1 gap-10 rounded-2xl border border-blue-700 bg-blue-900/40 p-8">
        {/* datos */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-9">
          <div>
            <span className="text-text-dim text-xs tracking-[0.3em] uppercase">
              Recaudado
            </span>
            <div className="text-accent mt-1 text-8xl font-black leading-none">
              <CountUp value={slide.raised} prefix="$" duration={2} delay={0.4} />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {slide.stats?.map((s, i) => (
              <div key={i}>
                <div className="text-text text-6xl font-black leading-none">
                  <CountUp value={s.value} duration={1.6} delay={0.6 + i * 0.12} />
                </div>
                <span className="text-text-dim mt-2 block text-base">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* video vertical */}
        {slide.video && (
          <div className="relative min-h-0 w-[26%] shrink-0 overflow-hidden rounded-xl">
            <Placeholder
              kind="video"
              n={slide.video.n}
              note={slide.video.note}
              src={slide.video.src}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
