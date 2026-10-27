# SQL & API Quiz

Статический квиз для чтения SQL и API-контрактов. Без сборки и зависимостей.
Десять направлений — SQL, API, ERD (ER-диаграммы), BPMN (диаграммы процессов), Use Case (диаграммы вариантов использования), Sequence (диаграммы последовательности), State (диаграммы состояний), Activity (диаграммы активности), Class (диаграммы классов) и Component (диаграммы компонентов), в каждом три уровня (базовый / средний / продвинутый). Вопросы лежат в `questions.js`; направление определяется полем `topic`.

## Локально
    npx serve .        # или просто открыть index.html

## Деплой на Vercel
Вариант 1 (CLI): в папке проекта `npx vercel --prod` (Framework Preset: Other, build command пустой).
Вариант 2 (Git): запушить в GitHub → Vercel → Add New Project → Import → Deploy.

## Добавить вопрос
В `questions.js` добавь объект в нужный уровень:
    { topic: "SQL", lang: "sql", q: "...", code: `...`, options: ["верный?", "...", "..."], answer: 0, explain: "..." }
`answer` — индекс верного варианта в `options`; порядок вариантов перемешивается автоматически.

## Добавить ERD-вопрос
Схемы лежат в `window.ERDS` (`questions.js`): таблицы с позицией `col`/`row` в сетке и связи `[родитель, потомок, метка, метка]`.
В вопросе указывают `topic: "ERD", erd: "shop"` — диаграмма нарисуется над вариантами ответа.

## Добавить BPMN-вопрос
Диаграммы лежат в `window.BPMNS` (`questions.js`): `lanes` (дорожки), `nodes` (тип, подпись, позиция `col`/`row`) и `flows` `[от, к, подпись, вид]`.
В вопросе указывают `topic: "BPMN", bpmn: "shop_order"` — диаграмма нарисуется над вариантами ответа.

## Добавить Use Case-вопрос
Диаграммы лежат в `window.UCDS` (`questions.js`): `system` (граница), `nodes` (`actor`, `sys`, `uc` с позицией `col`/`row`) и `flows` `[от, к, вид]`, где вид — `include`, `extend`, `gen` или пусто (ассоциация).
В вопросе указывают `topic: "UC", uc: "shop"` — диаграмма нарисуется над вариантами ответа.

## Добавить Sequence-вопрос
Диаграммы лежат в `window.SEQS` (`questions.js`): `participants` (`obj` или `actor`) и `events` по порядку сверху вниз:
`["msg", от, к, подпись, вид]` (`sync`, `async`, `reply`, `create`, `destroy`), `["note", участник, текст]` и `["frag", "alt"|"opt"|"loop"|"par"|"break", [[условие, события], ...]]`.
В вопросе указывают `topic: "SEQ", seq: "login"` — диаграмма нарисуется над вариантами ответа.

## Добавить State-вопрос
Диаграммы лежат в `window.STATES` (`questions.js`): `nodes` (`state`, `init`, `final`, `choice`, `history`, `fork`, `comp` с позицией `col`/`row`; у `comp` — `c0`..`c1`, `r0`..`r1`) и `flows` `[от, к, "событие [условие] / действие"]`.
В вопросе указывают `topic: "STATE", state: "order"` — диаграмма нарисуется над вариантами ответа.

## Добавить Activity-вопрос
Диаграммы лежат в `window.ACTS` (`questions.js`): `lanes` (дорожки), `nodes` (`start`, `end`, `fend`, `action`, `call`, `dec`, `merge`, `fork`, `join`, `obj`, `send`, `accept`, `time` с позицией `col`/`row`) и `flows` `[от, к, подпись, вид]`.
В вопросе указывают `topic: "ACT", act: "order_act"` — диаграмма нарисуется над вариантами ответа.

## Добавить Class-вопрос
Диаграммы лежат в `window.CLASSES` (`questions.js`): `nodes` (класс с `kind` — `class`, `abstract`, `interface`, `enum`; `attrs`, `ops`; префикс `_` — static, `*` — abstract; позиция `col`/`row`) и `rels` `[от, к, вид, подпись, кратность у «от», кратность у «к»]`,
где вид — `assoc`, `assocd`, `agg`, `comp` (ромб у «от»), `inherit`, `realize`, `dep` (стрелка к «к»).
В вопросе указывают `topic: "CLS", cls: "shop"` — диаграмма нарисуется над вариантами ответа.

## Добавить Component-вопрос
Диаграммы лежат в `window.COMPS` (`questions.js`): `nodes` (`comp` со `stereo` и `ports`, `iface` — интерфейс, `group` — граница подсистемы с `c0`..`c1`, `r0`..`r1`) и `rels` `[от, к, вид, подпись]`,
где вид — `provide` (предоставляет интерфейс), `require` (требует интерфейс) или `dep` (зависимость).
В вопросе указывают `topic: "CMP", cmp: "shop_cmp"` — диаграмма нарисуется над вариантами ответа.
