import { useEffect, useMemo, useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBg({ dark }: { dark: boolean }) {
  const [color, setColor] = useState("#2b6cff");
  useEffect(() => {
    setColor(getComputedStyle(document.documentElement).getPropertyValue("--particle").trim() || "#2b6cff");
  }, [dark]);
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
        modes: { grab: { distance: 160, links: { opacity: 0.6 } }, push: { quantity: 3 } },
      },
      particles: {
        number: { value: 70, density: { enable: true } },
        color: { value: color },
        links: { enable: true, color, distance: 140, opacity: 0.3, width: 1 },
        move: { enable: true, speed: 1, outModes: { default: "bounce" as const } },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 3 } },
      },
    }),
    [color],
  );
  return (
    <ParticlesProvider init={loadSlim}>
      <Particles key={color} id="tsparticles" options={options} className="absolute inset-0" />
    </ParticlesProvider>
  );
}
