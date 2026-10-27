(() => {
  const TRACKS = {
    SQL: { title: "SQL Quiz", desc: "Чтение запросов: GROUP BY, JOIN, NULL, оконные функции, индексы, миграции" },
    API: { title: "API Quiz", desc: "Контракты: HTTP-статусы, семантика методов, схемы, идемпотентность, вебхуки" },
    ERD: { title: "ERD Quiz", desc: "Диаграммы сущностей: связи 1:N и M:N, ключи, нормализация, целостность" },
    BPMN: { title: "BPMN Quiz", desc: "Диаграммы процессов: события, шлюзы, токены, ошибки, сообщения, подпроцессы" }
  };
  const LEVELS = {
    basic:    { title: "Базовый" },
    medium:   { title: "Средний" },
    advanced: { title: "Продвинутый" }
  };
  const pool = (track, lvl) => (window.QUESTIONS[lvl] || []).filter((q) => q.topic === track);
  const LETTERS = ["A", "B", "C"];
  const app = document.getElementById("app");
  let state = null;

  /* ---------- utils ---------- */
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const SQL_KW = "SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|IN|IS|NULL|BETWEEN|INSERT INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|UNIQUE|ALTER|ADD|COLUMN|PRIMARY KEY|REFERENCES|DEFAULT|BEGIN|COMMIT|OVER|PARTITION BY|ROWS|RANGE|UNBOUNDED|PRECEDING|CURRENT ROW|EXISTS|DISTINCT|COUNT|SUM|MAX|MIN|AVG|ROW_NUMBER|DATE|CAST|BIGINT|TEXT|VARCHAR|TIMESTAMPTZ";
  const SQL_RE = new RegExp(`(--[^\\n]*)|('(?:[^']|'')*')|\\b(${SQL_KW})\\b|\\b(\\d+(?:\\.\\d+)?)\\b`, "gi");
  const GEN_RE = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*")|\b(true|false|null)\b|\b(\d+(?:\.\d+)?)\b/g;

  function highlight(code, lang) {
    const safe = esc(code);
    const re = lang === "sql" ? SQL_RE : GEN_RE;
    return safe.replace(re, (m, com, str, kw, num) => {
      if (com) return `<span class="c">${com}</span>`;
      if (str) return `<span class="s">${str}</span>`;
      if (kw) return `<span class="k">${kw}</span>`;
      if (num) return `<span class="n">${num}</span>`;
      return m;
    });
  }

  /* ---------- ERD ---------- */
  const ERD = { W: 190, HEAD: 28, ROW: 22, GX: 80, GY: 50, PAD: 12 };

  function erdBlock(name) {
    const d = window.ERDS && window.ERDS[name];
    if (!d) return "";
    const { W, HEAD, ROW, GX, GY, PAD } = ERD;
    const rows = Math.max(...d.tables.map((t) => t.row)) + 1;
    const cols = Math.max(...d.tables.map((t) => t.col)) + 1;
    const rowH = Array.from({ length: rows }, (_, r) =>
      Math.max(0, ...d.tables.filter((t) => t.row === r).map((t) => HEAD + t.cols.length * ROW)));
    const rowTop = rowH.map((_, r) => PAD + rowH.slice(0, r).reduce((a, h) => a + h + GY, 0));
    const box = {};
    d.tables.forEach((t) => {
      box[t.name] = { t, x: PAD + t.col * (W + GX), y: rowTop[t.row], w: W, h: HEAD + t.cols.length * ROW };
    });
    const width = PAD * 2 + cols * W + (cols - 1) * GX;
    const height = PAD * 2 + rowH.reduce((a, h) => a + h, 0) + (rows - 1) * GY;

    const edge = (a, b) => {
      const cx = a.x + a.w / 2, cy = a.y + a.h / 2;
      const dx = b.x + b.w / 2 - cx, dy = b.y + b.h / 2 - cy;
      const k = Math.min(dx ? a.w / 2 / Math.abs(dx) : Infinity, dy ? a.h / 2 / Math.abs(dy) : Infinity);
      return { x: cx + dx * k, y: cy + dy * k, ux: dx / Math.hypot(dx, dy), uy: dy / Math.hypot(dx, dy) };
    };

    const lines = d.rels.map(([from, to, cardFrom, cardTo]) => {
      const a = box[from], b = box[to];
      const p = edge(a, b), q = edge(b, a);
      const lab = (pt, dirx, diry, text) =>
        `<text class="erd-card" x="${pt.x + dirx * 14 - diry * 10}" y="${pt.y + diry * 14 + dirx * 10 + 4}" text-anchor="middle">${esc(text)}</text>`;
      return `<line class="erd-line" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>` +
        lab(p, p.ux, p.uy, cardFrom) + lab(q, -p.ux, -p.uy, cardTo);
    }).join("");

    const tables = d.tables.map((t) => {
      const { x, y, w, h } = box[t.name];
      const cells = t.cols.map((c, i) => {
        const [col, ...tag] = c.split(" ");
        const cy = y + HEAD + i * ROW + 15;
        return `<text class="erd-col" x="${x + 10}" y="${cy}">${esc(col)}</text>` +
          (tag.length ? `<text class="erd-tag" x="${x + w - 10}" y="${cy}" text-anchor="end">${esc(tag.join(" "))}</text>` : "");
      }).join("");
      return `<rect class="erd-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>` +
        `<path class="erd-head" d="M${x} ${y + HEAD}V${y + 6}a6 6 0 0 1 6-6h${w - 12}a6 6 0 0 1 6 6V${y + HEAD}z"/>` +
        `<text class="erd-title" x="${x + w / 2}" y="${y + 19}" text-anchor="middle">${esc(t.name)}</text>` + cells;
    }).join("");

    return `<div class="erd"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="ER-диаграмма">${lines}${tables}</svg></div>`;
  }

  /* ---------- BPMN ---------- */
  const BP = { CW: 140, RH: 104, PAD: 12, LANEW: 30, TW: 108, TH: 56, R: 17, G: 21 };
  let bpmnSeq = 0;

  const wrap = (text, max) => {
    const lines = [];
    let cur = "";
    text.split(" ").forEach((w) => {
      if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  };

  const envelope = (x, y, filled) =>
    `<rect class="bp-ico${filled ? " fill" : ""}" x="${x - 7}" y="${y - 5}" width="14" height="10" rx="1"/>` +
    `<polyline class="bp-ico${filled ? " inv" : ""}" fill="none" points="${x - 7},${y - 5} ${x},${y + 1} ${x + 7},${y - 5}"/>`;
  const clock = (x, y, r) =>
    `<circle class="bp-ico" cx="${x}" cy="${y}" r="${r}"/><polyline class="bp-ico" fill="none" points="${x},${y - r + 3} ${x},${y} ${x + r / 2},${y + r / 4}"/>`;
  const zigzag = (x, y) => `<polyline class="bp-ico" fill="none" points="${x - 6},${y + 6} ${x - 2},${y - 3} ${x + 2},${y + 2} ${x + 6},${y - 6}"/>`;

  function bpmnBlock(name) {
    const d = window.BPMNS && window.BPMNS[name];
    if (!d) return "";
    const { CW, RH, PAD, LANEW, TW, TH, R, G } = BP;
    const id = ++bpmnSeq;
    const lanes = d.lanes || [];
    const left = PAD + (lanes.length ? LANEW : 0);
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });
    const cols = Math.max(...d.nodes.map((n) => n.col)) + 1;
    const rows = lanes.length ? lanes.reduce((a, l) => a + l.rows, 0) : Math.max(...d.nodes.map((n) => n.row)) + 1;

    const isGate = (t) => t.startsWith("gw");
    const isTask = (t) => t === "task" || t === "sub";
    const half = (n) => {
      if (n.attach) return [14, 14];
      return isTask(n.type) ? [TW / 2, TH / 2] : isGate(n.type) ? [G, G] : n.type === "data" ? [14, 18] : [R, R];
    };
    const center = (n) => {
      if (n.attach) {
        const h = nodes[n.attach];
        return { x: left + h.col * CW + CW / 2 + (n.dx || 0), y: PAD + h.row * RH + RH / 2 + TH / 2 };
      }
      return { x: left + n.col * CW + CW / 2, y: PAD + n.row * RH + RH / 2 };
    };

    const width = left + cols * CW + PAD;
    const height = PAD * 2 + rows * RH + 22;

    let svg = `<defs>
      <marker id="bpa${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="bp-arrow" d="M0 0L10 5L0 10z"/></marker>
      <marker id="bpo${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="bp-arrow-open" d="M0 0L10 5L0 10"/></marker>
      <marker id="bpc${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><circle class="bp-arrow-open" cx="5" cy="5" r="3.5"/></marker>
    </defs>`;

    let y0 = PAD;
    lanes.forEach((l) => {
      const h = l.rows * RH;
      svg += `<rect class="bp-lane" x="${PAD}" y="${y0}" width="${width - PAD * 2}" height="${h}"/>` +
        `<rect class="bp-lane" x="${PAD}" y="${y0}" width="${LANEW}" height="${h}"/>` +
        `<text class="bp-lane-t" transform="translate(${PAD + 19} ${y0 + h / 2}) rotate(-90)" text-anchor="middle">${esc(l.name)}</text>`;
      y0 += h;
    });

    svg += d.flows.map(([from, to, label, kind]) => {
      const a = nodes[from], b = nodes[to];
      const ca = center(a), cb = center(b);
      const [ahw, ahh] = half(a), [bhw, bhh] = half(b);
      let pts;
      if (a.attach) {
        if (cb.y > ca.y + ahh + 2 && cb.x > ca.x + 1) pts = [[ca.x, ca.y + ahh], [ca.x, cb.y], [cb.x - bhw, cb.y]];
        else if (Math.abs(cb.x - ca.x) <= 1) pts = [[ca.x, ca.y + ahh], [cb.x, cb.y - bhh]];
        else pts = [[ca.x, ca.y + ahh], [ca.x, ca.y + ahh + 22], [cb.x - bhw, ca.y + ahh + 22], [cb.x - bhw, cb.y]];
      } else if (cb.x > ca.x + 1) {
        const x1 = ca.x + ahw, x2 = cb.x - bhw, mx = (x1 + x2) / 2;
        pts = ca.y === cb.y ? [[x1, ca.y], [x2, cb.y]] : [[x1, ca.y], [mx, ca.y], [mx, cb.y], [x2, cb.y]];
        if (kind === "down") pts = [[x1, ca.y], [cb.x, ca.y], [cb.x, cb.y - (cb.y > ca.y ? bhh : -bhh)]];
      } else if (Math.abs(cb.x - ca.x) <= 1) {
        const dir = cb.y > ca.y ? 1 : -1;
        pts = [[ca.x, ca.y + dir * ahh], [cb.x, cb.y - dir * bhh]];
      } else {
        const yb = Math.max(ca.y, cb.y) + TH / 2 + 18;
        pts = [[ca.x, ca.y + ahh], [ca.x, yb], [cb.x, yb], [cb.x, cb.y + bhh]];
      }
      const dstr = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
      const cls = kind === "msg" ? "bp-flow msg" : kind === "assoc" ? "bp-flow assoc" : "bp-flow";
      const marker = kind === "assoc" ? "" : kind === "msg" ? ` marker-end="url(#bpo${id})" marker-start="url(#bpc${id})"` : ` marker-end="url(#bpa${id})"`;
      let out = `<path class="${cls}" d="${dstr}"${marker}/>`;
      if (kind === "default") {
        const [p, q] = pts;
        const ux = Math.sign(q[0] - p[0]), uy = Math.sign(q[1] - p[1]);
        const mx = p[0] + ux * 14, my = p[1] + uy * 14;
        out += `<line class="bp-flow" x1="${mx - 4}" y1="${my + 4}" x2="${mx + 4}" y2="${my - 4}"/>`;
      }
      if (label) {
        let best = -1, bi = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const len = Math.abs(pts[i + 1][0] - pts[i][0]) + Math.abs(pts[i + 1][1] - pts[i][1]);
          if (len > best) { best = len; bi = i; }
        }
        const p = pts[bi], q = pts[bi + 1];
        const horiz = Math.abs(q[1] - p[1]) < 1;
        const lx = horiz ? (p[0] + q[0]) / 2 : p[0] + 5;
        const ly = horiz ? p[1] - 6 : (p[1] + q[1]) / 2;
        out += `<text class="bp-flow-t" x="${lx}" y="${ly}" text-anchor="${horiz ? "middle" : "start"}">${esc(label)}</text>`;
      }
      return out;
    }).join("");

    d.nodes.forEach((n) => {
      const c = center(n);
      const t = n.type;
      let shape = "";
      let label = "";
      const tspans = (lines, yAt) => lines.map((ln, i) => `<tspan x="${c.x}" y="${yAt(i, lines.length)}">${esc(ln)}</tspan>`).join("");
      if (isTask(t)) {
        const x0 = c.x - TW / 2, y0t = c.y - TH / 2;
        shape = `<rect class="bp-node" x="${x0}" y="${y0t}" width="${TW}" height="${TH}" rx="9"/>`;
        if (t === "sub") shape += `<rect class="bp-ico" x="${c.x - 7}" y="${c.y + TH / 2 - 15}" width="14" height="12"/><path class="bp-ico" d="M${c.x - 4} ${c.y + TH / 2 - 9}h8M${c.x} ${c.y + TH / 2 - 13}v8"/>`;
        if (n.task === "user") shape += `<circle class="bp-ico" cx="${x0 + 12}" cy="${y0t + 9}" r="3.5"/><path class="bp-ico" d="M${x0 + 5} ${y0t + 19}q0-6 7-6t7 6z"/>`;
        if (n.task === "service") shape += `<circle class="bp-ico" cx="${x0 + 12}" cy="${y0t + 11}" r="4"/><path class="bp-ico" d="M${x0 + 12} ${y0t + 4}v3M${x0 + 12} ${y0t + 15}v3M${x0 + 5} ${y0t + 11}h3M${x0 + 16} ${y0t + 11}h3"/>`;
        if (n.mi === "par") shape += `<path class="bp-ico" d="M${c.x - 4} ${c.y + TH / 2 - 12}v9M${c.x} ${c.y + TH / 2 - 12}v9M${c.x + 4} ${c.y + TH / 2 - 12}v9"/>`;
        if (n.mi === "seq") shape += `<path class="bp-ico" d="M${c.x - 5} ${c.y + TH / 2 - 11}h10M${c.x - 5} ${c.y + TH / 2 - 7}h10M${c.x - 5} ${c.y + TH / 2 - 3}h10"/>`;
        if (n.loop) shape += `<path class="bp-ico" d="M${c.x - 5} ${c.y + TH / 2 - 8}a5 5 0 1 0 5-5"/>`;
        const lines = wrap(n.label, 15);
        label = `<text class="bp-t" text-anchor="middle">${tspans(lines, (i, len) => c.y - (len - 1) * 7 + 4 + i * 14 + (n.task && len > 1 ? 5 : 0))}</text>`;
      } else if (isGate(t)) {
        shape = `<path class="bp-node" d="M${c.x} ${c.y - G}L${c.x + G} ${c.y}L${c.x} ${c.y + G}L${c.x - G} ${c.y}z"/>`;
        if (t === "gw-xor") shape += `<path class="bp-mark" d="M${c.x - 7} ${c.y - 7}L${c.x + 7} ${c.y + 7}M${c.x + 7} ${c.y - 7}L${c.x - 7} ${c.y + 7}"/>`;
        if (t === "gw-and") shape += `<path class="bp-mark" d="M${c.x - 9} ${c.y}H${c.x + 9}M${c.x} ${c.y - 9}V${c.y + 9}"/>`;
        if (t === "gw-or") shape += `<circle class="bp-mark" cx="${c.x}" cy="${c.y}" r="9"/>`;
        if (t === "gw-event") shape += `<circle class="bp-ico" cx="${c.x}" cy="${c.y}" r="10"/><circle class="bp-ico" cx="${c.x}" cy="${c.y}" r="7"/>`;
        const lines = n.label ? wrap(n.label, 18) : [];
        label = `<text class="bp-t sm" text-anchor="middle">${tspans(lines, (i, len) => c.y - G - 7 - (len - 1 - i) * 13)}</text>`;
      } else if (t === "data") {
        shape = `<path class="bp-node" d="M${c.x - 14} ${c.y - 18}h18l10 10v26h-28z"/><path class="bp-ico" d="M${c.x + 4} ${c.y - 18}v10h10"/>`;
        const lines = wrap(n.label, 16);
        label = `<text class="bp-t sm" text-anchor="middle">${tspans(lines, (i) => c.y + 33 + i * 13)}</text>`;
      } else {
        const start = t.startsWith("start");
        const end = t.startsWith("end");
        const inter = t.startsWith("inter");
        const bound = !!n.attach;
        const r = bound ? 14 : R;
        const dash = n.non ? " dash" : "";
        shape = `<circle class="bp-node${end ? " end" : ""}${dash}" cx="${c.x}" cy="${c.y}" r="${r}"/>`;
        if (inter || bound) shape += `<circle class="bp-node${dash}" cx="${c.x}" cy="${c.y}" r="${r - 3.5}"/>`;
        const kind = t.split("-")[1];
        if (kind === "msg") shape += envelope(c.x, c.y, t === "end-msg" || t === "inter-throw");
        if (kind === "throw") shape += envelope(c.x, c.y, true);
        if (kind === "catch") shape += envelope(c.x, c.y, false);
        if (kind === "timer") shape += clock(c.x, c.y, bound || inter ? 6 : 8);
        if (kind === "error") shape += zigzag(c.x, c.y);
        if (kind === "term") shape += `<circle class="bp-ico fill" cx="${c.x}" cy="${c.y}" r="8"/>`;
        if (kind === "signal") shape += `<path class="bp-ico" d="M${c.x} ${c.y - 7}L${c.x + 7} ${c.y + 5}H${c.x - 7}z"/>`;
        const lines = n.label ? wrap(n.label, 17) : [];
        label = `<text class="bp-t sm" text-anchor="middle">${tspans(lines, (i) => c.y + r + 14 + i * 13)}</text>`;
      }
      svg += shape + label;
    });

    return `<div class="bpmn"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="BPMN-диаграмма">${svg}</svg></div>`;
  }

  const diagram = (q) => (q.erd ? erdBlock(q.erd) : q.bpmn ? bpmnBlock(q.bpmn) : "");

  const storeKey = (track, lvl) => `sqlapiquiz:best:${track}:${lvl}`;
  const getBest = (track, lvl) => {
    try { const v = localStorage.getItem(storeKey(track, lvl)); return v === null ? null : Number(v); } catch { return null; }
  };
  const setBest = (track, lvl, score) => {
    try {
      const prev = getBest(track, lvl);
      if (prev === null || score > prev) localStorage.setItem(storeKey(track, lvl), String(score));
    } catch { /* storage недоступен — не критично */ }
  };

  /* ---------- screens ---------- */
  function renderHome() {
    state = null;
    app.innerHTML = `
      <h1>SQL & API Quiz</h1>
      <p class="sub">Читай чужой (и сгенерированный ИИ) SQL и контракты глазами аналитика: найди ошибку, предскажи результат. Выбери направление.</p>
      <div class="levels">
        ${Object.entries(TRACKS).map(([id, t]) => {
          const total = Object.keys(LEVELS).reduce((n, l) => n + pool(id, l).length, 0);
          return `<button class="level" data-track="${id}">
            <div><b>${t.title}</b><span class="d">${t.desc}</span></div>
            <div class="best">${total} вопросов</div>
          </button>`;
        }).join("")}
      </div>`;
    app.querySelectorAll(".level").forEach((b) => b.addEventListener("click", () => renderLevels(b.dataset.track)));
  }

  function renderLevels(track) {
    state = null;
    app.innerHTML = `
      <button class="link" id="home">← к направлениям</button>
      <h1>${TRACKS[track].title}</h1>
      <p class="sub">Выбери уровень. Вопрос — три варианта — короткое пояснение.</p>
      <div class="levels">
        ${Object.entries(LEVELS).map(([id, l]) => {
          const total = pool(track, id).length;
          const best = getBest(track, id);
          return `<button class="level" data-level="${id}">
            <div><b>${l.title}</b></div>
            <div class="best">${best === null ? `${total} вопросов` : `рекорд ${best}/${total}`}</div>
          </button>`;
        }).join("")}
      </div>`;
    document.getElementById("home").addEventListener("click", renderHome);
    app.querySelectorAll(".level").forEach((b) => b.addEventListener("click", () => startLevel(track, b.dataset.level)));
  }

  function startLevel(track, level) {
    const questions = shuffle(pool(track, level)).map((q) => ({
      ...q,
      opts: shuffle(q.options.map((text, i) => ({ text, correct: i === q.answer })))
    }));
    state = { track, level, questions, i: 0, score: 0, answered: false, mistakes: [] };
    renderQuestion();
  }

  function renderQuestion() {
    const { track, level, questions, i } = state;
    const q = questions[i];
    state.answered = false;
    app.innerHTML = `
      <button class="link" id="home">← к уровням</button>
      <div class="top"><span>${track} · ${LEVELS[level].title}</span><span>${i + 1} / ${questions.length}</span></div>
      <div class="bar"><i style="width:${(i / questions.length) * 100}%"></i></div>
      <div class="badge">${q.topic}</div>
      <h2>${esc(q.q)}</h2>
      ${diagram(q)}
      ${q.code ? `<pre class="code"><code>${highlight(q.code, q.lang)}</code></pre>` : ""}
      <div class="opts">
        ${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="key">${LETTERS[k]}</span><span>${esc(o.text)}</span></button>`).join("")}
      </div>
      <div id="fb"></div>`;
    document.getElementById("home").addEventListener("click", () => renderLevels(track));
    app.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => answer(Number(b.dataset.k))));
  }

  function answer(k) {
    if (!state || state.answered) return;
    state.answered = true;
    const q = state.questions[state.i];
    const chosen = q.opts[k];
    const right = chosen.correct;
    if (right) state.score++;
    else state.mistakes.push({ q, chosen: chosen.text });

    app.querySelectorAll(".opt").forEach((b, idx) => {
      b.disabled = true;
      if (q.opts[idx].correct) b.classList.add("ok");
      else if (idx === k) b.classList.add("bad");
      else b.classList.add("dim");
    });

    const last = state.i === state.questions.length - 1;
    document.getElementById("fb").innerHTML = `
      <div class="explain ${right ? "ok" : "bad"}">
        <strong>${right ? "Верно" : "Неверно"}</strong>
        ${esc(q.explain)}
      </div>
      <div class="actions"><button class="btn" id="next">${last ? "Результат" : "Дальше"} <small>(Enter)</small></button></div>`;
    document.getElementById("next").addEventListener("click", next);
    document.getElementById("next").focus();
  }

  function next() {
    if (!state || !state.answered) return;
    if (state.i === state.questions.length - 1) renderResult();
    else { state.i++; renderQuestion(); }
  }

  function renderResult() {
    const { track, level, questions, score, mistakes } = state;
    const total = questions.length;
    const prevBest = getBest(track, level);
    setBest(track, level, score);
    const pct = score / total;
    const msg = pct === 1 ? "Без единой ошибки." : pct >= 0.7 ? "Хороший результат." : "Есть что подтянуть — разбор ниже.";
    app.innerHTML = `
      <button class="link" id="home">← к уровням</button>
      <div class="card">
        <div class="muted">${track} · ${LEVELS[level].title} уровень</div>
        <div class="score">${score} / ${total}</div>
        <div>${msg}${prevBest !== null && score > prevBest ? " Новый рекорд." : ""}</div>
        <div class="actions">
          <button class="btn" id="retry">Пройти ещё раз</button>
          <button class="btn ghost" id="home2">Выбрать уровень</button>
        </div>
      </div>
      ${mistakes.length ? `<h2 style="margin-top:28px">Разбор ошибок</h2>
      <div class="review">
        ${mistakes.map(({ q, chosen }) => `
          <div class="card">
            <div class="badge">${q.topic}</div>
            <strong>${esc(q.q)}</strong>
            ${diagram(q)}
            ${q.code ? `<pre class="code" style="margin-top:10px"><code>${highlight(q.code, q.lang)}</code></pre>` : ""}
            <p class="muted">Твой ответ: ${esc(chosen)}</p>
            <p><b>Верно:</b> ${esc(q.opts.find((o) => o.correct).text)}</p>
            <p>${esc(q.explain)}</p>
          </div>`).join("")}
      </div>` : ""}`;
    document.getElementById("home").addEventListener("click", () => renderLevels(track));
    document.getElementById("home2").addEventListener("click", () => renderLevels(track));
    document.getElementById("retry").addEventListener("click", () => startLevel(track, level));
  }

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (!state || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!state.answered && ["1", "2", "3"].includes(e.key) && document.querySelector(".opt")) {
      answer(Number(e.key) - 1);
    } else if (state.answered && e.key === "Enter" && document.getElementById("next")) {
      e.preventDefault();
      next();
    }
  });

  renderHome();
})();
