import SlideGeneric from "./SlideGeneric";
import SlideCover from "./SlideCover";
import SlideVideo from "./SlideVideo";
import SlideVideoTrio from "./SlideVideoTrio";
import SlideTours from "./SlideTours";
import SlideIdentidad from "./SlideIdentidad";
import SlideRegistro from "./SlideRegistro";
import SlideNPS from "./SlideNPS";
import SlideTalleres from "./SlideTalleres";
import SlideTorneos from "./SlideTorneos";
import SlideMonto from "./SlideMonto";
import SlideRetos from "./SlideRetos";
import SlideAgrupacionesList from "./SlideAgrupacionesList";
import SlideEmbed from "./SlideEmbed";
import SlideGafetes from "./SlideGafetes";
import SlideEquipo from "./SlideEquipo";
import SlideJourney from "./SlideJourney";
import SlideJourneyPopup from "./SlideJourneyPopup";
import SlideLiveIntro from "./SlideLiveIntro";
import SlideIndicadores from "./SlideIndicadores";

/**
 * Registro tipo → componente de slide. Fuente única para <Stage> y <LiveStage>.
 * Los tipos sin componente propio caen en el renderizador genérico.
 */
export const SLIDE_COMPONENTS = {
  cover: SlideCover,
  video: SlideVideo,
  videoTrio: SlideVideoTrio,
  tours: SlideTours,
  identidad: SlideIdentidad,
  registro: SlideRegistro,
  nps: SlideNPS,
  talleres: SlideTalleres,
  torneos: SlideTorneos,
  monto: SlideMonto,
  retos: SlideRetos,
  agrupacionesList: SlideAgrupacionesList,
  embed: SlideEmbed,
  gafetes: SlideGafetes,
  equipo: SlideEquipo,
  journey: SlideJourney,
  journeyPopup: SlideJourneyPopup,
  liveIntro: SlideLiveIntro,
  indicadores: SlideIndicadores,
};

export { SlideGeneric };
