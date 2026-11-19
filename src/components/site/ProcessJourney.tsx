import { motion } from "framer-motion";
import { Blocks, CheckCircle2, PenTool, Search, TrendingUp, type LucideIcon } from "lucide-react";

const steps: { number: string; title: string; subtitle: string; description: string; deliverable: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "Descubrimiento",
    subtitle: "Entendemos antes de proponer",
    description: "Mapeamos tus procesos, canales y herramientas para encontrar las oportunidades con mayor impacto.",
    deliverable: "Mapa de oportunidades y prioridades",
    icon: Search,
  },
  {
    number: "02",
    title: "Estrategia y diseño",
    subtitle: "Una solución clara y medible",
    description: "Diseñamos la experiencia, los flujos y las reglas de IA con entregables y responsabilidades definidas.",
    deliverable: "Prototipo, arquitectura y plan de trabajo",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Construcción e integración",
    subtitle: "Conectamos cada pieza",
    description: "Configuramos los agentes y n8n, integramos tus sistemas y probamos los casos reales de tu operación.",
    deliverable: "Solución integrada y validada",
    icon: Blocks,
  },
  {
    number: "04",
    title: "Lanzamiento y evolución",
    subtitle: "Medimos para mejorar",
    description: "Capacitamos a tu equipo, monitoreamos el comportamiento y optimizamos los flujos con datos de uso.",
    deliverable: "Acompañamiento y optimización continua",
    icon: TrendingUp,
  },
];

export function ProcessJourney() {
  return (
    <section id="proceso" aria-labelledby="process-title" className="container scroll-mt-28 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto mb-14 max-w-3xl text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Nuestro proceso</p>
        <h2 id="process-title" className="mt-4 text-3xl font-extrabold md:text-5xl">De una idea a un sistema que <span className="text-gradient">trabaja por ti.</span></h2>
        <p className="mt-4 text-muted-foreground">Acompañamiento cercano, avances visibles y control en cada etapa.</p>
      </motion.div>

      <div className="relative mx-auto max-w-5xl">
        <div className="process-line absolute bottom-8 left-5 top-8 w-px md:left-1/2" />
        <div className="space-y-8 md:space-y-14">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className={`relative pl-14 md:w-1/2 md:pl-0 ${index % 2 === 0 ? "md:pr-16" : "md:ml-auto md:pl-16"}`}
            >
              <span className={`absolute left-0 top-7 z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-background bg-gradient-primary text-primary-foreground shadow-glow md:top-8 ${index % 2 === 0 ? "md:left-auto md:-right-5" : "md:-left-5"}`}>
                <step.icon size={17} />
              </span>
              <div className="card-tilt glass rounded-3xl p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-sm font-bold text-primary">ETAPA {step.number}</span>
                  <span className="font-display text-4xl font-extrabold text-primary/15">{step.number}</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold">{step.title}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{step.subtitle}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
                <div className="mt-5 flex items-start gap-2 rounded-2xl bg-primary/5 p-3 text-xs font-semibold leading-5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" /> {step.deliverable}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
