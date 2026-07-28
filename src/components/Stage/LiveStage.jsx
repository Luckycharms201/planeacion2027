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
 * Transición: crossfade entre slides — la saliente se desvanece (xfade-out)
 * mientras la entrante aparece con su propia animación de entrada (GSAP). El
 * chrome (barras superior/inferior) se actualiza al instante, no cruza.
 */
export default function LiveStage({ slide, liveN, total, isFullscreen }) {
  // capas activas: normalmente 1; durante la transición, [saliente, entrante].
  const [layers, setLayers] = useState(() => (slide ? [slide] : []));
  const topIdRef = useRef(slide?.id);

  useEffect(() => {
    if (!slide || slide.id === topIdRef.current) return;
    topIdRef.current = slide.id;
    setLayers((cur) => {
      const last = cur[cur.length - 1];
      return last ? [last, slide] : [slide];
    });
    const t = setTimeout(() => setLayers([slide]), 450);
    return () => clearTimeout(t);
  }, [slide]);

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

      {/* contenido de la slide — capas superpuestas para el crossfade */}
      <div className="relative min-h-0 flex-1">
        {layers.map((ly, i) => {
          const SlideComponent = SLIDE_COMPONENTS[ly.type] ?? SlideGeneric;
          const isTop = i === layers.length - 1;
          return (
            <div
              key={ly.id}
              className={[
                "absolute inset-0 flex items-center justify-center px-10 py-6",
                isTop ? "" : "xfade-out",
              ].join(" ")}
            >
              <SlideComponent slide={ly} />
            </div>
          );
        })}
      </div>

      {/* barra de progreso segmentada */}
      <div className="flex flex-col gap-2.5 px-10 pb-6">
        <LiveProgressBar liveN={liveN} />
      </div>
    </div>
  );
}
