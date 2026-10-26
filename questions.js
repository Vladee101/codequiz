// Банк вопросов. answer — индекс верного варианта в options (0..2); порядок вариантов перемешивается при показе.
// topic: "SQL" | "API"; lang: "sql" | "json" | "yaml" | "http" | "text"
window.QUESTIONS = {
  basic: [
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт этот запрос?",
      code: `SELECT status, COUNT(*)
FROM orders
GROUP BY status;`,
      options: ["По одной строке на каждый статус с количеством заказов", "Одну строку с общим числом заказов", "Ошибку: нужен HAVING"],
      answer: 0,
      explain: "GROUP BY схлопывает строки по уникальным значениям status, COUNT(*) считает размер каждой группы. HAVING нужен только для фильтра по агрегатам."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Нужно найти клиентов с суммой платежей больше 1000. Что не так в запросе?",
      code: `SELECT customer_id, SUM(amount)
FROM payments
WHERE SUM(amount) > 1000
GROUP BY customer_id;`,
      options: ["Агрегат нельзя использовать в WHERE — фильтр по SUM должен быть в HAVING", "GROUP BY должен стоять перед FROM", "Нужно заменить SUM на COUNT"],
      answer: 0,
      explain: "WHERE выполняется до группировки, когда сумм ещё нет. Условия на агрегаты пишутся в HAVING после GROUP BY."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос, если у части пользователей deleted_at пустой (NULL)?",
      code: `SELECT * FROM users
WHERE deleted_at = NULL;`,
      options: ["Всех неудалённых пользователей", "Ни одной строки", "Всех пользователей"],
      answer: 1,
      explain: "Сравнение с NULL через = даёт UNKNOWN, а не TRUE, поэтому строки не попадают в результат. Правильно: WHERE deleted_at IS NULL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Пользователь ещё не сделал ни одного заказа. Попадёт ли он в результат?",
      code: `SELECT u.name, o.id
FROM users u
JOIN orders o ON o.user_id = u.id;`,
      options: ["Да, с o.id = NULL", "Нет, JOIN без уточнения — это INNER JOIN", "Запрос упадёт с ошибкой"],
      answer: 1,
      explain: "INNER JOIN оставляет только пары с совпадением. Чтобы увидеть пользователей без заказов, нужен LEFT JOIN."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В таблице orders есть внешний ключ на users(id). Что произойдёт при вставке?",
      code: `-- orders.user_id REFERENCES users(id)
INSERT INTO orders (id, user_id, total)
VALUES (101, 99999, 500);
-- пользователя с id = 99999 нет`,
      options: ["Вставка пройдёт, user_id станет NULL", "СУБД отклонит вставку: нарушение внешнего ключа", "Автоматически создастся пользователь 99999"],
      answer: 1,
      explain: "Внешний ключ гарантирует ссылочную целостность: нельзя сослаться на несуществующую родительскую строку."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что гарантирует этот запрос про порядок строк?",
      code: `SELECT * FROM products
LIMIT 10;`,
      options: ["Вернутся 10 самых новых товаров", "Вернутся 10 первых по id", "Ничего: без ORDER BY набор и порядок строк не определены"],
      answer: 2,
      explain: "LIMIT без ORDER BY отдаёт любые 10 строк, и результат может отличаться между запусками. Для стабильной выборки добавляют сортировку."
    },
    {
      topic: "API", lang: "http",
      q: "Какой код ответа ожидается при успешном создании ресурса?",
      code: `POST /api/v1/users
Content-Type: application/json

{ "email": "ivan@example.com" }`,
      options: ["200 OK", "201 Created (с Location на новый ресурс)", "204 No Content"],
      answer: 1,
      explain: "201 сообщает, что ресурс создан; в заголовке Location обычно отдают его URL. 200 допустим, но менее точен для создания."
    },
    {
      topic: "API", lang: "http",
      q: "Какой статус вернуть, если пользователь авторизован, но не имеет прав на действие?",
      code: `DELETE /api/v1/projects/42
Authorization: Bearer <valid-token>
# роль пользователя: viewer`,
      options: ["401 Unauthorized", "403 Forbidden", "404 Not Found"],
      answer: 1,
      explain: "401 — не удалось аутентифицировать (нет или неверный токен). 403 — личность известна, но прав недостаточно."
    },
    {
      topic: "API", lang: "yaml",
      q: "Что должен вернуть сервер на этот запрос согласно схеме?",
      code: `# схема тела запроса
type: object
required: [email]
properties:
  email: { type: string }
  name:  { type: string }

# запрос
{ "name": "Ivan" }`,
      options: ["200 OK, email будет пустым", "400/422: нарушена схема — нет обязательного поля email", "500 Internal Server Error"],
      answer: 1,
      explain: "Обязательное поле отсутствует, это ошибка клиента, то есть 4xx. 500 означал бы сбой сервера, а не неверный запрос."
    },
    {
      topic: "API", lang: "http",
      q: "Какой из этих методов идемпотентен по спецификации HTTP?",
      code: `POST   /orders
PUT    /orders/42
PATCH  /orders/42   (increment: +1)`,
      options: ["POST — повторный вызов создаёт тот же заказ", "PUT — повтор с тем же телом даёт то же состояние", "PATCH с инкрементом"],
      answer: 1,
      explain: "PUT заменяет ресурс целиком, повторы не меняют результат. POST создаёт новое при каждом вызове, а PATCH-инкремент накапливает эффект."
    }
  ],

  medium: [
    {
      topic: "SQL", lang: "sql",
      q: "Задача: показать ВСЕХ клиентов и число их оплаченных заказов (включая 0). Что не так?",
      code: `SELECT c.name, COUNT(o.id) AS paid_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.name;`,
      options: ["Ничего, запрос корректен", "WHERE по правой таблице отбрасывает клиентов без заказов — условие нужно перенести в ON", "COUNT нужно заменить на SUM"],
      answer: 1,
      explain: "У клиентов без заказов o.status = NULL, и WHERE их убирает: LEFT JOIN превращается в INNER. Условие по правой таблице кладут в ON."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что покажет запрос для клиента без единого заказа?",
      code: `SELECT c.id, COUNT(*) AS orders_cnt
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id;`,
      options: ["0", "1", "NULL"],
      answer: 1,
      explain: "После LEFT JOIN у такого клиента остаётся одна строка с NULL справа, и COUNT(*) считает её. Для верного нуля нужен COUNT(o.id)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему сумма выручки может получиться завышенной?",
      code: `SELECT SUM(o.total) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.id;`,
      options: ["SUM не работает с JOIN", "Каждый заказ повторяется по числу позиций, и его total суммируется многократно", "Нужен GROUP BY по order_items"],
      answer: 1,
      explain: "Это «размножение строк» (fan-out): связь 1:N дублирует заказ на каждую позицию. Суммировать нужно на уровне позиций или до JOIN."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что возвращает этот запрос?",
      code: `SELECT * FROM (
  SELECT o.*,
         ROW_NUMBER() OVER (
           PARTITION BY user_id
           ORDER BY created_at DESC
         ) AS rn
  FROM orders o
) t
WHERE rn = 1;`,
      options: ["Самый первый заказ каждого пользователя", "Последний по дате заказ каждого пользователя", "Один самый свежий заказ во всей таблице"],
      answer: 1,
      explain: "PARTITION BY user_id нумерует заказы внутри пользователя, сортировка DESC ставит самый свежий под номер 1. Фильтр rn = 1 оставляет его."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что не так с фильтром по датам, если created_at — это timestamp?",
      code: `SELECT * FROM orders
WHERE created_at BETWEEN '2026-10-01'
                     AND '2026-10-31';`,
      options: ["Ничего, захватит весь октябрь", "Потеряются заказы 31 октября после 00:00:00", "BETWEEN не работает с датами"],
      answer: 1,
      explain: "'2026-10-31' означает полночь начала дня, поэтому всё позже в этот день не попадает. Надёжнее: >= '2026-10-01' AND < '2026-11-01'."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В blocks.user_id встречается NULL. Что вернёт запрос?",
      code: `SELECT * FROM users
WHERE id NOT IN (
  SELECT user_id FROM blocks
);`,
      options: ["Всех пользователей, которых нет в blocks", "Пустой результат", "Ошибку выполнения"],
      answer: 1,
      explain: "Если в подзапросе есть NULL, NOT IN даёт UNKNOWN для всех строк. Безопаснее NOT EXISTS либо фильтр user_id IS NOT NULL в подзапросе."
    },
    {
      topic: "API", lang: "yaml",
      q: "Контракт говорит: PUT /users/{id} принимает только phone. Что тут не так по смыслу?",
      code: `put:
  summary: Update user phone
  requestBody:
    content:
      application/json:
        schema:
          type: object
          properties:
            phone: { type: string }`,
      options: ["Ничего, PUT всегда обновляет часть полей", "PUT подразумевает полную замену ресурса — для частичного обновления подходит PATCH", "Для обновления нужен POST"],
      answer: 1,
      explain: "По семантике PUT клиент присылает полное представление, и непереданные поля могут обнулиться. Частичные изменения — зона PATCH."
    },
    {
      topic: "API", lang: "json",
      q: "Чем рискует такой контракт?",
      code: `{
  "orderId": "A-1001",
  "amount": 1250.50,
  "currency": "EUR"
}`,
      options: ["Ничем, число — лучший тип для денег", "Ошибками округления float; лучше строка с десятичным значением или целое число в минимальных единицах", "currency должен быть числом"],
      answer: 1,
      explain: "Двоичные числа с плавающей точкой не представляют многие десятичные дроби точно. Деньги передают строкой (\"1250.50\") или целым в центах (125050)."
    },
    {
      topic: "API", lang: "yaml",
      q: "Клиент отправил middleName: null. Что скажет валидатор по этой схеме?",
      code: `User:
  type: object
  properties:
    middleName:
      type: string
      nullable: false`,
      options: ["Пропустит: null эквивалентен отсутствию поля", "Отклонит: поле можно опустить, но null — не строка", "Подставит пустую строку"],
      answer: 1,
      explain: "«Поле отсутствует» и «поле равно null» — разные состояния. Без nullable: true значение null не проходит проверку типа."
    },
    {
      topic: "API", lang: "http",
      q: "Какой статус логичнее при попытке зарегистрировать уже занятый email?",
      code: `POST /api/v1/users
{ "email": "ivan@example.com" }

# пользователь с таким email уже существует`,
      options: ["409 Conflict", "404 Not Found", "500 Internal Server Error"],
      answer: 0,
      explain: "Запрос корректен по форме, но конфликтует с текущим состоянием ресурса — это 409. Некоторые команды используют 422, но 500 здесь точно неверен."
    }
  ],

  advanced: [
    {
      topic: "SQL", lang: "sql",
      q: "Два параллельных перевода по 100 при балансе 150. В чём проблема?",
      code: `BEGIN;
SELECT balance FROM accounts WHERE id = 1;
-- приложение: если balance >= 100, продолжаем
UPDATE accounts
SET balance = balance - 100
WHERE id = 1;
COMMIT;
-- уровень изоляции: READ COMMITTED`,
      options: ["Проблемы нет: транзакция атомарна", "Гонка: обе транзакции прочитают 150 и спишут, баланс уйдёт в минус; нужна блокировка (FOR UPDATE) или условное обновление", "Нужно просто повторить SELECT перед COMMIT"],
      answer: 1,
      explain: "Атомарность не защищает от check-then-act между чтением и записью. Решения: SELECT ... FOR UPDATE либо UPDATE ... WHERE balance >= 100 с проверкой числа изменённых строк."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Индекс по created_at есть, но запрос медленный. Почему?",
      code: `SELECT * FROM events
WHERE DATE(created_at) = '2026-10-01';`,
      options: ["Индексы не работают с датами", "Функция над колонкой мешает использовать индекс; нужен диапазон created_at >= ... AND < ...", "Нужно заменить DATE на CAST"],
      answer: 1,
      explain: "Выражение над колонкой делает условие не «sargable»: планировщик не может искать по индексу напрямую. Диапазон по «голой» колонке индекс использует."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Удалённый пользователь пытается зарегистрироваться снова с тем же email. Что произойдёт?",
      code: `CREATE TABLE users (
  id         bigint PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  deleted_at timestamptz
);
-- «удаление» = UPDATE ... SET deleted_at = now()`,
      options: ["Регистрация пройдёт: строка помечена удалённой", "Нарушение UNIQUE: старая строка всё ещё в таблице; нужен частичный уникальный индекс WHERE deleted_at IS NULL", "Старая строка удалится автоматически"],
      answer: 1,
      explain: "UNIQUE не знает о мягком удалении. Частичный индекс (в PostgreSQL: CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL) ограничивает уникальность только активными записями."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при применении миграции к таблице, где уже есть данные?",
      code: `ALTER TABLE orders
ADD COLUMN channel varchar(20) NOT NULL;`,
      options: ["Колонка добавится, у старых строк будет пустая строка", "Ошибка: у существующих строк нет значения; нужен DEFAULT или поэтапная миграция с бэкфиллом", "Добавится с NULL, ограничение проигнорируется"],
      answer: 1,
      explain: "Существующим строкам нечем заполнить NOT NULL-колонку. Безопасный путь: добавить nullable, заполнить, затем навесить NOT NULL (или задать DEFAULT)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт running_total для двух платежей с одинаковым created_at?",
      code: `SELECT id, created_at, amount,
       SUM(amount) OVER (ORDER BY created_at) AS running_total
FROM payments;`,
      options: ["Накопление по одной строке: у каждой свой промежуточный итог", "Обе строки с одинаковым created_at получат один и тот же итог, включающий обе суммы", "Ошибку: оконной функции нужен PARTITION BY"],
      answer: 1,
      explain: "Рамка по умолчанию RANGE ... CURRENT ROW включает всех «равных» по ORDER BY. Для построчного итога добавляют ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW и тай-брейкер по id."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент повторил запрос из-за таймаута. Чего не хватает контракту?",
      code: `POST /api/v1/payments
{ "orderId": "A-1001", "amount": "50.00" }

# ответа нет (timeout) -> клиент шлёт тот же запрос ещё раз`,
      options: ["Ничего: сервер сам отличит повтор", "Механизма идемпотентности: заголовок Idempotency-Key и хранение результата по ключу, иначе возможно двойное списание", "Нужно заменить POST на GET"],
      answer: 1,
      explain: "POST не идемпотентен. Клиент генерирует уникальный ключ, сервер сохраняет результат и на повтор с тем же ключом возвращает его же, а не создаёт платёж заново."
    },
    {
      topic: "API", lang: "yaml",
      q: "Какое из изменений v1-контракта ломает существующих клиентов?",
      code: `# Было                 Варианты изменений
POST /orders           A) в ответ добавили необязательное поле "trackingUrl"
{ items, address }     B) в запрос добавили обязательное поле "channel"
                       C) добавили новый эндпоинт GET /orders/{id}/history`,
      options: ["A", "B", "C"],
      answer: 1,
      explain: "Старые клиенты не знают про новое обязательное поле и начнут получать ошибки валидации. Добавление необязательных полей в ответ и новых эндпоинтов обычно обратно совместимо."
    },
    {
      topic: "API", lang: "http",
      q: "UPDATE затронул 0 строк из-за несовпавшей версии. Что вернуть клиенту?",
      code: `PUT /api/v1/documents/7
If-Match: "v3"
{ "title": "New title" }

-- UPDATE documents SET title = ?, version = version + 1
-- WHERE id = 7 AND version = 3;   -- affected rows: 0
-- (в БД уже версия 4)`,
      options: ["200 OK — данные всё равно приняты", "409 Conflict или 412 Precondition Failed — документ изменён кем-то ещё", "404 Not Found"],
      answer: 1,
      explain: "Это оптимистическая блокировка: версия устарела, значит конкурентное изменение. 412 соответствует нарушенному If-Match, 409 тоже допустим. Клиент должен перечитать ресурс и повторить."
    },
    {
      topic: "API", lang: "text",
      q: "Какая проблема скрыта в обработчике вебхука?",
      code: `# Платёжный провайдер: доставка at-least-once
# Обработчик:
on_event(event):
    UPDATE orders
    SET status = event.status
    WHERE id = event.order_id`,
      options: ["Проблем нет: события приходят строго по одному и по порядку", "Повторы и перестановка событий: «paid» может перезаписаться более старым «pending»; нужна дедупликация по event.id и проверка версии/времени", "Нужно отвечать 500, чтобы провайдер не повторял"],
      answer: 1,
      explain: "At-least-once означает возможные дубли, порядок не гарантирован. Обработчик должен быть идемпотентным (хранить обработанные event.id) и не откатывать статус событием с более ранней версией."
    },
    {
      topic: "API", lang: "sql",
      q: "Курсорная пагинация по created_at. Что может пойти не так?",
      code: `-- GET /orders?limit=50&cursor=<last created_at>
SELECT * FROM orders
WHERE created_at < :cursor
ORDER BY created_at DESC
LIMIT 50;`,
      options: ["Ничего, это самый надёжный вариант", "created_at не уникален: строки с одинаковым значением на границе страниц будут пропущены; нужен составной курсор (created_at, id)", "Курсор нельзя использовать с ORDER BY"],
      answer: 1,
      explain: "Если на границе страницы несколько записей с одним created_at, условие «строго меньше» потеряет оставшиеся. Тай-брейкер по уникальному id делает порядок и курсор однозначными."
    }
  ]
};
