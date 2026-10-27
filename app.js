(() => {
  const TRACKS = {
    SQL: { title: "SQL Quiz", desc: "Чтение запросов: GROUP BY, JOIN, NULL, оконные функции, индексы, миграции" },
    API: { title: "API Quiz", desc: "Контракты: HTTP-статусы, семантика методов, схемы, идемпотентность, вебхуки" },
    ERD: { title: "ERD Quiz", desc: "Диаграммы сущностей: связи 1:N и M:N, ключи, нормализация, целостность" },
    BPMN: { title: "BPMN Quiz", desc: "Диаграммы процессов: события, шлюзы, токены, ошибки, сообщения, подпроцессы" },
    UC: { title: "Use Case Quiz", desc: "Диаграммы вариантов использования: актёры, include, extend, границы системы, сценарии" },
    SEQ: { title: "Sequence Quiz", desc: "Диаграммы последовательности: сообщения, активации, фрагменты alt/opt/loop/par, асинхронность" },
    STATE: { title: "State Quiz", desc: "Диаграммы состояний: переходы, охранные условия, действия, вложенные состояния, история" },
    ACT: { title: "Activity Quiz", desc: "Диаграммы активности: действия, ветвления, fork/join, дорожки, объекты и сигналы" },
    CLS: { title: "Class Quiz", desc: "Диаграммы классов: наследование, ассоциации, агрегация и композиция, интерфейсы, кратности" },
    CMP: { title: "Component Quiz", desc: "Диаграммы компонентов: интерфейсы, порты, зависимости, слои, границы подсистем" }
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

  /* ---------- Use Case ---------- */
  const UCD = { CW: 172, RH: 86, PAD: 14, TOP: 34, RX: 66, RY: 28 };
  let ucSeq = 0;

  function ucBlock(name) {
    const d = window.UCDS && window.UCDS[name];
    if (!d) return "";
    const { CW, RH, PAD, TOP, RX, RY } = UCD;
    const id = ++ucSeq;
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });
    const cols = Math.max(...d.nodes.map((n) => n.col)) + 1;
    const rows = Math.max(...d.nodes.map((n) => n.row)) + 1;
    const hasSys = !!d.system;
    const top = PAD + (hasSys ? TOP : 0);
    const center = (n) => ({ x: PAD + n.col * CW + CW / 2, y: top + n.row * RH + RH / 2 - (n.type === "uc" ? 0 : 6) });
    const width = PAD * 2 + cols * CW;
    const height = top + rows * RH + PAD;

    // размеры для обрезки линий по границе фигуры
    const shape = (n) => (n.type === "uc" ? { rx: RX, ry: RY } : n.type === "sys" ? { hw: 63, hh: 22 } : { rx: 18, ry: 32 });
    const clip = (n, toward) => {
      const c = center(n), t = center(toward);
      const dx = t.x - c.x, dy = t.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const s = shape(n);
      let k;
      if (s.hw) k = Math.min(ux ? s.hw / Math.abs(ux) : Infinity, uy ? s.hh / Math.abs(uy) : Infinity);
      else k = 1 / Math.sqrt((ux / s.rx) ** 2 + (uy / s.ry) ** 2);
      return { x: c.x + ux * k, y: c.y + uy * k, ux, uy };
    };

    let svg = `<defs>
      <marker id="uca${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path class="uc-arrow" d="M1 1L9 5L1 9"/></marker>
      <marker id="ucg${id}" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto"><path class="uc-tri" d="M1 1L11 6L1 11z"/></marker>
    </defs>`;

    if (hasSys) {
      const x0 = PAD + d.system.c0 * CW + 8, x1 = PAD + (d.system.c1 + 1) * CW - 8;
      svg += `<rect class="uc-sys" x="${x0}" y="${PAD}" width="${x1 - x0}" height="${height - PAD * 2}" rx="6"/>` +
        `<text class="uc-sys-t" x="${(x0 + x1) / 2}" y="${PAD + 21}" text-anchor="middle">${esc(d.system.name)}</text>`;
    }

    svg += d.flows.map(([from, to, kind, label]) => {
      const a = nodes[from], b = nodes[to];
      const p = clip(a, b), q = clip(b, a);
      const k = kind || "assoc";
      const cls = k === "include" || k === "extend" ? "uc-line dash" : "uc-line";
      const marker = k === "include" || k === "extend" ? ` marker-end="url(#uca${id})"` : k === "gen" ? ` marker-end="url(#ucg${id})"` : "";
      let out = `<line class="${cls}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"${marker}/>`;
      const text = label || (k === "include" ? "«include»" : k === "extend" ? "«extend»" : "");
      if (text) out += `<text class="uc-line-t" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2 - 6}" text-anchor="middle">${esc(text)}</text>`;
      return out;
    }).join("");

    d.nodes.forEach((n) => {
      const c = center(n);
      if (n.type === "uc") {
        const lines = wrap(n.label, 17);
        svg += `<ellipse class="uc-node" cx="${c.x}" cy="${c.y}" rx="${RX}" ry="${RY}"/>` +
          `<text class="uc-t" text-anchor="middle">${lines.map((ln, i) => `<tspan x="${c.x}" y="${c.y + 4 - (lines.length - 1) * 7 + i * 14}">${esc(ln)}</tspan>`).join("")}</text>`;
      } else if (n.type === "sys") {
        svg += `<rect class="uc-node" x="${c.x - 63}" y="${c.y - 22}" width="126" height="44" rx="3"/>` +
          `<text class="uc-t sm" x="${c.x}" y="${c.y - 4}" text-anchor="middle">«system»</text>` +
          `<text class="uc-t" x="${c.x}" y="${c.y + 12}" text-anchor="middle">${esc(n.label)}</text>`;
      } else {
        const lines = wrap(n.label, 14);
        svg += `<circle class="uc-node" cx="${c.x}" cy="${c.y - 22}" r="9"/>` +
          `<path class="uc-man" d="M${c.x} ${c.y - 13}V${c.y + 8}M${c.x - 14} ${c.y - 6}H${c.x + 14}M${c.x} ${c.y + 8}L${c.x - 12} ${c.y + 28}M${c.x} ${c.y + 8}L${c.x + 12} ${c.y + 28}"/>` +
          `<text class="uc-t sm" text-anchor="middle">${lines.map((ln, i) => `<tspan x="${c.x}" y="${c.y + 44 + i * 13}">${esc(ln)}</tspan>`).join("")}</text>`;
      }
    });

    return `<div class="ucd"><svg viewBox="0 0 ${width} ${height + 24}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма вариантов использования">${svg}</svg></div>`;
  }

  /* ---------- Sequence ---------- */
  const SQ = { PW: 158, PAD: 16, HEAD: 38, GAP: 36, ACT: 10 };
  let seqId = 0;

  function seqBlock(name) {
    const d = window.SEQS && window.SEQS[name];
    if (!d) return "";
    const { PW, PAD, HEAD, GAP, ACT } = SQ;
    const id = ++seqId;
    const parts = d.participants;
    const idx = {};
    parts.forEach((p, i) => { idx[p.id] = i; });
    const px = (pid) => PAD + idx[pid] * PW + PW / 2;
    const width = PAD * 2 + parts.length * PW;

    const ops = [];
    const open = {};
    parts.forEach((p) => { open[p.id] = []; });
    const bars = [];
    const ends = {};
    const created = {};
    let y = PAD + HEAD + 20;

    const involved = (evs) => {
      const set = [];
      evs.forEach((e) => {
        if (e[0] === "msg") { set.push(idx[e[1]], idx[e[2]]); }
        else if (e[0] === "note") set.push(idx[e[1]]);
        else if (e[0] === "frag") e[2].forEach((o) => set.push(...involved(o[1])));
      });
      return set;
    };

    const run = (evs) => {
      evs.forEach((e) => {
        if (e[0] === "msg") {
          const [, from, to, label, kind] = e;
          const k = kind || "sync";
          if (from === to) {
            y += 30;
            ops.push({ t: "self", y, x: px(from), label, k });
            if (k === "sync") open[to].push({ y0: y, depth: open[to].length });
            y += 16;
            return;
          }
          y += GAP;
          if (k === "create") created[to] = y;
          if (k === "reply") {
            const stack = open[from];
            if (stack.length) { const b = stack.pop(); bars.push({ lane: from, y0: b.y0, y1: y, depth: b.depth }); }
          }
          ops.push({ t: "msg", y, from, to, label, k, depthFrom: open[from].length, depthTo: open[to].length + (k === "sync" ? 1 : 0) });
          if (k === "sync") open[to].push({ y0: y, depth: open[to].length });
          if (k === "destroy") ends[to] = y;
        } else if (e[0] === "note") {
          y += 42;
          ops.push({ t: "note", y, x: px(e[1]), text: e[2] });
        } else if (e[0] === "frag") {
          y += 12;
          const used = involved(e[2].flatMap((o) => o[1]));
          const lo = Math.min(...used), hi = Math.max(...used);
          const fy0 = y;
          y += 22;
          const seps = [];
          e[2].forEach((o, i) => {
            if (i > 0) { y += 8; seps.push({ y, guard: o[0] }); y += 4; }
            run(o[1]);
          });
          y += 12;
          ops.push({ t: "frag", kind: e[1], guard: e[2][0][0], y0: fy0, y1: y, x0: PAD + lo * PW + 14, x1: PAD + (hi + 1) * PW - 14, seps });
        }
      });
    };
    run(d.events);
    const bottom = y + 30;
    parts.forEach((p) => {
      open[p.id].forEach((b) => bars.push({ lane: p.id, y0: b.y0, y1: bottom - 14, depth: b.depth }));
    });
    const height = bottom + PAD;

    let svg = `<defs>
      <marker id="sqf${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="sq-fill" d="M0 1L10 5L0 9z"/></marker>
      <marker id="sqo${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="sq-open" d="M0 1L10 5L0 9"/></marker>
    </defs>`;

    // фрагменты рисуем под всем остальным
    ops.filter((o) => o.t === "frag").sort((a, b) => a.y0 - b.y0).forEach((f) => {
      svg += `<rect class="sq-frag" x="${f.x0}" y="${f.y0}" width="${f.x1 - f.x0}" height="${f.y1 - f.y0}"/>` +
        `<path class="sq-tag" d="M${f.x0} ${f.y0}h${f.kind.length * 7.5 + 16}v13l-7 7h-${f.kind.length * 7.5 + 9}z"/>` +
        `<text class="sq-tag-t" x="${f.x0 + 7}" y="${f.y0 + 14}">${esc(f.kind)}</text>` +
        (f.guard ? `<text class="sq-guard" x="${f.x0 + f.kind.length * 7.5 + 24}" y="${f.y0 + 14}">[${esc(f.guard)}]</text>` : "");
      f.seps.forEach((s) => {
        svg += `<line class="sq-sep" x1="${f.x0}" y1="${s.y}" x2="${f.x1}" y2="${s.y}"/>` +
          (s.guard ? `<text class="sq-guard" x="${f.x0 + 8}" y="${s.y + 14}">[${esc(s.guard)}]</text>` : "");
      });
    });

    // линии жизни
    parts.forEach((p) => {
      const top = created[p.id] ? created[p.id] : PAD + HEAD;
      const endY = ends[p.id] ? ends[p.id] : bottom - 14;
      svg += `<line class="sq-life" x1="${px(p.id)}" y1="${top}" x2="${px(p.id)}" y2="${endY}"/>`;
      if (ends[p.id]) svg += `<path class="sq-x" d="M${px(p.id) - 8} ${endY - 8}l16 16M${px(p.id) + 8} ${endY - 8}l-16 16"/>`;
    });

    bars.forEach((b) => {
      svg += `<rect class="sq-act" x="${px(b.lane) - ACT / 2 + b.depth * 5}" y="${b.y0}" width="${ACT}" height="${Math.max(b.y1 - b.y0, 10)}"/>`;
    });

    // заголовки участников
    parts.forEach((p) => {
      const x = px(p.id);
      const top = created[p.id] ? created[p.id] - HEAD / 2 : PAD;
      if (p.type === "actor") {
        svg += `<circle class="sq-box" cx="${x}" cy="${top + 7}" r="6"/>` +
          `<path class="sq-man" d="M${x} ${top + 13}v12M${x - 9} ${top + 17}h18M${x} ${top + 25}l-8 11M${x} ${top + 25}l8 11"/>` +
          `<text class="sq-t" x="${x}" y="${top + 50}" text-anchor="middle">${esc(p.label)}</text>`;
      } else {
        svg += `<rect class="sq-box" x="${x - PW / 2 + 12}" y="${top}" width="${PW - 24}" height="${HEAD - 4}" rx="4"/>` +
          `<text class="sq-t" x="${x}" y="${top + 21}" text-anchor="middle">${esc(p.label)}</text>`;
      }
    });

    ops.forEach((o) => {
      if (o.t === "msg") {
        const xf = px(o.from), xt = px(o.to);
        const dir = xt > xf ? 1 : -1;
        const x1 = xf + dir * (o.depthFrom > 0 || o.k === "sync" || o.k === "reply" ? ACT / 2 : 0);
        const toBar = o.k === "reply" ? 0 : o.k === "create" || o.k === "destroy" ? 0 : ACT / 2;
        const x2 = xt - dir * (toBar ? toBar : o.k === "create" ? PW / 2 - 14 : 0);
        const dashed = o.k === "reply" || o.k === "create";
        const mk = o.k === "sync" || o.k === "destroy" ? `url(#sqf${id})` : `url(#sqo${id})`;
        svg += `<line class="sq-msg${dashed ? " dash" : ""}" x1="${x1}" y1="${o.y}" x2="${x2}" y2="${o.y}" marker-end="${mk}"/>` +
          `<text class="sq-m-t" x="${(x1 + x2) / 2}" y="${o.y - 6}" text-anchor="middle">${esc(o.label || "")}</text>`;
      } else if (o.t === "self") {
        const x = o.x + ACT / 2;
        svg += `<path class="sq-msg" fill="none" d="M${x} ${o.y - 10}h30v20h-30" marker-end="url(#sqf${id})"/>` +
          `<text class="sq-m-t" x="${x + 36}" y="${o.y + 4}">${esc(o.label || "")}</text>`;
      } else if (o.t === "note") {
        const w = Math.max(110, o.text.length * 6.3 + 18);
        svg += `<path class="sq-note" d="M${o.x - w / 2} ${o.y - 16}h${w - 10}l10 10v22h-${w}z"/>` +
          `<text class="sq-m-t" x="${o.x}" y="${o.y + 4}" text-anchor="middle">${esc(o.text)}</text>`;
      }
    });

    return `<div class="seqd"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма последовательности">${svg}</svg></div>`;
  }

  /* ---------- State ---------- */
  const STD = { CW: 224, RH: 104, PAD: 14, SW: 124, SH: 44, LINE: 14 };
  let stSeq = 0;

  function stateBlock(name) {
    const d = window.STATES && window.STATES[name];
    if (!d) return "";
    const { CW, RH, PAD, SW, SH, LINE } = STD;
    const id = ++stSeq;
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });
    const cols = Math.max(...d.nodes.map((n) => (n.type === "comp" ? n.c1 : n.col))) + 1;
    const rows = Math.max(...d.nodes.map((n) => (n.type === "comp" ? n.r1 : n.row))) + 1;
    const width = PAD * 2 + cols * CW;
    const topx = d.flows.some(([a, b]) => a === b) ? 36 : 0;
    const height = PAD * 2 + rows * RH + 8 + topx;
    const center = (n) => (n.type === "comp"
      ? { x: PAD + (n.c0 + n.c1 + 1) * CW / 2, y: PAD + (n.r0 + n.r1 + 1) * RH / 2 }
      : { x: PAD + n.col * CW + CW / 2, y: PAD + topx + n.row * RH + RH / 2 });
    const stH = (n) => SH + (n.actions ? n.actions.length * LINE + 6 : 0);
    const size = (n) => {
      if (n.type === "comp") return { hw: (n.c1 - n.c0 + 1) * CW / 2 - 10, hh: (n.r1 - n.r0 + 1) * RH / 2 - 4 };
      if (n.type === "init") return { hw: 9, hh: 9, round: true };
      if (n.type === "final") return { hw: 13, hh: 13, round: true };
      if (n.type === "choice") return { hw: 16, hh: 16 };
      if (n.type === "history") return { hw: 13, hh: 13, round: true };
      if (n.type === "fork") return n.vert ? { hw: 4, hh: 34 } : { hw: 40, hh: 4 };
      return { hw: SW / 2, hh: stH(n) / 2 };
    };
    const clip = (n, toward) => {
      const c = center(n), t = center(toward);
      const dx = t.x - c.x, dy = t.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const s = size(n);
      const k = s.round ? s.hw : Math.min(ux ? s.hw / Math.abs(ux) : Infinity, uy ? s.hh / Math.abs(uy) : Infinity);
      return { x: c.x + ux * k, y: c.y + uy * k };
    };

    let svg = `<defs><marker id="sta${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="st-arrow" d="M0 1L10 5L0 9z"/></marker></defs>`;

    d.nodes.filter((n) => n.type === "comp").forEach((n) => {
      const x0 = PAD + n.c0 * CW + 10, x1 = PAD + (n.c1 + 1) * CW - 10;
      const y0 = PAD + n.r0 * RH + 4, y1 = PAD + (n.r1 + 1) * RH - 4;
      svg += `<rect class="st-comp" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="14"/>` +
        `<text class="st-comp-t" x="${x0 + 14}" y="${y0 + 20}">${esc(n.label)}</text>`;
      if (n.divider) svg += `<line class="st-div" x1="${x0}" y1="${PAD + n.divider * RH}" x2="${x1}" y2="${PAD + n.divider * RH}"/>`;
    });

    const pairKey = (a, b) => [a, b].sort().join("|");
    const counts = {};
    d.flows.forEach(([a, b]) => { if (a !== b) counts[pairKey(a, b)] = (counts[pairKey(a, b)] || 0) + 1; });

    svg += d.flows.map(([from, to, label, opt]) => {
      const a = nodes[from], b = nodes[to];
      const lines = label ? wrap(label, 19) : [];
      if (from === to) {
        const c = center(a), s = size(a);
        const x1 = c.x - 16, x2 = c.x + 16, yt = c.y - s.hh;
        return `<path class="st-line" fill="none" d="M${x1} ${yt}C${x1 - 6} ${yt - 40},${x2 + 6} ${yt - 40},${x2} ${yt}" marker-end="url(#sta${id})"/>` +
          `<text class="st-t" text-anchor="middle">${lines.map((ln, i) => `<tspan x="${c.x}" y="${yt - 40 - (lines.length - 1 - i) * 13}">${esc(ln)}</tspan>`).join("")}</text>`;
      }
      const ca = center(a), cb = center(b);
      const p = clip(a, b), q = clip(b, a);
      const twoWay = counts[pairKey(from, to)] > 1;
      const sign = twoWay ? 1 : 0;
      const off = (opt && opt.curve !== undefined ? opt.curve : sign * 34);
      const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const mx = (p.x + q.x) / 2 + nx * off, my = (p.y + q.y) / 2 + ny * off;
      const d1 = off ? `M${p.x} ${p.y}Q${mx + nx * off * 0.0} ${my},${q.x} ${q.y}` : `M${p.x} ${p.y}L${q.x} ${q.y}`;
      const sideX = off && Math.abs(nx) > 0.6 ? Math.sign(nx * off) : 0;
      const lx = (p.x + q.x) / 2 + nx * (off * 0.5 + Math.sign(off) * (sideX ? 6 : 16));
      const ly = (p.y + q.y) / 2 + ny * (off * 0.5 + Math.sign(off) * 16);
      const anchor = sideX > 0 ? "start" : sideX < 0 ? "end" : "middle";
      const above = off === 0 ? -8 : 0;
      return `<path class="st-line" fill="none" d="${d1}" marker-end="url(#sta${id})"/>` +
        (lines.length ? `<text class="st-t sm" text-anchor="${anchor}">${lines.map((ln, i) => `<tspan x="${lx}" y="${ly + above + i * 13 - (lines.length - 1) * 6}">${esc(ln)}</tspan>`).join("")}</text>` : "");
    }).join("");

    d.nodes.forEach((n) => {
      if (n.type === "comp") return;
      const c = center(n);
      if (n.type === "init") svg += `<circle class="st-init" cx="${c.x}" cy="${c.y}" r="9"/>`;
      else if (n.type === "final") svg += `<circle class="st-node" cx="${c.x}" cy="${c.y}" r="13"/><circle class="st-init" cx="${c.x}" cy="${c.y}" r="7"/>`;
      else if (n.type === "choice") svg += `<path class="st-node" d="M${c.x} ${c.y - 16}L${c.x + 16} ${c.y}L${c.x} ${c.y + 16}L${c.x - 16} ${c.y}z"/>`;
      else if (n.type === "history") svg += `<circle class="st-node" cx="${c.x}" cy="${c.y}" r="13"/><text class="st-t" x="${c.x}" y="${c.y + 5}" text-anchor="middle" font-weight="700">H</text>`;
      else if (n.type === "fork") svg += n.vert
        ? `<rect class="st-init" x="${c.x - 4}" y="${c.y - 34}" width="8" height="68" rx="2"/>`
        : `<rect class="st-init" x="${c.x - 40}" y="${c.y - 4}" width="80" height="8" rx="2"/>`;
      else {
        const h = stH(n);
        svg += `<rect class="st-node" x="${c.x - SW / 2}" y="${c.y - h / 2}" width="${SW}" height="${h}" rx="12"/>`;
        if (n.actions) {
          svg += `<line class="st-sep" x1="${c.x - SW / 2}" y1="${c.y - h / 2 + 28}" x2="${c.x + SW / 2}" y2="${c.y - h / 2 + 28}"/>` +
            n.actions.map((a, i) => `<text class="st-t sm" x="${c.x - SW / 2 + 8}" y="${c.y - h / 2 + 28 + 15 + i * LINE}">${esc(a)}</text>`).join("");
          svg += `<text class="st-t" x="${c.x}" y="${c.y - h / 2 + 19}" text-anchor="middle" font-weight="600">${esc(n.label)}</text>`;
        } else {
          const lines = wrap(n.label, 15);
          svg += `<text class="st-t" text-anchor="middle" font-weight="600">${lines.map((ln, i) => `<tspan x="${c.x}" y="${c.y + 5 - (lines.length - 1) * 7 + i * 14}">${esc(ln)}</tspan>`).join("")}</text>`;
        }
      }
      if (n.note) svg += `<text class="st-t sm" x="${c.x}" y="${c.y + size(n).hh + 15}" text-anchor="middle">${esc(n.note)}</text>`;
    });

    return `<div class="std"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма состояний">${svg}</svg></div>`;
  }

  /* ---------- Activity ---------- */
  const AC = { CW: 160, RH: 100, PAD: 12, LANEW: 30, TW: 112, TH: 50, R: 14, G: 20 };
  let actSeq = 0;

  function actBlock(name) {
    const d = window.ACTS && window.ACTS[name];
    if (!d) return "";
    const { CW, RH, PAD, LANEW, TW, TH, R, G } = AC;
    const id = ++actSeq;
    const lanes = d.lanes || [];
    const left = PAD + (lanes.length ? LANEW : 0);
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });
    const cols = Math.max(...d.nodes.map((n) => n.col)) + 1;
    const rows = lanes.length ? lanes.reduce((a, l) => a + l.rows, 0) : Math.ceil(Math.max(...d.nodes.map((n) => n.row)) + 1);
    const width = left + cols * CW + PAD;
    const height = PAD * 2 + rows * RH + 20;

    const half = (n) => {
      switch (n.type) {
        case "action": case "call": return [TW / 2, TH / 2];
        case "dec": case "merge": return [G, G];
        case "fork": case "join": return n.vert ? [4, (n.span || 1) * RH / 2 - 14] : [(n.span || 1) * CW / 2 - 24, 4];
        case "obj": return [46, 20];
        case "send": case "accept": return [52, 24];
        case "time": return [14, 17];
        default: return [R, R];
      }
    };
    const center = (n) => ({ x: left + n.col * CW + CW / 2, y: PAD + n.row * RH + RH / 2 });

    let svg = `<defs>
      <marker id="aca${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path class="ac-arrow" d="M0 1L10 5L0 9z"/></marker>
    </defs>`;

    let y0 = PAD;
    lanes.forEach((l) => {
      const h = l.rows * RH;
      svg += `<rect class="ac-lane" x="${PAD}" y="${y0}" width="${width - PAD * 2}" height="${h}"/>` +
        `<rect class="ac-lane" x="${PAD}" y="${y0}" width="${LANEW}" height="${h}"/>` +
        `<text class="ac-lane-t" transform="translate(${PAD + 19} ${y0 + h / 2}) rotate(-90)" text-anchor="middle">${esc(l.name)}</text>`;
      y0 += h;
    });

    svg += d.flows.map(([from, to, label, kind]) => {
      const a = nodes[from], b = nodes[to];
      const ca = center(a), cb = center(b);
      const [ahw, ahh] = half(a), [bhw, bhh] = half(b);
      const aBarV = (a.type === "fork" || a.type === "join") && a.vert;
      const bBarV = (b.type === "fork" || b.type === "join") && b.vert;
      const aBarH = (a.type === "fork" || a.type === "join") && !a.vert;
      const bBarH = (b.type === "fork" || b.type === "join") && !b.vert;
      let pts;
      if (aBarV && cb.x > ca.x) pts = [[ca.x + ahw, cb.y], [cb.x - bhw, cb.y]];
      else if (bBarV && cb.x > ca.x) pts = [[ca.x + ahw, ca.y], [cb.x - bhw, ca.y]];
      else if (aBarH) pts = [[cb.x, ca.y + ahh], [cb.x, cb.y - bhh]];
      else if (bBarH) pts = [[ca.x, ca.y + ahh], [ca.x, cb.y - bhh]];
      else if (cb.x > ca.x + 1) {
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
      let out = `<path class="ac-flow${kind === "obj" ? " dash" : ""}" d="${dstr}" marker-end="url(#aca${id})"/>`;
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
        out += `<text class="ac-flow-t" x="${lx}" y="${ly}" text-anchor="${horiz ? "middle" : "start"}">${esc(label)}</text>`;
      }
      return out;
    }).join("");

    d.nodes.forEach((n) => {
      const c = center(n);
      const t = n.type;
      let shape = "", label = "";
      const tspans = (lines, yAt) => lines.map((ln, i) => `<tspan x="${c.x}" y="${yAt(i, lines.length)}">${esc(ln)}</tspan>`).join("");
      if (t === "action" || t === "call") {
        shape = `<rect class="ac-node" x="${c.x - TW / 2}" y="${c.y - TH / 2}" width="${TW}" height="${TH}" rx="16"/>`;
        if (t === "call") shape += `<path class="ac-ico" d="M${c.x + TW / 2 - 22} ${c.y + TH / 2 - 8}v-9M${c.x + TW / 2 - 14} ${c.y + TH / 2 - 8}v-9M${c.x + TW / 2 - 22} ${c.y + TH / 2 - 13}h8"/>`;
        const lines = wrap(n.label, 15);
        label = `<text class="ac-t" text-anchor="middle">${tspans(lines, (i, len) => c.y - (len - 1) * 7 + 4 + i * 14)}</text>`;
      } else if (t === "dec" || t === "merge") {
        shape = `<path class="ac-node" d="M${c.x} ${c.y - G}L${c.x + G} ${c.y}L${c.x} ${c.y + G}L${c.x - G} ${c.y}z"/>`;
        const lines = n.label ? wrap(n.label, 18) : [];
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines, (i, len) => c.y - G - 7 - (len - 1 - i) * 13)}</text>`;
      } else if (t === "fork" || t === "join") {
        const [hw, hh] = half(n);
        shape = `<rect class="ac-bar" x="${c.x - hw}" y="${c.y - hh}" width="${hw * 2}" height="${hh * 2}" rx="2"/>`;
      } else if (t === "obj") {
        shape = `<rect class="ac-node" x="${c.x - 46}" y="${c.y - 20}" width="92" height="40"/>`;
        const lines = wrap(n.label, 13);
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines, (i, len) => c.y + 4 - (len - 1) * 6 + i * 13)}</text>`;
      } else if (t === "send") {
        shape = `<path class="ac-node" d="M${c.x - 52} ${c.y - 24}H${c.x + 30}L${c.x + 52} ${c.y}L${c.x + 30} ${c.y + 24}H${c.x - 52}z"/>`;
        const lines = wrap(n.label, 13);
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines, (i, len) => c.y + 4 - (len - 1) * 6 + i * 13)}</text>`;
      } else if (t === "accept") {
        shape = `<path class="ac-node" d="M${c.x - 52} ${c.y - 24}H${c.x + 52}V${c.y + 24}H${c.x - 52}L${c.x - 34} ${c.y}z"/>`;
        const lines = wrap(n.label, 13);
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines.map((x) => x), (i, len) => c.y + 4 - (len - 1) * 6 + i * 13)}</text>`;
      } else if (t === "time") {
        shape = `<path class="ac-node" d="M${c.x - 12} ${c.y - 16}H${c.x + 12}L${c.x} ${c.y}L${c.x + 12} ${c.y + 16}H${c.x - 12}L${c.x} ${c.y}z"/>`;
        const lines = n.label ? wrap(n.label, 16) : [];
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines, (i) => c.y + 32 + i * 13)}</text>`;
      } else {
        if (t === "start") shape = `<circle class="ac-fill" cx="${c.x}" cy="${c.y}" r="${R - 3}"/>`;
        else if (t === "end") shape = `<circle class="ac-node" cx="${c.x}" cy="${c.y}" r="${R}"/><circle class="ac-fill" cx="${c.x}" cy="${c.y}" r="${R - 5}"/>`;
        else if (t === "fend") shape = `<circle class="ac-node" cx="${c.x}" cy="${c.y}" r="${R}"/><path class="ac-ico" d="M${c.x - 6} ${c.y - 6}l12 12M${c.x + 6} ${c.y - 6}l-12 12"/>`;
        const lines = n.label ? wrap(n.label, 17) : [];
        label = `<text class="ac-t sm" text-anchor="middle">${tspans(lines, (i) => c.y + R + 14 + i * 13)}</text>`;
      }
      svg += shape + label;
    });

    return `<div class="actd"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма активности">${svg}</svg></div>`;
  }

  /* ---------- Class ---------- */
  const CL = { CW: 250, PAD: 16, GAP: 64, LH: 16, HEAD: 30 };
  let clsSeq = 0;

  function classBlock(name) {
    const d = window.CLASSES && window.CLASSES[name];
    if (!d) return "";
    const { CW, PAD, GAP, LH, HEAD } = CL;
    const id = ++clsSeq;
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });

    d.nodes.forEach((n) => {
      const attrs = n.attrs || [], ops = n.ops || [];
      const widest = Math.max(n.name.length + 4, ...attrs.map((a) => a.length), ...ops.map((o) => o.length), 14);
      n.w = Math.max(132, Math.min(CW - 30, widest * 6.9 + 22));
      const head = HEAD + (n.kind && n.kind !== "class" ? 14 : 0);
      n.head = head;
      const sec = (arr) => (arr.length ? arr.length * LH + 10 : 12);
      if (n.kind === "enum") n.h = head + sec(attrs);
      else if (n.kind === "interface") n.h = head + sec(ops);
      else n.h = head + sec(attrs) + sec(ops);
    });
    const cols = Math.max(...d.nodes.map((n) => n.col)) + 1;
    const rows = Math.max(...d.nodes.map((n) => n.row)) + 1;
    const rowH = Array.from({ length: rows }, (_, r) => Math.max(0, ...d.nodes.filter((n) => n.row === r).map((n) => n.h)));
    const rowTop = rowH.map((_, r) => PAD + rowH.slice(0, r).reduce((a, h) => a + h + GAP, 0));
    d.nodes.forEach((n) => {
      n.cx = PAD + n.col * CW + CW / 2;
      n.cy = rowTop[n.row] + rowH[n.row] / 2;
    });
    const width = PAD * 2 + cols * CW;
    const height = PAD * 2 + rowH.reduce((a, h) => a + h, 0) + (rows - 1) * GAP + 6;

    const clip = (a, b) => {
      const dx = b.cx - a.cx, dy = b.cy - a.cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const k = Math.min(ux ? a.w / 2 / Math.abs(ux) : Infinity, uy ? a.h / 2 / Math.abs(uy) : Infinity);
      return { x: a.cx + ux * k, y: a.cy + uy * k, ux, uy };
    };

    let svg = `<defs>
      <marker id="clt${id}" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto"><path class="cl-hollow" d="M1 1L11 6L1 11z"/></marker>
      <marker id="clo${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="cl-open" d="M1 1L9 5L1 9"/></marker>
      <marker id="cld${id}" viewBox="0 0 18 10" refX="17" refY="5" markerWidth="18" markerHeight="10" orient="auto-start-reverse"><path class="cl-hollow" d="M1 5L9 1L17 5L9 9z"/></marker>
      <marker id="clf${id}" viewBox="0 0 18 10" refX="17" refY="5" markerWidth="18" markerHeight="10" orient="auto-start-reverse"><path class="cl-solid" d="M1 5L9 1L17 5L9 9z"/></marker>
    </defs>`;

    const pairs = {};
    d.rels.forEach(([a, b]) => { const k = [a, b].sort().join("|"); pairs[k] = (pairs[k] || 0) + 1; });
    const seen = {};
    svg += d.rels.map(([from, to, kind, label, mFrom, mTo]) => {
      const a = nodes[from], b = nodes[to];
      const key = [from, to].sort().join("|");
      seen[key] = (seen[key] || 0) + 1;
      const shift = pairs[key] > 1 ? (seen[key] - 1 - (pairs[key] - 1) / 2) * 26 * (from > to ? -1 : 1) : 0;
      const p = clip(a, b), q = clip(b, a);
      const nx = -(q.y - p.y), ny = q.x - p.x, nl = Math.hypot(nx, ny) || 1;
      const ox = nx / nl * shift, oy = ny / nl * shift;
      const x1 = p.x + ox, y1 = p.y + oy, x2 = q.x + ox, y2 = q.y + oy;
      const dashed = kind === "realize" || kind === "dep";
      let m = "";
      if (kind === "inherit" || kind === "realize") m = ` marker-end="url(#clt${id})"`;
      else if (kind === "dep" || kind === "assocd") m = ` marker-end="url(#clo${id})"`;
      else if (kind === "agg") m = ` marker-start="url(#cld${id})"`;
      else if (kind === "comp") m = ` marker-start="url(#clf${id})"`;
      let out = `<line class="cl-line${dashed ? " dash" : ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${m}/>`;
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const vx = -uy, vy = ux;
      const lab = (t, px, py, anchor) => `<text class="cl-t sm cl-lab" x="${px}" y="${py}" text-anchor="${anchor || "middle"}">${esc(t)}</text>`;
      if (mFrom) out += lab(mFrom, x1 + ux * 22 + vx * 12, y1 + uy * 22 + vy * 12 + 4);
      if (mTo) out += lab(mTo, x2 - ux * 22 + vx * 12, y2 - uy * 22 + vy * 12 + 4);
      if (label) out += lab(label, (x1 + x2) / 2 - vx * 11, (y1 + y2) / 2 - vy * 11 + 3);
      return out;
    }).join("");

    d.nodes.forEach((n) => {
      const x = n.cx - n.w / 2, y = n.cy - n.h / 2;
      const attrs = n.attrs || [], ops = n.ops || [];
      svg += `<rect class="cl-box" x="${x}" y="${y}" width="${n.w}" height="${n.h}"/>`;
      let ty = y + 19;
      if (n.kind && n.kind !== "class" && n.kind !== "abstract") {
        svg += `<text class="cl-t sm" x="${n.cx}" y="${y + 14}" text-anchor="middle">«${esc(n.kind)}»</text>`;
        ty = y + 30;
      }
      svg += `<text class="cl-t cl-name${n.kind === "abstract" ? " it" : ""}" x="${n.cx}" y="${ty}" text-anchor="middle">${esc(n.name)}</text>`;
      let yy = y + n.head;
      svg += `<line class="cl-sep" x1="${x}" y1="${yy}" x2="${x + n.w}" y2="${yy}"/>`;
      attrs.forEach((a, i) => { svg += `<text class="cl-t cl-m${a.startsWith("_") ? " ul" : ""}" x="${x + 8}" y="${yy + 16 + i * LH}">${esc(a.replace(/^_/, ""))}</text>`; });
      if (n.kind !== "enum" && n.kind !== "interface") {
        yy += attrs.length ? attrs.length * LH + 10 : 12;
        svg += `<line class="cl-sep" x1="${x}" y1="${yy}" x2="${x + n.w}" y2="${yy}"/>`;
        ops.forEach((o, i) => { svg += `<text class="cl-t cl-m${o.startsWith("_") ? " ul" : ""}${o.startsWith("*") ? " it" : ""}" x="${x + 8}" y="${yy + 16 + i * LH}">${esc(o.replace(/^[_*]/, ""))}</text>`; });
      } else if (n.kind === "interface") {
        ops.forEach((o, i) => { svg += `<text class="cl-t cl-m it" x="${x + 8}" y="${yy + 16 + i * LH}">${esc(o.replace(/^[_*]/, ""))}</text>`; });
      }
    });

    return `<div class="cls"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма классов">${svg}</svg></div>`;
  }

  /* ---------- Component ---------- */
  const CP = { CW: 200, RH: 104, PAD: 14, W: 132, H: 54 };
  let cmpSeq = 0;

  function componentBlock(name) {
    const d = window.COMPS && window.COMPS[name];
    if (!d) return "";
    const { CW, RH, PAD, W, H } = CP;
    const id = ++cmpSeq;
    const nodes = {};
    d.nodes.forEach((n) => { nodes[n.id] = n; });
    const items = d.nodes.filter((n) => n.type !== "group");
    const cols = Math.max(...items.map((n) => n.col), ...d.nodes.filter((n) => n.type === "group").map((g) => g.c1)) + 1;
    const rows = Math.max(...items.map((n) => n.row), ...d.nodes.filter((n) => n.type === "group").map((g) => g.r1)) + 1;
    const width = PAD * 2 + cols * CW;
    const height = PAD * 2 + rows * RH + 6;
    const center = (n) => ({ x: PAD + n.col * CW + CW / 2, y: PAD + n.row * RH + RH / 2 });
    const half = (n) => (n.type === "iface" ? [9, 9] : [W / 2, (n.stereo ? H + 8 : H) / 2]);
    const clip = (n, toward, pad) => {
      const c = center(n), t = center(toward);
      const dx = t.x - c.x, dy = t.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const [hw, hh] = half(n);
      const k = n.type === "iface" ? hw + (pad || 0) : Math.min(ux ? hw / Math.abs(ux) : Infinity, uy ? hh / Math.abs(uy) : Infinity);
      return { x: c.x + ux * k, y: c.y + uy * k, ux, uy };
    };

    let svg = `<defs><marker id="cpa${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="cp-open" d="M1 1L9 5L1 9"/></marker></defs>`;

    d.nodes.filter((n) => n.type === "group").forEach((g) => {
      const x0 = PAD + g.c0 * CW + 6, x1 = PAD + (g.c1 + 1) * CW - 6;
      const y0 = PAD + g.r0 * RH + 2, y1 = PAD + (g.r1 + 1) * RH - 2;
      svg += `<rect class="cp-group" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="8"/>` +
        `<text class="cp-t sm" x="${x0 + 10}" y="${y0 + 15}">${g.stereo ? "«" + esc(g.stereo) + "» " : ""}<tspan font-weight="700">${esc(g.label)}</tspan></text>`;
    });

    svg += d.rels.map(([from, to, kind, label]) => {
      const a = nodes[from], b = nodes[to];
      let out = "";
      if (kind === "require" && b.type === "iface") {
        const c = center(b), t = center(a);
        const dx = t.x - c.x, dy = t.y - c.y, len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const R = 15, ang = Math.atan2(uy, ux);
        const sx = c.x + R * Math.cos(ang - Math.PI / 2), sy = c.y + R * Math.sin(ang - Math.PI / 2);
        const ex = c.x + R * Math.cos(ang + Math.PI / 2), ey = c.y + R * Math.sin(ang + Math.PI / 2);
        out += `<path class="cp-line" fill="none" d="M${sx} ${sy}A${R} ${R} 0 0 1 ${ex} ${ey}"/>`;
        const p = clip(a, b), qx = c.x + ux * R, qy = c.y + uy * R;
        out += `<line class="cp-line" x1="${p.x}" y1="${p.y}" x2="${qx}" y2="${qy}"/>`;
      } else if (kind === "provide" && b.type === "iface") {
        const p = clip(a, b), q = clip(b, a);
        out += `<line class="cp-line" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
      } else {
        const p = clip(a, b), q = clip(b, a);
        const dashed = kind === "dep";
        out += `<line class="cp-line${dashed ? " dash" : ""}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"${dashed ? ` marker-end="url(#cpa${id})"` : ""}/>`;
        if (label) out += `<text class="cp-t sm cp-lab" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2 - 6}" text-anchor="middle">${esc(label)}</text>`;
      }
      return out;
    }).join("");

    items.forEach((n) => {
      const c = center(n);
      if (n.type === "iface") {
        svg += `<circle class="cp-box" cx="${c.x}" cy="${c.y}" r="9"/>` +
          `<text class="cp-t sm" x="${c.x}" y="${c.y + 30}" text-anchor="middle">${esc(n.label)}</text>`;
      } else {
        const h = n.stereo ? H + 8 : H;
        const x = c.x - W / 2, y = c.y - h / 2;
        svg += `<rect class="cp-box" x="${x}" y="${y}" width="${W}" height="${h}" rx="3"/>` +
          `<rect class="cp-icon" x="${x + W - 22}" y="${y + 6}" width="14" height="10"/>` +
          `<rect class="cp-icon" x="${x + W - 25}" y="${y + 8}" width="6" height="3"/>` +
          `<rect class="cp-icon" x="${x + W - 25}" y="${y + 12}" width="6" height="3"/>`;
        if (n.stereo) svg += `<text class="cp-t sm" x="${c.x - 6}" y="${y + 17}" text-anchor="middle">«${esc(n.stereo)}»</text>`;
        const lines = wrap(n.label, 15);
        svg += `<text class="cp-t cp-name" text-anchor="middle">${lines.map((ln, i) => `<tspan x="${c.x - 4}" y="${c.y + (n.stereo ? 10 : 5) - (lines.length - 1) * 7 + i * 14}">${esc(ln)}</tspan>`).join("")}</text>`;
        (n.ports || []).forEach((pt) => {
          const [side, lab] = pt.split(":");
          const px = side === "left" ? x - 6 : side === "right" ? x + W - 6 : c.x - 6;
          const py = side === "top" ? y - 6 : side === "bottom" ? y + h - 6 : c.y - 6;
          svg += `<rect class="cp-port" x="${px}" y="${py}" width="12" height="12"/>`;
          if (lab) {
            const tx = side === "left" ? px - 4 : side === "right" ? px + 16 : c.x;
            const ty = side === "top" ? py - 5 : side === "bottom" ? py + 24 : py - 4;
            svg += `<text class="cp-t sm" x="${tx}" y="${ty}" text-anchor="${side === "left" ? "end" : side === "right" ? "start" : "middle"}">${esc(lab)}</text>`;
          }
        });
      }
    });

    return `<div class="cmpd"><svg viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(width, 560)}px;max-width:${Math.round(width * 1.25)}px" role="img" aria-label="Диаграмма компонентов">${svg}</svg></div>`;
  }

  const diagram = (q) => (q.erd ? erdBlock(q.erd) : q.bpmn ? bpmnBlock(q.bpmn) : q.uc ? ucBlock(q.uc) : q.seq ? seqBlock(q.seq) : q.state ? stateBlock(q.state) : q.act ? actBlock(q.act) : q.cls ? classBlock(q.cls) : q.cmp ? componentBlock(q.cmp) : "");

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
          const total = (window.TRACK_COUNTS && window.TRACK_COUNTS[id]) || Object.keys(LEVELS).reduce((n, l) => n + pool(id, l).length, 0);
          return `<button class="level" data-track="${id}">
            <div><b>${t.title}</b><span class="d">${t.desc}</span></div>
            <div class="best">${total} вопросов</div>
          </button>`;
        }).join("")}
      </div>`;
    app.querySelectorAll(".level").forEach((b) => b.addEventListener("click", () => openTrack(b.dataset.track)));
  }

  /* Данные направления лежат в отдельном файле и подгружаются при первом выборе. */
  const loaded = {};
  function loadTrack(track) {
    if (loaded[track]) return loaded[track];
    const src = window.TRACK_FILES && window.TRACK_FILES[track];
    if (!src) return Promise.resolve();
    loaded[track] = new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = resolve;
      el.onerror = () => { delete loaded[track]; reject(new Error("load failed")); };
      document.head.appendChild(el);
    });
    return loaded[track];
  }

  function openTrack(track) {
    if (loaded[track] === undefined && pool(track, "basic").length === 0) {
      state = null;
      app.innerHTML = `<button class="link" id="home">← к направлениям</button><h1>${TRACKS[track].title}</h1><p class="sub">Загрузка вопросов…</p>`;
      document.getElementById("home").addEventListener("click", renderHome);
    }
    loadTrack(track).then(() => renderLevels(track)).catch(() => {
      app.innerHTML = `<button class="link" id="home">← к направлениям</button><h1>${TRACKS[track].title}</h1>
        <p class="sub">Не удалось загрузить вопросы. Проверьте соединение и попробуйте ещё раз.</p>
        <div class="actions"><button class="btn" id="retry-load">Повторить</button></div>`;
      document.getElementById("home").addEventListener("click", renderHome);
      document.getElementById("retry-load").addEventListener("click", () => openTrack(track));
    });
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
