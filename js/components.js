import {
  html,
  useX,
  useState,
  useEffect,
  useRef,
  SR,
  scrollTo,
} from "./utils.js";

const paths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  back: "M19 12H5m6-6-6 6 6 6",
  chevron: "m9 5 7 7-7 7",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  play: "m9 5 10 7-10 7Z",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
  mic: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8",
  volume: "m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
  muted: "m11 4-6 5H2v6h3l6 5Zm4 5 6 6m0-6-6 6",
  book: "M12 5v15M3 4h4a5 5 0 0 1 5 2 5 5 0 0 1 5-2h4v15h-4a5 5 0 0 0-5 2 5 5 0 0 0-5-2H3Z",
  student:
    "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21v-3a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v3",
  group:
    "M5 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0M1 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M16 4a3 3 0 0 1 0 6m2 3a5 5 0 0 1 5 5v3",
  help: "M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  info: "M12 11v6m0-10h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  clock: "M12 8v5l3 2M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  gear: "m9 3-1 3-3 1-2 3 2 2-1 3 2 3h3l2 3 3-1 2-3 3-1 1-3-2-2 1-3-2-3h-3l-2-2ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  chart: "M4 3v17h17M8 16v-5m5 5V6m5 10V9",
  message:
    "M4 3h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H8l-5 3V4a1 1 0 0 1 1-1Zm3 5h10M7 12h7",
  logout: "M9 3H4v18h5m5-14 5 5-5 5M8 12h13",
  refresh: "M20 7a8 8 0 0 0-14-2L3 8m0-5v5h5m-4 9a8 8 0 0 0 14 2l3-3m0 5v-5h-5",
  pen: "m14 4 6 6M4 20l4-1L21 6a2 2 0 0 0-3-3L5 16Zm0 0h7",
  bell: "M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3ZM10 21h4",
  plus: "M12 5v14M5 12h14",
  heart: "M12 21 3 12a5 5 0 0 1 9-5 5 5 0 0 1 9 5Z",
  spark: "m12 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z",
};
export function Icon({
  name = "star",
  size = 20,
  className = "",
  fill = "none",
}) {
  return html`<svg
    class=${"icon " + className}
    width=${size}
    height=${size}
    viewBox="0 0 24 24"
    fill=${fill}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d=${paths[name] || paths.star} />
  </svg>`;
}
export const Btn = ({ c = "", children, ...props }) =>
  html`<button type="button" ...${props} class=${"btn " + c}>
    ${children}
  </button>`;
