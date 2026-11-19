import { useEffect, useRef, useState } from "react";
import { ArrowDown, CheckCheck, MessageCircle, Pause, Play, Sparkles, Volume2, VolumeX } from "lucide-react";

const chapters = [
  {
    step: "01",
    title: "Una conversación que empieza sola",
    text: "El asistente responde al instante, conoce los planes y descubre qué necesita cada cliente.",
  },
  {
    step: "02",
    title: "Recomienda el plan ideal",
    text: "Convierte preguntas en una propuesta clara, personalizada y lista para decidir.",
  },
  {
    step: "03",
    title: "De interesado a inscripción",
    text: "Confirma la visita y mantiene el seguimiento dentro de WhatsApp, sin trabajo manual.",
  },
];

export function VideoShowcase({ src, poster }: { src: string; poster?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reducedMotion) return;

    let cancelled = false;
    let dispose = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const captions = gsap.utils.toArray<HTMLElement>(".story-caption");
          const outro = section.querySelector<HTMLElement>(".cinema-outro");
          gsap.set(captions, { autoAlpha: 0, y: 24 });
          gsap.set(outro, { autoAlpha: 0, y: 20 });
          gsap.set(".video-chrome", { autoAlpha: 0 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.65,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) return;
                if (!video.paused) video.pause();
                const target = Math.min(Math.max(0, video.duration - 0.05), progress * video.duration);
                if (Math.abs(video.currentTime - target) > 0.035) video.currentTime = target;
              },
            },
          });

          timeline
            .fromTo(
              ".video-shell",
              { scale: 0.78, borderRadius: "2rem" },
              { scale: 1, borderRadius: "0.75rem", duration: 0.3 },
              0,
            )
            .fromTo(
              ".demo-video",
              { filter: "blur(8px) brightness(0.25)", scale: 1.06 },
              { filter: "blur(0px) brightness(1)", scale: 1, duration: 0.24 },
              0,
            )
            .to(".cinema-intro", { autoAlpha: 0, y: -48, duration: 0.16 }, 0.03)
            .to(".video-chrome", { autoAlpha: 1, duration: 0.08 }, 0.18);

          captions.forEach((caption, index) => {
            const start = 0.28 + index * 0.22;
            timeline.to(caption, { autoAlpha: 1, y: 0, duration: 0.08 }, start);
            if (index < captions.length - 1) {
              timeline.to(caption, { autoAlpha: 0, y: -20, duration: 0.07 }, start + 0.16);
            }
          });

          const lastCaption = captions[captions.length - 1];
          if (lastCaption) timeline.to(lastCaption, { autoAlpha: 0, y: -20, duration: 0.07 }, 0.82);
          timeline.to(outro, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.88);
        }, section);

        const refresh = () => ScrollTrigger.refresh();
        if (video.readyState >= 1) refresh();
        else video.addEventListener("loadedmetadata", refresh, { once: true });
        window.addEventListener("load", refresh, { once: true });

        dispose = () => {
          video.removeEventListener("loadedmetadata", refresh);
          window.removeEventListener("load", refresh);
          context.revert();
        };
      },
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, [reducedMotion]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.ended || video.currentTime >= video.duration - 0.1) video.currentTime = 0;
      try {
        await video.play();
      } catch {
        video.controls = true;
      }
    } else {
      video.pause();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      aria-labelledby="demo-title"
      className={`video-cinema relative isolate scroll-mt-24 overflow-clip ${reducedMotion ? "py-20" : "h-[340svh]"}`}
    >
      <div
        className={
          reducedMotion
            ? "relative mx-auto flex max-w-[1440px] flex-col gap-10 px-4"
            : "sticky top-0 h-[100svh] overflow-hidden"
        }
      >
        <div className="cinema-grid pointer-events-none absolute inset-0" />
        <div className="cinema-orb pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full" />

        <div
          className={
            reducedMotion
              ? "cinema-intro relative z-10 mx-auto max-w-3xl text-center"
              : "cinema-intro pointer-events-none absolute inset-x-4 top-1/2 z-20 mx-auto max-w-4xl -translate-y-1/2 text-center"
          }
        >
          <p className="cinema-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            <Sparkles size={14} /> Ventas con IA · WhatsApp
          </p>
          <h2 id="demo-title" className="mt-6 text-4xl font-extrabold leading-[1.04] md:text-7xl">
            Tu próximo cliente,
            <span className="block text-gradient">a un mensaje de distancia.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-cinema-muted md:text-xl">
            Mira cómo un chatbot de IEC IA convierte la consulta de un gimnasio en una inscripción.
          </p>
          {!reducedMotion && (
            <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cinema-muted">
              Desliza para vivir la conversación <ArrowDown size={17} className="animate-bounce" />
            </p>
          )}
        </div>

        <div
          className={
            reducedMotion
              ? "relative w-full"
              : "absolute inset-0 flex items-center justify-center px-3 pb-16 pt-24 md:px-10 md:pb-20"
          }
        >
          <div className="video-shell shadow-cinema relative aspect-video w-full max-w-[1320px] overflow-hidden border border-cinema-border bg-cinema-surface">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              muted={muted}
              playsInline
              preload="auto"
              controls={reducedMotion}
              aria-label="Demostración de un chatbot de ventas para BatorGYM atendiendo por WhatsApp"
              className="demo-video h-full w-full object-cover"
            />
            <div className="cinema-vignette pointer-events-none absolute inset-0" />
            <div className="video-chrome cinema-chip absolute left-3 top-3 flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold md:left-5 md:top-5 md:text-xs">
              <MessageCircle size={15} /> BatorGYM · WhatsApp
              <CheckCheck size={15} className="text-primary-glow" />
            </div>
            {!reducedMotion && (
              <div className="video-chrome absolute bottom-3 right-3 flex items-center gap-2 md:bottom-5 md:right-5">
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                className="cinema-control inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold"
                aria-label={muted ? "Activar sonido" : "Silenciar video"}
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span className="hidden lg:inline">{muted ? "Sin sonido" : "Sonido"}</span>
              </button>
              <button
                type="button"
                onClick={() => void togglePlayback()}
                className="cinema-control inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold md:px-4"
                aria-label={playing ? "Pausar video" : "Reproducir video"}
              >
                {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                <span className="hidden sm:inline">{playing ? "Pausar" : "Reproducir"}</span>
              </button>
              </div>
            )}
          </div>
        </div>

        {!reducedMotion && (
          <>
            {chapters.map((chapter) => (
              <div
                key={chapter.step}
                className="story-caption cinema-caption absolute inset-x-4 bottom-40 z-20 mx-auto max-w-lg rounded-3xl p-4 opacity-0 md:inset-x-auto md:bottom-10 md:left-10 md:mx-0 md:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">{chapter.step} · Automatización</p>
                <h3 className="mt-2 text-xl font-bold md:text-2xl">{chapter.title}</h3>
                <p className="mt-2 text-sm text-cinema-muted">{chapter.text}</p>
              </div>
            ))}
            <div className="cinema-outro pointer-events-none absolute inset-x-4 bottom-40 z-20 mx-auto max-w-xl text-center opacity-0 md:bottom-8">
              <p className="font-display text-2xl font-bold md:text-4xl">Vende más. Responde siempre.</p>
              <p className="mt-2 text-sm text-cinema-muted md:text-base">Una demo de BatorGYM creada para IEC IA.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
