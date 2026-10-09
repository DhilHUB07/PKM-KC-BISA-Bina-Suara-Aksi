import {
  html,
  useState,
  useEffect,
  useX,
  M,
  MODS,
  today,
  fmt,
  duration,
  stars,
  starsToday,
  LV,
  OB,
  scrollTo,
} from "./utils.js";
import {
  Btn,
  Icon,
  Brand,
  HeroArt,
  Shell,
  MicBar,
  ModuleCards,
  ToolArt,
  Dialog,
  Footer,
} from "./components.js";

export function Login() {
  const { enterRole } = useX();
  const [menu, setMenu] = useState(false);
  const jump = (id) => {
    setMenu(false);
    scrollTo(id);
  };
  return html`<div class="landing">
    <a class="skip-link" href="#main-content">Lewati ke konten</a>
    <div class="landing-blue">
      <div class="site-container">
        <header class="landing-header">
          <${Brand}
            light=${true}
            onClick=${() => window.scrollTo({ top: 0, behavior: "smooth" })}
          /><button
            class="icon-button mobile-menu"
            aria-label="Buka navigasi"
            aria-expanded=${menu}
            onClick=${() => setMenu(!menu)}
          >
            <${Icon} name=${menu ? "close" : "menu"} />
          </button>
          <nav
            class=${"landing-nav " + (menu ? "nav-open" : "")}
            aria-label="Navigasi halaman"
          >
            <button onClick=${() => jump("aktivitas")}>Aktivitas</button
            ><button onClick=${() => jump("cara-belajar")}>Cara belajar</button
            ><button onClick=${() => jump("pilih-peran")}>
              Untuk pendamping</button
            ><${Btn} c="yellow sm" onClick=${() => jump("pilih-peran")}
              >Masuk<${Icon} name="arrow" size=${17}
            /><//>
          </nav>
        </header>
        <main id="main-content">
          <section class="landing-hero" aria-labelledby="hero-title">
            <div class="hero-copy">
              <span class="eyebrow hero-eyebrow"
                ><span class="status-dot" />TEMAN BELAJAR BINA DIRI</span
              >
              <h1 id="hero-title">
                Langkah kecil,<br />kemandirian <span>besar.</span>
              </h1>
              <p>
                Belajar merawat diri jadi lebih seru.<br
                  class="desktop-break"
                />
                Bersama BISA, anak bisa mencoba, mendengar, dan tumbuh dengan
                caranya sendiri.
              </p>
              <div class="hero-buttons">
                <${Btn} c="yellow" onClick=${() => enterRole("siswa")}
                  >Mulai belajar<${Icon} name="arrow" /><//
                ><button
                  class="hero-link"
                  onClick=${() => jump("cara-belajar")}
                >
                  <span
                    ><${Icon}
                      name="play"
                      size=${14}
                      fill="currentColor" /></span
                  >Kenali BISA
                </button>
              </div>
              <div class="hero-caption">
                <${Icon} name="heart" size=${16} />Dibuat untuk belajar tanpa
                terburu-buru.
              </div>
            </div>
            <${HeroArt} />
          </section>
          <div class="hero-features">
            ${[
              ["volume", "Panduan suara", "Dengarkan, lalu coba"],
              ["book", "Latihan bertahap", "Satu langkah dalam satu waktu"],
              ["group", "Dukungan pendamping", "Catat perkembangan bersama"],
            ].map(
              ([icon, title, desc]) =>
                html`<div key=${title}>
                  <span class="feature-symbol"
                    ><${Icon} name=${icon} size=${23} /></span
                  ><span><strong>${title}</strong><small>${desc}</small></span>
                </div>`,
            )}
          </div>
        </main>
      </div>
    </div>
    <div class="site-container">
      <section id="aktivitas" class="section activities-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">BELAJAR DARI KESEHARIAN</span>
            <h2>Hal kecil, kemampuan besar<span class="blue-dot">.</span></h2>
            <p>
              ${MODS.length === 3
                ? "Tiga"
                : MODS.length === 6
                  ? "Enam"
                  : MODS.length}
              aktivitas sederhana untuk mulai belajar mandiri.
            </p>
          </div>
          <span class="small-sticker"
            ><${Icon} name="spark" />Yuk, coba bersama!</span
          >
        </div>
        <${ModuleCards}
          modules=${MODS}
          onSelect=${(id) => enterRole("siswa", id)}
        />
      </section>
      <section id="cara-belajar" class="how-section">
        <div class="how-intro">
          <span class="eyebrow">MUDAH UNTUK DIMULAI</span>
          <h2>Belajar pelan-pelan.<br />Bisa, kok!</h2>
          <p>
            Setiap anak punya ritmenya sendiri. Kita ikuti satu langkah pada
            satu waktu.
          </p>
          <span class="how-doodle" aria-hidden="true">✺</span>
        </div>
        <ol class="how-steps">
          ${[
            [
              "Pilih aktivitasmu",
              "Mulai dari aktivitas yang ingin kamu coba hari ini.",
            ],
            [
              "Dengar dan praktikkan",
              "Kenali alatnya, lalu ikuti petunjuk satu per satu.",
            ],
            [
              "Rayakan usahamu",
              "Selesaikan latihan dan catat bersama pendamping.",
            ],
          ].map(
            ([title, desc], i) =>
              html`<li key=${title}>
                <span class="how-number">0${i + 1}</span>
                <div>
                  <h3>${title}</h3>
                  <p>${desc}</p>
                </div>
              </li>`,
          )}
        </ol>
      </section>
      <section id="pilih-peran" class="section roles-section">
        <div class="section-heading center">
          <span class="eyebrow">BISA UNTUK KITA SEMUA</span>
          <h2>Ayo, masuk ke ruangmu.</h2>
          <p>Pilih peran untuk mulai belajar atau mendampingi.</p>
        </div>
        <div class="role-grid">
          ${[
            [
              "siswa",
              "student",
              "Siswa",
              "Siap mencoba hal baru? Teman BISA menunggumu.",
              "Mulai petualangan",
              "blue",
            ],
            [
              "guru",
              "book",
              "Guru",
              "Lihat aktivitas dan sesuaikan panduan belajar.",
              "Ruang guru",
              "mint",
            ],
            [
              "ortu",
              "group",
              "Orang Tua",
              "Dampingi latihan dan catat kemajuan anak.",
              "Ruang orang tua",
              "peach",
            ],
          ].map(
            ([id, icon, name, desc, cta, color]) =>
              html`<button
                type="button"
                key=${id}
                class=${"role-card " + color}
                onClick=${() => enterRole(id)}
              >
                <span class="role-icon"
                  ><${Icon} name=${icon} size=${30}
                /></span>
                <h3>${name}</h3>
                <p>${desc}</p>
                <span class="role-link"
                  >${cta}<${Icon} name="arrow" size=${18}
                /></span>
              </button>`,
          )}
        </div>
        <p class="local-caption">
          <${Icon} name="info" size=${15} />Pilihan peran ini untuk mencoba
          BISA. Aktivitas tersimpan di browser yang sedang dipakai.
        </p>
      </section>
      <${Footer} />
    </div>
  </div>`;
}

