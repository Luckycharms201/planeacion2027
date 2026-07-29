import { useEffect, useState } from "react";
import { useNavigation } from "./hooks/useNavigation";
import { NavContext } from "./hooks/navContext";
import { LIVE_SEQUENCE } from "./data/presentation";
import LiveStage from "./components/Stage/LiveStage";
import FitStage from "./components/Stage/FitStage";
import AmbientBackground from "./components/ui/AmbientBackground";
import DataLab from "./components/dev/DataLab";

// Todos los videos de la presentación (rutas /media/*.mp4 dentro de los datos).
const VIDEO_SRCS = Array.from(
  new Set(JSON.stringify(LIVE_SEQUENCE).match(/\/media\/[^"]+\.mp4/g) ?? [])
);

export default function App() {
  // Precarga: al abrir, descarga en segundo plano todos los videos (en orden de
  // slide) para dejarlos en caché. Así se reproducen sin buffering al llegar a
  // cada slide y siguen disponibles si la conexión se cae durante la sesión.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const src of VIDEO_SRCS) {
        if (cancelled) break;
        try {
          await fetch(src, { cache: "force-cache" });
        } catch {
          /* sin red: se intentará reproducir cuando esté disponible */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ruta temporal de desarrollo: #lab muestra el laboratorio de primitivas
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = useNavigation();
  const liveSlide = LIVE_SEQUENCE[nav.liveN - 1] ?? null;

  if (hash === "#lab") {
    return (
      <main className="bg-bg-deep h-full w-full">
        <DataLab />
      </main>
    );
  }

  // El sitio arranca directo en la presentación (sin hub): la primera slide
  // es la portada del modo live.
  return (
    <NavContext.Provider value={nav}>
      <FitStage>
        <main className="bg-bg-deep absolute inset-0 overflow-hidden">
          {/* el fondo toma el tono del grupo en el que va la presentación */}
          <AmbientBackground groupId={liveSlide?.groupId} />
          <div className="absolute inset-0">
            <LiveStage
              slide={liveSlide}
              liveN={nav.liveN}
              total={nav.liveTotal}
              isFullscreen={nav.isFullscreen}
              onSelectSlide={nav.goToLive}
            />
          </div>
        </main>
      </FitStage>
    </NavContext.Provider>
  );
}
