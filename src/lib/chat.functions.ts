import { createServerFn } from "@tanstack/react-start";

type ChatInput = { message: string; sessionId: string };

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((d: ChatInput) => {
    const message = String(d?.message ?? "").trim().slice(0, 2000);
    const sessionId = String(d?.sessionId ?? "").slice(0, 100);
    if (!message) throw new Error("Mensaje vacío");
    return { message, sessionId };
  })
  .handler(async ({ data }) => {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      return {
        reply:
          "¡Gracias por escribirnos! 🤖 Un especialista te contactará pronto. (El asistente aún no está conectado a n8n.)",
        connected: false,
      };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "web", timestamp: new Date().toISOString() }),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error(`n8n webhook failed [${res.status}]: ${text}`);
        return { reply: "Ahora mismo no puedo responder, inténtalo en un momento.", connected: true };
      }
      let reply = text;
      try {
        const j = JSON.parse(text);
        const o = Array.isArray(j) ? j[0] : j;
        reply = o?.reply ?? o?.output ?? o?.message ?? o?.text ?? text;
      } catch {}
      return { reply: String(reply || "Mensaje recibido ✅"), connected: true };
    } catch (e) {
      console.error("n8n webhook error", e);
      return { reply: "Ahora mismo no puedo responder, inténtalo en un momento.", connected: true };
    }
  });
