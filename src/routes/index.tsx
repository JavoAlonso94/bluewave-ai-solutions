import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall, Moon, Sun, Home, Layers, Workflow, Mail, ArrowRight, Sparkles,
  Zap, ShieldCheck, Clock, CirclePlay,
} from "lucide-react";
import { ChatBot } from "@/components/site/ChatBot";
import { VideoShowcase } from "@/components/site/VideoShowcase";
import { CallCenterShowcase } from "@/components/site/CallCenterShowcase";
import { N8NFlowBuilder } from "@/components/site/N8NFlowBuilder";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";
import { ProcessJourney } from "@/components/site/ProcessJourney";
import { motion as m2, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, CheckCircle2 } from "lucide-react";
import logoLight from "@/assets/elitnet-logo-day.png";
import logoDark from "@/assets/elitnet-logo-night.png";
import teamImg from "@/assets/team-ai.jpg";
import serversImg from "@/assets/ai-servers.jpg";
import waImg from "@/assets/whatsapp-ai.jpg";
import voiceImg from "@/assets/voice-ai.jpg";
import gymVideo from "@/assets/videos/batorgym-chatbot-whatsapp.mp4";
import gymPoster from "@/assets/videos/batorgym-chatbot-poster.jpg";

const showcase = [
  { img: serversImg, tag: "Infraestructura", t: "Servidores de IA privados", d: "Modelos propios en tu nube, con datos 100% bajo tu control." },
  { img: waImg, tag: "WhatsApp", t: "Ventas y soporte en WhatsApp", d: "Tu asistente responde, cotiza y cierra ventas en segundos." },
  { img: voiceImg, tag: "Voz", t: "Agentes de llamadas con IA", d: "Llamadas entrantes y salientes con voz natural, 24/7." },
];
const testimonials = [
  { n: "Laura Méndez", r: "Directora, Grupo Altamar", q: "Redujimos 65% el tiempo de atención. El bot de WhatsApp vende solo." },
  { n: "Carlos Ruiz", r: "CEO, LogiMex", q: "El ERP con IA nos dio visibilidad total del inventario en tiempo real." },
  { n: "Andrea Torres", r: "Gerente comercial, Novacasa", q: "Las llamadas con IA califican prospectos mejor que nuestro equipo anterior." },
];
const faqs = [
  { q: "¿Cuánto tarda una implementación?", a: "La mayoría de los proyectos están listos entre 2 y 6 semanas, según su alcance." },
  { q: "¿Se integra con mis sistemas actuales?", a: "Sí. Conectamos ERP, CRM, WhatsApp, correo y más de 50 herramientas mediante n8n y APIs." },
  { q: "¿Mis datos están seguros?", a: "Usamos servidores privados y cifrado; tus datos nunca se usan para entrenar modelos externos." },
  { q: "¿Necesito conocimientos técnicos?", a: "No. Nosotros diseñamos, implementamos y capacitamos a tu equipo." },
];

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <m2.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-primary" />;
}