export function Calibration() {
  const { cfg, setCfg, go, afterSetup } = useX();
  const [step, setStep] = useState(0),
    [child, setChild] = useState(cfg.child),
    [answers, setAnswers] = useState([]),
    [level, setLevel] = useState("penuh");
  const questions = [
    "Apakah anak dapat memilih tombol di layar sendiri?",
    "Apakah anak nyaman mengikuti instruksi suara sederhana?",
    "Apakah anak dapat mengikuti petunjuk singkat sampai selesai?",
  ];
  const finish = (chosen) => {
    setCfg({
      ...cfg,
      child: child.trim() || cfg.child,
      level: chosen,
      calibrated: true,
    });
    go(afterSetup);
  };
  const answer = (yes) => {
    const next = [...answers];
    next[step - 1] = yes;
    setAnswers(next);
    if (step === 3) {
      const sum = next.filter(Boolean).length;
      setLevel(sum === 3 ? "mandiri" : sum === 2 ? "ringkas" : "penuh");
    }
    setStep(step + 1);
  };
  return html`<div class="setup-page">
    <header class="site-container setup-header">
      <${Brand} onClick=${() => go("login")} /><span>Kenalan dengan BISA</span>
    </header>
    <main class="setup-main">
      <div class="setup-card">
        <span class="eyebrow">SEBELUM MULAI</span>${step === 0
          ? html`<h1>Kenalan dulu, yuk<span class="blue-dot">.</span></h1>
              <p class="mute">
                Pendamping, bantu isi nama panggilan anak dan pilih panduan yang
                paling nyaman.
              </p>
              <form
                onSubmit=${(event) => {
                  event.preventDefault();
                  if (child.trim()) setStep(1);
                }}
              >
                <label htmlFor="child-name">Nama panggilan anak</label
                ><input
                  id="child-name"
                  type="text"
                  value=${child}
                  onInput=${(event) => setChild(event.target.value)}
                  maxlength="30"
                  autocomplete="given-name"
                  placeholder="Contoh: Rian"
                  required
                /><${Btn} type="submit" c="full" disabled=${!child.trim()}
                  >Lanjut kenalan<${Icon} name="arrow"
                /><//>
              </form>`
          : step <= 3
            ? html`<div
                  class="setup-progress"
                  aria-label=${"Pertanyaan " + step + " dari 3"}
                >
                  ${questions.map(
                    (_, i) =>
                      html`<span key=${i} class=${i < step ? "on" : ""} />`,
                  )}
                </div>
                <p class="sm mute">
                  Pertanyaan ${step} dari 3 · Untuk pendamping
                </p>
                <h1 class="question-title">${questions[step - 1]}</h1>
                <div class="answer-options">
                  <${Btn} onClick=${() => answer(true)}
                    ><${Icon} name="check" />Ya, sudah bisa<//
                  ><${Btn} c="w" onClick=${() => answer(false)}
                    >Masih perlu bantuan<//
                  >
                </div>
                <button class="text-button" onClick=${() => setStep(step - 1)}>
                  <${Icon} name="back" size=${16} />Pertanyaan sebelumnya
                </button>`
            : html`<span class="setup-success"
                  ><${Icon} name="check" size=${30}
                /></span>
                <h1>Siap belajar, ${child.trim()}!</h1>
                <p class="mute">
                  Saran panduan awal sudah dipilih. Pendamping boleh
                  menggantinya sebelum mulai.
                </p>
                <div class="level-options">
                  ${LV.map(
                    ([id, label]) =>
                      html`<label
                        key=${id}
                        class=${"level-option " +
                        (level === id ? "selected" : "")}
                        ><input
                          type="radio"
                          name="setup-level"
                          checked=${level === id}
                          onChange=${() => setLevel(id)}
                          value=${id}
                        /><span
                          ><strong>${label}</strong
                          ><small
                            >${id === "penuh"
                              ? "Petunjuk lengkap dan panduan suara."
                              : id === "ringkas"
                                ? "Petunjuk singkat untuk tiap langkah."
                                : "Mencoba dulu, bantuan tetap tersedia."}</small
                          ></span
                        ></label
                      >`,
                  )}
                </div>
                <${Btn} c="full" onClick=${() => finish(level)}
                  >Ayo mulai<${Icon} name="arrow"
                /><//>`}${step < 4 &&
        html`<button
          class="text-button skip-setup"
          onClick=${() => finish("penuh")}
        >
          Lewati, gunakan panduan lengkap
        </button>`}
        <p class="setup-note">
          <${Icon} name="info" size=${16} />Pilihan ini mengatur bantuan latihan
          dan dapat diubah di ruang pendamping.
        </p>
      </div>
      <div class="setup-art">
        <${HeroArt} small=${true} />
        <p>
          Kamu belajar dengan caramu.<br /><strong
            >Kami temani setiap langkahnya.</strong
          >
        </p>
      </div>
    </main>
  </div>`;
}

export function Home() {
  const { cfg, hist, sess, go, selectModule, enterRole } = useX();
  const total = starsToday(hist),
    sessionsToday = hist.filter((h) => today(h.id)).length;
  return html`<${Shell} on="home"
    ><div class="page-eyebrow">
      <span class="eyebrow">RUANG BELAJARMU</span
      ><span class="sm mute">Selangkah demi selangkah, kita BISA.</span>
    </div>
    <section class="welcome-hero">
      <div>
        <span class="welcome-label"
          ><${Icon} name="spark" size=${18} />Halo, ${cfg.child}!</span
        >
        <h1>Siap mencoba<br />hal baru hari ini?</h1>
        <p>Tidak perlu terburu-buru.<br />Teman BISA akan menemanimu.</p>
        <${Btn}
          c="yellow"
          onClick=${() => (sess ? go("learn") : scrollTo("aktivitas-siswa"))}
          >${sess ? "Lanjutkan latihanku" : "Pilih aktivitasku"}<${Icon}
            name="arrow"
        /><//>
      </div>
      <${HeroArt} small=${true} />
    </section>
    <div class="home-metrics">
      <div>
        <span class="metric-symbol star-symbol"
          ><${Icon} name="star" size=${25} fill="currentColor" /></span
        ><span
          ><strong>${total}<small> / 10 bintang</small></strong
          ><span>Kemandirian hari ini</span></span
        >
      </div>
      <div>
        <span class="metric-symbol mint-symbol"
          ><${Icon} name="check" size=${25} /></span
        ><span
          ><strong>${sessionsToday}<small> latihan</small></strong
          ><span>Selesai hari ini</span></span
        >
      </div>
      <div>
        <span class="metric-symbol lilac-symbol"
          ><${Icon} name="volume" size=${25} /></span
        ><span
          ><strong
            >${LV.find((l) => l[0] === cfg.level)?.[1] ||
            "Panduan lengkap"}</strong
          ><span>Panduan belajarmu</span></span
        >
      </div>
    </div>
    ${sess &&
    html`<div class="resume-note">
      <span
        ><${Icon} name="book" /><strong>Latihanmu tersimpan:</strong> ${M(
          sess.mod,
        ).name},
        langkah ${sess.i + 1} dari ${M(sess.mod).steps.length}.</span
      ><button class="text-button" onClick=${() => go("learn")}>
        Lanjutkan<${Icon} name="arrow" size=${17} />
      </button>
    </div>`}
    <section id="aktivitas-siswa" class="section compact-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">MAU BELAJAR APA?</span>
          <h2>Pilih petualangan kecilmu.</h2>
          <p>Kenali alatnya, lalu coba satu langkah demi satu langkah.</p>
        </div>
      </div>
      <${ModuleCards}
        modules=${MODS}
        onSelect=${selectModule}
        history=${hist}
      />
    </section>
    <section class="star-journey">
      <div>
        <span class="metric-symbol star-symbol"
          ><${Icon} name="star" size=${25} fill="currentColor"
        /></span>
        <div>
          <h3>Bintang kemandirian hari ini</h3>
          <p>Didapat dari langkah mandiri yang dicatat pendamping.</p>
        </div>
        <span class="pill">${total} / 10</span>
      </div>
      <div class="star-track" aria-label=${total + " dari 10 bintang"}>
        ${Array.from(
          { length: 10 },
          (_, i) =>
            html`<span key=${i} class=${i < total ? "earned" : ""}
              ><${Icon}
                name="star"
                size=${28}
                fill=${i < total ? "currentColor" : "none"}
            /></span>`,
        )}
      </div>
    </section>
    ${hist.length > 0 &&
    html`<section class="recent-section">
      <div class="rowb">
        <h3>Usaha hebatmu sebelumnya</h3>
        <button class="text-button" onClick=${() => enterRole("ortu")}>
          Lihat bersama pendamping<${Icon} name="arrow" size=${16} />
        </button>
      </div>
      <div class="recent-list">
        ${hist.slice(0, 3).map(
          (h) =>
            html`<div key=${h.id}>
              <span class=${"recent-icon " + M(h.mod).color}
                ><${Icon} name="check" /></span
              ><span class="sp"
                ><strong>${h.name}</strong><small>${fmt(h.id)}</small></span
              ><span class=${"pill " + (h.obs ? "v" : "d")}
                >${h.obs ? "Pengamatan dicatat" : "Menunggu catatan"}</span
              >
            </div>`,
        )}
      </div>
    </section>`}
  <//>`;
}

