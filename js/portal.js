import {
  html,
  useState,
  useX,
  useVoices,
  M,
  MODS,
  CH,
  today,
  fmt,
  duration,
  score,
  starsToday,
  LV,
  OB,
} from "./utils.js";
import { Btn, Icon, Brand, ProgressCircle, Dialog } from "./components.js";

export function Portal() {
  const { role, page, setPage, go, enterRole, cfg, calls, setCalls } = useX();
  const [showCalls, setShowCalls] = useState(false),
    [menu, setMenu] = useState(false);
  const teacher = role === "guru";
  const pages = [
    ["dash", "home", "Ringkasan"],
    ...(teacher ? [["siswa", "student", "Profil siswa"]] : []),
    ["akt", "chart", "Aktivitas"],
    ["buku", "message", "Buku penghubung"],
    ["set", "gear", "Pengaturan"],
  ];
  const selected = page === "detail" ? "siswa" : page;
  const Page =
    {
      dash: Dashboard,
      siswa: Students,
      detail: Students,
      akt: Activities,
      buku: Notebook,
      set: Settings,
    }[page] || Dashboard;
  const title = pages.find((p) => p[0] === selected)?.[2] || "Ringkasan";
  return html`<div class="portal-shell">
    <a class="skip-link" href="#main-content">Lewati ke konten</a>
    <aside class=${"portal-sidebar " + (menu ? "sidebar-open" : "")}>
      <${Brand} onClick=${() => go("login")} /><span class="portal-label"
        >RUANG ${teacher ? "GURU" : "ORANG TUA"}</span
      >
      <nav aria-label="Navigasi pendamping">
        ${pages.map(
          ([id, icon, label]) =>
            html`<button
              key=${id}
              class=${selected === id ? "active" : ""}
              aria-current=${selected === id ? "page" : undefined}
              onClick=${() => {
                setPage(id);
                setMenu(false);
              }}
            >
              <${Icon} name=${icon} />${label}
            </button>`,
        )}
      </nav>
      <div class="sidebar-tip">
        <span class="sidebar-tip-icon"
          ><${Icon} name="heart" size=${23}
        /></span>
        <h3>Langkah kecil berarti.</h3>
        <p>Berikan waktu dan dukungan untuk setiap usaha anak.</p>
        <button class="text-button" onClick=${() => enterRole("siswa")}>
          Dampingi latihan<${Icon} name="arrow" size=${16} />
        </button>
      </div>
      <button class="sidebar-exit" onClick=${() => go("login")}>
        <${Icon} name="logout" />Ganti peran
      </button>
    </aside>
    <div class="portal-body">
      <header class="portal-topbar">
        <div class="row">
          <button
            class="icon-button portal-menu"
            onClick=${() => setMenu(!menu)}
            aria-label="Buka menu pendamping"
            aria-expanded=${menu}
          >
            <${Icon} name=${menu ? "close" : "menu"} /></button
          ><span
            >Ruang ${teacher ? "guru" : "orang tua"}<span
              class="breadcrumb-divider"
              >/</span
            ><strong>${title}</strong></span
          >
        </div>
        <div class="header-actions">
          <button
            class="icon-button notification-button"
            onClick=${() => setShowCalls(true)}
            aria-label=${calls.length
              ? calls.length + " permintaan bantuan tercatat"
              : "Lihat permintaan bantuan"}
          >
            <${Icon} name="bell" />${calls.length > 0 && html`<i />`}</button
          ><span class="avatar"
            >${(teacher ? cfg.teacher : cfg.parent)
              .slice(0, 1)
              .toUpperCase()}</span
          >
          <div class="portal-user">
            <strong>${teacher ? cfg.teacher : cfg.parent}</strong
            ><span>${teacher ? "Guru pendamping" : "Orang tua"}</span>
          </div>
        </div>
      </header>
      <main id="main-content" class="portal-main">
        <${Page} />
        <div class="portal-data-note">
          <${Icon} name="info" size=${14} />Catatan di ruang ini tersimpan pada
          browser yang sama.
        </div>
      </main>
    </div>
    ${showCalls &&
    html`<${Dialog}
      id="help-calls"
      title="Permintaan bantuan"
      onClose=${() => setShowCalls(false)}
      >${calls.length
        ? html`<p class="mute">
              Anak meminta pendamping di sesi latihan. Periksa apakah anak
              membutuhkan bantuan langsung.
            </p>
            <ul class="call-list">
              ${calls
                .slice(-10)
                .reverse()
                .map(
                  (time, i) =>
                    html`<li key=${time + ":" + i}>
                      <${Icon} name="group" /><span
                        ><strong>${cfg.child} meminta pendamping</strong
                        ><small>${fmt(time)}</small></span
                      >
                    </li>`,
                )}
            </ul>
            <${Btn}
              c="full"
              onClick=${() => {
                setCalls([]);
                setShowCalls(false);
              }}
              >Sudah diperiksa<//
            >`
        : html`<div class="empty-state small-empty">
            <${Icon} name="bell" size=${35} />
            <p>Belum ada permintaan bantuan.</p>
          </div>`}<//
    >`}
  </div>`;
}
function PageHeading({ eyebrow, title, description, children }) {
  return html`<div class="portal-page-heading">
    <div>
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
    ${children}
  </div>`;
}
function EmptyState({ title, description, icon = "book", action }) {
  return html`<div class="empty-state">
    <span class="empty-icon"><${Icon} name=${icon} size=${30} /></span>
    <h3>${title}</h3>
    <p>${description}</p>
    ${action}
  </div>`;
}
function Dashboard() {
  const { role, cfg, hist, setPage, enterRole } = useX();
  const recorded = hist.filter((h) => h.obs),
    latest = recorded[0],
    latestScore = latest ? Math.round(score(latest) * 100) : null;
  const pending = hist.filter((h) => !h.obs).length;
  return html`<${PageHeading}
      eyebrow="TUMBUH BERSAMA BISA"
      title=${"Halo, " + (role === "guru" ? cfg.teacher : cfg.parent) + "!"}
      description=${"Mari lihat langkah kecil " +
      cfg.child +
      " menuju kemandirian."}
      ><${Btn} c="w sm" onClick=${() => enterRole("siswa")}
        ><${Icon} name="play" size=${16} />Dampingi latihan<//
      ><//
    >
    <div class="portal-banner">
      <div>
        <span class="pill">SETIAP USAHA BERARTI</span>
        <h2>Kemandirian tumbuh<br />dari latihan sehari-hari.</h2>
        <p>Berikan kesempatan untuk mencoba. Bantu saat diperlukan.</p>
        <button class="text-button" onClick=${() => setPage("set")}>
          Sesuaikan panduan<${Icon} name="arrow" size=${17} />
        </button>
      </div>
      <img src="assets/bisa-friends.webp" alt="" width="340" height="227" />
    </div>
    <div class="portal-stat-grid">
      ${[
        ["book", hist.length, "Latihan selesai", "blue"],
        ["pen", pending, "Menunggu pengamatan", "peach"],
        [
          "star",
          starsToday(hist) + " / 10",
          "Bintang mandiri hari ini",
          "mint",
        ],
      ].map(
        ([icon, value, label, color]) =>
          html`<div key=${label} class="portal-stat">
            <span class=${"stat-icon " + color}
              ><${Icon} name=${icon} size=${23}
            /></span>
            <div><strong>${value}</strong><span>${label}</span></div>
          </div>`,
      )}
    </div>
    <div class="portal-dashboard-grid">
      <section class="panel">
        <div class="panel-heading">
          <h3>Aktivitas terbaru</h3>
          <button class="text-button" onClick=${() => setPage("akt")}>
            Lihat semua<${Icon} name="arrow" size=${15} />
          </button>
        </div>
        ${hist.length
          ? html`<div class="dashboard-activity-list">
              ${hist.slice(0, 4).map(
                (h) =>
                  html`<button key=${h.id} onClick=${() => setPage("akt")}>
                    <span class=${"recent-icon " + M(h.mod).color}
                      ><${Icon} name="book" /></span
                    ><span class="sp"
                      ><strong>${h.name}</strong
                      ><small>${fmt(h.id)}</small></span
                    ><span class=${"pill " + (h.obs ? "v" : "d")}
                      >${h.obs ? "Dicatat" : "Perlu catatan"}</span
                    >
                  </button>`,
              )}
            </div>`
          : html`<${EmptyState}
              title="Petualangan belum dimulai"
              description="Selesai berlatih, aktivitas anak akan muncul di sini."
              action=${html`<${Btn} c="w sm" onClick=${() => enterRole("siswa")}
                >Mulai bersama anak<${Icon} name="arrow" size=${15}
              /><//>`}
            />`}
      </section>
      <section class="panel learner-overview">
        <div class="panel-heading">
          <h3>Profil belajar</h3>
          <span class="avatar">${cfg.child.slice(0, 1).toUpperCase()}</span>
        </div>
        <h2>${cfg.child}</h2>
        <p class="sm mute">${LV.find((l) => l[0] === cfg.level)?.[1]}</p>
        <${ProgressCircle} percent=${latestScore || 0} label="Capaian" />
        <p class="progress-caption">
          ${latest
            ? "Capaian pengamatan terbaru pada latihan " + latest.name + "."
            : "Capaian muncul setelah hasil pengamatan dicatat."}
        </p>
        <button
          class="text-button"
          onClick=${() => setPage(role === "guru" ? "siswa" : "set")}
        >
          ${role === "guru"
            ? "Lihat profil siswa"
            : "Atur profil belajar"}<${Icon} name="arrow" size=${15} />
        </button>
      </section>
    </div>
    <section class="panel daily-tip">
      <span class="metric-symbol mint-symbol"
        ><${Icon} name="heart" size=${25}
      /></span>
      <div>
        <h3>Rayakan prosesnya.</h3>
        <p>
          Berikan pujian untuk usaha anak, termasuk saat ia masih memerlukan
          bantuan.
        </p>
      </div>
    </section>`;
}
function Students() {
  const { cfg, setCfg, hist, notes, setPage } = useX();
  const latest = hist.find((h) => h.obs),
    percent = latest ? Math.round(score(latest) * 100) : 0;
  const note = [...notes].reverse().find((n) => n.who === "Guru");
  return html`<${PageHeading}
      eyebrow="PROFIL BELAJAR"
      title=${cfg.child}
      description="Sesuaikan bantuan berdasarkan pengamatan pendamping."
    />
    <section class="panel student-profile">
      <span class="large-avatar">${cfg.child.slice(0, 1).toUpperCase()}</span>
      <div class="sp">
        <span class="pill">SISWA</span>
        <h2>${cfg.child}</h2>
        <p class="mute sm">Guru: ${cfg.teacher} · Orang tua: ${cfg.parent}</p>
      </div>
      <${ProgressCircle} percent=${percent} label="Capaian" />
    </section>
    <section class="panel">
      <div class="panel-heading">
        <h3>Panduan belajar</h3>
        <span class="pill">Berlaku pada sesi berikutnya</span>
      </div>
      <p class="sm mute">
        Pilih seberapa banyak petunjuk yang diberikan saat berlatih.
      </p>
      <div class="settings-levels">
        ${LV.map(
          ([id, label]) =>
            html`<button
              key=${id}
              class=${cfg.level === id ? "selected" : ""}
              aria-pressed=${cfg.level === id}
              onClick=${() => setCfg({ ...cfg, level: id })}
            >
              <span class="level-dot"
                >${cfg.level === id &&
                html`<${Icon} name="check" size=${13} />`}</span
              ><strong>${label}</strong
              ><small
                >${id === "penuh"
                  ? "Teks lengkap dan panduan suara"
                  : id === "ringkas"
                    ? "Petunjuk singkat untuk tiap langkah"
                    : "Mencoba sendiri, bantuan tersedia"}</small
              >
            </button>`,
        )}
      </div>
    </section>
    <div class="two-panels">
      <section class="panel">
        <h3>Ringkasan latihan</h3>
        <dl class="detail-list">
          <div>
            <dt>Sesi selesai</dt>
            <dd>${hist.length}</dd>
          </div>
          <div>
            <dt>Pengamatan dicatat</dt>
            <dd>${hist.filter((h) => h.obs).length}</dd>
          </div>
          <div>
            <dt>Aktivitas terakhir</dt>
            <dd>${hist[0]?.name || "Belum berlatih"}</dd>
          </div>
        </dl>
        <button class="text-button" onClick=${() => setPage("akt")}>
          Lihat aktivitas<${Icon} name="arrow" size=${15} />
        </button>
      </section>
      <section class="panel">
        <h3>Catatan guru terbaru</h3>
        <p class="profile-note">
          ${note?.text ||
          "Belum ada catatan. Ceritakan perkembangan anak setelah mendampingi latihan."}
        </p>
        <button class="text-button" onClick=${() => setPage("buku")}>
          Buka buku penghubung<${Icon} name="arrow" size=${15} />
        </button>
      </section>
    </div>`;
}
function Activities() {
  const { hist, setRec, enterRole } = useX();
  const [filter, setFilter] = useState("all");
  const sessions = hist.filter(
    (h) =>
      filter === "all" || (filter === "pending" && !h.obs) || h.mod === filter,
  );
  return html`<${PageHeading}
      eyebrow="SETIAP USAHA TERCATAT"
      title="Aktivitas belajar"
      description="Tinjau latihan dan catat pengamatan untuk tiap langkah."
    />
    <div class="filter-tabs" aria-label="Filter aktivitas">
      ${[
        ["all", "Semua"],
        ...MODS.map((m) => [m.id, m.name]),
        ["pending", "Perlu catatan"],
      ].map(
        ([id, label]) =>
          html`<button
            key=${id}
            class=${filter === id ? "selected" : ""}
            aria-pressed=${filter === id}
            onClick=${() => setFilter(id)}
          >
            ${label}
          </button>`,
      )}
    </div>
    <div class="activities-list">
      ${sessions.length
        ? sessions.map(
            (h) =>
              html`<article key=${h.id} class="panel activity-panel">
                <div class="activity-heading">
                  <span class=${"recent-icon " + M(h.mod).color}
                    ><${Icon} name="book"
                  /></span>
                  <div class="sp">
                    <h3>${h.name}</h3>
                    <p>${fmt(h.id)} · ${duration(h.dur)}</p>
                  </div>
                  <span class=${"pill " + (h.obs ? "v" : "d")}
                    >${h.obs ? "Pengamatan dicatat" : "Menunggu catatan"}</span
                  >
                </div>
                <div class="activity-meta">
                  <span
                    ><${Icon} name="help" size=${14} />Bantuan ${h.help}
                    kali</span
                  ><span
                    ><${Icon} name="mic" size=${14} />Perintah suara ${h.voice}
                    kali</span
                  ><span
                    ><${Icon} name="volume" size=${14} />${LV.find(
                      (l) => l[0] === h.level,
                    )?.[1] || h.level}</span
                  >
                </div>
                ${h.obs &&
                html`<div class="observation-summary">
                    ${h.steps.map(
                      (name, i) =>
                        html`<div key=${i}>
                          <span>${i + 1}. ${name}</span
                          ><span class=${"pill " + h.obs[i]}
                            >${OB.find((o) => o[0] === h.obs[i])?.[1] ||
                            "Belum dicatat"}</span
                          >
                        </div>`,
                    )}
                  </div>
                  ${h.note && html`<p class="activity-note">${h.note}</p>`}`}
                <div class="activity-actions">
                  <${Btn} c="w sm" onClick=${() => setRec(h)}
                    ><${Icon} name="pen" size=${15} />${h.obs
                      ? "Ubah pengamatan"
                      : "Isi pengamatan"}<//
                  >${h.obs &&
                  html`<span class="sm mute"
                    >Capaian ${Math.round(score(h) * 100)}%</span
                  >`}
                </div>
              </article>`,
          )
        : html`<section class="panel">
            <${EmptyState}
              title=${hist.length
                ? "Belum ada aktivitas di pilihan ini"
                : "Belum ada latihan selesai"}
              description=${hist.length
                ? "Coba pilihan lain untuk melihat aktivitas anak."
                : "Mulai satu aktivitas bersama anak, lalu catat hasil pengamatannya."}
              action=${!hist.length &&
              html`<${Btn} c="w sm" onClick=${() => enterRole("siswa")}
                >Dampingi latihan<${Icon} name="arrow" size=${15}
              /><//>`}
            />
          </section>`}
    </div>`;
}
function Notebook() {
  const { notes, setNotes, cfg, role, toast } = useX();
  const [text, setText] = useState("");
  const save = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    setNotes((previous) => [
      ...previous,
      {
        who: role === "guru" ? "Guru" : "Orang Tua",
        name: role === "guru" ? cfg.teacher : cfg.parent,
        text: text.trim(),
        t: Date.now(),
      },
    ]);
    setText("");
    toast("Catatan tersimpan di buku penghubung.");
  };
  return html`<${PageHeading}
      eyebrow="MENDAMPINGI BERSAMA"
      title="Buku penghubung"
      description="Catat kabar dan perkembangan anak untuk pendamping lain di browser ini."
    />
    <section class="panel notebook-compose">
      <h3>Bagaimana latihan hari ini?</h3>
      <form onSubmit=${save}>
        <label htmlFor="new-note">Catatan perkembangan</label
        ><textarea
          id="new-note"
          rows="3"
          value=${text}
          onInput=${(event) => setText(event.target.value)}
          maxlength="2000"
          placeholder="Ceritakan usaha anak, hal yang sudah bisa, atau dukungan yang diperlukan."
          required
        />
        <div class="compose-bottom">
          <span class="sm mute"
            >Dicatat oleh ${role === "guru" ? cfg.teacher : cfg.parent}</span
          ><${Btn} type="submit" c="sm" disabled=${!text.trim()}
            ><${Icon} name="plus" size=${17} />Simpan catatan<//
          >
        </div>
      </form>
    </section>
    <div class="notebook-list">
      ${notes.length
        ? [...notes].reverse().map(
            (note, i) =>
              html`<article key=${note.t + ":" + i} class="panel note-card">
                <div class="rowb">
                  <div class="row">
                    <span
                      class=${"note-avatar " +
                      (note.who === "Guru" ? "mint" : "peach")}
                      >${note.name.slice(0, 1).toUpperCase()}</span
                    >
                    <div>
                      <strong>${note.name}</strong
                      ><span
                        class=${"pill " + (note.who === "Guru" ? "v" : "d")}
                        >${note.who}</span
                      >
                    </div>
                  </div>
                  <span class="sm mute">${fmt(note.t)}</span>
                </div>
                <p>${note.text}</p>
              </article>`,
          )
        : html`<section class="panel">
            <${EmptyState}
              icon="message"
              title="Hal kecil layak diceritakan"
              description="Catatan pertama akan muncul di sini setelah disimpan."
            />
          </section>`}
    </div>`;
}
function Settings() {
  const {
    cfg,
    setCfg,
    voice,
    setVoice,
    scripts,
    setScripts,
    setHist,
    setNotes,
    setCalls,
    setSess,
    speak,
    toast,
  } = useX();
  const voices = useVoices();
  const [form, setForm] = useState({ ...cfg }),
    [sound, setSound] = useState({ ...voice }),
    [narrations, setNarrations] = useState({ ...scripts }),
    [module, setModule] = useState("cuci"),
    [reset, setReset] = useState(false);
  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });
  const valid = [form.child, form.parent, form.teacher].every((value) =>
    value.trim(),
  );
  const save = (event) => {
    event.preventDefault();
    if (!valid) return;
    setCfg({
      ...form,
      child: form.child.trim(),
      parent: form.parent.trim(),
      teacher: form.teacher.trim(),
    });
    setVoice(sound);
    setScripts(narrations);
    toast("Profil dan panduan belajar tersimpan.");
  };
  return html`<${PageHeading}
      eyebrow="BELAJAR SESUAI KEBUTUHAN"
      title="Pengaturan"
      description="Atur profil, tingkat bantuan, dan panduan suara anak."
    />
    <form class="settings-form" onSubmit=${save}>
      <section class="panel">
        <div class="settings-section-heading">
          <span class="stat-icon blue"><${Icon} name="student" /></span>
          <div>
            <h3>Profil pendampingan</h3>
            <p>Nama ini digunakan dalam sapaan dan catatan.</p>
          </div>
        </div>
        <div class="form-grid">
          <div>
            <label htmlFor="profile-child">Nama panggilan anak</label
            ><input
              id="profile-child"
              type="text"
              value=${form.child}
              onInput=${update("child")}
              maxlength="30"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-parent">Nama orang tua</label
            ><input
              id="profile-parent"
              type="text"
              value=${form.parent}
              onInput=${update("parent")}
              maxlength="60"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-teacher">Nama guru</label
            ><input
              id="profile-teacher"
              type="text"
              value=${form.teacher}
              onInput=${update("teacher")}
              maxlength="60"
              required
            />
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="settings-section-heading">
          <span class="stat-icon mint"><${Icon} name="book" /></span>
          <div>
            <h3>Tingkat bantuan</h3>
            <p>Perubahan digunakan saat sesi latihan baru dimulai.</p>
          </div>
        </div>
        <div class="settings-levels">
          ${LV.map(
            ([id, label]) =>
              html`<label key=${id} class=${form.level === id ? "selected" : ""}
                ><input
                  type="radio"
                  name="settings-level"
                  value=${id}
                  checked=${form.level === id}
                  onChange=${() => setForm({ ...form, level: id })}
                /><strong>${label}</strong
                ><small
                  >${id === "penuh"
                    ? "Panduan suara dan petunjuk lengkap"
                    : id === "ringkas"
                      ? "Petunjuk singkat setiap langkah"
                      : "Coba sendiri, bantuan tetap tersedia"}</small
                ></label
              >`,
          )}
        </div>
      </section>
      <section class="panel">
        <div class="settings-section-heading">
          <span class="stat-icon lilac"><${Icon} name="volume" /></span>
          <div>
            <h3>Panduan suara</h3>
            <p>Pilihan dan kualitas suara mengikuti dukungan perangkat.</p>
          </div>
        </div>
        <div class="form-grid">
          <div>
            <label htmlFor="voice-character">Gaya suara</label
            ><select
              id="voice-character"
              value=${sound.ch}
              onChange=${(event) =>
                setSound({ ...sound, ch: event.target.value })}
            >
              ${Object.entries(CH).map(
                ([id, character]) =>
                  html`<option key=${id} value=${id}>
                    ${character.n} · ${character.d}
                  </option>`,
              )}
            </select>
          </div>
          <div>
            <label htmlFor="voice-system">Suara perangkat</label
            ><select
              id="voice-system"
              value=${sound.uri}
              onChange=${(event) =>
                setSound({ ...sound, uri: event.target.value })}
            >
              <option value="">
                Otomatis · Bahasa Indonesia jika tersedia
              </option>
              ${voices.map(
                (v) =>
                  html`<option key=${v.voiceURI} value=${v.voiceURI}>
                    ${v.name} (${v.lang})
                  </option>`,
              )}
            </select>
          </div>
        </div>
        <label htmlFor="voice-rate"
          >Kecepatan panduan
          <span class="optional">${Number(sound.rate).toFixed(1)}×</span></label
        ><input
          id="voice-rate"
          type="range"
          min="0.6"
          max="1.4"
          step="0.1"
          value=${sound.rate}
          onInput=${(event) =>
            setSound({ ...sound, rate: Number(event.target.value) })}
        />
        <div class="range-labels">
          <span>Lebih pelan</span><span>Lebih cepat</span>
        </div>
        <button
          type="button"
          class="text-button"
          onClick=${() =>
            speak(
              "Halo! Teman BISA siap menemanimu belajar. Kita coba satu langkah dulu, ya.",
              { force: true },
            )}
        >
          <${Icon} name="volume" size=${16} />Dengarkan suara yang tersimpan
        </button>
        <details class="narration-details">
          <summary>Sesuaikan kalimat panduan</summary>
          <p class="sm mute">Kosongkan untuk menggunakan petunjuk bawaan.</p>
          <label htmlFor="narration-module">Aktivitas</label
          ><select
            id="narration-module"
            value=${module}
            onChange=${(event) => setModule(event.target.value)}
          >
            ${MODS.map(
              (m) => html`<option key=${m.id} value=${m.id}>${m.name}</option>`,
            )}</select
          >${M(module).steps.map(
            (step, i) =>
              html`<div key=${module + i}>
                <label htmlFor=${"narration-" + i}>${i + 1}. ${step[1]}</label
                ><textarea
                  id=${"narration-" + i}
                  rows="2"
                  maxlength="600"
                  value=${narrations[module + i] || ""}
                  placeholder=${step[1] + ". " + step[2]}
                  onInput=${(event) =>
                    setNarrations({
                      ...narrations,
                      [module + i]: event.target.value,
                    })}
                />
              </div>`,
          )}
        </details>
      </section>
      <div class="settings-save">
        <p>Perubahan disimpan setelah tombol ditekan.</p>
        <${Btn} type="submit" disabled=${!valid}
          >Simpan perubahan<${Icon} name="check" size=${18}
        /><//>
      </div>
    </form>
    <section class="panel reset-panel">
      <div>
        <h3>Mulai catatan baru</h3>
        <p>
          Hapus riwayat latihan, pengamatan, dan buku penghubung pada browser
          ini.
        </p>
      </div>
      <${Btn} c="r sm" onClick=${() => setReset(true)}>Hapus riwayat<//>
    </section>
    ${reset &&
    html`<${Dialog}
      id="reset-history"
      title="Hapus semua catatan latihan?"
      onClose=${() => setReset(false)}
      ><p class="mute">
        Riwayat, buku penghubung, permintaan bantuan, dan sesi yang tersimpan
        akan dihapus. Profil dan pengaturan suara tetap tersedia.
      </p>
      <div class="dialog-actions">
        <${Btn} c="w" onClick=${() => setReset(false)}>Batal<//
        ><${Btn}
          c="r"
          onClick=${() => {
            setHist([]);
            setNotes([]);
            setCalls([]);
            setSess(null);
            setReset(false);
            toast("Catatan latihan sudah dihapus.");
          }}
          >Ya, hapus riwayat<//
        >
      </div><//
    >`}`;
}
