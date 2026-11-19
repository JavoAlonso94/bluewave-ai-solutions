import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Factory,
  MessageSquareText,
  PhoneCall,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type Service = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
  channels: string[];
};

const services: Service[] = [
  {
    id: "chatbots",
    label: "Chatbots",
    title: "Automatización con chatbots",
    description: "Asistentes entrenados con el lenguaje de tu marca que califican prospectos, resuelven dudas y personalizan cada conversación.",
    icon: MessageSquareText,
    items: ["Calificación de prospectos y ventas guiadas", "Soporte automático con contexto y memoria", "Recomendaciones personalizadas", "Transferencia fluida a tu equipo humano"],
    channels: ["Sitio web", "WhatsApp", "Instagram", "Messenger"],
  },
  {
    id: "voz",
    label: "Agentes de voz",
    title: "Agentes de voz con IA",
    description: "Un call center disponible todos los días que entiende la conversación y actúa dentro de tus sistemas en tiempo real.",
    icon: PhoneCall,
    items: ["Llamadas entrantes y salientes", "Agendamiento y confirmación de citas", "Resumen y transcripción automática", "Transferencia inteligente con contexto"],
    channels: ["Telefonía", "CRM", "Calendario", "Correo"],
  },
  {
    id: "crm",
    label: "CRM + ERP",
    title: "Automatización comercial y operativa",
    description: "Conecta clientes, inventario y finanzas para que la información avance sola y tu equipo tome mejores decisiones.",
    icon: Users,
    items: ["Seguimiento automático de oportunidades", "Actualización de registros sin capturas", "Alertas de próxima mejor acción", "Reportes y tableros unificados"],
    channels: ["CRM", "ERP", "Hojas de cálculo", "BI"],
  },
  {
    id: "industria",
    label: "Por industria",
    title: "Flujos diseñados para tu operación",
    description: "Combinamos n8n, APIs e IA para adaptar cada automatización a tus reglas, excepciones y controles de negocio.",
    icon: Factory,
    items: ["Procesos con aprobaciones humanas", "Integraciones con sistemas existentes", "Manejo de errores y alertas", "Monitoreo y mejora continua"],
    channels: ["n8n", "APIs", "Webhooks", "Bases de datos"],
  },
];

export function ServiceExplorer() {
  const [activeId, setActiveId] = useState(services[0]!.id);
  const active = services.find((service) => service.id === activeId) ?? services[0]!;

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % services.length;
    if (event.key === "ArrowLeft") next = (index - 1 + services.length) % services.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = services.length - 1;
    setActiveId(services[next]!.id);
    document.getElementById(`service-tab-${services[next]!.id}`)?.focus();
  };

  return (
    <section id="servicios" aria-labelledby="services-title" className="container scroll-mt-28 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto mb-10 max-w-3xl text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Soluciones conectadas</p>
        <h2 id="services-title" className="mt-4 text-3xl font-extrabold md:text-5xl">Explora lo que la IA puede <span className="text-gradient">hacer por ti.</span></h2>
        <p className="mt-4 text-muted-foreground">Elige una solución y descubre cómo se adapta a tu negocio.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3" role="tablist" aria-label="Soluciones de automatización">
        {services.map((service, index) => (
          <button
            key={service.id}
            id={`service-tab-${service.id}`}
            type="button"
            role="tab"
            aria-selected={activeId === service.id}
            aria-controls="service-panel"
            tabIndex={activeId === service.id ? 0 : -1}
            onClick={() => setActiveId(service.id)}
            onKeyDown={(event) => handleKeys(event, index)}
            className={`flex min-h-24 flex-col items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all md:min-h-28 md:p-5 ${
              activeId === service.id ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:-translate-y-1 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            <service.icon size={23} />
            <span className="text-xs font-bold md:text-sm">{service.label}</span>
          </button>
        ))}
      </div>

      <div id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${active.id}`} className="glass mt-4 overflow-hidden rounded-[2rem] shadow-glow">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid gap-8 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
          >
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary"><active.icon size={27} /></span>
              <h3 className="mt-6 text-2xl font-bold md:text-3xl">{active.title}</h3>
              <p className="mt-4 leading-7 text-muted-foreground">{active.description}</p>
              <a href="#contacto" className="btn-hero mt-7 !py-3 text-sm">Quiero esta solución <ArrowRight size={17} /></a>
            </div>
            <div className="rounded-3xl border bg-background/45 p-5 md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Qué entregamos</p>
              <div className="mt-5 space-y-4">
                {active.items.map((item, index) => (
                  <motion.div key={item} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="flex items-start gap-3">
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm font-medium leading-6">{item}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-7 border-t pt-5">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground"><Workflow size={14} /> Se conecta con</p>
                <div className="flex flex-wrap gap-2">
                  {active.channels.map((channel) => <span key={channel} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{channel}</span>)}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><Bot size={14} /> Cada solución se configura según tus procesos, sin plantillas rígidas.</p>
    </section>
  );
}