function LessonPath({ phase }) {
  return html`<ol class="lesson-path" aria-label="Tahapan latihan">
    ${["Kenali alat", "Ayo praktik", "Selesai"].map(
      (name, i) =>
        html`<li
          key=${name}
          class=${i === phase ? "active" : i < phase ? "passed" : ""}
          aria-current=${i === phase ? "step" : undefined}
        >
          <span
            >${i < phase
              ? html`<${Icon} name="check" size=${14} />`
              : i + 1}</span
          >${name}
        </li>`,
    )}
  </ol>`;
}
export function Tools() {
  const { mod, ti, setTi, go, startLearn, speak } = useX();
  const module = M(mod),
    tool = module.tools[ti] || module.tools[0];
  const lastTool = ti === module.tools.length - 1;
  useEffect(() => {
    speak(tool[1] + ". " + tool[2]);
  }, [mod, ti]);
  return html`<${Shell} on="learn"
    ><button class="text-button back-link" onClick=${() => go("home")}>
      <${Icon} name="back" size=${17} />Daftar aktivitas
    </button>
    <div class="lesson-heading">
      <div>
        <span class="eyebrow">${module.name}</span>
        <h1>Kenali alatnya dulu, yuk.</h1>
        <p class="mute">Siapkan bersama pendamping sebelum mulai.</p>
      </div>
      <${LessonPath} phase=${0} />
    </div>
    <div class="tools-layout">
      <aside class="tools-sidebar">
        <h3>Alat yang kita perlukan</h3>
        <div class="tool-list">
          ${module.tools.map(
            (item, i) =>
              html`<button
                key=${item[0]}
                class=${ti === i ? "selected" : ""}
                aria-pressed=${ti === i}
                onClick=${() => setTi(i)}
              >
                <${ToolArt} id=${item[0]} /><span
                  ><small>Alat ${i + 1}</small><strong>${item[1]}</strong></span
                ><${Icon} name="chevron" size=${17} />
              </button>`,
          )}
        </div>
        <div class="soft-note">
          <${Icon} name="heart" /><span
            >Boleh dibantu pendamping. Kita siapkan bersama, ya.</span
          >
        </div>
      </aside>
      <section class=${"tool-stage " + module.color}>
        <span class="pill">Alat ${ti + 1} dari ${module.tools.length}</span
        ><${ToolArt} id=${tool[0]} large=${true} />
        <h2>${tool[1]}</h2>
        <p>${tool[2]}</p>
        <button
          class="listen-button"
          onClick=${() => speak(tool[1] + ". " + tool[2], { force: true })}
        >
          <${Icon} name="volume" />Dengarkan petunjuk
        </button>
        <div class="stage-actions">
          <${Btn} c="w" onClick=${() => (ti ? setTi(ti - 1) : go("home"))}
            ><${Icon} name="back" size=${17} />Kembali<//
          ><${Btn} onClick=${() => (lastTool ? startLearn() : setTi(ti + 1))}
            >${lastTool ? "Siap, mulai praktik!" : "Alat selanjutnya"}<${Icon}
              name="arrow"
              size=${18}
          /><//>
        </div>
      </section></div
  ><//>`;
}

