import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Clock3,
  Headphones,
  Mic,
  Pause,
  Phone,
  PhoneCall,
  Play,
  Radio,
  RotateCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

const scenarios = [
  {
    id: "ventas",
    label: "Ventas",
    title: "Califica, resuelve y agenda",
    description: "El agente identifica la necesidad, responde con el contexto de tu empresa y agenda la siguiente acción.",
    caller: "Mariana · Prospecto",
    topic: "Consulta sobre automatización",
    result: "Cita agendada en el CRM",
    transcript: [
      { speaker: "agent", text: "Hola Mariana, soy el asistente de IEC IA. ¿Qué proceso te gustaría automatizar?" },
      { speaker: "caller", text: "Recibimos muchas consultas y no damos seguimiento a todas." },
      { speaker: "agent", text: "Podemos centralizar WhatsApp y llamadas, calificar cada contacto y avisar a tu equipo cuando esté listo." },
      { speaker: "caller", text: "Suena bien. ¿Podemos verlo esta semana?" },
      { speaker: "agent", text: "Claro. Tengo disponible el jueves a las 11:30. Te envío la confirmación por WhatsApp." },
    ],
  },
  {
    id: "soporte",
    label: "Soporte",
    title: "Atiende y escala con contexto",
    description: "Consulta el historial, guía al cliente y transfiere a una persona solamente cuando hace falta.",
    caller: "Diego · Cliente",
    topic: "Ayuda con una integración",
    result: "Ticket resuelto y documentado",
    transcript: [
      { speaker: "agent", text: "Hola Diego, veo tu integración con el CRM. ¿Qué está ocurriendo?" },
      { speaker: "caller", text: "Los contactos nuevos no aparecen desde esta mañana." },
      { speaker: "agent", text: "Voy a revisar la conexión. Detecté que el acceso venció; te enviaré un enlace seguro para renovarlo." },
      { speaker: "caller", text: "Listo, ya volvió a sincronizar." },
      { speaker: "agent", text: "Perfecto. Confirmo que los registros están llegando y cierro el ticket con este resumen." },
    ],
  },
  {
    id: "cobranza",
    label: "Cobranza",
    title: "Da seguimiento sin perder empatía",
    description: "Realiza recordatorios personalizados, identifica convenios y registra cada compromiso automáticamente.",
    caller: "Sofía · Cliente",
    topic: "Recordatorio de saldo",
    result: "Compromiso registrado",
    transcript: [
      { speaker: "agent", text: "Hola Sofía, te llamo para ayudarte con el saldo pendiente de tu cuenta. ¿Es buen momento?" },
      { speaker: "caller", text: "Sí, esta semana se me complicó realizar el pago." },
      { speaker: "agent", text: "Entiendo. Puedo registrar un compromiso para el viernes o ayudarte a elegir otra fecha." },
      { speaker: "caller", text: "El viernes por la mañana funciona para mí." },
      { speaker: "agent", text: "Gracias. Queda registrado y recibirás los detalles por tu canal preferido." },
    ],
  },
];

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function CallCenterShowcase() {
  const [scenarioId, setScenarioId] = useState("ventas");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]!;
  const complete = visibleMessages === scenario.transcript.length && visibleMessages > 0;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    const messages = window.setInterval(() => {
      setVisibleMessages((value) => Math.min(value + 1, scenario.transcript.length));
    }, 1800);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(messages);
    };
  }, [running, scenario.transcript.length]);

  useEffect(() => {
    if (complete) setRunning(false);
  }, [complete]);

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setRunning(false);
    setSeconds(0);
    setVisibleMessages(0);
  };

  const toggleCall = () => {
    if (complete) {
      setSeconds(0);
      setVisibleMessages(1);
      setRunning(true);
      return;
    }
    if (visibleMessages === 0) setVisibleMessages(1);
    setRunning((value) => !value);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setVisibleMessages(0);
  };

  return (
    <section id="callcenter" aria-labelledby="callcenter-title" className="container scroll-mt-28 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <p className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <PhoneCall size={15} /> Call center con IA
        </p>
        <h2 id="callcenter-title" className="mt-5 text-3xl font-extrabold md:text-5xl">
          Cada llamada atendida, <span className="text-gradient">cada oportunidad registrada.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground md:text-lg">
          Agentes de voz naturales que conversan, consultan tus sistemas y ejecutan acciones durante la llamada.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="glass flex flex-col rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Headphones size={23} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Elige una conversación</p>
              <p className="mt-1 text-sm text-muted-foreground">Explora cómo responde tu agente</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 rounded-2xl bg-background/45 p-1.5" role="tablist" aria-label="Tipos de llamada">
            {scenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={scenarioId === item.id}
                onClick={() => selectScenario(item.id)}
                className={`rounded-xl px-2 py-3 text-xs font-bold transition-all md:text-sm ${
                  scenarioId === item.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-7"
            >
              <h3 className="text-2xl font-bold">{scenario.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{scenario.description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 space-y-3">
            {["Voz natural y conversación bilingüe", "Transferencia inteligente a tu equipo", "Resumen, grabación y CRM sincronizados"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Al terminar</p>
              <p className="mt-1 font-semibold">{scenario.result}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">Demostración simulada: no realiza llamadas ni utiliza datos reales.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="glass overflow-hidden rounded-[2rem] shadow-glow"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background/35 px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <div className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                <Bot size={21} />
                <span className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary ${running ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <p className="font-bold">Agente IEC · Voz 01</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Radio size={12} /> Consola inteligente</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-xs font-bold">
              <span className={`h-2 w-2 rounded-full bg-primary ${running ? "animate-pulse" : ""}`} />
              {running ? "En llamada" : complete ? "Completada" : visibleMessages ? "En pausa" : "Lista para iniciar"}
            </span>
          </div>

          <div className="p-[1.25rem] md:p-7">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="rounded-2xl bg-background/45 p-3 md:p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs"><Clock3 size={13} /> Duración</p>
                <p className="mt-2 font-display text-lg font-bold md:text-2xl">{formatTime(seconds)}</p>
              </div>
              <div className="rounded-2xl bg-background/45 p-3 md:p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs"><Mic size={13} /> Canal</p>
                <p className="mt-2 font-display text-lg font-bold md:text-2xl">Voz HD</p>
              </div>
              <div className="rounded-2xl bg-background/45 p-3 md:p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs"><Sparkles size={13} /> Intención</p>
                <p className="mt-2 truncate font-display text-lg font-bold md:text-2xl">{scenario.label}</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border bg-background/40 p-[1.25rem] md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><UserRound size={19} /></span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{scenario.caller}</p>
                    <p className="truncate text-xs text-muted-foreground">{scenario.topic}</p>
                  </div>
                </div>
                <div className="flex h-10 items-end gap-1" aria-hidden="true">
                  {[34, 58, 82, 48, 94, 66, 42, 76, 55, 88, 45, 68].map((height, index) => (
                    <span
                      key={index}
                      className="voice-bar w-1 rounded-full bg-gradient-primary"
                      style={{ height: `${height}%`, animationDelay: `${index * -0.09}s`, animationPlayState: running ? "running" : "paused" }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-primary transition-[width] duration-500" style={{ width: `${(visibleMessages / scenario.transcript.length) * 100}%` }} />
              </div>

              <div className="mt-5 min-h-[250px] w-full space-y-3 md:min-h-[270px]" aria-live="polite">
                {visibleMessages === 0 ? (
                  <div className="grid min-h-[250px] place-items-center text-center md:min-h-[270px]">
                    <div>
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary"><Phone size={26} /></span>
                      <p className="mt-4 font-bold">Prueba una conversación</p>
                      <p className="mt-1 text-sm text-muted-foreground">Inicia la simulación para ver la transcripción en vivo.</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {scenario.transcript.slice(0, visibleMessages).map((message, index) => (
                      <motion.div
                        key={`${scenario.id}-${index}`}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex w-full gap-3 ${message.speaker === "caller" ? "flex-row-reverse" : ""}`}
                      >
                        <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${message.speaker === "agent" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                          {message.speaker === "agent" ? <Bot size={14} /> : <UserRound size={14} />}
                        </span>
                        <div className={`max-w-[85%] flex-1 rounded-2xl px-4 py-3 text-sm leading-6 ${message.speaker === "agent" ? "rounded-tl-sm bg-primary/10" : "rounded-tr-sm bg-secondary/70"}`}>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{message.speaker === "agent" ? "Agente IA" : "Cliente"}</p>
                          {message.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button type="button" onClick={reset} disabled={visibleMessages === 0} className="grid h-11 w-11 place-items-center rounded-full border bg-background/45 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Reiniciar simulación">
                <RotateCcw size={18} />
              </button>
              <button type="button" onClick={toggleCall} className="btn-hero min-w-44 justify-center" aria-label={running ? "Pausar simulación" : complete ? "Repetir simulación" : "Iniciar simulación"}>
                {running ? <Pause size={18} fill="currentColor" /> : complete ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}
                {running ? "Pausar" : complete ? "Repetir demo" : visibleMessages ? "Continuar" : "Iniciar demo"}
              </button>
              <span className="grid h-11 w-11 place-items-center rounded-full border bg-background/45 text-muted-foreground" title="Simulación sin audio"><Mic size={18} /></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
