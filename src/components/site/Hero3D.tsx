import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, MeshDistortMaterial, Sphere, Torus, Icosahedron, Environment, Lightformer } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, Group, LinearFilter, MathUtils, Mesh, SRGBColorSpace, Vector3 } from "three";
import soraFont from "@/assets/fonts/Sora-Bold.ttf";

const growthPoints: [number, number, number][] = [
  [-0.72, -0.68, 0], [-0.43, -0.56, 0], [-0.2, -0.61, 0], [0.18, -0.43, 0], [0.64, -0.34, 0],
];

function entranceProgress(elapsed: number, delay: number, reduceMotion: boolean) {
  if (reduceMotion) return 1;
  const progress = Math.min(1, Math.max(0, (elapsed - 1.4 - delay) / 0.75));
  return 1 - Math.pow(1 - progress, 3);
}

type SolidTextProps = {
  children: string;
  position: [number, number, number];
  fontSize: number;
  color: string;
  depthColor: string;
  delay: number;
  reduceMotion: boolean;
  letterSpacing?: number;
  /** 0–1: cuánto se retrasa la línea respecto al movimiento de la esfera. */
  lag?: number;
};

const HERO_FONT = "EliteNetHeroSora";
let fontPromise: Promise<void> | null = null;
function loadHeroFont() {
  if (!fontPromise) {
    fontPromise = new FontFace(HERO_FONT, `url(${soraFont})`, { weight: "700" })
      .load()
      .then((face) => { document.fonts.add(face); })
      .catch(() => undefined);
  }
  return fontPromise;
}

/** Texto dibujado en un canvas 2D y usado como textura: sin workers ni WebGL extra, funciona en cualquier navegador. */
function useTextTexture(text: string, letterSpacing: number, fontReady: boolean) {
  const result = useMemo(() => {
    const px = 160;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const font = `700 ${px}px ${fontReady ? HERO_FONT + "," : ""} system-ui, sans-serif`;
    ctx.font = font;
    const spacing = letterSpacing * px;
    const width = Math.ceil(ctx.measureText(text).width + spacing * text.length + px * 0.4);
    const height = Math.ceil(px * 1.35);
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, width / 2 + spacing / 2, height / 2);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    return { texture, aspect: width / height };
  }, [text, letterSpacing, fontReady]);
  useEffect(() => () => result?.texture.dispose(), [result]);
  return result;
}

