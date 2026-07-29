import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import { kenBurns } from "../ui/kenBurns";

/**
 * Slide de cierre · Equipo. Título grande con el logo EXATEC inline en lugar de
 * la palabra, regla acento y la foto del equipo en un marco. Entrada: título +
 * regla + foto con stagger.
 */
export default function SlideEquipo({ slide }) {
  const ken = kenBurns(slide.photo);

  const scope = useSlideTimeline((tl) => {
    tl.from(".eq-title", { opacity: 0, y: 20, filter: "blur(10px)", duration: 0.8 })
      .from(
        ".eq-rule",
        { scaleX: 0, opacity: 0, duration: 0.7, ease: "power3.inOut" },
        "-=0.3"
      )
      .from(
        ".eq-photo",
        { opacity: 0, y: 40, scale: 0.95, duration: 0.9, ease: "power3.out" },
        "-=0.4"
      );
  });

  return (
    <div
      ref={scope}
      className="flex h-full w-full flex-col items-center justify-center gap-7 py-2"
    >
      <h1 className="eq-title text-text flex items-center gap-4 text-5xl font-black tracking-tight md:text-6xl">
        <span>Equipo</span>
        <img src={slide.logo} alt="EXATEC" style={{ height: "0.78em" }} className="w-auto" />
        <span>Monterrey</span>
      </h1>

      <div
        className="eq-rule bg-accent h-[3px] w-40 origin-center rounded-full"
        style={{ boxShadow: "0 0 24px -2px var(--color-accent)" }}
      />

      <div className="eq-photo overflow-hidden rounded-2xl border border-blue-700 shadow-2xl">
        <img
          src={slide.photo}
          alt={slide.photoAlt ?? slide.title}
          style={{ height: 500, width: "auto", ...ken.style }}
          className={`block ${ken.className}`}
        />
      </div>
    </div>
  );
}
