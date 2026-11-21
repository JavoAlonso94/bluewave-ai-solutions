import { motion, useReducedMotion } from "framer-motion";

const entrance = [0.2, 0.8, 0.2, 1] as const;

function AnimatedWord({ word, index, className = "" }: { word: string; index: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 1.35 + index * 0.09, ease: entrance }}
    >
      {word}
    </motion.span>
  );
}

export function HeroSphereMessage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="sphere-message-wrap pointer-events-none relative"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.82, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 1.1, ease: entrance }}
    >
      <div className="sphere-message relative overflow-hidden rounded-[1.75rem] px-4 py-5 text-center sm:px-6 sm:py-6">
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute -inset-y-8 left-0 w-1/3"
            animate={{ x: ["-180%", "390%"] }}
            transition={{ duration: 2.2, delay: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <div className="sphere-message-sheen h-full w-full" />
          </motion.div>
        )}

        <div className="relative">
          <motion.div
            className="mb-3 flex items-center justify-center gap-2 text-[0.55rem] font-bold uppercase tracking-[0.24em] text-primary sm:text-[0.62rem]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.25 }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow"
              animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Impulso con IA
          </motion.div>

          <p className="flex flex-wrap justify-center gap-x-[0.28em] font-display text-[clamp(0.88rem,2.2vw,1.08rem)] font-semibold leading-tight">
            {["Implementa", "tu", "fuerza"].map((word, index) => (
              <AnimatedWord key={word} word={word} index={index} />
            ))}
          </p>

          <p className="mt-1 font-display text-[clamp(1.35rem,4vw,1.85rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
            <span className="block">
              <AnimatedWord word="desarrollo" index={3} className="text-gradient" />
            </span>
            <span className="mt-0.5 flex justify-center gap-x-[0.24em]">
              {["y", "crecimiento"].map((word, index) => (
                <AnimatedWord key={word} word={word} index={4 + index} className="text-gradient" />
              ))}
            </span>
          </p>

          <svg
            viewBox="0 0 120 36"
            className="mx-auto mt-3 h-8 w-full max-w-[160px] overflow-visible text-primary"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 32H116M4 20H116M4 8H116" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
            <motion.path
              d="M5 29L28 21L47 25L79 11L110 5"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.35, delay: 2.05, ease: "easeInOut" }}
            />
            <motion.path
              d="M94 5H110V21"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 3.25, ease: "easeOut" }}
            />
            <motion.circle
              r="3.2"
              fill="currentColor"
              initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
              animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: [0, 1, 1], scale: [0, 1.25, 1], cx: [5, 110, 110], cy: [29, 5, 5] }}
              transition={{ duration: 1.4, delay: 2.05, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
