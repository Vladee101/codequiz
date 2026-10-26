(() => {
  const TRACKS = {
    SQL: { title: "SQL Quiz", desc: "Чтение запросов: GROUP BY, JOIN, NULL, оконные функции, индексы, миграции" },
    API: { title: "API Quiz", desc: "Контракты: HTTP-статусы, семантика методов, схемы, идемпотентность, вебхуки" }
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