function SolidText({ children, position, fontSize, color, depthColor, delay, reduceMotion, letterSpacing = 0, lag = 0 }: SolidTextProps) {
  const group = useRef<Group>(null);
  const layers = useRef<(Mesh | null)[]>([]);
  const worldPos = useMemo(() => new Vector3(), []);
  const localPos = useMemo(() => new Vector3(), []);
  const lagged = useRef<Vector3 | null>(null);
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    let alive = true;
    loadHeroFont().then(() => { if (alive) setFontReady(true); });
    return () => { alive = false; };
  }, []);
  const tex = useTextTexture(children, letterSpacing, fontReady);
  const baseY = position[1];
  const depth = fontSize * 0.085;

  useFrame(({ clock, camera }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const progress = entranceProgress(t, delay, reduceMotion);
    g.visible = progress > 0;
    g.scale.setScalar(0.86 + progress * 0.14);

    let ox = 0;
    let oy = 0;
    const parent = g.parent;
    if (!reduceMotion && parent) {
      // Sigue el movimiento real de la esfera (Float) con un retraso propio de cada línea.
      parent.getWorldPosition(worldPos);
      if (!lagged.current) lagged.current = worldPos.clone();
      const dt = Math.min(delta, 0.05);
      lagged.current.lerp(worldPos, 1 - Math.exp(-dt * (9 - lag * 5)));
      localPos.copy(lagged.current);
      parent.worldToLocal(localPos);
      const amount = 1.4 + lag * 2.2;
      ox = MathUtils.clamp(localPos.x * amount, -0.09, 0.09);
      oy = MathUtils.clamp(localPos.y * amount, -0.09, 0.09);
      // Ola suave escalonada, sincronizada con el ritmo de flotación.
      const phase = t * 1.8 - lag * 2.4;
      oy += Math.sin(phase) * 0.012 * progress;
      g.rotation.set(-oy * 1.6, ox * 2.2, -ox * 1.2 + Math.sin(phase * 0.7) * 0.02 * progress);
      // Profundidad: las capas traseras se desplazan contra la cámara.
      layers.current.forEach((m, i) => {
        if (!m) return;
        const k = depth * (i === 0 ? 1.6 : 0.8) * 1.8;
        m.position.x = -camera.position.x * k - ox * 0.25;
        m.position.y = -camera.position.y * k - oy * 0.25;
      });
    } else {
      g.rotation.set(0, 0, 0);
    }
    g.position.x = position[0] + ox;
    g.position.y = baseY + oy - (1 - progress) * 0.1;
  });

  if (!tex) return null;
  const h = fontSize * 1.35;
  const w = h * tex.aspect;

  return (
    <group ref={group} position={position} visible={reduceMotion}>
      {[1.6, 0.8].map((layer, i) => (
        <mesh key={layer} ref={(m) => { layers.current[i] = m; }} position={[0, 0, -depth * layer]} renderOrder={3}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex.texture} color={depthColor} transparent depthTest={false} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      <mesh renderOrder={5}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex.texture} color={color} transparent depthTest={false} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GrowthMessage({ dark }: { dark: boolean }) {
  const reduceMotion = Boolean(useReducedMotion());
  const arrow = useRef<Group>(null);
  const tip = useRef<Mesh>(null);
  const ink = "#f3f8ff";
  const accent = dark ? "#63e6ff" : "#9deeff";
  const depth = dark ? "#073a8c" : "#07539a";

  useFrame(({ clock }) => {
    if (!arrow.current) return;
    const progress = entranceProgress(clock.elapsedTime, 0.85, reduceMotion);
    arrow.current.visible = progress > 0;
    arrow.current.scale.setScalar(0.72 + progress * 0.28);
    if (tip.current) tip.current.scale.setScalar(reduceMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 3) * 0.12);
  });

  return (
    <group position={[0, 0, 1.42]}>
      <SolidText position={[0, 0.59, 0]} fontSize={0.075} letterSpacing={0.2} color={accent} depthColor={depth} delay={0} lag={0} reduceMotion={reduceMotion}>
        IMPULSO CON IA
      </SolidText>
      <SolidText position={[0, 0.32, 0]} fontSize={0.165} color={ink} depthColor={depth} delay={0.1} lag={0.33} reduceMotion={reduceMotion}>
        Implementa tu fuerza
      </SolidText>
      <SolidText position={[0, 0.03, 0]} fontSize={0.29} color={accent} depthColor={depth} delay={0.22} lag={0.66} reduceMotion={reduceMotion}>
        desarrollo
      </SolidText>
      <SolidText position={[0, -0.28, 0]} fontSize={0.255} color={accent} depthColor={depth} delay={0.34} lag={1} reduceMotion={reduceMotion}>
        y crecimiento
      </SolidText>

      <group ref={arrow} visible={reduceMotion}>
        <Line points={[[-0.78, -0.79, -0.01], [0.74, -0.79, -0.01]]} color={accent} lineWidth={1} transparent opacity={0.24} depthTest={false} />
        <Line points={growthPoints} color={accent} lineWidth={2.6} renderOrder={5} depthTest={false} />
        <Line points={[[0.43, -0.34, 0], [0.64, -0.34, 0], [0.61, -0.55, 0]]} color={accent} lineWidth={2.6} renderOrder={5} depthTest={false} />
        <mesh ref={tip} position={[0.64, -0.34, 0]} renderOrder={5}>
          <sphereGeometry args={[0.035, 20, 20]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} depthTest={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function Core({ dark }: { dark: boolean }) {
  const ring = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  useFrame((s, d) => {
    const dt = Math.min(d, 0.05);
    if (ring.current) { ring.current.rotation.x += dt * 0.4; ring.current.rotation.y += dt * 0.25; }
    if (ring2.current) { ring2.current.rotation.y -= dt * 0.35; ring2.current.rotation.z += dt * 0.2; }
    s.camera.position.x += (s.pointer.x * 0.8 - s.camera.position.x) * 0.05;
    s.camera.position.y += (s.pointer.y * 0.5 - s.camera.position.y) * 0.05;
    s.camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <Float speed={1.8} rotationIntensity={0.32} floatIntensity={0.9}>
        <Sphere args={[1.15, 96, 96]}>
          <MeshDistortMaterial color="#2f6bff" distort={0.38} speed={2.2} roughness={0.15} metalness={0.6} />
        </Sphere>
        <GrowthMessage dark={dark} />
      </Float>
      <Torus ref={ring} args={[1.9, 0.035, 16, 120]}>
        <meshStandardMaterial color="#7cc4ff" emissive="#3a8bff" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus ref={ring2} args={[2.35, 0.02, 16, 120]} rotation={[1.2, 0, 0]}>
        <meshStandardMaterial color="#a9d8ff" emissive="#5aa9ff" emissiveIntensity={0.6} />
      </Torus>
      {[[-1.85, 1.15, -0.5], [1.95, -0.95, 0.3], [1.5, 1.45, -1]].map((p, i) => (
        <Float key={i} speed={3 + i} floatIntensity={2}>
          <Icosahedron args={[0.22 + i * 0.05, 0]} position={p as [number, number, number]}>
            <meshStandardMaterial color="#4ea1ff" metalness={0.7} roughness={0.25} flatShading />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

export default function Hero3D({ dark }: { dark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      role="img"
      aria-label="Esfera 3D con el mensaje Implementa tu fuerza desarrollo y crecimiento"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} />
      <pointLight position={[-4, -2, 2]} intensity={20} color="#6fc3ff" />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.2} color="#8bc4ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Core dark={dark} />
    </Canvas>
  );
}
