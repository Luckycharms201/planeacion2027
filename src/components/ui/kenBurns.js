/**
 * Ken Burns — deriva rutinariamente la variante de movimiento de una foto.
 *
 * Las fotos de la presentación estaban completamente fijas: entraban con su
 * animación y ahí se quedaban los 30–60 s que dura hablar sobre la slide,
 * viéndose pegadas. Un zoom lentísimo con paneo las devuelve a la vida sin
 * robar atención.
 *
 * La variante sale de un hash del propio `src` en vez de un prop: así dos
 * fotos distintas de una misma slide nunca se mueven al unísono —que es lo
 * que delata el efecto— y no hay que tocar cada llamada.
 */

/** Recorridos definidos en index.css (.kb-0 … .kb-3). */
const VARIANTES = 4;

/** Duración de una pasada, en segundos. Debe coincidir con `.kb` en
 *  index.css. Como la animación va en `alternate`, el ciclo completo —ida y
 *  vuelta— dura el doble, y ese es el rango sobre el que se reparte la fase
 *  para desincronizar también el sentido del movimiento. */
const PASADA = 24;

/**
 * FNV-1a con avalancha final. El paso de mezcla no es adorno: con un hash
 * tipo `h * 31 + c` los bits bajos quedan dominados por los últimos
 * caracteres, y como todas las rutas terminan en ".webp" las fotos de una
 * misma slide caían en la misma variante.
 */
function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return h >>> 0;
}

/**
 * Devuelve `className` y `style` para la <img>. Son dos porque el recorrido
 * y la fase salen de bits distintos del hash: con solo cuatro recorridos,
 * dos fotos de una misma slide coincidían una de cada cuatro veces y se
 * movían en espejo. Al darle a cada una su propia fase, aunque compartan
 * recorrido nunca van sincronizadas.
 */
export function kenBurns(src) {
  if (!src) return { className: "", style: undefined };
  const h = hash32(src);
  const fase = (((h >>> 4) % 200) / 200) * PASADA * 2;
  return {
    className: `kb kb-${h % VARIANTES}`,
    style: { animationDelay: `-${fase.toFixed(2)}s` },
  };
}
