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
    },
    {
      topic: "SQL", lang: "sql",
      q: "В каком порядке вернутся строки?",
      code: `SELECT name, price
FROM products
ORDER BY price DESC, name;`,
      options: ["По убыванию цены, при равной цене — по имени от A до Я", "По возрастанию цены, затем по имени", "Только по имени: DESC относится ко второму полю"],
      answer: 0,
      explain: "Каждое поле в ORDER BY имеет своё направление. DESC относится только к price, а name сортируется по умолчанию по возрастанию (ASC) и разруливает равные цены."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В таблице 5 строк, у двух из них email равен NULL. Что вернёт запрос?",
      code: `SELECT COUNT(*), COUNT(email)
FROM users;`,
      options: ["5 и 5", "5 и 3", "3 и 3"],
      answer: 1,
      explain: "COUNT(*) считает строки, COUNT(колонка) — только значения, не равные NULL. Поэтому получится 5 и 3."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт этот запрос?",
      code: `SELECT DISTINCT city
FROM customers;`,
      options: ["Все города, включая повторы", "Список уникальных городов без повторов", "Количество уникальных городов"],
      answer: 1,
      explain: "DISTINCT убирает дубликаты в результирующем наборе. Количество дал бы COUNT(DISTINCT city)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие клиенты попадут в результат?",
      code: `SELECT * FROM customers
WHERE name LIKE 'An%';`,
      options: ["Те, чьё имя начинается с «An»: Anna, Andrey", "Те, чьё имя содержит «An» в любом месте", "Только те, чьё имя буквально равно «An%»"],
      answer: 0,
      explain: "В LIKE символ % заменяет любую последовательность символов. 'An%' задаёт префикс, а поиск в любом месте строки потребовал бы '%An%'."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при выполнении этой команды?",
      code: `UPDATE users
SET status = 'blocked';`,
      options: ["Ошибка: не указано, кого обновлять", "Статус «blocked» получат все строки таблицы", "Обновится только первая строка"],
      answer: 1,
      explain: "Без WHERE UPDATE затрагивает все строки. Это классическая ошибка: перед запуском в проде фильтр нужно проверять SELECT-ом."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие заказы вернёт запрос?",
      code: `SELECT * FROM orders
WHERE status = 'new'
   OR status = 'paid' AND total > 100;`,
      options: ["Все new и paid, у которых total > 100", "Все new с total > 100 и все paid с total > 100", "Все new и все paid"],
      answer: 0,
      explain: "AND имеет приоритет над OR, поэтому условие читается как new OR (paid AND total > 100). Чтобы фильтр total касался обоих статусов, нужны скобки."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что ищет этот запрос?",
      code: `SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
      options: ["Пользователей, у которых есть заказы", "Пользователей, у которых нет ни одного заказа", "Заказы без пользователя"],
      answer: 1,
      explain: "LEFT JOIN сохраняет всех пользователей, а у тех, кто без заказов, справа остаются NULL. Фильтр o.id IS NULL оставляет именно их (анти-джойн)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт в большинстве СУБД?",
      code: `SELECT price * qty AS line_sum
FROM order_items
WHERE line_sum > 100;`,
      options: ["Запрос вернёт позиции с суммой больше 100", "Ошибка: псевдоним line_sum не виден в WHERE", "Вернутся все позиции, фильтр проигнорируется"],
      answer: 1,
      explain: "Логически WHERE выполняется раньше SELECT, поэтому псевдонима ещё нет. Нужно повторить выражение в WHERE либо взять подзапрос или CTE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В колонке score три значения: 10, 20 и NULL. Что вернёт запрос?",
      code: `SELECT AVG(score) FROM results;`,
      options: ["10: NULL считается нулём", "15: NULL пропускается", "NULL: одно значение отравляет всё"],
      answer: 1,
      explain: "Агрегаты (AVG, SUM, MIN, MAX) игнорируют NULL. Среднее считается по двум значениям: (10 + 20) / 2 = 15."
    },
    {
      topic: "API", lang: "http",
      q: "Какой статус вернуть, если ресурса с таким id нет?",
      code: `GET /api/v1/users/999999
Authorization: Bearer <valid-token>`,
      options: ["200 OK с пустым телом", "404 Not Found", "400 Bad Request"],
      answer: 1,
      explain: "Запрос корректен, но ресурс не найден — это 404. Статус 200 с пустым телом скрывает ошибку от клиента."
    },
    {
      topic: "API", lang: "http",
      q: "Какой ответ уместен при успешном удалении, если тело ответа не нужно?",
      code: `DELETE /api/v1/projects/42
Authorization: Bearer <valid-token>`,
      options: ["204 No Content", "201 Created", "302 Found"],
      answer: 0,
      explain: "204 означает, что операция выполнена и тела ответа нет. Допустим и 200 с описанием результата, но 201 и 302 тут не подходят."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент вызвал защищённый метод без заголовка Authorization. Какой статус вернуть?",
      code: `GET /api/v1/profile
# заголовок Authorization отсутствует`,
      options: ["401 Unauthorized", "403 Forbidden", "404 Not Found"],
      answer: 0,
      explain: "401 означает, что клиент не аутентифицирован: токена нет или он неверный. 403 используют, когда личность известна, но прав недостаточно."
    },
    {
      topic: "API", lang: "http",
      q: "Пришёл запрос с битым JSON в теле. Какой статус ответит сервер?",
      code: `POST /api/v1/users
Content-Type: application/json

{ "email": "ivan@example.com", }`,
      options: ["500 Internal Server Error", "400 Bad Request", "409 Conflict"],
      answer: 1,
      explain: "Тело не разобралось как JSON — это ошибка клиента, 400. 500 был бы маскировкой клиентской ошибки под сбой сервера."
    },
    {
      topic: "API", lang: "http",
      q: "Что не так с этим эндпоинтом?",
      code: `GET /api/v1/orders/5/cancel`,
      options: ["Ничего, так проще вызывать из браузера", "GET должен быть безопасным (без изменений); отмену лучше делать через POST или PATCH", "Слово cancel нужно писать с заглавной буквы"],
      answer: 1,
      explain: "GET по спецификации безопасен и не меняет состояние: его вызывают кэши, прокси, предзагрузка ссылок. Изменяющие действия нужно выносить в POST, PATCH или DELETE."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает такой ответ и как должен реагировать клиент?",
      code: `HTTP/1.1 429 Too Many Requests
Retry-After: 30`,
      options: ["Сервер упал; нужно переключиться на резервный", "Превышен лимит запросов; повторить попытку через 30 секунд", "Запрос неверный; повторять нельзя"],
      answer: 1,
      explain: "429 сообщает о превышении лимита запросов, а Retry-After подсказывает, когда можно повторить. Клиент должен подождать, а не долбить сервер повторами."
    },
    {
      topic: "API", lang: "http",
      q: "Как правильнее передать фильтр списка пользователей по роли?",
      code: `A) GET /api/v1/users?role=admin
B) GET /api/v1/users/admin
C) POST /api/v1/users/filter   { "role": "admin" }`,
      options: ["Вариант A: фильтры идут в query-параметрах", "Вариант B: фильтр — часть пути", "Вариант C: всегда через POST"],
      answer: 0,
      explain: "Путь идентифицирует ресурс, а query-параметры уточняют выборку из коллекции. POST для обычного фильтра нарушает семантику и мешает кэшированию."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент отправил JSON, но указал неверный Content-Type. Что ответить?",
      code: `POST /api/v1/users
Content-Type: text/plain

{ "email": "ivan@example.com" }
# сервер принимает только application/json`,
      options: ["415 Unsupported Media Type", "404 Not Found", "304 Not Modified"],
      answer: 0,
      explain: "415 означает, что сервер не поддерживает формат тела запроса. Код 404 говорит об отсутствии ресурса, а 304 — об условном GET с кэшем."
    },
    {
      topic: "API", lang: "http",
      q: "База данных недоступна, и сервис не может обработать запрос. Какой статус подходит?",
      code: `GET /api/v1/orders
# БД не отвечает`,
      options: ["400 Bad Request", "503 Service Unavailable (или 500)", "404 Not Found"],
      answer: 1,
      explain: "Это сбой на стороне сервера (5xx), а не вина клиента. 503 лучше всего сообщает о временной недоступности, при этом клиент может повторить запрос позже."
    },
    {
      topic: "API", lang: "yaml",
      q: "Клиент прислал age: \"25\" (строка). Что скажет валидатор?",
      code: `# схема
properties:
  age: { type: integer }

# запрос
{ "age": "25" }`,
      options: ["Пропустит: строку можно привести к числу", "Отклонит: тип не integer, ошибка клиента (4xx)", "Вернёт 500: сервер не смог разобрать"],
      answer: 1,
      explain: "Строгая валидация не приводит типы молча. Ожидается 400/422 с указанием поля. Неявное приведение — источник трудноуловимых багов."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает ответ 304 в этом обмене?",
      code: `GET /api/v1/catalog
If-None-Match: "v42"

HTTP/1.1 304 Not Modified`,
      options: ["Каталог изменился, нужно скачать его заново", "Каталог не менялся, клиент использует свою кэшированную копию", "У клиента нет прав на каталог"],
      answer: 1,
      explain: "ETag в If-None-Match совпал с текущим, поэтому сервер не передаёт тело повторно, а клиент берёт данные из кэша. Это экономит трафик."
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
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при выполнении запроса в PostgreSQL?",
      code: `SELECT dept, name, MAX(salary)
FROM employees
GROUP BY dept;`,
      options: ["Вернёт для каждого отдела имя сотрудника с максимальной зарплатой", "Ошибка: name не входит в GROUP BY и не является агрегатом", "Вернёт случайное имя из отдела — это нормально"],
      answer: 1,
      explain: "Неагрегированная колонка в SELECT должна быть в GROUP BY. Максимальную зарплату вместе с именем получают оконной функцией ROW_NUMBER или через подзапрос."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В обеих таблицах есть клиент с id = 1. Сколько строк с id = 1 вернёт запрос?",
      code: `SELECT id FROM customers_2025
UNION
SELECT id FROM customers_2026;`,
      options: ["Две: по одной из каждой таблицы", "Одну: UNION убирает дубликаты", "Ни одной: UNION оставляет только отличающиеся"],
      answer: 1,
      explain: "UNION объединяет наборы и удаляет повторы, а UNION ALL оставляет все строки (и работает быстрее, так как не сравнивает значения)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как правильно посчитать число заказов, если JOIN размножает строки по позициям?",
      code: `SELECT COUNT(*) AS orders_cnt
FROM orders o
JOIN order_items i ON i.order_id = o.id;
-- в заказе по несколько позиций`,
      options: ["Запрос верен: COUNT(*) считает заказы", "COUNT(*) считает позиции; нужен COUNT(DISTINCT o.id)", "Нужно заменить JOIN на UNION"],
      answer: 1,
      explain: "После JOIN одна строка приходится на каждую пару «заказ — позиция». COUNT(DISTINCT o.id) считает уникальные заказы, но надёжнее агрегировать позиции до соединения."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Зарплаты в отделе: 100, 100, 90. Какой ранг получит 90?",
      code: `SELECT salary,
       RANK() OVER (ORDER BY salary DESC) AS rnk
FROM employees;`,
      options: ["2", "3", "1"],
      answer: 1,
      explain: "RANK оставляет «дыру» после равных значений: 1, 1, 3. DENSE_RANK даёт 1, 1, 2 без пропусков, а ROW_NUMBER — 1, 2, 3."
    },
    {
      topic: "SQL", lang: "sql",
      q: "У части строк discount равен NULL. Что получится в колонке final_price для них?",
      code: `SELECT id, price - discount AS final_price
FROM order_items;`,
      options: ["Равно price: NULL считается нулём", "NULL: любая арифметика с NULL даёт NULL; нужен COALESCE(discount, 0)", "Ошибка выполнения запроса"],
      answer: 1,
      explain: "Арифметика с NULL возвращает NULL. COALESCE подставляет значение по умолчанию, когда колонка пуста."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает этот запрос?",
      code: `SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;`,
      options: ["Находит сотрудников с зарплатой выше, чем у руководителя", "Находит руководителей с зарплатой выше, чем у подчинённых", "Находит сотрудников без руководителя"],
      answer: 0,
      explain: "Это self join: таблица соединяется сама с собой, m — руководитель сотрудника e. Сотрудники с manager_id = NULL (топы) в INNER JOIN не попадут."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что считает этот запрос?",
      code: `SELECT
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_cnt
FROM orders;`,
      options: ["Общее число заказов", "Число заказов со статусом paid", "Сумму оплаченных заказов"],
      answer: 1,
      explain: "Это условная агрегация: CASE превращает подходящие строки в 1, а остальные в 0, и SUM даёт количество. Приём удобен, чтобы считать несколько условий за один проход."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что ищет этот запрос?",
      code: `SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;`,
      options: ["Пользователей без email", "Email-адреса, которые встречаются более одного раза", "Топ-1 самый частый email"],
      answer: 1,
      explain: "Группировка по email плюс HAVING по числу строк в группе — стандартный способ найти дубликаты."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Подзапрос возвращает несколько строк. Что случится?",
      code: `SELECT * FROM products
WHERE price = (
  SELECT price FROM products WHERE category = 'books'
);`,
      options: ["Сравнение пройдёт с первой строкой подзапроса", "Ошибка: подзапрос вернул больше одной строки; нужен IN", "Вернутся все товары"],
      answer: 1,
      explain: "Оператор = ожидает одно значение (скалярный подзапрос). Для набора значений используют IN, ANY или EXISTS."
    },
    {
      topic: "API", lang: "http",
      q: "Генерация отчёта занимает минуты. Какой ответ даёт POST /reports?",
      code: `POST /api/v1/reports
{ "type": "sales", "period": "2026-Q3" }`,
      options: ["200 OK после того, как отчёт готов — клиент подождёт", "202 Accepted с ссылкой на статус задачи, готовность проверяется отдельно", "201 Created с пустым отчётом"],
      answer: 1,
      explain: "202 означает, что запрос принят, но не завершён. В ответе отдают URL для опроса статуса (или вебхук). Держать соединение минутами нельзя: оно оборвётся по таймауту."
    },
    {
      topic: "API", lang: "http",
      q: "Что не так с этим контрактом списка?",
      code: `GET /api/v1/orders?limit=1000000
# максимальный limit в контракте не указан`,
      options: ["Ничего: клиент сам знает, сколько ему нужно", "Нужен максимум для limit (и значение по умолчанию), иначе один запрос может положить сервер", "Параметр limit надо передавать в теле запроса"],
      answer: 1,
      explain: "Без верхней границы клиент может запросить миллион строк и перегрузить базу и сеть. Контракт должен задавать default и max, а превышение — отклонять или обрезать."
    },
    {
      topic: "API", lang: "yaml",
      q: "В ответ API добавили новое значение enum. Чем это опасно?",
      code: `# было
status: { type: string, enum: [new, paid, shipped] }

# стало
status: { type: string, enum: [new, paid, shipped, refunded] }`,
      options: ["Ничем: добавление значений всегда безопасно", "Клиенты со строгим разбором enum упадут на неизвестном значении; нужно оговорить, что список может расширяться", "Опасно только удаление значения из запроса"],
      answer: 1,
      explain: "Для ответов расширение enum может сломать клиентов, у которых switch или десериализация не знает нового значения. В контракте стоит указать, что неизвестные значения обрабатываются по умолчанию."
    },
    {
      topic: "API", lang: "json",
      q: "Чем плох такой формат даты в API?",
      code: `{
  "createdAt": "2026-10-26T10:00:00"
}`,
      options: ["Ничем: так короче", "Нет часового пояса: момент времени неоднозначен; нужен ISO 8601 со смещением или Z", "Дату надо передавать числом дней"],
      answer: 1,
      explain: "Без смещения одно и то же значение означает разные моменты для клиентов в разных зонах. Стандартный вариант: 2026-10-26T10:00:00Z или с +03:00."
    },
    {
      topic: "API", lang: "http",
      q: "Что не так с передачей токена в этом запросе?",
      code: `GET /api/v1/orders?access_token=eyJhbGciOi...`,
      options: ["Ничего: так удобнее тестировать", "Токен в URL попадает в логи, историю и заголовок Referer; его нужно передавать в Authorization", "Токен нужно передавать только в теле GET"],
      answer: 1,
      explain: "URL логируется прокси, серверами и сохраняется браузером, поэтому секреты в нём утекают. Стандарт — заголовок Authorization: Bearer <token>."
    },
    {
      topic: "API", lang: "http",
      q: "Пользователь запросил заказ другого клиента. Что допустимо вернуть, чтобы не раскрывать существование ресурса?",
      code: `GET /api/v1/orders/5001
Authorization: Bearer <token клиента B>
# заказ 5001 принадлежит клиенту A`,
      options: ["404 Not Found: так нельзя узнать, что заказ существует", "200 OK с пустым телом", "500 Internal Server Error"],
      answer: 0,
      explain: "403 подтверждает, что ресурс есть, но доступ запрещён, и это может быть утечкой. Для чувствительных данных чужие объекты нередко маскируют под 404."
    },
    {
      topic: "API", lang: "json",
      q: "Что не так с этим ответом при ошибке?",
      code: `HTTP/1.1 200 OK

{ "success": false, "error": "Email already used" }`,
      options: ["Ничего: поле success достаточно", "Статус 200 скрывает ошибку от клиентов, кэшей и мониторинга; нужен 4xx/5xx", "Нужно убрать поле error"],
      answer: 1,
      explain: "HTTP-статус — часть контракта: по нему работают retry-политики, алерты и кэши. Ошибки отдают с корректным кодом (здесь 409 или 422), а детали — в теле."
    },
    {
      topic: "API", lang: "http",
      q: "Какой заголовок запретит кэшировать ответ с персональными данными?",
      code: `GET /api/v1/profile
-- ответ содержит ФИО, телефон и адрес`,
      options: ["Cache-Control: no-store", "Accept: application/json", "Content-Length: 0"],
      answer: 0,
      explain: "Cache-Control: no-store запрещает любым кэшам (браузера и прокси) сохранять ответ. no-cache, наоборот, разрешает хранить, но требует перепроверки."
    },
    {
      topic: "API", lang: "http",
      q: "В пакетной загрузке 10 записей, 2 невалидны. Что должен определять контракт?",
      code: `POST /api/v1/users/batch
[ {...}, {...}, ... 10 записей ]`,
      options: ["Ничего: сервер сам решит", "Правило: всё-или-ничего либо отдельный результат по каждой записи (например, 207 Multi-Status)", "Достаточно вернуть 200 и не сообщать об ошибках"],
      answer: 1,
      explain: "Поведение при частичной ошибке нужно описать явно. Иначе клиент не поймёт, какие записи сохранены, и повтор приведёт к дублям или потерям."
    },
    {
      topic: "API", lang: "json",
      q: "Идентификатор — большое число. Почему такой ответ опасен для JS-клиентов?",
      code: `{ "id": 9007199254740993 }`,
      options: ["Нет причин: JSON поддерживает любые числа", "В JavaScript числа точны только до 2^53; такие id нужно передавать строкой", "Число нужно писать с десятичной точкой"],
      answer: 1,
      explain: "JS хранит числа как double, и значения больше 9007199254740991 теряют точность. Идентификаторы (особенно 64-битные) безопаснее отдавать строками."
    },
    {
      topic: "API", lang: "http",
      q: "Фильтр очень сложный и не помещается в URL. Что допустимо?",
      code: `GET /api/v1/orders/search
{ "filters": [ ... сотни условий ... ] }   # GET с телом`,
      options: ["Оставить GET с телом: стандарт это разрешает", "Использовать POST /orders/search с телом: GET с телом клиенты и прокси трактуют непредсказуемо", "Передавать фильтр в заголовке Cookie"],
      answer: 1,
      explain: "Спецификация не запрещает тело у GET, но многие библиотеки, шлюзы и кэши его игнорируют или отбрасывают. Поиск через POST — распространённый компромисс."
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
    },
    {
      topic: "SQL", lang: "sql",
      q: "Две транзакции выполняются одновременно. Что может случиться?",
      code: `-- Транзакция 1                       -- Транзакция 2
UPDATE accounts SET ... WHERE id = 1;  UPDATE accounts SET ... WHERE id = 2;
UPDATE accounts SET ... WHERE id = 2;  UPDATE accounts SET ... WHERE id = 1;`,
      options: ["Ничего: блокировки снимаются сразу", "Взаимная блокировка (deadlock): СУБД откатит одну из транзакций; строки нужно блокировать в едином порядке", "Обе транзакции успешно завершатся без ожидания"],
      answer: 1,
      explain: "Каждая транзакция держит строку и ждёт другую, поэтому возникает цикл ожидания. СУБД выберет жертву и вернёт ошибку. Профилактика: единый порядок блокировок и короткие транзакции."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Есть составной индекс (user_id, created_at). Поможет ли он этому запросу?",
      code: `CREATE INDEX idx_orders ON orders (user_id, created_at);

SELECT * FROM orders
WHERE created_at >= '2026-10-01';`,
      options: ["Да: индекс покрывает обе колонки", "Плохо: условие не содержит первую колонку индекса (правило левого префикса)", "Индекс не используется только для дат"],
      answer: 1,
      explain: "B-tree индекс упорядочен по первой колонке, затем по второй. Поиск только по второй колонке не может сузить диапазон, и обычно приводит к полному скану. Нужен индекс с created_at первым или отдельный."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему такая пагинация деградирует на больших страницах?",
      code: `SELECT * FROM events
ORDER BY id
LIMIT 50 OFFSET 1000000;`,
      options: ["Потому что LIMIT не работает с большими числами", "СУБД обязана прочитать и отбросить миллион строк перед выдачей; лучше keyset-пагинация WHERE id > :last_id", "Потому что нет GROUP BY"],
      answer: 1,
      explain: "OFFSET не «перепрыгивает» строки, а читает и выкидывает их, поэтому время растёт с номером страницы. Keyset-подход берёт стартовую точку по индексу."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Уровень изоляции READ COMMITTED. Что возможно между двумя SELECT внутри одной транзакции?",
      code: `BEGIN;
SELECT SUM(balance) FROM accounts;   -- 1000
-- другая транзакция зафиксировала пополнение счёта
SELECT SUM(balance) FROM accounts;   -- ?
COMMIT;`,
      options: ["Результат всегда тот же: 1000", "Результат может измениться: каждый запрос видит данные, зафиксированные на его момент (неповторяющееся чтение)", "Вторая команда будет заблокирована до конца другой транзакции"],
      answer: 1,
      explain: "В READ COMMITTED каждый оператор получает свежий снимок зафиксированных данных. Для стабильного снимка внутри транзакции нужен REPEATABLE READ или SERIALIZABLE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Несколько воркеров разбирают очередь задач в таблице. Как не взять одну задачу дважды?",
      code: `SELECT id FROM jobs
WHERE status = 'pending'
ORDER BY id
LIMIT 1
FOR UPDATE SKIP LOCKED;`,
      options: ["SKIP LOCKED пропускает уже заблокированные другим воркером строки, поэтому задачи не пересекаются", "SKIP LOCKED делает запрос быстрее, но дубли возможны", "FOR UPDATE запрещает читать таблицу всем остальным"],
      answer: 0,
      explain: "FOR UPDATE блокирует выбранную строку, а SKIP LOCKED заставляет остальных воркеров брать следующую свободную, а не ждать. Так таблицу можно использовать как простую очередь."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Нужно переименовать колонку без простоя при выкатке новой версии приложения. Что безопаснее?",
      code: `-- старая версия приложения читает users.fullname
ALTER TABLE users RENAME COLUMN fullname TO full_name;`,
      options: ["Сразу переименовать: деплой всё равно быстрый", "Подход expand/contract: добавить новую колонку, писать в обе, перевести чтение, затем удалить старую", "Удалить таблицу и создать заново"],
      answer: 1,
      explain: "Во время выкатки одновременно работают старая и новая версии кода. Прямое переименование ломает старую. Поэтапная миграция сохраняет совместимость на каждом шаге."
    },
    {
      topic: "SQL", lang: "sql",
      q: "99% пользователей имеют is_active = true. Принесёт ли пользу индекс по этой колонке для запроса ниже?",
      code: `CREATE INDEX idx_users_active ON users (is_active);

SELECT * FROM users WHERE is_active = true;`,
      options: ["Да: любой индекс ускоряет WHERE", "Нет: условие выбирает почти всю таблицу, планировщик предпочтёт полный скан; индекс на колонку с низкой селективностью бесполезен", "Да, если добавить ORDER BY"],
      answer: 1,
      explain: "Индекс выгоден, когда условие отбирает малую долю строк. Если возвращается почти всё, быстрее читать таблицу последовательно. Для редкого значения (false) подойдёт частичный индекс."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему этот запрос не использует индекс по name?",
      code: `SELECT * FROM customers
WHERE name LIKE '%son';`,
      options: ["Потому что LIKE вообще не использует индексы", "Поиск идёт по суффиксу: B-tree упорядочен по началу строки, поэтому нужен полный скан (или другой тип индекса, например trigram)", "Потому что слишком короткая строка"],
      answer: 1,
      explain: "B-tree эффективен для условий вида 'abc%' (префикс). Если шаблон начинается с %, начало неизвестно, и упорядоченность не помогает."
    },
    {
      topic: "SQL", lang: "text",
      q: "Что плохого в таком порядке действий внутри транзакции?",
      code: `BEGIN;
UPDATE orders SET status = 'processing' WHERE id = 7;
-- HTTP-вызов внешнего платёжного сервиса (до 30 секунд)
UPDATE orders SET status = 'paid' WHERE id = 7;
COMMIT;`,
      options: ["Ничего: транзакция гарантирует целостность", "Строка заблокирована всё время вызова; долгие транзакции держат блокировки и соединения — внешние вызовы выносят за границы транзакции", "Нужно заменить UPDATE на INSERT"],
      answer: 1,
      explain: "Пока транзакция открыта, блокировки не снимаются, а пул соединений занят. Медленный или зависший сервис парализует остальные запросы. Внешние вызовы делают вне транзакции, а согласованность обеспечивают статусами и повторами."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт, если email уже есть в таблице, а колонка email уникальна?",
      code: `INSERT INTO users (email, name)
VALUES ('ivan@example.com', 'Ivan')
ON CONFLICT (email) DO NOTHING;`,
      options: ["Ошибка нарушения уникальности", "Конфликтная вставка молча пропустится, затронуто 0 строк", "Существующая строка перезапишется"],
      answer: 1,
      explain: "ON CONFLICT DO NOTHING пропускает строку без ошибки. Чтобы обновить запись, используют DO UPDATE. Приём удобен для идемпотентной загрузки, но число затронутых строк нужно проверять."
    },
    {
      topic: "API", lang: "text",
      q: "100 клиентов получили ошибку и все повторяют запрос ровно через 1 секунду. Что произойдёт и как исправить?",
      code: `retry:
  delay: 1s fixed
  attempts: unlimited`,
      options: ["Ничего плохого: так проще предсказать нагрузку", "Все повторы придут одновременно и добьют сервер (thundering herd); нужна экспоненциальная задержка с jitter и лимит попыток", "Достаточно уменьшить задержку до 100 мс"],
      answer: 1,
      explain: "Синхронные повторы создают пиковую нагрузку именно тогда, когда сервис восстанавливается. Экспоненциальный backoff с рандомным разбросом (jitter) размазывает повторы во времени."
    },
    {
      topic: "API", lang: "http",
      q: "Как получатель вебхука может убедиться, что запрос прислал именно провайдер?",
      code: `POST /webhooks/payments
X-Signature: sha256=9f2c...
X-Timestamp: 1761472000

{ "event": "payment.succeeded", ... }`,
      options: ["Проверить IP-адрес отправителя", "Пересчитать HMAC от сырого тела (и timestamp) общим секретом и сверить с подписью; старые timestamp отбрасывать", "Просто доверять заголовку X-Signature"],
      answer: 1,
      explain: "Подпись HMAC доказывает, что тело не подделано и отправитель знает секрет. Проверка timestamp защищает от повторной отправки перехваченного запроса (replay)."
    },
    {
      topic: "API", lang: "text",
      q: "Платёж прошёл, а создание заказа упало. Как восстановить согласованность в распределённой системе?",
      code: `1. payment-service: списать деньги     -> OK
2. order-service:   создать заказ      -> ERROR`,
      options: ["Ничего: подождать и надеяться, что заказ появится", "Компенсирующее действие (возврат платежа) в рамках саги либо повтор шага 2 с идемпотентностью", "Откатить платёж командой ROLLBACK"],
      answer: 1,
      explain: "Общей транзакции между сервисами нет, поэтому используют сагу: либо повторяют шаг до успеха, либо выполняют компенсацию (refund). Оба шага должны быть идемпотентными."
    },
    {
      topic: "API", lang: "text",
      q: "Сервис пишет заказ в БД, затем публикует событие в брокер. Что может пойти не так?",
      code: `1. INSERT INTO orders ...; COMMIT;
2. broker.publish(OrderCreated)   -- процесс упал между шагами`,
      options: ["Ничего: падения не бывает", "Заказ сохранён, а событие потеряно; решение — паттерн outbox: событие пишется в ту же транзакцию и отправляется отдельным процессом", "Событие отправится дважды автоматически"],
      answer: 1,
      explain: "Запись в БД и в брокер — две разные системы без общей транзакции. Outbox фиксирует событие атомарно с данными, а отправка с повторами гарантирует доставку (at-least-once)."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент повторил запрос с тем же Idempotency-Key, но другим телом. Что должен сделать сервер?",
      code: `POST /api/v1/payments
Idempotency-Key: 7f3a-91c2
{ "amount": "50.00" }

-- ранее с этим ключом пришло { "amount": "30.00" }`,
      options: ["Выполнить новый платёж на 50.00", "Вернуть сохранённый результат для 30.00 без проверки", "Отклонить с ошибкой (409/422): ключ уже использован с другими данными"],
      answer: 2,
      explain: "Ключ идентифицирует одну логическую операцию. Совпадение ключа при другом теле — ошибка клиента, и тихое выполнение любого из вариантов приведёт к неверному списанию."
    },
    {
      topic: "API", lang: "http",
      q: "Как корректно вывести из эксплуатации старую версию API?",
      code: `GET /api/v1/orders    # планируется отключение`,
      options: ["Отключить в день релиза v2: клиенты сами заметят", "Объявить срок, отдавать заголовки Deprecation/Sunset, мониторить использование и отключать после периода миграции", "Молча менять формат ответа в v1"],
      answer: 1,
      explain: "Клиентам нужно время и сигналы. Заголовок Sunset сообщает дату отключения, а по логам видно, кто ещё использует v1. Внезапное отключение ломает потребителей."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент создал ресурс и сразу запросил его, но получил 404. Какая вероятная причина?",
      code: `POST /api/v1/orders       -> 201 Created, Location: /orders/9001
GET  /api/v1/orders/9001  -> 404 Not Found   (через секунду; чтение с реплики)`,
      options: ["Ресурс создан неправильно", "Задержка репликации (eventual consistency): реплика ещё не получила запись; помогает чтение с primary или возврат ресурса в ответе POST", "Статус 404 — норма для новых ресурсов"],
      answer: 1,
      explain: "Реплики отстают от primary на доли секунды или дольше. Для сценариев «прочитай своё изменение» читают с primary, возвращают созданный объект в ответе или привязывают чтение к версии."
    },
    {
      topic: "API", lang: "http",
      q: "Шлюз не получил ответ от бэкенда за отведённое время. Какой статус вернёт шлюз?",
      code: `Client -> API Gateway -> Backend (не отвечает 60 секунд)`,
      options: ["504 Gateway Timeout", "502 Bad Gateway", "408 Request Timeout"],
      answer: 0,
      explain: "504 означает, что шлюз не дождался ответа вышестоящего сервера. 502 — если от него пришёл некорректный ответ, а 408 относится к тому, что клиент слишком долго отправлял запрос."
    },
    {
      topic: "API", lang: "text",
      q: "Можно ли мгновенно отозвать выданный JWT-токен с exp через час, если сервер ничего о нём не хранит?",
      code: `Access token: JWT, exp = +1h, проверка только по подписи`,
      options: ["Да: достаточно сменить пароль", "Нет: токен валиден до истечения; нужны короткий TTL с refresh-токеном и/или список отозванных (denylist)", "Да: токены отзываются автоматически при выходе пользователя"],
      answer: 1,
      explain: "Stateless-токен проверяется без обращения к хранилищу, поэтому сервер не знает об отзыве. Компромисс: короткий access-токен, отзыв refresh-токена и при необходимости denylist по идентификатору jti."
    },
    {
      topic: "API", lang: "http",
      q: "Между запросами первой и второй страниц в начало списка добавили новые записи. Что увидит клиент?",
      code: `GET /api/v1/feed?limit=20&offset=0
-- вставили 5 новых записей
GET /api/v1/feed?limit=20&offset=20`,
      options: ["Ничего необычного: страницы идут строго подряд", "Записи сдвинутся: 5 последних элементов первой страницы повторятся на второй; решение — курсорная пагинация", "Вторая страница вернёт 404"],
      answer: 1,
      explain: "Offset считается от начала текущего набора, поэтому вставки и удаления сдвигают границы страниц, и клиент видит дубли или пропуски. Курсор привязан к конкретной записи, а не к номеру позиции."
    }
  ]
};