export function Learn() {
  const { sess: session, run, speak, speaking, narr, go, callHelp } = useX();
  const module = M(session?.mod),
    index = session?.i || 0,
    step = module.steps[index] || module.steps[0];
  const hidden = session?.level === "mandiri" && !session.reveal;
  const detailed = session?.level === "penuh" || session?.reveal;
  useEffect(() => {
    if (session)
      speak(
        narr(module, index, session.level, session.reveal || session.rep > 0),
        { force: session.rep > 0 },
      );
  }, [index, session?.reveal, session?.rep, session?.mod]);
  if (!session)
    return html`<${Shell} on="learn"
      ><div class="empty-state">
        <${Icon} name="book" size=${45} />
        <h1>Ayo pilih aktivitas dulu.</h1>
        <p>Teman BISA siap menemanimu.</p>
        <${Btn} onClick=${() => go("home")}>Pilih aktivitas<//>
      </div><//
    >`;
  return html`<${Shell} on="learn"
    ><div class="rowb">
      <button class="text-button back-link" onClick=${() => go("home")}>
        <${Icon} name="back" size=${17} />Simpan & kembali</button
      ><span class="pill">${LV.find((l) => l[0] === session.level)?.[1]}</span>
    </div>
    <div class="lesson-heading">
      <div>
        <span class="eyebrow">AYO PRAKTIK</span>
        <h1>${module.name}</h1>
      </div>
      <${LessonPath} phase=${1} />
    </div>
    <div class="learning-layout">
      <section class="learning-stage">
        <div class="learning-stage-top">
          <span class="pill"
            >Langkah ${index + 1} dari ${module.steps.length}</span
          ><span class=${"narrator-status " + (speaking ? "talking" : "")}
            ><${Icon} name="volume" size=${16} />${speaking
              ? "Panduan dibacakan"
              : "Lanjut saat kamu siap"}</span
          >
        </div>
        <progress
          class="lesson-progress"
          value=${index + 1}
          max=${module.steps.length}
          aria-label="Posisi langkah latihan"
        />
        <div class=${"step-scene " + module.color}>
          <span class="step-big-number" aria-hidden="true">0${index + 1}</span
          ><${ToolArt} id=${module.stepTools[index]} large=${true} />
        </div>
        <div class="instruction" aria-live="polite">
          <h2>${hidden ? "Coba langkah ini sendiri, ya!" : step[1]}</h2>
          ${detailed
            ? html`<p>${step[2]}</p>`
            : html`<p>
                ${hidden
                  ? "Jika perlu petunjuk, pilih Bantuan. Teman BISA siap menemanimu."
                  : "Coba dulu, lalu lanjut saat kamu siap."}
              </p>`}
        </div>
      </section>
      <aside class="step-sidebar">
        <h3>Petualanganmu</h3>
        <ol>
          ${module.steps.map(
            (item, i) =>
              html`<li
                key=${i}
                class=${i < index
                  ? "done-step"
                  : i === index
                    ? "current-step"
                    : ""}
                aria-current=${i === index ? "step" : undefined}
              >
                <span
                  >${i < index
                    ? html`<${Icon} name="check" size=${16} />`
                    : i + 1}</span
                >
                <div>
                  <strong
                    >${session.level === "mandiri"
                      ? "Langkah " + (i + 1)
                      : item[1]}</strong
                  >${i === index && html`<small>Sedang kamu coba</small>`}
                </div>
              </li>`,
          )}
        </ol>
        <div class="soft-note">
          <${Icon} name="heart" /><span
            >Usahamu sudah hebat.<br />Tidak perlu cepat, ya.</span
          >
        </div>
      </aside>
    </div>
    <${MicBar} />
    <div class="lesson-controls">
      <${Btn} c="w" onClick=${() => run("bantuan")}
        ><${Icon} name="help" />Bantuan<//
      ><${Btn} c="w" onClick=${() => run("ulangi")}
        ><${Icon} name="refresh" />Ulangi suara<//
      ><${Btn} c="next-step" onClick=${() => run("lanjut")}
        >${index === module.steps.length - 1
          ? "Selesai latihan"
          : "Langkah selanjutnya"}<${Icon}
          name=${index === module.steps.length - 1 ? "check" : "arrow"}
      /><//>
    </div>
    <div class="lesson-secondary">
      <button
        class="text-button"
        disabled=${index === 0}
        onClick=${() => run("kembali")}
      >
        <${Icon} name="back" size=${16} />Langkah sebelumnya</button
      ><button class="text-button" onClick=${callHelp}>
        <${Icon} name="group" size=${17} />Minta pendamping
      </button>
    </div><//
  >`;
}

