import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, MeshDistortMaterial, Sphere, Torus, Icosahedron, Environment, Lightformer } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  CylinderGeometry,
  FrontSide,
  Group,
  LinearFilter,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
} from "three";
import soraFont from "@/assets/fonts/Sora-Bold.ttf";
import { playSphereVoice } from "@/lib/sphere-voice";

const growthPoints: [number, number, number][] = [
  [-0.72, -0.68, 0], [-0.43, -0.56, 0], [-0.2, -0.61, 0], [0.18, -0.43, 0], [0.64, -0.34, 0],
];

function entranceProgress(elapsed: number, delay: number, reduceMotion: boolean) {
  if (reduceMotion) return 1;
  const progress = Math.min(1, Math.max(0, (elapsed - 1.4 - delay) / 0.75));
  return 1 - Math.pow(1 - progress, 3);
}

type CurvedTextProps = {
  children: string;
  /** Altura de la banda respecto al centro de la esfera. */
  y: number;
  /** Radio de la banda: siempre mayor que la esfera deformada (~1.32). */
  radius: number;
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

function useHeroFontReady() {
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    let alive = true;
    loadHeroFont().then(() => {
      if (alive) setFontReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return fontReady;
}

/**
 * Texto curvado sobre un cilindro que envuelve la esfera. La esfera tapa lo que
 * queda detrás (depthTest) y las capas interiores dan grosor de extrusión.
 */
function CurvedText({
  children,
  y,
  radius,
  fontSize,
  color,
  depthColor,
  delay,
  reduceMotion,
  letterSpacing = 0,
  lag = 0,
}: CurvedTextProps) {
  const group = useRef<Group>(null);
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const worldPos = useMemo(() => new Vector3(), []);
  const localPos = useMemo(() => new Vector3(), []);
  const lagged = useRef<Vector3 | null>(null);
  const fontReady = useHeroFontReady();
  const tex = useTextTexture(children, letterSpacing, fontReady);

  const h = fontSize * 1.35;
  const thickness = fontSize * 0.07;
  const arc = tex ? (h * tex.aspect) / radius : 0;
  const layers = useMemo(
    () => [
      { r: radius - thickness * 2, dy: -thickness * 1.2, tint: depthColor, order: 3 },
      { r: radius - thickness, dy: -thickness * 0.6, tint: depthColor, order: 4 },
      { r: radius, dy: 0, tint: color, order: 5 },
    ],
    [radius, thickness, depthColor, color],
  );
  const geometries = useMemo(
    () => (arc ? layers.map((l) => new CylinderGeometry(l.r, l.r, h, 128, 1, true, -arc / 2, arc)) : []),
    [layers, h, arc],
  );
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const progress = entranceProgress(t, delay, reduceMotion);
    g.visible = progress > 0;
    materials.current.forEach((m) => {
      if (m) m.opacity = progress;
    });

    let sway = 0;
    let tilt = 0;
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
      const ox = MathUtils.clamp(localPos.x * amount, -0.09, 0.09);
      oy = MathUtils.clamp(localPos.y * amount, -0.09, 0.09);
      // Oscilación orbital escalonada: el texto gira un poco alrededor de la esfera.
      const phase = t * 0.9 - lag * 1.6;
      sway = ox * 1.8 + Math.sin(phase) * 0.09 * progress;
      tilt = -oy * 1.1;
    }
    // Entrada: cada línea llega girando alrededor de la esfera desde la izquierda.
    g.rotation.y = sway - (1 - progress) * 1.4;
    g.rotation.x = tilt;
    g.position.y = y + oy * 0.5 - (1 - progress) * 0.08;
  });

  if (!tex || geometries.length === 0) return null;
  return (
    <group ref={group} position={[0, y, 0]} visible={reduceMotion}>
      {layers.map((l, i) => (
        <mesh key={i} geometry={geometries[i]!} position={[0, l.dy, 0]} renderOrder={l.order}>
          <meshBasicMaterial
            ref={(m) => {
              materials.current[i] = m;
            }}
            map={tex.texture}
            color={l.tint}
            side={FrontSide}
            transparent
            opacity={reduceMotion ? 1 : 0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Anillo de texto que orbita la esfera de forma continua. */
function OrbitText({
  children,
  radius,
  fontSize,
  color,
  rotation,
  y,
  speed,
  delay,
  reduceMotion,
}: {
  children: string;
  radius: number;
  fontSize: number;
  color: string;
  rotation: [number, number, number];
  y: number;
  speed: number;
  delay: number;
  reduceMotion: boolean;
}) {
  const spin = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const fontReady = useHeroFontReady();
  const tex = useTextTexture(`${children}   •   `, 0.22, fontReady);
  const h = fontSize * 1.35;

  const geometry = useMemo(() => {
    if (!tex) return null;
    const repeats = Math.max(1, Math.round((Math.PI * 2 * radius) / (h * tex.aspect)));
    tex.texture.wrapS = RepeatWrapping;
    tex.texture.repeat.set(repeats, 1);
    tex.texture.needsUpdate = true;
    return new CylinderGeometry(radius, radius, h, 192, 1, true);
  }, [tex, radius, h]);
  useEffect(() => () => geometry?.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    const progress = entranceProgress(clock.elapsedTime, delay, reduceMotion);
    if (material.current) material.current.opacity = progress * 0.95;
    if (spin.current && !reduceMotion) spin.current.rotation.y += Math.min(delta, 0.05) * speed;
  });

  if (!tex || !geometry) return null;
  return (
    <group position={[0, y, 0]} rotation={rotation}>
      <group ref={spin}>
        <mesh geometry={geometry} renderOrder={6}>
          <meshBasicMaterial
            ref={material}
            map={tex.texture}
            color={color}
            side={FrontSide}
            transparent
            opacity={reduceMotion ? 0.95 : 0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
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
    arrow.current.scale.setScalar((0.72 + progress * 0.28) * 0.85);
    if (tip.current) tip.current.scale.setScalar(reduceMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 3) * 0.12);
  });

  return (
    <>
      {/* Bandas de texto que envuelven la esfera, ligeramente inclinadas como un planeta. */}
      <group rotation={[0.08, 0, -0.06]}>
        <OrbitText
          radius={1.4}
          y={0.8}
          rotation={[0.1, 0, -0.05]}
          fontSize={0.07}
          color={accent}
          speed={0.32}
          delay={0}
          reduceMotion={reduceMotion}
        >
          IMPULSO CON IA
        </OrbitText>
        <CurvedText
          y={0.4}
          radius={1.48}
          fontSize={0.16}
          color={ink}
          depthColor={depth}
          delay={0.1}
          lag={0.33}
          reduceMotion={reduceMotion}
        >
          Implementa tu fuerza
        </CurvedText>
        <CurvedText
          y={0.08}
          radius={1.52}
          fontSize={0.28}
          color={accent}
          depthColor={depth}
          delay={0.22}
          lag={0.66}
          reduceMotion={reduceMotion}
        >
          desarrollo
        </CurvedText>
        <CurvedText
          y={-0.27}
          radius={1.5}
          fontSize={0.245}
          color={accent}
          depthColor={depth}
          delay={0.34}
          lag={1}
          reduceMotion={reduceMotion}
        >
          y crecimiento
        </CurvedText>
        <CurvedText
          y={-0.56}
          radius={1.46}
          fontSize={0.12}
          color="#f3f8ff"
          depthColor={depth}
          delay={0.46}
          lag={1}
          reduceMotion={reduceMotion}
        >
          El Net te ayuda
        </CurvedText>
      </group>

      <group ref={arrow} position={[0, -0.52, 1.42]} visible={reduceMotion}>
        <Line points={[[-0.78, -0.79, -0.01], [0.74, -0.79, -0.01]]} color={accent} lineWidth={1} transparent opacity={0.24} depthTest={false} />
        <Line points={growthPoints} color={accent} lineWidth={2.6} renderOrder={5} depthTest={false} />
        <Line points={[[0.43, -0.34, 0], [0.64, -0.34, 0], [0.61, -0.55, 0]]} color={accent} lineWidth={2.6} renderOrder={5} depthTest={false} />
        <mesh ref={tip} position={[0.64, -0.34, 0]} renderOrder={5}>
          <sphereGeometry args={[0.035, 20, 20]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} depthTest={false} depthWrite={false} />
        </mesh>
      </group>
    </>
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
        <Sphere
          args={[1.15, 96, 96]}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            playSphereVoice();
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <MeshDistortMaterial color="#2f6bff" distort={0.38} speed={2.2} roughness={0.15} metalness={0.6} />
        </Sphere>
        <GrowthMessage dark={dark} />
      </Float>
      <Torus ref={ring} args={[1.9, 0.035, 16, 120]}>
        <meshStandardMaterial color="#7cc4ff" emissive="#3a8bff" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} depthWrite={false} />
      </Torus>
      <Torus ref={ring2} args={[2.35, 0.02, 16, 120]} rotation={[1.2, 0, 0]}>
        <meshStandardMaterial color="#a9d8ff" emissive="#5aa9ff" emissiveIntensity={0.6} depthWrite={false} />
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
      aria-label="Esfera 3D con el mensaje Implementa tu fuerza desarrollo y crecimiento. El Net te ayuda"
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
