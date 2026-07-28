import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import { META } from "../../data/presentation";

/**
 * Portada de grupo (slides 1 y 7). Pantalla de "manifiesto":
 * tipografía enorme, mucho aire y jerarquía distinta a las de dato.
 * Entrada: logo + kicker, título palabra por palabra (blur-in stagger),
 * subrayado acento que se traza.
 */
export default function SlideCover({ slide }) {
  const words = slide.title.split(" ");

  const scope = useSlideTimeline((tl) => {
    tl.from(".cover-logo", { opacity: 0, y: -24, duration: 0.7 })
      .from(".cover-kicker", { opacity: 0, y: 12, duration: 0.6 }, "-=0.4")
      .from(
        ".cover-word",
        {
          opacity: 0,
          y: 60,
          filter: "blur(16px)",
          duration: 0.9,
          stagger: 0.14,
          ease: "power4.out",
        },
        "-=0.2"
      )
      .from(
        ".cover-rule",
        { scaleX: 0, opacity: 0, duration: 0.8, ease: "power3.inOut" },
        "-=0.5"
      );
  });

  return (
    <div
      ref={scope}
      className="flex h-full w-full flex-col items-center justify-center gap-8 text-center"
    >
      <img
        src={slide.logo ?? META.logo}
        alt={slide.logoAlt ?? slide.title}
        className="cover-logo h-12 w-auto opacity-90"
      />

      <p className="cover-kicker text-accent text-xs font-semibold tracking-[0.5em] uppercase">
        {slide.kicker}
      </p>

      <h1 className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-6xl font-black tracking-tight md:text-8xl">
        {words.map((w, i) => (
          <span key={i} className="cover-word inline-block">
            {w}
          </span>
        ))}
      </h1>

      <div
        className="cover-rule bg-accent h-[3px] w-40 origin-center rounded-full"
        style={{ boxShadow: "0 0 24px -2px var(--color-accent)" }}
      />
    </div>
  );
}
