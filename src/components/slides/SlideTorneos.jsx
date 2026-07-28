import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";
import Placeholder from "../ui/Placeholder";
import CountUp from "../dataviz/CountUp";

/**
 * Slide · Torneos — disciplinas (chips) + tarjeta por torneo con su monto
 * recaudado (héroe) y numeralia.
 *
 * Con varios torneos se rejilla a dos columnas y cada tarjeta apila
 * nombre → recaudado → foto → numeralia. Con uno solo (caso actual: Tochito)
 * la tarjeta ocupa todo el ancho y se abre en dos columnas —info a la
 * izquierda, foto a la derecha— con tipografía más grande para llenar la
 * página.
 */
export default function SlideTorneos({ slide }) {
  const tournaments = slide.tournaments ?? [];
  const single = tournaments.length === 1;

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(".trn-chip", { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 }, "-=0.3")
      .from(
        ".trn-card",
        { opacity: 0, y: 40, filter: "blur(12px)", duration: 0.8, stagger: 0.18 },
        "-=0.2"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-7 py-2">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      {/* disciplinas */}
      <div className="flex flex-wrap gap-3">
        {slide.disciplines?.map((d) => (
          <span
            key={d}
            className="trn-chip border-blue-700 bg-blue-900/50 text-text rounded-full border px-5 py-2 text-sm font-medium"
          >
            {d}
          </span>
        ))}
      </div>

      {/* tarjetas por torneo */}
      <div
        className={[
          "grid flex-1 grid-cols-1 items-stretch gap-8",
          single ? "" : "md:grid-cols-2",
        ].join(" ")}
      >
        {tournaments.map((t, ti) => {
          const header = (
            <div>
              <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase">
                Torneo
              </span>
              <h3
                className={[
                  "text-text mt-1 font-black",
                  single ? "text-6xl" : "text-4xl",
                ].join(" ")}
              >
                {t.name}
              </h3>
            </div>
          );

          const raised = (
            <div>
              <span className="text-text-dim text-xs tracking-[0.3em] uppercase">
                Recaudado
              </span>
              <div
                className={[
                  "text-accent mt-1 font-black leading-none",
                  single ? "text-8xl" : "text-6xl",
                ].join(" ")}
              >
                <CountUp value={t.raised} prefix="$" duration={2} delay={0.4 + ti * 0.2} />
              </div>
            </div>
          );

          const stats = (
            <div
              className={
                single
                  ? "flex flex-wrap gap-x-12 gap-y-6"
                  : "flex flex-wrap gap-x-10 gap-y-5"
              }
            >
              {t.stats?.map((s, i) => (
                <div key={i}>
                  <div
                    className={[
                      "text-text font-black leading-none",
                      single ? "text-5xl" : "text-4xl",
                    ].join(" ")}
                  >
                    <CountUp value={s.value} duration={1.6} delay={0.6 + i * 0.12} />
                  </div>
                  <span
                    className={[
                      "text-text-dim mt-1.5 block",
                      single ? "text-base" : "text-sm",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          );

          // frame de la foto del torneo (la imagen va en absoluto/object-cover
          // para recortarse sin desbordar)
          const photo = t.photo && (
            <div
              className={[
                "relative min-h-0 overflow-hidden rounded-xl",
                single ? "w-full flex-1 md:w-1/2 md:flex-none" : "w-full flex-1",
              ].join(" ")}
            >
              <Placeholder
                n={t.photo.n}
                note={t.photo.note}
                src={t.photo.src}
                alt={t.photo.alt}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          );

          return (
            <div
              key={t.name}
              className={[
                "trn-card flex rounded-2xl border border-blue-700 bg-blue-900/40",
                single
                  ? "min-h-0 flex-col gap-8 p-10 md:flex-row md:items-stretch md:gap-12"
                  : "flex-col gap-6 p-8",
              ].join(" ")}
            >
              {single ? (
                <>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-10">
                    {header}
                    {raised}
                    {stats}
                  </div>
                  {photo}
                </>
              ) : (
                <>
                  {header}
                  {raised}
                  {photo}
                  {stats}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