export function Voice() {
  const { last, setLast, sess, go, run, toast, listening } = useX();
  const command = typeof last === "string" ? { cmd: last, src: "suara" } : last;
  const apply = () => {
    setLast(null);
    if (sess) {
      go("learn");
      run(command.cmd, command.src);
    } else
      toast(
        command.src === "suara"
          ? `Perintah “${command.cmd}” dikenali. Kamu siap mencoba latihan.`
          : `Contoh perintah “${command.cmd}” sudah dicoba. Pilih aktivitas untuk memakainya.`,
      );
  };
  return html`<${Shell} on="voice"
    ><section class="voice-page">
      <span class="eyebrow">KENALI PERINTAH SUARA</span>
      <h1>Suaramu, kendalimu<span class="blue-dot">.</span></h1>
      <p class="mute">
        Aktifkan mikrofon, lalu ucapkan satu perintah dengan santai.
      </p>
      <div class=${"voice-illustration " + (listening ? "listening" : "")}>
        <img
          src="assets/bisa-friends.webp"
          alt="Teman BISA siap menemanimu"
          width="350"
          height="234"
        /><span class="voice-mic"><${Icon} name="mic" size=${30} /></span>
      </div>
      <${MicBar} />${command &&
      html`<div class="voice-result" role="status">
        <span class="eyebrow">PERINTAH SIAP</span>
        <h2>“${command.cmd}”</h2>
        <p>
          ${sess
            ? "Gunakan perintah ini di latihanmu?"
            : "Coba perintah ini sebelum mulai latihan."}
        </p>
        <div class="row">
          <${Btn} onClick=${apply}
            >${sess ? "Ya, gunakan" : "Coba perintah"}<${Icon}
              name="check"
              size=${18} /><//
          ><${Btn} c="w" onClick=${() => setLast(null)}>Ulangi<//>
        </div>
      </div>`}
      <div class="voice-commands">
        <h3>Empat perintah yang bisa kamu pakai</h3>
        <p class="sm mute">Tekan kartu untuk mencoba dengan tombol.</p>
        <div class="command-grid">
          ${[
            ["lanjut", "arrow", "Ke langkah berikutnya", "blue"],
            ["ulangi", "refresh", "Dengarkan sekali lagi", "mint"],
            ["bantuan", "help", "Tampilkan petunjuk", "lilac"],
            ["selesai", "check", "Akhiri di langkah terakhir", "peach"],
          ].map(
            ([id, icon, desc, color]) =>
              html`<button
                key=${id}
                class=${"voice-command " + color}
                onClick=${() => setLast({ cmd: id, src: "tombol" })}
              >
                <span><${Icon} name=${icon} size=${24} /></span
                ><strong>${id[0].toUpperCase() + id.slice(1)}</strong
                ><small>${desc}</small>
              </button>`,
          )}
        </div>
      </div>
      ${sess &&
      html`<button class="text-button" onClick=${() => go("learn")}>
        <${Icon} name="back" size=${16} />Kembali ke ${M(sess.mod).name}
      </button>`}
    </section><//
  >`;
}

