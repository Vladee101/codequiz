// Манифест банка вопросов. Сами вопросы лежат в data/<направление>.js и подгружаются при выборе направления.
// answer — индекс верного варианта в options (0..2); порядок вариантов перемешивается при показе.
// topic: "SQL" | "API" | "ERD" | "BPMN" | "UC" | "SEQ" | "STATE" | "ACT" | "CLS" | "CMP" | "SD" | "KAFKA"; lang: "sql" | "json" | "yaml" | "http" | "text"
// У вопроса с диаграммой есть поле erd / bpmn / uc / seq / state / act / cls / cmp / sd — имя схемы из того же файла data/*.js.
window.QUESTIONS = { basic: [], medium: [], advanced: [] };
window.TRACK_FILES = {
  SQL: "data/sql.js",
  API: "data/api.js",
  ERD: "data/erd.js",
  BPMN: "data/bpmn.js",
  UC: "data/uc.js",
  SEQ: "data/seq.js",
  STATE: "data/state.js",
  ACT: "data/act.js",
  CLS: "data/cls.js",
  CMP: "data/cmp.js",
  SD: "data/sd.js",
  KAFKA: "data/kafka.js"
};
// Число вопросов по направлениям (для главного экрана, пока файлы не загружены).
window.TRACK_COUNTS = {
  SQL: 150,
  API: 150,
  ERD: 150,
  BPMN: 150,
  UC: 150,
  SEQ: 150,
  STATE: 150,
  ACT: 150,
  CLS: 150,
  CMP: 150,
  SD: 150,
  KAFKA: 45
};