export function Brand({ light = false, onClick }) {
  return html`<button
    type="button"
    class=${"brand " + (light ? "light" : "")}
    onClick=${onClick}
    aria-label="BISA, kembali ke halaman pembuka"
  >
    <span class="brand-mark"
      ><${Icon} name="spark" size=${27} fill="currentColor" /></span
    ><span>BISA<span class="brand-dot">.</span></span>
  </button>`;
}
export function HeroArt({ small = false }) {
  return html`<div
    class=${"hero-art " + (small ? "small-art" : "")}
    aria-hidden="true"
  >
    <span class="doodle doodle-one">✦</span
    ><span class="doodle doodle-two">✧</span
    ><img
      src="assets/bisa-friends.webp"
      alt=""
      width="1536"
      height="1024"
      fetchpriority=${small ? "auto" : "high"}
    />
    <div class="hero-bubble">
      <span class="bubble-star"
        ><${Icon} name="star" fill="currentColor" /></span
      >Kamu pasti BISA!
    </div>
  </div>`;
}
export function Mascot({ size = 160, onClick }) {
  const inner = html`<img
    src="assets/bisa-friends.webp"
    width=${size}
    height=${size}
    style=${{ width: size, height: size, objectFit: "contain" }}
    alt="Teman belajar BISA"
  />`;
  return onClick
    ? html`<button
        class="mascot-button"
        onClick=${onClick}
        aria-label="Dengarkan sapaan teman BISA"
      >
        ${inner}
      </button>`
    : inner;
}
export function Dialog({
  id = "bisa-dialog",
  title,
  onClose,
  children,
  wide = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement;
    document.body.style.overflow = "hidden";
    if (dialog.showModal) {
      if (!dialog.open) dialog.showModal();
    } else dialog.setAttribute("open", "");
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.();
    };
  }, []);
  return html`<dialog
    ref=${ref}
    class=${"dialog " + (wide ? "wide-dialog" : "")}
    aria-labelledby=${id + "-title"}
    onCancel=${(event) => {
      event.preventDefault();
      onClose();
    }}
    onClick=${(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        onClose();
    }}
  >
    <div class="dialog-header">
      <h2 id=${id + "-title"}>${title}</h2>
      <button class="icon-button" onClick=${onClose} aria-label="Tutup">
        <${Icon} name="close" />
      </button>
    </div>
    ${children}
  </dialog>`;
}
export function Footer({ light = false }) {
  const { go } = useX();
  return html`<footer class=${"footer " + (light ? "light-footer" : "")}>
    <div>
      <${Brand} onClick=${() => go("login")} />
      <p>Bina Interaktif Suara-Aksi</p>
    </div>
    <span
      >Setiap langkah kecil itu berarti.<span class="footer-heart"
        ><${Icon} name="heart" size=${16} /></span
    ></span>
  </footer>`;
}
export function Guide({ onClose }) {
  return html`<${Dialog}
    id="guide"
    title="Belajar dengan caramu"
    onClose=${onClose}
    ><p class="mute">
      Tidak perlu terburu-buru. Pendamping boleh membantu kapan saja.
    </p>
    <ol class="guide-list">
      <li>
        <strong>Pilih aktivitas</strong
        ><span>Kenali alat yang diperlukan sebelum mulai praktik.</span>
      </li>
      <li>
        <strong>Ikuti satu langkah</strong
        ><span>Baca atau dengarkan petunjuk, lalu coba di dunia nyata.</span>
      </li>
      <li>
        <strong>Lanjut saat siap</strong
        ><span
          >Gunakan tombol atau aktifkan mikrofon dan katakan “Lanjut”.</span
        >
      </li>
    </ol>
    <div class="soft-note">
      <${Icon} name="mic" />Perintah suara: Lanjut, Ulangi, Bantuan, Selesai.
    </div>
    <${Btn} onClick=${onClose} c="full">Sudah mengerti<//><//
  >`;
}
export function Shell({ on, children }) {
  const { cfg, go, sess, snd, setSnd, stopSpeech, toast } = useX();
  const [guide, setGuide] = useState(false);
  const nav = (destination) =>
    destination === "learn"
      ? go(sess ? "learn" : "home")
      : go(destination === "voice" ? "voice" : "home");
  return html`<div class="app-shell">
    <a class="skip-link" href="#main-content">Lewati ke konten</a>
    <header class="app-header">
      <div class="site-container header-inner">
        <${Brand} onClick=${() => go("login")} />
        <nav class="app-nav" aria-label="Navigasi utama">
          ${[
            ["home", "home", "Beranda"],
            ["learn", "book", "Latihan"],
            ["voice", "mic", "Suara"],
          ].map(
            ([id, icon, label]) =>
              html`<button
                key=${id}
                class=${on === id ? "active" : ""}
                aria-current=${on === id ? "page" : undefined}
                onClick=${() => nav(id)}
              >
                <${Icon} name=${icon} />${label}
              </button>`,
          )}
        </nav>
        <div class="header-actions">
          <button
            class="icon-button"
            aria-label=${snd
              ? "Matikan panduan suara"
              : "Aktifkan panduan suara"}
            aria-pressed=${snd}
            onClick=${() => {
              setSnd(!snd);
              if (snd) stopSpeech();
              toast(
                snd ? "Panduan suara dimatikan." : "Panduan suara diaktifkan.",
              );
            }}
          >
            <${Icon} name=${snd ? "volume" : "muted"} /></button
          ><button
            class="icon-button guide-trigger"
            onClick=${() => setGuide(true)}
            aria-label="Panduan penggunaan"
          >
            <${Icon} name="help" /></button
          ><button
            class="profile-button"
            onClick=${() => go("login")}
            title="Ganti peran"
          >
            <span class="avatar">${cfg.child.slice(0, 1).toUpperCase()}</span
            ><span>${cfg.child}</span><${Icon} name="chevron" size=${16} />
          </button>
        </div>
      </div>
    </header>
    <main id="main-content" class="site-container app-main" key=${on}>
      ${children}
    </main>
    <div class="site-container"><${Footer} /></div>
    ${guide && html`<${Guide} onClose=${() => setGuide(false)} />`}
  </div>`;
}
export function ModuleCards({ modules, onSelect, history = [] }) {
  return html`<div class="module-grid">
    ${modules.map((module, i) => {
      const completed = history.some((h) => h.mod === module.id && h.done);
      return html`<button
        type="button"
        key=${module.id}
        class=${"module-card " + module.color}
        onClick=${() => onSelect(module.id)}
        aria-label=${"Buka latihan " + module.name}
      >
        <div class="module-card-top">
          <span class="module-index">0${i + 1}</span
          ><span class=${"module-tag " + (completed ? "completed" : "")}
            >${completed
              ? html`<${Icon} name="check" size=${14} />Pernah dicoba`
              : "Bina diri"}</span
          >
        </div>
        <div class="module-visual">
          <img
            src=${"assets/module-" + module.id + ".svg"}
            alt=""
            width="320"
            height="220"
            loading="lazy"
          />
        </div>
        <div class="module-copy">
          <h3>${module.name}</h3>
          <p>${module.desc}</p>
          <div class="module-meta">
            <span
              ><${Icon} name="book" size=${15} />${module.steps.length}
              langkah</span
            ><span><${Icon} name="clock" size=${15} />${module.duration}</span>
          </div>
          <span class="module-action"
            >Ayo mulai<span><${Icon} name="arrow" size=${19} /></span
          ></span>
        </div>
      </button>`;
    })}
  </div>`;
}
export function ToolArt({ id, large = false }) {
  return html`<div class=${"tool-art " + (large ? "large-tool" : "")}>
    <img src=${"assets/tool-" + id + ".svg"} alt="" width="240" height="220" />
  </div>`;
}
export function ProgressCircle({ percent = 0, label = "Capaian" }) {
  const value = Math.max(0, Math.min(100, percent));
  return html`<div
    class="circle-prog"
    role="progressbar"
    aria-label=${label}
    aria-valuenow=${value}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--line)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--blue)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="263.9"
        strokeDashoffset=${263.9 * (1 - value / 100)}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div><strong>${value}%</strong><span>${label}</span></div>
  </div>`;
}
export function MicBar() {
  const { listening, mic, setMic, enableMic, micBusy, micError, speaking } =
    useX();
  return html`<div class=${"mic-bar " + (listening ? "is-listening" : "")}>
    <span class="mic-symbol"><${Icon} name="mic" size=${24} /></span>
    <div class="mic-copy" role="status">
      <strong
        >${listening
          ? "Aku mendengarkanmu"
          : mic
            ? speaking
              ? "Panduan sedang dibacakan"
              : "Mikrofon sedang bersiap"
            : "Mau memakai perintah suara?"}</strong
      ><span
        >${micError ||
        (listening
          ? "Katakan “Lanjut”, “Ulangi”, atau “Bantuan”."
          : mic
            ? "Tunggu sebentar, lalu ucapkan perintahmu."
            : SR
              ? "Aktifkan mikrofon saat kamu siap."
              : "Gunakan tombol di bawah untuk melanjutkan.")}</span
      >
    </div>
    ${listening &&
    html`<div class="waves" aria-hidden="true">
      <i /><i /><i /><i /><i />
    </div>`}<${Btn}
      c="w sm"
      disabled=${micBusy}
      onClick=${() => (mic ? setMic(false) : enableMic())}
      >${mic ? "Matikan" : micBusy ? "Meminta izin…" : "Aktifkan mikrofon"}<//
    >
  </div>`;
}