export function Done() {
  const { cfg, hist, cur, go, startLearn, speak, setRec } = useX();
  const session = hist.find((h) => h.id === cur);
  useEffect(() => {
    if (session)
      speak(
        `Hebat, ${cfg.child}! Kamu sudah menyelesaikan latihan ${session.name}. Terima kasih sudah mencoba.`,
      );
  }, [cur]);
  if (!session)
    return html`<${Shell} on="home"
      ><div class="empty-state">
        <h1>Ayo mencoba lagi!</h1>
        <${Btn} onClick=${() => go("home")}>Kembali ke beranda<//>
      </div><//
    >`;
  return html`<${Shell} on="home"
    ><${LessonPath} phase=${2} />
    <section class="completion-page">
      <div class="completion-star" aria-hidden="true">
        <${Icon}
          name="star"
          size=${76}
          fill="currentColor"
        /><i /><i /><i /><i />
      </div>
      <span class="eyebrow">TERIMA KASIH SUDAH MENCOBA</span>
      <h1>Hebat, ${cfg.child}!</h1>
      <p class="completion-subtitle">
        Satu petualangan kecil selesai.<br />Usahamu hari ini berarti.
      </p>
      <div class="completion-stats">
        <div>
          <${Icon} name="book" /><strong>${session.name}</strong
          ><span>Aktivitasmu</span>
        </div>
        <div>
          <${Icon} name="check" /><strong
            >${session.steps.length} / ${session.steps.length} langkah</strong
          ><span>Selesai dicoba</span>
        </div>
        <div>
          <${Icon} name="clock" /><strong>${duration(session.dur)}</strong
          ><span>Waktu berlatih</span>
        </div>
      </div>
      <div class="coach-check">
        <span class="coach-icon"
          ><${Icon} name=${session.obs ? "star" : "pen"} size=${25}
        /></span>
        <div>
          <h3>
            ${session.obs
              ? `${stars(session)} bintang kemandirian`
              : "Catat bersama pendamping, yuk."}
          </h3>
          <p>
            ${session.obs
              ? session.note ||
                "Hasil pengamatan sudah tersimpan. Terima kasih sudah mendampingi."
              : "Pendamping dapat mencatat langkah yang dilakukan mandiri, dibantu, atau masih perlu dicoba."}
          </p>
        </div>
        <${Btn} c="w sm" onClick=${() => setRec(session)}
          >${session.obs ? "Lihat catatan" : "Isi pengamatan"}<//
        >
      </div>
      <div class="completion-actions">
        <${Btn} onClick=${() => go("home")}
          >Pilih aktivitas lain<${Icon} name="arrow" /><//
        ><${Btn} c="w" onClick=${() => startLearn(session.mod)}
          ><${Icon} name="refresh" />Coba sekali lagi<//
        >
      </div>
    </section><//
  >`;
}

