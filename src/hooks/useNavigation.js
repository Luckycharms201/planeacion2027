import { useCallback, useEffect, useState } from "react";
import {
  GROUPS,
  SEQUENCE,
  TOTAL_SLIDES,
  LIVE_SEQUENCE,
  LIVE_TOTAL,
  firstSlideOfGroup,
} from "../data/presentation";

/**
 * Estado central de navegación.
 *
 *  view === "hub"      → constelación de grupos; `focusedGroupIndex` marca
 *                        el nodo resaltado para navegación con teclado.
 *  view === "section"  → entras por un grupo; `currentN` es el nº global (1..N).
 *  view === "live"     → PRESENTACIÓN EN VIVO: recorrido lineal sin hub que
 *                        arranca en una portada de título; `liveN` (1..LIVE_TOTAL).
 *
 * Teclado:
 *   Hub      ← →  mueven el foco · Enter entra al grupo
 *   Sección  ← →  recorren 1..N · Esc vuelve al hub
 *   Live     ← →  recorren la presentación · Esc sale
 *   En todo momento: F alterna pantalla completa.
 */
export function useNavigation() {
  // el sitio arranca directo en la presentación (modo live), sin hub
  const [view, setView] = useState("live");
  const [currentN, setCurrentN] = useState(1);
  // ?n=<slide> permite arrancar en una slide específica (deep link / QA)
  const [liveN, setLiveN] = useState(() => {
    const n = Number(new URLSearchParams(window.location.search).get("n"));
    return Number.isInteger(n) && n >= 1 && n <= LIVE_TOTAL ? n : 1;
  });
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(
    () => !!document.fullscreenElement
  );
  // cuando una slide interactiva (ej. Journey) toma el control de las flechas,
  // el manejador global las ignora y la slide las gestiona internamente.
  const [navLock, setNavLock] = useState(false);

  const current =
    view === "live"
      ? LIVE_SEQUENCE[liveN - 1] ?? null
      : SEQUENCE[currentN - 1] ?? null;

  const enterGroup = useCallback((groupId) => {
    const first = firstSlideOfGroup(groupId);
    if (!first) return;
    setCurrentN(first.n);
    setView("section");
  }, []);

  const enterFocusedGroup = useCallback(() => {
    const group = GROUPS[focusedGroupIndex];
    if (group) enterGroup(group.id);
  }, [focusedGroupIndex, enterGroup]);

  const goToHub = useCallback(() => {
    // al volver, deja el foco sobre el grupo que estábamos viendo
    const cur = SEQUENCE[currentN - 1];
    if (cur) setFocusedGroupIndex(cur.groupIndex);
    setView("hub");
  }, [currentN]);

  // arranca la presentación en vivo desde la portada de título.
  const startLive = useCallback(() => {
    setLiveN(1);
    setView("live");
  }, []);

  const exitLive = useCallback(() => {
    setView("hub");
  }, []);

  // salto directo a una slide del modo live (click en la barra de progreso).
  const goToLive = useCallback((n) => {
    const clamped = Math.min(Math.max(Math.round(n), 1), LIVE_TOTAL);
    setLiveN(clamped);
    setView("live");
  }, []);

  // navegación circular: tras la última slide vuelve a la primera y viceversa.
  const next = useCallback(() => {
    if (view === "live") {
      setLiveN((n) => (n % LIVE_TOTAL) + 1);
    } else {
      setCurrentN((n) => (n % TOTAL_SLIDES) + 1);
    }
  }, [view]);

  const prev = useCallback(() => {
    if (view === "live") {
      setLiveN((n) => ((n - 2 + LIVE_TOTAL) % LIVE_TOTAL) + 1);
    } else {
      setCurrentN((n) => ((n - 2 + TOTAL_SLIDES) % TOTAL_SLIDES) + 1);
    }
  }, [view]);

  const focusNextGroup = useCallback(() => {
    setFocusedGroupIndex((i) => (i + 1) % GROUPS.length);
  }, []);

  const focusPrevGroup = useCallback(() => {
    setFocusedGroupIndex((i) => (i - 1 + GROUPS.length) % GROUPS.length);
  }, []);

  // pantalla completa (tecla F) — útil sobre todo al presentar en vivo.
  const toggleFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      // F → pantalla completa, en cualquier vista
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      if (view === "hub") {
        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            focusNextGroup();
            break;
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            focusPrevGroup();
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            enterFocusedGroup();
            break;
          default:
            break;
        }
        return;
      }

      // view === "section" | "live": recorrido lineal con flechas.
      // Si una slide interactiva tomó el control (navLock), no avanzamos:
      // sólo dejamos pasar Escape para salir.
      // Teclas de avance/retroceso, incluyendo las que mandan los clickers de
      // presentación (la mayoría usa PageDown/PageUp; algunos Enter/flechas).
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "ArrowDown":
        case "Enter":
          if (navLock) break;
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
        case "ArrowUp":
        case "Backspace":
          if (navLock) break;
          e.preventDefault();
          prev();
          break;
        case "Escape":
          // sin hub: en live, Escape no hace nada (el navegador maneja salir
          // de pantalla completa). En sección (legado) vuelve al hub.
          if (view === "section") {
            e.preventDefault();
            goToHub();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    view,
    next,
    prev,
    goToHub,
    exitLive,
    enterFocusedGroup,
    focusNextGroup,
    focusPrevGroup,
    toggleFullscreen,
    navLock,
  ]);

  return {
    view,
    current,
    currentN,
    liveN,
    total: TOTAL_SLIDES,
    liveTotal: LIVE_TOTAL,
    isFullscreen,
    focusedGroupIndex,
    enterGroup,
    goToHub,
    startLive,
    exitLive,
    goToLive,
    next,
    prev,
    toggleFullscreen,
    setFocusedGroupIndex,
    navLock,
    setNavLock,
  };
}
