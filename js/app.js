import {
  html,
  useState,
  useEffect,
  useRef,
  X,
  useSt,
  DC,
  CH,
  CMD,
  SR,
  M,
} from "./utils.js";
import {
  Login,
  Calibration,
  Home,
  Tools,
  Learn,
  Voice,
  Done,
  RecForm,
} from "./views.js";
import { Icon } from "./components.js";
import { Portal } from "./portal.js";

export function App() {
  const [view, setView] = useState("login");
  const [role, setRole] = useState("siswa");
  const [page, setPage] = useState("dash");
  const [mod, setMod] = useState("cuci");
  const [ti, setTi] = useState(0);
  const [snd, setSnd] = useSt("bisa4:sound", true);
  const [mic, setMic] = useState(false);
  const [micError, setMicError] = useState("");
  const [micBusy, setMicBusy] = useState(false);
  const [sess, setSess] = useSt("bisa4:session", null);
  const [last, setLast] = useState(null);
  const [pend, setPend] = useState(null);
  const [cur, setCur] = useState(null);
  const [rec, setRec] = useState(null);
  const [tst, setTst] = useState(null);
  const [speaking, setSp] = useState(false);
  const [listening, setLi] = useState(false);
  const [afterSetup, setAfterSetup] = useState("home");
  const [cfg, setCfg] = useSt("bisa2:cfg", DC);
  const [hist, setHist] = useSt("bisa2:hist", []);
  const [notes, setNotes] = useSt("bisa2:notes", []);
  const [calls, setCalls] = useSt("bisa2:calls", []);
  const [voice, setVoice] = useSt("bisa3:voice", {
    ch: "kak",
    uri: "",
    rate: 1,
    pitch: 1,
  });
  const [scripts, setScripts] = useSt("bisa3:script", {});
  const recR = useRef(null),
    toastTimer = useRef(null),
    restartTimer = useRef(null);
  const want = useRef(false),
    lastAt = useRef(0),
    onCmd = useRef(() => {});
  const speakingRef = useRef(false),
    speechToken = useRef(0),
    microphoneRequest = useRef(0),
    liveView = useRef(view);
  liveView.current = view;
  const toast = (message) => {
    clearTimeout(toastTimer.current);
    setTst(message);
    toastTimer.current = setTimeout(() => setTst(null), 4200);
  };
  const speak = (text, options = {}) => {
    if (!text || (!snd && !options.force)) return;
    const synth = window.speechSynthesis;
    if (!synth || !window.SpeechSynthesisUtterance) {
      toast(
        "Panduan suara belum tersedia. Kamu tetap bisa membaca petunjuknya.",
      );
      return;
    }
    const token = ++speechToken.current;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const character = CH[options.ch || voice.ch] || CH.kak;
    const selected =
      synth.getVoices().find((v) => v.voiceURI === voice.uri) ||
      synth.getVoices().find((v) => /^id/i.test(v.lang));
    utterance.lang = "id-ID";
    if (selected) utterance.voice = selected;
    utterance.rate = Math.min(2, (voice.rate || 1) * character.rate);
    utterance.pitch = Math.min(2, (voice.pitch || 1) * character.pitch);
    speakingRef.current = true;
    setSp(true);
    utterance.onend = utterance.onerror = () => {
      if (token === speechToken.current) {
        speakingRef.current = false;
        setSp(false);
      }
    };
    try {
      synth.speak(utterance);
    } catch {
      speakingRef.current = false;
      setSp(false);
    }
  };
  const narr = (module, i, level, revealed) => {
    if (level === "mandiri" && !revealed) return "";
    const step = module.steps[i];
    return (
      scripts[module.id + i] ||
      (level === "ringkas" && !revealed ? step[1] : `${step[1]}. ${step[2]}`)
    );
  };
  const stopSpeech = () => {
    speechToken.current++;
    speakingRef.current = false;
    setSp(false);
    window.speechSynthesis?.cancel();
  };
  const stopRec = () => {
    want.current = false;
    clearTimeout(restartTimer.current);
    const current = recR.current;
    recR.current = null;
    if (current) {
      current.onend = null;
      try {
        current.abort();
      } catch {}
    }
    setLi(false);
  };
  const startRec = () => {
    if (!SR || recR.current || !want.current) return;
    const recognition = new SR();
    recR.current = recognition;
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => setLi(true);
    recognition.onresult = (event) => {
      if (speakingRef.current || !want.current) return;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        for (const [command, pattern] of Object.entries(CMD)) {
          if (!pattern.test(transcript)) continue;
          if (Date.now() - lastAt.current > 1500) {
            lastAt.current = Date.now();
            onCmd.current(command);
          }
          break;
        }
      }
    };
    recognition.onerror = (event) => {
      if (
        /not-allowed|service-not-allowed|audio-capture|network/.test(
          event.error,
        )
      ) {
        want.current = false;
        setMic(false);
        setLi(false);
        setMicError(
          event.error === "network"
            ? "Koneksi suara terputus. Coba lagi atau gunakan tombol."
            : "Mikrofon belum dapat digunakan. Periksa izin browser atau gunakan tombol.",
        );
      }
    };
    recognition.onend = () => {
      if (recR.current !== recognition) return;
      recR.current = null;
      setLi(false);
      if (want.current) restartTimer.current = setTimeout(startRec, 400);
    };
    try {
      recognition.start();
    } catch {
      recR.current = null;
      setMic(false);
      setMicError("Mikrofon belum dapat dimulai. Silakan coba lagi.");
    }
  };
  const enableMic = async () => {
    if (micBusy) return;
    if (!SR) {
      setMicError(
        "Browser ini belum mendukung perintah suara. Gunakan tombol, atau coba Chrome / Edge.",
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError(
        "Mikrofon memerlukan HTTPS atau localhost. Kamu tetap bisa menggunakan tombol.",
      );
      return;
    }
    const request = ++microphoneRequest.current;
    setMicBusy(true);
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      if (
        request === microphoneRequest.current &&
        ["learn", "voice"].includes(liveView.current)
      )
        setMic(true);
    } catch {
      if (request === microphoneRequest.current)
        setMicError(
          "Izin mikrofon belum diberikan. Izinkan lewat ikon di browser atau gunakan tombol.",
        );
    } finally {
      if (request === microphoneRequest.current) setMicBusy(false);
    }
  };
  onCmd.current = (command) => {
    if (view === "voice") setLast({ cmd: command, src: "suara" });
    else if (view === "learn" && !pend) setPend(command);
  };
  useEffect(() => {
    if (["learn", "voice"].includes(view) && mic && SR && !speaking && !pend) {
      want.current = true;
      startRec();
    } else stopRec();
    return stopRec;
  }, [view, mic, speaking, pend]);
  useEffect(() => {
    window.scrollTo(0, 0);
    const target = document.querySelector("main h1, main h2");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }, [view, page]);
  useEffect(() => {
    if (!pend || view !== "learn") return;
    const timer = setTimeout(() => run(pend, "suara"), 2200);
    return () => clearTimeout(timer);
  }, [pend, view]);
  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(restartTimer.current);
      microphoneRequest.current++;
      stopRec();
      window.speechSynthesis?.cancel();
    },
    [],
  );
  const go = (nextView, nextPage) => {
    microphoneRequest.current++;
    setMicBusy(false);
    setPend(null);
    setLast(null);
    stopSpeech();
    setView(nextView);
    if (nextPage) setPage(nextPage);
  };
  const enterRole = (nextRole, activity) => {
    setRole(nextRole);
    if (nextRole !== "siswa") return go("portal", "dash");
    if (activity) {
      setMod(activity);
      setTi(0);
    }
    const destination = activity ? "tools" : "home";
    setAfterSetup(destination);
    go(cfg.calibrated ? destination : "calibration");
  };
  const selectModule = (id) => {
    setMod(M(id).id);
    setTi(0);
    go("tools");
  };
  const startLearn = (id) => {
    const module = M(typeof id === "string" ? id : mod);
    setMod(module.id);
    setSess({
      mod: module.id,
      level: cfg.level,
      i: 0,
      log: [],
      help: module.steps.map(() => 0),
      start: Date.now(),
      reveal: false,
      rep: 0,
    });
    go("learn");
  };
  const callHelp = () => {
    setCalls((previous) => [...previous, Date.now()]);
    toast(
      "Permintaan bantuan dicatat. Panggil pendamping yang ada di dekatmu, ya.",
    );
  };
  const finish = (session) => {
    const module = M(session.mod);
    setHist((previous) =>
      [
        {
          id: session.start,
          mod: module.id,
          name: module.name,
          level: session.level,
          dur: Math.round((Date.now() - session.start) / 1000),
          cmds: session.log.length,
          voice: session.log.filter((l) => l.src === "suara").length,
          help: session.help.reduce((a, b) => a + b, 0),
          helps: session.help,
          steps: module.steps.map((step) => step[1]),
          obs: null,
          note: "",
          done: true,
        },
        ...previous,
      ].slice(0, 200),
    );
    setCur(session.start);
    setSess(null);
    go("done");
  };
  const run = (command, source = "tombol") => {
    setPend(null);
    if (!sess) return;
    const total = M(sess.mod).steps.length;
    if (command === "selesai" && sess.i < total - 1) {
      toast(
        "Masih ada langkah berikutnya. Pilih Lanjut untuk meneruskan latihan, ya.",
      );
      return;
    }
    const next = { ...sess, log: [...sess.log, { cmd: command, src: source }] };
    if (command === "selesai" || (command === "lanjut" && sess.i === total - 1))
      return finish(next);
    if (command === "lanjut") {
      next.i++;
      next.reveal = false;
      next.rep = 0;
    } else if (command === "kembali") {
      next.i = Math.max(0, sess.i - 1);
      next.reveal = false;
      next.rep = 0;
    } else if (command === "bantuan") {
      next.reveal = true;
      next.help = sess.help.map((h, i) => (i === sess.i ? h + 1 : h));
    } else if (command === "ulangi") next.rep = (sess.rep || 0) + 1;
    setSess(next);
    setView("learn");
  };
  const context = {
    view,
    go,
    role,
    setRole,
    enterRole,
    page,
    setPage,
    mod,
    setMod,
    selectModule,
    ti,
    setTi,
    snd,
    setSnd,
    mic,
    setMic,
    enableMic,
    micBusy,
    micError,
    sess,
    setSess,
    last,
    setLast,
    cur,
    rec,
    setRec,
    cfg,
    setCfg,
    hist,
    setHist,
    notes,
    setNotes,
    calls,
    setCalls,
    voice,
    setVoice,
    scripts,
    setScripts,
    speak,
    stopSpeech,
    speaking,
    narr,
    toast,
    listening,
    startLearn,
    run,
    callHelp,
    afterSetup,
  };
  const View =
    {
      login: Login,
      calibration: Calibration,
      home: Home,
      tools: Tools,
      learn: Learn,
      voice: Voice,
      done: Done,
      portal: Portal,
    }[view] || Login;
  return html`<${X.Provider} value=${context}>
    <${View} />
    ${pend &&
    view === "learn" &&
    html`<div class="command-confirm" role="status">
      <${Icon} name="mic" />
      <div>
        <strong>“${pend}” terdengar</strong
        ><span>Dijalankan sebentar lagi...</span>
      </div>
      <button class="btn w sm" onClick=${() => setPend(null)}>Batalkan</button>
    </div>`}
    ${rec && html`<${RecForm} key=${rec.id} />`}
    <div class="toast-region" aria-live="polite" aria-atomic="true">
      ${tst && html`<div class="tt"><${Icon} name="info" />${tst}</div>`}
    </div>
  <//>`;
}
