/**
 * Intro de la slide de Orgullo y Pertenencia: la credencial EXATEC entra
 * girando sobre su propio eje, se sostiene un instante legible y sale
 * volando hacia la cámara, descubriendo el contenido de la slide.
 *
 * Aquí vive solo el marcado y las capas; la coreografía está en
 * `credencialIntroTimeline.js`.
 *
 * Corre UNA sola vez, al entrar a la slide: la timeline la arma
 * `buildCredencialIntro` dentro del `useSlideTimeline` de la slide y, como
 * el Stage monta cada slide con `key={slide.id}`, volver a entrar la
 * reinicia desde 0.
 */

/** Ancho de la tarjeta en reposo (px de escenario). El alto sale del ratio
 *  real de la credencial ya recortada, 1.5657. */
const CARD_W = 620;
const CARD_H = Math.round(CARD_W / 1.5657);

export default function CredencialIntro({ front, back }) {
  return (
    <div
      aria-hidden="true"
      /* sangra el padding del Stage (px-10 py-6) para cubrir toda el área de
         contenido; el Stage ya recorta lo que se salga */
      className="cred-stage pointer-events-none absolute -inset-x-10 -inset-y-6 z-30 flex items-center justify-center"
    >
      <div className="cred-veil bg-bg-deep absolute inset-0" />

      {/* glow detrás de la credencial */}
      <div
        className="cred-glow absolute"
        style={{ width: CARD_W * 2.1, height: CARD_H * 2.6 }}
      />

      <div className="relative" style={{ perspective: 1600 }}>
        <div className="cred-tilt" style={{ width: CARD_W, height: CARD_H }}>
          <div className="cred-card relative h-full w-full">
            <div className="cred-face">
              <img
                src={front}
                alt=""
                className="h-full w-full object-fill"
                draggable="false"
              />
              <span className="cred-sheen" />
            </div>
            <div className="cred-face cred-face-back">
              <img
                src={back}
                alt=""
                className="h-full w-full object-fill"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
