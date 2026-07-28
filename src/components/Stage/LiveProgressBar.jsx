import { LIVE_SEQUENCE } from "../../data/presentation";

/**
 * Barra de progreso del modo Live: un segmento por slide. Los segmentos ya
 * vistos quedan llenos, el actual se resalta con acento y los pendientes
 * quedan tenues. Un pequeño espacio separa cada cambio de área.
 *
 * Cada segmento es clickeable y salta directo a esa slide. El botón lleva
 * padding vertical transparente para que el área de click sea cómoda aunque
 * la barra visible mida 6px; al pasar el mouse el segmento crece y aparece
 * una etiqueta con el número y el título de la slide.
 */
export default function LiveProgressBar({ liveN, onSelect }) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {LIVE_SEQUENCE.map((s, i) => {
        const n = i + 1;
        const done = n < liveN;
        const active = n === liveN;
        // separa visualmente al cambiar de área
        const newArea = i > 0 && LIVE_SEQUENCE[i - 1].groupIndex !== s.groupIndex;
        const label = s.title ?? s.groupName ?? `Slide ${n}`;
        return (
          <button
            key={s.id}
            type="button"
            onClick={(e) => {
              onSelect?.(n);
              // sin foco pegado: si no, Space/Enter reactivarían este botón
              // en vez de avanzar la presentación.
              e.currentTarget.blur();
            }}
            title={`${String(n).padStart(2, "0")} · ${label}`}
            aria-label={`Ir a la slide ${n}: ${label}`}
            aria-current={active ? "true" : undefined}
            className="group relative flex-1 cursor-pointer border-0 bg-transparent p-0 py-2 focus:outline-none"
            style={{ marginLeft: newArea ? 10 : 0 }}
          >
            {/* etiqueta emergente al pasar el mouse / enfocar con teclado */}
            <span className="text-text pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-blue-700 bg-blue-900/95 px-2 py-1 text-[11px] leading-none opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
              {String(n).padStart(2, "0")} · {label}
            </span>

            <span
              className="block h-1.5 overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-y-[1.8] group-focus-visible:scale-y-[1.8]"
              style={{ background: "rgba(138,155,196,0.22)" }}
            >
              <span
                className="block h-full rounded-full transition-[width,opacity] duration-500"
                style={{
                  width: done || active ? "100%" : "0%",
                  background: active
                    ? "var(--color-accent)"
                    : "var(--color-blue-500)",
                  boxShadow: active
                    ? "0 0 14px -1px var(--color-accent)"
                    : "none",
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
