import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  GitBranch,
  LoaderCircle,
  Mail,
  MessageCircle,
  Play,
  RotateCcw,
  Sheet,
  Sparkles,
  Webhook,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type FlowNode = { name: string; detail: string; icon: LucideIcon };
type Flow = { id: string; label: string; title: string; description: string; result: string; apps: string[]; nodes: FlowNode[] };

const flows: Flow[] = [
  {
    id: "ventas",
    label: "Ventas omnicanal",
    title: "De la primera pregunta a una oportunidad calificada",
    description: "Unifica mensajes, entiende la intención con IA, consulta el CRM y entrega al vendedor solo el contexto que necesita.",
    result: "Oportunidad creada, responsable asignado y seguimiento programado.",
    apps: ["WhatsApp", "OpenAI", "HubSpot", "Google Calendar"],
    nodes: [
      { name: "Mensaje entrante", detail: "WhatsApp", icon: MessageCircle },
      { name: "Webhook", detail: "n8n recibe", icon: Webhook },
      { name: "Agente IA", detail: "Califica", icon: Bot },
      { name: "CRM", detail: "Crea oportunidad", icon: Database },
      { name: "Seguimiento", detail: "Agenda tarea", icon: CalendarCheck },
    ],
  },
  {
    id: "soporte",
    label: "Soporte inteligente",
    title: "Resuelve primero y escala únicamente cuando hace falta",
    description: "Clasifica cada solicitud, busca una respuesta en tu conocimiento y abre un ticket con todo el historial si requiere atención humana.",
    result: "Respuesta enviada o ticket priorizado con resumen y contexto.",
    apps: ["n8n", "Base de conocimiento", "Zendesk", "Slack"],
    nodes: [
      { name: "Nueva solicitud", detail: "Correo o chat", icon: Mail },
      { name: "Clasificador", detail: "Detecta intención", icon: GitBranch },
      { name: "Conocimiento", detail: "Busca respuesta", icon: Sparkles },
      { name: "Decisión", detail: "Resuelve o escala", icon: Workflow },
      { name: "Notificación", detail: "Informa al equipo", icon: Zap },
    ],
  },
  {
    id: "operacion",
    label: "Operación y datos",
    title: "Sincroniza tu operación sin capturas repetitivas",
    description: "Detecta cambios, valida la información y actualiza tus documentos y sistemas con alertas ante cualquier excepción.",
    result: "Registros sincronizados, reporte actualizado y excepciones notificadas.",
    apps: ["ERP", "Google Sheets", "n8n", "Correo"],
    nodes: [
      { name: "Evento ERP", detail: "Detecta cambio", icon: Database },
      { name: "Validación", detail: "Revisa campos", icon: CheckCircle2 },
      { name: "Transformación", detail: "Normaliza datos", icon: GitBranch },
      { name: "Actualización", detail: "Sincroniza reporte", icon: Sheet },
      { name: "Confirmación", detail: "Envía resumen", icon: Mail },
    ],
  },
];

