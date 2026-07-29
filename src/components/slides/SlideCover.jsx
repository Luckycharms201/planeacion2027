import { useId } from "react";
import gsap from "gsap";
import { useSlideTimeline } from "../../hooks/useSlideTimeline";
import { META } from "../../data/presentation";

/**
 * Portada de grupo — cortinilla de capítulo.
 *
 * Pantalla de "manifiesto": tipografía enorme, mucho aire y jerarquía
 * distinta a las de dato. Detrás va el número de capítulo en contorno, a
 * tamaño de marca de agua: es lo que convierte la portada en un separador
 * editorial y no en una slide más.
 *
 * Entrada: número, logo + kicker, título palabra por palabra (blur-in
 * stagger), subrayado acento que se traza y un barrido de luz que cruza.
 */

/** Hueco del corte a negro con el que LiveStage entra a las portadas
 *  (`xcut-in`, 40% de 0.62 s). La entrada arranca después para no gastarse
 *  a ciegas. */
const CUT_GAP = 0.25;

export default function SlideCover({ slide }) {
  const words = slide.title.split(" ");
  const chapter =
    Number.isInteger(slide.groupIndex) && slide.groupIndex >= 0
      ? String(slide.groupIndex + 1).padStart(2, "0")
      : null;
  // id propio por instancia: durante la transición hay dos portadas montadas
  // a la vez y un id fijo se duplicaría. `useId` trae `:`, ilegal dentro de
  // un `url(#…)` sin comillas.
  const outlineId = `cover-num-${useId().replace(/:/g, "")}`;

  const scope = useSlideTimeline((tl) => {
    // sin `filter` en este tween: la clave del contorno es un `filter:
    // url(…)` sobre el número, y GSAP lo pisaría al animar la propiedad
    tl.from(
      ".cover-num",
      {
        opacity: 0,
        scale: 1.2,
        duration: 1.5,
        ease: "power3.out",
      },
      CUT_GAP
    )
      .from(".cover-logo", { opacity: 0, y: -24, duration: 0.7 }, CUT_GAP + 0.1)
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
      )
      // barrido de luz: cruza una sola vez, cuando aterriza el título
      .fromTo(
        ".cover-sweep",
        { xPercent: -260 },
        { xPercent: 360, duration: 1.3, ease: "power2.inOut" },
        CUT_GAP + 0.7
      );

    // Deriva continua del número. La portada es la slide que más rato se
    // queda quieta en pantalla mientras se habla, así que no debe congelarse
    // del todo. Va fuera de la timeline porque un `repeat: -1` la volvería
    // infinita y rompería `?noanim`.
    gsap.to(".cover-num", {
      scale: 1.05,
      duration: 9,
      delay: 2.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <div
      ref={scope}
      className="relative isolate flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden text-center"
    >
      {chapter && (
        <>
          {/* El contorno se deriva de la SILUETA rasterizada, no de los
              trazos del glifo: se dilata el alfa y se le resta el original,
              lo que deja un anillo de grosor uniforme por fuera.
              `-webkit-text-stroke` no sirve aquí — los dígitos de Montserrat
              Black se dibujan con subtrazos que se traslapan, y al calcarlos
              aparecían líneas sueltas dentro del propio número. */}
          <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            className="absolute"
          >
            <defs>
              <filter
                id={outlineId}
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
                colorInterpolationFilters="sRGB"
              >
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius="3"
                  result="grueso"
                />
                <feComposite
                  in="grueso"
                  in2="SourceAlpha"
                  operator="out"
                  result="anillo"
                />
                <feFlood floodColor="#2d6be0" floodOpacity="0.55" result="tinta" />
                <feComposite in="tinta" in2="anillo" operator="in" />
              </filter>
            </defs>
          </svg>

          {/* Sangra por la esquina inferior izquierda y el marco lo recorta: a
              tamaño completo y centrado competía con el título en vez de
              leerse como marca de agua. El recorte es lo que lo vuelve
              editorial. */}
          <span
            aria-hidden="true"
            className="cover-num font-display pointer-events-none absolute -z-10 leading-none font-black select-none"
            style={{
              fontSize: "44rem",
              left: "-11%",
              bottom: "-26%",
              transformOrigin: "left bottom",
              // opaco a propósito: el filtro solo usa SourceAlpha
              color: "#2d6be0",
              filter: `url(#${outlineId})`,
              // capa propia, para que la deriva en loop no obligue a recalcular
              // la morfología en cada frame
              willChange: "transform",
            }}
          >
            {chapter}
          </span>
        </>
      )}

      <span
        aria-hidden="true"
        className="cover-sweep pointer-events-none absolute inset-y-0 -z-10 w-[36%]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(70, 229, 255, 0.09), transparent)",
        }}
      />

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
