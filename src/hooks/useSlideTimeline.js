import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Da a cada slide su propia timeline GSAP encapsulada.
 *
 *  - Se construye PAUSADA y se reproduce al montar (= al entrar a la slide).
 *  - `gsap.context` aísla los selectores al subárbol de la slide y, en el
 *    cleanup, hace `revert()` → deja el DOM limpio al salir.
 *  - Como el <Stage> monta cada slide con `key={slide.id}`, volver a una
 *    slide la re-monta y la timeline arranca limpia desde 0.
 *
 * Uso:
 *   const scope = useSlideTimeline((tl) => {
 *     tl.from(".algo", { opacity: 0, y: 40, stagger: 0.1 });
 *   });
 *   return <div ref={scope}>…</div>;
 */
export function useSlideTimeline(build) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });
      build(tl, self);
      tl.play(0);
      // escape para capturas/QA: con ?noanim la entrada salta a su estado final
      if (new URLSearchParams(window.location.search).has("noanim")) {
        tl.progress(1);
      }
      self.timeline = tl;
    }, scope);
    return () => ctx.revert();
    // build se captura al montar; cada slide se re-monta por key → ok
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scope;
}