function Faq() {
  const [o, setO] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="glass overflow-hidden rounded-2xl">
          <button type="button" onClick={() => setO(o === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold">
            {f.q}
            <ChevronDown className={`shrink-0 text-primary transition-transform ${o === i ? "rotate-180" : ""}`} size={20} />
          </button>
          <AnimatePresence initial={false}>
            {o === i && (
              <m2.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </m2.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

import SafeBoundary from "@/components/site/SafeBoundary";
const Hero3D = lazy(() => import("@/components/site/Hero3D"));
const ParticlesBg = lazy(() => import("@/components/site/ParticlesBg"));
const SmoothScroll = lazy(() => import("@/components/site/SmoothScroll"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EliteNet — Automatización con Inteligencia Artificial" },
      { name: "description", content: "Call center con IA, chatbots, flujos avanzados con n8n, ERP, CRM y WhatsApp automatizado para tu empresa." },
      { property: "og:title", content: "EliteNet — Automatización con Inteligencia Artificial" },
      { property: "og:description", content: "Explora agentes de voz, chatbots y flujos n8n que conectan toda tu empresa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stats = [
  { v: "70%", l: "menos tareas manuales" },
  { v: "24/7", l: "atención automática" },
  { v: "3x", l: "más respuesta a clientes" },
  { v: "+50", l: "integraciones" },
];

const fade = {
  initial: { opacity: 0, y: 40, filter: "blur(12px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const },
};

const desktopNav = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "servicios", label: "Servicios", icon: Layers },
  { id: "callcenter", label: "Call center", icon: PhoneCall },
  { id: "flujos", label: "Flujos n8n", icon: Workflow },
  { id: "demo", label: "Demo", icon: CirclePlay },
  { id: "proceso", label: "Proceso", icon: Zap },
  { id: "contacto", label: "Contacto", icon: Mail },
];

const mobileNav = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "servicios", label: "Servicios", icon: Layers },
  { id: "callcenter", label: "Llamadas", icon: PhoneCall },
  { id: "flujos", label: "Flujos", icon: Workflow },
  { id: "contacto", label: "Contacto", icon: Mail },
];

function Index() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(true);
  const [chat, setChat] = useState(false);
  const [tab, setTab] = useState("inicio");

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Tras el preloader, pide permiso para la voz de la esfera 3D (SweetAlert2).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void import("@/lib/sphere-voice").then(({ requestSphereVoicePermission }) => requestSphereVoicePermission());
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      let current = "inicio";
      desktopNav.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= Math.min(320, window.innerHeight * 0.35)) current = id;
      });
      setTab(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toggle = () => {
    const n = !dark;
    setDark(n);
    document.documentElement.classList.toggle("dark", n);
    localStorage.setItem("iec-theme", n ? "dark" : "light");
  };

  const mobileActiveTab = tab === "demo" ? "servicios" : tab === "proceso" ? "flujos" : tab;

  return (
    <div className="relative min-h-screen overflow-x-clip pb-24 lg:pb-0">
      <a href="#servicios" className="skip-link">Saltar a las soluciones</a>
      {/* Top bar: app header on mobile, navbar on desktop */}
      <header className="glass fixed inset-x-0 top-0 z-40 md:inset-x-4 md:top-4 md:rounded-full">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <a href="#inicio" className="flex items-center">
            <img src={logoLight} alt="EliteNet" width={118} height={36} className="h-9 w-auto md:h-10 dark:hidden" /><img src={logoDark} alt="EliteNet" width={118} height={36} className="hidden h-9 w-auto md:h-10 dark:block" />
          </a>
          <nav className="hidden items-center gap-5 text-xs font-semibold lg:flex xl:gap-7 xl:text-sm" aria-label="Navegación principal">
            {desktopNav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={tab === n.id ? "location" : undefined}
                className={`relative py-2 transition-colors hover:text-foreground ${tab === n.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {n.label}
                {tab === n.id && <motion.span layoutId="desktop-active-nav" className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 rounded-full bg-gradient-primary" />}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label="Cambiar modo día/noche" className="grid h-10 w-10 place-items-center rounded-full border bg-background/40 transition-transform hover:rotate-12">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="hidden md:inline-flex"><a href="#contacto" className="btn-hero !px-5 !py-2 text-sm">Cotizar</a></span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative flex min-h-[100svh] items-center pt-20 pb-28 lg:pb-0">
        <div className="hero-blue absolute inset-0" aria-hidden="true" />
        <div className="hero-blobs absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="hero-blob hero-blob-a" />
          <span className="hero-blob hero-blob-b" />
          <span className="hero-blob hero-blob-c" />
        </div>
        <div className="hero-glass absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0">
          {mounted && <SafeBoundary><Suspense fallback={null}><ParticlesBg dark={dark} /></Suspense></SafeBoundary>}
        </div>
        <div className="container relative">
          <div className="row align-items-center g-5">
            <div className="col-md-6 text-center lg:text-left">
              <div className="hero-glass-card rounded-[2rem] p-6 md:p-8">
              <motion.span {...fade} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold">
                <Sparkles size={14} className="text-primary" /> Automatización con Inteligencia Artificial
              </motion.span>
              <motion.h1 {...fade} transition={{ ...fade.transition, delay: 0.1 }}
                className="mt-6 text-4xl font-extrabold leading-[1.05] md:text-[2.25rem] lg:text-5xl xl:text-6xl">
                Tu empresa, <span className="text-gradient">automatizada</span> con IA que trabaja por ti
              </motion.h1>
              <motion.p {...fade} transition={{ ...fade.transition, delay: 0.2 }} className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
                Chatbots, agentes de voz, WhatsApp, ERP y CRM conectados en un solo ecosistema inteligente.
              </motion.p>
              <motion.div {...fade} transition={{ ...fade.transition, delay: 0.35 }} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="#contacto" className="btn-hero">Agenda una demo <ArrowRight size={18} /></a>
                <button onClick={() => setChat(true)} className="btn-ghost-glass">Habla con el bot</button>
              </motion.div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                <div className="hero-orb-halo absolute inset-2 rounded-full" />
                <div className="hero-glass-disc absolute inset-[9%] rounded-full" aria-hidden="true" />
                <div className="absolute inset-10 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
                <div className="absolute inset-0" data-hero-3d>
                  {mounted && <SafeBoundary><Suspense fallback={null}><Hero3D dark={dark} /></Suspense></SafeBoundary>}
                </div>
                <p className="sr-only">Implementa tu fuerza desarrollo y crecimiento. El Net te ayuda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="glass overflow-hidden border-x-0 py-4">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-display text-lg font-semibold text-muted-foreground">
          {[...Array(2)].flatMap((_, k) =>
            ["OpenAI", "n8n", "WhatsApp", "Odoo", "HubSpot", "Twilio", "Google Cloud", "Make", "Zapier", "Stripe"].map((b) => (
              <span key={b + k} className="flex items-center gap-3"><Zap size={16} className="text-primary" />{b}</span>
            )),
          )}
        </div>
      </div>

      {/* Stats */}
      <section className="container py-16">
        <div className="row g-3">
          {stats.map((s, i) => (
            <motion.div key={s.l} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="col-6 col-md-3">
              <div className="glass rounded-3xl p-6 text-center">
                <p className="font-display text-4xl font-extrabold text-gradient">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ServiceExplorer />
      <CallCenterShowcase />
      <N8NFlowBuilder />

      {/* Cinematic video demo */}
      <VideoShowcase src={gymVideo} poster={gymPoster} />

      {/* Showcase */}
      <section className="container py-16">
        <motion.div {...fade} className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Casos reales</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">IA que <span className="text-gradient">trabaja por ti</span></h2>
        </motion.div>
        <div className="row g-4">
          {showcase.map((c, i) => (
            <motion.div key={c.t} {...fade} transition={{ ...fade.transition, delay: i * 0.1 }} className="col-md-4">
              <div className="group glass relative h-full overflow-hidden rounded-3xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt={c.t} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-primary">{c.tag}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{c.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
                  <a href="#contacto" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">Ver más <ArrowRight size={16} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container py-16">
        <div className="row g-5 align-items-center">
          <motion.div {...fade} className="col-lg-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-primary opacity-40 blur-2xl" />
              <img src={teamImg} alt="Equipo de EliteNet trabajando con paneles de IA" loading="lazy" width={1280} height={896} className="relative w-full rounded-[2rem] object-cover shadow-glow" />
              <div className="glass animate-float absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl p-4 md:left-[-1.5rem]">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground"><Sparkles size={18} /></div>
                <div><p className="font-display text-xl font-extrabold text-gradient">+120</p><p className="text-xs text-muted-foreground">proyectos entregados</p></div>
              </div>
            </div>
          </motion.div>
          <motion.div {...fade} className="col-lg-6">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Nuestro equipo</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">Expertos en <span className="text-gradient">IA y automatización</span></h2>
            <p className="mt-4 text-muted-foreground">Ingenieros, analistas y diseñadores que convierten tus procesos en sistemas inteligentes que trabajan 24/7.</p>
            <ul className="mt-6 space-y-3">
              {["Consultoría estratégica sin costo", "Soporte y monitoreo continuo", "Capacitación para tu equipo"].map((t) => (
                <li key={t} className="flex items-center gap-3"><CheckCircle2 className="text-primary" size={20} />{t}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-16">
        <div className="glass relative overflow-hidden rounded-[2rem] p-8 md:p-14">
          <div className="animate-float absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
          <div className="row g-5 align-items-center relative">
            <motion.div {...fade} className="col-lg-5">
              <h2 className="text-3xl font-extrabold md:text-4xl">¿Por qué <span className="text-gradient">EliteNet</span>?</h2>
              <p className="mt-4 text-muted-foreground">Implementamos IA real que genera resultados medibles desde el primer mes.</p>
            </motion.div>
            <div className="col-lg-7">
              <div className="row g-3">
                {[{ i: Zap, t: "Implementación rápida", d: "Resultados en semanas, no meses." },
                  { i: ShieldCheck, t: "Seguridad total", d: "Tus datos protegidos y privados." },
                  { i: Clock, t: "Disponible 24/7", d: "Tu negocio nunca deja de responder." },
                  { i: Workflow, t: "Todo integrado", d: "Conectamos tus sistemas actuales." }].map((f, k) => (
                  <motion.div key={f.t} {...fade} transition={{ ...fade.transition, delay: k * 0.08 }} className="col-sm-6">
                    <div className="flex gap-3 rounded-2xl bg-background/40 p-4">
                      <f.i className="mt-1 shrink-0 text-primary" size={20} />
                      <div><p className="font-bold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProcessJourney />

      {/* Testimonials */}
      <section className="container py-16">
        <motion.div {...fade} className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Testimonios</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">Lo que dicen <span className="text-gradient">nuestros clientes</span></h2>
        </motion.div>
        <div className="row g-4">
          {testimonials.map((t, i) => (
            <motion.div key={t.n} {...fade} transition={{ ...fade.transition, delay: i * 0.1 }} className="col-md-4">
              <div className="card-tilt glass h-full rounded-3xl p-6">
                <div className="flex gap-1 text-primary">{[0,1,2,3,4].map((k) => <Star key={k} size={16} fill="currentColor" />)}</div>
                <p className="mt-4">“{t.q}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-bold text-primary-foreground">{t.n[0]}</div>
                  <div><p className="font-bold">{t.n}</p><p className="text-xs text-muted-foreground">{t.r}</p></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <motion.div {...fade} className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Preguntas frecuentes</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">¿Tienes <span className="text-gradient">dudas</span>?</h2>
        </motion.div>
        <Faq />
      </section>

      {/* CTA / Contact */}
      <section id="contacto" className="container scroll-mt-24 py-16">
        <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow md:p-16">
          <h2 className="text-3xl font-extrabold md:text-5xl">¿Listo para automatizar tu empresa?</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">Cuéntanos tu proyecto y nuestro asistente te guiará al instante.</p>
          <button onClick={() => setChat(true)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 font-bold text-foreground transition-transform hover:scale-105">
            Iniciar conversación <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      <footer className="container py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EliteNet · Automatización con Inteligencia Artificial
      </footer>

      <ScrollBar />
      {mounted && <Suspense fallback={null}><SmoothScroll /></Suspense>}
      <div className="blur-orb left-[-10%] top-[30%] h-96 w-96" />
      <div className="blur-orb right-[-10%] top-[70%] h-[28rem] w-[28rem]" style={{ animationDelay: "-7s" }} />
      <ChatBot open={chat} setOpen={setChat} />

      {/* Mobile native-style tab bar */}
      <nav className="glass pb-safe fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-3xl pt-2 lg:hidden" aria-label="Navegación móvil">
        {mobileNav.map((n) => {
          const active = mobileActiveTab === n.id;
          return (
            <a key={n.id} href={`#${n.id}`} onClick={() => setTab(n.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
              <motion.span animate={{ scale: active ? 1.15 : 1 }} className={`grid h-8 w-12 place-items-center rounded-full ${active ? "bg-primary/15" : ""}`}>
                <n.icon size={20} />
              </motion.span>
              {n.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
