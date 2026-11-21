import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import markNight from "@/assets/elitnet-mark-night.png";
import wordNight from "@/assets/elitnet-word-night.png";

/**
 * Pantalla de carga de la marca.
 * El contenido entra con animaciones CSS (funcionan desde el HTML inicial, sin esperar
 * a que arranque el script de la app) y la pantalla se retira por CSS a los ~1.95 s,
 * o antes si la app termina de cargar.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, 500 - (Date.now() - startedAt.current));
      window.setTimeout(() => setDone(true), reduce ? 0 : wait + 380);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const maxTimer = window.setTimeout(finish, 1600);

    return () => {
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", finish);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          aria-busy="true"
          aria-label="Cargando EliteNet"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.4, ease: "easeInOut" } }}
        >
          <div className="preloader-orb preloader-orb-a" aria-hidden="true" />
          <div className="preloader-orb preloader-orb-b" aria-hidden="true" />

          <div className="relative flex flex-col items-center gap-5 px-6">
            <div className="relative grid h-[132px] w-[132px] place-items-center">
              <span className="preloader-ring" aria-hidden="true" />
              <img
                src={markNight}
                alt=""
                width={86}
                height={86}
                className="preloader-mark relative z-10 h-[86px] w-[86px]"
              />
            </div>

            <img
              src={wordNight}
              alt="EliteNet"
              width={172}
              height={44}
              className="preloader-word h-10 w-auto"
            />

            <p className="preloader-caption">Automatización con IA</p>

            <div className="preloader-bar" role="presentation">
              <div className="preloader-bar-fill" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
