import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import SlideHeading from "../ui/SlideHeading";

/**
 * Slide · Programas de Formación EXATEC.
 *
 * Arriba, los dos objetivos del programa. Abajo, el diagrama de flujo del
 * modelo: la comunidad se segmenta por etapa de vida, cada etapa define un
 * tema prioritario y cada tema aterriza en 2 conferencias con un especialista.
 *
 * Los conectores son CSS (líneas y puntas), no imágenes: escalan con el
 * canvas y respetan la paleta.
 */

/** Conector vertical con punta de flecha. */
function Baja({ h = 38 }) {
  return (
    <span
      className="relative block w-px shrink-0 bg-blue-500/70"
      style={{ height: h }}
      aria-hidden="true"
    >
      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-blue-500" />
    </span>
  );
}

export default function SlideFormacion({ slide }) {
  const f = slide.flow ?? {};
  const etapas = f.etapas ?? [];

  const scope = useSlideTimeline((tl) => {
    tl.from(".sh-kicker", { opacity: 0, y: 12, duration: 0.5 })
      .from(".sh-title", { opacity: 0, y: 24, filter: "blur(10px)", duration: 0.7 }, "-=0.2")
      .from(".frm-obj", { opacity: 0, y: 18, duration: 0.5, stagger: 0.12 }, "-=0.3")
      .from(".frm-top", { opacity: 0, y: 14, duration: 0.45, stagger: 0.1 }, "-=0.15")
      .from(
        ".frm-col",
        { opacity: 0, y: 26, filter: "blur(8px)", duration: 0.55, stagger: 0.13 },
        "-=0.1"
      );
  });

  return (
    <div ref={scope} className="flex h-full w-full flex-col gap-4 py-1">
      <SlideHeading kicker={slide.kicker} title={slide.title} />

      {/* objetivos */}
      <div className="grid grid-cols-2 gap-4">
        {slide.objetivos?.map((o, i) => (
          <div
            key={i}
            className="frm-obj flex items-start gap-3 rounded-xl border border-blue-700 bg-blue-900/40 px-4 py-3"
          >
            <span className="bg-accent mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" />
            <p className="text-text text-[13px] leading-snug">{o}</p>
          </div>
        ))}
      </div>

      {/* diagrama de flujo */}
      <div className="flex min-h-0 flex-1 flex-col items-center">
        {/* origen */}
        <span className="frm-top text-text border-blue-700 bg-blue-900/60 rounded-full border px-6 py-2.5 text-[15px] font-bold">
          {f.origen}
        </span>
        <span className="frm-top flex flex-col items-center">
          <Baja />
        </span>

        {/* criterio de segmentación */}
        <span className="frm-top border-accent/50 bg-accent/10 text-accent rounded-full border px-6 py-2.5 text-[15px] font-bold">
          {f.criterio}
        </span>

        {/* bifurcación a las tres etapas */}
        <span className="frm-top block h-6 w-px bg-blue-500/70" aria-hidden="true" />
        <div className="frm-top relative h-9 w-full" aria-hidden="true">
          {/* tramo horizontal, de la primera a la última columna */}
          <span className="absolute top-0 right-[16.6%] left-[16.6%] h-px bg-blue-500/70" />
          {[1, 3, 5].map((n) => (
            <span
              key={n}
              className="absolute top-0"
              style={{ left: `${(n * 100) / 6}%` }}
            >
              <Baja h={34} />
            </span>
          ))}
        </div>

        {/* una columna por etapa */}
        <div className="grid w-full flex-1 grid-cols-3 gap-6">
          {etapas.map((e, i) => (
            <div key={i} className="frm-col flex flex-col items-center">
              {/* etapa */}
              <div className="w-full rounded-xl border border-blue-700 bg-blue-900/40 px-4 py-4 text-center">
                <p className="text-text text-lg leading-tight font-bold">
                  {e.name}
                </p>
                <p className="text-accent tabular mt-1.5 text-sm font-semibold">
                  {e.edad}
                </p>
              </div>

              <Baja />

              {/* tema prioritario */}
              <div className="text-text-dim w-full rounded-lg border border-dashed border-blue-700 bg-blue-900/20 px-3 py-3 text-center text-sm font-semibold">
                {f.paso1}
              </div>

              <Baja />

              {/* entregable */}
              <div className="border-accent/40 bg-accent/10 text-accent w-full rounded-lg border px-3 py-4 text-center text-[15px] leading-tight font-bold">
                {f.paso2}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
