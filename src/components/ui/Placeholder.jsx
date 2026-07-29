/**
 * Placeholder de medio numerado — marca dónde irá una foto o video.
 * El número (#n) permite referirlo después ("la foto #2 va aquí").
 * `kind`: "image" | "video".
 *
 * Cuando ya hay activo real, se pasa `src` (y opcional `alt`) y el
 * componente muestra la foto a tamaño completo en lugar del marcador.
 */
import { useEffect, useRef } from "react";
import { kenBurns } from "./kenBurns";

export default function Placeholder({
  n,
  kind = "image",
  note,
  src,
  alt,
  className = "",
  fullscreen = false,
}) {
  const isVideo = kind === "video";
  const ken = kenBurns(isVideo ? null : src);

  // arranca el video automáticamente al entrar a la slide (se remonta por
  // slide, así que reinicia cada vez). En la presentación ya hubo gesto del
  // usuario al avanzar, por lo que reproduce con sonido; si el navegador lo
  // bloquea, quedan los controles. Si `fullscreen`, además lo lleva a pantalla
  // completa al entrar (aprovecha el gesto reciente de navegación; si el
  // navegador lo bloquea, queda reproduciendo inline).
  //
  // IMPORTANTE: solo pide pantalla completa del video si NO hay ya algo en
  // pantalla completa. Si el usuario presentó con la tecla F (toda la página en
  // fullscreen), el video ya se ve grande dentro de esa página; pedir el
  // fullscreen del <video> reemplazaría el de la página y, al cambiar de slide
  // (el video se desmonta), el navegador saldría del fullscreen por completo,
  // sacando al usuario. Por eso aquí se respeta el fullscreen existente.
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
    const alreadyFullscreen =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreen && !alreadyFullscreen) {
      const req =
        v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen;
      if (req) {
        try {
          const fp = req.call(v);
          if (fp && fp.catch) fp.catch(() => {});
        } catch {
          /* sin pantalla completa: sigue inline */
        }
      }
    }
  }, [fullscreen]);

  if (src) {
    // OJO: no fijar `relative` aquí. Tailwind ordena `.relative` después de
    // `.absolute`, así que ganaría sobre un `absolute inset-0` pasado por la
    // slide y la imagen quedaría en flujo (rompe layouts como Identidad).
    // La posición la decide quien usa el componente vía `className`.
    return (
      <div
        className={[
          "overflow-hidden rounded-xl border border-blue-700",
          className,
        ].join(" ")}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            controls
            playsInline
            preload="auto"
            className="h-full w-full bg-black object-contain"
          />
        ) : (
          <img
            src={src}
            alt={alt ?? note ?? ""}
            /* el Ken Burns vive en la imagen, no en el contenedor: quien la
               usa le pasa el layout por `className` y el contenedor ya
               recorta lo que se sale */
            className={`h-full w-full object-cover ${ken.className}`}
            style={ken.style}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={[
        "group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed",
        "border-blue-700 bg-blue-900/40 text-text-dim",
        className,
      ].join(" ")}
    >
      {/* retícula sutil de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-blue-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-blue-700) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={[
            "flex items-center justify-center rounded-full",
            isVideo
              ? "bg-accent/15 ring-accent/50 h-14 w-14 ring-1"
              : "bg-blue-500/15 ring-blue-500/40 h-11 w-11 ring-1",
          ].join(" ")}
        >
          <span className={isVideo ? "text-accent text-xl" : "text-blue-500 text-lg"}>
            {isVideo ? "▶" : "▦"}
          </span>
        </span>
        {n != null && (
          <span className="text-accent text-xs font-bold tracking-widest">
            #{n}
          </span>
        )}
        {note && <span className="max-w-[18ch] text-xs leading-tight">{note}</span>}
      </div>
    </div>
  );
}