export function N8NFlowBuilder() {
  const [flowId, setFlowId] = useState(flows[0]!.id);
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const flow = flows.find((item) => item.id === flowId) ?? flows[0]!;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (activeStep >= flow.nodes.length - 1) {
        setRunning(false);
        setComplete(true);
      } else {
        setActiveStep((value) => value + 1);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [activeStep, flow.nodes.length, running]);

  const selectFlow = (id: string) => {
    setFlowId(id);
    setActiveStep(-1);
    setRunning(false);
    setComplete(false);
  };

  const runFlow = () => {
    setActiveStep(0);
    setComplete(false);
    setRunning(true);
  };

  const resetFlow = () => {
    setActiveStep(-1);
    setRunning(false);
    setComplete(false);
  };

  const progress = complete ? 100 : activeStep < 0 ? 0 : ((activeStep + (running ? 0.35 : 1)) / flow.nodes.length) * 100;

  return (
    <section id="flujos" aria-labelledby="flows-title" className="relative scroll-mt-28 overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Workflow size={15} /> Flujos avanzados con n8n
          </p>
          <h2 id="flows-title" className="mt-5 text-3xl font-extrabold md:text-5xl">
            Tus herramientas trabajando <span className="text-gradient">como un solo sistema.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground md:text-lg">
            Diseñamos automatizaciones visuales con reglas, IA, validaciones y control humano en los puntos importantes.
          </p>
        </motion.div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:justify-center" role="tablist" aria-label="Ejemplos de flujos n8n">
          {flows.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={flowId === item.id}
              onClick={() => selectFlow(item.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
                flowId === item.id ? "border-primary bg-primary text-primary-foreground shadow-glow" : "bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="glass overflow-hidden rounded-[2rem] shadow-glow"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-background/35 px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary font-display text-sm font-extrabold text-primary-foreground">n8n</span>
              <div>
                <p className="text-sm font-bold">Lienzo de automatización</p>
                <p className="text-xs text-muted-foreground">Ejemplo interactivo · entorno de prueba</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetFlow} disabled={activeStep < 0} className="grid h-10 w-10 place-items-center rounded-full border bg-background/45 transition-colors hover:bg-secondary disabled:opacity-40" aria-label="Restablecer flujo">
                <RotateCcw size={17} />
              </button>
              <button type="button" onClick={runFlow} disabled={running} className="btn-hero !px-5 !py-2.5 text-sm disabled:cursor-wait disabled:opacity-80">
                {running ? <LoaderCircle size={17} className="animate-spin" /> : <Play size={17} fill="currentColor" />}
                {running ? "Ejecutando…" : complete ? "Ejecutar de nuevo" : "Ejecutar prueba"}
              </button>
            </div>
          </div>

          <div className="flow-grid relative p-5 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={flow.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="mx-auto mb-7 max-w-3xl text-center">
                  <h3 className="text-xl font-bold md:text-2xl">{flow.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{flow.description}</p>
                </div>

                <div className="relative grid gap-3 md:grid-cols-5 md:gap-4">
                  {flow.nodes.map((node, index) => {
                    const isActive = running && activeStep === index;
                    const isDone = complete || activeStep > index;
                    return (
                      <div key={node.name} className="relative">
                        <div className={`flow-node relative z-10 flex h-full min-h-28 items-center gap-4 rounded-2xl border bg-card/75 p-4 md:flex-col md:items-start ${isActive ? "is-active" : ""} ${isDone ? "is-complete" : ""}`}>
                          <div className="flex w-full items-center justify-between gap-3">
                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${isActive || isDone ? "bg-gradient-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                              {isActive ? <LoaderCircle size={20} className="animate-spin" /> : isDone ? <Check size={20} /> : <node.icon size={20} />}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{node.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{node.detail}</p>
                          </div>
                          {isActive && <span className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-gradient-primary" />}
                        </div>
                        {index < flow.nodes.length - 1 && (
                          <span className={`pointer-events-none absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 md:block ${activeStep > index || complete ? "text-primary" : "text-muted-foreground/40"}`}>
                            <ChevronRight size={17} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-6 grid gap-4 rounded-2xl border bg-background/40 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Resultado del flujo</p>
                    <p className="mt-2 text-sm font-semibold">{flow.result}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {flow.apps.map((app) => <span key={app} className="rounded-full border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground">{app}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3 lg:max-w-64" aria-live="polite">
                    {complete ? <CheckCircle2 className="shrink-0 text-primary" size={23} /> : <Zap className="shrink-0 text-primary" size={23} />}
                    <p className="text-xs leading-5 text-muted-foreground">
                      {complete ? `Simulación completada: ${flow.nodes.length} pasos ejecutados.` : running ? `Ejecutando paso ${activeStep + 1} de ${flow.nodes.length}…` : "Pulsa Ejecutar prueba para recorrer el flujo paso a paso."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Las ejecuciones mostradas son una simulación visual y no modifican tus cuentas.</p>
      </div>
    </section>
  );
}
