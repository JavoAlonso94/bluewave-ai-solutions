import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { sendChatMessage } from "@/lib/chat.functions";

type Msg = { role: "bot" | "user"; text: string };

export function ChatBot({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const send = useServerFn(sendChatMessage);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "¡Hola! Soy el asistente de IEC IA 👋 ¿Qué proceso te gustaría automatizar?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sid = useRef("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    sid.current = localStorage.getItem("iec-sid") || crypto.randomUUID();
    localStorage.setItem("iec-sid", sid.current);
  }, []);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const r = await send({ data: { message: text, sessionId: sid.current } });
      setMsgs((m) => [...m, { role: "bot", text: r.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Hubo un problema, inténtalo de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        aria-label="Abrir chat"
        onClick={() => setOpen(!open)}
        className="pulse-ring fixed bottom-24 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow md:bottom-6"
      >
        {open ? <X /> : <Bot />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="glass fixed inset-x-3 bottom-40 z-50 flex h-[60vh] flex-col overflow-hidden rounded-3xl shadow-glow md:inset-x-auto md:bottom-24 md:right-6 md:h-[520px] md:w-[380px]"
          >
            <div className="flex items-center gap-3 bg-gradient-primary p-4 text-primary-foreground">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-background/20"><Bot size={20} /></div>
              <div>
                <p className="font-display font-bold leading-tight">Asistente IEC IA</p>
                <p className="text-xs opacity-80">En línea · responde al instante</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {m.text}
                </motion.div>
              ))}
              {loading && <div className="w-16 rounded-2xl bg-secondary px-4 py-2 text-sm text-muted-foreground">•••</div>}
              <div ref={end} />
            </div>
            <form onSubmit={submit} className="flex gap-2 border-t p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-full border bg-background/60 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button aria-label="Enviar" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground"><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
