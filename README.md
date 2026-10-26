# SQL & API Quiz

Статический квиз для чтения SQL и API-контрактов. Без сборки и зависимостей.
Два направления — SQL и API, в каждом три уровня (базовый / средний / продвинутый). Вопросы лежат в `questions.js`; направление определяется полем `topic`.

## Локально
    npx serve .        # или просто открыть index.html

## Деплой на Vercel
Вариант 1 (CLI): в папке проекта `npx vercel --prod` (Framework Preset: Other, build command пустой).
Вариант 2 (Git): запушить в GitHub → Vercel → Add New Project → Import → Deploy.

## Добавить вопрос
В `questions.js` добавь объект в нужный уровень:
    { topic: "SQL", lang: "sql", q: "...", code: `...`, options: ["верный?", "...", "..."], answer: 0, explain: "..." }
`answer` — индекс верного варианта в `options`; порядок вариантов перемешивается автоматически.
