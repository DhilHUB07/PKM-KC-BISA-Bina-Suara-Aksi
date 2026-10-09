import { ACTIVITIES } from "./activities.js";

export const {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useMemo,
} = React;
export const html = htm.bind((type, props, ...children) => {
  if (props?.class) {
    props = { ...props, className: props.class };
    delete props.class;
  }
  return React.createElement(type, props, ...children);
});
export const MODS = ACTIVITIES;
export const LV = [
  ["penuh", "Panduan lengkap"],
  ["ringkas", "Petunjuk ringkas"],
  ["mandiri", "Coba mandiri"],
];
export const OB = [
  ["m", "Mandiri"],
  ["d", "Dibantu"],
  ["b", "Belum bisa"],
];
export const CMD = {
  lanjut: /\b(lanjut|lanjutkan|berikutnya|next)\b/,
  ulangi: /\b(ulangi|ulang)\b/,
  bantuan: /\b(bantuan|bantu|tolong)\b/,
  selesai: /\b(selesai|sudah|udah)\b/,
};
export const CH = {
  kak: {
    n: "Kak Bisa",
    d: "Ceria dan penuh semangat",
    pitch: 1.35,
    rate: 0.92,
  },
  bu: { n: "Bu Guru", d: "Lembut dan sabar", pitch: 1.15, rate: 0.82 },
  pak: { n: "Pak Guru", d: "Tenang dan hangat", pitch: 0.8, rate: 0.86 },
  pel: { n: "Kak Pelangi", d: "Riang dan bersahabat", pitch: 1.6, rate: 1 },
};
export const DC = {
  child: "Rian",
  parent: "Bunda Dewi",
  teacher: "Bu Rahmawati",
  level: "penuh",
  calibrated: false,
};
export const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const memory = {};
export function ld(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value == null) return fallback;
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
    if (fallback && typeof fallback === "object")
      return typeof value === "object" && !Array.isArray(value)
        ? { ...fallback, ...value }
        : fallback;
    return value;
  } catch {
    return memory[key] ?? fallback;
  }
}
export function sv(key, value) {
  memory[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
export function useSt(key, fallback) {
  const [value, setValue] = useState(() => ld(key, fallback));
  return [
    value,
    (next) =>
      setValue((previous) => {
        const result = typeof next === "function" ? next(previous) : next;
        sv(key, result);
        return result;
      }),
  ];
}
export const M = (id) => MODS.find((m) => m.id === id) || MODS[0];
export const today = (time) =>
  new Date(time).toDateString() === new Date().toDateString();
export const fmt = (time) =>
  new Date(time).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
export const duration = (seconds) =>
  seconds < 60
    ? `${seconds} detik`
    : `${Math.floor(seconds / 60)} menit ${seconds % 60} detik`;
export const stars = (session) =>
  Array.isArray(session.obs) ? session.obs.filter((o) => o === "m").length : 0;
export const score = (session) =>
  session.obs?.length
    ? session.obs.reduce(
        (sum, o) => sum + (o === "m" ? 1 : o === "d" ? 0.5 : 0),
        0,
      ) / session.obs.length
    : null;
export const starsToday = (sessions) =>
  Math.min(
    10,
    sessions.filter((h) => today(h.id)).reduce((sum, h) => sum + stars(h), 0),
  );
export const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
export const X = createContext();
export const useX = () => useContext(X);
export function useVoices() {
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth?.getVoices() || []);
    update();
    synth?.addEventListener("voiceschanged", update);
    return () => synth?.removeEventListener("voiceschanged", update);
  }, []);
  return voices;
}