export function RecForm() {
  const { rec: session, setRec, setHist, setNotes, cfg, role, toast } = useX();
  const [observations, setObservations] = useState(
    session.obs ? [...session.obs] : session.steps.map(() => ""),
  );
  const [note, setNote] = useState(session.note || "");
  const valid = observations.every(Boolean);
  const save = (event) => {
    event.preventDefault();
    if (!valid) return;
    setHist((previous) =>
      previous.map((h) =>
        h.id === session.id
          ? { ...h, obs: observations, note: note.trim() }
          : h,
      ),
    );
    if (note.trim() && note.trim() !== session.note)
      setNotes((previous) => [
        ...previous,
        {
          who: role === "guru" ? "Guru" : "Orang Tua",
          name: role === "guru" ? cfg.teacher : cfg.parent,
          text: note.trim(),
          t: Date.now(),
        },
      ]);
    setRec(null);
    toast("Pengamatan tersimpan. Terima kasih sudah mendampingi.");
  };
  return html`<${Dialog}
    id="observation"
    title="Pengamatan pendamping"
    onClose=${() => setRec(null)}
    wide=${true}
    ><p class="mute">
      ${session.name} · ${fmt(session.id)}<br />Pilih sesuai yang diamati saat
      anak berlatih.
    </p>
    <form onSubmit=${save}>
      <div class="observation-list">
        ${session.steps.map(
          (name, i) =>
            html`<fieldset key=${i}>
              <legend>
                ${i + 1}. ${name}<small
                  >Bantuan diminta ${session.helps?.[i] || 0} kali</small
                >
              </legend>
              <div class="observation-options">
                ${OB.map(
                  ([value, label]) =>
                    html`<label
                      key=${value}
                      class=${"obs-choice " +
                      (observations[i] === value ? "selected " + value : "")}
                      ><input
                        type="radio"
                        name=${"obs-" + i}
                        value=${value}
                        checked=${observations[i] === value}
                        onChange=${() =>
                          setObservations((previous) =>
                            previous.map((o, j) => (j === i ? value : o)),
                          )}
                        required
                      />${label}</label
                    >`,
                )}
              </div>
            </fieldset>`,
        )}
      </div>
      <label htmlFor="observation-note"
        >Catatan tambahan <span class="optional">(opsional)</span></label
      ><textarea
        id="observation-note"
        rows="3"
        value=${note}
        onInput=${(event) => setNote(event.target.value)}
        maxlength="2000"
        placeholder="Contoh: Hari ini sudah mau mencoba mengeringkan tangan sendiri."
      />
      <p class="sm mute">
        ${valid
          ? "Semua langkah sudah dicatat."
          : "Pilih hasil pengamatan untuk setiap langkah sebelum menyimpan."}
      </p>
      <div class="dialog-actions">
        <${Btn} c="w" onClick=${() => setRec(null)}>Batal<//
        ><${Btn} type="submit" disabled=${!valid}
          >Simpan pengamatan<${Icon} name="check" size=${18}
        /><//>
      </div></form
  ><//>`;
}
