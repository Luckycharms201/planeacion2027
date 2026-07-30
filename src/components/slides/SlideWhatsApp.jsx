import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Canal Oficial EXATEC en WhatsApp.
 *
 * Estructura editorial: el reto (por qué correo y redes no bastan) y la
 * propuesta, a la izquierda; a la derecha, una maqueta del canal que hace
 * evidente lo unidireccional (solo publica el administrador). Abajo, las
 * reglas de operación, que son el argumento institucional del proyecto.
 *
 * La maqueta es CSS puro —no imagen— para que escale con el canvas y use
 * la paleta de la presentación.
 */

/** Maqueta del canal: cabecera + publicaciones + aviso de solo lectura. */
function CanalMock({ mock }) {
  const posts = mock?.posts ?? [];

  return (
    <div className="wa-phone relative flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-blue-700 bg-blue-900/50">
      {/* cabecera del canal */}
      <div className="flex shrink-0 items-center gap-3 border-b border-blue-700 bg-blue-900/80 px-4 py-3">
        <span className="bg-accent/15 ring-accent/50 text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ring-1">
          EX
        </span>
        <div className="min-w-0">
          <p className="text-text truncate text-[13px] leading-tight font-bold">
            {mock?.nombre}
          </p>
          <p className="text-text-dim text-[11px] leading-tight">
            {mock?.suscriptores}
          </p>
        </div>
        <span className="text-accent border-accent/40 bg-accent/10 ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] uppercase">
          Canal
        </span>
      </div>

      {/* publicaciones: todas del canal, ninguna del suscriptor */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2.5 px-3 py-3">
        {posts.map((p, i) => (
          <div
            key={i}
            className="wa-post border-blue-700 bg-blue-900 rounded-2xl rounded-bl-md border px-3.5 py-2.5"
          >
            <p className="text-text text-[12px] leading-snug">{p.text}</p>
            {p.cta && (
              <p className="text-accent mt-1.5 text-[11px] font-semibold underline decoration-dotted underline-offset-2">
                {p.cta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* barra inferior: en un canal el suscriptor no escribe */}
      <div className="text-text-dim shrink-0 border-t border-blue-700 bg-blue-900/80 px-4 py-2.5 text-center text-[11px] leading-tight">
        {mock?.footer}
      </div>
    </div>
  );
}

export default function SlideWhatsApp({ slide }) {
  const reglas = slide.reglas?.items ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(
        ".sh-title",
        { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 },
        "-=0.2"
      )
      .from(".wa-bajada", { opacity: 0, y: 14, duration: 0.5 }, "-=0.35")
      .from(
        ".wa-bloque",
        { opacity: 0, y: 20, duration: 0.55, stagger: 0.16 },
        "-=0.25"
      )
      .from(
        ".wa-phone",
        { opacity: 0, y: 34, filter: "blur(10px)", duration: 0.7 },
        "-=0.5"
      )
      .from(
        ".wa-post",
        { opacity: 0, y: 16, scale: 0.92, transformOrigin: "bottom left", duration: 0.45, ease: "back.out(1.6)", stagger: 0.16 },
        "-=0.3"
      )
      .from(
        ".wa-regla",
        { opacity: 0, y: 24, duration: 0.5, stagger: 0.12 },
        "-=0.35"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-5 py-2">
      <div>
        <SlideHeading kicker={slide.kicker} title={slide.title} />
        {slide.subtitle && (
          <p className="wa-bajada text-text-dim mt-2.5 max-w-[80ch] text-[15px] leading-snug">
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* reto + propuesta | maqueta del canal */}
      <div className="grid min-h-0 flex-1 grid-cols-[1.55fr_0.45fr] items-stretch gap-9">
        <div className="flex flex-col justify-center gap-5">
          {/* el reto */}
          <div className="wa-bloque">
            <span className="text-text-dim text-[11px] font-semibold tracking-[0.3em] uppercase">
              {slide.reto?.label}
            </span>
            <p className="text-text mt-2 text-[15px] leading-relaxed">
              {slide.reto?.body}
            </p>
          </div>

          {/* la propuesta */}
          <div className="wa-bloque border-t border-blue-700/70 pt-5">
            <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase">
              {slide.propuesta?.label}
            </span>
            <p className="text-text mt-2 text-[15px] leading-relaxed font-bold">
              {slide.propuesta?.body}
            </p>
          </div>
        </div>

        <CanalMock mock={slide.mock} />
      </div>

      {/* reglas de operación */}
      <div className="shrink-0">
        <div className="flex items-baseline gap-3">
          <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase">
            {slide.reglas?.label}
          </span>
          {slide.reglas?.note && (
            <span className="text-text-dim text-[12px] leading-none">
              {slide.reglas.note}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-4">
          {reglas.map((r, i) => (
            <div
              key={i}
              className="wa-regla rounded-2xl border border-blue-700 bg-blue-900/40 px-5 py-4"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-accent tabular shrink-0 text-base leading-none font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-text text-[15px] leading-tight font-bold">
                  {r.lead}
                </h3>
              </div>
              <p className="text-text-dim mt-2 text-[13px] leading-snug">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
