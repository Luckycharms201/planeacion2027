/**
 * Coreografía de la intro de la credencial (ver `CredencialIntro.jsx` para
 * el marcado y las capas).
 *
 * El motion viene del dummy de After Effects — giro rápido que frena en
 * seco + salida hacia cámara — con tres ajustes: la inclinación se abre en
 * diagonal pero se endereza al llegar al reposo (en el dummy la tarjeta se
 * queda de canto y no se lee), el giro cierra en la cara del frente, y
 * detrás va el glow.
 *
 * Vive en su propio módulo para no mezclar exports de componente y de
 * lógica en el mismo archivo (rompe el fast refresh de Vite).
 */

/** Instante en que la tarjeta arranca hacia la cámara. */
const OUT_AT = 2.6;

/** Debe coincidir con el `filter` base de `.cred-face` en index.css. */
const SHADOW = "drop-shadow(0 25px 45px rgba(0, 0, 0, 0.55))";

/**
 * Momento en que la slide debe empezar a animar su contenido: la tarjeta ya
 * está encima de la cámara y el velo se está yendo, así que el contenido
 * aparece por detrás en vez de esperar a pantalla vacía.
 */
export const CRED_CONTENT_AT = 2.9;

/**
 * Agrega la secuencia de la credencial al principio de la timeline de la
 * slide. Todo se posiciona con tiempos absolutos (no relativos) para que el
 * contenido pueda engancharse en `CRED_CONTENT_AT` sin depender del largo
 * acumulado de la timeline.
 */
export function buildCredencialIntro(tl) {
  return (
    tl
      // — entrada: la tarjeta crece desde un punto girando 2.5 vueltas.
      //   Arranca en -900° (= cara del reverso) y cierra en 0° (frente), así
      //   que durante el giro se alcanzan a leer las dos caras.
      .fromTo(
        ".cred-tilt",
        { scale: 0.05, rotation: -46, opacity: 0 },
        { scale: 1, rotation: -7, opacity: 1, duration: 1.8, ease: "power3.out" },
        0
      )
      .fromTo(
        ".cred-card",
        { rotationY: -900 },
        { rotationY: 0, duration: 1.8, ease: "power4.out" },
        0
      )
      .fromTo(
        ".cred-glow",
        { scale: 0.25, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        0.2
      )

      // — reposo: balanceo mínimo que sostiene la sensación 3D, y un barrido
      //   especular que vende el acabado metálico de la tarjeta.
      .to(".cred-card", { rotationY: 16, duration: 0.8, ease: "sine.inOut" }, 1.8)
      .to(
        ".cred-tilt",
        { rotation: -3.5, scale: 1.03, duration: 0.8, ease: "sine.inOut" },
        1.8
      )
      .fromTo(
        ".cred-sheen",
        { xPercent: -140 },
        { xPercent: 140, duration: 0.85, ease: "power2.inOut" },
        1.8
      )
      .to(".cred-glow", { scale: 1.08, duration: 0.8, ease: "sine.inOut" }, 1.8)

      // — salida: acelera hacia la cámara hasta rebasarla. El velo se va
      //   antes de que termine el vuelo para que el contenido ya esté ahí.
      .to(".cred-tilt", { scale: 15, rotation: 0, duration: 0.7, ease: "power3.in" }, OUT_AT)
      .to(".cred-card", { rotationY: -10, duration: 0.7, ease: "power2.in" }, OUT_AT)
      .to(".cred-glow", { scale: 3.4, opacity: 0, duration: 0.55, ease: "power2.in" }, OUT_AT)
      // desenfoque de movimiento: da velocidad al vuelo y de paso disimula el
      // reventado de la foto al ampliarla tantas veces
      .fromTo(
        ".cred-face",
        { filter: SHADOW + " blur(0px)" },
        { filter: SHADOW + " blur(18px)", duration: 0.7, ease: "power2.in" },
        OUT_AT
      )
      .to(".cred-veil", { opacity: 0, duration: 0.45, ease: "power2.out" }, OUT_AT + 0.25)
      .set(".cred-stage", { autoAlpha: 0 }, OUT_AT + 0.75)
  );
}
