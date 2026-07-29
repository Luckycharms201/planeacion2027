/**
 * Fondo ambiental: degradados radiales sutiles que dan profundidad y acabado
 * broadcast, sin competir con el contenido.
 *
 * Dos cosas lo mantienen vivo:
 *  - las tres manchas derivan en ciclos largos (40–70 s). Nadie lo nota
 *    conscientemente; lo que se nota es que la pantalla deja de estar
 *    congelada mientras se habla sobre una slide.
 *  - el tono migra por grupo con un `hue-rotate` sobre toda la capa. Se hace
 *    girando el matiz de los colores que ya existen —y no con colores nuevos
 *    por grupo— para que sea imposible salirse de la paleta.
 */

/** Giro de matiz por grupo, en grados. Rango corto a propósito: lo justo
 *  para que cada capítulo tenga temperatura propia sin dejar de ser el azul
 *  EXATEC. Negativo tira a teal, positivo a violeta. */
const GROUP_HUE = {
  regreso: 0,
  agrupaciones: 18,
  lideres: -20,
  aprendizajes: 8,
  proyectos: -10,
  calendario: 0,
};

export default function AmbientBackground({ groupId }) {
  const hue = GROUP_HUE[groupId] ?? 0;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        filter: `hue-rotate(${hue}deg)`,
        transition: "filter 1.4s ease",
      }}
    >
      <div
        className="ambient-drift-a absolute -top-1/4 -left-1/4 h-[80%] w-[60%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-blue-700) 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-drift-b absolute right-0 -bottom-1/3 h-[70%] w-[55%] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-blue-500) 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-drift-c absolute top-1/2 left-1/2 h-[40%] w-[40%] rounded-full opacity-[0.07] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      <div className="ambient-grain absolute inset-0" />
    </div>
  );
}
