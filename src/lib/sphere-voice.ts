/**
 * Voz de la esfera 3D del hero.
 *
 * Los navegadores sólo reproducen audio después de una interacción del
 * visitante, así que pedimos permiso con SweetAlert2: el clic en "Activar
 * sonido" desbloquea el audio (también en Safari) y la elección se guarda.
 */
const SRC = "/audio/vozesfera.mp3";
const STORAGE_KEY = "sphere-voice";

type Choice = "on" | "off";

let audio: HTMLAudioElement | null = null;
let enabled = false;

function getAudio() {
  if (!audio) {
    audio = new Audio(SRC);
    audio.preload = "auto";
  }
  return audio;
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* almacenamiento no disponible: sólo vale para esta visita */
  }
}

/** Reproduce la voz si está permitida; si ya está sonando no se encima. */
export function playSphereVoice() {
  if (!enabled) return;
  const el = getAudio();
  if (!el.paused) return;
  el.currentTime = 0;
  void el.play().catch(() => undefined);
}

/** Desbloquea el audio dentro del gesto del usuario (requisito de Safari/iOS). */
function unlock() {
  const el = getAudio();
  el.muted = true;
  void el
    .play()
    .then(() => {
      el.pause();
      el.currentTime = 0;
    })
    .catch(() => undefined)
    .finally(() => {
      el.muted = false;
    });
}

/**
 * Pide permiso una sola vez. Si el visitante ya lo concedió en otra visita, el
 * primer clic o toque en la página vuelve a desbloquear el audio sin preguntar.
 */
export async function requestSphereVoicePermission() {
  const stored = readChoice();
  if (stored === "off") return;
  if (stored === "on") {
    const reEnable = () => {
      enabled = true;
      unlock();
    };
    window.addEventListener("pointerdown", reEnable, { once: true });
    window.addEventListener("keydown", reEnable, { once: true });
    return;
  }

  const { default: Swal } = await import("sweetalert2");
  const dark = document.documentElement.classList.contains("dark");
  const result = await Swal.fire({
    title: "¿Activamos la voz?",
    text: "Pasa el mouse sobre la esfera para escuchar cómo EliteNet impulsa tu empresa.",
    icon: "question",
    iconColor: dark ? "#63e6ff" : "#2f6bff",
    showCancelButton: true,
    confirmButtonText: "Activar sonido",
    cancelButtonText: "Ahora no",
    reverseButtons: true,
    focusConfirm: true,
    background: dark ? "#0b1430" : "#ffffff",
    color: dark ? "#f3f8ff" : "#0b1430",
    customClass: {
      popup: "sphere-voice-popup",
      confirmButton: "sphere-voice-confirm",
      cancelButton: "sphere-voice-cancel",
    },
    buttonsStyling: false,
    backdrop: "rgba(5, 12, 35, 0.55)",
    // El clic ocurre dentro del gesto del usuario: desbloquea aquí, no después del await.
    preConfirm: () => {
      enabled = true;
      unlock();
    },
  });

  if (result.isConfirmed) {
    saveChoice("on");
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    saveChoice("off");
  }
}
