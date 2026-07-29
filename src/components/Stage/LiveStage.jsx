import { useEffect, useRef, useState } from "react";
import { SLIDE_COMPONENTS, SlideGeneric } from "../slides/slideRegistry";
import { META } from "../../data/presentation";
import LiveProgressBar from "./LiveProgressBar";

/**
 * Escenario del MODO LIVE (presentar en vivo).
 *
 * Recorrido lineal 1→N sin volver al hub. Chrome propio y minimal:
 * barra de progreso segmentada (avance por slide), contador y pista de
 * teclado. La portada de arranque (`liveIntro`) es la primera slide.
 *
 * Transición: dos capas superpuestas. La saliente se desvanece mientras la
 * entrante aparece con su propia animación de entrada (GSAP). El chrome
 * (barras superior/inferior) se actualiza al instante, no cruza.
 *
 * Hay dos sabores, y cuál se usa lo decide la slide ENTRANTE:
 *  - normal: crossfade con un desplazamiento de 32 px en el sentido de la
 *    flecha (`--xdir`), para que se sienta un recorrido y no un parpadeo.
 *  - portada de grupo: corte a negro, un respiro que marca capítulo.
 */
const isCover = (type) => type === "cover" || type === "liveIntro";

export default function LiveStage({
  slide,
  liveN,
  total,
  isFullscreen,
  onSelectSlide,
}) {
  // capas activas: normalmente 1; durante la transición, [saliente, entrante].
  const [layers, setLayers] = useState(() => (slide ? [slide] : []));
  const topIdRef = useRef(slide?.id);
  // sentido del último salto, para que el desplazamiento acompañe a la flecha
  const prevNRef = useRef(liveN);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (!slide || slide.id === topIdRef.current) return;
    topIdRef.current = slide.id;
    setDir(liveN >= prevNRef.current ? 1 : -1);
    prevNRef.current = liveN;
    setLayers((cur) => {
      const last = cur[cur.length - 1];
      return last ? [last, slide] : [slide];
    });
    // 640 ms cubre la más larga de las dos entradas (xcut-in, 620 ms): si se
    // soltara antes, quitar la clase cortaría la animación a media curva
    const t = setTimeout(() => setLayers([slide]), 640);
    return () => clearTimeout(t);
  }, [slide, liveN]);

  if (!slide) return null;
  const isIntro = slide.type === "liveIntro";
  const isBookend = isIntro || slide.type === "equipo";

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* barra superior: área + contador */}
      <div className="flex items-center justify-between px-10 pt-7">
        <span className="text-text-dim text-xs tracking-[0.25em] uppercase">
          {isBookend ? META.title : slide.groupName}
        </span>
        <span className="text-text-dim tabular text-xs tracking-[0.25em] uppercase">
          {String(liveN).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* contenido de la slide — capas superpuestas para el crossfade.
          overflow-hidden: ninguna slide puede pintarse fuera de su área
          (p.ej. durante la animación de entrada) ni encimarse a las barras. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {layers.map((ly, i) => {
          const SlideComponent = SLIDE_COMPONENTS[ly.type] ?? SlideGeneric;
          const isTop = i === layers.length - 1;
          // el sabor de la transición lo manda la entrante, así que la capa
          // saliente también consulta el tipo de la de arriba
          const cut = isCover(layers[layers.length - 1].type);
          // en la carga inicial no hay transición: una sola capa, sin animar
          const anim =
            layers.length < 2
              ? ""
              : isTop
                ? cut
                  ? "xcut-in"
                  : "xslide-in"
                : cut
                  ? "xcut-out"
                  : "xslide-out";
          return (
            <div
              key={ly.id}
              style={{ "--xdir": dir }}
              className={[
                "absolute inset-0 flex items-center justify-center px-10 py-6",
                anim,
              ].join(" ")}
            >
              <SlideComponent slide={ly} />
            </div>
          );
        })}
      </div>

      {/* barra de progreso segmentada */}
      <div className="flex shrink-0 flex-col gap-2.5 px-10 pt-5 pb-6">
        <LiveProgressBar liveN={liveN} onSelect={onSelectSlide} />
      </div>
    </div>
  );
}
