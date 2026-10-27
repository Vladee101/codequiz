// Банк вопросов. answer — индекс верного варианта в options (0..2); порядок вариантов перемешивается при показе.
// topic: "SQL" | "API" | "ERD" | "BPMN" | "UC" | "SEQ" | "STATE" | "ACT"; lang: "sql" | "json" | "yaml" | "http" | "text"
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
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие значения попадут в результат?",
      code: `SELECT * FROM items
WHERE qty BETWEEN 1 AND 3;`,
      options: ["Только 2", "1, 2 и 3: границы включаются", "Только 2 и 3"],
      answer: 1,
      explain: "BETWEEN включает обе границы, это эквивалент qty >= 1 AND qty <= 3."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает этот запрос?",
      code: `SELECT * FROM orders
WHERE status IN ('new', 'paid');`,
      options: ["Возвращает заказы со статусом new или paid", "Возвращает заказы, у которых есть оба статуса сразу", "Возвращает заказы, статус которых не new и не paid"],
      answer: 0,
      explain: "IN сравнивает значение со списком, это короткая запись status = 'new' OR status = 'paid'."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как правильно отобрать пользователей, у которых указан телефон?",
      code: `-- phone может быть NULL
SELECT * FROM users
WHERE ???;`,
      options: ["phone <> NULL", "phone IS NOT NULL", "phone != ''"],
      answer: 1,
      explain: "С NULL сравнивают только через IS NULL / IS NOT NULL. Условие <> NULL всегда даёт UNKNOWN. Пустая строка и NULL — это разные значения."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как получить самый дорогой товар?",
      code: `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 1;`,
      options: ["Запрос вернёт самый дорогой товар", "Запрос вернёт самый дешёвый товар", "Запрос вернёт ошибку: LIMIT нельзя с ORDER BY"],
      answer: 0,
      explain: "Сортировка по убыванию ставит максимальную цену первой, LIMIT 1 берёт одну строку. При равных ценах выбор одной из них не определён без дополнительной сортировки."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какая дата вернётся?",
      code: `SELECT MIN(created_at)
FROM orders;`,
      options: ["Самая поздняя дата заказа", "Самая ранняя дата заказа", "Количество заказов"],
      answer: 1,
      explain: "MIN и MAX работают не только с числами, но и с датами и строками. MIN возвращает наименьшее значение, для даты это самый ранний момент."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Таблица пуста, строк нет вообще. Что вернут эти агрегаты?",
      code: `SELECT SUM(amount), COUNT(*)
FROM payments;`,
      options: ["0 и 0", "NULL и 0", "NULL и NULL"],
      answer: 1,
      explain: "COUNT по пустому набору даёт 0, а SUM, AVG, MIN и MAX — NULL. Чтобы получить 0 вместо NULL, используют COALESCE(SUM(amount), 0)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при выполнении команды?",
      code: `DELETE FROM temp_logs;`,
      options: ["Удалится сама таблица вместе со структурой", "Удалятся все строки, таблица останется", "Ошибка: нужен WHERE"],
      answer: 1,
      explain: "DELETE без WHERE удаляет все строки, но структура таблицы сохраняется. Удаление таблицы выполняет DROP TABLE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что будет записано в колонки?",
      code: `INSERT INTO users (name, email)
VALUES ('ivan@example.com', 'Ivan');`,
      options: ["Всё верно: СУБД сама определит, где имя, а где email", "Значения попадут не в те колонки: порядок значений соответствует порядку колонок", "Ошибка: нельзя указывать колонки"],
      answer: 1,
      explain: "Значения в VALUES сопоставляются с перечисленными колонками строго по порядку. Тут name получит email, а email — имя; СУБД этого не заметит, если типы совпадают."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при второй вставке?",
      code: `-- users.id — PRIMARY KEY
INSERT INTO users (id, name) VALUES (1, 'Anna');
INSERT INTO users (id, name) VALUES (1, 'Boris');`,
      options: ["Вторая строка перезапишет первую", "Вторая вставка завершится ошибкой: id должен быть уникальным", "В таблице окажутся две строки с id = 1"],
      answer: 1,
      explain: "Первичный ключ гарантирует уникальность и отсутствие NULL. Нарушение приводит к ошибке, перезапись возможна только явно (UPSERT)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при вставке?",
      code: `-- users.email NOT NULL
INSERT INTO users (id, name)
VALUES (10, 'Anna');`,
      options: ["Строка добавится, email станет пустой строкой", "Ошибка: для email нет значения, а NULL запрещён", "Строка добавится с email = NULL"],
      answer: 1,
      explain: "Если для NOT NULL колонки нет значения по умолчанию, вставка отклоняется. Пустую строку СУБД сама не подставит."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какой status получит новая запись?",
      code: `-- status text DEFAULT 'new'
INSERT INTO orders (id, user_id)
VALUES (5, 1);`,
      options: ["NULL", "'new': сработает значение по умолчанию", "Пустая строка"],
      answer: 1,
      explain: "Если колонка не указана в INSERT, подставляется её DEFAULT. NULL будет только при отсутствии DEFAULT."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос, если в таблицах 3 и 4 строки, а условия соединения нет?",
      code: `SELECT *
FROM colors, sizes;`,
      options: ["3 строки", "7 строк", "12 строк: каждая с каждой"],
      answer: 2,
      explain: "Без условия соединения получается декартово произведение: 3 × 4 = 12. Чаще всего это ошибка, если забыли ON или WHERE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что получится в name_full?",
      code: `-- PostgreSQL
SELECT first_name || ' ' || last_name AS name_full
FROM users;`,
      options: ["Имя и фамилия через пробел", "Сумма двух строк как чисел", "Ошибка: нельзя объединять строки"],
      answer: 0,
      explain: "Оператор || склеивает строки. Если хоть одно значение NULL, результат склейки тоже будет NULL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос для name = 'anna'?",
      code: `SELECT UPPER(name)
FROM users;`,
      options: ["anna", "ANNA", "Anna"],
      answer: 1,
      explain: "UPPER переводит строку в верхний регистр, LOWER — в нижний. Обычно их используют для сравнения без учёта регистра."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что покажет запрос для пользователя без телефона?",
      code: `SELECT COALESCE(phone, 'не указан')
FROM users;`,
      options: ["NULL", "не указан", "Ошибку: типы не совпадают"],
      answer: 1,
      explain: "COALESCE возвращает первое значение, которое не NULL. Если phone пустой, подставится запасное значение."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что выведет запрос для заказа на 1500?",
      code: `SELECT CASE
         WHEN total >= 1000 THEN 'крупный'
         ELSE 'обычный'
       END AS size
FROM orders;`,
      options: ["обычный", "крупный", "NULL"],
      answer: 1,
      explain: "CASE проверяет условия сверху вниз и возвращает результат первой подходящей ветки. Если не подошло ничего и нет ELSE, будет NULL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос в PostgreSQL?",
      code: `SELECT 5 / 2;`,
      options: ["2.5", "2: деление двух целых чисел целочисленное", "3"],
      answer: 1,
      explain: "В PostgreSQL деление целых даёт целое с отбрасыванием дробной части. Чтобы получить 2.5, нужно привести один из операндов к дробному типу, например 5 / 2.0."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос?",
      code: `SELECT ROUND(3.14159, 2);`,
      options: ["3.14", "3.1", "3.15"],
      answer: 0,
      explain: "Второй аргумент ROUND задаёт число знаков после запятой. 3.14159 округляется до 3.14."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт эта функция?",
      code: `SELECT CURRENT_DATE;`,
      options: ["Текущую дату", "Текущую дату и время", "Дату создания таблицы"],
      answer: 0,
      explain: "CURRENT_DATE возвращает сегодняшнюю дату без времени. Дату и время отдаёт CURRENT_TIMESTAMP или NOW()."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Сколько строк даст этот запрос, если в данных 3 клиента, у каждого заказы в 2 валютах?",
      code: `SELECT customer_id, currency, COUNT(*)
FROM orders
GROUP BY customer_id, currency;`,
      options: ["3 строки", "6 строк: по одной на пару (клиент, валюта)", "1 строка"],
      answer: 1,
      explain: "Группировка по нескольким колонкам создаёт отдельную группу для каждой уникальной комбинации значений."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему в продакшен-коде лучше не использовать SELECT *?",
      code: `SELECT * FROM users;`,
      options: ["Запрос работает медленнее на уровне синтаксиса", "Возвращаются лишние колонки, а при изменении схемы меняется и результат — это ломает код", "SELECT * запрещён стандартом SQL"],
      answer: 1,
      explain: "Явный список колонок уменьшает объём данных и защищает от неожиданных изменений контракта между запросом и приложением."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что посчитает этот запрос?",
      code: `SELECT COUNT(DISTINCT user_id)
FROM orders;`,
      options: ["Число заказов", "Число уникальных пользователей, сделавших заказы", "Число пользователей без заказов"],
      answer: 1,
      explain: "DISTINCT внутри COUNT считает только различные значения. Здесь каждый пользователь учитывается один раз, сколько бы заказов он ни сделал."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что посчитает COUNT?",
      code: `SELECT customer_id, COUNT(*)
FROM orders
WHERE status = 'paid'
GROUP BY customer_id;`,
      options: ["Все заказы клиента", "Только оплаченные заказы: фильтр применяется до группировки", "Только клиентов со статусом paid"],
      answer: 1,
      explain: "WHERE отбирает строки до GROUP BY, поэтому агрегат считается только по оплаченным заказам."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие товары вернёт запрос?",
      code: `SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);`,
      options: ["Товары дороже средней цены", "Товары дешевле средней цены", "Только один самый дорогой товар"],
      answer: 0,
      explain: "Скалярный подзапрос вычисляет среднюю цену, и она сравнивается с ценой каждой строки внешнего запроса."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт этот запрос?",
      code: `SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);`,
      options: ["Пользователей, у которых есть хотя бы один заказ", "Пользователей без заказов", "Все заказы с пользователями"],
      answer: 0,
      explain: "EXISTS возвращает TRUE, если подзапрос нашёл хотя бы одну строку. Что именно выбирается внутри, не важно, поэтому часто пишут SELECT 1."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В каком порядке СУБД логически выполняет части запроса?",
      code: `SELECT dept, COUNT(*)
FROM employees
WHERE active
GROUP BY dept
HAVING COUNT(*) > 5
ORDER BY dept;`,
      options: ["SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY", "WHERE, FROM, HAVING, GROUP BY, ORDER BY, SELECT"],
      answer: 1,
      explain: "Логический порядок отличается от порядка записи. Поэтому псевдонимы из SELECT не видны в WHERE и HAVING, зато доступны в ORDER BY."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Сработает ли такая сортировка?",
      code: `SELECT price * qty AS line_sum
FROM order_items
ORDER BY line_sum DESC;`,
      options: ["Нет: псевдоним в ORDER BY использовать нельзя", "Да: ORDER BY выполняется после SELECT и видит псевдонимы", "Только если добавить WHERE"],
      answer: 1,
      explain: "ORDER BY логически идёт после SELECT, поэтому псевдонимы в нём доступны, в отличие от WHERE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какую страницу вернёт запрос при размере страницы 10?",
      code: `SELECT * FROM products
ORDER BY id
LIMIT 10 OFFSET 20;`,
      options: ["Первую", "Вторую", "Третью: пропущено 20 строк"],
      answer: 2,
      explain: "OFFSET пропускает первые 20 строк, поэтому выдача начинается с 21-й, то есть это третья страница по 10."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт с данными?",
      code: `BEGIN;
DELETE FROM orders WHERE status = 'draft';
ROLLBACK;`,
      options: ["Черновики удалены навсегда", "Ничего не изменится: ROLLBACK откатывает транзакцию", "Удалены все заказы"],
      answer: 1,
      explain: "ROLLBACK отменяет все изменения с начала транзакции. Только COMMIT делает их постоянными."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Для чего нужен индекс?",
      code: `CREATE INDEX idx_users_email ON users (email);`,
      options: ["Ускоряет поиск по email, но замедляет вставку и обновление", "Делает email уникальным", "Шифрует значения в колонке"],
      answer: 0,
      explain: "Индекс — отдельная структура для быстрого поиска. Её нужно обновлять при записи, поэтому индексы стоят дорого. Уникальность задаёт отдельный UNIQUE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что такое представление (VIEW)?",
      code: `CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;`,
      options: ["Копия данных в отдельной таблице", "Сохранённый запрос, который выполняется при обращении к нему", "Индекс по таблице users"],
      answer: 1,
      explain: "Обычный VIEW не хранит данные, а лишь именует запрос. Материализованное представление, наоборот, хранит результат."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие строки вернёт запрос, если у части заказов status равен NULL?",
      code: `SELECT * FROM orders
WHERE status <> 'paid';`,
      options: ["Все заказы, кроме paid, включая NULL", "Заказы с другим статусом, но без тех, где status равен NULL", "Ни одной строки"],
      answer: 1,
      explain: "Сравнение NULL с любым значением даёт UNKNOWN, строка отбрасывается. Чтобы включить NULL, пишут status IS DISTINCT FROM 'paid' или OR status IS NULL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос?",
      code: `SELECT user_id, MAX(created_at)
FROM orders
GROUP BY user_id;`,
      options: ["Дату самого свежего заказа каждого пользователя", "Дату самого первого заказа", "Одну дату на всю таблицу"],
      answer: 0,
      explain: "MAX внутри группы возвращает наибольшее значение, для даты это самый свежий момент. Группа здесь — пользователь."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Чему равен этот запрос?",
      code: `SELECT *
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;`,
      options: ["Это то же самое, что orders o LEFT JOIN customers c", "Это то же самое, что INNER JOIN", "Вернутся только клиенты без заказов"],
      answer: 0,
      explain: "RIGHT JOIN сохраняет все строки правой таблицы, это зеркальное отражение LEFT JOIN. На практике чаще пишут LEFT и переставляют таблицы."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос для строки 'Anna'?",
      code: `SELECT LENGTH(name)
FROM users;`,
      options: ["4: число символов в строке", "1: число слов", "Позицию первой буквы"],
      answer: 0,
      explain: "LENGTH возвращает длину строки в символах. Для NULL результат тоже NULL."
    },
    {
      topic: "API", lang: "http",
      q: "Какой статус ожидается при успешном получении ресурса?",
      code: `GET /api/v1/users/42
Authorization: Bearer <valid-token>`,
      options: ["200 OK с телом ресурса", "201 Created", "204 No Content"],
      answer: 0,
      explain: "200 — стандартный успешный ответ на GET. 201 используют при создании, а 204 — когда тела ответа нет."
    },
    {
      topic: "API", lang: "http",
      q: "Какой статус вернуть на метод, который не поддерживается ресурсом?",
      code: `DELETE /api/v1/countries
# справочник доступен только для чтения`,
      options: ["404 Not Found", "405 Method Not Allowed", "401 Unauthorized"],
      answer: 1,
      explain: "405 означает, что ресурс есть, но данный HTTP-метод к нему не применим. В заголовке Allow перечисляют допустимые методы."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает такой ответ?",
      code: `HTTP/1.1 301 Moved Permanently
Location: https://api.example.com/v2/users`,
      options: ["Ресурс перенесён навсегда, клиент должен обращаться по новому адресу", "Временный сбой, нужно повторить запрос", "Ошибка авторизации"],
      answer: 0,
      explain: "301 — постоянный редирект на адрес из заголовка Location. Для временного перенаправления используют 302 или 307."
    },
    {
      topic: "API", lang: "http",
      q: "Кто считается виновником ошибки при ответе 500?",
      code: `HTTP/1.1 500 Internal Server Error`,
      options: ["Клиент: прислал неверный запрос", "Сервер: сбой на его стороне при обработке корректного запроса", "Сеть между ними"],
      answer: 1,
      explain: "Коды 4xx — ошибки клиента, 5xx — ошибки сервера. Невалидные входные данные не должны приводить к 500."
    },
    {
      topic: "API", lang: "text",
      q: "К какой группе относятся статусы 4xx?",
      code: `200, 201, 204 -> ?
400, 404, 409 -> ?
500, 502, 503 -> ?`,
      options: ["Ошибки клиента: запрос неверный или невыполнимый", "Ошибки сервера", "Успешные ответы"],
      answer: 0,
      explain: "2xx — успех, 3xx — перенаправление, 4xx — ошибка клиента, 5xx — ошибка сервера."
    },
    {
      topic: "API", lang: "http",
      q: "Какой путь лучше соответствует REST-стилю?",
      code: `A) GET /api/v1/getUsers
B) GET /api/v1/users
C) POST /api/v1/users/delete/42`,
      options: ["A: глагол в пути делает его понятнее", "B: ресурс назван существительным, действие задаёт метод", "C: удаление должно быть POST"],
      answer: 1,
      explain: "В REST путь называет ресурс (существительное, обычно во множественном числе), а действие определяет HTTP-метод."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает такой путь?",
      code: `GET /api/v1/users/42/orders`,
      options: ["Список заказов пользователя с id = 42", "Заказ с номером 42", "Пользователь с заказом 42"],
      answer: 0,
      explain: "Вложенный путь выражает принадлежность: заказы относятся к пользователю 42. Идентификатор конкретного заказа был бы ещё одним сегментом."
    },
    {
      topic: "API", lang: "http",
      q: "Какой метод выбрать, чтобы изменить только телефон пользователя?",
      code: `# у пользователя 15 полей, меняется одно`,
      options: ["PATCH: передаётся только изменяемое поле", "PUT: передаётся целиком только телефон", "GET с параметром phone"],
      answer: 0,
      explain: "PATCH предназначен для частичного обновления, PUT — для полной замены ресурса. GET не должен ничего менять."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент не получил ответ и повторил запрос. Чем это опасно?",
      code: `POST /api/v1/orders
{ "items": [101, 102] }`,
      options: ["Ничем: сервер отличит повтор", "Заказ может создаться дважды: POST не идемпотентен", "Запрос автоматически отменится"],
      answer: 1,
      explain: "Повтор POST без защиты (например, Idempotency-Key) создаёт дубль. Повтор GET, PUT и DELETE безопасен по замыслу."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает свойство «безопасный метод»?",
      code: `GET /api/v1/orders
HEAD /api/v1/orders`,
      options: ["Метод не изменяет состояние на сервере", "Метод защищён паролем", "Метод всегда возвращает 200"],
      answer: 0,
      explain: "Безопасные методы (GET, HEAD, OPTIONS) только читают данные. Поэтому их можно кэшировать и безопасно повторять."
    },
    {
      topic: "API", lang: "http",
      q: "Для чего клиент отправляет заголовок Accept?",
      code: `GET /api/v1/users/42
Accept: application/json`,
      options: ["Сообщает серверу, в каком формате клиент хочет получить ответ", "Сообщает, в каком формате отправлено тело запроса", "Передаёт токен доступа"],
      answer: 0,
      explain: "Accept описывает желаемый формат ответа, а Content-Type — формат тела самого запроса или ответа."
    },
    {
      topic: "API", lang: "http",
      q: "Как принято передавать токен доступа?",
      code: `A) GET /orders?token=abc123
B) GET /orders
   Authorization: Bearer abc123`,
      options: ["Вариант A: проще в браузере", "Вариант B: токен в заголовке Authorization", "Любой: разницы нет"],
      answer: 1,
      explain: "Заголовок Authorization — стандартное место для токена. URL попадает в логи и историю, поэтому секреты в нём хранить нельзя."
    },
    {
      topic: "API", lang: "text",
      q: "Зачем использовать HTTPS для API?",
      code: `http://api.example.com/login   # без шифрования
https://api.example.com/login  # с шифрованием`,
      options: ["Только для красоты: HTTPS быстрее", "Чтобы токены и данные не читались и не подменялись по пути", "HTTPS нужен только для сайтов, но не для API"],
      answer: 1,
      explain: "По HTTP всё передаётся открытым текстом, и токен или пароль можно перехватить. HTTPS шифрует трафик и проверяет подлинность сервера."
    },
    {
      topic: "API", lang: "json",
      q: "Чем отличаются эти два ответа для клиента?",
      code: `A) { "active": true }
B) { "active": "true" }`,
      options: ["Ничем: JSON не различает типы", "A — булево значение, B — строка; это разные типы", "B — булево, A — число"],
      answer: 1,
      explain: "В JSON есть типы: string, number, boolean, null, array, object. true без кавычек — булево, а в кавычках — строка."
    },
    {
      topic: "API", lang: "json",
      q: "Как называется такой тип поля tags в JSON?",
      code: `{ "tags": ["sql", "api", "quiz"] }`,
      options: ["Объект", "Массив строк", "Строка с запятыми"],
      answer: 1,
      explain: "Квадратные скобки обозначают массив, значения внутри — строки. Фигурные скобки задают объект с парами «ключ: значение»."
    },
    {
      topic: "API", lang: "json",
      q: "Как обратиться к городу в этом ответе (в нотации user.…)?",
      code: `{
  "user": {
    "name": "Anna",
    "address": { "city": "Kazan", "zip": "420000" }
  }
}`,
      options: ["user.city", "user.address.city", "address.user.city"],
      answer: 1,
      explain: "Вложенный объект читается по цепочке ключей: сначала user, затем address, затем city."
    },
    {
      topic: "API", lang: "yaml",
      q: "Что описывает файл OpenAPI?",
      code: `openapi: 3.0.3
info: { title: Orders API, version: 1.0.0 }
paths:
  /orders:
    get: { summary: List orders }`,
      options: ["Контракт API: эндпоинты, параметры, форматы запросов и ответов", "Код сервера на языке YAML", "Расписание запуска сервиса"],
      answer: 0,
      explain: "OpenAPI — стандарт описания REST API. По нему генерируют документацию, клиенты и тесты, а команды сверяются на одном контракте."
    },
    {
      topic: "API", lang: "yaml",
      q: "Что значит эта запись в схеме?",
      code: `type: object
required: [email, password]
properties:
  email:    { type: string }
  password: { type: string }
  nickname: { type: string }`,
      options: ["Обязательны email и password, а nickname можно не передавать", "Обязательны все три поля", "Обязателен только nickname"],
      answer: 0,
      explain: "Список required перечисляет обязательные поля. Остальные поля из properties необязательны."
    },
    {
      topic: "API", lang: "yaml",
      q: "Для чего нужен $ref в OpenAPI?",
      code: `responses:
  '200':
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Order'`,
      options: ["Это ссылка на повторно используемую схему из components", "Это комментарий", "Это адрес внешнего сервера"],
      answer: 0,
      explain: "$ref позволяет описать схему один раз и подключать её в разных местах, не копируя описание."
    },
    {
      topic: "API", lang: "yaml",
      q: "Какие значения допустимы для поля status?",
      code: `status:
  type: string
  enum: [new, paid, shipped]`,
      options: ["Любая строка", "Только new, paid или shipped", "Только числа"],
      answer: 1,
      explain: "enum ограничивает поле конечным набором значений. Остальные значения валидатор отклонит."
    },
    {
      topic: "API", lang: "yaml",
      q: "Какое значение пройдёт проверку этой схемы?",
      code: `createdAt:
  type: string
  format: date-time`,
      options: ["2026-10-26T10:00:00Z", "26.10.2026", "yesterday"],
      answer: 0,
      explain: "Формат date-time подразумевает ISO 8601 (RFC 3339). Строки в произвольных форматах не пройдут проверку."
    },
    {
      topic: "API", lang: "yaml",
      q: "Что проверяет это ограничение?",
      code: `name:
  type: string
  minLength: 2
  maxLength: 50`,
      options: ["Длину строки: от 2 до 50 символов", "Число записей: от 2 до 50", "Сумму кодов символов"],
      answer: 0,
      explain: "minLength и maxLength задают границы длины строки, а minimum и maximum — границы числового значения."
    },
    {
      topic: "API", lang: "http",
      q: "Что не так с этим запросом входа?",
      code: `POST /api/v1/login?email=ivan@example.com&password=12345`,
      options: ["Ничего: так проще вызывать", "Пароль в URL попадёт в логи и историю; его нужно передавать в теле запроса по HTTPS", "Нужно использовать GET вместо POST"],
      answer: 1,
      explain: "Query-строка сохраняется в логах серверов, прокси и браузера. Чувствительные данные отправляют в теле запроса."
    },
    {
      topic: "API", lang: "http",
      q: "Чем 422 отличается от 400 по общему соглашению?",
      code: `POST /api/v1/orders
{ "items": [], "total": -5 }   # JSON корректен, но смысл неверен`,
      options: ["Это одно и то же", "400 — запрос не разобран (синтаксис), 422 — запрос понятен, но не проходит проверку по смыслу", "422 — ошибка сервера"],
      answer: 1,
      explain: "Многие команды используют 400 для синтаксических ошибок и 422 для бизнес-валидации. Главное, чтобы подход был единым и описан в контракте."
    },
    {
      topic: "API", lang: "text",
      q: "Что значит, что REST-сервис не хранит состояние (stateless)?",
      code: `Запрос 1: GET /orders  (Authorization: Bearer ...)
Запрос 2: GET /orders  (Authorization: Bearer ...)`,
      options: ["Каждый запрос содержит всё нужное для обработки, сервер не опирается на память о прошлых запросах клиента", "Сервис не использует базу данных", "Сервис не отвечает на повторные запросы"],
      answer: 0,
      explain: "Stateless означает, что контекст (например, токен) передаётся с каждым запросом. Благодаря этому сервис легко масштабируется горизонтально."
    },
    {
      topic: "API", lang: "json",
      q: "Какой формат ответа списка с пагинацией типичен?",
      code: `GET /api/v1/orders?page=2&per_page=20`,
      options: ["Массив без метаданных: клиент сам разберётся", "Объект с элементами и информацией о странице, например items, page, total", "Только число: общее количество"],
      answer: 1,
      explain: "Метаданные пагинации (номер страницы, размер, всего элементов или ссылка на следующую) позволяют клиенту корректно перебрать список."
    },
    {
      topic: "API", lang: "http",
      q: "Что означает этот параметр?",
      code: `GET /api/v1/orders?sort=-created_at`,
      options: ["Сортировка по created_at по убыванию (минус — обратный порядок)", "Исключить поле created_at из ответа", "Фильтр по пустому created_at"],
      answer: 0,
      explain: "Распространённое соглашение: sort=field — по возрастанию, sort=-field — по убыванию. Конкретный синтаксис фиксируется в контракте."
    },
    {
      topic: "API", lang: "http",
      q: "Зачем номер версии в пути?",
      code: `/api/v1/users
/api/v2/users`,
      options: ["Чтобы старые клиенты продолжали работать, пока выходит несовместимая версия", "Это счётчик обращений к API", "Это номер сервера"],
      answer: 0,
      explain: "Версионирование позволяет менять контракт, не ломая существующих потребителей, и поддерживать несколько версий параллельно."
    },
    {
      topic: "API", lang: "http",
      q: "Что находится в заголовке Location в таком ответе?",
      code: `HTTP/1.1 201 Created
Location: /api/v1/orders/9001`,
      options: ["Адрес созданного ресурса", "Географическое положение сервера", "Адрес, с которого пришёл запрос"],
      answer: 0,
      explain: "После создания ресурса сервер указывает его URL в Location. Клиент может сразу сделать GET по этому адресу."
    },
    {
      topic: "API", lang: "text",
      q: "Чем вебхук отличается от опроса (polling)?",
      code: `Polling: клиент спрашивает каждые 30 секунд «есть новости?»
Webhook: сервер сам присылает запрос при событии`,
      options: ["Вебхук: сервер сам вызывает URL клиента при событии, без постоянных запросов", "Вебхук нужен только для чтения справочников", "Опрос работает быстрее вебхука всегда"],
      answer: 0,
      explain: "Вебхук — это обратный вызов: система вызывает адрес подписчика при наступлении события. Опрос расходует запросы впустую и добавляет задержку."
    },
    {
      topic: "API", lang: "http",
      q: "Что вернёт метод HEAD?",
      code: `HEAD /api/v1/files/report.pdf`,
      options: ["Те же заголовки, что и GET, но без тела", "Первые 100 байт файла", "Только тело без заголовков"],
      answer: 0,
      explain: "HEAD похож на GET, но тело ответа не передаётся. Метод используют для проверки существования, размера и даты изменения ресурса."
    },
    {
      topic: "API", lang: "http",
      q: "Повторный DELETE вернул 404. Нарушена ли идемпотентность?",
      code: `DELETE /api/v1/projects/42   -> 204 No Content
DELETE /api/v1/projects/42   -> 404 Not Found`,
      options: ["Да: ответы разные, значит метод не идемпотентен", "Нет: идемпотентность про итоговое состояние (ресурса нет), а не про одинаковые ответы", "Да, нужно всегда возвращать 500"],
      answer: 1,
      explain: "Идемпотентность означает, что повтор не меняет состояние системы сверх первого вызова. Код ответа при этом может отличаться."
    },
    {
      topic: "API", lang: "json",
      q: "Что не так с таким ответом на ошибку?",
      code: `HTTP/1.1 500 Internal Server Error

{ "error": "NullPointerException at com.app.OrderService.java:142 ..." }`,
      options: ["Ничего: так разработчикам проще", "Внутренние детали (стек, классы) раскрывать клиенту нельзя; нужен код ошибки и безопасное сообщение", "Нужно вернуть 200"],
      answer: 1,
      explain: "Трассировка стека помогает атакующему узнать устройство системы. Детали пишут в лог, а клиенту отдают код, понятное сообщение и идентификатор запроса."
    },
    {
      topic: "API", lang: "http",
      q: "Какой ответ корректен, если список заказов пользователя пуст?",
      code: `GET /api/v1/users/42/orders
# у пользователя 42 нет заказов`,
      options: ["404 Not Found", "200 OK с пустым массивом []", "204 No Content всегда"],
      answer: 1,
      explain: "Коллекция существует, она просто пуста, поэтому 200 и []. Статус 404 нужен, когда нет самого родительского ресурса (пользователя 42)."
    },
    {
      topic: "API", lang: "http",
      q: "Какой заголовок ответа сообщает формат тела?",
      code: `HTTP/1.1 200 OK
???: application/json; charset=utf-8`,
      options: ["Content-Type", "Accept", "Authorization"],
      answer: 0,
      explain: "Content-Type описывает формат передаваемого тела. Accept задаёт предпочтения клиента, а Authorization относится к аутентификации."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что означает связь «1 — N» между users и orders?",
      options: ["У одного пользователя может быть много заказов, а у заказа один пользователь", "У одного заказа может быть много пользователей", "Один пользователь может сделать ровно один заказ"],
      answer: 0,
      explain: "Метка 1 стоит у «родительской» таблицы, N — у «дочерней». Одна запись users связана со многими записями orders, а каждая запись orders — с одной записью users."
    },
    {
      topic: "ERD", erd: "shop",
      q: "В какой таблице и в какой колонке хранится внешний ключ связи users — orders?",
      options: ["В users.order_id", "В orders.user_id", "В отдельной таблице связей"],
      answer: 1,
      explain: "Внешний ключ всегда хранится на стороне N (дочерней таблицы) и ссылается на первичный ключ родителя. Здесь это orders.user_id → users.id."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Как получить товары конкретного заказа, исходя из диаграммы?",
      options: ["Соединить orders напрямую с products", "Пройти orders → order_items → products", "Соединить users с products"],
      answer: 1,
      explain: "Напрямую orders и products не связаны: связь «многие ко многим» реализована через order_items. Нужны два соединения: orders с order_items и order_items с products."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Какое поле в orders является первичным ключом?",
      options: ["user_id", "id", "status"],
      answer: 1,
      explain: "Пометка PK означает первичный ключ: уникальный идентификатор строки, не допускающий NULL. user_id — внешний ключ (FK)."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что гарантирует внешний ключ orders.user_id?",
      options: ["Что у пользователя будет не больше одного заказа", "Что заказ нельзя привязать к несуществующему пользователю", "Что значения user_id всегда отсортированы"],
      answer: 1,
      explain: "Внешний ключ обеспечивает ссылочную целостность: каждое значение user_id должно существовать в users.id (или быть NULL, если колонка допускает NULL)."
    },
    {
      topic: "ERD", erd: "school",
      q: "Как на диаграмме реализована связь «студент ↔ курс»?",
      options: ["Колонкой course_id в students", "Таблицей связи enrollments", "Колонкой student_id в courses"],
      answer: 1,
      explain: "Студент посещает много курсов, а на курсе много студентов, то есть связь M:N. В реляционной модели её раскладывают на две связи 1:N через промежуточную таблицу."
    },
    {
      topic: "ERD", erd: "school",
      q: "Сколько студентов может быть в одной группе?",
      options: ["Ровно один", "Много: связь groups — students равна 1:N", "Ни одного: группа хранится отдельно"],
      answer: 1,
      explain: "Группа связана со многими студентами, а студент входит ровно в одну группу (в students есть group_id)."
    },
    {
      topic: "ERD", erd: "school",
      q: "Что означает составной первичный ключ (student_id, course_id) в enrollments?",
      options: ["Студент может быть записан на конкретный курс только один раз", "Студент может учиться только на одном курсе", "Оценка должна быть уникальной"],
      answer: 0,
      explain: "Пара значений должна быть уникальной, но каждая из колонок по отдельности может повторяться. Так один студент записан на разные курсы, а на один курс — один раз."
    },
    {
      topic: "ERD", erd: "library",
      q: "Что означает пометка UQ у isbn?",
      options: ["Колонка является первичным ключом", "Значения в колонке уникальны, но это не первичный ключ", "Колонка не может быть пустой"],
      answer: 1,
      explain: "UQ (UNIQUE) запрещает повторы значений, но таблица может иметь только один PK, а уникальных ограничений — несколько. NULL при этом обычно допускается."
    },
    {
      topic: "ERD",
      q: "Что на ER-диаграмме обозначает прямоугольник (сущность) и что — строка в нём?",
      options: ["Прямоугольник — тип объекта предметной области (обычно таблица), строка — атрибут (колонка)", "Прямоугольник — запрос, строка — результат", "Прямоугольник — пользователь, строка — его права"],
      answer: 0,
      explain: "Сущность описывает класс объектов (клиент, заказ), а атрибуты — их свойства. Конкретные экземпляры (записи) на диаграмме не рисуют."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Сколько приёмов может быть у одного пациента?",
      options: ["Ровно один", "Много: связь patients — appointments это 1:N", "Ни одного: приёмы привязаны только к врачам"],
      answer: 1,
      explain: "У приёма один пациент (patient_id), а пациент может приходить много раз. Метка N стоит на стороне appointments."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Как на диаграмме связаны пациенты и врачи?",
      options: ["Напрямую внешним ключом patients.doctor_id", "Через таблицу appointments: это связь M:N, разложенная на две 1:N", "Никак"],
      answer: 1,
      explain: "Пациент бывает у многих врачей, а у врача много пациентов. Промежуточная таблица appointments хранит каждую встречу и её атрибуты."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Сколько внешних ключей содержит таблица appointments?",
      options: ["Один", "Два: patient_id и doctor_id", "Три"],
      answer: 1,
      explain: "Каждая пометка FK задаёт связь с родительской таблицей. Здесь приём ссылается и на пациента, и на врача."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Как получить рецепты пациента?",
      options: ["Прямое соединение patients с prescriptions", "Путь patients → appointments → prescriptions", "Путь doctors → specialties → prescriptions"],
      answer: 1,
      explain: "Рецепт привязан к приёму, а не к пациенту напрямую. Поэтому нужны два соединения по цепочке внешних ключей."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Может ли у одного клиента быть несколько счетов?",
      options: ["Нет: у клиента ровно один счёт", "Да: связь clients — accounts это 1:N", "Только если счета в разных банках"],
      answer: 1,
      explain: "Внешний ключ client_id находится в accounts, поэтому клиенту может соответствовать много счетов, а счёту — один клиент."
    },
    {
      topic: "ERD", erd: "bank",
      q: "К какой сущности привязана банковская карта?",
      options: ["К клиенту напрямую", "К счёту (account_id)", "К транзакции"],
      answer: 1,
      explain: "Внешний ключ cards.account_id говорит, что карта выпущена по счёту. Клиента можно найти через счёт."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Что означает UQ у passport?",
      options: ["Паспорт может повторяться у разных клиентов", "Один паспорт — один клиент: значения уникальны", "Колонка является первичным ключом"],
      answer: 1,
      explain: "UQ означает ограничение уникальности. Первичным ключом остаётся id, а passport защищён от дублей."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Что хранится в таблице transactions?",
      options: ["Текущий баланс клиента", "История операций по счёту: каждая строка — одна операция", "Данные карты"],
      answer: 1,
      explain: "Таблица на стороне N фиксирует события во времени. Баланс обычно хранят в accounts либо вычисляют по операциям."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Сколько организаций (tenants) может быть у одного пользователя по этой диаграмме?",
      options: ["Много", "Одна: users.tenant_id указывает на одну организацию", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ tenant_id в users означает, что пользователь принадлежит одной организации, а организация имеет много пользователей."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Сколько подписок может быть на один тарифный план?",
      options: ["Одна", "Много: plans — subscriptions это 1:N", "Ни одной"],
      answer: 1,
      explain: "Тариф — справочник, на который ссылаются подписки разных организаций."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Как узнать тариф организации?",
      options: ["tenants → plans напрямую", "tenants → subscriptions → plans", "users → invoices → plans"],
      answer: 1,
      explain: "Прямой связи между tenants и plans нет: тариф подключается через подписку, в которой есть и период действия."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Что обычно означает NULL в subscriptions.ended_at?",
      options: ["Ошибка в данных", "Подписка ещё действует: даты окончания нет", "Подписка бесплатна"],
      answer: 1,
      explain: "Пустая дата окончания часто используется как признак открытого интервала. Это соглашение нужно зафиксировать в описании модели."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Что означает составной ключ (warehouse_id, product_id) в stock?",
      options: ["Склад может хранить только один товар", "Для каждой пары «склад — товар» существует не более одной строки остатка", "Товар может лежать только на одном складе"],
      answer: 1,
      explain: "Составной PK требует уникальности пары значений, но каждое из значений по отдельности может повторяться."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Где хранится остаток товара на конкретном складе?",
      options: ["products.qty", "stock.qty", "warehouses.qty"],
      answer: 1,
      explain: "Количество зависит от пары «склад — товар», поэтому это атрибут связи M:N и хранится в stock."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Сколько поставщиков у одного товара по этой диаграмме?",
      options: ["Много", "Один: products.supplier_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ на стороне products фиксирует одного поставщика на товар. Если нужны несколько, потребуется таблица связи."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Зачем в products колонка sku с пометкой UQ?",
      options: ["Это внешний ключ", "Артикул должен быть уникальным и по нему можно однозначно найти товар", "Это счётчик количества"],
      answer: 1,
      explain: "Бизнес-идентификатор (артикул) защищают уникальным ограничением. Технический id остаётся первичным ключом."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Сколько доставок может выполнить один курьер?",
      options: ["Одну", "Много: couriers — deliveries это 1:N", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ courier_id находится в deliveries, поэтому у курьера много доставок, а у доставки один курьер."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Как узнать, куда доставить заказ?",
      options: ["Через orders.address_id → addresses", "Через couriers.address_id", "Адрес хранится в deliveries.city"],
      answer: 0,
      explain: "Заказ ссылается на адрес через address_id. Адреса, в свою очередь, принадлежат клиенту."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Сколько адресов может быть у одного клиента?",
      options: ["Один", "Много: customers — addresses это 1:N", "Адреса не связаны с клиентами"],
      answer: 1,
      explain: "Внешний ключ customer_id находится в addresses, значит клиент может иметь несколько адресов доставки."
    },
    {
      topic: "ERD", erd: "social",
      q: "Что означает составной ключ (user_id, post_id) в likes?",
      options: ["Один пользователь может лайкнуть пост только один раз", "Пост может иметь только один лайк", "Пользователь может лайкнуть только один пост"],
      answer: 0,
      explain: "Уникальная пара «пользователь — пост» защищает от повторных лайков, при этом пользователь лайкает много постов, а пост получает много лайков."
    },
    {
      topic: "ERD", erd: "social",
      q: "Какую связь реализует таблица follows?",
      options: ["1:1 между пользователем и постом", "M:N «пользователь — пользователь»: подписки на других пользователей", "Связь поста с тегами"],
      answer: 1,
      explain: "В follows обе колонки ссылаются на users: follower_id (кто подписан) и followee_id (на кого). Это самосвязь типа M:N."
    },
    {
      topic: "ERD", erd: "social",
      q: "Как посчитать число лайков поста?",
      options: ["Подсчитать строки likes с нужным post_id", "Прочитать users.likes", "Подсчитать follows"],
      answer: 0,
      explain: "Каждая строка likes — один лайк. Агрегат COUNT(*) по фильтру post_id даёт результат."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Как узнать категорию товара из конкретного заказа?",
      options: ["orders → categories", "order_items → products → categories", "users → categories"],
      answer: 1,
      explain: "В позиции заказа хранится product_id, а товар ссылается на категорию. Поэтому нужны два соединения по цепочке."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что хранит колонка qty в order_items?",
      options: ["Количество товара на складе", "Количество единиц товара в этой позиции заказа", "Количество заказов пользователя"],
      answer: 1,
      explain: "order_items — строка заказа. Qty описывает, сколько единиц выбранного товара включено в заказ."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Сколько позиций может содержать один заказ?",
      options: ["Ровно одну", "Много: связь orders — order_items это 1:N", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ order_id находится в order_items. Один заказ — много позиций, а позиция принадлежит одному заказу."
    },
    {
      topic: "ERD", erd: "school",
      q: "Сколько преподавателей у одного курса по этой диаграмме?",
      options: ["Много", "Один: courses.teacher_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ на стороне courses связывает курс с одним преподавателем. Один преподаватель может вести много курсов."
    },
    {
      topic: "ERD", erd: "school",
      q: "Как узнать, в каких группах учатся студенты курса?",
      options: ["courses → groups", "enrollments → students → groups", "teachers → groups"],
      answer: 1,
      explain: "От курса переходим к записям на курс, затем к студентам и их группам."
    },
    {
      topic: "ERD", erd: "school",
      q: "Что определяет, обязательна ли связь студента с группой?",
      options: ["Название таблицы", "Допускает ли колонка group_id значение NULL", "Количество колонок в таблице"],
      answer: 1,
      explain: "Если внешний ключ NOT NULL, связь обязательна. Если допускает NULL, студент может быть без группы (необязательная связь)."
    },
    {
      topic: "ERD", erd: "library",
      q: "Что фиксирует таблица loans?",
      options: ["Список авторов", "Факт выдачи книги читателю в конкретный момент", "Перечень жанров"],
      answer: 1,
      explain: "loans — событие, связывающее книгу и читателя во времени. У него есть даты выдачи и возврата."
    },
    {
      topic: "ERD", erd: "library",
      q: "Что означает NULL в loans.returned_at?",
      options: ["Данные потеряны", "Книга ещё не возвращена", "Книга утеряна навсегда"],
      answer: 1,
      explain: "Отсутствие даты возврата обычно означает, что выдача ещё продолжается. Этим пользуются для поиска книг «на руках»."
    },
    {
      topic: "ERD", erd: "library",
      q: "Сколько раз одну и ту же книгу можно выдавать разным читателям?",
      options: ["Один раз за всё время", "Много раз: books — loans это 1:N", "Только пока она новая"],
      answer: 1,
      explain: "Выдачи — отдельные строки, и у одной книги их может быть сколько угодно."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Сколько отделов может быть у сотрудника по этой диаграмме?",
      options: ["Много", "Один: employees.dept_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ dept_id в employees задаёт принадлежность к одному отделу. В отделе при этом много сотрудников."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Какая колонка хранит ссылку на руководителя сотрудника?",
      options: ["dept_id", "manager_id", "salary"],
      answer: 1,
      explain: "manager_id — внешний ключ на id той же таблицы employees. Он выражает отношение «подчинённый — руководитель»."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Что обозначает FK у dept_id?",
      options: ["Колонка ссылается на departments.id и принимает только существующие значения", "Колонка уникальна", "Колонка хранит дату"],
      answer: 0,
      explain: "FK — внешний ключ. Он защищает от ссылок на несуществующие отделы."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Сколько отелей у одного номера?",
      options: ["Много", "Один: rooms.hotel_id", "Номер не принадлежит отелю"],
      answer: 1,
      explain: "У номера один внешний ключ на отель. В отеле при этом много номеров."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Может ли один гость бронировать несколько раз?",
      options: ["Нет", "Да: guests — bookings это 1:N", "Только в разных отелях"],
      answer: 1,
      explain: "Бронирования — отдельные строки со ссылкой на гостя, и повторных броней у гостя может быть сколько угодно."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Что представляют check_in и check_out в bookings?",
      options: ["Атрибуты самой брони: даты заезда и выезда", "Внешние ключи", "Атрибуты отеля"],
      answer: 0,
      explain: "Даты относятся к факту бронирования номера гостем, поэтому хранятся в таблице связи."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Как определить автора статьи?",
      options: ["Через posts.author_id → users", "Через comments.user_id", "Через tags.name"],
      answer: 0,
      explain: "Автор — пользователь, на которого ссылается внешний ключ author_id таблицы posts."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Сколько комментариев может быть у одной статьи?",
      options: ["Один", "Много: posts — comments это 1:N", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ post_id в comments связывает комментарии со статьёй: у статьи много комментариев, а у комментария одна статья."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Зачем нужна таблица post_tags?",
      options: ["Чтобы хранить текст статьи", "Чтобы реализовать связь M:N между статьями и тегами", "Чтобы хранить комментарии"],
      answer: 1,
      explain: "У статьи много тегов и у тега много статей. В реляционной модели такая связь раскладывается через промежуточную таблицу."
    },
    {
      topic: "BPMN", bpmn: "sym_start",
      q: "Как называется этот элемент BPMN?",
      options: ["Начальное событие: с него процесс стартует", "Конечное событие", "Шлюз"],
      answer: 0,
      explain: "Тонкий одинарный круг — начальное событие. Оно запускает экземпляр процесса, в него не входят потоки."
    },
    {
      topic: "BPMN", bpmn: "sym_end",
      q: "Что обозначает этот элемент?",
      options: ["Начальное событие", "Конечное событие: завершает ветку процесса", "Промежуточное событие"],
      answer: 1,
      explain: "Круг с толстой границей — конечное событие. У него нет исходящих потоков."
    },
    {
      topic: "BPMN", bpmn: "sym_start_msg",
      q: "Что запускает процесс с таким начальным событием?",
      options: ["Получение сообщения", "Наступление времени", "Ошибка"],
      answer: 0,
      explain: "Конверт внутри круга — стартовое событие по сообщению. Процесс начинается, когда приходит определённое сообщение (например, заявка)."
    },
    {
      topic: "BPMN", bpmn: "sym_start_timer",
      q: "Что запускает процесс с таким начальным событием?",
      options: ["Сообщение от клиента", "Таймер: наступление момента времени или повторяющееся расписание", "Ручной запуск"],
      answer: 1,
      explain: "Часы внутри круга — стартовое событие-таймер. Подходит для регулярных процессов вроде еженедельного отчёта."
    },
    {
      topic: "BPMN", bpmn: "sym_end_term",
      q: "Что делает такое конечное событие?",
      options: ["Завершает только свою ветку", "Немедленно завершает весь процесс, включая все остальные ветки", "Запускает новый процесс"],
      answer: 1,
      explain: "Закрашенный круг внутри конечного события — Terminate. Он прекращает все активные токены экземпляра, а обычное конечное событие завершает лишь свою ветку."
    },
    {
      topic: "BPMN", bpmn: "sym_end_error",
      q: "Что означает такое конечное событие?",
      options: ["Процесс завершился успешно", "Процесс завершается с ошибкой, которая может быть перехвачена снаружи", "Процесс ждёт сообщение"],
      answer: 1,
      explain: "Молния в конечном событии — Error end event. Оно создаёт ошибку, которую обрабатывает граничное событие родительского подпроцесса."
    },
    {
      topic: "BPMN", bpmn: "sym_inter_timer",
      q: "Что означает такое промежуточное событие на потоке?",
      options: ["Процесс ждёт заданный срок или момент времени", "Процесс отправляет сообщение", "Процесс завершается"],
      answer: 0,
      explain: "Двойной круг с часами — промежуточное событие-таймер: токен задерживается, пока не пройдёт указанное время."
    },
    {
      topic: "BPMN", bpmn: "sym_inter_catch",
      q: "Что делает процесс в таком событии?",
      options: ["Отправляет сообщение", "Ждёт получения сообщения и только потом идёт дальше", "Запускает таймер"],
      answer: 1,
      explain: "Незакрашенный конверт в двойном круге — промежуточное событие-приёмник (catch). Закрашенный конверт означал бы отправку (throw)."
    },
    {
      topic: "BPMN", bpmn: "sym_xor",
      q: "Как называется этот шлюз и как он работает?",
      options: ["Параллельный: запускает все ветки", "Исключающий (XOR): выбирает ровно один путь по условию", "Включающий: выбирает одну или несколько веток"],
      answer: 1,
      explain: "Ромб с крестом — исключающий шлюз. При разветвлении активируется один исходящий поток, при слиянии токены пропускаются без ожидания."
    },
    {
      topic: "BPMN", bpmn: "sym_and",
      q: "Как называется этот шлюз и как он работает?",
      options: ["Исключающий: один путь", "Параллельный (AND): запускает все ветки одновременно, а при слиянии ждёт все", "Шлюз по событию"],
      answer: 1,
      explain: "Ромб с плюсом — параллельный шлюз. Он не проверяет условий: разветвляет на все потоки, а при слиянии синхронизирует их."
    },
    {
      topic: "BPMN", bpmn: "sym_or",
      q: "Как называется этот шлюз?",
      options: ["Включающий (OR): активирует одну или несколько веток по условиям", "Параллельный", "Исключающий"],
      answer: 0,
      explain: "Ромб с кругом — включающий шлюз. Условия проверяются для каждой ветки отдельно, активными могут стать несколько."
    },
    {
      topic: "BPMN", bpmn: "sym_event",
      q: "Что обозначает такой шлюз?",
      options: ["Шлюз на основе событий: выбирает ветку, событие которой наступит первым", "Параллельный шлюз", "Шлюз по данным"],
      answer: 0,
      explain: "Ромб с двойным кругом — event-based gateway. Путь определяет не условие на данных, а событие (сообщение, таймер), наступившее первым."
    },
    {
      topic: "BPMN", bpmn: "sym_user",
      q: "Что означает человечек в углу задачи?",
      options: ["Пользовательская задача: её выполняет человек через интерфейс системы", "Автоматическая задача", "Подпроцесс"],
      answer: 0,
      explain: "Иконка человека — User task. Её выполняет сотрудник, например заполняя форму или принимая решение."
    },
    {
      topic: "BPMN", bpmn: "sym_service",
      q: "Что означает шестерёнка в углу задачи?",
      options: ["Задачу выполняет человек", "Сервисная задача: выполняется автоматически, например вызовом API", "Ручная задача вне системы"],
      answer: 1,
      explain: "Шестерёнка — Service task. Её исполняет система или внешний сервис без участия человека."
    },
    {
      topic: "BPMN", bpmn: "sym_sub",
      q: "Что означает значок «плюс» внизу задачи?",
      options: ["Это параллельная задача", "Это свёрнутый подпроцесс: внутри скрыта отдельная схема", "Это ошибка"],
      answer: 1,
      explain: "Квадрат с плюсом показывает, что задача раскрывается в подпроцесс. Так скрывают детали и упрощают чтение диаграммы."
    },
    {
      topic: "BPMN", bpmn: "sym_data",
      q: "Что изображает этот символ?",
      options: ["Конечное событие", "Объект данных (документ, информация), с которым работает процесс", "Дорожку"],
      answer: 1,
      explain: "Лист с загнутым углом — Data object. Он показывает данные, которые задачи создают или используют."
    },
    {
      topic: "BPMN",
      q: "Что такое токен в BPMN?",
      options: ["Пароль пользователя", "Условный маркер, показывающий текущее положение выполнения процесса: он «путешествует» по потокам", "Название задачи"],
      answer: 1,
      explain: "Токены — способ объяснить семантику выполнения. Начальное событие создаёт токен, шлюзы и задачи перемещают, делят или объединяют его, а конечное событие поглощает."
    },
    {
      topic: "BPMN", bpmn: "bank_msg",
      q: "Чем пунктирная линия со стрелкой отличается от сплошной?",
      options: ["Это поток сообщений между участниками (пулами или дорожками, изображающими разные организации)", "Это ошибка", "Они одинаковы"],
      answer: 0,
      explain: "Сплошная линия — последовательный поток внутри одного процесса, пунктирная — обмен сообщениями между участниками."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Что показывают горизонтальные полосы «Клиент», «Менеджер», «Склад»?",
      options: ["Время выполнения процесса", "Дорожки: кто отвечает за выполнение шагов", "Приоритеты задач"],
      answer: 1,
      explain: "Дорожки (lanes) группируют элементы по исполнителям или ролям, отвечая на вопрос «кто это делает»."
    },
    {
      topic: "BPMN",
      q: "Чем пул (pool) отличается от дорожки (lane)?",
      options: ["Ничем", "Пул — участник процесса (например, организация), а дорожки делят его на роли или подразделения", "Пул — шлюз"],
      answer: 1,
      explain: "Пул ограничивает процесс одного участника. Взаимодействие между пулами идёт только потоками сообщений."
    },
    {
      topic: "BPMN",
      q: "Как принято называть задачи на диаграмме?",
      options: ["Существительным без глагола: «Заказ»", "Глаголом и объектом: «Проверить заказ»", "Любым словом"],
      answer: 1,
      explain: "Задача — действие, поэтому в названии нужен глагол в неопределённой форме и объект: «Согласовать договор», «Отправить счёт»."
    },
    {
      topic: "BPMN",
      q: "Как принято называть события?",
      options: ["Глаголом в приказном наклонении", "Состоянием: существительное + причастие, например «Заказ оформлен»", "Номером"],
      answer: 1,
      explain: "Событие — то, что произошло. Формулировка в прошедшем времени помогает отличить его от задачи."
    },
    {
      topic: "BPMN", bpmn: "starts",
      q: "Что произойдёт, если сработает любое из этих стартовых событий?",
      options: ["Процесс запустится только при срабатывании всех трёх", "Каждое срабатывание создаёт отдельный экземпляр процесса", "Процесс откажется работать"],
      answer: 1,
      explain: "Несколько стартовых событий — это разные способы запуска процесса. Каждое срабатывание создаёт новый экземпляр."
    },
    {
      topic: "BPMN", bpmn: "no_start",
      q: "Что не так с этой диаграммой по правилам хорошего стиля?",
      options: ["Нет стартового и конечных событий: непонятно, как процесс начинается и чем заканчивается", "Слишком много задач", "Нет дорожек"],
      answer: 0,
      explain: "Явные начало и конец делают границы процесса понятными. Без них нельзя однозначно интерпретировать семантику."
    },
    {
      topic: "BPMN",
      q: "Что такое экземпляр процесса?",
      options: ["Новая версия схемы", "Одно конкретное выполнение процесса, например обработка заказа №1234", "Название диаграммы"],
      answer: 1,
      explain: "Схема процесса — шаблон, а экземпляр — конкретный запуск с собственными данными и токенами."
    },
    {
      topic: "BPMN",
      q: "Для чего нужна нотация BPMN?",
      options: ["Для программирования на языке C", "Для единообразного описания бизнес-процессов, понятного и бизнесу, и ИТ", "Для проектирования базы данных"],
      answer: 1,
      explain: "BPMN — стандарт графической нотации процессов. Он служит общим языком аналитиков, разработчиков и бизнеса."
    },
    {
      topic: "BPMN",
      q: "Что стоит указать у каждого шлюза XOR с несколькими выходами?",
      options: ["Условия на исходящих потоках", "Цвет", "Номер версии"],
      answer: 0,
      explain: "Подписи (условия) на потоках объясняют, при каких обстоятельствах выбирается каждый путь."
    },
    {
      topic: "BPMN",
      q: "Какой элемент показывает ответственного исполнителя?",
      options: ["Шлюз", "Дорожка", "Конечное событие"],
      answer: 1,
      explain: "Дорожка закрепляет шаги за ролью или подразделением. Событие или шлюз не определяют исполнителя."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Что произойдёт, если товара нет в наличии?",
      options: ["Склад соберёт заказ", "Клиент получит уведомление, и заказ будет отменён", "Процесс зависнет"],
      answer: 1,
      explain: "По ветке «нет» выполняется задача «Уведомить клиента», затем конечное событие «Заказ отменён»."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Кто выполняет задачу «Собрать заказ»?",
      options: ["Клиент", "Менеджер", "Склад"],
      answer: 2,
      explain: "Задача находится на дорожке «Склад», значит ответственная роль — склад."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Сколько конечных событий в этом процессе?",
      options: ["Одно", "Два: «Заказ отменён» и «Заказ доставлен»", "Три"],
      answer: 1,
      explain: "У процесса может быть несколько исходов. Каждый заканчивается собственным конечным событием."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Сколько путей выберет шлюз «Товар есть?»?",
      options: ["Оба пути одновременно", "Ровно один: это исключающий шлюз", "Ни одного"],
      answer: 1,
      explain: "Крестик внутри ромба означает XOR: токен идёт по одной ветке, подходящей по условию."
    },
    {
      topic: "BPMN", bpmn: "hire",
      q: "Как выполняются задачи «Подготовить рабочее место» и «Оформить документы»?",
      options: ["Строго одна за другой", "Параллельно: их запускает шлюз с плюсом", "Только одна из них"],
      answer: 1,
      explain: "Параллельный шлюз запускает обе ветки одновременно. Порядок и длительность каждой независимы."
    },
    {
      topic: "BPMN", bpmn: "hire",
      q: "Когда начнётся «Провести онбординг»?",
      options: ["Когда завершится любая из двух задач", "Когда завершатся обе задачи: сливающий шлюз с плюсом ждёт оба токена", "Сразу после старта"],
      answer: 1,
      explain: "Параллельное слияние синхронизирует ветки: токен дальше идёт только после прихода всех входящих токенов."
    },
    {
      topic: "BPMN", bpmn: "hire",
      q: "Какая из двух параллельных задач выполняется первой?",
      options: ["«Подготовить рабочее место»", "«Оформить документы»", "Порядок не определён: они могут идти одновременно или в любом порядке"],
      answer: 2,
      explain: "BPMN не задаёт порядок параллельных веток. Если порядок важен, их нужно соединить последовательным потоком."
    },
    {
      topic: "BPMN", bpmn: "expense",
      q: "Какой путь пройдёт заявка на 5 000?",
      options: ["«Утвердить автоматически»", "«Согласовать у руководителя»", "Оба пути"],
      answer: 0,
      explain: "Условие «до 10 000» выполнено, поэтому исключающий шлюз направит токен в автоматическое утверждение."
    },
    {
      topic: "BPMN", bpmn: "expense",
      q: "Что делает второй шлюз с крестиком без подписей?",
      options: ["Выбирает путь по условию", "Сливает две ветки: пропускает пришедший токен дальше без ожидания", "Параллельно запускает задачи"],
      answer: 1,
      explain: "Исключающий шлюз на слиянии объединяет альтернативные ветки. Он не синхронизирует, потому что в процессе одновременно идёт лишь одна из них."
    },
    {
      topic: "BPMN", bpmn: "expense",
      q: "Сколько задач выполнит заявка на 20 000 от старта до конца?",
      options: ["Три: подать, согласовать у руководителя, оплатить", "Две", "Четыре"],
      answer: 0,
      explain: "Путь: «Подать заявку» → «Согласовать у руководителя» → «Оплатить расходы». Ветка автоматического утверждения не выполняется."
    },
    {
      topic: "BPMN", bpmn: "rework",
      q: "Что происходит, если документы неверны?",
      options: ["Процесс завершается", "Выполняется «Запросить исправления» и проверка повторяется: образуется цикл доработки", "Договор оформляется автоматически"],
      answer: 1,
      explain: "Ветка «нет» возвращает токен к задаче проверки. Такой цикл допустим, но стоит ограничивать число повторов."
    },
    {
      topic: "BPMN", bpmn: "support",
      q: "Что означает косая черта на выходе шлюза в «Передать на 2 линию»?",
      options: ["Это поток по умолчанию: выбирается, если условия остальных потоков не выполнены", "Это ошибка", "Это поток сообщений"],
      answer: 0,
      explain: "Поток по умолчанию (default flow) гарантирует, что токен не застрянет, если ни одно условие не подошло."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Что произойдёт, если оплата не поступит за три дня?",
      options: ["Заказ будет отгружен", "Сработает таймер, и заказ будет отменён", "Процесс подождёт бесконечно"],
      answer: 1,
      explain: "Шлюз по событиям выбирает ветку первого наступившего события. Таймер «3 дня» ведёт к отмене заказа."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Чем этот шлюз отличается от исключающего?",
      options: ["Решение принимается по событию, которое наступит первым, а не по данным процесса", "Ничем", "Он запускает все ветки"],
      answer: 0,
      explain: "Event-based gateway ждёт одно из нескольких событий. Остальные ожидания после выбора ветки отменяются."
    },
    {
      topic: "BPMN", bpmn: "boundary_int",
      q: "Что означает часовое событие на границе задачи?",
      options: ["Пограничный таймер: если задача не завершена за 2 дня, запускается альтернативная ветка", "Задача выполняется два дня всегда", "Стартовое событие"],
      answer: 0,
      explain: "Событие, прикреплённое к границе задачи, следит за ней во время выполнения. Здесь — за превышением срока."
    },
    {
      topic: "BPMN", bpmn: "doc_data",
      q: "Что означает пунктир между задачей и документом?",
      options: ["Ассоциация: задача создаёт или использует этот документ", "Поток сообщений", "Ошибка"],
      answer: 0,
      explain: "Ассоциации связывают задачи с данными и артефактами. Они не передают токен."
    },
    {
      topic: "BPMN", bpmn: "multi",
      q: "Что означают три вертикальные линии внизу задачи?",
      options: ["Задача параллельно выполняется несколько раз (multi-instance)", "Задача отключена", "Задача содержит подпроцесс"],
      answer: 0,
      explain: "Маркер из трёх вертикальных линий — параллельный множественный экземпляр: например, проверка каждой позиции заказа одновременно."
    },
    {
      topic: "BPMN", bpmn: "approve_loop",
      q: "Что означает круговая стрелка внизу задачи?",
      options: ["Задача может повторяться в цикле, пока не выполнится условие", "Задача завершается ошибкой", "Это таймер"],
      answer: 0,
      explain: "Маркер цикла (loop) показывает, что действие повторяется до выполнения условия."
    },
    {
      topic: "BPMN", bpmn: "wait_partner",
      q: "Почему процесс остановится на событии «Ответ партнёра»?",
      options: ["Потому что это ошибка", "Токен ждёт получения сообщения от партнёра и только потом продолжит движение", "Потому что у события нет исходящих потоков"],
      answer: 1,
      explain: "Промежуточное событие-приёмник блокирует токен до прихода сообщения."
    },
    {
      topic: "BPMN", bpmn: "sub_error",
      q: "Что означает знак «плюс» у задачи «Обработать заявку»?",
      options: ["Задача параллельная", "Это подпроцесс с вложенной схемой", "Задача выполняется автоматически"],
      answer: 1,
      explain: "Плюс в квадрате — свёрнутый подпроцесс. Его содержимое показывают на отдельной диаграмме или раскрывают на месте."
    },
    {
      topic: "BPMN", bpmn: "terminate",
      q: "Что произойдёт при срабатывании конечного события «Оплата не прошла» (terminate)?",
      options: ["Завершится только эта ветка", "Завершится весь процесс, включая ветку «Подготовить заказ»", "Ничего"],
      answer: 1,
      explain: "Terminate прекращает все токены экземпляра. Обычный конец завершает только свою ветку."
    },
    {
      topic: "BPMN", bpmn: "starts",
      q: "Что нужно для запуска экземпляра этого процесса?",
      options: ["Все три стартовых события", "Достаточно сработать любому из них", "Только событие по сообщению"],
      answer: 1,
      explain: "Каждое стартовое событие — самостоятельная точка входа. Оно создаёт новый экземпляр."
    },
    {
      topic: "UC", uc: "uc_actor",
      q: "Как называется этот элемент диаграммы?",
      options: ["Актёр: роль, внешняя по отношению к системе, которая с ней взаимодействует", "Вариант использования", "Граница системы"],
      answer: 0,
      explain: "Фигурка человечка обозначает актёра. Актёр — не конкретный человек, а роль (покупатель, администратор), а также внешняя система или устройство."
    },
    {
      topic: "UC", uc: "uc_uc",
      q: "Что обозначает овал с названием «Оформить заказ»?",
      options: ["Актёра", "Вариант использования (use case): функциональность, которая приносит актёру наблюдаемую ценность", "Класс"],
      answer: 1,
      explain: "Овал — use case. Название отражает цель актёра, например «Оформить заказ», а не внутреннюю реализацию."
    },
    {
      topic: "UC", uc: "uc_sys_actor",
      q: "Что означает прямоугольник с пометкой «system» вне границы системы?",
      options: ["Внешняя система, выступающая в роли актёра", "Подсистема внутри границы", "Ошибка в диаграмме"],
      answer: 0,
      explain: "Внешние системы (платёжный шлюз, банк) изображают как актёров, часто прямоугольником со стереотипом «system»."
    },
    {
      topic: "UC", uc: "uc_boundary",
      q: "Что обозначает рамка с названием системы?",
      options: ["Границу системы: внутри неё находятся варианты использования, снаружи — актёры", "Группировку актёров", "Таблицу базы данных"],
      answer: 0,
      explain: "Рамка (system boundary) отделяет то, что входит в область разработки, от внешнего окружения."
    },
    {
      topic: "UC", uc: "uc_assoc",
      q: "Что показывает сплошная линия между актёром и вариантом использования?",
      options: ["Что актёр взаимодействует с этим вариантом использования (участвует в нём)", "Порядок выполнения", "Наследование"],
      answer: 0,
      explain: "Ассоциация говорит об участии актёра. Направление передачи данных или порядок шагов она не задаёт."
    },
    {
      topic: "UC", uc: "uc_include",
      q: "Что означает пунктирная стрелка «include» от «Оформить заказ» к «Оплатить заказ»?",
      options: ["Оформление заказа всегда включает оплату как обязательную часть", "Оплата выполняется только иногда", "Оплата — родитель оформления"],
      answer: 0,
      explain: "Include выносит обязательное общее поведение. Базовый вариант использования не может быть завершён без включаемого."
    },
    {
      topic: "UC", uc: "uc_extend",
      q: "Что означает пунктирная стрелка «extend» от «Применить промокод» к «Оформить заказ»?",
      options: ["Применение промокода — необязательное расширение оформления заказа, выполняемое при условии", "Промокод всегда применяется", "Заказ — часть промокода"],
      answer: 0,
      explain: "Extend описывает необязательное дополнительное поведение. Стрелка направлена от расширения к базовому варианту использования."
    },
    {
      topic: "UC", uc: "uc_gen_actor",
      q: "Что показывает стрелка с пустым треугольником между актёрами?",
      options: ["Обобщение: «Покупатель» — частный случай «Пользователя» и наследует его взаимодействия", "Обмен сообщениями", "Включение"],
      answer: 0,
      explain: "Пустой треугольник указывает на родителя. Потомок может всё, что и родитель, и имеет собственные возможности."
    },
    {
      topic: "UC", uc: "uc_gen_uc",
      q: "Что означает такая связь между вариантами использования?",
      options: ["«Оплатить картой» — специализация общего варианта «Оплатить заказ»", "Оплата заказа обязательно включает оплату картой", "Это необязательное расширение"],
      answer: 0,
      explain: "Обобщение для вариантов использования показывает специализированные способы достижения общей цели."
    },
    {
      topic: "UC",
      q: "Для чего нужна диаграмма вариантов использования?",
      options: ["Для описания того, какие функции система предоставляет каким пользователям и внешним системам", "Для описания структуры таблиц", "Для описания порядка вызова методов в коде"],
      answer: 0,
      explain: "Диаграмма даёт обзор функциональных требований: кто и что может делать с системой, без деталей реализации."
    },
    {
      topic: "UC",
      q: "Кто такой актёр на диаграмме вариантов использования?",
      options: ["Роль вне системы, взаимодействующая с ней", "Конкретный сотрудник по фамилии", "Класс внутри системы"],
      answer: 0,
      explain: "Актёр задаёт тип взаимодействия: «Покупатель», а не «Иван Петров». Один человек может играть много ролей."
    },
    {
      topic: "UC",
      q: "Может ли актёром быть не человек?",
      options: ["Нет, только человек", "Да: внешняя система, устройство или время (планировщик)", "Только база данных"],
      answer: 1,
      explain: "Актёры — всё внешнее, что инициирует поведение системы или участвует в нём: платёжный шлюз, датчик, таймер."
    },
    {
      topic: "UC",
      q: "Сотрудник магазина иногда продаёт товары, а иногда управляет складом. Как это отразить?",
      options: ["Одним актёром «Сотрудник» без различий", "Двумя актёрами-ролями: «Продавец» и «Кладовщик»", "Это невозможно"],
      answer: 1,
      explain: "Актёр — роль, а не человек. Один человек в разных ситуациях выступает в разных ролях."
    },
    {
      topic: "UC",
      q: "Как принято называть варианты использования?",
      options: ["Существительным: «Заказ»", "Глаголом и объектом: «Оформить заказ»", "Названием экрана: «Страница 3»"],
      answer: 1,
      explain: "Название выражает цель актёра и начинается с глагола: «Зарегистрировать пользователя», «Оплатить заказ»."
    },
    {
      topic: "UC",
      q: "Где находятся актёры по отношению к границе системы?",
      options: ["Внутри границы", "Снаружи границы", "На границе"],
      answer: 1,
      explain: "Актёры внешние по определению: они взаимодействуют с системой, но не являются её частью."
    },
    {
      topic: "UC",
      q: "На какой вопрос отвечает диаграмма вариантов использования?",
      options: ["«Что система должна делать для пользователей?»", "«Как именно работает алгоритм?»", "«Как устроена база данных?»"],
      answer: 0,
      explain: "Диаграмма описывает внешнее поведение (что), а не реализацию (как)."
    },
    {
      topic: "UC",
      q: "Что показывает ассоциация между актёром и вариантом использования про данные?",
      options: ["Направление передачи данных", "Ничего про данные: показывает лишь участие актёра", "Формат данных"],
      answer: 1,
      explain: "Стрелки направления на ассоциациях не обязательны и не означают потоков данных. Подробности описывают в спецификации сценария."
    },
    {
      topic: "UC",
      q: "Что такое основной сценарий (main flow) варианта использования?",
      options: ["Типичная последовательность шагов успешного выполнения цели", "Описание ошибок", "Список актёров"],
      answer: 0,
      explain: "Основной сценарий описывает «счастливый путь», когда всё проходит успешно. Альтернативы и ошибки описывают отдельно."
    },
    {
      topic: "UC",
      q: "Что такое альтернативный сценарий?",
      options: ["Ветвление или исключение относительно основного сценария: например, «товара нет в наличии»", "Другой актёр", "Другая диаграмма"],
      answer: 0,
      explain: "Альтернативные и исключительные потоки описывают варианты развития событий при отклонении от основного."
    },
    {
      topic: "UC",
      q: "Чем предусловие отличается от постусловия?",
      options: ["Предусловие должно быть истинно до начала сценария, постусловие — после его завершения", "Это одно и то же", "Предусловие — это шаг сценария"],
      answer: 0,
      explain: "Например, предусловие «пользователь авторизован», постусловие «заказ создан». Они задают границы варианта использования."
    },
    {
      topic: "UC",
      q: "Что такое основной (primary) актёр варианта использования?",
      options: ["Тот, кто инициирует вариант использования для достижения своей цели", "Любой актёр на диаграмме", "Внешняя система хранения"],
      answer: 0,
      explain: "Primary actor — инициатор и получатель ценности. Вторичные актёры (например, платёжный шлюз) лишь помогают."
    },
    {
      topic: "UC",
      q: "Показывает ли диаграмма вариантов использования порядок шагов?",
      options: ["Да, как блок-схема", "Нет: порядок описывают в сценариях или процессными моделями (например, BPMN)", "Да, по стрелкам include"],
      answer: 1,
      explain: "Диаграмма — обзор функций. Последовательность шагов фиксируют в тексте сценария или в диаграммах активности и процессов."
    },
    {
      topic: "UC",
      q: "Сколько вариантов использования разумно держать на одной диаграмме?",
      options: ["Несколько десятков: чем больше, тем лучше", "Небольшое число (примерно до 7–10): иначе диаграмма нечитаема, нужно разбивать по подсистемам", "Ровно один"],
      answer: 1,
      explain: "Читаемость важнее полноты. Большие системы раскладывают на диаграммы по подсистемам или актёрам."
    },
    {
      topic: "UC", uc: "shop",
      q: "Какие варианты использования доступны актёру «Покупатель»?",
      options: ["Просмотреть каталог и оформить заказ", "Управлять товарами", "Просмотреть заказы всех покупателей"],
      answer: 0,
      explain: "Покупатель связан ассоциациями с «Просмотреть каталог» и «Оформить заказ». Управление товарами доступно администратору."
    },
    {
      topic: "UC", uc: "shop",
      q: "Что является внешней системой на диаграмме магазина?",
      options: ["Платёжная система", "Администратор", "Каталог"],
      answer: 0,
      explain: "Платёжная система вынесена за границу и участвует в оплате заказа как внешний актёр."
    },
    {
      topic: "UC", uc: "shop",
      q: "Какое поведение обязательно входит в «Оформить заказ»?",
      options: ["Оплатить заказ и войти в систему (include)", "Применить промокод", "Просмотреть заказы"],
      answer: 0,
      explain: "Связи include показывают обязательные части. Промокод — необязательное расширение (extend)."
    },
    {
      topic: "UC", uc: "shop",
      q: "Что означает «Применить промокод» с extend к «Оформить заказ»?",
      options: ["Промокод применяется не всегда, а только если покупатель его ввёл", "Промокод всегда обязателен", "Промокод заменяет заказ"],
      answer: 0,
      explain: "Расширение вносит дополнительное поведение при выполнении условия, не меняя основной сценарий."
    },
    {
      topic: "UC", uc: "shop",
      q: "Кто связан с «Управлять товарами»?",
      options: ["Администратор", "Покупатель", "Платёжная система"],
      answer: 0,
      explain: "Ассоциация соединяет администратора с вариантом использования управления товарами."
    },
    {
      topic: "UC", uc: "shop",
      q: "Сколько актёров на диаграмме магазина?",
      options: ["Два", "Три: покупатель, администратор и платёжная система", "Один"],
      answer: 1,
      explain: "Актёры — все элементы вне границы системы: два человека-роли и одна внешняя система."
    },
    {
      topic: "UC", uc: "atm",
      q: "Что обязательно делает клиент при снятии наличных на этой диаграмме?",
      options: ["Вводит PIN-код (include)", "Печатает чек (extend)", "Ничего"],
      answer: 0,
      explain: "Ввод PIN-кода включён в «Снять наличные» связью include, то есть выполняется всегда."
    },
    {
      topic: "UC", uc: "atm",
      q: "Печать чека при снятии наличных — это:",
      options: ["Необязательное расширение (extend): чек печатается по желанию клиента", "Обязательная часть", "Отдельный актёр"],
      answer: 0,
      explain: "Extend отражает опциональное поведение, зависящее от выбора пользователя."
    },
    {
      topic: "UC", uc: "atm",
      q: "Кто такой «Банк» на диаграмме банкомата?",
      options: ["Внешняя система-актёр", "Вариант использования", "Граница системы"],
      answer: 0,
      explain: "Банк находится вне границы системы и участвует, например, в проверке PIN-кода и баланса."
    },
    {
      topic: "UC", uc: "atm",
      q: "Какие варианты использования используют общий «Ввести PIN-код»?",
      options: ["«Снять наличные» и «Проверить баланс»", "Только «Распечатать чек»", "Ни один"],
      answer: 0,
      explain: "Общая обязательная функциональность вынесена в отдельный use case и подключена связями include."
    },
    {
      topic: "UC", uc: "library",
      q: "Что делает библиотекарь на диаграмме?",
      options: ["Регистрирует читателей, списывает книги и проверяет билет", "Берёт книги домой", "Оплачивает штраф"],
      answer: 0,
      explain: "Библиотекарь связан с вариантами использования «Зарегистрировать читателя», «Списать книгу» и «Проверить билет»."
    },
    {
      topic: "UC", uc: "library",
      q: "«Оплатить штраф» — это расширение какого варианта использования?",
      options: ["«Вернуть книгу»", "«Найти книгу»", "«Взять книгу»"],
      answer: 0,
      explain: "Штраф возникает при возврате с просрочкой, поэтому «Оплатить штраф» расширяет «Вернуть книгу» условно."
    },
    {
      topic: "UC", uc: "library",
      q: "Почему «Проверить билет» вынесен отдельно и подключён к двум вариантам?",
      options: ["Чтобы не дублировать общее обязательное поведение «Взять книгу» и «Вернуть книгу»", "Из-за ошибки", "Для украшения"],
      answer: 0,
      explain: "Include позволяет переиспользовать общий фрагмент. Он не должен дублироваться в каждом сценарии."
    },
    {
      topic: "UC", uc: "library",
      q: "Кто выполняет «Найти книгу»?",
      options: ["Читатель", "Библиотекарь", "Банк"],
      answer: 0,
      explain: "С «Найти книгу» связан только читатель."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Какой вариант использования обязательно включается в «Забронировать номер»?",
      options: ["«Выбрать даты»", "«Добавить услуги»", "«Заселить гостя»"],
      answer: 0,
      explain: "Include от «Забронировать номер» к «Выбрать даты» означает обязательность шага."
    },
    {
      topic: "UC", uc: "hotel",
      q: "«Добавить услуги» при бронировании — это:",
      options: ["Необязательное расширение (extend)", "Обязательное включение", "Отдельный актёр"],
      answer: 0,
      explain: "Гость может добавить услуги, но бронь возможна и без них."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Что делает внешняя платёжная система?",
      options: ["Участвует в выставлении счёта", "Бронирует номер", "Заселяет гостя"],
      answer: 0,
      explain: "Платёжная система связана ассоциацией с вариантом «Выставить счёт»."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Кто может выписать рецепт?",
      options: ["Врач", "Пациент", "Регистратор"],
      answer: 0,
      explain: "Только врач связан с «Выписать рецепт»."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Зачем «Проверить расписание» подключён к «Записаться на приём» и «Отменить запись»?",
      options: ["Эти варианты используют общее обязательное поведение (include)", "Это расширения", "Это актёры"],
      answer: 0,
      explain: "Проверка расписания нужна обоим сценариям. Её вынесли, чтобы не повторять."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Что означает extend между «Выписать рецепт» и «Провести приём»?",
      options: ["Рецепт выписывается не на каждом приёме, а при необходимости", "Рецепт всегда обязателен", "Приём — часть рецепта"],
      answer: 0,
      explain: "Расширение условно: приём можно провести без рецепта."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "Кто назначает оператора на обращение?",
      options: ["Руководитель", "Клиент", "Оператор"],
      answer: 0,
      explain: "С «Назначить оператора» связан руководитель."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "Что означает extend «Эскалировать обращение» → «Обработать обращение»?",
      options: ["Эскалация происходит только при необходимости во время обработки", "Эскалация обязательна всегда", "Эскалация — актёр"],
      answer: 0,
      explain: "Эскалация — условное расширение, оно срабатывает не для каждого обращения."
    },
    {
      topic: "UC", uc: "actor_gen",
      q: "Что значит, что «Покупатель» обобщается до «Посетителя»?",
      options: ["Покупатель умеет всё, что и посетитель, плюс собственные возможности", "Посетитель умеет больше покупателя", "Это разные независимые роли"],
      answer: 0,
      explain: "Потомок наследует взаимодействия родителя. Здесь покупатель может просматривать каталог, как посетитель, и оформлять заказы."
    },
    {
      topic: "UC", uc: "actor_gen",
      q: "Может ли «Гость» оформить заказ по этой диаграмме?",
      options: ["Да", "Нет: оформление связано только с «Покупателем»", "Только после регистрации в другой системе"],
      answer: 1,
      explain: "Гость наследует возможности посетителя (просмотр каталога) и имеет регистрацию, но не связан с оформлением заказа."
    },
    {
      topic: "UC", uc: "uc_gen",
      q: "Что показывает эта диаграмма про оплату?",
      options: ["Оплата заказа может выполняться разными способами: картой или наличными", "Оплата всегда выполняется и картой, и наличными", "Оплата — актёр"],
      answer: 0,
      explain: "Специализации (дочерние варианты использования) уточняют общий вариант. Клиент выбирает один из способов."
    },
    {
      topic: "UC", uc: "shop",
      q: "Сколько вариантов использования находится внутри границы системы на диаграмме магазина?",
      options: ["Семь", "Три", "Десять"],
      answer: 0,
      explain: "Внутри рамки семь овалов: просмотр каталога, оформление заказа, оплата, промокод, вход в систему, управление товарами и просмотр заказов."
    },
    {
      topic: "UC",
      q: "Как читается стрелка «include» между вариантами использования?",
      options: ["Базовый вариант использования включает в себя поведение, на которое указывает стрелка", "Включаемый вариант использования вызывает базовый", "Оба варианта выполняются независимо"],
      answer: 0,
      explain: "Стрелка include направлена от базового варианта к включаемому: базовый «использует» включаемый как свою часть."
    },
    {
      topic: "SEQ", seq: "sym_lifeline",
      q: "Как называется пунктирная вертикальная линия под участником?",
      options: ["Линия жизни (lifeline): время существования участника во взаимодействии", "Сообщение", "Граница системы"],
      answer: 0,
      explain: "Каждый участник имеет прямоугольник с именем и линию жизни вниз. Время течёт сверху вниз."
    },
    {
      topic: "SEQ", seq: "sym_actor",
      q: "Что обозначает человечек в верхней части диаграммы последовательности?",
      options: ["Актёра: внешнего участника, который инициирует или участвует во взаимодействии", "Объект базы данных", "Класс"],
      answer: 0,
      explain: "Как и на диаграмме вариантов использования, актёр — роль вне системы. Его линия жизни также идёт вниз."
    },
    {
      topic: "SEQ", seq: "sym_sync",
      q: "Что означает сплошная линия с закрашенной стрелкой?",
      options: ["Синхронное сообщение: отправитель ждёт завершения обработки и ответа", "Асинхронное сообщение", "Создание объекта"],
      answer: 0,
      explain: "Синхронный вызов блокирует отправителя до возврата управления. На получателе появляется полоса активации."
    },
    {
      topic: "SEQ", seq: "sym_async",
      q: "Что означает сплошная линия с незакрашенной (открытой) стрелкой?",
      options: ["Асинхронное сообщение: отправитель не ждёт ответа и продолжает работу", "Возврат значения", "Уничтожение объекта"],
      answer: 0,
      explain: "Асинхронные сообщения (события, сообщения в очередь) не блокируют отправителя."
    },
    {
      topic: "SEQ", seq: "sym_reply",
      q: "Что означает пунктирная стрелка, направленная обратно?",
      options: ["Ответ (возврат) на сообщение: результат или завершение вызова", "Новое сообщение", "Условие"],
      answer: 0,
      explain: "Пунктирная линия с открытой стрелкой — сообщение-ответ. Её часто опускают, если возврат очевиден."
    },
    {
      topic: "SEQ", seq: "sym_self",
      q: "Что означает стрелка, вернувшаяся на ту же линию жизни?",
      options: ["Сообщение участника самому себе (вызов собственного метода)", "Ошибка", "Асинхронный ответ"],
      answer: 0,
      explain: "Self-message показывает внутренний шаг, например валидацию или расчёт внутри того же участника."
    },
    {
      topic: "SEQ", seq: "sym_create",
      q: "Что показывает пунктирная стрелка к прямоугольнику, расположенному ниже остальных?",
      options: ["Создание объекта: он появляется в момент сообщения", "Уничтожение", "Ответ"],
      answer: 0,
      explain: "Если участник создаётся по ходу сценария, его прямоугольник рисуют на уровне сообщения создания, а линия жизни начинается оттуда."
    },
    {
      topic: "SEQ", seq: "sym_destroy",
      q: "Что означает крест на конце линии жизни?",
      options: ["Уничтожение объекта: после этой точки он больше не существует", "Ошибку", "Отмену сообщения"],
      answer: 0,
      explain: "Крест (X) — стоп-символ уничтожения. Дальше линия жизни не продолжается."
    },
    {
      topic: "SEQ", seq: "sym_alt",
      q: "Что означает рамка «alt» с двумя частями?",
      options: ["Выбор: выполняется ровно одна ветка в зависимости от условия (как if–else)", "Параллельное выполнение", "Повтор"],
      answer: 0,
      explain: "Фрагмент alt разделён пунктиром на операнды. Условия записывают в квадратных скобках."
    },
    {
      topic: "SEQ", seq: "sym_loop",
      q: "Что означает рамка «loop»?",
      options: ["Повтор: содержимое выполняется, пока истинно условие", "Необязательный блок", "Параллельный блок"],
      answer: 0,
      explain: "Loop повторяет вложенные сообщения. Условие (например, «пока есть данные») указывают рядом с меткой."
    },
    {
      topic: "SEQ", seq: "sym_opt",
      q: "Что означает рамка «opt»?",
      options: ["Необязательный фрагмент: выполняется, если условие истинно, иначе пропускается", "Выбор из двух", "Повтор"],
      answer: 0,
      explain: "Opt — это if без else. Если условие ложно, сообщений внутри не будет."
    },
    {
      topic: "SEQ", seq: "sym_par",
      q: "Что означает рамка «par»?",
      options: ["Параллельное выполнение: операнды могут идти одновременно, без заданного порядка между ними", "Выбор", "Цикл"],
      answer: 0,
      explain: "Операнды par выполняются независимо. Порядок внутри каждого сохраняется, а между ними не определён."
    },
    {
      topic: "SEQ", seq: "sym_nested",
      q: "Что показывают прямоугольники на линиях жизни?",
      options: ["Полосы активации: периоды, когда участник выполняет работу в рамках вызова", "Ошибки", "Условия"],
      answer: 0,
      explain: "Активация начинается при получении синхронного вызова и заканчивается при возврате. Вложенные вызовы дают вложенные полосы."
    },
    {
      topic: "SEQ",
      q: "Для чего нужна диаграмма последовательности?",
      options: ["Для показа порядка обмена сообщениями между участниками в одном сценарии", "Для описания структуры таблиц", "Для описания состояний объекта"],
      answer: 0,
      explain: "Диаграмма последовательности фиксирует, кто кому и в каком порядке отправляет сообщения."
    },
    {
      topic: "SEQ",
      q: "В каком направлении течёт время на диаграмме последовательности?",
      options: ["Сверху вниз", "Слева направо", "Справа налево"],
      answer: 0,
      explain: "Порядок сообщений определяется вертикальным положением: нижнее сообщение происходит позже верхнего."
    },
    {
      topic: "SEQ",
      q: "Что означает расположение участников слева направо?",
      options: ["Ничего про время: порядок выбирают для удобства чтения", "Порядок создания объектов", "Приоритет участников"],
      answer: 0,
      explain: "Горизонтальный порядок произвольный. Обычно слева размещают инициатора, а справа — внешние системы."
    },
    {
      topic: "SEQ",
      q: "Кто может быть участником диаграммы последовательности?",
      options: ["Объекты, компоненты, сервисы, системы и актёры", "Только классы кода", "Только люди"],
      answer: 0,
      explain: "Участники — любые сущности, обменивающиеся сообщениями: микросервисы, базы данных, внешние системы, пользователи."
    },
    {
      topic: "SEQ",
      q: "Что обозначает полоса активации?",
      options: ["Время, в течение которого участник выполняет операцию", "Время жизни объекта в памяти", "Приоритет сообщения"],
      answer: 0,
      explain: "Активация — только период работы по вызову. Линия жизни продолжается и вне активации."
    },
    {
      topic: "SEQ",
      q: "Чем синхронное сообщение отличается от асинхронного?",
      options: ["При синхронном отправитель ждёт ответа, при асинхронном продолжает работу сразу", "Ничем", "Синхронное быстрее"],
      answer: 0,
      explain: "Синхронность определяется поведением отправителя. Асинхронная отправка подходит для событий и очередей."
    },
    {
      topic: "SEQ",
      q: "Что такое сообщение-ответ (return)?",
      options: ["Сообщение, возвращающее результат отправителю синхронного вызова", "Первый вызов", "Создание участника"],
      answer: 0,
      explain: "Ответы рисуют пунктирной стрелкой. Если результат очевиден, ответ можно опустить для краткости."
    },
    {
      topic: "SEQ",
      q: "Как принято называть сообщения?",
      options: ["Именем операции или события: «authenticate()», «OrderCreated»", "Номерами", "Цветом"],
      answer: 0,
      explain: "Подпись связывает диаграмму с интерфейсом участника: метод, запрос API или событие."
    },
    {
      topic: "SEQ",
      q: "Что описывает один экземпляр диаграммы последовательности?",
      options: ["Один сценарий взаимодействия, например успешный вход", "Все сценарии системы", "Структуру данных"],
      answer: 0,
      explain: "Для разных сценариев строят разные диаграммы или используют фрагменты alt/opt для ветвлений."
    },
    {
      topic: "SEQ",
      q: "Как диаграмма последовательности связана с вариантом использования?",
      options: ["Детализирует сценарий варианта использования: показывает, какие участники и сообщения реализуют шаги", "Заменяет его", "Не связана"],
      answer: 0,
      explain: "Use case отвечает «что получает актёр», а диаграмма последовательности — «как участники взаимодействуют для этого»."
    },
    {
      topic: "SEQ",
      q: "Чем диаграмма последовательности отличается от диаграммы классов?",
      options: ["Она показывает поведение во времени, а диаграмма классов — статическую структуру", "Ничем", "Она показывает только данные"],
      answer: 0,
      explain: "Диаграммы дополняют друг друга: классы описывают состав, последовательность — динамику."
    },
    {
      topic: "SEQ",
      q: "Что изображает рамка вокруг части диаграммы с меткой «alt», «opt», «loop»?",
      options: ["Комбинированный фрагмент: структура управления для группы сообщений", "Группу участников", "Границу системы"],
      answer: 0,
      explain: "Комбинированные фрагменты добавляют ветвления, циклы и параллелизм без нескольких диаграмм."
    },
    {
      topic: "SEQ",
      q: "Где обычно изображают пользователя на диаграмме последовательности?",
      options: ["Крайним слева участником: он инициирует сценарий", "В середине", "Внизу"],
      answer: 0,
      explain: "Инициатор слева облегчает чтение: поток сообщений идёт в основном слева направо."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Что делает пользователь в начале сценария входа?",
      options: ["Вводит логин и пароль в интерфейс", "Обращается напрямую к базе данных", "Получает токен"],
      answer: 0,
      explain: "Первое сообщение идёт от пользователя к интерфейсу."
    },
    {
      topic: "SEQ", seq: "login",
      q: "К кому обращается сервис входа, чтобы проверить учётные данные?",
      options: ["К базе данных", "К пользователю", "К интерфейсу"],
      answer: 0,
      explain: "Сервис отправляет запрос в базу и получает данные пользователя в ответ."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Что происходит, если пароль неверный?",
      options: ["Сервис возвращает интерфейсу ошибку 401", "Пользователь получает токен", "Сценарий зависает"],
      answer: 0,
      explain: "Во втором операнде alt указано сообщение «ошибка 401»."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Сколько веток в фрагменте alt на этой диаграмме?",
      options: ["Две: пароль верный и неверный", "Одна", "Три"],
      answer: 0,
      explain: "Фрагмент разделён пунктирной линией на два операнда с разными условиями."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Какое сообщение завершает сценарий?",
      options: ["Интерфейс показывает пользователю результат входа", "Сервис отправляет токен базе", "Пользователь вводит пароль"],
      answer: 0,
      explain: "Последний ответ идёт от интерфейса к пользователю."
    },
    {
      topic: "SEQ", seq: "order",
      q: "С кого начинается процесс оформления заказа?",
      options: ["С покупателя, который оформляет заказ в магазине", "Со склада", "С платёжного сервиса"],
      answer: 0,
      explain: "Первое сообщение — «оформить заказ» от покупателя к магазину."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Что магазин делает сразу после получения заказа?",
      options: ["Обращается к платёжному сервису за списанием оплаты", "Резервирует товар", "Отказывает покупателю"],
      answer: 0,
      explain: "Резервирование происходит только если оплата прошла."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Когда резервируется товар на складе?",
      options: ["Если оплата прошла", "Всегда", "Если оплата отклонена"],
      answer: 0,
      explain: "Резервирование находится в первом операнде alt с условием «оплата прошла»."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Что получит покупатель при отклонённой оплате?",
      options: ["Сообщение «отказ в оплате»", "Заказ принят", "Ничего"],
      answer: 0,
      explain: "Во втором операнде магазин возвращает покупателю отказ."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Сколько участников на диаграмме заказа?",
      options: ["Четыре: покупатель, магазин, платёжный сервис и склад", "Три", "Пять"],
      answer: 0,
      explain: "Вверху нарисованы четыре участника, включая актёра-покупателя."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Что делает банкомат, чтобы проверить PIN?",
      options: ["Отправляет запрос в банк", "Спрашивает клиента ещё раз", "Печатает чек"],
      answer: 0,
      explain: "Банкомат обращается к банку с сообщением «проверить PIN»."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Что означает рамка «opt» с условием «клиент запросил чек»?",
      options: ["Чек печатается только если клиент его запросил", "Чек печатается всегда", "Чек не печатается никогда"],
      answer: 0,
      explain: "Opt — необязательный блок: выполняется при истинном условии."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Что показывают стрелки, возвращающиеся к той же линии банкомата?",
      options: ["Внутренние действия банкомата: выдачу наличных и печать чека", "Ошибки банка", "Запросы клиента"],
      answer: 0,
      explain: "Сообщения самому себе отражают шаги внутри участника."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Кто возвращает клиенту карту и наличные?",
      options: ["Банкомат", "Банк", "Клиент сам"],
      answer: 0,
      explain: "Последний ответ идёт от банкомата к клиенту."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Какие сообщения на этой диаграмме асинхронные?",
      options: ["Публикация события «OrderCreated» и подтверждение «StockReserved» отправляются без ожидания ответа", "Все сообщения синхронные", "Только внутренние"],
      answer: 0,
      explain: "Открытые стрелки означают, что отправитель не ждёт результата обработки."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Что означает заметка «сообщение хранится до доставки»?",
      options: ["Брокер буферизует сообщение, пока получатель его не заберёт", "Сообщение удаляется сразу", "Сообщение шифруется"],
      answer: 0,
      explain: "Брокер обеспечивает развязку отправителя и получателя по времени."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Что делает сервис склада после получения события?",
      options: ["Резервирует товар (внутренний шаг) и отправляет событие в брокер", "Удаляет заказ", "Отвечает сервису заказов напрямую"],
      answer: 0,
      explain: "Склад обрабатывает событие и публикует результат, а сервис заказов не ждёт его в момент отправки."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Что делает клиент, пока отчёт не готов?",
      options: ["Повторяет запрос статуса в цикле", "Ждёт сообщения без запросов", "Закрывает соединение"],
      answer: 0,
      explain: "Фрагмент loop показывает опрос (polling) статуса отчёта."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Что возвращает сервер на первый запрос создания отчёта?",
      options: ["202 Accepted с идентификатором задачи", "Готовый файл", "Ошибку"],
      answer: 0,
      explain: "Сервер принимает задачу и возвращает идентификатор для проверки статуса."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Когда клиент запрашивает результат?",
      options: ["После выхода из цикла, когда статус показывает готовность", "Сразу после создания", "Никогда"],
      answer: 0,
      explain: "Запрос результата идёт после loop: он завершается, когда отчёт готов."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Что делает шлюз перед обращением к сервису заказов?",
      options: ["Проверяет токен у сервиса авторизации", "Сразу отправляет запрос в сервис заказов", "Отказывает без проверки"],
      answer: 0,
      explain: "Шлюз сначала обращается к авторизации и получает результат проверки."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Что вернёт шлюз браузеру, если токен недействителен?",
      options: ["401 Unauthorized", "200 OK", "500 Internal Server Error"],
      answer: 0,
      explain: "Во втором операнде alt шлюз отвечает ошибкой аутентификации."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Какой участник обрабатывает запрос списка заказов?",
      options: ["Сервис заказов", "Сервис авторизации", "Браузер"],
      answer: 0,
      explain: "Шлюз передаёт запрос «GET /orders» сервису заказов при действительном токене."
    },
    {
      topic: "SEQ", seq: "create_destroy",
      q: "Что делает контроллер в конце этого сценария?",
      options: ["Уничтожает объект сессии (сообщение «destroy» с крестом на линии жизни)", "Создаёт сессию", "Ждёт ответа"],
      answer: 0,
      explain: "Крест на линии жизни показывает, что после этого момента сессия не существует."
    },
    {
      topic: "STATE", state: "sym_init",
      q: "Как называется закрашенный круг?",
      options: ["Начальное псевдосостояние: точка входа в диаграмму", "Конечное состояние", "Выбор"],
      answer: 0,
      explain: "Закрашенный круг показывает, с какого состояния начинается жизненный цикл. У него одна исходящая стрелка и нет входящих."
    },
    {
      topic: "STATE", state: "sym_final",
      q: "Что означает круг с точкой внутри?",
      options: ["Конечное состояние: жизненный цикл завершён", "Начальное состояние", "Историческое состояние"],
      answer: 0,
      explain: "Конечное состояние (круг в круге) означает, что объект больше не меняет состояния. Исходящих переходов у него нет."
    },
    {
      topic: "STATE", state: "sym_state",
      q: "Что показывает прямоугольник со скруглёнными углами и надписями «entry» и «exit»?",
      options: ["Состояние с внутренними действиями: при входе и при выходе выполняются указанные операции", "Переход", "Событие"],
      answer: 0,
      explain: "В нижней части состояния перечисляют действия: entry — при входе, exit — при выходе, do — пока объект находится в состоянии."
    },
    {
      topic: "STATE", state: "sym_trans",
      q: "Как читается подпись «оплата [сумма > 0] / списать»?",
      options: ["Событие «оплата», условие «сумма > 0» и действие «списать»", "Три состояния", "Две ошибки"],
      answer: 0,
      explain: "Формат перехода: событие [охранное условие] / действие. Переход срабатывает по событию, если условие истинно, и выполняет действие."
    },
    {
      topic: "STATE", state: "sym_trans",
      q: "Что означает условие в квадратных скобках на переходе?",
      options: ["Охранное условие (guard): переход выполняется только если оно истинно", "Комментарий", "Название состояния"],
      answer: 0,
      explain: "Guard проверяется при наступлении события. Если оно ложно, переход не срабатывает, и объект остаётся в текущем состоянии."
    },
    {
      topic: "STATE", state: "sym_choice",
      q: "Что означает ромб на диаграмме состояний?",
      options: ["Выбор (choice): ветвление по условиям, после которого выбирается один из исходящих переходов", "Конечное состояние", "Параллельный блок"],
      answer: 0,
      explain: "Choice позволяет вычислять условия динамически и направлять переход по подходящей ветке."
    },
    {
      topic: "STATE", state: "sym_fork",
      q: "Что означает жирная линия, из которой выходит несколько стрелок?",
      options: ["Разветвление (fork): объект переходит в несколько параллельных состояний одновременно", "Выбор одного из вариантов", "Историческое состояние"],
      answer: 0,
      explain: "Fork запускает параллельные ветки. Слияние (join) собирает их, когда завершены все."
    },
    {
      topic: "STATE", state: "sym_history",
      q: "Что означает круг с буквой H?",
      options: ["Историческое псевдосостояние: возврат в последнее активное подсостояние составного состояния", "Начальное состояние", "Ошибка"],
      answer: 0,
      explain: "H запоминает последнее подсостояние. При возврате через H объект продолжает с того места, где остановился."
    },
    {
      topic: "STATE", state: "sym_comp",
      q: "Что представляет большая рамка, внутри которой находятся «Ожидание» и «Печать»?",
      options: ["Составное (вложенное) состояние с подсостояниями", "Граница системы", "Переход"],
      answer: 0,
      explain: "Составное состояние группирует подсостояния. Общие переходы можно рисовать от границы рамки, и они применяются ко всем вложенным."
    },
    {
      topic: "STATE", state: "sym_self",
      q: "Что означает стрелка, выходящая из состояния и возвращающаяся в него же?",
      options: ["Переход в то же состояние (саморефлексивный): по событию выполняются действия, а состояние остаётся прежним", "Ошибка", "Начальное состояние"],
      answer: 0,
      explain: "Такой переход срабатывает по событию и может выполнять действие, например «count++», не меняя состояния."
    },
    {
      topic: "STATE",
      q: "Для чего нужна диаграмма состояний?",
      options: ["Для описания жизненного цикла объекта или системы: какие у неё состояния и как они меняются под действием событий", "Для описания структуры данных", "Для описания порядка вызовов"],
      answer: 0,
      explain: "Диаграмма состояний показывает поведение: заказ, документ, соединение, устройство — через состояния и переходы."
    },
    {
      topic: "STATE",
      q: "Что такое состояние?",
      options: ["Ситуация в жизненном цикле объекта, в которой он удовлетворяет определённому условию и ожидает событий", "Действие пользователя", "Таблица базы данных"],
      answer: 0,
      explain: "Состояние — устойчивое положение, например «Оплачен». Объект в нём может находиться продолжительное время."
    },
    {
      topic: "STATE",
      q: "Что такое переход?",
      options: ["Смена состояния под воздействием события", "Пауза", "Вид состояния"],
      answer: 0,
      explain: "Переход соединяет исходное и целевое состояния и может иметь событие, условие и действие."
    },
    {
      topic: "STATE",
      q: "Что такое событие в диаграмме состояний?",
      options: ["Происшествие, на которое реагирует объект: вызов операции, сигнал, истечение времени", "Состояние", "Условие"],
      answer: 0,
      explain: "События запускают переходы. Примеры: «оплата получена», «after(3 дня)», «нажата кнопка»."
    },
    {
      topic: "STATE",
      q: "Сколько состояний одновременно может быть активно у простого объекта без параллельных областей?",
      options: ["Ровно одно", "Любое число", "Ни одного"],
      answer: 0,
      explain: "В простой автомате объект в каждый момент находится ровно в одном состоянии. Параллельные области — отдельный случай."
    },
    {
      topic: "STATE",
      q: "Как принято называть состояния?",
      options: ["Существительными, прилагательными или причастиями: «Оплачен», «Открыта»", "Глаголами в повелительном наклонении: «Оплатить»", "Номерами"],
      answer: 0,
      explain: "Состояние описывает положение, а не действие. Действия выражают переходами и событиями."
    },
    {
      topic: "STATE",
      q: "Чем диаграмма состояний отличается от блок-схемы?",
      options: ["Она описывает состояния и реакцию на события, а блок-схема — последовательность действий алгоритма", "Ничем", "В ней нет стрелок"],
      answer: 0,
      explain: "Диаграмма состояний ориентирована на события и жизненный цикл, блок-схема — на последовательное выполнение шагов."
    },
    {
      topic: "STATE",
      q: "Что означает действие «entry / открыть сокет» у состояния?",
      options: ["При входе в состояние выполняется «открыть сокет»", "При выходе выполняется открытие", "Действие выполняется постоянно"],
      answer: 0,
      explain: "Entry выполняется всякий раз при входе в состояние. Exit — при выходе, do — пока объект остаётся в состоянии."
    },
    {
      topic: "STATE",
      q: "У конечного состояния есть исходящие переходы?",
      options: ["Нет: после него жизненный цикл завершён", "Да, один", "Да, любое число"],
      answer: 0,
      explain: "Конечное состояние завершает автомат. Входящих переходов может быть несколько."
    },
    {
      topic: "STATE", state: "order",
      q: "Из какого состояния начинается жизненный цикл заказа?",
      options: ["«Новый»: туда ведёт переход от начального псевдосостояния", "«Оплачен»", "«Доставлен»"],
      answer: 0,
      explain: "Начальный круг соединён стрелкой с состоянием «Новый»."
    },
    {
      topic: "STATE", state: "order",
      q: "Что должно произойти, чтобы заказ перешёл из «Новый» в «Оплачен»?",
      options: ["Событие «оплата получена»", "Событие «отмена»", "Ничего: переход автоматический"],
      answer: 0,
      explain: "Подпись на переходе указывает событие-триггер."
    },
    {
      topic: "STATE", state: "order",
      q: "Из каких состояний заказ можно отменить?",
      options: ["Из «Новый» и «Оплачен»", "Из любого", "Только из «Доставлен»"],
      answer: 0,
      explain: "Переходы «отмена» исходят из «Новый» и «Оплачен». Из остальных состояний отмена не предусмотрена."
    },
    {
      topic: "STATE", state: "order",
      q: "Что делается при отмене оплаченного заказа?",
      options: ["Возвращаются деньги: действие «вернуть деньги» на переходе", "Заказ отправляется", "Ничего"],
      answer: 0,
      explain: "Подпись «отмена / вернуть деньги» означает событие и действие."
    },
    {
      topic: "STATE", state: "order",
      q: "Что произойдёт после состояния «Доставлен»?",
      options: ["Через срок возврата заказ переходит в конечное состояние", "Заказ снова станет «Новый»", "Заказ отменится"],
      answer: 0,
      explain: "Переход «срок возврата истёк» ведёт к конечному состоянию."
    },
    {
      topic: "STATE", state: "order",
      q: "Можно ли из состояния «Отправлен» перейти в «Отменён»?",
      options: ["Нет: такого перехода на диаграмме нет", "Да", "Только с условием"],
      answer: 0,
      explain: "Допустимы только нарисованные переходы. Остальные события в этом состоянии игнорируются или считаются ошибкой."
    },
    {
      topic: "STATE", state: "door",
      q: "В каком состоянии дверь после начального перехода?",
      options: ["«Закрыта»", "«Открыта»", "«Заперта»"],
      answer: 0,
      explain: "Начальная стрелка ведёт в «Закрыта»."
    },
    {
      topic: "STATE", state: "door",
      q: "Можно ли сразу открыть запертую дверь?",
      options: ["Нет: сначала нужно отпереть её, перейдя в «Закрыта»", "Да", "Только с ключом"],
      answer: 0,
      explain: "Из «Заперта» есть переход только в «Закрыта» с условием «есть ключ»."
    },
    {
      topic: "STATE", state: "door",
      q: "Что нужно для перехода «запереть»?",
      options: ["Охранное условие: есть ключ", "Никаких условий", "Открытая дверь"],
      answer: 0,
      explain: "Условие в квадратных скобках [есть ключ] ограничивает переход."
    },
    {
      topic: "STATE", state: "door",
      q: "Из какого состояния можно перейти в «Открыта»?",
      options: ["Только из «Закрыта»", "Из любого", "Из «Заперта»"],
      answer: 0,
      explain: "Единственный входящий переход в «Открыта» исходит из «Закрыта»."
    },
    {
      topic: "STATE", state: "login",
      q: "Что происходит после ввода данных?",
      options: ["Система переходит в состояние «Проверка»", "Сразу открывается доступ", "Блокировка"],
      answer: 0,
      explain: "Переход «данные введены» ведёт из ожидания в проверку."
    },
    {
      topic: "STATE", state: "login",
      q: "Когда пользователь попадает в «Вход выполнен»?",
      options: ["Если пароль верный", "Если пароль неверный", "Всегда"],
      answer: 0,
      explain: "Охранное условие [пароль верный] разрешает переход."
    },
    {
      topic: "STATE", state: "login",
      q: "Что происходит при неверном пароле и попытках меньше 3?",
      options: ["Возврат в «Ожидание ввода», счётчик попыток увеличивается", "Блокировка", "Вход выполнен"],
      answer: 0,
      explain: "На переходе указано действие «попыток++» и условие по числу попыток."
    },
    {
      topic: "STATE", state: "login",
      q: "Когда пользователь блокируется?",
      options: ["Когда число попыток достигло трёх", "После первой ошибки", "Никогда"],
      answer: 0,
      explain: "Переход «[попыток = 3]» ведёт в «Заблокирован»."
    },
    {
      topic: "STATE", state: "player",
      q: "В каком состоянии плеер сразу после включения?",
      options: ["«Остановлен»", "«Воспроизведение»", "«Пауза»"],
      answer: 0,
      explain: "Начальный переход ведёт в «Остановлен»."
    },
    {
      topic: "STATE", state: "player",
      q: "Какое событие переводит плеер из «Пауза» в «Воспроизведение»?",
      options: ["play", "pause", "stop"],
      answer: 0,
      explain: "Подпись на переходе из «Пауза» в «Воспроизведение» — play."
    },
    {
      topic: "STATE", state: "player",
      q: "Что выполняется при входе в «Воспроизведение»?",
      options: ["Включается звук (entry-действие)", "Выключается звук", "Ничего"],
      answer: 0,
      explain: "В состоянии указано «entry / включить звук» и «exit / выключить звук»."
    },
    {
      topic: "STATE", state: "player",
      q: "Что произойдёт при событии stop в состоянии «Пауза»?",
      options: ["Плеер перейдёт в «Остановлен»", "Продолжится воспроизведение", "Ничего"],
      answer: 0,
      explain: "Из «Пауза» есть переход «stop» в «Остановлен»."
    },
    {
      topic: "STATE", state: "ticket",
      q: "В какое состояние заявка попадает после создания?",
      options: ["«Новая»", "«В работе»", "«Закрыта»"],
      answer: 0,
      explain: "Начальный переход ведёт в «Новая»."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Что происходит после запроса дополнительной информации у клиента?",
      options: ["Заявка переходит в «Ожидает клиента»", "Закрывается", "Остаётся новой"],
      answer: 0,
      explain: "Событие «запрошена информация» ведёт из «В работе» в «Ожидает клиента»."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Когда решённая заявка автоматически закрывается?",
      options: ["Через 3 дня, если клиент не возражал: переход after(3 дня)", "Сразу", "Никогда"],
      answer: 0,
      explain: "Переход по времени описан событием after(3 дня)."
    },
    {
      topic: "STATE", state: "traffic",
      q: "Сколько состояний у светофора на диаграмме?",
      options: ["Три: красный, зелёный, жёлтый", "Два", "Четыре"],
      answer: 0,
      explain: "Диаграмма содержит три состояния, переходящих по таймеру."
    },
    {
      topic: "STATE", state: "traffic",
      q: "Какое состояние следует за зелёным?",
      options: ["Жёлтый", "Красный", "Зелёный"],
      answer: 0,
      explain: "Переход after(25 с) ведёт из «Зелёный» в «Жёлтый»."
    },
    {
      topic: "STATE", state: "cart",
      q: "Что происходит при добавлении товара в непустую корзину?",
      options: ["Состояние не меняется, счётчик увеличивается", "Корзина становится пустой", "Заказ оформляется"],
      answer: 0,
      explain: "Саморефлексивный переход выполняет действие «count++» и остаётся в «Не пустая»."
    },
    {
      topic: "STATE", state: "cart",
      q: "Какое событие переводит корзину из «Пустая» в «Не пустая»?",
      options: ["Добавить товар", "Оформить", "Очистить"],
      answer: 0,
      explain: "Событие «добавить товар» ведёт из пустого состояния в непустое."
    },
    {
      topic: "STATE", state: "cart",
      q: "Из какого состояния можно оформить заказ?",
      options: ["Из «Не пустая»", "Из «Пустая»", "Из любого"],
      answer: 0,
      explain: "Переход «оформить» исходит только из «Не пустая»: пустую корзину оформить нельзя."
    },
    {
      topic: "STATE", state: "traffic",
      q: "Сколько переходов ведёт в состояние «Красный» (кроме начального)?",
      options: ["Один: из «Жёлтый» по истечении 5 секунд", "Два", "Ни одного"],
      answer: 0,
      explain: "Цикл светофора замкнут: красный → зелёный → жёлтый → красный."
    },
    {
      topic: "STATE", state: "conn",
      q: "Какое событие переводит соединение из «Отключено» в «Подключено»?",
      options: ["connect()", "disconnect()", "таймаут"],
      answer: 0,
      explain: "Подпись перехода из «Отключено» — connect()."
    },
    {
      topic: "STATE", state: "conn",
      q: "Что выполняется при входе в «Подключено»?",
      options: ["Открывается сокет (entry-действие)", "Закрывается сокет", "Ничего"],
      answer: 0,
      explain: "В состоянии указано «entry / открыть сокет»."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Может ли клиент вернуть решённую заявку в работу?",
      options: ["Да: переход «клиент не согласен» из «Решена» в «В работе»", "Нет", "Только менеджер"],
      answer: 0,
      explain: "На диаграмме есть обратный переход, то есть повторное открытие заявки допустимо."
    },
    {
      topic: "STATE", state: "credit",
      q: "Что происходит после состояния «Заявка»?",
      options: ["Выполняется проверка, и по сумме выбирается дальнейшее состояние через ромб выбора", "Заявка закрывается", "Заявка отменяется"],
      answer: 0,
      explain: "Переход «проверка завершена» ведёт к ромбу (choice), от которого идут ветки по условиям."
    },
    {
      topic: "ACT", act: "sym_start",
      q: "Как называется закрашенный круг?",
      options: ["Начальный узел: с него начинается выполнение диаграммы активности", "Конечный узел", "Слияние"],
      answer: 0,
      explain: "Закрашенный круг — начальный узел (initial node). Из него выходит одна стрелка, входящих нет."
    },
    {
      topic: "ACT", act: "sym_end",
      q: "Что означает круг с закрашенным кругом внутри?",
      options: ["Конечный узел активности: завершает всю активность, останавливая все потоки", "Начальный узел", "Конец одной ветки"],
      answer: 0,
      explain: "Activity final завершает активность целиком, даже если другие ветки ещё выполняются."
    },
    {
      topic: "ACT", act: "sym_fend",
      q: "Что означает круг с крестом?",
      options: ["Конец потока (flow final): завершает только одну ветку, остальные продолжают работу", "Завершает всю активность", "Ошибку"],
      answer: 0,
      explain: "Flow final гасит лишь токен своей ветки. Остальные ветки продолжают выполняться."
    },
    {
      topic: "ACT", act: "sym_action",
      q: "Что обозначает прямоугольник со скруглёнными углами?",
      options: ["Действие (action): единичный шаг поведения", "Состояние", "Решение"],
      answer: 0,
      explain: "Действие — атомарный шаг: «Проверить заказ», «Отправить письмо»."
    },
    {
      topic: "ACT", act: "sym_call",
      q: "Что означает значок «грабли» в углу действия?",
      options: ["Вызов вложенной активности (call behavior): подробности вынесены в отдельную диаграмму", "Параллельность", "Ошибку"],
      answer: 0,
      explain: "Rake-символ указывает, что действие раскрывается в другую активность, как подпроцесс."
    },
    {
      topic: "ACT", act: "sym_dec",
      q: "Что означает ромб с двумя исходящими стрелками с условиями?",
      options: ["Узел решения (decision): выбирается ровно одна ветка по условию", "Параллельное выполнение", "Слияние"],
      answer: 0,
      explain: "Решение направляет поток по одной из ветвей. Условия записывают в квадратных скобках."
    },
    {
      topic: "ACT", act: "sym_merge",
      q: "Что делает ромб с несколькими входящими и одной исходящей стрелкой?",
      options: ["Слияние (merge): пропускает любой пришедший поток дальше без ожидания остальных", "Ждёт все потоки", "Выбирает ветку"],
      answer: 0,
      explain: "Merge объединяет альтернативные ветки. Он не синхронизирует потоки."
    },
    {
      topic: "ACT", act: "sym_fork",
      q: "Что означает жирная линия с одной входящей и несколькими исходящими стрелками?",
      options: ["Разветвление (fork): запускает несколько параллельных потоков одновременно", "Выбор одной ветки", "Слияние"],
      answer: 0,
      explain: "Fork создаёт параллельные потоки. Условий на выходах нет: запускаются все."
    },
    {
      topic: "ACT", act: "sym_join",
      q: "Что означает жирная линия с несколькими входящими и одной исходящей стрелкой?",
      options: ["Соединение (join): ждёт завершения всех входящих потоков и только потом продолжает", "Выбирает одну ветку", "Прерывает потоки"],
      answer: 0,
      explain: "Join синхронизирует параллельные ветви: выходной поток начинается, когда пришли все входящие."
    },
    {
      topic: "ACT", act: "sym_obj",
      q: "Что означает прямоугольник с названием «Заказ [оплачен]»?",
      options: ["Узел объекта: данные или объект в определённом состоянии, передаваемый между действиями", "Действие", "Состояние"],
      answer: 0,
      explain: "Узлы объектов показывают, какие данные передаются потоком. В скобках указывают состояние объекта."
    },
    {
      topic: "ACT", act: "sym_send",
      q: "Что означает пятиугольник, у которого выступает правая сторона?",
      options: ["Отправка сигнала: активность посылает сигнал вовне", "Приём сигнала", "Решение"],
      answer: 0,
      explain: "Send signal выглядит как «стрелка вправо». Он отправляет сигнал и продолжает работу."
    },
    {
      topic: "ACT", act: "sym_accept",
      q: "Что означает пятиугольник с вогнутой левой стороной?",
      options: ["Приём события (accept event): поток ждёт сигнала или события", "Отправка сигнала", "Действие"],
      answer: 0,
      explain: "Accept event блокирует поток, пока не произойдёт событие."
    },
    {
      topic: "ACT", act: "sym_time",
      q: "Что означает значок «песочные часы»?",
      options: ["Событие времени: поток ждёт срока или запускается по расписанию", "Ошибка", "Конец потока"],
      answer: 0,
      explain: "Time event — приём события по времени. Например, «каждый понедельник» или «через 3 дня»."
    },
    {
      topic: "ACT", act: "sym_lane",
      q: "Что означают горизонтальные полосы «Клиент» и «Магазин»?",
      options: ["Разделы (partitions, дорожки): кто отвечает за действия внутри полосы", "Время выполнения", "Приоритеты"],
      answer: 0,
      explain: "Дорожки показывают ответственных за действия: роли, системы, подразделения."
    },
    {
      topic: "ACT",
      q: "Для чего нужна диаграмма активности?",
      options: ["Для описания потока работ: последовательности действий, ветвлений и параллелизма", "Для описания данных", "Для описания состояний объекта"],
      answer: 0,
      explain: "Диаграмма активности подходит для алгоритмов, бизнес-процессов и сценариев использования."
    },
    {
      topic: "ACT",
      q: "Что такое токен в диаграмме активности?",
      options: ["Условный маркер, который перемещается по потокам и показывает ход выполнения", "Пароль", "Название действия"],
      answer: 0,
      explain: "Семантика основана на токенах. Начальный узел создаёт токен, действия пропускают его дальше, конечный узел его поглощает."
    },
    {
      topic: "ACT",
      q: "Чем диаграмма активности отличается от блок-схемы?",
      options: ["Она поддерживает параллелизм, дорожки, сигналы и объекты, а классическая блок-схема — только последовательные алгоритмы", "Ничем", "У неё нет стрелок"],
      answer: 0,
      explain: "Диаграмма активности — расширение идеи блок-схемы для описания параллельных процессов."
    },
    {
      topic: "ACT",
      q: "Как принято называть действия?",
      options: ["Глаголом с объектом: «Проверить заказ»", "Существительным без глагола", "Номером"],
      answer: 0,
      explain: "Действие — шаг работы, поэтому в названии нужен глагол."
    },
    {
      topic: "ACT",
      q: "Как записывают условия на выходах решения?",
      options: ["В квадратных скобках: [да], [нет], [сумма > 100]", "Без скобок", "Цветом"],
      answer: 0,
      explain: "Охранные условия в скобках показывают, при каких обстоятельствах выбирается ветка."
    },
    {
      topic: "ACT",
      q: "Должны ли условия на выходах решения быть взаимоисключающими?",
      options: ["Да, чтобы однозначно выбиралась одна ветка, и покрывать все случаи (можно [else])", "Нет", "Только для слияния"],
      answer: 0,
      explain: "Полнота и непересекаемость условий — основа однозначного поведения."
    },
    {
      topic: "ACT",
      q: "Что показывают дорожки в диаграмме активности?",
      options: ["Ответственных за действия: роли, подразделения или системы", "Время", "Версии"],
      answer: 0,
      explain: "Дорожки отвечают на вопрос «кто это делает»."
    },
    {
      topic: "ACT",
      q: "Чем отличается узел решения от узла разветвления (fork)?",
      options: ["Решение выбирает одну ветку, а fork запускает все параллельно", "Ничем", "Fork выбирает одну ветку"],
      answer: 0,
      explain: "Это принципиально разная семантика: альтернатива против параллелизма."
    },
    {
      topic: "ACT",
      q: "Что такое поток управления?",
      options: ["Стрелка между действиями, по которой передаётся управление", "Узел данных", "Дорожка"],
      answer: 0,
      explain: "Control flow определяет порядок выполнения. Потоки объектов передают ещё и данные."
    },
    {
      topic: "ACT",
      q: "Может ли у диаграммы активности быть несколько конечных узлов?",
      options: ["Да: разные исходы процесса могут завершаться отдельными конечными узлами", "Нет", "Только один начальный и один конечный"],
      answer: 0,
      explain: "Несколько конечных узлов допустимы, если процесс имеет различные исходы."
    },
    {
      topic: "ACT", act: "order_act",
      q: "С какого действия начинается обработка заказа?",
      options: ["«Проверить заказ»", "«Собрать заказ»", "«Уведомить клиента»"],
      answer: 0,
      explain: "Начальный узел ведёт к действию «Проверить заказ» на дорожке «Магазин»."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Кто собирает заказ?",
      options: ["Склад", "Клиент", "Магазин"],
      answer: 0,
      explain: "Действие «Собрать заказ» расположено на дорожке «Склад»."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Что происходит, если товара нет в наличии?",
      options: ["Клиент получает уведомление, и процесс завершается", "Заказ собирается", "Заказ отправляется"],
      answer: 0,
      explain: "По ветке [нет] выполняется «Уведомить клиента» и достигается конечный узел."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Сколько веток выберет решение «Товар есть?»?",
      options: ["Одну", "Обе", "Ни одной"],
      answer: 0,
      explain: "Ромб-решение выбирает ровно одну исходящую ветку."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Сколько конечных узлов в диаграмме?",
      options: ["Два", "Один", "Три"],
      answer: 0,
      explain: "Есть два исхода: уведомление клиента и доставка заказа."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Как выполняются «Проверить документы» и «Проверить платёж»?",
      options: ["Параллельно: их запускает fork", "Строго по очереди", "Только одно из них"],
      answer: 0,
      explain: "Жирная вертикальная линия после «Принять заявку» запускает обе ветки одновременно."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Когда начнётся «Выдать результат»?",
      options: ["Когда завершатся обе проверки: join ждёт все потоки", "После первой проверки", "Сразу"],
      answer: 0,
      explain: "Join собирает параллельные ветви и пропускает поток дальше после прихода всех токенов."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Какая проверка выполняется первой?",
      options: ["Порядок не определён: ветки параллельны", "Документов", "Платежа"],
      answer: 0,
      explain: "Диаграмма не задаёт порядок параллельных веток."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Сколько токенов создаёт fork в этой диаграмме?",
      options: ["Два: по одному на каждую исходящую ветку", "Один", "Три"],
      answer: 0,
      explain: "Fork порождает по токену на каждый исходящий поток."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Что происходит, если пароль неверный?",
      options: ["Показывается ошибка, и ввод пароля повторяется", "Выполняется вход", "Процесс завершается"],
      answer: 0,
      explain: "Ветка [нет] ведёт к «Показать ошибку», а затем обратно к «Ввести пароль»: образуется цикл."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Как на диаграмме выглядит цикл?",
      options: ["Обратная стрелка от «Показать ошибку» к «Ввести пароль»", "Рамка loop", "Отдельный узел цикла"],
      answer: 0,
      explain: "В диаграммах активности цикл образуется возвратной стрелкой и ромбом решения."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Когда выполняется «Войти в систему»?",
      options: ["Когда пароль верный", "Всегда", "Когда пароль неверный"],
      answer: 0,
      explain: "Ветка [да] решения «Пароль верный?» ведёт к входу."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Сколько раз может повториться ввод пароля?",
      options: ["Диаграмма не ограничивает число повторов: нужно добавить счётчик или условие выхода", "Ровно три раза", "Один раз"],
      answer: 0,
      explain: "Цикл без ограничения — типичная проблема. Для реального процесса добавляют лимит попыток."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Что передаётся от «Создать счёт» к «Оплатить счёт»?",
      options: ["Объект «Счёт» в состоянии «создан»", "Управляющий сигнал без данных", "Ничего"],
      answer: 0,
      explain: "Поток объектов показывает, что именно получает следующее действие."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Что означает пунктирная стрелка между действием и объектом?",
      options: ["Поток объектов: передача данных между узлами", "Ошибка", "Условие"],
      answer: 0,
      explain: "Потоки объектов часто рисуют так же, как потоки управления, или пунктиром."
    },
    {
      topic: "ACT", act: "signals",
      q: "Что делает пятиугольник «Отправить запрос»?",
      options: ["Отправляет сигнал вовне и продолжает работу", "Ждёт сигнал", "Принимает решение"],
      answer: 0,
      explain: "Send signal действие отправляет сообщение внешнему участнику."
    },
    {
      topic: "ACT", act: "signals",
      q: "Что делает «Получить ответ» после отправки запроса?",
      options: ["Блокирует поток до прихода сигнала-ответа", "Отправляет запрос", "Завершает процесс"],
      answer: 0,
      explain: "Accept event ждёт события. Пока ответ не получен, процесс не идёт дальше."
    },
    {
      topic: "ACT", act: "signals",
      q: "В каком порядке выполняются шаги?",
      options: ["Подготовить запрос → отправить → получить ответ → обработать", "Получить ответ → отправить", "Обработать → отправить"],
      answer: 0,
      explain: "Порядок задаётся стрелками потока управления слева направо."
    },
    {
      topic: "ACT", act: "time_act",
      q: "Что запускает этот процесс?",
      options: ["Событие времени: каждый понедельник", "Сообщение", "Ручной запуск"],
      answer: 0,
      explain: "Песочные часы в начале означают запуск по времени."
    },
    {
      topic: "ACT", act: "time_act",
      q: "Какое действие выполняется после срабатывания таймера?",
      options: ["«Сформировать отчёт»", "«Отправить письмо»", "«Принять заказ»"],
      answer: 0,
      explain: "Стрелка ведёт от события времени к действию «Сформировать отчёт»."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Кто принимает обращение?",
      options: ["Оператор", "Клиент", "Руководитель"],
      answer: 0,
      explain: "Действие «Принять обращение» расположено на дорожке «Оператор»."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Что происходит, если проблема не решена сразу?",
      options: ["Оператор эскалирует обращение руководителю", "Обращение закрывается", "Клиент решает сам"],
      answer: 0,
      explain: "Ветка [нет] ведёт к «Эскалировать» на дорожке руководителя."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Кто принимает решение при эскалации?",
      options: ["Руководитель", "Клиент", "Оператор"],
      answer: 0,
      explain: "Действие «Принять решение» находится на дорожке «Руководитель»."
    },
    {
      topic: "ACT", act: "call_act",
      q: "Что означает значок на действии «Оплатить заказ»?",
      options: ["Это вызов вложенной активности с подробным описанием оплаты", "Это параллельность", "Это решение"],
      answer: 0,
      explain: "Call behavior скрывает детали подпроцесса, упрощая основную диаграмму."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Какое действие выполняется на дорожке «Магазин»?",
      options: ["«Проверить заказ»", "«Собрать заказ»", "«Отправить заказ»"],
      answer: 0,
      explain: "На дорожке «Магазин» находятся начальный узел, «Проверить заказ» и решение. Сборка и отправка — на складе."
    },
    {
      topic: "ACT", act: "signals",
      q: "Какой шаг происходит сразу после «Подготовить запрос»?",
      options: ["«Отправить запрос»", "«Получить ответ»", "«Обработать ответ»"],
      answer: 0,
      explain: "Стрелка ведёт от подготовки к отправке сигнала."
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
    },
    {
      topic: "ERD", erd: "library",
      q: "Зачем нужна таблица book_authors?",
      options: ["Чтобы хранить биографии авторов", "Чтобы реализовать связь M:N: у книги может быть несколько авторов, а у автора несколько книг", "Чтобы ускорить поиск по названию книги"],
      answer: 1,
      explain: "Прямая связь M:N в реляционной модели невозможна, поэтому добавляют таблицу связи с двумя внешними ключами. Составной PK не даёт записать одну и ту же пару дважды."
    },
    {
      topic: "ERD", erd: "library", lang: "sql",
      q: "Как найти читателей, которые ни разу не брали книги?",
      code: `-- readers (id) 1 — N loans (reader_id)`,
      options: ["INNER JOIN readers и loans", "LEFT JOIN readers → loans с условием loans.id IS NULL", "SELECT FROM loans GROUP BY reader_id"],
      answer: 1,
      explain: "INNER JOIN оставит только читателей с выдачами. LEFT JOIN сохраняет всех, а фильтр IS NULL по правой таблице оставляет тех, для кого пары не нашлось."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Что означает колонка manager_id в employees, если она ссылается на employees.id?",
      options: ["Ошибка проектирования: таблица не может ссылаться на саму себя", "Рекурсивная связь: руководитель — тоже сотрудник той же таблицы", "Связь с таблицей departments"],
      answer: 1,
      explain: "Самоссылка — стандартный способ хранить иерархию. Чтобы получить имя руководителя, таблицу соединяют сама с собой (self join) под разными псевдонимами."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Как узнать название отеля, в котором сделано бронирование?",
      options: ["bookings → hotels одним соединением", "bookings → rooms → hotels двумя соединениями", "guests → hotels"],
      answer: 1,
      explain: "В bookings нет прямой ссылки на отель: бронь привязана к номеру, а номер — к отелю. Путь по внешним ключам проходит через rooms."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Почему плохая идея добавить hotel_id в bookings, если он уже есть в rooms?",
      options: ["Это ускоряет запросы, поэтому идея хорошая", "Дублирование: hotel_id определяется через room_id, возможна рассинхронизация (нарушение 3НФ)", "Внешний ключ нельзя ссылаться дважды"],
      answer: 1,
      explain: "Если hotel_id однозначно вычисляется через room_id, хранить его второй раз значит создавать риск противоречий. Денормализацию допускают осознанно, с контролем согласованности."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Где хранить цену товара на момент покупки?",
      options: ["Только в products.price: она всегда актуальна", "Копией в order_items: цена в каталоге меняется, а в старых заказах должна остаться прежней", "В users"],
      answer: 1,
      explain: "Если читать цену из products, изменение прайса переписывает историю заказов. Поэтому в строке заказа фиксируют цену и, при необходимости, скидку и налог на момент покупки."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что случится при попытке удалить пользователя, у которого есть заказы (FK без каскада)?",
      options: ["Удалится пользователь, а заказы останутся без владельца", "СУБД отклонит удаление: нарушается внешний ключ orders.user_id", "Удалятся и пользователь, и заказы автоматически"],
      answer: 1,
      explain: "По умолчанию действует поведение NO ACTION/RESTRICT: пока есть ссылающиеся строки, родителя удалить нельзя. Другие варианты (CASCADE, SET NULL) задают явно."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Как добавить тег к статье, исходя из диаграммы?",
      options: ["Добавить строку в post_tags с post_id и tag_id", "Добавить колонку tag в posts", "Добавить строку в comments"],
      answer: 0,
      explain: "Связь M:N между posts и tags хранится в post_tags: одна строка — одна пара «статья — тег». Если тега ещё нет, сначала добавляют его в tags."
    },
    {
      topic: "ERD",
      q: "Если к users добавить user_profiles с колонкой user_id, помеченной UNIQUE, какой тип связи получится?",
      options: ["1:1: уникальность не даёт нескольким профилям ссылаться на одного пользователя", "1:N, потому что есть внешний ключ", "M:N"],
      answer: 0,
      explain: "Без UNIQUE внешний ключ допускает много профилей на пользователя (1:N). Ограничение уникальности на FK превращает связь в «один к одному»."
    },
    {
      topic: "ERD", erd: "school",
      q: "К какой сущности относится оценка grade, исходя из диаграммы?",
      options: ["К студенту: это его свойство", "К курсу: это свойство курса", "К связи «студент — курс»: оценка зависит от обеих сущностей, поэтому лежит в enrollments"],
      answer: 2,
      explain: "Оценка студента по конкретному курсу — атрибут связи M:N. Если хранить её в students или courses, потеряется привязка к паре."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент создаёт ресурс по адресу, который сам выбрал. Какой ответ ожидается, если такого ресурса ещё не было?",
      code: `PUT /api/v1/documents/report-2026
{ "title": "Report" }`,
      options: ["201 Created: PUT может создавать ресурс по указанному URL", "404 Not Found: PUT только обновляет", "405 Method Not Allowed"],
      answer: 0,
      explain: "PUT устанавливает состояние ресурса по заданному адресу. Если ресурса не было, он создаётся (201), если был — заменяется (200 или 204)."
    },
    {
      topic: "API", lang: "json",
      q: "Какой формат тела ошибки рекомендован стандартом для HTTP API?",
      code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json`,
      options: ["Произвольная строка в теле", "Объект по RFC 9457 (problem details) с полями type, title, status, detail", "Только статус без тела"],
      answer: 1,
      explain: "Problem Details стандартизирует тело ошибки: клиенты могут разбирать её единообразно. Дополнительные поля (например, errors) допустимы."
    },
    {
      topic: "API", lang: "json",
      q: "Что не так с таким ответом на ошибку валидации формы из пяти полей?",
      code: `HTTP/1.1 422
{ "error": "email is invalid" }
# в запросе ошибки были ещё в phone и birthDate`,
      options: ["Ничего: достаточно сообщить об одной ошибке", "Клиент будет исправлять ошибки по одной; стоит вернуть список ошибок по всем полям", "Нужно вернуть 500"],
      answer: 1,
      explain: "Полный список ошибок экономит клиенту круги «отправил — получил следующую ошибку» и позволяет подсветить все поля сразу."
    },
    {
      topic: "API", lang: "http",
      q: "Что делает этот заголовок ответа?",
      code: `HTTP/1.1 200 OK
Cache-Control: public, max-age=3600`,
      options: ["Разрешает кэшам хранить ответ и считать его свежим один час", "Запрещает кэширование", "Задаёт срок действия токена"],
      answer: 0,
      explain: "max-age задаёт время жизни кэшированной копии в секундах. Для личных данных используют private или no-store."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент просит формат, который сервер не умеет отдавать. Какой статус вернуть?",
      code: `GET /api/v1/report
Accept: application/xml
# сервер умеет только JSON`,
      options: ["406 Not Acceptable", "415 Unsupported Media Type", "404 Not Found"],
      answer: 0,
      explain: "406 относится к Accept (ответ в нужном формате невозможен), а 415 — к Content-Type тела запроса, которое сервер не понимает."
    },
    {
      topic: "API", lang: "http",
      q: "Для чего нужен такой параметр?",
      code: `GET /api/v1/users?fields=id,name`,
      options: ["Для частичного ответа: клиент получает только нужные поля и экономит трафик", "Для фильтрации пользователей по полю fields", "Для сортировки по id и name"],
      answer: 0,
      explain: "Параметры вида fields или select позволяют не передавать тяжёлые поля. Контракт должен перечислять допустимые значения."
    },
    {
      topic: "API", lang: "http",
      q: "Сортировка по цене выдаёт дубли и пропуски между страницами. Что вероятно упущено?",
      code: `GET /api/v1/products?sort=price&limit=20&offset=20
# у многих товаров одинаковая цена`,
      options: ["Ничего: так и должно быть", "Нет уникального вторичного ключа сортировки (например, id): порядок равных цен не определён", "Нужно использовать POST"],
      answer: 1,
      explain: "Если ключ сортировки не уникален, порядок строк с равными значениями может меняться между запросами. Добавляют тай-брейкер, например sort=price,id."
    },
    {
      topic: "API", lang: "json",
      q: "Зачем в ответ списка включают ссылки на соседние страницы?",
      code: `{
  "items": [ ... ],
  "links": { "next": "/api/v1/orders?cursor=abc", "prev": null }
}`,
      options: ["Чтобы клиент не собирал адреса сам и следовал за ссылками сервера", "Чтобы ускорить сервер", "Это нужно только для сортировки"],
      answer: 0,
      explain: "Ссылки (идея HATEOAS) уменьшают связность: клиент не знает правил построения URL и использует готовые из ответа."
    },
    {
      topic: "API", lang: "json",
      q: "Что плохого в смешении стилей имён в одном контракте?",
      code: `{ "userId": 1, "first_name": "Ivan", "LastName": "Petrov" }`,
      options: ["Ничего: JSON допускает любые имена", "Непоследовательность затрудняет использование и приводит к ошибкам; нужно выбрать один стиль (camelCase или snake_case)", "Запрещено стандартом JSON"],
      answer: 1,
      explain: "Единый стиль имён — часть качества контракта. Клиентские мапперы и автогенерация кода рассчитывают на предсказуемый формат."
    },
    {
      topic: "API", lang: "json",
      q: "Какой ответ предпочтителен для пустой коллекции тегов?",
      code: `A) { "tags": null }
B) { "tags": [] }
C) поле tags отсутствует`,
      options: ["A: null говорит об отсутствии данных", "B: пустой массив, клиенту не нужны проверки на null", "C: экономит байты"],
      answer: 1,
      explain: "Для коллекций договариваются возвращать пустой массив, а не null: код клиента перебирает его без дополнительных ветвлений."
    },
    {
      topic: "API", lang: "json",
      q: "Чем опасен такой контракт?",
      code: `{ "createdAt": 1761472000, "ttl": 3600 }`,
      options: ["Ничем: числа всегда понятны", "Не указаны единицы: секунды или миллисекунды; клиенты поймут по-разному", "Числа нельзя использовать для времени"],
      answer: 1,
      explain: "Время и длительность без единиц измерения порождают ошибки в тысячу раз. Единицы описывают в контракте или называют поле явно (ttlSeconds)."
    },
    {
      topic: "API", lang: "json",
      q: "Почему статус заказа лучше передавать строкой, а не числом?",
      code: `A) { "status": 2 }
B) { "status": "paid" }`,
      options: ["Строка читается без справочника и не ломается при смене нумерации", "Число быстрее разбирается, значит лучше", "Нет разницы"],
      answer: 0,
      explain: "Строковые значения самодокументируемы. Числовые коды требуют таблицы соответствий и легко путаются при добавлении значений."
    },
    {
      topic: "API", lang: "http",
      q: "Как по семантике JSON Merge Patch обрабатывается эта операция?",
      code: `PATCH /api/v1/users/42
Content-Type: application/merge-patch+json

{ "phone": null, "name": "Anna" }`,
      options: ["Поле phone игнорируется, name обновится", "phone будет удалено (очищено), name обновится, остальные поля не изменятся", "Все остальные поля будут очищены"],
      answer: 1,
      explain: "В Merge Patch null означает «удалить поле», отсутствующие поля остаются прежними. Эту семантику нужно оговаривать в контракте."
    },
    {
      topic: "API", lang: "json",
      q: "Фоновая задача завершилась ошибкой. Какой ответ даёт запрос статуса задачи?",
      code: `GET /api/v1/jobs/77`,
      options: ["500 Internal Server Error: задача упала", "200 OK с телом, где status = failed и описанием ошибки: сам ресурс задачи существует", "404 Not Found"],
      answer: 1,
      explain: "Ресурс «задача» найден, и запрос выполнен успешно. Результат работы задачи — это данные внутри ресурса, а не статус самого HTTP-вызова."
    },
    {
      topic: "API", lang: "http",
      q: "Что должен содержать ответ, если токен не передан?",
      code: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api"`,
      options: ["Подсказку, какую схему аутентификации нужно использовать", "Адрес для регистрации", "Пароль по умолчанию"],
      answer: 0,
      explain: "Ответ 401 должен содержать заголовок WWW-Authenticate с поддерживаемой схемой. Так клиент знает, как пройти аутентификацию."
    },
    {
      topic: "API", lang: "http",
      q: "У токена есть только scope orders:read, а клиент вызвал POST /orders. Что вернуть?",
      code: `POST /api/v1/orders
Authorization: Bearer <token scope=orders:read>`,
      options: ["401 Unauthorized", "403 Forbidden (insufficient scope)", "404 Not Found"],
      answer: 1,
      explain: "Клиент аутентифицирован, но токен не даёт права на операцию. Это 403, а в WWW-Authenticate можно указать error=insufficient_scope."
    },
    {
      topic: "API", lang: "http",
      q: "Для чего нужны такие заголовки в ответе?",
      code: `X-RateLimit-Limit: 100
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1761472800`,
      options: ["Чтобы клиент знал лимит, остаток и время сброса и мог сам регулировать частоту запросов", "Для логирования на сервере", "Для шифрования ответа"],
      answer: 0,
      explain: "Прозрачный лимит помогает клиенту не упираться в 429. Имена заголовков могут отличаться, главное — зафиксировать их в контракте."
    },
    {
      topic: "API", lang: "yaml",
      q: "Новое необязательное поле добавили в ответ. Что должен делать клиент по принципу tolerant reader?",
      code: `# v1 ответ
{ "id": 1, "name": "Anna" }
# стал
{ "id": 1, "name": "Anna", "nickname": "ann" }`,
      options: ["Упасть с ошибкой: схема изменилась", "Игнорировать незнакомые поля и продолжать работу", "Показать пользователю предупреждение"],
      answer: 1,
      explain: "Принцип «будь консервативен в отправке и либерален в приёме» позволяет серверу безопасно расширять ответы. Клиент не должен ломаться на неизвестных полях."
    },
    {
      topic: "API", lang: "yaml",
      q: "Сервер подставляет значение по умолчанию, если клиент не передал currency. Чем опасно менять его позже?",
      code: `currency:
  type: string
  default: EUR`,
      options: ["Ничем: default — внутреннее дело сервера", "Клиенты, не передающие поле, неявно получат другое поведение; default — часть контракта, его смена ломает совместимость", "default нельзя указывать в OpenAPI"],
      answer: 1,
      explain: "Значение по умолчанию наблюдаемо для клиентов. Изменение значения равносильно изменению поведения, поэтому оно требует версионирования или уведомления."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент для списка из 100 заказов делает 100 запросов за позициями каждого заказа. Как улучшить API?",
      code: `GET /api/v1/orders          -> 100 заказов
GET /api/v1/orders/1/items  -> ...
GET /api/v1/orders/2/items  -> ...`,
      options: ["Ничего: так и надо в REST", "Дать параметр включения связанных данных (expand/include) или пакетный эндпоинт", "Увеличить таймаут клиента"],
      answer: 1,
      explain: "Это проблема N+1 на уровне API. Включение вложенных ресурсов по параметру (?expand=items) или batch-метод сокращает число обращений."
    },
    {
      topic: "API", lang: "http",
      q: "Почему подсчёт общего числа записей в каждом списке может быть проблемой?",
      code: `GET /api/v1/events?limit=20
-> { "items": [...], "total": 48211337 }`,
      options: ["total не нужен никогда", "Точный COUNT по большой таблице дорог: его делают необязательным, приблизительным или убирают в пользу «есть следующая страница»", "total всегда считается бесплатно"],
      answer: 1,
      explain: "Для больших выборок COUNT(*) может быть самым медленным запросом. Часто достаточно признака hasMore или приблизительной оценки."
    },
    {
      topic: "API", lang: "http",
      q: "Удаляется категория, в которой ещё есть товары. Что разумно вернуть?",
      code: `DELETE /api/v1/categories/7
# в категории 120 товаров`,
      options: ["204 No Content: категория удалена вместе с товарами молча", "409 Conflict с пояснением: у категории есть зависимые объекты", "404 Not Found"],
      answer: 1,
      explain: "Удаление нарушает состояние предметной области. Явный конфликт лучше тихой потери данных, а каскад должен быть осознанным решением."
    },
    {
      topic: "API", lang: "http",
      q: "Заказ уже отправлен, а клиент вызывает отмену. Какой ответ уместен?",
      code: `POST /api/v1/orders/9001/cancel
# текущий статус: shipped`,
      options: ["200 OK: отмена принята", "409 Conflict или 422: недопустимый переход состояния", "401 Unauthorized"],
      answer: 1,
      explain: "Операция противоречит текущему состоянию ресурса. Допустимые переходы статусов нужно описать в контракте (машина состояний)."
    },
    {
      topic: "API", lang: "http",
      q: "Для чего нужен такой заголовок в запросе?",
      code: `GET /api/v1/orders
X-Request-Id: 3b9f6c1e-4a2d-4c1b-9a7e-1f0e2d3c4b5a`,
      options: ["Для сквозной трассировки: идентификатор попадает в логи всех сервисов и помогает разбирать инциденты", "Для проверки подлинности пользователя", "Для кэширования ответа"],
      answer: 0,
      explain: "Идентификатор запроса связывает записи в логах клиента, шлюза и сервисов. Его принято возвращать и в ответе, чтобы клиент мог сослаться на него в обращении."
    },
    {
      topic: "API", lang: "text",
      q: "Сервис А вызывает сервис Б без участия пользователя. Что подходит лучше всего?",
      code: `Backend A -> Backend B (нет человека, нет браузера)`,
      options: ["OAuth2 client credentials: клиент получает токен по своим учётным данным", "Логин и пароль пользователя в заголовке", "Authorization code с вводом пароля"],
      answer: 0,
      explain: "Для межсервисного взаимодействия используют поток client credentials: токен выдаётся приложению, а не пользователю."
    },
    {
      topic: "API", lang: "http",
      q: "Ресурс удалён намеренно и навсегда. Чем 410 отличается от 404?",
      code: `GET /api/v1/promos/summer-2020
HTTP/1.1 410 Gone`,
      options: ["Ничем", "410 сообщает, что ресурс существовал, но удалён безвозвратно; 404 — что ресурса нет или неизвестно, был ли он", "410 — ошибка сервера"],
      answer: 1,
      explain: "410 даёт клиентам и поисковикам более сильный сигнал: адрес больше не появится. На практике часто хватает 404."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент отправил POST, а сервер ответил редиректом. Что гарантирует 307/308 в отличие от 301/302?",
      code: `POST /api/v1/orders
HTTP/1.1 307 Temporary Redirect
Location: https://api2.example.com/api/v1/orders`,
      options: ["Клиент повторит запрос тем же методом и с тем же телом", "Клиент заменит POST на GET", "Клиент перестанет отправлять запросы"],
      answer: 0,
      explain: "Коды 307 и 308 сохраняют метод и тело. Многие клиенты при 301/302 меняют POST на GET, что может потерять данные."
    },
    {
      topic: "API", lang: "http",
      q: "Как лучше принять файл размером в сотни мегабайт?",
      code: `POST /api/v1/documents   # клиенту нужно загрузить видео`,
      options: ["Закодировать в base64 и вложить в JSON", "Загрузка напрямую в хранилище по предподписанной ссылке либо multipart/form-data с потоковой обработкой", "Передать в query-параметре"],
      answer: 1,
      explain: "Base64 раздувает размер на треть и грузит память. Предподписанная ссылка снимает нагрузку с API, а для небольших файлов подходит multipart."
    },
    {
      topic: "API", lang: "http",
      q: "Как передать несколько значений фильтра?",
      code: `A) GET /orders?status=new&status=paid
B) GET /orders?status=new,paid`,
      options: ["Нужно выбрать один способ и зафиксировать в контракте: разные клиенты и фреймворки разбирают их по-разному", "Только вариант A корректен", "Только вариант B корректен"],
      answer: 0,
      explain: "Стандарт не задаёт единого формата массивов в query. Поэтому формат (повторяющиеся параметры, запятая, скобки) описывают в OpenAPI."
    },
    {
      topic: "API", lang: "yaml",
      q: "Фильтр по дате рождения. Что точнее по типу?",
      code: `A) type: string, format: date        # 1990-05-17
B) type: string, format: date-time   # 1990-05-17T00:00:00Z`,
      options: ["B: время нужно всегда", "A: для календарной даты без времени и часового пояса; B для моментов времени", "Любой: разницы нет"],
      answer: 1,
      explain: "Дата рождения — календарная дата, и преобразование в момент времени в UTC может сдвинуть день для клиентов в других зонах."
    },
    {
      topic: "API", lang: "http",
      q: "Почему последовательные числовые id в URL могут быть проблемой безопасности?",
      code: `GET /api/v1/invoices/1001
GET /api/v1/invoices/1002`,
      options: ["Не могут: id скрыты от клиентов", "Их легко перебирать (IDOR) и по ним угадывается число записей; важнее проверка прав на каждый объект, а непредсказуемые id (UUID) — дополнительная мера", "Числовые id запрещены REST"],
      answer: 1,
      explain: "Главная защита — проверка прав доступа к объекту. Непредсказуемые идентификаторы лишь усложняют перебор и скрывают объёмы бизнеса."
    },
    {
      topic: "API", lang: "yaml",
      q: "Что даёт автоматическое сравнение двух версий OpenAPI-файла в CI?",
      code: `old: openapi-v1.yaml
new: openapi-v1-dev.yaml`,
      options: ["Ничего, это только форматирование", "Выявляет несовместимые изменения (удалённые поля, ставшие обязательными параметры) до выпуска", "Автоматически генерирует код сервера"],
      answer: 1,
      explain: "Инструменты вроде oasdiff находят breaking changes в контракте. Это дешёвая защита от случайной поломки клиентов."
    },
    {
      topic: "API", lang: "http",
      q: "Для запросов по диапазону дат в контракте не сказано про границы. Что нужно уточнить?",
      code: `GET /api/v1/orders?from=2026-10-01&to=2026-10-31`,
      options: ["Ничего: и так понятно", "Включается ли граница to и в какой часовой зоне считаются даты", "Только формат ответа"],
      answer: 1,
      explain: "Включительность границ и часовой пояс определяют, попадут ли заказы последнего дня. Принято писать полуинтервал [from, to) либо явно описывать правило."
    },
    {
      topic: "API", lang: "yaml",
      q: "Поле в ответе планируют убрать. Как правильно подойти к этому в контракте?",
      code: `properties:
  fullName:
    type: string
    deprecated: true   # заменено на firstName + lastName`,
      options: ["Удалить поле в ближайшем релизе без предупреждения", "Пометить как deprecated, продолжать отдавать, сообщить сроки и убрать в следующей мажорной версии", "Заменить значение на пустую строку"],
      answer: 1,
      explain: "Поле — часть контракта, на него могут опираться клиенты. Устаревание объявляют заранее, а удаление делают в рамках версионирования."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент хочет синхронизировать изменения заказов раз в минуту. Какой подход лучше повторной выгрузки всего списка?",
      code: `GET /api/v1/orders?updated_since=2026-10-26T10:00:00Z`,
      options: ["Каждый раз скачивать все заказы", "Инкрементальная выгрузка по updated_since с учётом удалений (мягкое удаление или журнал изменений)", "Опрашивать каждую секунду"],
      answer: 1,
      explain: "Фильтр по времени изменения передаёт только дельту. Важно решить, как сообщать об удалении, иначе клиент не узнает об исчезнувших записях."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт FULL OUTER JOIN?",
      code: `SELECT c.id, o.id
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;`,
      options: ["Только клиентов с заказами", "Все строки обеих таблиц: пары по совпадению, а несовпавшие — с NULL с другой стороны", "Только клиентов без заказов"],
      answer: 1,
      explain: "FULL JOIN объединяет LEFT и RIGHT: сохраняются клиенты без заказов и заказы без клиента (последние возможны, если FK не задан)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос?",
      code: `SELECT id FROM customers_2025
EXCEPT
SELECT id FROM customers_2026;`,
      options: ["id, которые есть в обоих наборах", "id из первого набора, которых нет во втором", "Все id из обоих наборов"],
      answer: 1,
      explain: "EXCEPT вычитает второй набор из первого, INTERSECT оставляет пересечение. Оба оператора убирают дубликаты, как UNION."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как получить последний заказ каждого пользователя в PostgreSQL коротко?",
      code: `SELECT DISTINCT ON (user_id) *
FROM orders
ORDER BY user_id, created_at DESC;`,
      options: ["Запрос вернёт по одной строке на пользователя с самым свежим заказом", "Запрос вернёт самые старые заказы", "Ошибка: DISTINCT ON не существует"],
      answer: 0,
      explain: "DISTINCT ON оставляет первую строку каждой группы согласно ORDER BY. Это расширение PostgreSQL; в других СУБД используют ROW_NUMBER."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что покажет столбец prev_total для самого первого заказа пользователя?",
      code: `SELECT id, total,
       LAG(total) OVER (PARTITION BY user_id ORDER BY created_at) AS prev_total
FROM orders;`,
      options: ["0", "NULL: предыдущей строки нет", "total текущего заказа"],
      answer: 1,
      explain: "LAG берёт значение из предыдущей строки окна. Для первой строки предшественника нет, поэтому NULL (или значение по умолчанию третьим аргументом)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что считает share?",
      code: `SELECT user_id, amount,
       amount * 100.0 / SUM(amount) OVER () AS share
FROM payments;`,
      options: ["Долю каждого платежа в общей сумме по всей таблице, в процентах", "Сумму платежей пользователя", "Среднее значение по пользователю"],
      answer: 0,
      explain: "Окно OVER () без разбиения охватывает все строки. Значение суммы повторяется в каждой строке, не схлопывая их, в отличие от GROUP BY."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при выполнении запроса?",
      code: `WITH recent AS (
  SELECT * FROM orders WHERE created_at >= now() - interval '7 days'
)
SELECT status, COUNT(*) FROM recent GROUP BY status;`,
      options: ["CTE recent создаёт постоянную таблицу", "CTE — именованный подзапрос только на время запроса, он улучшает читаемость", "Запрос запрещён: CTE нельзя группировать"],
      answer: 1,
      explain: "WITH задаёт временный именованный результат, который существует в рамках одного оператора. Постоянной таблицы он не создаёт."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие заказы вернёт запрос?",
      code: `SELECT * FROM orders o
WHERE total > (
  SELECT AVG(total) FROM orders WHERE user_id = o.user_id
);`,
      options: ["Заказы дороже среднего по всей таблице", "Заказы, сумма которых выше среднего по заказам того же пользователя", "Первый заказ каждого пользователя"],
      answer: 1,
      explain: "Это коррелированный подзапрос: он зависит от внешней строки (o.user_id) и вычисляется для каждой строки заново."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему NOT EXISTS надёжнее NOT IN, если в подзапросе возможны NULL?",
      code: `SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM blocks b WHERE b.user_id = u.id);`,
      options: ["NOT EXISTS проверяет наличие строк и не ломается из-за NULL в подзапросе", "NOT EXISTS всегда быстрее", "Они ничем не отличаются"],
      answer: 0,
      explain: "NOT IN даёт UNKNOWN, если в списке есть NULL, и результат пустой. NOT EXISTS сравнивает по условию и от NULL не зависит."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как избежать деления на ноль?",
      code: `SELECT revenue / orders_cnt AS avg_check
FROM daily_stats;
-- у части дней orders_cnt = 0`,
      options: ["Использовать NULLIF(orders_cnt, 0): деление на NULL даст NULL вместо ошибки", "Заменить / на *", "Деление на ноль в SQL всегда даёт 0"],
      answer: 0,
      explain: "NULLIF возвращает NULL, если аргументы равны. Деление на NULL даёт NULL, и запрос не падает."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Чему равен percent для 1 из 3 заказов?",
      code: `SELECT 1 / 3 * 100 AS percent;
-- PostgreSQL`,
      options: ["33.33", "0: целочисленное деление дало 0 до умножения", "33"],
      answer: 1,
      explain: "1 / 3 между целыми равно 0, и умножение уже ничего не исправит. Нужно привести тип: 1.0 / 3 * 100 или CAST."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает запрос?",
      code: `SELECT DATE_TRUNC('month', created_at) AS month,
       SUM(total) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;`,
      options: ["Суммирует выручку по месяцам", "Считает выручку за последний месяц", "Округляет сумму до месяцев"],
      answer: 0,
      explain: "DATE_TRUNC отбрасывает точность даты до месяца, и по получившемуся значению строится группировка. GROUP BY 1 — ссылка на первую колонку SELECT."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В колонке timestamptz лежит момент 2026-10-26 23:30 UTC. Какую дату увидит сессия с часовым поясом Europe/Moscow (UTC+3)?",
      code: `SELECT created_at::date FROM events;`,
      options: ["2026-10-26", "2026-10-27", "Ошибку"],
      answer: 1,
      explain: "timestamptz хранит абсолютный момент, а при выводе и приведении использует часовой пояс сессии. Для группировок по дням пояс нужно задавать явно."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при сравнении?",
      code: `SELECT * FROM users
WHERE name = 'anna';
-- в данных хранится 'Anna'`,
      options: ["Строка найдётся: регистр не важен всегда", "Зависит от настроек сортировки: в PostgreSQL по умолчанию регистр учитывается, и строка не найдётся", "Всегда ошибка"],
      answer: 1,
      explain: "Сравнение строк подчиняется collation. В PostgreSQL обычное = чувствительно к регистру. Нужны LOWER(), ILIKE или регистронезависимый тип."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие имена найдёт шаблон?",
      code: `SELECT * FROM users
WHERE code LIKE 'A_1%';`,
      options: ["Начинающиеся с A, затем любой один символ, затем 1", "Начинающиеся с A_1 буквально", "Содержащие A и 1"],
      answer: 0,
      explain: "В LIKE символ _ заменяет ровно один любой символ, а % — любую последовательность. Чтобы искать подчёркивание буквально, его экранируют."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему соединение по текстовому коду может терять строки?",
      code: `SELECT * FROM a JOIN b ON a.code = b.code;
-- в b.code встречаются хвостовые пробелы: 'X1 '`,
      options: ["Не потеряет: пробелы игнорируются", "'X1' и 'X1 ' разные значения; нужны TRIM или очистка данных", "JOIN по тексту запрещён"],
      answer: 1,
      explain: "Строки сравниваются побайтно (с учётом пробелов). Типичная причина «пропавших» совпадений — невидимые символы и пробелы."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт сравнение?",
      code: `SELECT '10' < '9' AS r;
-- оба значения — текст`,
      options: ["true: строки сравниваются посимвольно", "false: числа сравниваются по значению", "NULL"],
      answer: 0,
      explain: "Для строк '1' меньше '9', поэтому '10' < '9'. Нужно приводить тип к числу или хранить числа в числовых колонках."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает FILTER?",
      code: `SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'paid') AS paid
FROM orders;`,
      options: ["Считает все заказы и отдельно оплаченные за один проход", "Удаляет неоплаченные заказы", "Фильтрует таблицу перед всеми агрегатами"],
      answer: 0,
      explain: "FILTER применяется к конкретному агрегату. Это наглядная альтернатива SUM(CASE WHEN ...)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт GROUP BY ROLLUP?",
      code: `SELECT region, SUM(amount)
FROM sales
GROUP BY ROLLUP (region);`,
      options: ["Только суммы по регионам", "Суммы по регионам и дополнительную итоговую строку с region = NULL", "Только общую сумму"],
      answer: 1,
      explain: "ROLLUP добавляет промежуточные и общий итоги. Итоговая строка помечена NULL в группируемой колонке (отличить её от настоящего NULL помогает GROUPING)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как найти медиану чека в PostgreSQL?",
      code: `SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total)
FROM orders;`,
      options: ["Запрос вернёт среднее арифметическое", "Запрос вернёт медиану: значение посередине упорядоченного ряда", "Запрос вернёт максимальный чек"],
      answer: 1,
      explain: "PERCENTILE_CONT(0.5) — непрерывный 50-й процентиль, то есть медиана. Для выбросов она устойчивее среднего."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Где окажутся строки с NULL в этой сортировке в PostgreSQL?",
      code: `SELECT * FROM tasks
ORDER BY due_date;`,
      options: ["В начале списка", "В конце списка: по умолчанию NULL считаются большими значениями", "NULL отбрасываются"],
      answer: 1,
      explain: "В PostgreSQL при ASC NULL идут последними, при DESC — первыми. Поведением управляют NULLS FIRST и NULLS LAST."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как выбрать три самых дорогих товара в каждой категории?",
      code: `SELECT * FROM (
  SELECT p.*, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM products p
) t
WHERE rn <= 3;`,
      options: ["Запрос выбирает три самых дорогих товара в каждой категории", "Запрос выбирает три самых дорогих товара во всей таблице", "Запрос выбирает три категории"],
      answer: 0,
      explain: "Нумерация внутри PARTITION BY позволяет брать «топ-N на группу». Фильтр по оконной функции делают только во внешнем запросе."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие строки помечены для удаления как дубликаты?",
      code: `SELECT id FROM (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM users
) t
WHERE rn > 1;`,
      options: ["Все, кроме первой по id строки для каждого email", "Только строки с минимальным id", "Все строки с повторяющимся email, включая первую"],
      answer: 0,
      explain: "Первой строке группы присваивается номер 1 и она остаётся, остальные дубликаты получают номера больше 1."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает такая вставка?",
      code: `INSERT INTO archive_orders (id, user_id, total)
SELECT id, user_id, total
FROM orders
WHERE created_at < '2025-01-01';`,
      options: ["Копирует подходящие строки в archive_orders", "Переносит строки: из orders они удаляются", "Выдаёт ошибку: INSERT не принимает SELECT"],
      answer: 0,
      explain: "INSERT ... SELECT вставляет результат запроса. Исходные строки остаются, их удаляют отдельным DELETE (в той же транзакции)."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает UPDATE с FROM в PostgreSQL?",
      code: `UPDATE users u
SET last_order_at = o.max_created
FROM (SELECT user_id, MAX(created_at) AS max_created
      FROM orders GROUP BY user_id) o
WHERE o.user_id = u.id;`,
      options: ["Обновляет у пользователей дату последнего заказа по данным из подзапроса", "Создаёт новую таблицу", "Удаляет пользователей без заказов"],
      answer: 0,
      explain: "UPDATE ... FROM позволяет брать значения из другой выборки. Если на одну строку найдётся несколько совпадений, результат неопределён, поэтому подзапрос группируют."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт эта команда?",
      code: `UPDATE orders
SET status = 'paid'
WHERE id = 42
RETURNING id, status;`,
      options: ["Строку с id и новым статусом после обновления", "Ничего: UPDATE не возвращает данные", "Количество строк без значений"],
      answer: 0,
      explain: "RETURNING (в PostgreSQL) возвращает данные изменённых строк, что избавляет от повторного SELECT."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Сколько строк с email = NULL можно вставить при UNIQUE на email в PostgreSQL?",
      code: `-- email text UNIQUE
INSERT INTO users (email) VALUES (NULL), (NULL), (NULL);`,
      options: ["Одну: NULL должен быть уникальным", "Сколько угодно: NULL не равен NULL, поэтому не нарушает уникальность", "Ни одной"],
      answer: 1,
      explain: "UNIQUE сравнивает значения, а NULL не равен ничему, даже другому NULL. В PostgreSQL 15+ это поведение можно изменить через NULLS NOT DISTINCT."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что произойдёт при вставке?",
      code: `-- price numeric CHECK (price >= 0)
INSERT INTO products (name, price) VALUES ('Pen', -5);`,
      options: ["Строка добавится", "Ошибка: нарушено ограничение CHECK", "Цена станет 0"],
      answer: 1,
      explain: "CHECK задаёт условие, которому должна удовлетворять каждая строка. Нарушение вызывает ошибку и отмену операции."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что случится с orders.user_id при удалении пользователя?",
      code: `-- orders.user_id REFERENCES users(id) ON DELETE SET NULL
DELETE FROM users WHERE id = 7;`,
      options: ["Заказы удалятся", "Удаление заблокируется", "user_id у заказов станет NULL"],
      answer: 2,
      explain: "ON DELETE SET NULL обнуляет ссылку у дочерних строк. Колонка при этом должна допускать NULL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос в PostgreSQL?",
      code: `SELECT 0.1::float8 + 0.2::float8 = 0.3::float8 AS eq,
       0.1::numeric + 0.2::numeric = 0.3::numeric AS eq_n;`,
      options: ["true и true", "false и true: float хранит приближённо, numeric — точно", "false и false"],
      answer: 1,
      explain: "Двоичные числа с плавающей точкой неточны для десятичных дробей. Деньги хранят в numeric (decimal) либо в целых минимальных единицах."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Какие пользователи попадут в результат, если у части is_active равен NULL?",
      code: `SELECT * FROM users
WHERE NOT is_active;`,
      options: ["Все, кроме активных, включая NULL", "Только is_active = false: для NULL условие даёт UNKNOWN", "Все пользователи"],
      answer: 1,
      explain: "NOT NULL тоже NULL, а WHERE принимает только TRUE. Чтобы учесть неизвестные значения, нужно IS NOT TRUE или COALESCE."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему число строк разное?",
      code: `-- A: SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- B: SELECT u.* FROM users u JOIN orders o ON o.user_id = u.id;`,
      options: ["Не разное: запросы эквивалентны", "B вернёт пользователя столько раз, сколько у него заказов, а A — по одному разу", "A вернёт больше строк"],
      answer: 1,
      explain: "JOIN по неуникальному ключу размножает строки, а IN проверяет принадлежность и дубликатов не создаёт."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему среднее от дневных средних может отличаться от общего среднего?",
      code: `-- дни: A) 2 заказа по 10, B) 100 заказов по 50
SELECT AVG(daily_avg) FROM daily_stats;`,
      options: ["Не отличается никогда", "Дни имеют разный вес: среднее средних считает дни равными, а общее — взвешено по числу заказов", "Потому что AVG игнорирует дни"],
      answer: 1,
      explain: "Среднее по группам не равно среднему по всем данным, если размеры групп разные. Нужно суммировать значения и делить на общее количество."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что считает этот запрос?",
      code: `SELECT user_id, COUNT(DISTINCT city) AS cities
FROM orders
GROUP BY user_id;`,
      options: ["Число заказов каждого пользователя", "Число различных городов, в которые пользователь делал заказы", "Число пользователей в каждом городе"],
      answer: 1,
      explain: "COUNT(DISTINCT city) считает уникальные города внутри группы. Если все заказы пользователя сделаны в одном городе, результат будет 1."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что случится с результатом, если в условии соединения забыли вторую часть ключа?",
      code: `-- ключ строки: (order_id, line_no)
SELECT *
FROM order_items i
JOIN shipments s ON s.order_id = i.order_id;`,
      options: ["Ничего: достаточно одного поля", "Строки размножатся: каждая позиция заказа сопоставится со всеми отправками этого заказа", "Вернётся пустой результат"],
      answer: 1,
      explain: "Если JOIN выполняется по неполному составному ключу, получается связь «многие ко многим» и дубли. Ключ нужно сопоставлять целиком."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что вернёт запрос, если у части заказов city равен NULL?",
      code: `SELECT COUNT(DISTINCT city) FROM orders;`,
      options: ["Число различных городов, NULL не считается значением", "Число различных городов плюс один за NULL", "NULL"],
      answer: 0,
      explain: "COUNT(колонка) и COUNT(DISTINCT колонка) пропускают NULL. Если нужно учесть неизвестные значения, их подменяют через COALESCE."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Один врач не может принимать двух пациентов в одно время. Как выразить это в модели?",
      options: ["Это невозможно проверить в базе", "Ограничением уникальности (doctor_id, starts_at) для слотов или проверкой пересечения интервалов", "Хранить врача в таблице patients"],
      answer: 1,
      explain: "Правило бизнеса можно защитить на уровне БД: уникальным индексом по слоту или exclusion-ограничением по интервалу. Проверка только в приложении уязвима для гонок."
    },
    {
      topic: "ERD", erd: "clinic", lang: "sql",
      q: "Как посчитать приёмы каждого врача, включая врачей без приёмов?",
      code: `SELECT d.name, COUNT(a.id)
FROM doctors d
???
GROUP BY d.name;`,
      options: ["INNER JOIN appointments a ON a.doctor_id = d.id", "LEFT JOIN appointments a ON a.doctor_id = d.id", "RIGHT JOIN specialties s ON s.id = d.specialty_id"],
      answer: 1,
      explain: "LEFT JOIN сохраняет всех врачей, а COUNT(a.id) для отсутствующих приёмов даёт 0. INNER JOIN их бы потерял."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Зачем специальности вынесены в отдельную таблицу specialties?",
      options: ["Чтобы замедлить запросы", "Справочник исключает опечатки и дубли названий, а изменение названия делается в одном месте", "Это требование стандарта SQL"],
      answer: 1,
      explain: "Нормализация избавляет от повторов текста в doctors. Ссылка по id даёт согласованность и позволяет менять название централизованно."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Как лучше хранить статус приёма (запланирован, состоялся, отменён)?",
      options: ["Произвольным текстом без ограничений", "Справочником или перечислением с CHECK-ограничением допустимых значений", "Числом без описания"],
      answer: 1,
      explain: "Ограничение допустимых значений защищает от опечаток («cancelled» и «canceled»). Набор статусов нужно описать в модели."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Баланс счёта хранить в accounts.balance или вычислять по transactions?",
      options: ["Только вычислять: хранить нельзя", "Оба подхода применяют: хранимый баланс ускоряет чтение, но требует атомарного обновления вместе с записью операции", "Только хранить: операции не нужны"],
      answer: 1,
      explain: "Хранимый остаток быстро читается, но может разойтись с журналом. Поэтому изменение баланса и вставку операции делают в одной транзакции."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Как корректно записать перевод между двумя счетами?",
      options: ["Два независимых запроса без транзакции", "Две записи в transactions (списание и зачисление) и обновление балансов в одной транзакции", "Одна запись без указания второго счёта"],
      answer: 1,
      explain: "Перевод затрагивает два счёта, и частичное выполнение нарушает деньги. Атомарность транзакции обеспечивает либо оба изменения, либо ни одного."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Почему currency хранится в accounts, а не в clients?",
      options: ["Это случайность", "У клиента может быть несколько счетов в разных валютах, валюта — свойство счёта", "Валюта вообще не нужна"],
      answer: 1,
      explain: "Валюта определяет, в каких единицах хранится баланс счёта. У клиента может быть и рублёвый, и долларовый счёт."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Почему в cards хранят pan_hash, а не полный номер карты?",
      options: ["Хэш удобнее читать", "Хранение полного номера повышает риск утечки и требует соблюдения PCI DSS; хэш или токен позволяет искать без раскрытия номера", "Номер карты слишком короткий"],
      answer: 1,
      explain: "Платёжные реквизиты стараются не хранить в открытом виде. Токенизация и хэширование снижают последствия утечки."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Как гарантировать, что пользователь одной организации не увидит данные другой?",
      options: ["Достаточно скрыть кнопки в интерфейсе", "Фильтровать по tenant_id на каждом запросе на уровне данных (и защитить правами/политиками БД)", "Хранить всех в одной общей таблице без идентификатора"],
      answer: 1,
      explain: "Изоляция должна обеспечиваться на сервере, а не в UI. Забытый фильтр по tenant_id — классическая утечка данных между клиентами."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Почему subscriptions хранит started_at и ended_at, а не просто текущий план в tenants?",
      options: ["Для красоты", "Чтобы сохранялась история смены тарифов и можно было узнать, какой план действовал в любой момент", "Это нужно только для users"],
      answer: 1,
      explain: "Хранение интервалов даёт временную историю: счета, отчёты и споры опираются на тариф, действовавший в тот период."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Почему счёт (invoices) привязан к subscription_id, а не к tenant_id?",
      options: ["Это ошибка проектирования", "Счёт выставляется за конкретную подписку и период, а организацию можно найти через подписку", "Счёт не нужен организации"],
      answer: 1,
      explain: "Привязка к подписке сохраняет контекст: какой тариф и какой период оплачены. Клиента при необходимости находят через связь."
    },
    {
      topic: "ERD", erd: "saas", lang: "sql",
      q: "Как найти организации без действующей подписки?",
      code: `SELECT t.id
FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions s
  WHERE s.tenant_id = t.id AND s.ended_at IS NULL
);`,
      options: ["Запрос выберет организации, у которых нет подписки без даты окончания", "Запрос выберет организации с несколькими подписками", "Запрос выберет все подписки"],
      answer: 0,
      explain: "NOT EXISTS исключает организации, для которых нашлась открытая подписка. Условие ended_at IS NULL отражает «действует сейчас»."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Остаток хранится в stock.qty, а движения — в movements. Что важно учитывать?",
      options: ["Ничего: данные не связаны", "Остаток и журнал должны меняться вместе в одной транзакции, иначе они разойдутся", "Достаточно хранить только movements без проверок"],
      answer: 1,
      explain: "Если один и тот же факт записан в двух местах, нужно гарантировать согласованность. Атомарная транзакция или пересчёт по журналу решают проблему."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Почему связь «склады — товары» реализована таблицей stock, а не колонкой в products?",
      options: ["Товар может лежать на многих складах, а склад — хранить много товаров, поэтому нужна таблица связи с количеством", "Так быстрее", "Это нужно только для поставщиков"],
      answer: 0,
      explain: "Связь M:N с собственным атрибутом (qty) требует отдельной таблицы с составным ключом."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "В movements две колонки from_wh и to_wh ссылаются на warehouses. Что это значит?",
      options: ["Две отдельные связи с одной и той же таблицей: склад-источник и склад-получатель", "Ошибка: на таблицу нельзя ссылаться дважды", "Это одна связь M:N"],
      answer: 0,
      explain: "Таблица может иметь несколько внешних ключей на одну родительскую таблицу, у каждого своя роль. Для запросов нужны два соединения с разными псевдонимами."
    },
    {
      topic: "ERD", erd: "inventory", lang: "sql",
      q: "Как найти товары, которых нет на складе 3?",
      code: `SELECT p.id
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM stock s
  WHERE s.product_id = p.id AND s.warehouse_id = 3 AND s.qty > 0
);`,
      options: ["Запрос вернёт товары без положительного остатка на складе 3", "Запрос вернёт склады без товаров", "Запрос вернёт всех поставщиков"],
      answer: 0,
      explain: "NOT EXISTS отбирает товары, для которых нет строки stock с остатком на нужном складе. Так учитываются и товары без строки, и товары с нулём."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Заказ не доставили с первой попытки. Как это отражается в модели?",
      options: ["Нельзя: у заказа только одна доставка", "Связь orders — deliveries 1:N позволяет иметь несколько попыток доставки одного заказа", "Нужно удалить заказ"],
      answer: 1,
      explain: "Если доставки — отдельные строки, то повторная попытка — это ещё одна строка с тем же order_id."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Клиент изменил свой адрес, и теперь старые заказы показывают новый. Что упущено?",
      options: ["Ничего: это правильное поведение", "Заказ должен хранить снимок адреса на момент оформления или ссылаться на неизменяемую запись адреса", "Нужно удалить адреса"],
      answer: 1,
      explain: "История заказов не должна меняться из-за правок справочных данных. Адрес фиксируют копией или делают записи адресов неизменяемыми."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Как показать всех курьеров, включая тех, у кого нет доставок?",
      options: ["couriers LEFT JOIN deliveries", "couriers INNER JOIN deliveries", "deliveries LEFT JOIN couriers"],
      answer: 0,
      explain: "Нужно сохранить все строки couriers, поэтому они стоят слева в LEFT JOIN. INNER JOIN оставил бы только курьеров с доставками."
    },
    {
      topic: "ERD", erd: "social", lang: "sql",
      q: "Как найти пары взаимных подписок (A подписан на B и B на A)?",
      code: `SELECT a.follower_id, a.followee_id
FROM follows a
JOIN follows b
  ON b.follower_id = a.followee_id
 AND b.followee_id = a.follower_id;`,
      options: ["Запрос соединяет follows сама с собой и находит зеркальные пары", "Запрос находит посты без лайков", "Запрос считает подписчиков"],
      answer: 0,
      explain: "Self join по зеркальным колонкам находит строки, где подписка есть в обе стороны. Чтобы убрать дубли пар, добавляют условие a.follower_id < a.followee_id."
    },
    {
      topic: "ERD", erd: "social",
      q: "В posts добавили колонку likes_count. В чём компромисс?",
      options: ["Нет компромисса: хранить счётчик всегда лучше", "Чтение ускоряется, но нужно поддерживать счётчик синхронно с таблицей likes, иначе значения разойдутся", "Запросы станут невозможными"],
      answer: 1,
      explain: "Денормализация экономит агрегацию, но создаёт два источника правды. Обновление счётчика и вставку лайка делают атомарно или пересчитывают."
    },
    {
      topic: "ERD", erd: "social", lang: "sql",
      q: "Как запретить подписку пользователя на самого себя?",
      code: `ALTER TABLE follows
ADD CONSTRAINT no_self_follow CHECK (???);`,
      options: ["follower_id <> followee_id", "follower_id = followee_id", "follower_id IS NULL"],
      answer: 0,
      explain: "Ограничение CHECK проверяет каждую строку. Условие «идентификаторы различаются» исключает самоподписку."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Один товар должен входить в несколько категорий. Как изменить модель?",
      options: ["Добавить в products ещё category_id2", "Заменить связь на M:N через таблицу product_categories", "Хранить категории строкой через запятую"],
      answer: 1,
      explain: "Для множественной принадлежности нужна таблица связи. Списки в одной колонке нарушают нормализацию и усложняют запросы."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Как посчитать выручку по категориям?",
      options: ["order_items → products → categories, суммируя qty × price", "users → orders → categories", "categories → users"],
      answer: 0,
      explain: "Выручка складывается из позиций заказов. Категорию берут через товар, поэтому путь идёт по цепочке order_items → products → categories."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что даёт внешний ключ order_items.order_id?",
      options: ["Позиция не может ссылаться на несуществующий заказ", "Позиции автоматически сортируются", "Заказ нельзя изменить"],
      answer: 0,
      explain: "Внешний ключ обеспечивает ссылочную целостность и не позволяет появляться «осиротевшим» позициям."
    },
    {
      topic: "ERD", erd: "school",
      q: "Студент пересдаёт курс в другом семестре. Что нужно изменить в enrollments?",
      options: ["Ничего", "Включить семестр (или год) в составной ключ либо ввести отдельный id записи", "Удалить колонку grade"],
      answer: 1,
      explain: "Ключ (student_id, course_id) допускает только одну запись. Для нескольких попыток нужен дополнительный элемент ключа или суррогатный id."
    },
    {
      topic: "ERD", erd: "school",
      q: "Как найти средний балл по каждой группе?",
      options: ["Соединить groups → students → enrollments и усреднить grade по группе", "Усреднить courses.title", "Соединить teachers и groups"],
      answer: 0,
      explain: "Оценки лежат в enrollments, а группа — у студента. Агрегат AVG(grade) с GROUP BY группы даёт результат."
    },
    {
      topic: "ERD", erd: "school",
      q: "Нужно хранить расписание занятий. Что логично добавить в модель?",
      options: ["Поле schedule в students", "Сущность lessons со ссылками на курс, преподавателя, время и аудиторию", "Ничего: расписание не относится к данным"],
      answer: 1,
      explain: "Расписание — отдельный объект предметной области со своими атрибутами и связями. Ему нужна собственная таблица."
    },
    {
      topic: "ERD", erd: "library",
      q: "В библиотеке несколько экземпляров одной книги. Как изменить модель?",
      options: ["Дублировать строки в books", "Добавить сущность copies: книга 1—N экземпляров, а выдача ссылается на экземпляр", "Увеличить qty в loans"],
      answer: 1,
      explain: "Книга как произведение и физический экземпляр — разные объекты. Выдача относится к конкретному экземпляру."
    },
    {
      topic: "ERD", erd: "library", lang: "sql",
      q: "Как найти книги, которые сейчас на руках?",
      code: `SELECT b.title
FROM books b
JOIN loans l ON l.book_id = b.id
WHERE l.returned_at IS NULL;`,
      options: ["Запрос вернёт книги с открытой выдачей", "Запрос вернёт все книги", "Запрос вернёт читателей без книг"],
      answer: 0,
      explain: "Открытая выдача — строка loans с пустой датой возврата. Соединение с books даёт названия."
    },
    {
      topic: "ERD", erd: "library",
      q: "Штраф за просрочку лучше хранить или вычислять?",
      options: ["Только хранить", "Вычислять по датам и тарифу; хранить, когда нужно зафиксировать фактически начисленную сумму", "Не нужен никогда"],
      answer: 1,
      explain: "Производные значения лучше вычислять, чтобы не получить рассинхронизацию. Начисленный штраф как финансовый факт фиксируют отдельно."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Сотрудник работает сразу в двух отделах. Что поменять в модели?",
      options: ["Добавить dept_id2", "Заменить связь на M:N через таблицу employee_departments", "Дублировать сотрудника"],
      answer: 1,
      explain: "Связь «много ко многим» требует таблицы связи. Дополнительные колонки не масштабируются."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Нужно знать, какую должность и зарплату сотрудник имел год назад. Что добавить?",
      options: ["Ничего: employees хранит всё", "Таблицу истории назначений с периодами действия", "Колонку old_salary"],
      answer: 1,
      explain: "Перезапись значений теряет прошлое. История ведётся отдельными строками с датами начала и конца."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Как запретить сотруднику быть собственным руководителем?",
      options: ["CHECK (id <> manager_id)", "UNIQUE (manager_id)", "NOT NULL (manager_id)"],
      answer: 0,
      explain: "Простая проверка исключает самоссылку. Циклы большей длины требуют отдельной проверки (триггер или рекурсивный запрос)."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Цена номера за ночь меняется. Где хранить цену, по которой гость оплатил проживание?",
      options: ["Только в rooms: она всегда актуальна", "В bookings (или в строках проживания): цена должна фиксироваться на момент бронирования", "В hotels"],
      answer: 1,
      explain: "Изменение прайса не должно менять уже оформленные брони. Поэтому цена копируется в бронь."
    },
    {
      topic: "ERD", erd: "booking", lang: "sql",
      q: "Как найти свободные номера на даты :from — :to?",
      code: `SELECT r.id
FROM rooms r
WHERE NOT EXISTS (
  SELECT 1 FROM bookings b
  WHERE b.room_id = r.id
    AND b.check_in < :to
    AND b.check_out > :from
);`,
      options: ["Запрос исключает номера, у которых есть бронь, пересекающаяся по датам", "Запрос выбирает номера с любой бронью", "Запрос выбирает гостей"],
      answer: 0,
      explain: "Интервалы пересекаются, если начало одного раньше конца другого и наоборот. NOT EXISTS оставляет номера без таких броней."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Номера бывают одно- и двухместные. Куда добавить вместимость?",
      options: ["В guests", "В rooms (capacity): свойство номера", "В bookings.check_in"],
      answer: 1,
      explain: "Вместимость — характеристика номера. Её хранят в rooms (или в справочнике типов номеров)."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Нужны ответы на комментарии. Как расширить comments?",
      options: ["Добавить колонку parent_id, ссылающуюся на comments.id", "Создать таблицу replies без связи", "Хранить ответы текстом в одной ячейке"],
      answer: 0,
      explain: "Самоссылка по parent_id описывает дерево комментариев. Корневые комментарии имеют NULL в parent_id."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Удалили тег. Что произойдёт со строками post_tags при ON DELETE CASCADE?",
      options: ["Строки связи с этим тегом удалятся, статьи останутся", "Удалятся и статьи", "Ничего"],
      answer: 0,
      explain: "CASCADE распространяется на дочерние строки, то есть на связи post_tags. Статьи — не дочерние для тега и не затрагиваются."
    },
    {
      topic: "ERD", erd: "blog", lang: "sql",
      q: "Как найти статьи без комментариев?",
      code: `SELECT p.id
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE c.id IS NULL;`,
      options: ["Запрос вернёт статьи, к которым нет ни одного комментария", "Запрос вернёт комментарии без статьи", "Запрос вернёт все статьи"],
      answer: 0,
      explain: "LEFT JOIN сохраняет все статьи, а фильтр IS NULL по правой таблице оставляет те, для которых пары не нашлось."
    },
    {
      topic: "BPMN", bpmn: "xor_and_bug",
      q: "Что произойдёт при выполнении этого процесса?",
      options: ["Процесс завершится успешно", "Процесс зависнет на параллельном слиянии: оно ждёт токены с обеих веток, а исключающий шлюз создаёт лишь один", "Обе проверки выполнятся параллельно"],
      answer: 1,
      explain: "XOR-разветвление отправляет токен только по одной ветке, а AND-слияние требует все входящие токены. Это классическая ошибка пары шлюзов — процесс никогда не пойдёт дальше."
    },
    {
      topic: "BPMN", bpmn: "xor_and_bug",
      q: "Как исправить модель?",
      options: ["Заменить параллельное слияние на исключающее", "Добавить ещё одну задачу", "Убрать стартовое событие"],
      answer: 0,
      explain: "Типы шлюзов на разветвлении и слиянии должны соответствовать друг другу. После XOR-разветвления нужно XOR-слияние."
    },
    {
      topic: "BPMN", bpmn: "and_split_xor_join",
      q: "Сколько раз выполнится «Отправить клиенту»?",
      options: ["Один раз", "Дважды: параллельное разветвление создаёт два токена, а исключающее слияние пропускает каждый отдельно", "Ни разу"],
      answer: 1,
      explain: "XOR-слияние не синхронизирует токены. Каждый пришедший токен идёт дальше, поэтому следующая задача выполняется для каждой ветки."
    },
    {
      topic: "BPMN", bpmn: "and_split_xor_join",
      q: "Как исправить, чтобы «Отправить клиенту» выполнилось один раз после обеих веток?",
      options: ["Заменить слияние на параллельное (AND)", "Добавить таймер", "Заменить задачи на подпроцесс"],
      answer: 0,
      explain: "Параллельное слияние дожидается обоих токенов и выпускает один."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Сколько проверок может запуститься в этом процессе?",
      options: ["Строго одна", "Одна или несколько в зависимости от условий на потоках", "Всегда все три"],
      answer: 1,
      explain: "Включающий шлюз проверяет условие каждого исходящего потока и запускает все, для которых оно истинно."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Чего ждёт включающее слияние?",
      options: ["Всех трёх веток всегда", "Только тех веток, которые реально были запущены", "Любой одной ветки"],
      answer: 1,
      explain: "OR-join синхронизируется по активным токенам. Если запущены две ветки, он ждёт две."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Что произойдёт, если ни одно условие не выполнено и нет потока по умолчанию?",
      options: ["Процесс продолжится", "Выполнение остановится с ошибкой: токену некуда идти", "Выберется первая ветка"],
      answer: 1,
      explain: "Для OR и XOR разветвлений рекомендуется поток по умолчанию. Без него ситуация без подходящей ветки — ошибка выполнения."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Что значит подпись «всегда» на ветке проверки кредитной истории?",
      options: ["Условие тождественно истинно: ветка активируется при каждом прохождении шлюза", "Ветка отключена", "Это поток сообщений"],
      answer: 0,
      explain: "Условие «всегда» (true) обеспечивает обязательное выполнение шага независимо от других веток."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Чем шлюз на основе событий отличается от исключающего?",
      options: ["Он выбирает путь по наступившему событию, а не по данным процесса, и сразу отменяет остальные ожидания", "Он запускает все ветки", "Он ничем не отличается"],
      answer: 0,
      explain: "Токен ждёт на нескольких событиях; когда сработало первое, остальные подписки снимаются."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Оплата пришла на четвёртый день. Что произойдёт с моделью как есть?",
      options: ["Заказ отгрузится", "Ветка таймера уже выбрана и заказ отменён; позднее сообщение нужно обработать отдельно (например, возврат)", "Таймер перезапустится"],
      answer: 1,
      explain: "После срабатывания таймера ожидание оплаты отменено. Бизнес-правило для поздних платежей нужно смоделировать явно."
    },
    {
      topic: "BPMN", bpmn: "boundary_int",
      q: "Что происходит с задачей при срабатывании пограничного таймера на этой диаграмме?",
      options: ["Задача прерывается, и токен уходит по ветке эскалации", "Задача продолжает выполняться", "Процесс завершается"],
      answer: 0,
      explain: "Сплошная граница события означает прерывающее (interrupting) событие: задача отменяется."
    },
    {
      topic: "BPMN", bpmn: "boundary_non",
      q: "Чем это пограничное событие отличается от предыдущего?",
      options: ["Пунктирная граница — непрерывающее событие: ветка напоминания стартует, а задача согласования продолжается", "Ничем", "Оно запускает процесс заново"],
      answer: 0,
      explain: "Non-interrupting boundary event создаёт дополнительный токен и не останавливает задачу. Подходит для напоминаний и уведомлений."
    },
    {
      topic: "BPMN", bpmn: "boundary_non",
      q: "Остаётся ли активной задача «Согласовать договор» после напоминания?",
      options: ["Да, остаётся", "Нет, отменяется", "Задача удаляется из процесса"],
      answer: 0,
      explain: "Непрерывающее событие не отменяет исходную активность. Она завершится, когда согласующий закончит работу."
    },
    {
      topic: "BPMN", bpmn: "sub_error",
      q: "Что делает граничное событие «Ошибка» на подпроцессе?",
      options: ["Перехватывает ошибку, возникшую внутри подпроцесса, и направляет токен по ветке обработки", "Запускает подпроцесс", "Отправляет сообщение"],
      answer: 0,
      explain: "Error boundary event прерывает подпроцесс при ошибке и позволяет обработать её в родительском процессе."
    },
    {
      topic: "BPMN", bpmn: "service_error",
      q: "Что означает ветка «Ошибка платежа»?",
      options: ["Для сервисной задачи определена обработка бизнес-ошибки (например, отказ платежа) без сбоя всего процесса", "Задача выполняется дважды", "Ошибка игнорируется"],
      answer: 0,
      explain: "Бизнес-ошибки выделяют в отдельный поток. Это отличает ожидаемые исходы от технических сбоев."
    },
    {
      topic: "BPMN", bpmn: "bank_msg",
      q: "Чем поток сообщений отличается от последовательного?",
      options: ["Он соединяет разных участников и показывает обмен информацией, а токен по нему не идёт", "Он передаёт токен между задачами одного процесса", "Он обозначает ошибку"],
      answer: 0,
      explain: "Последовательные потоки допустимы только внутри одного пула, а между пулами используют потоки сообщений."
    },
    {
      topic: "BPMN", bpmn: "bank_msg",
      q: "Почему у события «Отправить подтверждение» закрашенный конверт?",
      options: ["Это событие-отправитель (throw): процесс отправляет сообщение", "Это событие-приёмник", "Это ошибка"],
      answer: 0,
      explain: "Закрашенный значок — throw, незакрашенный — catch. Банк отправляет, клиент получает."
    },
    {
      topic: "BPMN", bpmn: "bank_msg",
      q: "Что запускает процесс банка?",
      options: ["Сообщение с платежом от клиента (стартовое событие по сообщению)", "Таймер", "Ручной запуск"],
      answer: 0,
      explain: "Стартовое событие с конвертом создаёт экземпляр при получении сообщения."
    },
    {
      topic: "BPMN", bpmn: "pools_msg",
      q: "Что означает конечное событие с закрашенным конвертом у поставщика?",
      options: ["Процесс завершается отправкой сообщения (счёта) покупателю", "Процесс ждёт сообщение", "Процесс завершается ошибкой"],
      answer: 0,
      explain: "Message end event отправляет сообщение при завершении ветки."
    },
    {
      topic: "BPMN", bpmn: "pools_msg",
      q: "Что должен сделать покупатель после отправки заказа?",
      options: ["Сразу оплатить счёт", "Дождаться на промежуточном событии получения счёта и только затем платить", "Завершить процесс"],
      answer: 1,
      explain: "Промежуточное событие-приёмник блокирует токен, пока не придёт сообщение. Оплата невозможна без счёта."
    },
    {
      topic: "BPMN", bpmn: "starts",
      q: "Одновременно пришли два сообщения «Заявка получена». Сколько экземпляров создаст процесс?",
      options: ["Один", "Два: каждое сообщение запускает отдельный экземпляр", "Ни одного"],
      answer: 1,
      explain: "Каждое срабатывание стартового события создаёт новый экземпляр независимо от других."
    },
    {
      topic: "BPMN", bpmn: "terminate",
      q: "Что отличает конец «Оплата не прошла» от обычного конца?",
      options: ["Он завершит все активные ветки экземпляра, а обычный — только свою", "Ничего", "Он перезапускает процесс"],
      answer: 0,
      explain: "Terminate end event немедленно останавливает весь экземпляр процесса."
    },
    {
      topic: "BPMN", bpmn: "multi",
      q: "Сколько раз выполнится «Проверить позицию заказа»?",
      options: ["Один раз", "Столько раз, сколько позиций в заказе, одновременно", "Дважды"],
      answer: 1,
      explain: "Параллельный multi-instance создаёт экземпляр задачи на каждый элемент коллекции."
    },
    {
      topic: "BPMN", bpmn: "multi",
      q: "Когда начнётся «Подтвердить заказ»?",
      options: ["После первой проверенной позиции", "После завершения всех экземпляров проверки", "Одновременно с проверкой"],
      answer: 1,
      explain: "По умолчанию токен идёт дальше, когда завершены все экземпляры. Условие досрочного завершения задают отдельно."
    },
    {
      topic: "BPMN",
      q: "Чем последовательный multi-instance (три горизонтальные линии) отличается от параллельного?",
      options: ["Экземпляры выполняются один за другим, а при параллельном — одновременно", "Ничем", "Последовательный запускает процесс заново"],
      answer: 0,
      explain: "Последовательный режим подходит, когда порядок важен или ресурсов не хватает для одновременной работы."
    },
    {
      topic: "BPMN",
      q: "Чем вызываемая активность (call activity) отличается от встроенного подпроцесса?",
      options: ["Call activity вызывает отдельно определённый процесс, который можно переиспользовать", "Ничем", "Call activity всегда параллельна"],
      answer: 0,
      explain: "Встроенный подпроцесс определён внутри родителя. Вызываемый процесс существует самостоятельно и подключается из многих процессов."
    },
    {
      topic: "BPMN",
      q: "Что такое событийный подпроцесс (event subprocess)?",
      options: ["Подпроцесс, который запускается событием (сообщением, ошибкой, таймером) внутри родительского процесса", "Подпроцесс без задач", "Дорожка"],
      answer: 0,
      explain: "Event subprocess находится внутри процесса и активируется своим стартовым событием. Он может быть прерывающим или непрерывающим."
    },
    {
      topic: "BPMN",
      q: "Что такое компенсация в BPMN?",
      options: ["Откат уже завершённых действий специальными обратными задачами, например возврат платежа", "Увеличение зарплаты", "Повторный запуск процесса"],
      answer: 0,
      explain: "Компенсация применяется там, где обычный откат транзакции невозможен: действие уже выполнено, и его нужно «сторнировать»."
    },
    {
      topic: "BPMN",
      q: "Чем событие-сигнал отличается от события-сообщения?",
      options: ["Сигнал широковещательный: его получают все ожидающие подписчики, а сообщение адресовано конкретному получателю", "Сигнал — ошибка", "Они одинаковы"],
      answer: 0,
      explain: "Сообщение коррелируется с конкретным экземпляром, сигнал рассылается всем, кто на него подписан."
    },
    {
      topic: "BPMN",
      q: "Что запускает условное событие (conditional event)?",
      options: ["Выполнение условия на данных процесса", "Получение письма", "Наступление даты"],
      answer: 0,
      explain: "Conditional event срабатывает, когда логическое выражение становится истинным, например «остаток < минимума»."
    },
    {
      topic: "BPMN",
      q: "Для чего используют соединительные события (link events)?",
      options: ["Чтобы связать разные части одной схемы без длинных линий: как «переход на страницу»", "Для отправки сообщений", "Для создания новых экземпляров"],
      answer: 0,
      explain: "Link throw и catch — пара событий-«порталов» внутри одного процесса. Они улучшают читаемость больших диаграмм."
    },
    {
      topic: "BPMN", bpmn: "rework",
      q: "Что стоит добавить, чтобы цикл доработки не продолжался бесконечно?",
      options: ["Ничего: цикл безопасен", "Ограничение числа попыток, таймер или эскалацию после нескольких возвратов", "Ещё одну дорожку"],
      answer: 1,
      explain: "Бесконечный цикл блокирует процесс. Счётчик попыток или таймер завершают его осмысленным исходом."
    },
    {
      topic: "BPMN", bpmn: "expense",
      q: "Заявка на ровно 10 000. Что не так с подписями потоков?",
      options: ["Всё корректно", "Условия «до 10 000» и «от 10 000» пересекаются на значении 10 000; границы должны быть однозначными", "Нужно убрать шлюз"],
      answer: 1,
      explain: "Условия XOR должны покрывать все значения и не пересекаться. Иначе поведение для границы зависит от порядка проверки."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Зачем здесь использованы дорожки?",
      options: ["Для красоты", "Чтобы показать ответственность ролей за каждый шаг и передачи между ними", "Чтобы ускорить процесс"],
      answer: 1,
      explain: "Дорожки позволяют находить задержки на стыках ролей и обсуждать ответственность."
    },
    {
      topic: "BPMN",
      q: "Когда имеет смысл выделять фрагмент в подпроцесс?",
      options: ["Всегда", "Когда нужно скрыть детали, сгруппировать связанные шаги или переиспользовать их", "Никогда"],
      answer: 1,
      explain: "Подпроцессы уменьшают размер диаграммы и позволяют работать на разных уровнях детализации."
    },
    {
      topic: "BPMN",
      q: "Зачем нужен поток по умолчанию на исключающем шлюзе?",
      options: ["Чтобы токен гарантированно пошёл дальше, даже если ни одно условие не выполнено", "Чтобы отключить шлюз", "Чтобы запустить параллельные ветки"],
      answer: 0,
      explain: "Default flow выбирается, когда остальные условия ложны, исключая «зависание» процесса."
    },
    {
      topic: "BPMN",
      q: "Что такое пул в BPMN-коллаборации?",
      options: ["Участник (организация, система или роль), у которого есть собственный процесс; с другими пулами он общается сообщениями", "Тип шлюза", "Задача"],
      answer: 0,
      explain: "Коллаборация показывает несколько пулов и обмен сообщениями между ними. Последовательные потоки через границу пула не проходят."
    },
    {
      topic: "BPMN",
      q: "Как смоделировать «подождать три рабочих дня»?",
      options: ["Промежуточным событием-таймером с длительностью", "Параллельным шлюзом", "Конечным событием"],
      answer: 0,
      explain: "Timer intermediate event удерживает токен заданное время. Рабочие дни задаются выражением или календарём движка."
    },
    {
      topic: "BPMN",
      q: "Как запустить отчёт каждый понедельник в 9:00?",
      options: ["Стартовое событие-таймер с циклическим расписанием", "Стартовое событие по сообщению", "Задача «Ждать понедельник»"],
      answer: 0,
      explain: "Timer start event поддерживает расписания (cycle). Он создаёт новый экземпляр по расписанию."
    },
    {
      topic: "BPMN",
      q: "Если из XOR выходит несколько потоков с истинными условиями, что произойдёт в большинстве движков?",
      options: ["Выполнятся все", "Выберется первый подходящий поток по порядку определения; условия лучше делать взаимоисключающими", "Процесс остановится"],
      answer: 1,
      explain: "Семантика XOR — один путь. Если условия пересекаются, выбор зависит от порядка и усложняет сопровождение."
    },
    {
      topic: "BPMN",
      q: "Что делает исключающий шлюз на слиянии потоков?",
      options: ["Ждёт все ветки", "Пропускает каждый пришедший токен дальше без синхронизации", "Выбирает путь по условию"],
      answer: 1,
      explain: "XOR-слияние просто сводит альтернативные ветки в один поток."
    },
    {
      topic: "BPMN",
      q: "У задачи два исходящих потока без шлюза. Как это интерпретируется?",
      options: ["Выполнится один путь", "Как неявное параллельное разветвление: запустятся оба потока; лучше использовать явный шлюз", "Ошибка в синтаксисе"],
      answer: 1,
      explain: "Стандарт допускает такой вариант, но явный AND-шлюз повышает читаемость."
    },
    {
      topic: "BPMN",
      q: "У задачи два входящих потока без шлюза. Как это интерпретируется?",
      options: ["Как неявное исключающее слияние: задача выполнится для каждого пришедшего токена", "Как синхронизация всех токенов", "Как ошибка"],
      answer: 0,
      explain: "Без шлюза токены не синхронизируются. Для ожидания обеих ветвей нужен AND-шлюз."
    },
    {
      topic: "BPMN", bpmn: "hire",
      q: "Что будет, если одна из параллельных задач никогда не завершится?",
      options: ["Процесс продолжит без неё", "Слияние будет бесконечно ждать, и процесс не дойдёт до онбординга", "Процесс завершится"],
      answer: 1,
      explain: "AND-join ждёт все токены. Для защиты вводят таймеры или граничные события."
    },
    {
      topic: "BPMN", bpmn: "hire",
      q: "Как защитить процесс от зависания параллельной задачи?",
      options: ["Добавить пограничный таймер с эскалацией", "Добавить ещё один шлюз", "Удалить слияние"],
      answer: 0,
      explain: "Граничный таймер реагирует на задержку и запускает обходной путь или уведомление."
    },
    {
      topic: "BPMN",
      q: "Чем пользовательская задача (user task) отличается от ручной (manual task)?",
      options: ["User task выполняется человеком через систему (форма, список задач), manual task — вне системы без её участия", "Ничем", "Manual task автоматическая"],
      answer: 0,
      explain: "Для ручной задачи система не отслеживает исполнение. Пользовательская задача появляется в списке задач и завершается в системе."
    },
    {
      topic: "BPMN",
      q: "Для чего нужна задача бизнес-правил (business rule task)?",
      options: ["Для вызова набора правил или таблицы решений (например, DMN) и получения результата", "Для отправки письма", "Для старта процесса"],
      answer: 0,
      explain: "Business rule task выносит логику решений из схемы процесса, позволяя бизнесу менять правила без правки диаграммы."
    },
    {
      topic: "BPMN",
      q: "Чем задача отправки (send task) отличается от задачи получения (receive task)?",
      options: ["Send task отправляет сообщение, receive task ждёт его получения", "Ничем", "Receive task — это старт"],
      answer: 0,
      explain: "Обе задачи моделируют обмен сообщениями в виде активности. Аналогичные функции есть у событий-приёмника и отправителя."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Как движок понимает, какому из тысяч экземпляров адресовано сообщение «Оплата получена»?",
      options: ["Выбирает случайный", "По ключу корреляции (например, номер заказа в сообщении и переменной процесса)", "Сообщение получают все экземпляры"],
      answer: 1,
      explain: "Корреляция сопоставляет входящее сообщение с экземпляром по бизнес-ключу. Без неё нельзя безопасно ждать сообщений в нескольких экземплярах."
    },
    {
      topic: "BPMN",
      q: "Что такое переменные процесса?",
      options: ["Данные экземпляра, которые доступны задачам и условиям потоков", "Названия дорожек", "Версии схемы"],
      answer: 0,
      explain: "Условие на потоке XOR («сумма > 10 000») вычисляется по переменным процесса, которые заполняют задачи и входящие сообщения."
    },
    {
      topic: "UC",
      q: "В чём главное различие между include и extend?",
      options: ["Include — обязательное поведение, всегда выполняемое в базовом варианте; extend — необязательное, выполняемое при условии", "Они ничем не отличаются", "Include для актёров, extend для систем"],
      answer: 0,
      explain: "Include выносит общую обязательную часть. Extend добавляет условное поведение без изменения базового варианта использования."
    },
    {
      topic: "UC",
      q: "В какую сторону направлена стрелка extend?",
      options: ["От расширяющего варианта к базовому", "От базового варианта к расширяющему", "Двунаправленная"],
      answer: 0,
      explain: "В UML extend указывает от расширения к расширяемому (базовому). Базовый вариант не знает о расширениях."
    },
    {
      topic: "UC",
      q: "В какую сторону направлена стрелка include?",
      options: ["От базового варианта к включаемому", "От включаемого к базовому", "Она не имеет направления"],
      answer: 0,
      explain: "Базовый вариант использования зависит от включаемого, поэтому стрелка идёт к включаемому."
    },
    {
      topic: "UC",
      q: "Что такое точка расширения (extension point)?",
      options: ["Место в базовом сценарии, где может быть вставлено поведение расширения при выполнении условия", "Новый актёр", "Граница системы"],
      answer: 0,
      explain: "Точки расширения делают extend точным: расширение подключается в конкретном шаге базового сценария."
    },
    {
      topic: "UC",
      q: "Какой критерий выбирать между include и extend для общего шага «Проверить авторизацию»?",
      options: ["Include: шаг обязателен для нескольких вариантов использования", "Extend: он всегда нужен", "Обобщение"],
      answer: 0,
      explain: "Общая обязательная функциональность выносится include. Extend подходит для условных, необязательных дополнений."
    },
    {
      topic: "UC",
      q: "Что такое антипаттерн «функциональная декомпозиция через include»?",
      options: ["Разбиение варианта использования на множество мелких шагов «Ввести логин», «Нажать кнопку» и подключение их include", "Использование актёров-систем", "Использование границы системы"],
      answer: 0,
      explain: "Use case описывает цель пользователя, а не шаги интерфейса. Мелкие include превращают диаграмму в блок-схему."
    },
    {
      topic: "UC",
      q: "Как правильно сформулировать вариант использования?",
      options: ["«Оформить заказ»", "«Нажать кнопку «Купить»»", "«Форма заказа»"],
      answer: 0,
      explain: "Хороший use case выражает цель актёра, а не интерфейсное действие или название экрана."
    },
    {
      topic: "UC",
      q: "Какое название варианта использования плохое?",
      options: ["«Управлять заказами (CRUD)»", "«Оформить заказ»", "«Отменить заказ»"],
      answer: 0,
      explain: "Обобщённые CRUD-формулировки скрывают цели пользователей. Лучше отдельные варианты с содержательными названиями."
    },
    {
      topic: "UC",
      q: "Допустима ли ассоциация между двумя актёрами?",
      options: ["Да, обычное дело", "Нет: связи между актёрами показывают обобщением, а их взаимодействие выходит за границы системы", "Только с extend"],
      answer: 1,
      explain: "Актёры внешние, и диаграмма не моделирует их взаимодействие друг с другом. Допустима только генерализация."
    },
    {
      topic: "UC",
      q: "Допустима ли ассоциация между двумя вариантами использования?",
      options: ["Нет: между use case используют include, extend и обобщение", "Да, любые линии", "Только с помощью актёров"],
      answer: 0,
      explain: "Простую ассоциацию между use case рисовать не принято: она не выражает конкретной семантики."
    },
    {
      topic: "UC",
      q: "Что такое обобщение актёров?",
      options: ["Дочерний актёр наследует все ассоциации родителя и может иметь собственные", "Объединение двух актёров в один", "Включение"],
      answer: 0,
      explain: "Обобщение упрощает диаграмму: общие права рисуют у родителя, а особые — у дочерних ролей."
    },
    {
      topic: "UC",
      q: "Администратор может делать всё, что и пользователь, плюс управлять справочниками. Как показать?",
      options: ["Обобщением: «Администратор» — потомок «Пользователя»", "Дублированием всех ассоциаций", "Include"],
      answer: 0,
      explain: "Наследование роли убирает дублирование и ясно показывает дополнительные полномочия."
    },
    {
      topic: "UC",
      q: "Что такое вторичный (supporting) актёр?",
      options: ["Внешний участник, которого система использует для выполнения сценария, например платёжный шлюз", "Тот, кто инициирует сценарий", "Администратор"],
      answer: 0,
      explain: "Вторичные актёры обычно располагают справа, а основные — слева. Это удобное соглашение для читаемости."
    },
    {
      topic: "UC",
      q: "Почему внешнюю систему показывают актёром, а не вариантом использования?",
      options: ["Она находится вне границы разработки и предоставляет или потребляет сервисы", "Из-за стиля", "Потому что это человек"],
      answer: 0,
      explain: "Всё, что не входит в область проектирования, но взаимодействует с системой, является актёром."
    },
    {
      topic: "UC",
      q: "Что должна содержать спецификация варианта использования кроме диаграммы?",
      options: ["Название, актёры, предусловия, основной сценарий, альтернативы, исключения, постусловия", "Только название", "Код программы"],
      answer: 0,
      explain: "Диаграмма — обзор. Подробности поведения фиксируются в текстовом шаблоне сценария."
    },
    {
      topic: "UC",
      q: "Как выглядит корректная формулировка шага сценария?",
      options: ["«Система проверяет введённые данные»", "«Далее что-то происходит»", "«Вызвать метод validate()»"],
      answer: 0,
      explain: "Шаги пишутся простыми предложениями в активном залоге, без технических подробностей реализации."
    },
    {
      topic: "UC",
      q: "Для чего нужны исключительные потоки (exception flows) в сценарии?",
      options: ["Описать поведение при сбоях и нарушениях условий: «оплата не прошла», «нет связи»", "Описать успешный путь", "Описать актёров"],
      answer: 0,
      explain: "Исключения важны для полноты требований и тестов: они определяют реакцию системы на ошибки."
    },
    {
      topic: "UC",
      q: "Как связаны варианты использования и тесты?",
      options: ["Каждый сценарий (основной, альтернативный, исключительный) порождает тестовые случаи", "Никак", "Тесты пишутся только для классов"],
      answer: 0,
      explain: "Сценарии — основа приёмочного тестирования: покрытие всех потоков показывает покрытие требований."
    },
    {
      topic: "UC",
      q: "Как связаны варианты использования и пользовательские истории?",
      options: ["История — короткая формулировка цели пользователя, а use case — более подробный и структурированный сценарий", "Это одно и то же", "Истории всегда подробнее"],
      answer: 0,
      explain: "Истории легче планировать, а use case лучше описывают сложное взаимодействие. Часто используют оба подхода."
    },
    {
      topic: "UC", uc: "bad_model",
      q: "Что неверно в связи «Пользователь» — «Администратор»?",
      options: ["Ассоциация между актёрами недопустима: нужна генерализация, если один является частным случаем другого", "Всё верно", "Нужен include"],
      answer: 0,
      explain: "Связь актёров рисуют обобщением. Простая линия не имеет определённой семантики."
    },
    {
      topic: "UC", uc: "bad_model",
      q: "Что не так с вариантом использования «База данных»?",
      options: ["Название — существительное, это компонент, а не цель актёра; use case должен описывать действие", "Ничего", "Он слишком длинный"],
      answer: 0,
      explain: "Use case — поведение, видимое пользователю. «База данных» — элемент реализации."
    },
    {
      topic: "UC", uc: "bad_model",
      q: "Что не так с вариантом «Нажать кнопку «Сохранить»»?",
      options: ["Это деталь интерфейса, а не цель; нужен вариант вроде «Сохранить документ»", "Всё верно", "Слишком короткое название"],
      answer: 0,
      explain: "Диаграмма должна оставаться на уровне пользовательских целей, а не отдельных действий в интерфейсе."
    },
    {
      topic: "UC", uc: "shop",
      q: "Можно ли оформить заказ без входа в систему согласно диаграмме?",
      options: ["Нет: «Войти в систему» подключено include", "Да", "Только для администратора"],
      answer: 0,
      explain: "Include означает обязательность включаемого поведения как части базового варианта."
    },
    {
      topic: "UC", uc: "shop",
      q: "Что изменится, если «Применить промокод» превратить из extend в include?",
      options: ["Промокод станет обязательным шагом каждого заказа", "Ничего", "Промокод исчезнет"],
      answer: 0,
      explain: "Include делает поведение обязательным. Для необязательных дополнений нужен extend."
    },
    {
      topic: "UC", uc: "shop",
      q: "Платёжная система связана с «Оплатить заказ», а не с «Оформить заказ». Почему?",
      options: ["Она участвует именно в оплате, которая входит в оформление по include", "Это ошибка", "Из-за границы системы"],
      answer: 0,
      explain: "Ассоциацию рисуют с тем вариантом, в котором актёр реально участвует."
    },
    {
      topic: "UC", uc: "shop",
      q: "Как лучше улучшить диаграмму, если у администратора появятся права менеджера?",
      options: ["Ввести обобщение: «Администратор» — потомок «Менеджера»", "Дублировать все связи", "Удалить менеджера"],
      answer: 0,
      explain: "Генерализация ролей упрощает диаграмму и показывает расширение прав."
    },
    {
      topic: "UC", uc: "atm",
      q: "Почему «Ввести PIN-код» подключён к двум вариантам использования?",
      options: ["Чтобы не дублировать общий обязательный фрагмент", "Это ошибка", "Из-за extend"],
      answer: 0,
      explain: "Общее поведение, нужное нескольким use case, выделяют и подключают include."
    },
    {
      topic: "UC", uc: "atm",
      q: "Что произойдёт, если клиент не захочет чек?",
      options: ["Снятие наличных всё равно выполнится: чек — extend, а не обязательная часть", "Снять наличные нельзя", "Банк заблокирует карту"],
      answer: 0,
      explain: "Extend выполняется только по условию. Без чека основной вариант использования завершается успешно."
    },
    {
      topic: "UC", uc: "atm",
      q: "С каким вариантом использования связан актёр «Банк» и зачем?",
      options: ["С «Ввести PIN-код» и «Проверить баланс»: банк подтверждает PIN и предоставляет остаток", "Только с печатью чека", "С границей системы"],
      answer: 0,
      explain: "Банк — вторичный актёр, который помогает выполнять сценарии проверки данных клиента."
    },
    {
      topic: "UC", uc: "library",
      q: "Что означает связь «Оплатить штраф» extend «Вернуть книгу»?",
      options: ["Оплата требуется только при просрочке; без неё возврат всё равно возможен", "Штраф платят всегда", "Штраф — актёр"],
      answer: 0,
      explain: "Расширение описывает дополнительный сценарий с условием, например «книга просрочена»."
    },
    {
      topic: "UC", uc: "library",
      q: "Как изменить диаграмму, если в библиотеке появятся студенты со специальными правами?",
      options: ["Добавить актёра «Студент» как потомка «Читателя»", "Удалить читателя", "Сделать студентов вариантом использования"],
      answer: 0,
      explain: "Обобщение отражает «студент — частный случай читателя» с дополнительными возможностями."
    },
    {
      topic: "UC", uc: "library",
      q: "Почему «Проверить билет» выполняет и библиотекарь?",
      options: ["Он тоже связан ассоциацией с этим вариантом использования и участвует в нём", "Это ошибка", "Это include"],
      answer: 0,
      explain: "У варианта использования может быть несколько актёров. Здесь и читатель, и библиотекарь участвуют в проверке."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Что будет, если убрать «Выбрать даты» из «Забронировать номер»?",
      options: ["Бронь потеряет обязательный шаг: перестанет быть полной", "Ничего", "Появится новый актёр"],
      answer: 0,
      explain: "Включаемые варианты — часть базового. Удаление меняет полноту сценария."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Администратор отеля связан с «Выставить счёт». Какую роль играет платёжная система?",
      options: ["Вторичный актёр, обрабатывающий платёж", "Основной актёр", "Вариант использования"],
      answer: 0,
      explain: "Система участвует в сценарии, но не инициирует его."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Почему «Отменить бронь» не подключён к «Забронировать номер»?",
      options: ["Это самостоятельная цель гостя, а не часть бронирования", "Из-за ошибки", "Это extend"],
      answer: 0,
      explain: "Варианты использования, достигающие разных целей, остаются независимыми, даже если связаны по смыслу."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Зачем пациент связан и с «Записаться на приём», и с «Отменить запись»?",
      options: ["Это две разные цели пациента", "Ошибка", "Одна цель"],
      answer: 0,
      explain: "Каждая цель актёра оформляется отдельным вариантом использования."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Должен ли регистратор мочь записывать пациентов на приём согласно диаграмме?",
      options: ["Нет: он связан только с «Зарегистрировать пациента»; нужно уточнить и добавить ассоциацию", "Да", "Только врач"],
      answer: 0,
      explain: "Диаграмма — отправная точка обсуждения. Если по смыслу регистратор записывает на приём, связь нужно добавить."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Можно ли провести приём без рецепта?",
      options: ["Да: рецепт — расширение", "Нет", "Только для регистратора"],
      answer: 0,
      explain: "Extend обозначает необязательное поведение."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "Что означает связь «Оценить качество» extend «Закрыть обращение»?",
      options: ["После закрытия клиент может оценить обслуживание, но не обязан", "Оценка обязательна", "Закрытие — часть оценки"],
      answer: 0,
      explain: "Расширение подключается по условию: клиент решил оставить оценку."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "Почему «Назначить оператора» связан с руководителем, а не с клиентом?",
      options: ["Это действие внутренней организации, и клиент в нём не участвует", "Клиент не человек", "Ошибка"],
      answer: 0,
      explain: "Ассоциации отражают реальных участников сценария."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "У клиента нет доступа к «Обработать обращение», но он видит статус. Какой вариант использования это покрывает?",
      options: ["«Отследить статус»", "«Назначить оператора»", "«Закрыть обращение»"],
      answer: 0,
      explain: "Клиенту доступны создание, отслеживание статуса и оценка качества."
    },
    {
      topic: "UC", uc: "delivery",
      q: "Что показывает extend «Сообщить о задержке» → «Доставить заказ»?",
      options: ["Курьер сообщает о задержке только если она возникла", "Каждая доставка задерживается", "Задержка — актёр"],
      answer: 0,
      explain: "Условное поведение при отклонении от нормального хода выражают расширением."
    },
    {
      topic: "UC", uc: "delivery",
      q: "Зачем «Рассчитать стоимость» включён в «Оформить доставку»?",
      options: ["Расчёт обязателен для любого оформления", "Расчёт необязателен", "Из-за ошибки"],
      answer: 0,
      explain: "Стоимость нужна, чтобы оформить доставку, поэтому поведение подключено include."
    },
    {
      topic: "UC", uc: "delivery",
      q: "Кто выполняет «Назначить курьера»?",
      options: ["Диспетчер", "Клиент", "Курьер"],
      answer: 0,
      explain: "Назначение — действие диспетчера."
    },
    {
      topic: "UC", uc: "elearn",
      q: "Как читается «Оплатить курс» extend «Записаться на курс»?",
      options: ["Оплата требуется только для платных курсов", "Оплата всегда обязательна", "Запись — часть оплаты"],
      answer: 0,
      explain: "Расширение срабатывает по условию: курс платный."
    },
    {
      topic: "UC", uc: "elearn",
      q: "«Проверить работы» включает «Выставить оценку». Что это значит?",
      options: ["Проверка всегда завершается выставлением оценки", "Оценка необязательна", "Оценка — отдельный актёр"],
      answer: 0,
      explain: "Include делает оценку обязательной частью проверки."
    },
    {
      topic: "UC", uc: "elearn",
      q: "Кого логично сделать актёром, если платформа отправляет сертификаты через внешний почтовый сервис?",
      options: ["Почтовый сервис как внешнюю систему-актёра", "Вариант использования", "Студента"],
      answer: 0,
      explain: "Внешняя система вне границы разработки является актёром независимо от того, человек это или программа."
    },
    {
      topic: "UC",
      q: "Как показать, что платёжный шлюз вызывается системой, а не пользователем?",
      options: ["Ассоциация шлюза-актёра с вариантом «Оплатить заказ»; сценарий описывает, что система обращается к нему", "Стрелка от системы к шлюзу", "Нельзя показать"],
      answer: 0,
      explain: "Диаграмма не отражает направления вызовов, а лишь участие. Детали описывают в сценарии."
    },
    {
      topic: "UC",
      q: "Что такое обобщение вариантов использования?",
      options: ["Дочерний вариант уточняет общий: наследует его поведение и добавляет или переопределяет часть", "Включение", "Расширение"],
      answer: 0,
      explain: "Например, «Оплатить картой» специализирует «Оплатить заказ»."
    },
    {
      topic: "UC",
      q: "Когда стоит использовать обобщение вместо extend?",
      options: ["Когда дочерний вариант — альтернативный способ достижения той же цели, а не необязательное дополнение", "Всегда", "Никогда"],
      answer: 0,
      explain: "Способы оплаты — специализации, а применение промокода — необязательное расширение."
    },
    {
      topic: "SEQ",
      q: "Что означает фрагмент «ref» в диаграмме последовательности?",
      options: ["Ссылка на другую диаграмму взаимодействия (interaction use): подробности вынесены отдельно", "Ошибка", "Условие цикла"],
      answer: 0,
      explain: "ref позволяет переиспользовать общие взаимодействия, например «Аутентификация», и не загромождать основную диаграмму."
    },
    {
      topic: "SEQ",
      q: "Для чего используют фрагмент «break»?",
      options: ["Для прерывания окружающего фрагмента (например, цикла) при выполнении условия", "Для остановки системы", "Для создания объекта"],
      answer: 0,
      explain: "Break выполняется вместо оставшейся части внешнего фрагмента. Типичный пример — выход из цикла повторных попыток при успехе."
    },
    {
      topic: "SEQ",
      q: "Что означает фрагмент «critical»?",
      options: ["Критическая область: операнды выполняются атомарно, без вмешательства других взаимодействий", "Критическая ошибка", "Повтор"],
      answer: 0,
      explain: "Critical защищает участок от перемешивания с параллельными действиями, подобно блокировке."
    },
    {
      topic: "SEQ",
      q: "Чем фрагмент alt отличается от opt?",
      options: ["alt выбирает одну из нескольких веток, opt — выполнить блок или пропустить его", "Ничем", "opt — цикл"],
      answer: 0,
      explain: "alt ≈ if / else if / else, opt ≈ if без else."
    },
    {
      topic: "SEQ",
      q: "Что означает условие в квадратных скобках у операнда?",
      options: ["Сторожевое условие (guard): ветка выполняется, если оно истинно", "Комментарий", "Название сообщения"],
      answer: 0,
      explain: "Guard определяет, в каких случаях выполняется операнд. Для else-ветки используют условие «иначе»."
    },
    {
      topic: "SEQ",
      q: "Что означает фрагмент «loop(3)»?",
      options: ["Повтор содержимого три раза", "Максимум три участника", "Три секунды"],
      answer: 0,
      explain: "В скобках можно указать число повторений или границы (min, max), а также условие."
    },
    {
      topic: "SEQ",
      q: "Как показать, что порядок двух параллельных операндов неважен?",
      options: ["Использовать фрагмент par: порядок между операндами не определён", "Использовать alt", "Использовать loop"],
      answer: 0,
      explain: "Par допускает любое перемежение сообщений разных операндов при сохранении порядка внутри каждого."
    },
    {
      topic: "SEQ",
      q: "Что такое слабое упорядочение (weak sequencing) в UML?",
      options: ["Порядок сообщений гарантируется только на одной линии жизни, а между разными линиями он не обязан сохраняться", "Любой порядок допустим", "Строгий порядок по времени для всех"],
      answer: 0,
      explain: "По умолчанию сообщения упорядочены вдоль каждой линии жизни. Между разными участниками порядок может различаться."
    },
    {
      topic: "SEQ",
      q: "Что означает потерянное сообщение (lost message)?",
      options: ["Сообщение, у которого известен отправитель, но получатель неизвестен или не принимает его", "Ошибка в диаграмме", "Сообщение без текста"],
      answer: 0,
      explain: "Lost message изображают стрелкой, заканчивающейся чёрной точкой. Оно используется, чтобы показать потерю или неизвестного получателя."
    },
    {
      topic: "SEQ",
      q: "Что означает найденное сообщение (found message)?",
      options: ["Сообщение с неизвестным отправителем: стрелка начинается с чёрной точки", "Сообщение найдено в логах", "Сообщение к актёру"],
      answer: 0,
      explain: "Found message показывает вход события в диаграмму от источника вне рассматриваемого контекста."
    },
    {
      topic: "SEQ",
      q: "Что такое вложенная активация?",
      options: ["Новый вызов внутри уже активного участника: полоса сдвигается вправо", "Ошибка", "Параллельная ветка"],
      answer: 0,
      explain: "Рекурсия и вложенные вызовы создают наслоение полос активации на одной линии жизни."
    },
    {
      topic: "SEQ",
      q: "Как показать рекурсивный вызов на диаграмме?",
      options: ["Сообщением участника самому себе с новой вложенной активацией", "Циклом loop", "Нельзя показать"],
      answer: 0,
      explain: "Сообщение самому себе с вложением активации отражает рекурсию, а условие остановки показывают фрагментом."
    },
    {
      topic: "SEQ",
      q: "Что произойдёт с отправителем при синхронном вызове, если получатель завис?",
      options: ["Отправитель блокируется, пока не получит ответ или не истечёт таймаут", "Он продолжит работу", "Сообщение пропадёт"],
      answer: 0,
      explain: "Блокировка — главный риск синхронных вызовов в цепочках, поэтому нужны таймауты."
    },
    {
      topic: "SEQ",
      q: "Почему цепочки синхронных вызовов между сервисами опасны?",
      options: ["Задержка и отказ одного сервиса передаются вверх по цепочке и могут вызвать каскадный сбой", "Они слишком короткие", "Они запрещены"],
      answer: 0,
      explain: "Каждый уровень ожидает нижний. Нужны таймауты, выключатели (circuit breaker) и асинхронность там, где возможно."
    },
    {
      topic: "SEQ",
      q: "Когда уместно использовать асинхронное сообщение вместо синхронного?",
      options: ["Когда отправителю не нужен немедленный результат, а получатель может обработать событие позже", "Всегда", "Никогда"],
      answer: 0,
      explain: "Асинхронность повышает развязку и отказоустойчивость, но усложняет согласованность и отладку."
    },
    {
      topic: "SEQ",
      q: "Что означает пунктирная стрелка с подписью «create»?",
      options: ["Создание нового участника в момент сообщения", "Удаление участника", "Возврат значения"],
      answer: 0,
      explain: "Сообщение создания указывает на заголовок нового участника, линия жизни которого начинается ниже."
    },
    {
      topic: "SEQ",
      q: "Что такое диаграмма коммуникации и чем она отличается?",
      options: ["Тот же вид взаимодействия, но акцент на связях между участниками, а порядок показывают номерами", "То же самое", "Диаграмма состояний"],
      answer: 0,
      explain: "Последовательность подчёркивает время, коммуникация — структуру связей. Содержимое семантически эквивалентно."
    },
    {
      topic: "SEQ",
      q: "Можно ли показать условия и ветвления в одной диаграмме последовательности?",
      options: ["Да, с помощью комбинированных фрагментов alt, opt, loop, par", "Нет, только отдельными диаграммами", "Только цветами"],
      answer: 0,
      explain: "Фрагменты дают управление потоком, но при большом числе ветвлений лучше разбить диаграмму."
    },
    {
      topic: "SEQ",
      q: "Что стоит делать, если диаграмма стала слишком большой?",
      options: ["Разбить на несколько диаграмм и использовать ref для повторяющихся частей", "Уменьшить шрифт", "Добавить больше участников"],
      answer: 0,
      explain: "Читаемость важнее полноты. Диаграмма должна умещаться на одной странице и описывать один сценарий."
    },
    {
      topic: "SEQ",
      q: "Нужно ли показывать все ответы (return) на диаграмме?",
      options: ["Не обязательно: их опускают, если они очевидны, и показывают, когда возвращаемые данные важны", "Обязательно", "Нельзя"],
      answer: 0,
      explain: "Ответы нужны, когда результат влияет на ветвление или передаётся дальше."
    },
    {
      topic: "SEQ",
      q: "Как показать, что участник — внешняя система?",
      options: ["Отдельная линия жизни с названием системы (при необходимости стереотип «external»)", "Не показывать", "Актёром всегда"],
      answer: 0,
      explain: "Участником может быть любая система. Актёром чаще называют внешнюю инициирующую роль."
    },
    {
      topic: "SEQ",
      q: "Как отразить время ожидания или таймаут на диаграмме?",
      options: ["Ограничением длительности рядом с сообщением (например, {≤ 3 с}) или заметкой", "Нельзя", "Только в тексте"],
      answer: 0,
      explain: "UML допускает временные ограничения на сообщения и интервалы."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Что произойдёт после проверки пароля сервисом входа в случае успеха?",
      options: ["Сервис вернёт токен интерфейсу", "Сервис вернёт ошибку", "Интерфейс обратится к базе данных"],
      answer: 0,
      explain: "В первом операнде alt сервис отвечает токеном."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Почему сообщение к базе данных находится вне фрагмента alt?",
      options: ["Поиск пользователя выполняется всегда, а ветвление зависит от результата проверки пароля", "Это ошибка", "База вызывается только при успехе"],
      answer: 0,
      explain: "Ветки alt начинаются после получения данных пользователя."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Что нужно изменить, если после трёх неверных паролей требуется блокировка?",
      options: ["Добавить в ветку «пароль неверный» условие или фрагмент для блокировки (например, opt: попыток ≥ 3 → заблокировать)", "Ничего", "Убрать alt"],
      answer: 0,
      explain: "Дополнительное поведение моделируют вложенным opt или отдельной веткой alt."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Почему активации у платёжного сервиса короче, чем у магазина?",
      options: ["Платёжный сервис работает только на время вызова, а магазин ведёт весь сценарий", "Это ошибка", "Из-за цвета"],
      answer: 0,
      explain: "Полоса активации охватывает время обработки вызова. Магазин активен на протяжении всего заказа."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Что нужно изменить, чтобы после отказа в оплате магазин предлагал другой способ оплаты?",
      options: ["Добавить в ветку «оплата отклонена» opt или цикл с повторной оплатой", "Ничего", "Удалить склад"],
      answer: 0,
      explain: "Новые варианты поведения моделируют вложенными фрагментами внутри соответствующего операнда."
    },
    {
      topic: "SEQ", seq: "order",
      q: "Что произойдёт на диаграмме, если убрать ответ «результат оплаты»?",
      options: ["Ветвление alt окажется непонятным: неясно, откуда магазин узнаёт исход оплаты", "Ничего", "Склад не вызовется"],
      answer: 0,
      explain: "Ответ с результатом — основание для условия. Его нельзя опускать, если от него зависит ветвление."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Почему «выдать наличные» показано сообщением самому себе?",
      options: ["Это внутреннее действие банкомата (управление купюроприёмником), а не взаимодействие с другим участником", "Это ошибка", "Это вызов банка"],
      answer: 0,
      explain: "Self-message отражает шаг внутри участника, который важен для сценария."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Что будет, если клиент не запросил чек?",
      options: ["Фрагмент opt пропускается, и банкомат сразу возвращает карту и наличные", "Сценарий прервётся", "Выдача наличных не состоится"],
      answer: 0,
      explain: "Если условие opt ложно, вложенные сообщения не выполняются."
    },
    {
      topic: "SEQ", seq: "atm",
      q: "Какое поведение стоит добавить, чтобы смоделировать неверный PIN?",
      options: ["Обернуть шаг после проверки в alt: «PIN верный» / «PIN неверный» и добавить сообщение об ошибке", "Ничего", "Добавить участника «Чек»"],
      answer: 0,
      explain: "Диаграмма показывает только успешный путь, а ветвление добавляет неудачный исход."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Что произойдёт с отправителем после публикации «OrderCreated»?",
      options: ["Он продолжит работу, не дожидаясь обработки сообщения складом", "Он будет ждать склад", "Он завершится"],
      answer: 0,
      explain: "Асинхронное сообщение не блокирует отправителя."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Какая проблема возможна, если сервис склада обработает событие дважды?",
      options: ["Дублирующее резервирование: нужна идемпотентность или дедупликация по идентификатору события", "Никакой", "Брокер упадёт"],
      answer: 0,
      explain: "Брокеры часто гарантируют доставку минимум один раз, и повторы возможны. Обработчик должен справляться с дубликатами."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Что даёт брокер сообщений по сравнению с прямым вызовом склада?",
      options: ["Развязку по времени и нагрузке: заказы принимаются, даже если склад временно недоступен", "Ничего", "Ускорение любого вызова"],
      answer: 0,
      explain: "Очередь буферизует сообщения и сглаживает пики. Платой становится отложенная согласованность."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Какой недостаток у такого опроса статуса?",
      options: ["Лишние запросы и задержка между готовностью и обнаружением; альтернативы — вебхук или длинный опрос", "Нет недостатков", "Невозможно реализовать"],
      answer: 0,
      explain: "Polling просто реализовать, но он создаёт нагрузку. Для событий лучше уведомления."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Что нужно добавить в loop, чтобы клиент не опрашивал бесконечно?",
      options: ["Ограничение числа попыток или времени и обработку таймаута", "Ничего", "Ещё одного участника"],
      answer: 0,
      explain: "Loop должен иметь условие выхода и верхнюю границу (например, loop(1,20))."
    },
    {
      topic: "SEQ", seq: "create_destroy",
      q: "Почему сессия нарисована ниже контроллера?",
      options: ["Потому что она создаётся в ходе сценария", "Ошибка", "Из-за размера"],
      answer: 0,
      explain: "Позиция заголовка показывает момент создания."
    },
    {
      topic: "SEQ", seq: "create_destroy",
      q: "Что произойдёт, если вызвать «process()» после «destroy»?",
      options: ["Это нарушение модели: объект уже не существует, сообщение к нему недопустимо", "Ничего", "Объект воссоздаётся"],
      answer: 0,
      explain: "После уничтожения участник не может получать сообщения."
    },
    {
      topic: "SEQ", seq: "parallel",
      q: "Что означают два операнда par без условий?",
      options: ["Запросы к каталогу и отзывам могут выполняться одновременно", "Они выполняются строго по порядку", "Выполнится только один"],
      answer: 0,
      explain: "Параллельные операнды независимы, поэтому поиск не ждёт одного, чтобы начать другой."
    },
    {
      topic: "SEQ", seq: "parallel",
      q: "Когда сервис поиска отправит результаты клиенту?",
      options: ["После завершения обоих параллельных операндов", "Сразу после первого ответа", "До запросов"],
      answer: 0,
      explain: "Выход из par происходит, когда завершены все операнды: сообщение клиенту следует после фрагмента."
    },
    {
      topic: "SEQ", seq: "parallel",
      q: "Какую проблему решает параллельный запрос к двум источникам?",
      options: ["Сокращает общее время ответа до самого медленного вместо суммы времён", "Увеличивает время", "Не влияет"],
      answer: 0,
      explain: "При параллельном выполнении общая задержка определяется самой долгой веткой."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Какую функцию выполняет шлюз на этой диаграмме?",
      options: ["Единая точка входа: проверка токена и маршрутизация запросов к сервисам", "Хранение заказов", "Выдача токенов"],
      answer: 0,
      explain: "API-шлюз обрабатывает сквозные задачи — аутентификацию, лимиты, маршрутизацию."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Что стоит добавить, если проверка токена каждый раз вызывает сервис авторизации и замедляет запросы?",
      options: ["Локальную проверку подписи токена или кэш результатов с коротким временем жизни", "Ничего", "Удалить шлюз"],
      answer: 0,
      explain: "Кэширование и локальная проверка JWT снижают нагрузку на сервис авторизации."
    },
    {
      topic: "SEQ", seq: "retry",
      q: "Что означает рамка loop с условием «не более 3 попыток»?",
      options: ["Клиент повторяет запрос не больше трёх раз", "Клиент повторяет бесконечно", "Клиент не повторяет"],
      answer: 0,
      explain: "Ограничение числа повторов защищает сервис и клиента от лавины запросов."
    },
    {
      topic: "SEQ", seq: "retry",
      q: "Чего не хватает на диаграмме, чтобы выйти из цикла при успехе?",
      options: ["Фрагмента break или условия выхода: при ответе 200 повторы должны прекращаться", "Ничего", "Ещё одного участника"],
      answer: 0,
      explain: "Break завершает цикл при успешном ответе. Без него по диаграмме повторы продолжались бы."
    },
    {
      topic: "SEQ", seq: "saga",
      q: "Что делает заказ, если на складе нет остатка?",
      options: ["Вызывает компенсацию: возврат платежа", "Ждёт появления товара", "Игнорирует ошибку"],
      answer: 0,
      explain: "Платёж уже выполнен, поэтому его нужно отменить: это компенсирующее действие саги."
    },
    {
      topic: "SEQ", seq: "saga",
      q: "Почему нельзя просто «откатить» платёж транзакцией БД?",
      options: ["Платёж и склад — разные сервисы, общей транзакции нет; применяют компенсации", "Можно", "Склад не поддерживает откат"],
      answer: 0,
      explain: "Распределённые операции без общей транзакции откатывают явными компенсирующими шагами."
    },
    {
      topic: "SEQ", seq: "notify",
      q: "Почему отправка письма — асинхронное сообщение?",
      options: ["Завершение заказа не должно зависеть от результата отправки уведомления", "Это ошибка", "Почтовый сервис быстрый"],
      answer: 0,
      explain: "Побочные действия, не влияющие на исход, отправляют асинхронно. Ошибка почты не должна ломать заказ."
    },
    {
      topic: "SEQ", seq: "notify",
      q: "Что означает opt с условием «клиент подписан на уведомления»?",
      options: ["Письмо отправляется только при подписке", "Письмо отправляется всегда", "Подписка создаётся"],
      answer: 0,
      explain: "Opt выполняется, если условие истинно. Иначе сообщений внутри не будет."
    },
    {
      topic: "SEQ", seq: "login",
      q: "Как показать на диаграмме, что сервис входа и база данных могут отвечать долго?",
      options: ["Добавить временное ограничение на сообщение или заметку о таймауте и ветку обработки таймаута", "Ничего: время не отражается", "Увеличить стрелку"],
      answer: 0,
      explain: "UML допускает ограничения длительности. Ветка обработки таймаута делает модель полнее."
    },
    {
      topic: "STATE", state: "comp_order",
      q: "Что означает переход «отмена» от границы составного состояния «Обработка заказа» к «Отменён»?",
      options: ["Отмена возможна из любого подсостояния внутри: ожидание оплаты и сборки", "Только из «Сборка»", "Только из «Ожидание оплаты»"],
      answer: 0,
      explain: "Переход от границы рамки применяется ко всем вложенным состояниям. Это экономит дублирующие стрелки."
    },
    {
      topic: "STATE", state: "comp_order",
      q: "Что произойдёт, если заказ находится в «Сборка» и приходит событие «отмена»?",
      options: ["Заказ покинет составное состояние и перейдёт в «Отменён»", "Событие будет проигнорировано", "Заказ вернётся в «Ожидание оплаты»"],
      answer: 0,
      explain: "Общий переход составного состояния срабатывает независимо от подсостояния."
    },
    {
      topic: "STATE", state: "comp_order",
      q: "Как заказ попадает в «Отправлен»?",
      options: ["Из подсостояния «Сборка» по событию «собран»", "Из «Ожидание оплаты»", "Из «Отменён»"],
      answer: 0,
      explain: "Выход из составного состояния в «Отправлен» исходит из «Сборка»."
    },
    {
      topic: "STATE", state: "history",
      q: "Принтер печатает и происходит «сбой». Куда он вернётся после «сбой устранён»?",
      options: ["В последнее активное подсостояние, то есть «Печать»: переход ведёт к историческому псевдосостоянию H", "Всегда в «Ожидание»", "В «Ошибка»"],
      answer: 0,
      explain: "История запоминает последнее подсостояние составного состояния и восстанавливает его при возврате."
    },
    {
      topic: "STATE", state: "history",
      q: "Чем возврат через H отличается от возврата в границу составного состояния?",
      options: ["Через границу вход происходит в начальное подсостояние, а через H — в последнее активное", "Ничем", "Через H вход невозможен"],
      answer: 0,
      explain: "Без истории составное состояние начинает с начального подсостояния."
    },
    {
      topic: "STATE", state: "history",
      q: "Что означает переход «сбой» от границы «Работает» к «Ошибка»?",
      options: ["Из любого подсостояния работы принтер может перейти в ошибку", "Только из «Печать»", "Только из «Ожидание»"],
      answer: 0,
      explain: "Переход от рамки применяется ко всем подсостояниям, включая «Ожидание» и «Печать»."
    },
    {
      topic: "STATE", state: "credit",
      q: "Что представляет собой ромб на диаграмме кредита?",
      options: ["Псевдосостояние выбора: по сумме выбирается одна из трёх веток", "Составное состояние", "Конечное состояние"],
      answer: 0,
      explain: "Ромб (choice) вычисляет условия при прохождении и направляет объект по одному из выходов."
    },
    {
      topic: "STATE", state: "credit",
      q: "Что произойдёт при сумме 500 000?",
      options: ["Заявка перейдёт в «Ручная проверка»", "В «Одобрено автоматически»", "В «Отказано»"],
      answer: 0,
      explain: "Условие 100 000 < сумма ≤ 1 000 000 выполняется для 500 000."
    },
    {
      topic: "STATE", state: "credit",
      q: "Что нужно обеспечить в условиях выхода из ромба выбора?",
      options: ["Чтобы условия не пересекались и покрывали все значения, иначе поведение неопределённо или процесс застрянет", "Ничего", "Чтобы условий было много"],
      answer: 0,
      explain: "Для детерминированной модели ветки должны быть взаимоисключающими и полными (можно добавить ветку [else])."
    },
    {
      topic: "STATE", state: "fork_join",
      q: "Что делает жирная вертикальная линия после «Заявка принята»?",
      options: ["Запускает две параллельные проверки одновременно (fork)", "Выбирает одну проверку", "Завершает заявку"],
      answer: 0,
      explain: "Fork создаёт параллельные потоки: проверки документов и платежа выполняются одновременно."
    },
    {
      topic: "STATE", state: "fork_join",
      q: "Когда заявка перейдёт в «Готово к выдаче»?",
      options: ["Когда завершены обе проверки: join ждёт все входящие потоки", "После первой завершённой", "Сразу"],
      answer: 0,
      explain: "Join синхронизирует параллельные ветви: выход происходит, когда все входящие потоки завершены."
    },
    {
      topic: "STATE", state: "fork_join",
      q: "Что произойдёт, если проверка платежа не завершится?",
      options: ["Заявка не покинет join и не дойдёт до «Готово к выдаче»", "Заявка завершится", "Проверка документов откатится"],
      answer: 0,
      explain: "Без завершения всех ветвей join не срабатывает. Поэтому добавляют таймауты или альтернативные переходы."
    },
    {
      topic: "STATE", state: "conn",
      q: "В каком порядке выполняются действия при переходе «Подключено» → «Отключено» по disconnect()?",
      options: ["Сначала exit-действие «закрыть сокет», затем действие перехода (если есть), затем entry нового состояния", "Сначала entry нового", "Порядок не определён"],
      answer: 0,
      explain: "Порядок в UML: exit исходного состояния → действие перехода → entry целевого."
    },
    {
      topic: "STATE", state: "conn",
      q: "Что означает «do / отправлять heartbeat» в состоянии «Подключено»?",
      options: ["Длительная активность выполняется всё время пребывания в состоянии и прерывается при выходе", "Однократное действие при входе", "Действие при выходе"],
      answer: 0,
      explain: "Do-активность (do activity) длится, пока объект находится в состоянии."
    },
    {
      topic: "STATE", state: "conn",
      q: "Что происходит с активностью «отправлять heartbeat» при событии «таймаут»?",
      options: ["Она прерывается при выходе из состояния, затем выполняется exit", "Продолжается", "Запускается заново"],
      answer: 0,
      explain: "Выход из состояния останавливает его do-активность. Затем выполняется exit-действие."
    },
    {
      topic: "STATE", state: "bad_state",
      q: "Что не так с состоянием «Опубликован» на этой диаграмме?",
      options: ["Из него нет выходов, но оно не конечное: это тупиковое состояние (deadlock)", "Ничего", "Оно слишком длинное"],
      answer: 0,
      explain: "Состояние без исходящих переходов, не помеченное как конечное, делает цикл жизни незавершённым или модель неполной."
    },
    {
      topic: "STATE", state: "bad_state",
      q: "Что не так с «Архив»?",
      options: ["Это недостижимое состояние из основного начального: в него нет переходов из «Черновик» и «Опубликован»", "Ничего", "Он конечный"],
      answer: 0,
      explain: "Состояние, до которого нельзя добраться из начального, либо лишнее, либо отсутствуют переходы."
    },
    {
      topic: "STATE", state: "bad_state",
      q: "Что не так с двумя начальными псевдосостояниями?",
      options: ["На верхнем уровне должно быть одно начальное состояние: неясно, с чего начинается цикл", "Ничего", "Начальных должно быть три"],
      answer: 0,
      explain: "В одной области допустим один начальный переход. Несколько точек входа выражают отдельными областями или составными состояниями."
    },
    {
      topic: "STATE", state: "login",
      q: "Почему переход «[попыток = 3]» нужно дополнять условием «[попыток < 3]» на соседнем переходе?",
      options: ["Чтобы условия не пересекались, и при любом числе попыток существовал ровно один допустимый переход", "Из-за стиля", "Не нужно"],
      answer: 0,
      explain: "Взаимоисключающие условия делают поведение детерминированным."
    },
    {
      topic: "STATE", state: "login",
      q: "Что произойдёт при неверном пароле, если счётчик попыток не сбрасывается после успешного входа?",
      options: ["Пользователь заблокируется раньше положенного: нужно сбрасывать счётчик действием при успешном входе", "Ничего", "Пользователь сразу получит доступ"],
      answer: 0,
      explain: "Счётчик — часть расширенного состояния. Его обновление должно быть описано в действиях переходов."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Что произойдёт, если клиент не ответит в «Ожидает клиента»?",
      options: ["На диаграмме нет перехода по таймауту: заявка может зависнуть; стоит добавить after(N дней) → «Закрыта»", "Заявка закроется", "Заявка решится"],
      answer: 0,
      explain: "Отсутствие таймаута — типичная проблема жизненных циклов. Диаграмма должна гарантировать завершение."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Что означает цикл «В работе» ↔ «Ожидает клиента»?",
      options: ["Заявка может многократно переходить между этими состояниями по ходу диалога", "Это ошибка", "Заявка закрывается"],
      answer: 0,
      explain: "Взаимные переходы допустимы. Для защиты от бесконечных циклов используют таймеры и лимиты."
    },
    {
      topic: "STATE", state: "order",
      q: "Что произойдёт при повторном событии «оплата получена» в состоянии «Оплачен»?",
      options: ["На диаграмме такого перехода нет: событие игнорируется или считается ошибкой; нужно описать идемпотентную обработку", "Заказ оплатится дважды", "Заказ отменится"],
      answer: 0,
      explain: "События без переходов в текущем состоянии обычно игнорируют. Для повторных платежей важно явно решить, как реагировать."
    },
    {
      topic: "STATE", state: "order",
      q: "Как проверить, что любое состояние достижимо и из него есть путь к конечному?",
      options: ["Проанализировать граф переходов от начального и обратно к конечному", "Не проверять", "Посмотреть на цвета"],
      answer: 0,
      explain: "Достижимость и завершаемость — базовые свойства корректной диаграммы. Их проверяют обходом графа."
    },
    {
      topic: "STATE", state: "door",
      q: "Что означает пара переходов «открыть» и «закрыть» между «Закрыта» и «Открыта»?",
      options: ["Два независимых перехода в противоположных направлениях", "Один двунаправленный", "Цикл без событий"],
      answer: 0,
      explain: "Каждый переход имеет направление и своё событие. Двусторонняя связь — два перехода."
    },
    {
      topic: "STATE",
      q: "Что такое внутренний переход (internal transition)?",
      options: ["Реакция на событие внутри состояния без выхода из него: не вызывает exit и entry", "Переход в то же состояние с exit и entry", "Переход в конечное"],
      answer: 0,
      explain: "Внутренний переход выполняет действие, не покидая состояния. Саморефлексивный переход, напротив, выполняет exit и entry."
    },
    {
      topic: "STATE",
      q: "Чем саморефлексивный (внешний) переход отличается от внутреннего?",
      options: ["Он выходит из состояния и входит обратно, запуская exit и entry, а внутренний — нет", "Ничем", "Он только для составных"],
      answer: 0,
      explain: "Разница заметна, если в состоянии есть entry/exit: внешний переход выполняет их заново."
    },
    {
      topic: "STATE",
      q: "Что такое переход по завершении (completion transition) без события?",
      options: ["Переход, который срабатывает автоматически после завершения do-активности или входа в состояние", "Переход по таймеру", "Ошибка"],
      answer: 0,
      explain: "Переход без события срабатывает, когда состояние завершило внутреннюю работу."
    },
    {
      topic: "STATE",
      q: "Что означает событие «after(5 мин)»?",
      options: ["Событие времени: срабатывает через 5 минут пребывания в состоянии", "Событие по расписанию", "Событие по запросу"],
      answer: 0,
      explain: "Относительное время отсчитывается с момента входа в состояние. Абсолютное время записывают как when(дата)."
    },
    {
      topic: "STATE",
      q: "Чем событие вызова (call event) отличается от события сигнала (signal event)?",
      options: ["Вызов — синхронный запрос операции, сигнал — асинхронное сообщение", "Ничем", "Сигнал всегда быстрее"],
      answer: 0,
      explain: "В UML события бывают вызова, сигнала, изменения (when) и времени (after)."
    },
    {
      topic: "STATE",
      q: "Что такое отложенное событие (deferred event)?",
      options: ["Событие, которое сохраняется и обрабатывается позже, в другом состоянии, где его можно принять", "Потерянное событие", "Событие с ошибкой"],
      answer: 0,
      explain: "Отложенные события хранятся в очереди, пока объект не окажется в состоянии, готовом к ним."
    },
    {
      topic: "STATE",
      q: "Что происходит с событием, для которого в текущем состоянии нет перехода?",
      options: ["По умолчанию оно игнорируется (и теряется), если не объявлено отложенным", "Объект падает", "Событие ставится в очередь"],
      answer: 0,
      explain: "Принято описывать явно, как реагировать на нежелательные события: игнорировать, откладывать или считать ошибкой."
    },
    {
      topic: "STATE",
      q: "Что такое составное состояние с ортогональными областями?",
      options: ["Состояние с несколькими параллельными областями, в каждой из которых активно своё подсостояние", "Состояние без подсостояний", "Последовательность"],
      answer: 0,
      explain: "Пунктирная линия делит рамку на области. Объект одновременно находится по одному подсостоянию в каждой."
    },
    {
      topic: "STATE",
      q: "Что такое неглубокая (H) и глубокая (H*) история?",
      options: ["H запоминает последнее подсостояние верхнего уровня, H* — все уровни вложенности", "Одно и то же", "H* только для конечных"],
      answer: 0,
      explain: "Глубокая история восстанавливает вложенную конфигурацию до листового состояния."
    },
    {
      topic: "STATE",
      q: "Чем ромб выбора (choice) отличается от соединения (junction)?",
      options: ["Choice вычисляет условия при достижении (динамически), junction объединяет или разделяет переходы статически", "Ничем", "Junction — конечное"],
      answer: 0,
      explain: "Choice использует актуальные значения после действий предыдущего сегмента, junction — только синтаксическое объединение."
    },
    {
      topic: "STATE",
      q: "Что такое ветка [else] у выбора?",
      options: ["Переход, выбираемый, если не выполнено ни одно другое условие", "Конечное состояние", "Событие"],
      answer: 0,
      explain: "[else] гарантирует, что у выбора всегда есть выход, и делает модель полной."
    },
    {
      topic: "STATE",
      q: "Как состояния и переходы выражаются в коде (паттерн State)?",
      options: ["Каждое состояние — отдельный класс с методами обработки событий, контекст делегирует вызовы текущему состоянию", "Одним большим if", "Через глобальные переменные"],
      answer: 0,
      explain: "Паттерн State снижает ветвления и локализует поведение каждого состояния."
    },
    {
      topic: "STATE",
      q: "Как хранить состояние сущности в БД?",
      options: ["Колонкой статуса с ограничением допустимых значений (enum/справочник) и контролем допустимых переходов в приложении или БД", "Несколькими булевыми флагами", "В текстовом комментарии"],
      answer: 0,
      explain: "Одно поле статуса точнее описывает жизненный цикл, чем набор флагов, допускающий невозможные комбинации."
    },
    {
      topic: "STATE",
      q: "Почему набор булевых флагов (isPaid, isShipped, isCancelled) хуже явного состояния?",
      options: ["Возможны противоречивые комбинации (оплачен и отменён одновременно), а допустимые сочетания не очевидны", "Он быстрее", "Он короче"],
      answer: 0,
      explain: "Явное состояние делает недопустимые комбинации невозможными и документирует жизненный цикл."
    },
    {
      topic: "STATE",
      q: "Что такое таблица переходов?",
      options: ["Таблица «состояние × событие → новое состояние», альтернатива диаграмме для проверки полноты", "Таблица БД", "Расписание"],
      answer: 0,
      explain: "Таблица удобна для проверки: пустые ячейки показывают необработанные события."
    },
    {
      topic: "STATE",
      q: "Чем автомат Мили отличается от автомата Мура?",
      options: ["В автомате Мили действия связаны с переходами, в автомате Мура — с состояниями", "Ничем", "Мура — только для часов"],
      answer: 0,
      explain: "В UML встречаются оба вида: действия на переходах (Мили) и entry/exit/do (Мура)."
    },
    {
      topic: "STATE",
      q: "Что означает детерминированность автомата?",
      options: ["Для каждого состояния и события существует не более одного допустимого перехода", "Он быстрый", "Он без событий"],
      answer: 0,
      explain: "Неоднозначные условия делают поведение непредсказуемым. Охранные условия должны быть взаимоисключающими."
    },
    {
      topic: "STATE",
      q: "Как показать общее поведение для нескольких состояний без дублирования стрелок?",
      options: ["Сгруппировать состояния в составное и провести переход от его границы", "Нарисовать стрелки от каждого", "Нельзя"],
      answer: 0,
      explain: "Иерархия состояний позволяет унаследовать переход подсостояниями."
    },
    {
      topic: "STATE",
      q: "Что такое расширенное состояние (extended state)?",
      options: ["Переменные автомата (счётчики, флаги), которые влияют на условия переходов, но не являются отдельными состояниями", "Составное состояние", "Конечное состояние"],
      answer: 0,
      explain: "Счётчик попыток — расширенное состояние. Оно позволяет не плодить состояния «1 попытка», «2 попытки»."
    },
    {
      topic: "STATE",
      q: "Для каких объектов диаграмма состояний особенно полезна?",
      options: ["Для объектов с выраженным жизненным циклом: заказ, заявка, документ, платёж, соединение", "Для справочников без поведения", "Для констант"],
      answer: 0,
      explain: "Чем больше правил зависит от стадии объекта, тем важнее диаграмма состояний."
    },
    {
      topic: "STATE",
      q: "Что такое «начальный переход» составного состояния?",
      options: ["Переход от начального псевдосостояния внутри рамки к подсостоянию по умолчанию", "Переход от конечного", "Событие"],
      answer: 0,
      explain: "При входе в границу составного состояния без истории объект попадает в подсостояние по умолчанию."
    },
    {
      topic: "STATE",
      q: "Что такое точки входа и выхода (entry/exit points) у составного состояния?",
      options: ["Явные узлы на границе для входа в конкретные подсостояния и выхода из них", "События", "Условия"],
      answer: 0,
      explain: "Они позволяют скрыть внутреннюю структуру, предоставляя внешнему миру определённые входы."
    },
    {
      topic: "STATE",
      q: "Что такое поведение ожидания (idle) на диаграмме?",
      options: ["Состояние, в котором объект ждёт внешние события без активной работы", "Ошибка", "Конечное состояние"],
      answer: 0,
      explain: "Большинство реактивных систем большую часть времени находятся в состоянии ожидания."
    },
    {
      topic: "STATE",
      q: "Можно ли использовать диаграмму состояний для описания протокола взаимодействия?",
      options: ["Да: протокольный автомат определяет допустимые последовательности вызовов операций", "Нет", "Только для БД"],
      answer: 0,
      explain: "Например, «сначала connect(), затем send(), затем close()». Нарушение порядка — ошибка использования."
    },
    {
      topic: "STATE", state: "door",
      q: "Что произойдёт, если в состоянии «Заперта» придёт событие «открыть»?",
      options: ["На диаграмме такого перехода нет: событие игнорируется (дверь остаётся запертой)", "Дверь откроется", "Дверь сломается"],
      answer: 0,
      explain: "События без переходов в текущем состоянии не вызывают смены состояния. Это защита от недопустимых действий."
    },
    {
      topic: "ACT", act: "merge_bug",
      q: "Что произойдёт при выполнении этой диаграммы?",
      options: ["Процесс зависнет: join ждёт токены с обеих веток, а решение создаёт только один", "Процесс завершится успешно", "Обе ветки выполнятся"],
      answer: 0,
      explain: "Decision отправляет токен лишь в одну ветку, а join требует все входящие. Правильное решение — merge (слияние)."
    },
    {
      topic: "ACT", act: "merge_bug",
      q: "Как исправить диаграмму?",
      options: ["Заменить join на узел слияния (merge)", "Заменить решение на fork", "Добавить ещё одно действие"],
      answer: 0,
      explain: "Узел слияния пропускает любой пришедший токен. Это правильная пара для узла решения."
    },
    {
      topic: "ACT", act: "merge_bug",
      q: "Какое правило соблюдения пар узлов нарушено?",
      options: ["Решение должно завершаться слиянием, а fork — соединением (join)", "Решение должно завершаться join", "Пары не нужны"],
      answer: 0,
      explain: "Типы разветвления и объединения должны соответствовать: decision → merge, fork → join."
    },
    {
      topic: "ACT", act: "merge_ok",
      q: "Почему здесь слияние, а не join?",
      options: ["Выполняется только одна из двух веток, и ждать вторую не нужно", "Выполняются обе", "Слияние запрещено"],
      answer: 0,
      explain: "Merge пропускает токен единственной выполнившейся ветки."
    },
    {
      topic: "ACT", act: "merge_ok",
      q: "Сколько раз выполнится «Оплатить»?",
      options: ["Один раз", "Дважды", "Ни разу"],
      answer: 0,
      explain: "Токен идёт лишь по одной ветке, поэтому на слиянии он один."
    },
    {
      topic: "ACT", act: "flow_final",
      q: "Что произойдёт после завершения «Отправить чек» на диаграмме?",
      options: ["Завершится только эта ветка, а вторая ветка продолжит работу", "Завершится вся активность", "Ничего"],
      answer: 0,
      explain: "Конец потока (круг с крестом) поглощает токен только своей ветки."
    },
    {
      topic: "ACT", act: "flow_final",
      q: "Что произойдёт после конечного узла «Заказ подтверждён»?",
      options: ["Завершится вся активность, даже если другие ветки ещё работают", "Только одна ветка", "Продолжится"],
      answer: 0,
      explain: "Activity final останавливает все токены активности."
    },
    {
      topic: "ACT", act: "flow_final",
      q: "Какое поведение стоит добавить, если нужно дождаться обеих веток перед завершением?",
      options: ["Соединить ветки узлом join и после него поставить конечный узел", "Ничего", "Заменить fork на решение"],
      answer: 0,
      explain: "Join синхронизирует ветки, и завершение происходит только после обеих."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Что будет, если «Проверить платёж» никогда не завершится?",
      options: ["Join не сработает, и процесс не дойдёт до «Выдать результат»", "Процесс продолжит без неё", "Завершится ошибкой"],
      answer: 0,
      explain: "Join ждёт все входящие токены. Для защиты вводят таймаут или обходной поток."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Как показать, что проверки не должны начинаться, пока заявка не принята?",
      options: ["Поставить fork после действия «Принять заявку» (как на диаграмме)", "Поставить join", "Ничего"],
      answer: 0,
      explain: "Порядок задан стрелкой: fork получает токен только после «Принять заявку»."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Чем это отличается от последовательного выполнения проверок?",
      options: ["Общее время определяется самой долгой проверкой, а не их суммой", "Время суммируется", "Ничем"],
      answer: 0,
      explain: "Параллелизм сокращает общую длительность до времени самой долгой ветки."
    },
    {
      topic: "ACT", act: "signals",
      q: "Что произойдёт, если ответ так и не придёт?",
      options: ["Поток будет ждать на «Получить ответ» бесконечно: нужен таймаут", "Процесс завершится", "Ответ придумается"],
      answer: 0,
      explain: "Приём события блокирует поток. Добавляют ветку по времени или прерывающую область."
    },
    {
      topic: "ACT", act: "signals",
      q: "Как добавить таймаут ожидания ответа?",
      options: ["Параллельно с приёмом ответа поставить событие времени и выбрать то, что наступит первым", "Убрать приём", "Добавить действие"],
      answer: 0,
      explain: "Конкуренция событий (ответ или время) моделируется двумя приёмами событий на одном ветвлении."
    },
    {
      topic: "ACT", act: "signals",
      q: "Чем действие «Отправить запрос» отличается от обычного действия?",
      options: ["Оно отправляет сигнал внешнему участнику, а не выполняет внутреннюю работу", "Ничем", "Оно ждёт ответа"],
      answer: 0,
      explain: "Send signal action моделирует асинхронную отправку."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Как защититься от бесконечного цикла ввода пароля?",
      options: ["Добавить счётчик попыток и ветку блокировки при превышении лимита", "Ничего", "Убрать цикл"],
      answer: 0,
      explain: "Условие выхода по числу попыток делает цикл конечным и защищает от подбора."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Что произойдёт при [нет] с точки зрения токена?",
      options: ["Токен вернётся к «Ввести пароль» и снова пройдёт по тому же пути", "Токен исчезнет", "Токен удвоится"],
      answer: 0,
      explain: "Цикл — обратный поток, по которому токен идёт повторно."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Чем поток объектов отличается от потока управления?",
      options: ["Он передаёт данные (объект), а поток управления только порядок выполнения", "Ничем", "Он быстрее"],
      answer: 0,
      explain: "Object flow несёт объект между действиями и часто изображается пунктиром."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Что означает запись «[создан]» в узле объекта?",
      options: ["Состояние объекта на этом этапе жизненного цикла", "Номер версии", "Имя актёра"],
      answer: 0,
      explain: "Состояние в скобках показывает, в каком виде объект передаётся дальше."
    },
    {
      topic: "ACT", act: "time_act",
      q: "Чем событие времени в начале отличается от начального узла?",
      options: ["Оно запускает активность по расписанию или таймеру, а начальный узел — вручную или вызовом", "Ничем", "Оно завершает активность"],
      answer: 0,
      explain: "Time event — условие старта: каждое срабатывание создаёт токен."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Что делают дорожки в этой диаграмме по сравнению с одной линией?",
      options: ["Показывают передачи ответственности между клиентом, оператором и руководителем", "Задают порядок", "Ускоряют процесс"],
      answer: 0,
      explain: "Стрелки между дорожками — точки передачи работы, часто с задержками и ошибками."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Что нужно добавить, чтобы обращение не зависло у руководителя?",
      options: ["Срок и эскалацию по времени (событие времени) или напоминание", "Ничего", "Новую дорожку"],
      answer: 0,
      explain: "Время ожидания на передачах — типичная проблема процессов."
    },
    {
      topic: "ACT", act: "call_act",
      q: "Для чего вызов вложенной активности?",
      options: ["Скрыть детали и переиспользовать общий фрагмент в нескольких диаграммах", "Для параллелизма", "Для красоты"],
      answer: 0,
      explain: "Call behavior упрощает диаграмму и обеспечивает повторное использование."
    },
    {
      topic: "ACT", act: "call_act",
      q: "Что должна определять вызванная активность?",
      options: ["Собственные начальный и конечный узлы, входы и выходы (параметры)", "Только название", "Дорожку"],
      answer: 0,
      explain: "Вложенная активность — самостоятельная диаграмма с интерфейсом."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Что нужно изменить, чтобы клиент мог оплатить заказ перед сборкой?",
      options: ["Добавить действие оплаты (например, с обменом сигналами) между проверкой и сборкой", "Ничего", "Убрать склад"],
      answer: 0,
      explain: "Новые шаги добавляют в поток там, где они нужны по логике процесса."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Какую ветвь стоит проверить на полноту условий?",
      options: ["Решение «Товар есть?»: должны быть [да] и [нет], без пересечений", "Начальный узел", "Конечный узел"],
      answer: 0,
      explain: "Для решения важно, чтобы условия охватывали все возможные значения."
    },
    {
      topic: "ACT",
      q: "Что такое [else] на ветке решения?",
      options: ["Ветка, выбираемая, если не выполнено ни одно другое условие", "Условие всегда истинно и пересекается", "Название действия"],
      answer: 0,
      explain: "[else] гарантирует, что токену всегда есть куда идти."
    },
    {
      topic: "ACT",
      q: "Что такое прерываемая область (interruptible region)?",
      options: ["Группа действий, выполнение которых можно прервать событием, например «Отмена»", "Область дорожек", "Параллельная ветка"],
      answer: 0,
      explain: "При событии прерывания токены в области отменяются, и управление переходит по прерывающему потоку."
    },
    {
      topic: "ACT",
      q: "Что такое обработчик исключений в диаграмме активности?",
      options: ["Поток, запускаемый при возникновении исключения в защищённом действии, с типом исключения на ребре", "Параллельный поток", "Решение"],
      answer: 0,
      explain: "Exception handler определяет реакцию на сбой и изолирует обработку ошибки от основного потока."
    },
    {
      topic: "ACT",
      q: "Что такое область расширения (expansion region)?",
      options: ["Область, в которой действия выполняются для каждого элемента входной коллекции", "Область дорожек", "Группа условий"],
      answer: 0,
      explain: "Expansion region — аналог цикла по коллекции: итеративного, параллельного или потокового."
    },
    {
      topic: "ACT",
      q: "Чем параллельная область расширения отличается от итеративной?",
      options: ["В параллельной элементы обрабатываются одновременно, в итеративной — по очереди", "Ничем", "Итеративная быстрее"],
      answer: 0,
      explain: "Режим выбирают по требованиям к порядку и ресурсам."
    },
    {
      topic: "ACT",
      q: "Что такое центральный буфер (central buffer)?",
      options: ["Узел объектов, хранящий токены с объектами между действиями, как очередь", "Таймер", "Дорожка"],
      answer: 0,
      explain: "Буфер сохраняет объекты, пока их не заберёт следующее действие."
    },
    {
      topic: "ACT",
      q: "Что такое хранилище данных (data store) в диаграмме активности?",
      options: ["Постоянное хранилище, откуда читают и куда пишут данные, не удаляя их при чтении", "Временная очередь", "Условие"],
      answer: 0,
      explain: "В отличие от буфера, data store сохраняет данные, и чтение не извлекает объект."
    },
    {
      topic: "ACT",
      q: "Что такое пин (pin) действия?",
      options: ["Входной или выходной параметр действия: точка присоединения потока объектов", "Булавка", "Сигнал"],
      answer: 0,
      explain: "Пины показывают, какие данные действие получает и возвращает."
    },
    {
      topic: "ACT",
      q: "Что означает вес ребра {weight = 2}?",
      options: ["Сколько токенов должно накопиться, чтобы поток прошёл дальше", "Приоритет", "Скорость"],
      answer: 0,
      explain: "Вес задаёт число токенов, которые передаются или требуются за раз."
    },
    {
      topic: "ACT",
      q: "Чем диаграмма активности отличается от диаграммы состояний?",
      options: ["Активность описывает поток действий, а состояния — жизненный цикл объекта", "Ничем", "Состояния — только для людей"],
      answer: 0,
      explain: "Активность отвечает «что делается и в каком порядке», состояние — «в каком положении объект и что его меняет»."
    },
    {
      topic: "ACT",
      q: "Чем диаграмма активности похожа на BPMN?",
      options: ["Обе описывают потоки работ, но BPMN богаче в событиях, сообщениях и участниках бизнес-процесса", "Ничем", "BPMN — часть UML"],
      answer: 0,
      explain: "UML-активность подходит для общего потока, BPMN специально разработан для бизнес-процессов."
    },
    {
      topic: "ACT",
      q: "Как показать условие цикла «пока есть данные»?",
      options: ["Ромб решения с обратной стрелкой: [есть данные] → вернуться, [нет] → выйти", "Рамка loop", "Таймер"],
      answer: 0,
      explain: "Цикл строится из решения и обратного потока."
    },
    {
      topic: "ACT",
      q: "Как показать, что действие повторяется для каждой позиции заказа?",
      options: ["Область расширения над действием или цикл с решением", "Fork на каждую позицию", "Дорожка"],
      answer: 0,
      explain: "Область расширения компактно выражает обработку коллекции."
    },
    {
      topic: "ACT",
      q: "Что произойдёт, если у fork нет соответствующего join?",
      options: ["Параллельные ветви завершаются отдельно; нужно явно решить, завершается ли активность и когда", "Ничего", "Ветки соединятся"],
      answer: 0,
      explain: "Без join потоки не синхронизируются: используют конечные узлы потоков или общий конец."
    },
    {
      topic: "ACT",
      q: "Что такое «сторожевое условие» на ребре?",
      options: ["Логическое условие, при котором токен может пройти по ребру", "Название ребра", "Вес"],
      answer: 0,
      explain: "Guard определяет проходимость ребра. Он вычисляется, когда токен достигает узла решения."
    },
    {
      topic: "ACT",
      q: "Когда уместно использовать дорожки?",
      options: ["Когда важно показать, кто отвечает за каждое действие", "Всегда", "Никогда"],
      answer: 0,
      explain: "Для процессов с несколькими ролями дорожки делают передачи ответственности видимыми."
    },
    {
      topic: "ACT",
      q: "Можно ли использовать диаграмму активности для описания алгоритма?",
      options: ["Да: она подходит для логики метода, ветвлений и циклов", "Нет", "Только для БД"],
      answer: 0,
      explain: "Ею описывают как бизнес-процессы, так и внутреннюю логику операций."
    },
    {
      topic: "ACT",
      q: "Что показывает диаграмма активности на уровне варианта использования?",
      options: ["Подробный поток шагов сценария варианта использования", "Классы", "Таблицы"],
      answer: 0,
      explain: "Активность часто детализирует сценарий с ветвлениями и исключениями."
    },
    {
      topic: "ACT",
      q: "Что такое начальное и конечное состояние потока в активности?",
      options: ["Начальный узел создаёт токен, конечный поглощает; активность может иметь несколько конечных узлов", "Одни и те же узлы", "Не существует"],
      answer: 0,
      explain: "Концы определяют границы выполнения."
    },
    {
      topic: "ACT",
      q: "Что произойдёт, если токен попадёт в действие, у которого нет исходящего потока?",
      options: ["Поток завершится в этом действии (токен останется), поэтому лучше явно поставить конечный узел", "Токен вернётся", "Процесс перезапустится"],
      answer: 0,
      explain: "Явные завершающие узлы улучшают читаемость и однозначность."
    },
    {
      topic: "ACT",
      q: "Как именовать узлы решения?",
      options: ["Вопросом: «Товар есть?», а ветки — ответами [да]/[нет]", "Глаголом", "Без названия"],
      answer: 0,
      explain: "Вопрос в названии решения делает условия веток очевидными."
    },
    {
      topic: "ACT",
      q: "Как показать, что действие выполняется только при выполнении предусловия?",
      options: ["Локальное предусловие на действии или решение перед ним", "Цвет", "Таймер"],
      answer: 0,
      explain: "Предусловия документируют требования к началу действия."
    },
    {
      topic: "ACT",
      q: "Как показать повторную попытку отправки сообщения с ограничением в три раза?",
      options: ["Решение с условием [попыток < 3] и обратным потоком, счётчик увеличивается в действии", "Fork", "Join"],
      answer: 0,
      explain: "Цикл с счётчиком — стандартный способ ограничить число повторов."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Сколько токенов окажется на join, когда обе проверки завершены?",
      options: ["Два: по одному с каждой ветки, и join выпускает один токен", "Один", "Три"],
      answer: 0,
      explain: "Join ждёт по токену на каждом входе и затем создаёт один исходящий токен."
    },
    {
      topic: "ACT", act: "loop_act",
      q: "Какой тип узла образует начало цикла, к которому возвращается стрелка?",
      options: ["Действие «Ввести пароль»: в него входят два потока (начальный и возвратный)", "Fork", "Join"],
      answer: 0,
      explain: "Действие может иметь несколько входящих потоков, и каждый пришедший токен запускает его заново (неявное слияние)."
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
    },
    {
      topic: "ERD", erd: "booking",
      q: "Как не допустить двойное бронирование номера на пересекающиеся даты?",
      options: ["UNIQUE(room_id, check_in) достаточно", "Проверка пересечения интервалов (например, exclusion-ограничение по диапазону дат или блокировка номера в транзакции)", "Достаточно проверять даты на стороне клиента"],
      answer: 1,
      explain: "Уникальность по check_in ловит только брони с одинаковой датой заезда, но не пересечения интервалов. Нужна проверка на уровне БД (EXCLUDE USING gist в PostgreSQL) либо блокировка при вставке."
    },
    {
      topic: "ERD",
      q: "В products вместо category_id хранится текстовое поле category_name, которое повторяется в тысячах строк. Какая проблема возникнет?",
      options: ["Никакой: так проще читать", "Аномалия обновления: при переименовании категории нужно менять тысячи строк, возможны расхождения; это нарушение нормализации", "Запросы с JOIN станут невозможными"],
      answer: 1,
      explain: "Хранение повторяющегося атрибута вместо ссылки на справочник приводит к дублированию и риску опечаток («Books» и «books»). Справочник выносят в отдельную таблицу."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Как получить всех подчинённых руководителя на любой глубине иерархии?",
      options: ["Один JOIN employees с employees", "Рекурсивный CTE (WITH RECURSIVE) по manager_id", "GROUP BY manager_id"],
      answer: 1,
      explain: "Одно самосоединение даёт только один уровень. Для произвольной глубины используют рекурсивный запрос, который шаг за шагом добавляет подчинённых."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Пользователь просит удалить аккаунт, но у него есть комментарии. Что предпочтительнее при внешних ключах?",
      options: ["Удалить пользователя и каскадно все комментарии: так проще", "Пометить пользователя удалённым (deleted_at) либо обезличить, не нарушая ссылочную целостность", "Обнулить id пользователя"],
      answer: 1,
      explain: "Каскадное удаление уничтожает чужие обсуждения, а жёсткое удаление мешает ссылкам. Мягкое удаление или обезличивание сохраняет данные и целостность."
    },
    {
      topic: "ERD", erd: "library",
      q: "Нужен ли в book_authors отдельный суррогатный ключ id, если уже есть составной PK (book_id, author_id)?",
      options: ["Обязательно: без id таблица не работает", "Не обязательно: составной PK уже уникально идентифицирует строку и запрещает дубли пары", "Нет, потому что составные ключи запрещены"],
      answer: 1,
      explain: "Для чистой таблицы связи составной PK — естественный выбор. Суррогатный id добавляют, если на строку ссылаются другие таблицы или есть собственные атрибуты связи."
    },
    {
      topic: "ERD", erd: "shop",
      q: "В PostgreSQL на orders.user_id есть FK, но нет индекса. Чем это грозит?",
      options: ["Ничем: индекс создаётся для каждого FK автоматически", "PostgreSQL не создаёт индекс на FK сам: соединения по user_id и проверки при удалении пользователя идут полным сканом", "FK без индекса не работает"],
      answer: 1,
      explain: "Индекс на PK есть всегда, а индекс на внешний ключ нужно создавать отдельно. Без него растёт стоимость JOIN и проверок целостности на больших таблицах."
    },
    {
      topic: "ERD", erd: "school",
      q: "Преподаватель курса может меняться, но нужна история: кто вёл курс в каждом семестре. Как изменить модель?",
      options: ["Оставить teacher_id в courses и перезаписывать его", "Вынести назначение в отдельную таблицу с курсом, преподавателем и периодом действия (valid_from/valid_to)", "Добавить в courses колонку teacher_history как текст"],
      answer: 1,
      explain: "Перезапись теряет прошлое. Историю хранят отдельными строками с интервалом действия (подход SCD type 2) или таблицей назначений по семестрам."
    },
    {
      topic: "ERD",
      q: "Таблица comments содержит target_type ('post' или 'photo') и target_id без внешних ключей. В чём риск такого полиморфного решения?",
      options: ["Рисков нет: это стандартный способ", "БД не может проверить, что target_id указывает на существующую строку нужной таблицы: пропадает ссылочная целостность", "Нельзя хранить два типа в одной таблице"],
      answer: 1,
      explain: "Внешний ключ может ссылаться только на одну таблицу. Альтернатива: отдельные колонки post_id и photo_id с CHECK «ровно одна заполнена» либо таблицы комментариев для каждого типа."
    },
    {
      topic: "ERD", erd: "shop",
      q: "orders.total можно вычислить как сумму qty × price по order_items. Как относиться к хранению total?",
      options: ["Хранить без проверок: это ускорит чтение", "Это производное значение: хранить можно осознанно, но с гарантией пересчёта (транзакция, триггер, ограничение), иначе total разойдётся с позициями", "Запрещено в любой модели данных"],
      answer: 1,
      explain: "Хранение вычисляемых значений — компромисс между скоростью и согласованностью. Если выбрали его, нужно описать, кто и когда пересчитывает значение."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Что произойдёт с позициями заказа, если FK order_items.order_id объявлен с ON DELETE CASCADE и удаляют заказ?",
      options: ["Позиции останутся без заказа", "Позиции удалятся вместе с заказом автоматически", "Удаление заказа будет заблокировано"],
      answer: 1,
      explain: "CASCADE распространяет удаление на дочерние строки. Это удобно для «частей целого» вроде позиций заказа, но опасно для независимых данных: каскад нужно выбирать осознанно."
    },
    {
      topic: "API", lang: "text",
      q: "Лимитер допускает 10 запросов в секунду с «ведром токенов» ёмкостью 50. Что это значит для клиента?",
      code: `token bucket: rate = 10/s, capacity = 50`,
      options: ["Клиент не может превысить 10 запросов в любую секунду", "Клиент может кратковременно послать до 50 запросов подряд, затем скорость ограничится 10 в секунду", "Каждый запрос блокируется на 100 мс"],
      answer: 1,
      explain: "Token bucket допускает всплески до размера ведра и ограничивает среднюю скорость пополнением токенов. Фиксированное окно ведёт себя иначе: возможен двойной всплеск на границе окон."
    },
    {
      topic: "API", lang: "text",
      q: "Сервис Б начал тормозить, и сервис А держит потоки в ожидании ответов. Что поможет не уронить весь А?",
      code: `A -> B (ответ за 30 секунд вместо 100 мс)`,
      options: ["Увеличить таймаут до минуты", "Короткие таймауты и circuit breaker: при росте ошибок вызовы к Б прекращаются, пока он не восстановится", "Повторять запрос без пауз"],
      answer: 1,
      explain: "Без ограничений медленная зависимость исчерпывает пул потоков вызывающего сервиса и вызывает каскадный отказ. Circuit breaker быстро возвращает ошибку или запасной ответ."
    },
    {
      topic: "API", lang: "text",
      q: "Три слоя вызова: клиент, шлюз и сервис, каждый делает 3 повтора. Что случится при отказе сервиса?",
      code: `client x3 -> gateway x3 -> service  (всего до 27 обращений)`,
      options: ["Ничего: повторы всегда полезны", "Усиление нагрузки: повторы перемножаются; нужно ограничивать повторы на одном уровне и использовать бюджет повторов", "Сервис вернётся быстрее"],
      answer: 1,
      explain: "Вложенные повторы умножаются и добивают уже больной сервис. Повторы выполняют на одном слое, с jitter и общим лимитом."
    },
    {
      topic: "API", lang: "text",
      q: "Брокер доставляет сообщения «минимум один раз». Что должен сделать потребитель?",
      code: `event { id: "e-8812", type: "order.paid" }  # может прийти дважды`,
      options: ["Ничего: повтора не будет", "Хранить обработанные id и пропускать дубликаты (идемпотентный потребитель)", "Отклонять все повторные сообщения как ошибку"],
      answer: 1,
      explain: "At-least-once допускает дубли. Идемпотентность достигают таблицей обработанных событий либо операциями вида «установить состояние», а не «прибавить»."
    },
    {
      topic: "API", lang: "text",
      q: "Можно ли гарантировать доставку «ровно один раз» между двумя независимыми системами?",
      code: `producer -> network -> consumer`,
      options: ["Да, любой брокер гарантирует это сам", "На практике добиваются «эффективно один раз»: доставка минимум один раз плюс идемпотентная обработка", "Нет, и эта задача не требует решения"],
      answer: 1,
      explain: "Сбои сети делают невозможным надёжно различить «не дошло» и «дошло, но ответ потерялся». Поэтому повторы допускают и обрабатывают идемпотентно."
    },
    {
      topic: "API", lang: "text",
      q: "После записи заказа приложение сразу читает список заказов из витрины (CQRS), но новой записи там нет. Почему?",
      code: `write model -> события -> read model (обновляется асинхронно)`,
      options: ["Это сбой: данных нет вообще", "Витрина обновляется с задержкой (eventual consistency): интерфейс должен учитывать лаг, например показывать созданный объект из ответа на запись", "Нужно удалить кэш браузера"],
      answer: 1,
      explain: "Отдельная модель чтения догоняет модель записи не мгновенно. UX и контракт должны допускать такую задержку."
    },
    {
      topic: "API", lang: "http",
      q: "Сервер требует If-Match для PUT, а клиент его не прислал. Что вернуть?",
      code: `PUT /api/v1/documents/7
# заголовка If-Match нет`,
      options: ["428 Precondition Required", "200 OK: перезаписать как есть", "404 Not Found"],
      answer: 0,
      explain: "428 заставляет клиента использовать условный запрос, что защищает от потерянных обновлений. При устаревшей версии вернётся 412."
    },
    {
      topic: "API", lang: "http",
      q: "Два клиента одновременно регистрируют один email. Проверка «есть ли такой email» и вставка выполняются отдельно. Что может случиться?",
      code: `1) SELECT ... WHERE email = ?   -> нет
2) INSERT INTO users ...         -> создаём`,
      options: ["Ничего: так надёжно", "Гонка: обе проверки пройдут, создадутся два пользователя; нужно ограничение UNIQUE и обработка нарушения как 409", "Вставка сама отменится"],
      answer: 1,
      explain: "Проверка без блокировки или уникального индекса не защищает от конкурентных запросов. Целостность гарантирует база, а приложение переводит ошибку нарушения в 409."
    },
    {
      topic: "API", lang: "text",
      q: "Зачем в GraphQL ограничивают глубину и сложность запроса?",
      code: `query { user { friends { friends { friends { posts { comments { ... } } } } } } }`,
      options: ["Чтобы клиент не мог одним запросом создать огромную нагрузку на сервер", "Чтобы сократить длину ответа", "Только по требованию стандарта"],
      answer: 0,
      explain: "Гибкость GraphQL позволяет клиенту построить очень дорогой запрос. Лимиты глубины, сложности и тайм-ауты защищают сервис."
    },
    {
      topic: "API", lang: "text",
      q: "В protobuf удалили поле с номером 5, а затем добавили новое поле с тем же номером 5 другого типа. Что пойдёт не так?",
      code: `message Order { reserved 5; ... }   // вместо этого: string note = 5;`,
      options: ["Ничего: номера можно использовать повторно", "Старые клиенты и сохранённые данные прочитают новое поле по-старому: номера полей нельзя переиспользовать, их помечают reserved", "Сообщение станет короче"],
      answer: 1,
      explain: "Номер поля — часть бинарного контракта. Повторное использование ведёт к неверной интерпретации старых данных, поэтому номера резервируют."
    },
    {
      topic: "API", lang: "text",
      q: "К схеме события добавили обязательное поле. Что произойдёт у потребителей на старой версии схемы?",
      code: `# v1: { id, amount }
# v2: { id, amount, channel }   # channel — обязательное`,
      options: ["Ничего: потребители игнорируют любые поля", "Новые продюсеры совместимы вперёд, но старые данные и потребители ломаются: для обратной совместимости новые поля делают необязательными или с default", "Потребители автоматически обновятся"],
      answer: 1,
      explain: "Совместимость бывает прямой и обратной. Безопасный путь: добавлять необязательные поля или поля с default и согласовывать правила в реестре схем."
    },
    {
      topic: "API", lang: "text",
      q: "Что должен делать получатель вебхука, чтобы провайдер не слал повторы?",
      code: `POST /webhooks/payments   # обработка занимает 40 секунд, таймаут провайдера 10`,
      options: ["Выполнять всю обработку до ответа", "Быстро ответить 2xx, сохранив событие, а обработать асинхронно", "Отвечать 500 до окончания обработки"],
      answer: 1,
      explain: "Если ответ приходит дольше таймаута, провайдер считает доставку неудачной и повторяет её. Принять и положить в очередь — стандартный приём."
    },
    {
      topic: "API", lang: "text",
      q: "Вебхуки приходят вне порядка. Как узнать, что событие устарело?",
      code: `event: { id, type: "order.updated", version: 12, occurredAt: ... }`,
      options: ["Сравнить версию (или время) события с сохранённой и игнорировать более старые", "Всегда применять последнее полученное", "Сортировать по размеру"],
      answer: 0,
      explain: "Порядок доставки не гарантирован, поэтому применяют событие только если его версия новее текущего состояния."
    },
    {
      topic: "API", lang: "text",
      q: "Для мобильного приложения нужна авторизация через OAuth2. Какой поток выбрать?",
      code: `Клиент: мобильное приложение (не может надёжно хранить client_secret)`,
      options: ["Implicit flow", "Authorization Code с PKCE", "Resource Owner Password Credentials"],
      answer: 1,
      explain: "Публичные клиенты используют код авторизации с PKCE: одноразовый секрет защищает от перехвата кода. Implicit и ROPC считаются устаревшими."
    },
    {
      topic: "API", lang: "text",
      q: "Чем scope в OAuth2 отличается от роли пользователя?",
      code: `token: scope = "orders:read profile"
user:  role  = "admin"`,
      options: ["Это одно и то же", "Scope ограничивает, что может сделать приложение от имени пользователя, а роль описывает права самого пользователя; итоговый доступ — их пересечение", "Scope заменяет аутентификацию"],
      answer: 1,
      explain: "Приложению нужно разрешение (scope), а пользователю — право (роль). Для операции должны выполняться оба условия."
    },
    {
      topic: "API", lang: "text",
      q: "Обновление refresh-токена выполняется с ротацией. Что значит попытка использовать уже использованный refresh-токен?",
      code: `refresh_token A -> выдан B, A погашен
повторно приходит A`,
      options: ["Обычный повтор: выдать ещё один токен", "Признак кражи или гонки: цепочку токенов отзывают и просят войти заново", "Ничего не делать"],
      answer: 1,
      explain: "При ротации каждый refresh-токен одноразовый. Повторное использование сигнализирует, что токен скопирован, поэтому безопаснее отозвать всю цепочку."
    },
    {
      topic: "API", lang: "http",
      q: "Пользователь А запросил заказ пользователя Б, подставив его id. Сервер проверил только валидность токена. Как называется уязвимость?",
      code: `GET /api/v1/orders/5001
Authorization: Bearer <token пользователя A>`,
      options: ["XSS", "BOLA/IDOR: нет проверки, что объект принадлежит пользователю", "SQL-инъекция"],
      answer: 1,
      explain: "Недостаточно аутентификации: на каждом обращении к объекту нужно проверять право доступа именно к этому объекту. Это самая частая уязвимость API."
    },
    {
      topic: "API", lang: "http",
      q: "Клиент в PATCH профиля добавил лишнее поле. Что может пойти не так?",
      code: `PATCH /api/v1/profile
{ "name": "Ivan", "role": "admin" }`,
      options: ["Ничего: сервер игнорирует незнакомые поля", "Mass assignment: если сервер присваивает все поля из тела модели, пользователь повысит себе права; нужен белый список изменяемых полей", "Сервер вернёт 304"],
      answer: 1,
      explain: "Автоматическое сопоставление тела запроса с моделью позволяет менять поля, не предназначенные клиенту. Разрешённые поля перечисляют явно."
    },
    {
      topic: "API", lang: "text",
      q: "Лимит запросов привязан к IP-адресу. Какая проблема возможна в офисе за одним NAT?",
      code: `limit: 100 req/min per IP`,
      options: ["Никакой", "Все сотрудники делят один IP и блокируют друг друга; лимиты лучше привязывать к ключу или пользователю", "Лимит перестанет работать для одного пользователя"],
      answer: 1,
      explain: "IP не идентифицирует клиента: за ним могут стоять многие пользователи, а у одного пользователя может быть несколько адресов."
    },
    {
      topic: "API", lang: "text",
      q: "Как защитить подписанный запрос от повторной отправки перехваченной копии?",
      code: `X-Signature: <HMAC>
X-Timestamp: 1761472000
X-Nonce: 9f2c7a`,
      options: ["Достаточно подписи", "Проверять срок действия timestamp и запоминать использованные nonce", "Шифровать только заголовки"],
      answer: 1,
      explain: "Подпись подтверждает целостность, но не свежесть. Ограничение по времени и одноразовые nonce предотвращают replay-атаки."
    },
    {
      topic: "API", lang: "text",
      q: "Чем mTLS отличается от обычного TLS между сервисами?",
      code: `service A <-> service B`,
      options: ["Шифрование не используется", "Проверяют сертификаты обеих сторон: сервер знает, какой клиент подключается", "Только клиент проверяет сервер"],
      answer: 1,
      explain: "В обычном TLS подлинность подтверждает только сервер. При mTLS клиент тоже предъявляет сертификат, что даёт надёжную идентификацию сервисов."
    },
    {
      topic: "API", lang: "text",
      q: "В логи попал полный запрос оплаты. Что нужно изменить?",
      code: `INFO  POST /pay body={"pan":"4111111111111111","cvv":"123","amount":50}`,
      options: ["Ничего: логи нужны для отладки", "Маскировать или не писать чувствительные данные (PAN, токены, пароли) и ограничивать доступ к логам", "Хранить логи вечно"],
      answer: 1,
      explain: "Логи часто доступны широкому кругу людей и хранятся долго. Секреты и платёжные данные в них — инцидент безопасности и нарушение стандартов вроде PCI DSS."
    },
    {
      topic: "API", lang: "text",
      q: "Мобильному приложению нужно собрать экран из пяти микросервисов. Какой приём уменьшает число запросов с телефона?",
      code: `mobile -> service A, B, C, D, E`,
      options: ["Вызывать каждый сервис отдельно", "Прослойка BFF/агрегирующий шлюз: приложение делает один запрос, а сервер собирает данные", "Скачивать базы данных на телефон"],
      answer: 1,
      explain: "Backend for Frontend скрывает внутреннюю структуру и сокращает число сетевых вызовов клиента, особенно на медленных сетях."
    },
    {
      topic: "API", lang: "http",
      q: "Сервис перегружен. Как он должен вести себя, чтобы не упасть полностью?",
      code: `очередь запросов растёт, задержки увеличиваются`,
      options: ["Принимать все запросы и надеяться", "Сбрасывать нагрузку: отвечать 503 с Retry-After на часть запросов (load shedding) вместо ожидания в бесконечной очереди", "Увеличить таймауты клиентов"],
      answer: 1,
      explain: "Лучше быстро отказать части запросов, чем обслужить все слишком медленно. Retry-After подсказывает клиентам, когда вернуться."
    },
    {
      topic: "API", lang: "http",
      q: "Как связать запись в логах разных сервисов одного пользовательского запроса?",
      code: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`,
      options: ["Использовать время запроса", "Передавать заголовок trace context (traceparent) во все вызовы и писать trace id в логи", "Сравнивать IP-адреса"],
      answer: 1,
      explain: "Распределённая трассировка опирается на сквозной идентификатор, который каждый сервис передаёт дальше. Формат W3C Trace Context стандартизирует заголовок."
    },
    {
      topic: "API", lang: "text",
      q: "Среднее время ответа 120 мс, но жалуются пользователи. Какая метрика покажет проблему?",
      code: `avg = 120 ms, p50 = 60 ms, p99 = 4 s`,
      options: ["Среднее: оно самое точное", "Перцентили (p95/p99): среднее скрывает редкие очень долгие ответы", "Число серверов"],
      answer: 1,
      explain: "Хвост распределения определяет впечатление части пользователей. Поэтому цели по скорости (SLO) формулируют через перцентили."
    },
    {
      topic: "API", lang: "text",
      q: "Ключ в кэше протух, и тысяча запросов одновременно идёт в базу за новым значением. Как называется проблема и что помогает?",
      code: `cache miss -> 1000 параллельных запросов к БД`,
      options: ["Cache stampede: помогает единичное обновление (coalescing/блокировка) и stale-while-revalidate", "Deadlock: помогает перезагрузка", "Отказ DNS"],
      answer: 0,
      explain: "При одновременной инвалидации популярного ключа база получает лавину запросов. Объединение запросов, случайный разброс TTL и отдача устаревшего значения сглаживают пик."
    },
    {
      topic: "API", lang: "http",
      q: "Ответ с персональными данными ушёл через общий CDN-кэш другому пользователю. Что упущено?",
      code: `GET /api/v1/profile
Cache-Control: public, max-age=600`,
      options: ["Ничего: так работает CDN", "Ответ нужно помечать private/no-store и учитывать Vary: Authorization; публичное кэширование персональных данных недопустимо", "Нужно уменьшить max-age до 1"],
      answer: 1,
      explain: "Общий кэш не различает пользователей без явных правил. Для персонализированных ответов используют private или no-store."
    },
    {
      topic: "API", lang: "text",
      q: "Клиенту нужны события в реальном времени, но только от сервера к клиенту, без обратного канала. Что проще всего?",
      code: `цены на бирже обновляются каждую секунду`,
      options: ["Опрашивать API каждые 100 мс", "Server-Sent Events: односторонний поток по HTTP; WebSocket нужен для двусторонней связи", "Отправлять письма"],
      answer: 1,
      explain: "SSE проще WebSocket для потока «сервер → клиент»: работает поверх HTTP, умеет переподключаться. Двусторонние чаты и игры требуют WebSocket."
    },
    {
      topic: "API", lang: "http",
      q: "Возврат платежа повторился из-за таймаута. Что должно защитить клиента от двойного возврата?",
      code: `POST /api/v1/payments/77/refund
{ "amount": "50.00" }   # дважды`,
      options: ["Ничего: возврат всегда безопасен", "Идемпотентность возврата: ключ операции или проверка суммы уже возвращённого", "Увеличить таймаут"],
      answer: 1,
      explain: "Компенсирующие действия тоже могут повторяться и должны быть идемпотентными, иначе исправление ошибки порождает новую."
    },
    {
      topic: "API", lang: "text",
      q: "Что даёт перехват журнала изменений БД (CDC) по сравнению с двойной записью «база + брокер»?",
      code: `Debezium читает WAL базы и публикует события`,
      options: ["Ничего: способы одинаковы", "События строятся из того, что реально зафиксировано в базе, без расхождений из-за падения между двумя записями", "CDC не требует базы данных"],
      answer: 1,
      explain: "Источник событий — журнал транзакций, поэтому событие появляется ровно для зафиксированных изменений. Это альтернатива паттерну outbox."
    },
    {
      topic: "API", lang: "text",
      q: "Сообщение не удаётся обработать после нескольких попыток. Что делать с ним?",
      code: `consumer: ошибка разбора, повторы исчерпаны`,
      options: ["Удалить без следа", "Переместить в очередь «мёртвых писем» (DLQ) для анализа и повторной обработки после исправления", "Зациклить обработку бесконечно"],
      answer: 1,
      explain: "Бесконечные повторы блокируют очередь, а потеря данных недопустима. DLQ изолирует проблемные сообщения и сохраняет их для разбора."
    },
    {
      topic: "API", lang: "json",
      q: "Валюты в API: суммы в целых минимальных единицах. Что нужно учесть?",
      code: `{ "amount": 1000, "currency": "JPY" }
{ "amount": 1000, "currency": "KWD" }`,
      options: ["Всегда делить на 100", "Число знаков разное: у JPY 0, у USD 2, у KWD 3; нужно знать exponent валюты (ISO 4217)", "Валюту можно не передавать"],
      answer: 1,
      explain: "1000 JPY — это 1000 иен, а 1000 KWD в минимальных единицах — 1 динар. Поэтому передают валюту и применяют правила её минимальных единиц."
    },
    {
      topic: "API", lang: "text",
      q: "Два сервиса сравнивают время событий по локальным часам и получают неверный порядок. Как это исправить?",
      code: `service A: 10:00:00.200   service B: 10:00:00.100  (часы расходятся)`,
      options: ["Синхронизировать часы вручную раз в год", "Не полагаться на системное время для порядка: использовать версии, последовательности или логические часы, а время только как метаданные", "Всегда доверять сервису A"],
      answer: 1,
      explain: "Часы разных машин расходятся, а NTP даёт лишь приблизительную синхронизацию. Для упорядочивания событий применяют монотонные версии."
    },
    {
      topic: "API", lang: "text",
      q: "Клиент после таймаута не знает, выполнилась ли операция перевода. Что он должен сделать?",
      code: `POST /api/v1/transfers -> timeout`,
      options: ["Просто повторить запрос без ключа", "Повторить с тем же ключом идемпотентности или запросить статус по идентификатору операции", "Считать операцию неуспешной"],
      answer: 1,
      explain: "Таймаут не означает, что операция не выполнена. Повтор безопасен только при идемпотентности, иначе возможен двойной перевод."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что означает такой фрагмент плана выполнения?",
      code: `EXPLAIN SELECT * FROM orders WHERE user_id = 42;
-- Seq Scan on orders (cost=0.00..18334.00 rows=5 width=64)
--   Filter: (user_id = 42)`,
      options: ["Использован индекс по user_id", "Последовательное чтение всей таблицы с фильтрацией: индекс не применён", "Запрос выполнен из кэша"],
      answer: 1,
      explain: "Seq Scan означает полный проход по таблице. Для выборки малой доли строк это сигнал проверить индекс или статистику."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Индекс есть, но планировщик выбирает полный скан по явно неверной оценке числа строк. Что проверить?",
      code: `-- rows=1 в плане, а реально вернулось 800000`,
      options: ["Перезапустить сервер", "Актуальность статистики: выполнить ANALYZE", "Удалить индекс"],
      answer: 1,
      explain: "Оптимизатор строит план по статистике распределения значений. Устаревшая статистика ведёт к неверным оценкам и плохим планам."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что даёт покрывающий индекс (INCLUDE)?",
      code: `CREATE INDEX idx_orders_user ON orders (user_id) INCLUDE (status, total);
SELECT status, total FROM orders WHERE user_id = 42;`,
      options: ["Позволяет выполнить запрос только по индексу, не обращаясь к таблице (index-only scan)", "Делает колонки status и total уникальными", "Ускоряет только запись"],
      answer: 0,
      explain: "Если все нужные колонки есть в индексе, чтение таблицы не нужно. Платой становится размер индекса и стоимость обновлений."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Нужны только активные заказы, которых мало. Какой индекс экономичнее?",
      code: `-- 99% заказов имеют status = 'done'`,
      options: ["CREATE INDEX ON orders (status)", "CREATE INDEX ON orders (id) WHERE status <> 'done' (частичный индекс)", "Индекс по всем колонкам"],
      answer: 1,
      explain: "Частичный индекс хранит только строки, подходящие под условие. Он меньше и быстрее обновляется, но подходит лишь запросам с тем же условием."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Поиск по email без учёта регистра медленный при индексе по email. Что сделать?",
      code: `SELECT * FROM users WHERE LOWER(email) = 'ivan@example.com';`,
      options: ["Ничего: индекс по email всё равно используется", "Создать функциональный индекс по LOWER(email)", "Заменить LOWER на UPPER"],
      answer: 1,
      explain: "Функция над колонкой делает обычный индекс непригодным. Индекс по выражению (LOWER(email)) решает проблему, если выражение в запросе совпадает."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему индекс по varchar-колонке не используется?",
      code: `-- code varchar, индекс есть
SELECT * FROM items WHERE code = 12345;   -- число, а не строка`,
      options: ["Индексы не работают с varchar", "Неявное приведение типов (code::int) делает условие непригодным для индекса; значение надо передавать строкой", "Нужен GROUP BY"],
      answer: 1,
      explain: "Если СУБД приводит тип колонки, а не константы, индекс по колонке не применим. Типы параметров должны совпадать с типами колонок."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Влияет ли порядок таблиц в тексте запроса с INNER JOIN на результат и производительность?",
      code: `SELECT * FROM a JOIN b ON ... JOIN c ON ...;`,
      options: ["Результат зависит от порядка", "Для INNER JOIN результат не зависит от порядка, а оптимизатор сам выбирает порядок соединения", "Порядок запрещён стандартом"],
      answer: 1,
      explain: "Для внутренних соединений порядок логически не важен, план строит оптимизатор по стоимости. Для внешних соединений порядок меняет результат."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает такая рамка окна?",
      code: `SELECT day, revenue,
       AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7
FROM daily_revenue;`,
      options: ["Скользящее среднее по текущему и шести предыдущим строкам", "Среднее по всей таблице", "Среднее по следующим семи дням"],
      answer: 0,
      explain: "Рамка ROWS задаёт окно физических строк. В первых шести строках окно неполное, поэтому там среднее считается по меньшему числу значений."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что находит этот приём?",
      code: `SELECT user_id, MIN(day), MAX(day), COUNT(*) AS streak_days
FROM (
  SELECT user_id, day,
         day - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day))::int AS grp
  FROM activity
) t
GROUP BY user_id, grp;`,
      options: ["Серии подряд идущих дней активности («острова»)", "Дубликаты активности", "Пропущенные пользователи"],
      answer: 0,
      explain: "Разность даты и номера строки постоянна внутри непрерывной серии. Группировка по ней выделяет «острова» подряд идущих значений."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Чем опасен рекурсивный CTE по иерархии с циклами в данных?",
      code: `WITH RECURSIVE t AS (
  SELECT id, manager_id FROM employees WHERE id = 1
  UNION ALL
  SELECT e.id, e.manager_id FROM employees e JOIN t ON e.manager_id = t.id
)
SELECT * FROM t;`,
      options: ["Ничем: рекурсия сама остановится", "Если есть цикл (A руководит B, B руководит A), рекурсия не завершится; нужен контроль глубины или проверка посещённых узлов", "Рекурсия запрещена в SQL"],
      answer: 1,
      explain: "Рекурсивная часть выполняется, пока добавляются новые строки. Цикл в данных даёт бесконечное продолжение, поэтому используют ограничение глубины или UNION вместо UNION ALL."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как получить два последних заказа каждого пользователя без оконных функций?",
      code: `SELECT u.id, o.*
FROM users u
CROSS JOIN LATERAL (
  SELECT * FROM orders WHERE user_id = u.id ORDER BY created_at DESC LIMIT 2
) o;`,
      options: ["LATERAL позволяет подзапросу ссылаться на столбцы внешней таблицы и вычисляться для каждой её строки", "LATERAL выполняет запрос параллельно", "Такого синтаксиса нет"],
      answer: 0,
      explain: "LATERAL JOIN — «цикл по строкам» слева: для каждого пользователя подзапрос выбирает его заказы. Хорош для top-N на группу при наличии индекса."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Два врача дежурят в смене. Каждая транзакция проверяет, что дежурных ≥ 2, и снимает своего врача. Что может случиться при REPEATABLE READ?",
      code: `-- T1: SELECT COUNT(*) FROM on_call  -> 2; DELETE doctor A
-- T2: SELECT COUNT(*) FROM on_call  -> 2; DELETE doctor B`,
      options: ["Одна из транзакций обязательно откатится", "Write skew: обе удачно выполнятся и дежурных останется 0; нужны SERIALIZABLE или явная блокировка", "Ничего: изоляция исключает аномалии"],
      answer: 1,
      explain: "Транзакции читают общий снимок и пишут разные строки, поэтому конфликта нет, хотя инвариант нарушен. Защищает уровень SERIALIZABLE или блокировка общей строки."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Транзакция на SERIALIZABLE завершилась ошибкой 40001. Что делать приложению?",
      code: `ERROR: could not serialize access due to read/write dependencies`,
      options: ["Показать пользователю критическую ошибку", "Повторить всю транзакцию целиком: это нормальный сигнал при конфликте", "Отключить изоляцию"],
      answer: 1,
      explain: "Сериализуемая изоляция может отклонять транзакции, чтобы сохранить порядок. Приложение должно уметь безопасно повторять транзакцию."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Долго висящая открытая транзакция замедляет всю базу. Почему?",
      code: `BEGIN;
SELECT ...;
-- забыли COMMIT, соединение простаивает час`,
      options: ["Она держит строки и не даёт autovacuum удалять мёртвые версии строк: растёт раздувание таблиц", "Она отключает индексы", "Она блокирует сеть"],
      answer: 0,
      explain: "Из-за MVCC старый снимок данных нужен долгой транзакции, поэтому VACUUM не может очистить недоступные версии. Такие сессии нужно ограничивать таймаутами."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что такое «мёртвые версии строк» в PostgreSQL?",
      code: `UPDATE orders SET status = 'paid' WHERE id = 1;`,
      options: ["Строки, у которых нет первичного ключа", "Старые версии изменённых или удалённых строк, которые остаются до очистки VACUUM", "Строки с NULL"],
      answer: 1,
      explain: "UPDATE создаёт новую версию строки, а старая остаётся для других транзакций. VACUUM освобождает место после того, как версия перестаёт быть нужной."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Миграция ALTER TABLE зависла и блокирует запросы приложения. Что уместно использовать при выполнении миграций?",
      code: `ALTER TABLE orders ADD COLUMN note text;`,
      options: ["Ничего: ALTER TABLE безопасен всегда", "Установить lock_timeout и повторять при неудаче: ALTER требует сильной блокировки и встаёт в очередь за долгими запросами", "Запускать в час пик"],
      answer: 1,
      explain: "Операции DDL требуют эксклюзивной блокировки и сами ждут завершения старых транзакций, а новые запросы выстраиваются за ними. lock_timeout не даёт заморозить сервис."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как создать индекс на большой работающей таблице без остановки записи?",
      code: `CREATE INDEX idx_orders_created ON orders (created_at);   -- блокирует запись`,
      options: ["Подождать ночи", "CREATE INDEX CONCURRENTLY: индекс строится без блокировки записи, но дольше", "Удалить таблицу и пересоздать"],
      answer: 1,
      explain: "Обычное создание индекса блокирует изменения таблицы. Вариант CONCURRENTLY допускает запись, но требует двух проходов и не работает внутри транзакции."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как добавить внешний ключ на большую таблицу с минимальной блокировкой?",
      code: `ALTER TABLE orders
  ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT fk_user;`,
      options: ["NOT VALID сразу применяет проверку ко всем старым строкам", "NOT VALID вводит ограничение для новых записей без долгой проверки старых, а VALIDATE проверяет их позже с более слабой блокировкой", "Эти команды ничего не делают"],
      answer: 1,
      explain: "Разделение на два шага сокращает время сильной блокировки: проверка существующих данных идёт отдельно и не мешает записи."
    },
    {
      topic: "SQL", lang: "sql",
      q: "В PostgreSQL 11+ добавляется колонка с константным DEFAULT к таблице на сотни миллионов строк. Что ожидать?",
      code: `ALTER TABLE events ADD COLUMN source text NOT NULL DEFAULT 'web';`,
      options: ["Таблица будет полностью переписана несколько часов", "Операция быстрая: значение по умолчанию хранится в метаданных, переписывание не требуется", "Операция невозможна"],
      answer: 1,
      explain: "Начиная с PostgreSQL 11 константный DEFAULT не заставляет переписывать таблицу. Изменчивые значения по умолчанию (например, random()) такой оптимизации не получают."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Таблица разбита по месяцам по created_at. Какой запрос выиграет от исключения секций (partition pruning)?",
      code: `-- PARTITION BY RANGE (created_at)
A) WHERE created_at >= '2026-10-01' AND created_at < '2026-11-01'
B) WHERE user_id = 42`,
      options: ["B: по любому полю", "A: условие по ключу секционирования позволяет не читать лишние секции", "Оба одинаково"],
      answer: 1,
      explain: "СУБД отбрасывает секции только если условие касается ключа секционирования. Запрос без него просматривает все секции."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Можно ли создать уникальность только по email на секционированной таблице (по created_at) в PostgreSQL?",
      code: `CREATE TABLE users (...) PARTITION BY RANGE (created_at);
CREATE UNIQUE INDEX ON users (email);`,
      options: ["Да, без ограничений", "Нет: уникальный индекс обязан включать ключ секционирования, иначе глобальная уникальность не гарантируется", "Да, но только для текстовых колонок"],
      answer: 1,
      explain: "Индексы создаются отдельно для каждой секции, поэтому уникальность между секциями обеспечить нельзя. Либо включают ключ секции, либо используют другую модель."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как «увеличить счётчик» атомарно при конкурентных запросах?",
      code: `INSERT INTO page_views (page, cnt) VALUES ('/home', 1)
ON CONFLICT (page) DO UPDATE SET cnt = page_views.cnt + 1;`,
      options: ["Запрос безопасен: обновление выполняется атомарно на уровне строки", "Нужно сначала SELECT cnt, затем UPDATE", "Запрос теряет обновления"],
      answer: 0,
      explain: "Выражение cnt = cnt + 1 вычисляется на актуальной версии строки под её блокировкой. Приём «прочитал-прибавил-записал» в приложении, наоборот, теряет обновления."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Зачем нужны advisory-блокировки (pg_advisory_lock)?",
      code: `SELECT pg_advisory_lock(hashtext('daily-report'));`,
      options: ["Чтобы приложения могли договариваться об исключительном доступе к логическому ресурсу, не привязанному к строке таблицы", "Чтобы заблокировать все таблицы", "Чтобы ускорить запросы"],
      answer: 0,
      explain: "Advisory-блокировки — механизм взаимного исключения на уровне приложения. Их используют, например, чтобы только один воркер запускал периодическую задачу."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает NOWAIT?",
      code: `SELECT * FROM orders WHERE id = 1 FOR UPDATE NOWAIT;`,
      options: ["Ждёт блокировку бесконечно", "Сразу возвращает ошибку, если строка уже заблокирована", "Пропускает заблокированные строки"],
      answer: 1,
      explain: "NOWAIT не ждёт снятия чужой блокировки и немедленно сообщает об ошибке. SKIP LOCKED пропускает занятые строки без ошибки."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как работает оптимистическая блокировка через версию?",
      code: `UPDATE docs SET title = :t, version = version + 1
WHERE id = :id AND version = :v;`,
      options: ["Защищает от потерянных обновлений: если версия изменилась, затронуто 0 строк, и приложение обрабатывает конфликт", "Блокирует строку для всех на время запроса", "Не защищает ни от чего"],
      answer: 0,
      explain: "Условие по version отсекает запись поверх чужих изменений. Приложение проверяет число затронутых строк и повторяет или сообщает пользователю."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Номера счетов формируются через SEQUENCE и требуется «без пропусков». Что нужно знать?",
      code: `CREATE SEQUENCE invoice_seq;
SELECT nextval('invoice_seq');`,
      options: ["Последовательности гарантируют отсутствие пропусков", "Последовательность не откатывается вместе с транзакцией, поэтому пропуски возможны; для строго непрерывной нумерации нужны другие приёмы", "nextval возвращает случайные числа"],
      answer: 1,
      explain: "Значение, выданное nextval, не возвращается при ROLLBACK или сбое. Нумерацию «без дыр» делают отдельным процессом под блокировкой, учитывая цену этого решения."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Чем now() отличается от clock_timestamp() в PostgreSQL?",
      code: `BEGIN;
SELECT now(), clock_timestamp();
SELECT pg_sleep(5);
SELECT now(), clock_timestamp();`,
      options: ["Одинаковы всегда", "now() фиксируется на начало транзакции, а clock_timestamp() меняется при каждом вызове", "clock_timestamp() фиксируется на начало транзакции"],
      answer: 1,
      explain: "Внутри транзакции now() возвращает одно и то же время. Для измерения реального времени исполнения используют clock_timestamp()."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как загрузить данные из файла так, чтобы повторный запуск не создавал дубли?",
      code: `-- staging_orders — загруженный из файла пакет
INSERT INTO orders (id, status, total)
SELECT id, status, total FROM staging_orders
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, total = EXCLUDED.total;`,
      options: ["Приём называется upsert и делает загрузку идемпотентной", "Запрос создаст дубликаты при повторе", "Запрос удалит таблицу"],
      answer: 0,
      explain: "Загрузка через промежуточную таблицу и ON CONFLICT (или MERGE) сводит повтор к обновлению тех же строк, а не к дублям."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как быстро получить приблизительное число строк в огромной таблице?",
      code: `SELECT COUNT(*) FROM events;   -- работает минуты`,
      options: ["Нельзя: только COUNT(*)", "Использовать оценку из статистики (pg_class.reltuples) либо поддерживать счётчик отдельно", "Использовать LIMIT"],
      answer: 1,
      explain: "Точный COUNT требует прохода по таблице. Если подходит приблизительное значение, берут оценку планировщика."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Что делает такое условие в пагинации?",
      code: `SELECT * FROM orders
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 50;`,
      options: ["Сравнивает пары значений как кортежи, давая корректную keyset-пагинацию по неуникальному полю", "Сравнивает только created_at", "Пропускает все строки"],
      answer: 0,
      explain: "Сравнение кортежей лексикографическое. Вместе с составным индексом (created_at, id) оно эффективно и не теряет записи с одинаковым временем."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Почему уникальность по составному ключу с NULL может не сработать?",
      code: `CREATE UNIQUE INDEX ON subscriptions (user_id, ended_at);
-- активные подписки: ended_at = NULL`,
      options: ["Сработает всегда", "Строки (1, NULL) и (1, NULL) считаются различными, поэтому дубликаты активных подписок возможны; нужен частичный индекс WHERE ended_at IS NULL", "Индекс не создастся"],
      answer: 1,
      explain: "NULL не равен NULL, и уникальный индекс не видит совпадения. Для правила «одна активная подписка» используют частичный уникальный индекс."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как ускорить запрос по полю внутри JSONB?",
      code: `SELECT * FROM events WHERE payload @> '{"type": "purchase"}';`,
      options: ["JSONB нельзя индексировать", "Создать GIN-индекс по payload: он поддерживает оператор @> ", "Хранить JSON как текст"],
      answer: 1,
      explain: "GIN-индексы ускоряют проверки вхождения и существования ключей в JSONB. Для конкретного поля можно сделать индекс по выражению (payload->>'type')."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Удаление миллионов строк одним оператором парализовало сервис. Что безопаснее?",
      code: `DELETE FROM logs WHERE created_at < now() - interval '1 year';`,
      options: ["Оставить как есть", "Удалять пачками с паузами либо секционировать таблицу и удалять секции целиком", "Увеличить размер диска"],
      answer: 1,
      explain: "Большой DELETE держит блокировки, создаёт мёртвые версии строк и раздувает журнал. Пакетное удаление или DROP старых секций щадит систему."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Как правильно подставить пользовательские значения в запрос?",
      code: `A) "SELECT * FROM users WHERE email = '" + email + "'"
B) "SELECT * FROM users WHERE email = $1"  + параметры`,
      options: ["A: проще и быстрее", "B: параметризованный запрос отделяет данные от команды и защищает от SQL-инъекций", "Оба безопасны"],
      answer: 1,
      explain: "Конкатенация строк позволяет атакующему изменить смысл запроса. Параметры передаются отдельно. Имена колонок и направление сортировки параметрами не задаются, их проверяют по белому списку."
    },
    {
      topic: "SQL", lang: "sql",
      q: "Чем TRUNCATE отличается от DELETE без условия в PostgreSQL?",
      code: `TRUNCATE TABLE staging_orders;
DELETE FROM staging_orders;`,
      options: ["TRUNCATE быстро очищает таблицу без построчного удаления, но берёт сильную блокировку; он транзакционен и откатывается", "TRUNCATE удаляет только часть строк", "Разницы нет: оба работают построчно с триггерами и мёртвыми версиями"],
      answer: 0,
      explain: "TRUNCATE освобождает файлы таблицы целиком, поэтому он быстрый, но требует эксклюзивной блокировки и не вызывает построчные триггеры DELETE. В PostgreSQL его можно откатить в рамках транзакции."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Врач сменил специальность, но в старых приёмах он должен остаться в прежней. Как смоделировать?",
      options: ["Перезаписывать specialty_id", "Хранить историю: отдельная таблица назначений специальностей с периодами действия либо фиксация специальности в приёме", "Удалить врача и создать нового"],
      answer: 1,
      explain: "Перезапись уничтожает исторический контекст. Темпоральная таблица или копия значения в факт (приём) сохраняют правду на момент события."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Медицинские данные пациента нужно защитить. Какой подход к модели разумен?",
      options: ["Хранить всё в открытом виде в одной таблице", "Разделить идентифицирующие данные и медицинские записи, ограничить доступ по ролям, шифровать чувствительные поля и вести аудит обращений", "Скрыть данные в интерфейсе"],
      answer: 1,
      explain: "Минимизация доступа и разделение персональных данных снижают последствия утечки. Аудит позволяет доказать, кто и когда читал запись."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Два пациента одновременно записываются в один слот врача. Как избежать двойной записи?",
      options: ["Проверить слот запросом и вставить без блокировок", "Уникальное ограничение на (doctor_id, starts_at) либо блокировка слота в транзакции", "Положиться на интерфейс"],
      answer: 1,
      explain: "Проверка «свободен ли слот» отдельным запросом уязвима для гонки. Ограничение целостности в БД гарантирует результат при любой конкуренции."
    },
    {
      topic: "ERD", erd: "clinic",
      q: "Закон требует хранить записи об оказанной помощи годами, но пациент просит удалить данные. Что учесть в модели?",
      options: ["Всегда физически удалять по запросу", "Разделять данные по срокам хранения и основаниям обработки, применять анонимизацию или ограничение доступа вместо немедленного удаления обязательных записей", "Игнорировать запрос"],
      answer: 1,
      explain: "Право на удаление ограничено обязанностями по хранению. Модель должна позволять выделить удаляемые данные и обезличить остальные."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Как организовать учёт, чтобы баланс всегда можно было доказать?",
      options: ["Только перезаписывать accounts.balance", "Хранить неизменяемый журнал операций (двойная запись) и считать баланс как сумму, а хранимое значение использовать как кэш", "Удалять старые операции"],
      answer: 1,
      explain: "Неизменяемый журнал даёт аудит и возможность восстановления. Исправления делают новыми сторнирующими записями, а не правкой старых."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Два параллельных перевода между счетами A и B в разных направлениях иногда падают с ошибкой взаимной блокировки. Что делать?",
      options: ["Ничего: так и должно быть", "Блокировать строки счетов в едином порядке (например, по возрастанию id)", "Отключить транзакции"],
      answer: 1,
      explain: "Взаимная блокировка возникает при циклическом ожидании. Единый порядок захвата ресурсов исключает цикл."
    },
    {
      topic: "ERD", erd: "bank", lang: "sql",
      q: "Клиентское приложение повторило запрос на перевод после таймаута. Как защитить модель от двойного списания?",
      code: `ALTER TABLE transactions
ADD COLUMN idempotency_key text,
ADD CONSTRAINT uq_idem UNIQUE (account_id, idempotency_key);`,
      options: ["Это не нужно: повтор не опасен", "Уникальный ключ идемпотентности: повторная вставка нарушит ограничение, и сервис вернёт результат первой операции", "Увеличить таймаут"],
      answer: 1,
      explain: "Ограничение уникальности превращает повтор в детерминированный отказ вставки. Сервис возвращает ранее сохранённый результат."
    },
    {
      topic: "ERD", erd: "bank",
      q: "Таблица transactions выросла до миллиардов строк. Что поможет управлять данными?",
      options: ["Ничего: только удалять старые", "Секционирование по дате и архивирование старых секций, индексы под основные запросы", "Хранить в одном текстовом поле"],
      answer: 1,
      explain: "Секции позволяют ограничить запросы нужными периодами и обслуживать данные частями: отдельно индексировать, архивировать, удалять."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Как надёжно изолировать данные арендаторов на уровне БД PostgreSQL?",
      options: ["Фильтровать вручную в каждом запросе без других мер", "Использовать row-level security с политикой по tenant_id (и tenant_id в каждой таблице)", "Хранить tenant_id только в users"],
      answer: 1,
      explain: "RLS применяет политику на уровне БД, поэтому забытый фильтр в приложении не раскрывает чужие строки."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Как гарантировать, что invoice и subscription принадлежат одной организации?",
      options: ["Это невозможно", "Включить tenant_id в составной внешний ключ (tenant_id, id) родителя и дочерней таблицы", "Достаточно соглашения между разработчиками"],
      answer: 1,
      explain: "Обычный FK проверяет только id. Составной ключ с tenant_id запрещает ссылки между разными организациями на уровне данных."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Организация меняет тариф в середине месяца. Какая модель позволит корректно посчитать оплату?",
      options: ["Хранить только текущий plan_id", "Хранить периоды подписок (или события изменения тарифа) и считать по ним фактическое использование/пропорцию", "Хранить дату последней оплаты"],
      answer: 1,
      explain: "Без интервалов нельзя восстановить, какой тариф действовал в каждый день. История изменений — основа корректного биллинга."
    },
    {
      topic: "ERD", erd: "saas",
      q: "Как запретить две одновременные активные подписки у организации?",
      options: ["Проверкой в приложении", "Частичный уникальный индекс по tenant_id WHERE ended_at IS NULL", "Колонка status без ограничений"],
      answer: 1,
      explain: "Условный уникальный индекс гарантирует, что открытая подписка у организации одна, и работает при конкурентных запросах."
    },
    {
      topic: "ERD", erd: "inventory", lang: "sql",
      q: "Заказы одновременно резервируют остаток. Как безопасно списать товар?",
      code: `UPDATE stock
SET qty = qty - :n
WHERE warehouse_id = :wh AND product_id = :p AND qty >= :n;
-- проверить число затронутых строк`,
      options: ["Прочитать qty, проверить в приложении и записать новое значение", "Атомарный UPDATE с условием qty >= :n и проверкой числа затронутых строк", "Увеличить qty на склад"],
      answer: 1,
      explain: "Условие в самом UPDATE исключает гонку между проверкой и записью. Если затронуто 0 строк, остатка недостаточно."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Как организовать модель, чтобы остаток всегда можно было восстановить и проверить?",
      options: ["Хранить только текущий остаток", "Журнал движений как источник правды (event sourcing) плюс производный остаток, который можно перестроить", "Хранить остаток текстом"],
      answer: 1,
      explain: "Журнал событий позволяет аудит и пересчёт. Остаток в stock остаётся оптимизацией чтения."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Составной PK stock — (warehouse_id, product_id). Запросы «где лежит товар X» медленные. Что сделать?",
      options: ["Ничего: PK покрывает все запросы", "Добавить индекс по product_id: индекс PK эффективен только для запросов, начинающихся с warehouse_id", "Удалить PK"],
      answer: 1,
      explain: "Составной индекс помогает запросам по левому префиксу ключа. Для поиска по второй колонке нужен отдельный индекс."
    },
    {
      topic: "ERD", erd: "inventory",
      q: "Нужно запретить отрицательные остатки. Где реализовать это правило?",
      options: ["Только в интерфейсе", "CHECK (qty >= 0) в базе, а приложение обрабатывает ошибку нарушения", "Никак"],
      answer: 1,
      explain: "Ограничение в БД работает для любого клиента и при любых гонках. Приложение превращает ошибку в понятный ответ."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Статусы доставки должны проходить в допустимом порядке. Как отразить это в модели?",
      options: ["Хранить свободный текст", "Фиксировать допустимые значения и хранить журнал переходов статусов (кто, когда, откуда, куда) с проверкой допустимости", "Перезаписывать статус без истории"],
      answer: 1,
      explain: "Явная машина состояний и журнал изменений позволяют расследовать инциденты и анализировать время в каждом статусе."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Нужно искать ближайшего курьера по координатам. Что подойдёт для хранения и поиска?",
      options: ["Две текстовые колонки lat и lon без индекса", "Геотип (например, PostGIS geography) и пространственный индекс GiST", "Хранить адрес строкой"],
      answer: 1,
      explain: "Пространственные типы и индексы позволяют эффективно искать по расстоянию. Текстовые координаты вынуждают к полному скану."
    },
    {
      topic: "ERD", erd: "delivery",
      q: "Два диспетчера одновременно назначают одного курьера на разные активные доставки, а правило требует одну активную доставку на курьера. Как защититься?",
      options: ["Положиться на аккуратность диспетчеров", "Частичный уникальный индекс по courier_id для активных статусов либо блокировка строки курьера в транзакции", "Добавить колонку в orders"],
      answer: 1,
      explain: "Правило «не более одной активной» формулируют как ограничение в БД. Частичный уникальный индекс гарантирует его при конкуренции."
    },
    {
      topic: "ERD", erd: "social",
      q: "Лента строится из постов подписок. При миллионах подписчиков у одного автора что ломается?",
      options: ["Ничего", "Запись поста в ленту каждого подписчика (fan-out on write) дорога для популярных авторов; применяют гибрид: для знаменитостей собирают ленту при чтении", "Ничего, кроме цвета интерфейса"],
      answer: 1,
      explain: "Выбор между записью и чтением определяется распределением нагрузки. Гибридные схемы обрабатывают «горячих» авторов отдельно."
    },
    {
      topic: "ERD", erd: "social",
      q: "Счётчик лайков популярного поста обновляется тысячи раз в секунду. Что становится проблемой?",
      options: ["Ничего", "Конкуренция за одну строку счётчика (hot row); помогают шардирование счётчика, асинхронная агрегация или кэш", "Размер колонки"],
      answer: 1,
      explain: "Одна строка с частыми обновлениями превращается в узкое место. Рассредоточение записей и отложенный сбор значений снимают нагрузку."
    },
    {
      topic: "ERD", erd: "social",
      q: "Пользователь удаляет аккаунт по требованию закона о персональных данных. Как поступить с его постами и лайками?",
      options: ["Каскадно удалить всё", "Удалить или обезличить персональные данные, а связанный контент либо удалить, либо оставить без привязки к личности в соответствии с политикой", "Ничего не менять"],
      answer: 1,
      explain: "Нужно удалить персональные данные, но целостность чужих данных и обсуждений тоже важна. Решение фиксируется политикой и реализуется анонимизацией или каскадом."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Адрес и цена в заказе должны оставаться неизменными после оформления. Как реализовать?",
      options: ["Ссылаться на текущие строки справочников", "Копировать значимые данные в заказ (снимок) или хранить неизменяемые версии справочников", "Запретить менять справочники"],
      answer: 1,
      explain: "Факт заказа — исторический. Копии (price_at_purchase, shipping_address) защищают от последующих правок справочников."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Магазин продаёт в нескольких валютах. Что добавить, чтобы отчёты были корректными?",
      options: ["Только сумму числом", "Валюту рядом с каждой суммой и курс на дату операции (или сумму в базовой валюте на момент операции)", "Ничего: курсы не меняются"],
      answer: 1,
      explain: "Сумма без валюты неоднозначна, а курс меняется со временем. Для отчётов нужна фиксация курса на момент операции."
    },
    {
      topic: "ERD", erd: "shop",
      q: "Каталог товаров меняется часто, нужна история изменений описания и цены. Что выбрать?",
      options: ["Перезаписывать строки", "Версионирование записей (SCD типа 2: версии с периодами действия) и ссылки заказов на версию или снимок цены", "Хранить историю в логах приложения"],
      answer: 1,
      explain: "Версии с интервалами позволяют восстановить состояние на любую дату и связывать факты с нужной версией."
    },
    {
      topic: "ERD", erd: "school",
      q: "Студент переходит из группы в группу. Как сохранить историю принадлежности?",
      options: ["Перезаписывать students.group_id", "Отдельная таблица членства в группах с датами начала и окончания", "Хранить историю в имени студента"],
      answer: 1,
      explain: "Текущая колонка отвечает на вопрос «где сейчас», а таблица интервалов — «где был на любую дату»."
    },
    {
      topic: "ERD", erd: "school",
      q: "Запись enrollments имеет составной PK (student_id, course_id) и собственные атрибуты. Как называется такая сущность?",
      options: ["Справочник", "Ассоциативная сущность (таблица связи с атрибутами): существует только как пара родителей", "Представление"],
      answer: 1,
      explain: "Ассоциативная сущность реализует связь M:N и хранит свойства самой связи, например оценку."
    },
    {
      topic: "ERD", erd: "school",
      q: "Как не допустить пересечения занятий одного преподавателя по времени?",
      options: ["Не нужно: проверять вручную", "Exclusion-ограничение по преподавателю и интервалу времени (например, btree_gist + tsrange)", "Колонка time в teachers"],
      answer: 1,
      explain: "Правило о непересечении интервалов выражается ограничением исключения, которое сравнивает пары значений по оператору «пересекаются»."
    },
    {
      topic: "ERD", erd: "library",
      q: "Библиотека хранит произведение, издание и физический экземпляр. Как выстроить сущности?",
      options: ["Одна таблица books для всего", "Work → Edition → Copy: произведение 1—N изданий 1—N экземпляров; ISBN относится к изданию", "Три несвязанные таблицы"],
      answer: 1,
      explain: "Разные уровни абстракции имеют разные свойства: автор и название у произведения, ISBN и издатель у издания, инвентарный номер у экземпляра."
    },
    {
      topic: "ERD", erd: "library",
      q: "Читатели хотят бронировать выданную книгу. Что добавить?",
      options: ["Колонку reserved в books", "Сущность резервирований с очередью (дата, читатель, состояние) и правилами выдачи по порядку", "Ничего: резервирование невозможно"],
      answer: 1,
      explain: "Очередь — отдельные записи с порядком и состоянием. Это позволяет отслеживать ожидание и автоматизировать уведомления."
    },
    {
      topic: "ERD", erd: "library", lang: "sql",
      q: "Как запретить две одновременно активные выдачи одного экземпляра?",
      code: `CREATE UNIQUE INDEX uq_active_loan
ON loans (book_id)
WHERE returned_at IS NULL;`,
      options: ["Частичный уникальный индекс гарантирует, что открытая выдача книги может быть только одна", "Индекс запрещает возвращать книги", "Индекс ускоряет только чтение"],
      answer: 0,
      explain: "Уникальность применяется только к строкам с условием WHERE, то есть к незавершённым выдачам. Остальные строки истории не ограничены."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Нужно быстро получать всех подчинённых на любой глубине в большой иерархии. Какой способ хранения подходит помимо списка смежности?",
      options: ["Хранить имена начальников строкой", "Closure table (все пары предок—потомок), материализованный путь или вложенные множества", "Только manager_id"],
      answer: 1,
      explain: "Список смежности требует рекурсии. Closure table хранит транзитивные связи, что делает чтение простым за счёт усложнения записи."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Должность, отдел и руководитель сотрудника меняются во времени. Как смоделировать «кто чем руководил на дату X»?",
      options: ["Перезаписывать поля", "Темпоральные таблицы: записи с valid_from/valid_to и запросы «на дату»", "Хранить текущее и предыдущее значение в двух колонках"],
      answer: 1,
      explain: "Интервалы действия позволяют восстанавливать состояние на любую дату без потери прошлого."
    },
    {
      topic: "ERD", erd: "hr",
      q: "Как запретить циклы в иерархии подчинённости (A → B → A)?",
      options: ["CHECK достаточно", "Проверка при изменении (триггер с рекурсивным запросом) либо использование структуры, не допускающей циклов", "Циклы невозможны по определению"],
      answer: 1,
      explain: "Простой CHECK видит только одну строку. Циклы длиннее двух шагов обнаруживаются обходом иерархии при вставке или обновлении."
    },
    {
      topic: "ERD", erd: "booking", lang: "sql",
      q: "Как гарантировать отсутствие пересекающихся броней одного номера на уровне БД?",
      code: `ALTER TABLE bookings
ADD CONSTRAINT no_overlap
EXCLUDE USING gist (room_id WITH =, daterange(check_in, check_out) WITH &&);`,
      options: ["Ограничение исключения: запрещает строки с тем же номером и пересекающимися диапазонами дат", "Ограничение делает даты уникальными", "Оно ускоряет поиск гостей"],
      answer: 0,
      explain: "EXCLUDE обобщает UNIQUE: сравнивает значения произвольным оператором. Здесь запрещены пары строк с равным номером и пересекающимися датами."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Отель и гость находятся в разных часовых поясах. Как хранить время заезда?",
      options: ["Текстом без пояса", "Дату заезда как календарную дату в зоне отеля, а моменты событий как timestamptz (UTC)", "В часовом поясе гостя без указания"],
      answer: 1,
      explain: "Бронь «на ночь 1 ноября» привязана к календарю отеля, а момент оплаты — абсолютное время. Смешение приводит к сдвигу дат."
    },
    {
      topic: "ERD", erd: "booking",
      q: "Отмена брони зависит от политики возврата. Как это отразить в модели?",
      options: ["Добавить колонку refund_percent к гостю", "Хранить политику отмены (условия по срокам) и фиксировать при бронировании применённую версию; сами отмены и возвраты — отдельными событиями", "Не хранить: считать на лету по текущим правилам"],
      answer: 1,
      explain: "Условия на момент оформления брони обязательны к соблюдению. Версия политики и события отмены дают воспроизводимость расчёта."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Теги и лайки нужны и постам, и фотографиям. Как реализовать без нарушения ссылочной целостности?",
      options: ["Колонки target_type и target_id без внешних ключей", "Отдельные таблицы связи для каждого типа (post_tags, photo_tags) либо общий родительский объект «контент» с FK", "Хранить всё в JSON"],
      answer: 1,
      explain: "Полиморфная ссылка без FK оставляет целостность на совести приложения. Раздельные таблицы или общий супертип сохраняют проверки БД."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Счётчик комментариев показывается в списке статей и сильно грузит базу агрегатами. Что делать?",
      options: ["Ничего", "Хранить денормализованный comments_count в posts и обновлять при вставке и удалении (или считать асинхронно)", "Показывать счётчик только админам"],
      answer: 1,
      explain: "Предрасчёт убирает агрегацию на чтении. Цена — необходимость поддерживать значение согласованным."
    },
    {
      topic: "ERD", erd: "blog",
      q: "Глубокие деревья комментариев нужно читать одним запросом. Какой способ хранения подходит?",
      options: ["Только parent_id и рекурсия на клиенте", "Материализованный путь (например, ltree) или closure table: ветку можно получить обычным запросом", "Хранить дерево строкой без структуры"],
      answer: 1,
      explain: "Материализованный путь хранит предков в одной колонке, и выборка поддерева выполняется по индексу, без рекурсии."
    },
    {
      topic: "BPMN", bpmn: "xor_and_bug",
      q: "Как называется проблема этой модели и как её найти до запуска?",
      options: ["Взаимная блокировка (deadlock): анализ корректности (soundness) выявляет состояния, в которых токен не может пройти дальше", "Утечка памяти", "Гонка данных"],
      answer: 0,
      explain: "Модель считается здоровой (sound), если из любого состояния можно дойти до конца без висящих токенов. Инструменты верификации находят блокировки и «лишние» токены."
    },
    {
      topic: "BPMN", bpmn: "and_split_xor_join",
      q: "Что называют «отсутствием синхронизации» (lack of synchronization) на этой диаграмме?",
      options: ["Параллельные ветки сливаются исключающим шлюзом, поэтому последующие шаги выполняются несколько раз", "Ветки выполняются слишком быстро", "Нет часового пояса"],
      answer: 0,
      explain: "Если параллельные токены не объединены AND-слиянием, продолжение процесса выполняется для каждого токена, что часто нежелательно."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Почему OR-слияние считается самым сложным для движков?",
      options: ["Нужно определить, придут ли ещё токены от запущенных ветвей, то есть проанализировать, какие ветки активны", "Оно запрещено", "Оно использует таймеры"],
      answer: 0,
      explain: "Включающее слияние должно решить, ждать ли ещё. Для этого ему нужно знать, какие ветки разветвления были активированы и не завершены."
    },
    {
      topic: "BPMN", bpmn: "credit_or",
      q: "Как упростить модель, избежав OR-шлюзов, если комбинаций немного?",
      options: ["Заменить на параллельный шлюз с условными проверками внутри веток (пропуск шага) или на явные XOR-ветки", "Удалить шлюзы", "Добавить таймер"],
      answer: 0,
      explain: "Параллельные ветки с внутренним условным пропуском проще проверять и отлаживать. Это повышает предсказуемость исполнения."
    },
    {
      topic: "BPMN", bpmn: "pay_wait",
      q: "Какая гонка возможна между событием оплаты и таймером?",
      options: ["Оплата и истечение срока наступают почти одновременно; победит то событие, которое обработает движок первым, поэтому нужны правила на поздние платежи", "Гонки невозможны", "Таймер всегда выигрывает"],
      answer: 0,
      explain: "Event-based gateway выбирает первое обработанное событие. Граничные случаи (платёж в последнюю секунду) нужно покрывать бизнес-правилами и компенсациями."
    },
    {
      topic: "BPMN", bpmn: "boundary_int",
      q: "Что произойдёт с работой пользователя, если сработал прерывающий таймер на пользовательской задаче?",
      options: ["Задача отменяется в движке, и введённые пользователем данные могут быть потеряны, если не были сохранены заранее", "Задача автоматически завершается успешно", "Ничего"],
      answer: 0,
      explain: "Прерывание удаляет активность вместе с несохранённым состоянием. Для долгих задач используют непрерывающие события или сохранение черновиков."
    },
    {
      topic: "BPMN", bpmn: "boundary_non",
      q: "Таймер непрерывающий и циклический (каждые 2 дня). Что произойдёт?",
      options: ["Напоминания будут отправляться повторно, пока задача активна", "Напоминание отправится один раз", "Процесс завершится"],
      answer: 0,
      explain: "Cycle timer на непрерывающем граничном событии создаёт токен по расписанию, пока задача не завершится."
    },
    {
      topic: "BPMN", bpmn: "sub_error",
      q: "Чем ошибка (error) отличается от эскалации (escalation) в BPMN?",
      options: ["Ошибка прерывает подпроцесс и считается сбоем выполнения, а эскалацию можно сделать непрерывающей: она передаёт управление вверх без остановки работы", "Ничем", "Эскалация — это таймер"],
      answer: 0,
      explain: "Error обычно останавливает подпроцесс, тогда как escalation уведомляет родительский уровень и может не прерывать вложенный процесс."
    },
    {
      topic: "BPMN", bpmn: "service_error",
      q: "Чем бизнес-ошибка (BPMN error) отличается от технического сбоя вызова сервиса?",
      options: ["Бизнес-ошибка — ожидаемый исход (отказ платежа), моделируется явно; технический сбой (таймаут сети) обрабатывается повторами и инцидентами", "Ничем", "Технический сбой всегда бизнес-ошибка"],
      answer: 0,
      explain: "Смешивание типов ошибок усложняет схему. Бизнес-исходы показывают на диаграмме, а технические проблемы закрывают политикой повторов и мониторингом."
    },
    {
      topic: "BPMN", bpmn: "service_error",
      q: "Сервисная задача списывает деньги и после этого падает до подтверждения движку. Что произойдёт при повторе?",
      options: ["Деньги будут списаны повторно, если вызов не идемпотентен", "Ничего: движок гарантирует единственный вызов", "Процесс удалится"],
      answer: 0,
      explain: "Движки гарантируют at-least-once для внешних задач. Поэтому вызовы нужно делать идемпотентными, например по ключу операции."
    },
    {
      topic: "BPMN", bpmn: "rework",
      q: "Что скрывает такая схема с точки зрения метрик процесса?",
      options: ["Время цикла зависит от числа возвратов; нужно измерять долю доработок (rework rate) и длительность каждого круга", "Ничего", "Только число задач"],
      answer: 0,
      explain: "Циклы доработки ухудшают время выполнения и стоимость. Процессный анализ отслеживает долю повторов и причины возвратов."
    },
    {
      topic: "BPMN", bpmn: "bank_msg",
      q: "Как избежать потери сообщения «подтверждение», если клиент ещё не дошёл до ожидания?",
      options: ["Использовать буферизацию/корреляцию сообщений в движке или очередь, чтобы сообщение дождалось получателя", "Отправлять сообщение дважды", "Игнорировать"],
      answer: 0,
      explain: "Если сообщение приходит раньше, чем токен достиг события-приёмника, неосторожный движок его потеряет. Нужна устойчивая корреляция или модель с шлюзом по событиям."
    },
    {
      topic: "BPMN", bpmn: "pools_msg",
      q: "Что даёт моделирование обмена в виде коллаборации по сравнению с одним процессом?",
      options: ["Видны границы ответственности и контракты обмена сообщениями между организациями или системами", "Диаграмма становится меньше", "Нельзя использовать таймеры"],
      answer: 0,
      explain: "Раздельные пулы объясняют, кто что контролирует. Сообщения превращаются в явные интерфейсы."
    },
    {
      topic: "BPMN", bpmn: "terminate",
      q: "Какой риск несёт terminate-событие в параллельной модели?",
      options: ["Оно мгновенно убивает остальные ветки, возможно не завершив важные действия; компенсации нужно продумывать", "Оно не завершает процесс", "Оно создаёт копию процесса"],
      answer: 0,
      explain: "Terminate не вызывает компенсаций и завершает остальные токены немедленно, что может оставить систему в промежуточном состоянии."
    },
    {
      topic: "BPMN", bpmn: "multi",
      q: "Одна из проверок позиций заказа упала с ошибкой. Что важно решить в модели?",
      options: ["Что делать с остальными экземплярами и итогом: прерывать всех, продолжать и собрать результаты или компенсировать", "Ничего", "Удалить задачу"],
      answer: 0,
      explain: "Для multi-instance нужно определить политику завершения: все ли должны завершиться успешно и как агрегируются результаты."
    },
    {
      topic: "BPMN", bpmn: "multi",
      q: "Коллекция позиций содержит 5000 элементов. Что может стать проблемой?",
      options: ["Параллельный multi-instance создаёт тысячи токенов и нагрузку на движок; нужны пакетная обработка или ограничение параллелизма", "Ничего", "Невозможна запись в базу"],
      answer: 0,
      explain: "Параллельность не бесплатна: каждый экземпляр хранит состояние. Для больших объёмов выбирают батчи или внешнюю обработку."
    },
    {
      topic: "BPMN", bpmn: "starts",
      q: "Процесс по таймеру запускается каждый понедельник, но выполнение занимает 8 дней. Что произойдёт?",
      options: ["Запустится новый экземпляр, пока старый ещё работает: может возникнуть конкуренция за данные", "Старый экземпляр остановится", "Новый запуск пропустится всегда"],
      answer: 0,
      explain: "Cycle timer не знает о текущих экземплярах. Нужна защита от параллельных запусков: блокировка или проверка активного экземпляра."
    },
    {
      topic: "BPMN", bpmn: "starts",
      q: "Как создать только один экземпляр процесса по сообщению «Заявка получена», даже если сообщение пришло дважды из-за повторной доставки?",
      options: ["Реализовать дедупликацию: уникальный ключ сообщения и идемпотентный старт", "Ничего не делать", "Запретить сообщения"],
      answer: 0,
      explain: "Доставка at-least-once приводит к дублям. Старт должен проверять business key и не создавать второй экземпляр."
    },
    {
      topic: "BPMN", bpmn: "doc_data",
      q: "Чем объект данных в BPMN отличается от хранилища данных (data store)?",
      options: ["Объект данных живёт в рамках экземпляра процесса, а хранилище существует независимо и переживает процесс", "Ничем", "Хранилище — это задача"],
      answer: 0,
      explain: "Data object — данные одного экземпляра (документ заявки). Data store отображает постоянное хранилище, например базу данных."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Как найти узкие места в такой схеме после запуска в эксплуатацию?",
      options: ["Process mining по журналам событий: время между шагами, частота путей, повторные возвраты", "Спросить мнение сотрудников", "Это невозможно"],
      answer: 0,
      explain: "Журнал выполнения (case id, шаг, время) позволяет восстановить фактический процесс и сравнить его с моделью."
    },
    {
      topic: "BPMN", bpmn: "shop_order",
      q: "Как должен быть устроен журнал событий для process mining?",
      options: ["Каждая запись содержит идентификатор экземпляра (case id), название шага и временную метку", "Только общее число заказов", "Только имена сотрудников"],
      answer: 0,
      explain: "Минимальный набор: case id, activity и timestamp. Дополнительные атрибуты (ресурс, сумма) обогащают анализ."
    },
    {
      topic: "BPMN",
      q: "Что такое «здравость» (soundness) модели процесса?",
      options: ["Свойство: из любого состояния процесс может завершиться, нет мёртвых элементов и висящих токенов", "Красота диаграммы", "Совпадение цветов"],
      answer: 0,
      explain: "Sound-модель не содержит блокировок, лишних токенов и недостижимых элементов. Это базовое требование к исполняемому процессу."
    },
    {
      topic: "BPMN",
      q: "Что такое livelock в процессе?",
      options: ["Процесс бесконечно кружит в цикле, не продвигаясь к концу, хотя формально не заблокирован", "Остановка на AND-слиянии", "Ошибка прав"],
      answer: 0,
      explain: "Например, бесконечный цикл доработки без условий выхода. Такой процесс занят, но цели не достигает."
    },
    {
      topic: "BPMN",
      q: "Что нужно сделать, чтобы пользовательская задача не «висела» бесконечно?",
      options: ["Добавить срок исполнения (due date), напоминания и эскалацию через граничные события", "Ничего", "Убрать исполнителя"],
      answer: 0,
      explain: "Ручные шаги — главный источник задержек. SLA, напоминания и эскалации делают их управляемыми."
    },
    {
      topic: "BPMN",
      q: "Что такое принцип четырёх глаз (four-eyes) в модели?",
      options: ["Требование, чтобы действие утверждал второй независимый сотрудник; в модели закрепляется отдельной задачей и ограничением на исполнителя", "Два экземпляра процесса", "Параллельный шлюз"],
      answer: 0,
      explain: "Для контроля нужно, чтобы утверждающий не совпадал с инициатором. Это отражается и в схеме, и в правилах назначения."
    },
    {
      topic: "BPMN",
      q: "Что такое saga в контексте BPMN?",
      options: ["Длинная бизнес-транзакция из шагов с компенсирующими действиями вместо глобального отката", "Тип шлюза", "Вид таймера"],
      answer: 0,
      explain: "Каждый шаг имеет компенсацию. Если поздний шаг падает, выполняются компенсации уже завершённых шагов."
    },
    {
      topic: "BPMN",
      q: "Что означает в движке «асинхронное продолжение» (async continuation) у задачи?",
      options: ["Транзакция завершается перед задачей, и выполнение продолжается в отдельной транзакции фоновым исполнителем", "Задача выполняется быстрее", "Задача пропускается"],
      answer: 0,
      explain: "Асинхронные границы уменьшают размер транзакций и делают повторы управляемыми, особенно перед вызовами внешних систем."
    },
    {
      topic: "BPMN",
      q: "Сервисная задача обращается к внешнему API, который часто отвечает таймаутом. Какая политика разумна?",
      options: ["Ограниченное число повторов с экспоненциальной задержкой, затем инцидент или ветка обработки ошибки", "Бесконечные повторы без задержки", "Игнорировать ошибки"],
      answer: 0,
      explain: "Повторы с backoff защищают и вызывающую, и вызываемую стороны. После лимита нужен явный исход, чтобы процесс не завис."
    },
    {
      topic: "BPMN",
      q: "Что такое инцидент (incident) в исполняемом процессе?",
      options: ["Состояние, когда экземпляр остановлен из-за технической проблемы (исчерпаны повторы), и нужно вмешательство оператора", "Название шлюза", "Тип события"],
      answer: 0,
      explain: "Инцидент — сигнал оператору. После исправления причины задачу можно повторить, не теряя экземпляр."
    },
    {
      topic: "BPMN",
      q: "Что означает «внешняя задача» (external task) при интеграции?",
      options: ["Исполнитель сам забирает задачи у движка, выполняет их и сообщает результат, что снижает связанность", "Задача вне процесса", "Ручная задача"],
      answer: 0,
      explain: "В модели pull воркеры запрашивают работу с блокировкой на время. Это упрощает масштабирование и отказоустойчивость."
    },
    {
      topic: "BPMN",
      q: "Почему в движке важно, чтобы обработчик события «Оплата получена» был идемпотентным?",
      options: ["Сообщения могут приходить повторно, и повторная обработка не должна дважды менять состояние", "Для красоты", "Из-за шрифтов"],
      answer: 0,
      explain: "При гарантии доставки «минимум один раз» дубли неизбежны. Идемпотентность или дедупликация предотвращают двойные эффекты."
    },
    {
      topic: "BPMN",
      q: "Что происходит с запущенными экземплярами при выпуске новой версии схемы?",
      options: ["По умолчанию они продолжают работу по версии, с которой стартовали; миграция на новую версию делается отдельной операцией", "Все сразу переключаются", "Они удаляются"],
      answer: 0,
      explain: "Версионирование защищает активные экземпляры от несовместимых изменений. Миграция требует сопоставления элементов старой и новой схем."
    },
    {
      topic: "BPMN",
      q: "Какое изменение схемы опаснее всего для работающих экземпляров?",
      options: ["Удаление или переименование задачи, на которой уже стоят токены", "Изменение цвета", "Добавление комментария"],
      answer: 0,
      explain: "Токены ссылаются на элементы схемы. Удалённый элемент делает миграцию невозможной без явного маппинга."
    },
    {
      topic: "BPMN",
      q: "Что такое DMN и зачем его связывают с BPMN?",
      options: ["Нотация таблиц решений: вынесение сложных правил из процесса в отдельную модель, удобную для бизнеса", "Нотация схем баз данных", "Нотация диаграмм классов"],
      answer: 0,
      explain: "BPMN отвечает за порядок действий, DMN — за решения. Правила можно менять независимо от схемы."
    },
    {
      topic: "BPMN",
      q: "Чем BPMN-процесс отличается от кейса (CMMN)?",
      options: ["Процесс задаёт порядок шагов заранее, а кейс подходит для слабоструктурированной работы, где порядок определяется ситуацией", "Ничем", "Кейс — это таймер"],
      answer: 0,
      explain: "CMMN описывает цели и допустимые действия для творческой работы, например расследования, когда последовательность заранее неизвестна."
    },
    {
      topic: "BPMN",
      q: "Какая метрика показывает, какой процент заказов проходит весь процесс без ручного вмешательства?",
      options: ["Straight-through processing rate (доля сквозной автоматической обработки)", "Загрузка CPU", "Размер базы"],
      answer: 0,
      explain: "STP измеряет автоматизацию. Её рост снижает стоимость и время обработки."
    },
    {
      topic: "BPMN",
      q: "Что показывает время цикла (cycle time) по сравнению со временем обработки (processing time)?",
      options: ["Cycle time включает ожидания и очереди, а processing time — только активную работу", "Они одинаковы", "Cycle time меньше всегда"],
      answer: 0,
      explain: "Большая разница указывает на ожидания и передачи между ролями — главную точку оптимизации."
    },
    {
      topic: "BPMN",
      q: "Что такое ограничение по SLA в контексте задачи?",
      options: ["Целевое время выполнения, при превышении которого запускаются напоминание и эскалация", "Название исполнителя", "Тип токена"],
      answer: 0,
      explain: "SLA превращается в граничные таймеры и метрики. Он делает требования к срокам частью исполняемой модели."
    },
    {
      topic: "BPMN",
      q: "Почему схему процесса не стоит перегружать деталями?",
      options: ["Диаграмма перестаёт читаться; детали выносят в подпроцессы и документацию, оставляя на уровне процесса главную последовательность", "Из-за ограничений бумаги", "Потому что BPMN запрещает детали"],
      answer: 0,
      explain: "Хорошая практика — 7±2 элемента на уровне и вложенные подпроцессы для деталей."
    },
    {
      topic: "BPMN",
      q: "Как правильно моделировать исключительные ситуации?",
      options: ["Выделять основной (happy path) и обрабатывать исключения граничными событиями и событийными подпроцессами", "Рисовать всё в одной линии", "Не моделировать"],
      answer: 0,
      explain: "Главный сценарий остаётся читаемым, а исключения выносятся в отдельные ветки."
    },
    {
      topic: "BPMN",
      q: "Что такое «процесс как граф состояний»: почему при перемещении по схеме важны токены, а не только стрелки?",
      options: ["Токены определяют, какие элементы активны одновременно; стрелки лишь задают допустимые переходы", "Токены — это пользователи", "Стрелки хранят данные"],
      answer: 0,
      explain: "Семантика исполнения определяется перемещением токенов. Параллелизм и синхронизация понятны именно через них."
    },
    {
      topic: "BPMN",
      q: "Какой подход предотвращает запуск двух экземпляров процесса для одного и того же заказа?",
      options: ["Использовать бизнес-ключ (businessKey) и проверку уникальности при старте", "Ничего: дубликаты допустимы", "Запретить таймеры"],
      answer: 0,
      explain: "Уникальный бизнес-ключ даёт идемпотентный старт: повторная заявка найдёт уже запущенный экземпляр."
    },
    {
      topic: "BPMN",
      q: "Что означает «процесс как код»: хранение схем BPMN в Git?",
      options: ["Версионирование, ревью, откат и автоматическое развёртывание схем вместе с остальным кодом", "Переписывание процессов на Java", "Отказ от схем"],
      answer: 0,
      explain: "XML-представление BPMN хранится в репозитории. Это позволяет применять те же практики качества, что и к коду."
    },
    {
      topic: "BPMN",
      q: "Как повысить надёжность системы, где процесс вызывает несколько внешних сервисов подряд?",
      options: ["Сделать шаги идемпотентными, использовать повторы, таймауты и компенсации, а не надеяться на единую транзакцию", "Объединить сервисы в одну транзакцию БД", "Отключить таймауты"],
      answer: 0,
      explain: "Распределённые транзакции между независимыми системами дороги и ненадёжны. Практика — сага с компенсациями и идемпотентностью."
    },
    {
      topic: "BPMN",
      q: "Что показывает BPMN-диаграмма и чего она не описывает достаточно подробно?",
      options: ["Порядок и условия шагов, но не детали интерфейса, структуру данных и алгоритмы внутри задач", "Только данные", "Только расписание"],
      answer: 0,
      explain: "BPMN фиксирует поток управления. Дополнительные модели (ERD, DMN, спецификации API) описывают данные и логику шагов."
    },
    {
      topic: "BPMN",
      q: "Заявку должны утвердить любые двое из трёх членов комитета. Как это выразить в модели?",
      options: ["Параллельная пользовательская задача (multi-instance) на трёх человек с условием досрочного завершения «два одобрения»", "Три последовательные задачи без условий", "Один XOR-шлюз"],
      answer: 0,
      explain: "Multi-instance поддерживает условие завершения (completion condition): остальные экземпляры отменяются, когда кворум набран."
    },
    {
      topic: "BPMN",
      q: "В каком порядке выполняются компенсации после сбоя на позднем шаге?",
      options: ["Обычно в обратном порядке завершения шагов: последний выполненный шаг отменяется первым", "В случайном порядке", "В прямом порядке"],
      answer: 0,
      explain: "Обратный порядок снижает риск неконсистентности: зависимые действия отменяются раньше тех, от которых они зависели."
    },
    {
      topic: "BPMN",
      q: "Что обозначает подпроцесс-транзакция (рамка с двойной границей)?",
      options: ["Группу шагов, которая должна завершиться целиком или быть отменена; для отмены используют событие отмены и компенсации", "Параллельную задачу", "Подпроцесс-ошибку"],
      answer: 0,
      explain: "Transaction subprocess — бизнес-транзакция. При отмене запускаются компенсации выполненных внутри шагов."
    },
    {
      topic: "BPMN",
      q: "Нужно обрабатывать не более 10 заказов одновременно. Где решается это ограничение?",
      options: ["Чаще всего вне схемы: настройкой пула воркеров, очередей или лимитов движка; в BPMN его выразить трудно", "Параллельным шлюзом", "Конечным событием"],
      answer: 0,
      explain: "Схема описывает логику, а лимиты параллелизма относятся к конфигурации исполнения и инфраструктуры."
    },
    {
      topic: "BPMN",
      q: "Почему стартовое событие по сообщению и промежуточное событие-приёмник требуют разной работы с корреляцией?",
      options: ["Старт создаёт новый экземпляр по любому подходящему сообщению, а приёмник должен найти уже существующий экземпляр по ключу корреляции", "Они не различаются", "Приёмник создаёт экземпляр"],
      answer: 0,
      explain: "Для старта достаточно типа сообщения, а для промежуточного приёма нужен ключ, связывающий сообщение с ожидающим экземпляром."
    },
    {
      topic: "UC",
      q: "Когда альтернативный поток внутри сценария лучше, чем отдельный extend?",
      options: ["Когда отклонение небольшое и является ветвлением того же сценария; extend нужен для отдельного, повторно используемого или независимого поведения", "Всегда extend", "Никогда не писать альтернативы"],
      answer: 0,
      explain: "Extend усложняет диаграмму. Для небольших ветвлений достаточно альтернативного потока в тексте, а extend — для самостоятельных, переиспользуемых расширений."
    },
    {
      topic: "UC",
      q: "Допустимы ли циклические include (A включает B, B включает A)?",
      options: ["Нет: это приведёт к бесконечной рекурсии и неопределённому поведению", "Да", "Только для актёров"],
      answer: 0,
      explain: "Включения образуют направленный граф без циклов. Цикл означает, что базовый вариант использования не может быть завершён."
    },
    {
      topic: "UC",
      q: "Почему цепочки include глубиной более двух-трёх уровней — плохой знак?",
      options: ["Диаграмма превращается в функциональную декомпозицию, и теряется смысл пользовательских целей", "Они запрещены синтаксисом", "Они замедляют систему"],
      answer: 0,
      explain: "Глубокие иерархии include — признак того, что use case описывают шагами реализации, а не целями актёров."
    },
    {
      topic: "UC", uc: "shop",
      q: "«Войти в систему» подключено include только к «Оформить заказ», но в реальности нужно ещё и к «Просмотреть заказы». Что делать со всеми будущими функциями?",
      options: ["Включать авторизацию во все варианты использования, требующие входа", "Записать авторизацию в предусловие или общие правила, чтобы не загромождать диаграмму повторяющимися include", "Игнорировать"],
      answer: 1,
      explain: "Сквозные ограничения вроде «пользователь авторизован» удобнее фиксировать в предусловии или отдельном разделе требований, а не рисовать include на каждом овале."
    },
    {
      topic: "UC",
      q: "Чем бизнес-вариант использования отличается от системного?",
      options: ["Бизнес-вариант описывает деятельность организации и её цели, системный — взаимодействие с конкретной программной системой", "Ничем", "Бизнес-вариант не имеет актёров"],
      answer: 0,
      explain: "Уровни моделирования разные: бизнес-процессы организации и функциональные требования к ИТ-системе. Их связывают, но не смешивают."
    },
    {
      topic: "UC",
      q: "Что такое misuse case (антисценарий)?",
      options: ["Сценарий действий злоумышленника или ошибочного использования, которое система должна предотвращать", "Некорректный вариант использования", "Расширение с ошибкой"],
      answer: 0,
      explain: "Misuse cases помогают выявлять требования безопасности: подбор PIN, подделка данных, отказ в обслуживании."
    },
    {
      topic: "UC", uc: "atm",
      q: "Какой misuse case логично добавить для банкомата?",
      options: ["«Подобрать PIN-код» злоумышленником, который должен предотвращаться блокировкой карты после попыток", "«Распечатать чек»", "«Показать баланс»"],
      answer: 0,
      explain: "Антисценарий делает риск видимым и приводит к требованию: ограничить число попыток ввода PIN."
    },
    {
      topic: "UC",
      q: "Где фиксировать нефункциональные требования, относящиеся к конкретному варианту использования?",
      options: ["В разделе дополнительных требований (например, время отклика) спецификации этого варианта", "В названии овала", "В названии актёра"],
      answer: 0,
      explain: "Диаграмма показывает функции, а ограничения качества записывают рядом: производительность, безопасность, удобство."
    },
    {
      topic: "UC",
      q: "Что такое матрица трассировки в контексте use case?",
      options: ["Таблица связей требований, вариантов использования, элементов дизайна и тестов", "Таблица актёров", "Список задач разработчиков"],
      answer: 0,
      explain: "Трассировка позволяет увидеть, какие требования покрыты, и оценить влияние изменений."
    },
    {
      topic: "UC",
      q: "Для чего применяется метод Use Case Points?",
      options: ["Для оценки трудоёмкости по сложности актёров и вариантов использования с учётом технических и окружающих факторов", "Для расчёта зарплаты", "Для проверки орфографии"],
      answer: 0,
      explain: "UCP взвешивает актёров и сценарии, затем корректирует результат по факторам. Это один из методов ранней оценки проекта."
    },
    {
      topic: "UC",
      q: "Какого актёра в методе UCP считают сложным?",
      options: ["Человека, взаимодействующего через графический интерфейс", "Внешнюю систему с простым API", "Нет актёров"],
      answer: 0,
      explain: "Простой актёр — другая система через программный интерфейс, средний — протокол или текстовый интерфейс, сложный — человек с GUI."
    },
    {
      topic: "UC",
      q: "Как в UCP обычно оценивают сложность варианта использования?",
      options: ["По числу транзакций (шагов обмена между актёром и системой)", "По длине названия", "По числу актёров на диаграмме"],
      answer: 0,
      explain: "Чем больше транзакций в сценарии, тем сложнее use case и выше вес."
    },
    {
      topic: "UC",
      q: "Когда допустимо объединить создание, просмотр, изменение и удаление в «Управлять справочником»?",
      options: ["Если сценарии тривиальны и одинаковы по цели и правам; иначе лучше разделять варианты с разными правилами и ролями", "Всегда", "Никогда"],
      answer: 0,
      explain: "CRUD-обобщение допускается для простых справочников. Если операции имеют разные правила и актёров, их стоит описывать отдельно."
    },
    {
      topic: "UC",
      q: "Как правильно разбивать слишком крупный вариант использования?",
      options: ["По самостоятельным целям актёра, а не по шагам интерфейса", "По экранам", "По таблицам базы данных"],
      answer: 0,
      explain: "Цель — критерий. Экранные шаги и таблицы относятся к реализации."
    },
    {
      topic: "UC",
      q: "Как соотносятся эпики, истории и варианты использования?",
      options: ["Вариант использования близок к эпику или группе историй, а отдельные сценарии и ветки порождают истории и критерии приёмки", "Это то же самое", "Вариант использования всегда меньше истории"],
      answer: 0,
      explain: "Use case структурирует поведение вокруг цели актёра, из него легко получать истории для планирования."
    },
    {
      topic: "UC",
      q: "Датчик температуры автоматически вызывает аварийное отключение. Как это показать?",
      options: ["Актёр «Датчик» как основной инициатор варианта «Аварийно отключить оборудование»", "Только внутренний вариант использования без актёра", "Нельзя показать"],
      answer: 0,
      explain: "Устройства и таймеры — полноправные актёры: у сценария должен быть инициатор вне системы."
    },
    {
      topic: "UC",
      q: "Система состоит из нескольких подсистем. Как отразить границы на диаграмме?",
      options: ["Несколько границ (пакетов) с общими актёрами, либо отдельные диаграммы на подсистему с описанием интерфейсов между ними", "Игнорировать", "Использовать один овал"],
      answer: 0,
      explain: "На каждом уровне должно быть понятно, что внутри, а что снаружи. Для больших систем используют декомпозицию по подсистемам."
    },
    {
      topic: "UC",
      q: "Чем актёр отличается от роли доступа (RBAC) в системе?",
      options: ["Актёр описывает бизнес-роль во взаимодействии, а роль доступа — набор технических прав; они пересекаются, но не обязательно совпадают", "Это одно и то же", "Роль доступа — это use case"],
      answer: 0,
      explain: "Один актёр может соответствовать нескольким ролям доступа и наоборот. Разделение помогает не путать функциональность и безопасность."
    },
    {
      topic: "UC",
      q: "Как можно дополнить диаграмму, чтобы проверить права ролей на функции?",
      options: ["Матрица «актёр × вариант использования» с указанием разрешений", "Ещё одна диаграмма классов", "Цветом"],
      answer: 0,
      explain: "Матрица прав компактна и удобна для проверки полноты: пустые ячейки показывают пробелы."
    },
    {
      topic: "UC",
      q: "Что произойдёт с трассировкой, если изменился основной сценарий варианта использования?",
      options: ["Нужно проверить связанные тесты, элементы дизайна и API; матрица трассировки показывает затронутые элементы", "Ничего", "Всё удалится"],
      answer: 0,
      explain: "Изменение требования распространяется на связанные артефакты. Трассировка снижает риск забыть что-то обновить."
    },
    {
      topic: "UC",
      q: "Как соотносится вариант использования с эндпоинтами API?",
      options: ["Один вариант может вызывать несколько запросов, а один эндпоинт — обслуживать несколько вариантов; прямого соответствия «один к одному» нет", "Один use case — один эндпоинт всегда", "Никак"],
      answer: 0,
      explain: "Use case описывает цель, API — техническую реализацию. Соответствие нужно фиксировать отдельно, например в трассировке."
    },
    {
      topic: "UC",
      q: "Как соотносятся вариант использования и BPMN-процесс?",
      options: ["Процесс может объединять несколько вариантов использования и участников, а use case описывает взаимодействие одного актёра с системой для одной цели", "Это одно и то же", "BPMN заменяет use case"],
      answer: 0,
      explain: "BPMN показывает сквозной порядок действий в организации, а use case — функциональность системы с точки зрения актёров."
    },
    {
      topic: "UC",
      q: "Как связаны сценарии вариантов использования с ERD?",
      options: ["Данные, которые шаги сценариев читают и создают, подсказывают сущности и атрибуты модели данных", "Никак", "ERD строится из названия актёров"],
      answer: 0,
      explain: "Анализ существительных в сценариях и требований к данным помогает проектировать структуру хранения."
    },
    {
      topic: "UC",
      q: "Чем предусловие отличается от включаемого варианта использования для проверки авторизации?",
      options: ["Предусловие фиксирует состояние, в котором сценарий начинается; include — часть сценария, выполняемая внутри него", "Ничем", "Предусловие — это актёр"],
      answer: 0,
      explain: "Если вход выполнен заранее, достаточно предусловия. Если процесс входа — часть сценария, используют include."
    },
    {
      topic: "UC",
      q: "Что такое гарантии успеха и минимальные гарантии (по Коберну)?",
      options: ["Success guarantee — что истинно при успешном завершении, minimal guarantee — что система обеспечит даже при неудаче", "Гарантии оплаты", "Гарантии на оборудование"],
      answer: 0,
      explain: "Минимальные гарантии (например, «деньги не списаны дважды») важны для сценариев с отказами и повторами."
    },
    {
      topic: "UC",
      q: "Чем «полностью описанный» (fully dressed) вариант использования отличается от «лёгкого» (casual)?",
      options: ["Подробным шаблоном: актёры, предусловия, потоки, гарантии, нефункциональные требования; лёгкий — коротким описанием", "Количеством актёров", "Цветом"],
      answer: 0,
      explain: "Степень формальности выбирают по риску и сложности. Критичные функции описывают подробно."
    },
    {
      topic: "UC",
      q: "Что такое уровни целей по Коберну?",
      options: ["Классификация вариантов использования от бизнес-стратегии («облако») до отдельных подфункций («рыба», «моллюск»); основной уровень — «уровень моря»", "Уровни доступа", "Версии системы"],
      answer: 0,
      explain: "Уровень моря — пользовательская цель, достигаемая за один сеанс, и именно он лучше всего подходит для диаграммы."
    },
    {
      topic: "UC",
      q: "Как называется целевой уровень описания для основной диаграммы use case?",
      options: ["Уровень моря (user goal): цель пользователя за один сеанс", "Уровень облака", "Уровень клама"],
      answer: 0,
      explain: "Слишком высокие уровни абстрактны, слишком низкие — шаги интерфейса. Уровень моря даёт баланс."
    },
    {
      topic: "UC",
      q: "Что необходимо задать для корректного extend?",
      options: ["Точку расширения и условие, при котором расширение выполняется", "Только стрелку", "Только имя актёра"],
      answer: 0,
      explain: "Без условия и точки расширения поведение неоднозначно. Они описываются в спецификации базового варианта."
    },
    {
      topic: "UC",
      q: "Может ли один вариант использования расширять несколько базовых?",
      options: ["Да: расширение, например «Распечатать чек», может подключаться к разным вариантам использования", "Нет", "Только по include"],
      answer: 0,
      explain: "Extend — зависимость расширения от базового. У одного расширения может быть несколько базовых вариантов."
    },
    {
      topic: "UC",
      q: "Когда следует выбирать генерализацию варианта использования вместо include?",
      options: ["Когда дочерний вариант — специализированный способ достичь той же цели, а не общая часть нескольких", "Для любой связи", "Никогда"],
      answer: 0,
      explain: "Генерализация выражает «является частным случаем», include — «использует как часть»."
    },
    {
      topic: "UC",
      q: "Как адаптировать диаграмму для заказчика, а не для разработчиков?",
      options: ["Оставить цели и роли, убрать технические варианты и мелкие include, использовать понятные названия", "Добавить все шаги", "Добавить схемы классов"],
      answer: 0,
      explain: "Для бизнеса важны цели и роли. Технические детали лишь отвлекают."
    },
    {
      topic: "UC",
      q: "Как проверить полноту модели вариантов использования?",
      options: ["Сопоставить функциональные требования с вариантами использования: каждое требование покрыто хотя бы одним, а каждый вариант обоснован требованием", "Подсчитать овалы", "Спросить разработчика"],
      answer: 0,
      explain: "Двусторонняя проверка выявляет и пропущенные функции, и лишние."
    },
    {
      topic: "UC",
      q: "Что означает вариант использования без единого актёра?",
      options: ["Ошибку модели: у любой функциональности должен быть инициатор или участник вне системы", "Это нормально", "Скрытый актёр базы данных"],
      answer: 0,
      explain: "Если инициатор неизвестен, возможно, это внутренняя функция или недостающий актёр (таймер, внешняя система)."
    },
    {
      topic: "UC",
      q: "Что означает актёр, не связанный ни с одним вариантом использования?",
      options: ["Лишний или забытый элемент: актёр должен участвовать хотя бы в одном сценарии", "Всё нормально", "Это второстепенный актёр"],
      answer: 0,
      explain: "Незадействованный актёр указывает на лишнюю роль или пропущенные требования."
    },
    {
      topic: "UC",
      q: "Что делать, если «Создать заказ» и «Оформить заказ» описывают одно и то же?",
      options: ["Объединить в один с единым названием: дубликаты запутывают требования и тесты", "Оставить оба", "Поменять местами"],
      answer: 0,
      explain: "Синонимы в названиях приводят к рассогласованности. Словарь терминов помогает держать единые имена."
    },
    {
      topic: "UC",
      q: "Чем опасно большое количество вариантов вида «Управлять …»?",
      options: ["Скрывается реальный состав функций, непонятны права и сценарии; их лучше конкретизировать", "Ничем", "Это ускоряет разработку"],
      answer: 0,
      explain: "Обобщённые «Управлять…» не позволяют оценить объём и покрыть тестами. Нужны конкретные цели."
    },
    {
      topic: "UC",
      q: "Ночью система архивирует старые заказы без вмешательства человека. Что на диаграмме?",
      options: ["Актёр «Планировщик» (время) инициирует вариант «Архивировать заказы»", "Вариант без актёра", "Ничего не нужно"],
      answer: 0,
      explain: "Автоматические действия по расписанию моделируют временным актёром."
    },
    {
      topic: "UC",
      q: "Какое минимальное покрытие тестами для варианта использования считается разумным?",
      options: ["Основной сценарий и каждый альтернативный и исключительный поток", "Только основной", "Только исключения"],
      answer: 0,
      explain: "Каждый поток — отдельное поведение. Покрытие по потокам помогает не пропустить ошибочные ситуации."
    },
    {
      topic: "UC", uc: "hotel",
      q: "Администратор и гость используют разные части системы. Как проверить, что права не пересекаются нежелательно?",
      options: ["Построить матрицу актёров и вариантов использования и согласовать с заказчиком", "Рисовать цветом", "Не проверять"],
      answer: 0,
      explain: "Матрица прав делает пересечения явными. Особенно важно для функций типа «Отменить бронь» и «Выставить счёт»."
    },
    {
      topic: "UC", uc: "helpdesk",
      q: "«Эскалировать обращение» расширяет «Обработать обращение». Какое условие и точку расширения стоит описать?",
      options: ["Условие «срок обработки истёк» и точку расширения в шаге обработки", "Никакого условия не нужно", "Только имя актёра"],
      answer: 0,
      explain: "Описание условия и места вставки делает extend однозначным и тестируемым."
    },
    {
      topic: "UC", uc: "mbank",
      q: "«Подтвердить операцию» включено и в перевод, и в оплату. Что это даёт реализации?",
      options: ["Единый переиспользуемый механизм подтверждения (например, 2FA) и общие требования к нему", "Нужно реализовать два раза", "Ничего"],
      answer: 0,
      explain: "Общий включаемый вариант использования указывает на общий компонент, а изменения требований вносятся в одном месте."
    },
    {
      topic: "UC", uc: "clinic",
      q: "Врач и регистратор используют разные функции, но оба видят расписание. Как отразить без дублирования?",
      options: ["Общий вариант использования «Просмотреть расписание» с двумя ассоциациями", "Дублировать вариант", "Убрать расписание"],
      answer: 0,
      explain: "Один вариант использования может иметь нескольких актёров, если цель общая."
    },
    {
      topic: "UC", uc: "elearn",
      q: "Платформа должна отправлять сертификат по завершении курса через внешний сервис. Как это выглядит на диаграмме?",
      options: ["Внешний сервис — вторичный актёр варианта «Выдать сертификат» (расширение «Завершить курс»)", "Сервис — вариант использования", "Это не отражается"],
      answer: 0,
      explain: "Новая функциональность добавляется как вариант использования, а внешний сервис — актёром. Условие (курс пройден) описывает extend."
    },
    {
      topic: "UC", uc: "delivery",
      q: "Клиент и курьер должны видеть статус доставки. Какой подход не раздувает диаграмму?",
      options: ["Один вариант «Отследить доставку» с двумя актёрами; детали ролей — в сценарии", "Отдельный овал для каждой роли с одинаковым названием", "Только текст"],
      answer: 0,
      explain: "Одинаковая цель — один вариант. Различия видимых данных описывают в спецификации."
    },
    {
      topic: "UC", uc: "library",
      q: "«Проверить билет» выполняется и читателем, и библиотекарём. Что стоит уточнить в спецификации?",
      options: ["Кто инициирует проверку и какие альтернативы возможны (билет просрочен, утерян)", "Ничего", "Только дату"],
      answer: 0,
      explain: "Для общих вариантов использования важно понимать, кто в каком контексте их выполняет и как обрабатываются отклонения."
    },
    {
      topic: "UC", uc: "bad_model",
      q: "Как переработать диаграмму с «Базой данных» и кнопками?",
      options: ["Заменить на цели пользователей («Войти», «Сохранить документ»), убрать связь актёров, добавить генерализацию при необходимости", "Оставить", "Добавить include"],
      answer: 0,
      explain: "Цель — модель функциональности с точки зрения актёров, без реализации и интерфейса."
    },
    {
      topic: "UC", uc: "shop",
      q: "Нужно добавить функцию «Купить без регистрации». Какой вопрос задать о существующей модели?",
      options: ["Не противоречит ли она include «Войти в систему» и как изменятся предусловия «Оформить заказ»", "Никакого", "Сколько стоит"],
      answer: 0,
      explain: "Новая функция влияет на существующие связи и предусловия. Анализ влияния помогает не нарушить обязательность включений."
    },
    {
      topic: "UC", uc: "uc_gen",
      q: "Нужно добавить способ оплаты «Оплатить по счёту». Какие изменения минимальны?",
      options: ["Добавить ещё один дочерний вариант использования к «Оплатить заказ»", "Переписать всю диаграмму", "Добавить актёра"],
      answer: 0,
      explain: "Обобщение позволяет расширять набор способов без изменения общего варианта использования."
    },
    {
      topic: "UC",
      q: "Как вести версии варианта использования, если сценарий уже реализован и меняется?",
      options: ["Хранить версию спецификации, анализировать влияние на тесты, API и документацию и согласовывать изменение с заказчиком", "Переписывать молча", "Удалять старые версии"],
      answer: 0,
      explain: "Изменение сценария в работающей системе затрагивает связанные артефакты. Версионирование и анализ влияния делают его управляемым."
    },
    {
      topic: "SEQ", seq: "retry",
      q: "Что произойдёт, если сервис отвечает 503 и клиент повторяет запрос немедленно во всех циклах?",
      options: ["Клиенты создадут лавину повторов и усугубят перегрузку; нужны экспоненциальная задержка и jitter", "Ничего", "Сервис ускорится"],
      answer: 0,
      explain: "Синхронные повторы без пауз усиливают отказ. Backoff с случайным разбросом размазывает нагрузку."
    },
    {
      topic: "SEQ", seq: "retry",
      q: "Почему POST /pay нельзя безопасно повторять без дополнительных мер?",
      options: ["Повтор после потерянного ответа может создать второй платёж; нужен ключ идемпотентности", "Он слишком быстрый", "Он запрещён"],
      answer: 0,
      explain: "Клиент не знает, выполнен ли первый запрос. Ключ идемпотентности делает повтор безопасным."
    },
    {
      topic: "SEQ", seq: "retry",
      q: "Как изменить диаграмму, чтобы показать защиту от дубликатов?",
      options: ["Добавить в сообщение ключ идемпотентности и ветку «ключ уже обработан» с возвратом прежнего результата", "Убрать цикл", "Добавить участника «Клиент2»"],
      answer: 0,
      explain: "Диаграмма должна показывать механизм защиты, а не только повторы."
    },
    {
      topic: "SEQ", seq: "saga",
      q: "Что произойдёт, если сервис оплаты недоступен в момент компенсации «вернуть платёж»?",
      options: ["Компенсацию нужно повторять до успеха (она должна быть идемпотентной) или передать ручной обработке", "Ничего не нужно", "Заказ уничтожится"],
      answer: 0,
      explain: "Компенсации тоже могут падать. Их проектируют повторяемыми и отслеживают как отдельные состояния саги."
    },
    {
      topic: "SEQ", seq: "saga",
      q: "Чем оркестрация саги отличается от хореографии?",
      options: ["В оркестрации центральный участник управляет шагами и компенсациями, в хореографии сервисы реагируют на события друг друга", "Ничем", "Оркестрация только для БД"],
      answer: 0,
      explain: "Оркестратор облегчает отслеживание и отладку, хореография снижает связанность, но усложняет понимание потока."
    },
    {
      topic: "SEQ", seq: "saga",
      q: "Почему диаграмма саги должна показывать порядок компенсаций?",
      options: ["Компенсации обычно выполняются в обратном порядке, и от него зависит согласованность", "Не должна", "Порядок не важен"],
      answer: 0,
      explain: "Обратный порядок снижает риск, что зависимое действие останется без основания."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Сервис заказов записал заказ в БД, но упал до публикации события. Что потеряется?",
      options: ["Событие: нужен паттерн outbox, при котором событие сохраняется вместе с заказом и отправляется отдельным процессом", "Ничего", "Заказ"],
      answer: 0,
      explain: "Запись в БД и публикация в брокер — не атомарная пара. Outbox делает отправку надёжной."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Какую гарантию доставки обычно дают брокеры по умолчанию?",
      options: ["Минимум один раз: возможны дубликаты, поэтому нужны идемпотентные потребители", "Ровно один раз всегда", "Максимум один раз всегда"],
      answer: 0,
      explain: "Ровно один раз добиваются сочетанием «минимум один раз» и идемпотентной обработки."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Сообщения «OrderCreated» и «OrderCancelled» одного заказа пришли в обратном порядке. Что нужно?",
      options: ["Ключ партиции или версии события и обработка с проверкой порядка", "Ничего", "Отключить брокер"],
      answer: 0,
      explain: "Порядок гарантируется внутри партиции. Версия события позволяет игнорировать устаревшие."
    },
    {
      topic: "SEQ", seq: "async",
      q: "Что такое ограничение 'poison message' и как с ним бороться?",
      options: ["Сообщение, которое постоянно не обрабатывается; его отправляют в очередь недоставленных (DLQ) после лимита попыток", "Вирус", "Пустое сообщение"],
      answer: 0,
      explain: "Без DLQ сломанное сообщение блокирует очередь. После лимита повторов его изолируют для разбора."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Токен проверяется при каждом запросе вызовом сервиса авторизации. Какое архитектурное узкое место возникает?",
      options: ["Сервис авторизации становится единой точкой отказа и задержки; помогают локальная проверка JWT и кэш", "Нет проблем", "Шлюз перестанет работать"],
      answer: 0,
      explain: "Зависимость на горячем пути должна быть отказоустойчивой или заменена локальной проверкой подписи."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Что стоит добавить на диаграмму для защиты от перегрузки на шлюзе?",
      options: ["Ограничение частоты запросов (rate limiting) с ответом 429", "Ничего", "Ещё один сервис заказов"],
      answer: 0,
      explain: "Лимитирование — стандартная функция шлюза. Ответ 429 с Retry-After управляет поведением клиентов."
    },
    {
      topic: "SEQ", seq: "gateway",
      q: "Сервис заказов отвечает медленно. Какой механизм на шлюзе предотвратит каскад отказов?",
      options: ["Таймаут и выключатель цепи (circuit breaker): после серии ошибок вызовы временно прекращаются", "Бесконечное ожидание", "Удвоение запросов"],
      answer: 0,
      explain: "Circuit breaker быстро возвращает ошибку или запасной ответ и даёт сервису восстановиться."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Как заменить опрос статуса отчёта на более эффективный механизм?",
      options: ["Вебхук или серверные события (SSE): сервер сам уведомляет о готовности", "Увеличить частоту опроса", "Убрать статус"],
      answer: 0,
      explain: "Push-уведомления устраняют лишние запросы и задержку между готовностью и обнаружением."
    },
    {
      topic: "SEQ", seq: "poll",
      q: "Идентификатор задачи 42 перебирает посторонний пользователь. Что упущено?",
      options: ["Проверка прав доступа к ресурсу: идентификатор не должен давать доступ чужим данным", "Ничего", "Цикл"],
      answer: 0,
      explain: "Нужна авторизация на уровне объекта (BOLA/IDOR). Идентификатор — не секрет."
    },
    {
      topic: "SEQ", seq: "parallel",
      q: "Один из параллельных запросов упал. Что нужно решить в модели?",
      options: ["Политику частичного отказа: вернуть результат без отзывов, повторить или вернуть ошибку; зафиксировать её в диаграмме", "Ничего", "Удалить par"],
      answer: 0,
      explain: "Параллельные вызовы порождают режимы частичного отказа. Они должны быть явными (alt внутри операндов)."
    },
    {
      topic: "SEQ", seq: "parallel",
      q: "Как ограничить время всего параллельного блока?",
      options: ["Задать общий дедлайн, при превышении которого операнды прерываются", "Ждать бесконечно", "Увеличить число операндов"],
      answer: 0,
      explain: "Общий таймаут (deadline) предотвращает ожидание самого медленного участника."
    },
    {
      topic: "SEQ", seq: "create_destroy",
      q: "Что произойдёт, если сессия не будет уничтожена при ошибке?",
      options: ["Утечка ресурсов; надёжное освобождение обеспечивают конструкции вроде try/finally или таймаут жизни", "Ничего", "Сессия удалится сама всегда"],
      answer: 0,
      explain: "Диаграмма должна показывать освобождение и в ветке ошибки. Иначе остаются висящие ресурсы."
    },
    {
      topic: "SEQ",
      q: "Что такое двухфазная фиксация (2PC) и чем плоха в микросервисах?",
      options: ["Координатор спрашивает всех участников и затем фиксирует; блокирующие ожидания и единая точка отказа снижают доступность, поэтому чаще применяют саги", "Это тип HTTP", "Это шифрование"],
      answer: 0,
      explain: "2PC обеспечивает атомарность ценой блокировок и зависимости от координатора. В распределённых системах её применяют редко."
    },
    {
      topic: "SEQ",
      q: "Что такое выключатель цепи (circuit breaker) в терминах последовательности?",
      options: ["Прокси перед зависимостью: после серии ошибок он быстро отказывает вызовам, затем пробует восстановление (half-open)", "Выключатель питания", "Тип сообщения"],
      answer: 0,
      explain: "Состояния closed, open и half-open управляют потоком запросов к проблемной зависимости."
    },
    {
      topic: "SEQ",
      q: "Что такое паттерн «запрос–ответ через очередь»?",
      options: ["Клиент отправляет сообщение с идентификатором корреляции и очередью ответа, затем ждёт ответ асинхронно", "Синхронный вызов", "Рассылка"],
      answer: 0,
      explain: "Корреляционный идентификатор связывает ответ с запросом. Это приём для RPC поверх брокера."
    },
    {
      topic: "SEQ",
      q: "Как на диаграмме показать идемпотентный потребитель?",
      options: ["Проверкой «уже обработано» по идентификатору сообщения: alt с пропуском дубликата", "Ничего", "Цикл"],
      answer: 0,
      explain: "Явная ветка для повтора документирует защиту от дубликатов."
    },
    {
      topic: "SEQ",
      q: "Что показывает диаграмма последовательности для OAuth2 Authorization Code с PKCE?",
      options: ["Обмен между приложением, браузером, сервером авторизации и API: код авторизации, затем обмен кода на токен с code_verifier", "Только вход", "Только API"],
      answer: 0,
      explain: "Диаграмма хорошо описывает поток из нескольких участников, где важен порядок шагов."
    },
    {
      topic: "SEQ",
      q: "Почему в потоке OAuth2 токен нельзя передавать через URL браузера?",
      options: ["URL попадает в историю, логи и заголовок Referer; токены передают в заголовке или теле запроса", "Из-за длины", "Это быстро"],
      answer: 0,
      explain: "Утечка токена через URL — типичная проблема. Для кода авторизации используют PKCE и короткое время жизни."
    },
    {
      topic: "SEQ",
      q: "Как устроен паттерн CQRS на диаграмме последовательности?",
      options: ["Команда идёт в модель записи, события обновляют модель чтения, запросы обслуживаются моделью чтения; чтение может отставать", "Одна общая модель", "Только запросы"],
      answer: 0,
      explain: "Раздельные модели ускоряют чтение, но вносят отложенную согласованность."
    },
    {
      topic: "SEQ",
      q: "Что такое event sourcing с точки зрения последовательности?",
      options: ["Состояние восстанавливается воспроизведением журнала событий, а не хранится только текущим значением", "Рассылка писем", "Тип таймера"],
      answer: 0,
      explain: "Журнал событий — источник истины. Он даёт аудит и возможность перестроить состояние."
    },
    {
      topic: "SEQ",
      q: "Что показывает слово «sd» перед названием диаграммы?",
      options: ["Рамка диаграммы взаимодействия (sequence diagram) с именем", "Тип сообщения", "Тип участника"],
      answer: 0,
      explain: "В UML диаграмма заключается в рамку с префиксом sd и названием."
    },
    {
      topic: "SEQ",
      q: "Что такое «gate» (шлюз) на границе фрагмента?",
      options: ["Точка, через которую сообщение входит или выходит из диаграммы или фрагмента", "Участник", "Условие"],
      answer: 0,
      explain: "Gate связывает внутреннее взаимодействие с внешним контекстом при использовании ref."
    },
    {
      topic: "SEQ",
      q: "Что такое coregion?",
      options: ["Область линии жизни, где порядок входящих или исходящих сообщений не определён", "Группа участников", "Тип таймера"],
      answer: 0,
      explain: "Coregion — способ показать неупорядоченность на одной линии жизни без полноценного par."
    },
    {
      topic: "SEQ",
      q: "Чем строгое упорядочение (strict) отличается от слабого (seq) в UML?",
      options: ["Strict требует порядка между всеми операндами по времени, seq — только на общих линиях жизни", "Ничем", "Strict для асинхронных"],
      answer: 0,
      explain: "Операторы seq и strict задают разный порядок исполнения операндов. По умолчанию применяется слабое упорядочение."
    },
    {
      topic: "SEQ",
      q: "Что такое диаграмма обзора взаимодействий?",
      options: ["Диаграмма, где узлы — целые взаимодействия, а потоки управления между ними как в диаграмме активностей", "Диаграмма классов", "Диаграмма состояний"],
      answer: 0,
      explain: "Обзор взаимодействий показывает порядок сценариев высокого уровня."
    },
    {
      topic: "SEQ",
      q: "Как использовать диаграммы последовательности при разработке тестов?",
      options: ["Ветви и фрагменты дают сценарии для интеграционных и приёмочных тестов, включая ветки ошибок", "Не используют", "Только для документации"],
      answer: 0,
      explain: "Каждая ветвь alt и каждое исключение — кандидат в тест-кейс."
    },
    {
      topic: "SEQ",
      q: "Как проверить соответствие диаграммы последовательности реализации?",
      options: ["Сравнить с трассировкой запросов (distributed tracing): реальный порядок вызовов должен совпадать", "Не проверять", "Сравнить цвета"],
      answer: 0,
      explain: "Трассировки показывают фактическую последовательность и позволяют находить расхождения и лишние вызовы."
    },
    {
      topic: "SEQ",
      q: "Что такое «болтливый» (chatty) интерфейс на диаграмме?",
      options: ["Множество мелких вызовов вместо одного агрегирующего, что увеличивает задержки и нагрузку", "Интерфейс с комментариями", "Асинхронный интерфейс"],
      answer: 0,
      explain: "Диаграмма помогает увидеть избыточные обмены и спроектировать пакетные или агрегирующие вызовы."
    },
    {
      topic: "SEQ",
      q: "Как диаграмма помогает найти проблему N+1?",
      options: ["Видно, что в цикле выполняется отдельный запрос на каждый элемент; решение — пакетная выборка", "Не помогает", "Показывает память"],
      answer: 0,
      explain: "Повторяющиеся запросы в loop — признак N+1. Их заменяют одним запросом или JOIN."
    },
    {
      topic: "SEQ",
      q: "Что показывает распределённая трассировка и чем она связана с диаграммами последовательности?",
      options: ["Она фиксирует реальные вызовы между сервисами с временем и порядком; по ней можно автоматически строить диаграммы последовательности", "Ничего", "Только ошибки"],
      answer: 0,
      explain: "Trace id пронизывает вызовы. Инструменты визуализации превращают трассировки в схемы, похожие на последовательности."
    },
    {
      topic: "SEQ",
      q: "Какие инструменты позволяют хранить диаграммы последовательности как код?",
      options: ["PlantUML и Mermaid: диаграммы описываются текстом и версионируются вместе с кодом", "Только графические редакторы", "Таблицы"],
      answer: 0,
      explain: "Текстовые форматы удобны для ревью, диффов и автоматической генерации документации."
    },
    {
      topic: "SEQ",
      q: "Почему диаграмма с 15 участниками плохо читается?",
      options: ["Слишком широкая, теряется фокус; её разбивают на уровни или по сценариям", "Хорошо читается", "Слишком короткая"],
      answer: 0,
      explain: "Диаграмма должна нести одну идею. Для сложных систем рисуют обзор и детализацию."
    },
    {
      topic: "SEQ",
      q: "Что такое «happy path» и почему его недостаточно?",
      options: ["Успешный сценарий; без веток ошибок и таймаутов диаграмма не показывает реальное поведение системы", "Тип участника", "Тип стрелки"],
      answer: 0,
      explain: "Ошибки, повторы и компенсации определяют надёжность и должны быть отражены хотя бы для критичных сценариев."
    },
    {
      topic: "SEQ",
      q: "Что такое компенсирующая транзакция?",
      options: ["Действие, которое логически отменяет эффект ранее выполненного шага", "Повтор платежа", "Блокировка"],
      answer: 0,
      explain: "Компенсация применяется в сагах вместо отката. Она должна быть идемпотентной и доступной для повторов."
    },
    {
      topic: "SEQ",
      q: "Как показать на диаграмме, что вызов идемпотентен?",
      options: ["Пояснением или заметкой и ключом идемпотентности в сообщении; поведение при повторе — отдельная ветка", "Нельзя", "Цветом"],
      answer: 0,
      explain: "Идемпотентность — свойство контракта, и её фиксируют в описании сообщения и ветках повторов."
    },
    {
      topic: "SEQ",
      q: "Какое преимущество даёт асинхронное взаимодействие при пиковой нагрузке?",
      options: ["Очередь сглаживает пики: потребители обрабатывают сообщения в своём темпе", "Нет преимуществ", "Увеличивает пики"],
      answer: 0,
      explain: "Буферизация позволяет выдерживать краткие всплески, не отказывая отправителю."
    },
    {
      topic: "SEQ",
      q: "Что такое обратное давление (backpressure)?",
      options: ["Механизм, при котором потребитель сообщает отправителю замедлиться, чтобы не переполнять очередь", "Давление воздуха", "Тип ошибки"],
      answer: 0,
      explain: "Без backpressure очереди растут бесконечно. Ограничения и отказ при переполнении защищают систему."
    },
    {
      topic: "SEQ",
      q: "Для чего нужен идентификатор корреляции (correlation id) в сообщениях?",
      options: ["Связывать запрос, ответ и связанные события в логах и трассировках", "Шифровать данные", "Увеличивать скорость"],
      answer: 0,
      explain: "Сквозной идентификатор позволяет восстановить цепочку сообщений при расследовании инцидентов."
    },
    {
      topic: "SEQ",
      q: "Что такое eventual consistency на диаграмме последовательности?",
      options: ["Состояние участников согласуется не мгновенно: после сообщения данные у получателей обновятся позже", "Мгновенная согласованность", "Ошибка"],
      answer: 0,
      explain: "Асинхронные обновления приводят к временным расхождениям. Клиенты и UI должны допускать лаг."
    },
    {
      topic: "SEQ",
      q: "Почему не стоит показывать на одной диаграмме все ветви обработки ошибок всех шагов?",
      options: ["Она станет нечитаемой; ошибки разбирают по критичным шагам или на отдельных диаграммах", "Это запрещено", "Ошибок нет"],
      answer: 0,
      explain: "Выбирайте уровень детализации под аудиторию. Типовые ошибки описывают общей политикой."
    },
    {
      topic: "SEQ",
      q: "Что такое «chatty vs chunky» и как это связано с производительностью?",
      options: ["Много мелких вызовов против малого числа крупных: крупные уменьшают накладные расходы сети", "Размер шрифта", "Тип шифрования"],
      answer: 0,
      explain: "Каждый вызов через сеть дорог. Агрегация сокращает число обменов, но может передавать лишние данные."
    },
    {
      topic: "SEQ",
      q: "Как отразить масштабируемость на диаграмме последовательности?",
      options: ["Показать участника как набор экземпляров или балансировщик перед группой сервисов", "Нельзя", "Увеличить стрелки"],
      answer: 0,
      explain: "Балансировщик и пул экземпляров показывают распределение запросов и точки масштабирования."
    },
    {
      topic: "SEQ",
      q: "Как согласовать таймауты в цепочке вызовов A → B → C?",
      options: ["Таймаут внешнего вызова должен быть больше времени внутренних с запасом, а оставшийся дедлайн лучше передавать дальше по цепочке", "Везде одинаковый максимальный", "Без таймаутов"],
      answer: 0,
      explain: "Если внутренний вызов длится дольше внешнего, верхний уровень уже отказал, а работа продолжается впустую. Передача дедлайна синхронизирует ожидания."
    },
    {
      topic: "SEQ",
      q: "Что такое паттерн «переборки» (bulkhead) в распределённых вызовах?",
      options: ["Изоляция ресурсов (пулов потоков, соединений) по зависимостям: сбой одной не исчерпывает ресурсы остальных", "Тип шифрования", "Название участника"],
      answer: 0,
      explain: "Раздельные пулы не дают медленной зависимости занять все потоки и остановить независимые функции."
    },
    {
      topic: "STATE",
      q: "В чём состоит семантика «выполнить до завершения» (run-to-completion)?",
      options: ["Событие обрабатывается полностью (все действия и переходы), прежде чем будет взято следующее из очереди", "Все события обрабатываются параллельно", "События теряются"],
      answer: 0,
      explain: "RTC гарантирует атомарность шага автомата и устраняет гонки между обработчиками внутри одного экземпляра."
    },
    {
      topic: "STATE",
      q: "Что происходит, если во время обработки события автомат генерирует новое событие?",
      options: ["Оно ставится в очередь и обрабатывается после завершения текущего шага", "Обрабатывается немедленно, прерывая шаг", "Теряется"],
      answer: 0,
      explain: "Очередь событий сохраняет детерминированность и упорядочивает обработку."
    },
    {
      topic: "STATE",
      q: "Что такое взрыв состояний (state explosion) и как с ним бороться?",
      options: ["Экспоненциальный рост числа состояний при комбинировании независимых аспектов; помогают иерархия, ортогональные области и расширенное состояние", "Ошибка памяти", "Много событий"],
      answer: 0,
      explain: "Вместо декартова произведения параметров используют параллельные области и переменные автомата."
    },
    {
      topic: "STATE",
      q: "Чем иерархический автомат (statechart Харела) лучше плоского?",
      options: ["Общие переходы и поведение выносятся на верхний уровень, подсостояния их наследуют; диаграмма компактнее и понятнее", "Он быстрее выполняется", "Он не имеет событий"],
      answer: 0,
      explain: "Иерархия, параллелизм и история — три расширения Харела над простыми конечными автоматами."
    },
    {
      topic: "STATE",
      q: "Что такое локальный переход (local) и внешний (external) для составного состояния?",
      options: ["Локальный не выходит из составного состояния и не вызывает его exit/entry, внешний — выходит и входит заново", "Одно и то же", "Локальный — это self"],
      answer: 0,
      explain: "Разница видна на entry/exit составного состояния и сбросе подсостояния."
    },
    {
      topic: "STATE",
      q: "Как ведут себя entry-действия при входе в глубоко вложенное состояние?",
      options: ["Выполняются снаружи внутрь: сначала entry внешнего, затем вложенного", "Изнутри наружу", "Не выполняются"],
      answer: 0,
      explain: "Порядок: exit — изнутри наружу, entry — снаружи внутрь. Он критичен для инициализации ресурсов."
    },
    {
      topic: "STATE",
      q: "Что происходит при выходе из вложенного состояния через переход верхнего уровня?",
      options: ["Сначала выполняются exit вложенного, затем exit внешнего (изнутри наружу), затем действие перехода", "Только exit внешнего", "Ничего"],
      answer: 0,
      explain: "Все покидаемые состояния завершаются корректно: активности останавливаются, ресурсы освобождаются."
    },
    {
      topic: "STATE",
      q: "Что произойдёт, если несколько событий приходят одновременно в двух параллельных областях?",
      options: ["Области обрабатывают события независимо; порядок между областями может быть любым, поэтому действия не должны полагаться на него", "События потеряются", "Автомат упадёт"],
      answer: 0,
      explain: "Ортогональные области действуют как независимые автоматы, синхронизируются только через явные события, fork/join или общие переменные."
    },
    {
      topic: "STATE",
      q: "Как синхронизировать две параллельные области?",
      options: ["Общим событием, join или общим расширенным состоянием (переменной) с охранными условиями", "Никак", "Рамкой"],
      answer: 0,
      explain: "Без явных механизмов области не знают друг о друге."
    },
    {
      topic: "STATE",
      q: "Что такое протокольный автомат (protocol state machine)?",
      options: ["Автомат, задающий допустимый порядок вызовов операций объекта, без описания реализации", "Автомат сети", "Диаграмма классов"],
      answer: 0,
      explain: "Он фиксирует контракт использования: например, нельзя читать из закрытого файла."
    },
    {
      topic: "STATE",
      q: "Как обеспечить, чтобы недопустимые переходы статуса были невозможны на уровне БД и сервиса?",
      options: ["Проверять переход в сервисе по таблице допустимых переходов и защищать условным обновлением (UPDATE ... WHERE status = :old), при необходимости — CHECK/триггером", "Положиться на интерфейс", "Хранить текстом"],
      answer: 0,
      explain: "Условный UPDATE защищает от гонок: если статус уже изменён, затронуто 0 строк, и переход отклоняется."
    },
    {
      topic: "STATE",
      q: "Два запроса одновременно пытаются перевести заказ: один в «Отменён», другой в «Отправлен». Как избежать конфликта?",
      options: ["Атомарный условный переход (compare-and-set по текущему статусу или версии): выиграет один, второй получит отказ", "Ничего не делать", "Выполнить оба"],
      answer: 0,
      explain: "Оптимистическая блокировка по версии или статусу сводит конкуренцию к единственному допустимому переходу."
    },
    {
      topic: "STATE",
      q: "Как в REST API выразить переход состояния заказа «отмена»?",
      options: ["POST /orders/{id}/cancel (или PATCH статуса); недопустимый переход — 409 Conflict с описанием причин", "GET /orders/cancel", "DELETE всегда"],
      answer: 0,
      explain: "Действия, меняющие состояние, выражают командами. Конфликт со состоянием возвращают как 409 или 422."
    },
    {
      topic: "STATE",
      q: "Зачем вести журнал переходов (audit log) состояния?",
      options: ["Чтобы знать, кто, когда и из какого состояния перевёл объект, и расследовать инциденты и споры", "Для красоты", "Не нужно"],
      answer: 0,
      explain: "История переходов — основа аудита и аналитики: время в состояниях, узкие места, причины отмен."
    },
    {
      topic: "STATE",
      q: "Как event sourcing связан с состояниями?",
      options: ["Текущее состояние вычисляется свёрткой последовательности событий; переходы — это добавление событий", "Состояние хранится отдельно", "События не нужны"],
      answer: 0,
      explain: "Журнал событий — источник истины, а состояние — производное представление."
    },
    {
      topic: "STATE",
      q: "Как обрабатывать повторную доставку события «оплата получена» при уже оплаченном заказе?",
      options: ["Сделать обработку идемпотентной: проверять текущее состояние и ключ события; повтор не меняет состояние", "Оплатить дважды", "Удалить заказ"],
      answer: 0,
      explain: "Доставка «минимум один раз» приводит к дублям. Автомат должен без вреда игнорировать повтор."
    },
    {
      topic: "STATE",
      q: "Какое покрытие тестами считается базовым для диаграммы состояний?",
      options: ["Покрытие состояний и переходов: каждый переход выполнен хотя бы одним тестом", "Только состояний", "Только событий"],
      answer: 0,
      explain: "Покрытие переходов сильнее покрытия состояний, потому что проверяет каждое событие и условие."
    },
    {
      topic: "STATE",
      q: "Что такое N-switch coverage?",
      options: ["Покрытие последовательностей из N+1 подряд идущих переходов", "Количество состояний", "Количество событий"],
      answer: 0,
      explain: "0-switch — отдельные переходы, 1-switch — пары подряд идущих и так далее. Помогает выявлять ошибки взаимодействия переходов."
    },
    {
      topic: "STATE",
      q: "Что такое достижимость (reachability) в модели состояний и зачем её проверять?",
      options: ["Возможность добраться до состояния из начального; недостижимые состояния и тупики указывают на ошибки", "Скорость", "Количество переходов"],
      answer: 0,
      explain: "Анализ достижимости — базовая верификация модели (model checking позволяет проверять и свойства безопасности)."
    },
    {
      topic: "STATE",
      q: "Что такое тупик (deadlock) в автомате?",
      options: ["Неконечное состояние, из которого нет допустимых переходов при любых событиях", "Конечное состояние", "Составное состояние"],
      answer: 0,
      explain: "Такая модель «застревает» и не может завершить жизненный цикл."
    },
    {
      topic: "STATE",
      q: "Что такое живость (liveness) автомата?",
      options: ["Свойство, что система не застрянет навсегда: рано или поздно произойдёт нужное событие или переход", "Скорость", "Размер"],
      answer: 0,
      explain: "Для ожидающих состояний добавляют таймеры и альтернативные выходы, иначе жизнеспособность не гарантируется."
    },
    {
      topic: "STATE", state: "order",
      q: "Нужно добавить возврат товара после доставки. Какое изменение модели корректно?",
      options: ["Добавить состояние «Возврат» и переход из «Доставлен» с условием срока возврата; обновить переход в конечное состояние", "Удалить конечное состояние", "Ничего"],
      answer: 0,
      explain: "Новые сценарии добавляют состояниями и переходами с охранными условиями, сохраняя достижимость конца."
    },
    {
      topic: "STATE", state: "order",
      q: "Как реализовать таблицу допустимых переходов заказа?",
      options: ["Словарь «состояние → множество допустимых событий и целевых состояний», проверяемый при каждом изменении", "Много if в контроллерах", "Не нужно"],
      answer: 0,
      explain: "Табличное задание делает правила видимыми, тестируемыми и расширяемыми."
    },
    {
      topic: "STATE", state: "order",
      q: "Что будет, если «Отправлен» → «Отменён» разрешить без процедуры возврата?",
      options: ["Нарушится согласованность: товар у курьера, деньги возвращены; нужен отдельный процесс или состояние «Возврат»", "Ничего", "Заказ исчезнет"],
      answer: 0,
      explain: "Переходы должны сохранять инварианты предметной области. Для отмены после отправки требуется компенсация."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Заявка бесконечно переоткрывается клиентом. Что добавить в модель?",
      options: ["Счётчик переоткрытий как расширенное состояние и условие [переоткрытий < N], после которого требуется эскалация или новый обращение", "Ничего", "Закрыть навсегда"],
      answer: 0,
      explain: "Расширенное состояние ограничивает циклы без взрыва числа состояний."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Как смоделировать SLA «заявку нужно взять в работу за 4 часа»?",
      options: ["Переход по времени after(4 ч) из «Новая» в состояние «Просрочена» или эскалацию", "Таймер вне модели", "Нельзя"],
      answer: 0,
      explain: "Временные события интегрируют требования SLA в жизненный цикл."
    },
    {
      topic: "STATE", state: "ticket",
      q: "Как измерить время нахождения заявок в «Ожидает клиента»?",
      options: ["По журналу переходов: разность временных меток входа и выхода из состояния", "Невозможно", "Только вручную"],
      answer: 0,
      explain: "Журнал переходов с временными метками даёт метрики времени в состояниях и узкие места процесса."
    },
    {
      topic: "STATE", state: "login",
      q: "Почему счётчик неверных попыток нужно хранить вне памяти экземпляра сервиса?",
      options: ["При нескольких экземплярах сервиса память не общая: счётчик в общем хранилище (БД, кэш) обеспечивает корректную блокировку", "Не нужно", "Из-за размера"],
      answer: 0,
      explain: "Состояние автомата в распределённой системе должно быть общим и атомарно обновляемым."
    },
    {
      topic: "STATE", state: "login",
      q: "Как защититься от перебора пароля, не раскрывая факт существования учётной записи?",
      options: ["Одинаковое сообщение и время ответа для неверного пользователя и пароля, счётчики по IP и аккаунту, задержки", "Разные сообщения", "Никак"],
      answer: 0,
      explain: "Автомат блокировки должен учитывать и учётные записи, и источники запросов."
    },
    {
      topic: "STATE", state: "conn",
      q: "Что происходит, если в «Подключено» долго нет heartbeat?",
      options: ["Нужен переход по таймауту в «Ошибка» или «Отключено» с освобождением ресурсов (exit закрывает сокет)", "Ничего", "Соединение улучшится"],
      answer: 0,
      explain: "Таймауты — обязательный элемент сетевых автоматов: зависшие соединения должны быть обнаружены."
    },
    {
      topic: "STATE", state: "conn",
      q: "Почему «exit / закрыть сокет» надёжнее, чем закрытие в каждом исходящем переходе?",
      options: ["Exit выполняется при любом выходе из состояния, исключая утечку ресурсов", "Он быстрее", "Он короче"],
      answer: 0,
      explain: "Размещение освобождения ресурсов в exit гарантирует единообразие для всех путей выхода."
    },
    {
      topic: "STATE", state: "history",
      q: "Что даёт историческое состояние при нескольких возвратах из «Ошибка»?",
      options: ["Работа возобновляется с последнего подсостояния, а не сбрасывается в «Ожидание»", "Всегда в начало", "Ничего"],
      answer: 0,
      explain: "История сохраняет контекст прерванной работы. Для начального входа предусматривают подсостояние по умолчанию."
    },
    {
      topic: "STATE", state: "history",
      q: "Что произойдёт при первом входе через H, если история пуста?",
      options: ["Объект перейдёт в подсостояние по умолчанию, указанное переходом от H", "Автомат упадёт", "В «Ошибка»"],
      answer: 0,
      explain: "У исторического псевдосостояния задают переход по умолчанию для случая, когда истории ещё нет."
    },
    {
      topic: "STATE", state: "player",
      q: "Как добавить перемотку, не умножая число состояний?",
      options: ["Расширенное состояние (позиция) и внутренние переходы в «Воспроизведение»", "Отдельное состояние для каждой секунды", "Нельзя"],
      answer: 0,
      explain: "Параметры, меняющиеся непрерывно, хранят в переменных, а не в состояниях."
    },
    {
      topic: "STATE", state: "player",
      q: "Что делать с событием «play» в состоянии «Воспроизведение»?",
      options: ["Явно решить: игнорировать (внутренний переход без действия) или обработать; не оставлять неопределённым", "Обработать дважды", "Остановить"],
      answer: 0,
      explain: "Полнота модели означает, что поведение определено для всех событий в каждом состоянии."
    },
    {
      topic: "STATE", state: "fork_join",
      q: "Как предусмотреть таймаут параллельной проверки платежа?",
      options: ["Добавить в ветку переход по after(N) в состояние «Платёж не подтверждён», ведущий к альтернативному выходу, обходящему join", "Ничего", "Удалить join"],
      answer: 0,
      explain: "Без таймаута зависшая ветвь блокирует синхронизацию навсегда."
    },
    {
      topic: "STATE", state: "fork_join",
      q: "Что произойдёт, если одна параллельная ветвь завершилась ошибкой, а вторая успешно?",
      options: ["Нужно явно определить политику: отмена второй ветви (kill), компенсация или продолжение; join сам по себе ждёт обе", "Join сработает", "Ничего"],
      answer: 0,
      explain: "Частичные отказы — типичная проблема параллелизма. Их описывают ветвями с исключительными переходами."
    },
    {
      topic: "STATE", state: "comp_order",
      q: "Что произойдёт с процессом сборки при отмене заказа?",
      options: ["Выход из составного состояния вызовет exit подсостояния «Сборка»: нужно освободить резервы и отменить задачи", "Сборка продолжится", "Ничего"],
      answer: 0,
      explain: "Выход из вложенного состояния выполняет его exit-действия, поэтому там размещают освобождение ресурсов."
    },
    {
      topic: "STATE", state: "comp_order",
      q: "Как разделить обработку заказа на независимые аспекты оплаты и сборки, если они идут параллельно?",
      options: ["Использовать ортогональные области внутри составного состояния «Обработка заказа»", "Дублировать состояния всех комбинаций", "Удалить оплату"],
      answer: 0,
      explain: "Две области — «Оплата» и «Сборка» — позволяют комбинировать состояния без взрыва числа состояний."
    },
    {
      topic: "STATE", state: "credit",
      q: "Что делать, если правила выбора часто меняются бизнесом?",
      options: ["Вынести правила в таблицу решений (DMN) или конфигурацию, а автомат оставить с общим ромбом выбора", "Переписывать код", "Отказаться от условий"],
      answer: 0,
      explain: "Условия на переходах — бизнес-логика. Таблица решений позволяет менять их без изменения структуры автомата."
    },
    {
      topic: "STATE", state: "credit",
      q: "Как гарантировать полноту условий при выборе?",
      options: ["Добавить ветку [else] и проверять, что условия покрывают всю область значений без пересечений", "Не проверять", "Убрать ромб"],
      answer: 0,
      explain: "Полнота и взаимоисключаемость — свойства корректного выбора."
    },
    {
      topic: "STATE", state: "bad_state",
      q: "Что делать с неконечным состоянием без исходящих переходов в жизненном цикле документа?",
      options: ["Добавить переходы (архивирование, отзыв) или пометить состояние конечным; иначе жизненный цикл неполон", "Ничего", "Удалить диаграмму"],
      answer: 0,
      explain: "Тупики должны быть осознанными (конечные состояния) либо устранены."
    },
    {
      topic: "STATE",
      q: "Чем диаграмма состояний отличается от диаграммы активностей и BPMN?",
      options: ["Состояния описывают жизненный цикл одного объекта, а активности и BPMN — последовательность действий и участников процесса", "Ничем", "BPMN проще"],
      answer: 0,
      explain: "Модели дополняют друг друга: процесс переводит объекты по состояниям, а диаграмма состояний фиксирует допустимые изменения."
    },
    {
      topic: "STATE",
      q: "Как состояния и переходы связаны с сагой в микросервисах?",
      options: ["Сага представляется автоматом с состояниями шагов, ожиданий и компенсаций; переходы по результатам вызовов и таймаутам", "Никак", "Сага — это БД"],
      answer: 0,
      explain: "Явный автомат саги упрощает восстановление после сбоев и мониторинг."
    },
    {
      topic: "STATE",
      q: "Почему состояние саги нужно хранить надёжно?",
      options: ["После перезапуска оркестратор должен продолжить с места остановки, поэтому состояние и ожидаемые события сохраняют в БД", "Для красоты", "Не нужно"],
      answer: 0,
      explain: "Потеря состояния ведёт к зависшим транзакциям и несогласованным данным."
    },
    {
      topic: "STATE",
      q: "Чем опасно изменение диаграммы состояний при наличии работающих экземпляров?",
      options: ["Экземпляры могут находиться в удаляемом или переименованном состоянии; нужна миграция состояний и обратная совместимость", "Не опасно", "Все сбросятся"],
      answer: 0,
      explain: "Версионирование автомата и миграция данных обязательны при эволюции."
    },
    {
      topic: "STATE",
      q: "Как организовать таймеры в распределённой системе, чтобы after(3 дня) срабатывал ровно один раз?",
      options: ["Хранить дедлайн в БД и использовать планировщик с блокировкой/идемпотентностью обработки", "Использовать sleep", "Не использовать"],
      answer: 0,
      explain: "Таймеры в памяти теряются при перезапуске и могут дублироваться при нескольких экземплярах."
    },
    {
      topic: "STATE",
      q: "Что такое «орфанное» состояние, возникающее при сбое между записью в БД и отправкой события?",
      options: ["Состояние, о котором другие системы не узнали; решается паттерном outbox или транзакционной публикацией", "Состояние без имени", "Составное состояние"],
      answer: 0,
      explain: "Атомарность изменения состояния и публикации события обеспечивают outbox или CDC."
    },
    {
      topic: "STATE",
      q: "Как моделировать «мягкие» состояния, например «Ожидает подтверждения», без блокировки ресурсов навсегда?",
      options: ["Добавить таймаут с освобождением ресурсов и переходом в отменённое/просроченное состояние", "Ничего", "Блокировать навсегда"],
      answer: 0,
      explain: "Каждое ожидание должно иметь ограничение времени или иной путь выхода."
    },
    {
      topic: "STATE",
      q: "Почему важно разделять «бизнес-состояние» и «техническое состояние» процесса?",
      options: ["Техническое (повтор, ошибка интеграции) не должно смешиваться с бизнес-статусами, видимыми клиенту", "Не нужно", "Они совпадают"],
      answer: 0,
      explain: "Раздельные модели упрощают наблюдаемость и не загрязняют предметный жизненный цикл техническими деталями."
    },
    {
      topic: "ACT",
      q: "В чём состоит токенная семантика действия с двумя входящими потоками без узла слияния?",
      options: ["Действие запускается для каждого пришедшего токена: неявное слияние без синхронизации", "Действие ждёт оба токена", "Действие не запускается"],
      answer: 0,
      explain: "Для ожидания нескольких потоков нужен явный join. Без него возможны двойные запуски."
    },
    {
      topic: "ACT",
      q: "Что такое «отсутствие синхронизации» (lack of synchronization)?",
      options: ["Параллельные ветви сливаются узлом слияния вместо join, и дальнейшие действия выполняются несколько раз", "Недостаток дорожек", "Потеря сигнала"],
      answer: 0,
      explain: "Типичный дефект: после fork поставили merge, и поток выполняется по числу ветвей."
    },
    {
      topic: "ACT",
      q: "Что такое взаимная блокировка (deadlock) в диаграмме активности?",
      options: ["Узел join ждёт токены, которые никогда не придут (например, после решения вместо fork)", "Бесконечный цикл", "Ошибка в имени"],
      answer: 0,
      explain: "Блокировка возникает, когда join не получает токены на все входы."
    },
    {
      topic: "ACT",
      q: "Что такое livelock в процессе?",
      options: ["Бесконечный цикл, который постоянно выполняет действия, но не приближается к завершению", "Остановка на join", "Потеря токена"],
      answer: 0,
      explain: "Например, повторная проверка без условий выхода. Процесс работает, но результата не будет."
    },
    {
      topic: "ACT",
      q: "Что означает «токен сгорел» (token leak) в модели?",
      options: ["Токен поглощён ветвью без конечного узла, из-за чего другие узлы ждут его вечно", "Токен вернулся", "Токен удвоился"],
      answer: 0,
      explain: "Каждая ветвь должна либо слиться, либо завершиться явным конечным узлом."
    },
    {
      topic: "ACT",
      q: "Что такое условие соединения (join specification)?",
      options: ["Логическое выражение на join, определяющее, какие токены нужны для срабатывания (не обязательно все)", "Название join", "Вес ребра"],
      answer: 0,
      explain: "Join spec позволяет выразить, например, «достаточно любых двух из трёх»."
    },
    {
      topic: "ACT",
      q: "Как смоделировать «достаточно одобрения двух из трёх согласующих»?",
      options: ["Fork на трёх согласующих и join с условием «два токена», остальные ветки прерываются", "Три последовательных действия", "Обычный join"],
      answer: 0,
      explain: "Кворум моделируют условием соединения и отменой оставшихся ветвей."
    },
    {
      topic: "ACT",
      q: "Как получить время выполнения процесса по диаграмме?",
      options: ["Проанализировать критический путь: самую длинную цепочку зависимых действий с учётом параллельных ветвей", "Сложить время всех действий", "Взять среднее"],
      answer: 0,
      explain: "Параллельные действия не суммируются: длительность определяется самой долгой цепочкой."
    },
    {
      topic: "ACT",
      q: "Что такое узкое место в процессе по диаграмме активности?",
      options: ["Шаг или передача, ограничивающие пропускную способность: ожидание, ручная обработка, ограниченные ресурсы", "Самое длинное название", "Конечный узел"],
      answer: 0,
      explain: "Диаграмма помогает увидеть передачи между дорожками и точки ожидания — типичные места задержек."
    },
    {
      topic: "ACT",
      q: "Как оценить сложность алгоритма по диаграмме активности?",
      options: ["Цикломатическая сложность: число независимых путей, зависящее от числа решений", "Число узлов", "Число дорожек"],
      answer: 0,
      explain: "Количество решений определяет минимальное число тестов для покрытия ветвей."
    },
    {
      topic: "ACT",
      q: "Сколько тестов минимально нужно для покрытия всех ветвей диаграммы с тремя независимыми решениями?",
      options: ["Для покрытия ветвей достаточно покрыть каждый исход; для покрытия путей может потребоваться до 2³ = 8", "Один", "Три всегда"],
      answer: 0,
      explain: "Покрытие ветвей слабее покрытия путей. Выбор критерия зависит от риска."
    },
    {
      topic: "ACT",
      q: "Что такое сеть Петри и как она связана с диаграммой активности?",
      options: ["Формальная модель с позициями и переходами; токенная семантика активности близка к ней и позволяет формальный анализ", "Сеть передачи данных", "Диаграмма классов"],
      answer: 0,
      explain: "Сети Петри позволяют проверять достижимость и отсутствие блокировок."
    },
    {
      topic: "ACT",
      q: "Что такое поток (stream) в диаграмме активности?",
      options: ["Непрерывный поток данных, потребляемый действием по мере поступления, в отличие от дискретных токенов", "Дорожка", "Условие"],
      answer: 0,
      explain: "Потоковые параметры подходят для обработки событий и непрерывных данных."
    },
    {
      topic: "ACT",
      q: "Чем отличаются режимы области расширения: parallel, iterative, stream?",
      options: ["Parallel обрабатывает элементы одновременно, iterative — по порядку, stream — по мере поступления", "Ничем", "Только названием"],
      answer: 0,
      explain: "Режим влияет на порядок, параллелизм и поведение при частичных сбоях."
    },
    {
      topic: "ACT",
      q: "Как моделировать повторную попытку с экспоненциальной задержкой?",
      options: ["Цикл с решением по числу попыток и приёмом события времени с растущей задержкой", "Fork", "Join"],
      answer: 0,
      explain: "Таймеры внутри цикла выражают задержки, а счётчик ограничивает попытки."
    },
    {
      topic: "ACT",
      q: "Как в диаграмме активности отразить компенсирующее действие?",
      options: ["Обработчик исключения или отдельная ветка, выполняющая обратные действия для уже завершённых шагов", "Конечный узел", "Дорожка"],
      answer: 0,
      explain: "Компенсации реализуют откат бизнес-транзакций, когда обычная отмена невозможна."
    },
    {
      topic: "ACT",
      q: "Что такое идемпотентное действие и почему это важно в потоках с повторами?",
      options: ["Действие, повтор которого не меняет результат после первого выполнения; это защищает от дублей при повторных токенах и retry", "Быстрое действие", "Параллельное действие"],
      answer: 0,
      explain: "Повторы возникают при сбоях и сетевых таймаутах, и идемпотентность делает их безопасными."
    },
    {
      topic: "ACT",
      q: "Что такое длительное действие (long-running) и как его моделировать?",
      options: ["Действие, завершение которого происходит позже внешним событием: разделяют на отправку и приём события завершения, добавляют таймаут", "Обычное действие", "Fork"],
      answer: 0,
      explain: "Модель из «отправить» и «получить результат» отражает асинхронность и позволяет ограничить ожидание."
    },
    {
      topic: "ACT",
      q: "Почему дорожки в диаграмме активности не заменяют диаграмму последовательности?",
      options: ["Они показывают ответственность, но не детальный обмен сообщениями во времени между участниками", "Заменяют", "Нет разницы"],
      answer: 0,
      explain: "Для сообщений и порядка вызовов лучше диаграмма последовательности."
    },
    {
      topic: "ACT",
      q: "Как переводить диаграмму активности в код?",
      options: ["Действия — вызовы или методы, решения — условия, циклы — циклы, fork/join — параллельные задачи (потоки, async/await)", "Нельзя", "Только автоматически"],
      answer: 0,
      explain: "Структура диаграммы напрямую отображается на управляющие конструкции программ."
    },
    {
      topic: "ACT",
      q: "Как сопоставить действие диаграммы с тестами?",
      options: ["Каждый путь через диаграмму — тестовый сценарий; решения и циклы определяют необходимые данные", "Тесты не нужны", "Только для UI"],
      answer: 0,
      explain: "Путевое тестирование выводится из потоков диаграммы."
    },
    {
      topic: "ACT",
      q: "Что такое хорошая детализация диаграммы активности?",
      options: ["Один уровень абстракции: детали вынесены во вложенные активности, а основная диаграмма умещается на одной странице", "Максимальная подробность", "Только заголовки"],
      answer: 0,
      explain: "Иерархия вызовов поддерживает читаемость. Диаграмма не должна смешивать уровни."
    },
    {
      topic: "ACT",
      q: "Что такое «скрытая зависимость» в параллельных ветвях?",
      options: ["Ветви используют общие данные или ресурсы, но связь не показана: возможны гонки и неверный порядок", "Скрытый узел", "Дорожка"],
      answer: 0,
      explain: "Параллелизм требует явной синхронизации или независимых данных."
    },
    {
      topic: "ACT",
      q: "Как показать общий ресурс, который может использовать одна ветвь за раз?",
      options: ["Критическая секция: общий буфер или блокирующее действие, на входе которого ожидание освобождения ресурса", "Fork", "Merge"],
      answer: 0,
      explain: "Ограниченные ресурсы моделируют буферами с ограниченной ёмкостью или явными действиями захвата и освобождения."
    },
    {
      topic: "ACT",
      q: "Как диаграмма активности используется для бизнес-процессов относительно BPMN?",
      options: ["Подходит для первичного описания и интеграции с UML-моделями, но BPMN лучше для исполняемых процессов и сообщений между организациями", "Заменяет BPMN полностью", "Не подходит"],
      answer: 0,
      explain: "Выбор зависит от контекста и инструментов: UML-модель или исполняемый процесс."
    },
    {
      topic: "ACT",
      q: "Что такое хореография и оркестрация процессов?",
      options: ["Оркестрация — один координатор управляет шагами, хореография — участники реагируют на события друг друга без центра", "Одно и то же", "Тип дорожки"],
      answer: 0,
      explain: "Оркестрацию проще контролировать, хореография — слабее связывает сервисы."
    },
    {
      topic: "ACT",
      q: "Как отразить на диаграмме требование «обработка не дольше 2 секунд»?",
      options: ["Временное ограничение на участок или заметка с ограничением и ветка по таймауту", "Нельзя", "Дорожка"],
      answer: 0,
      explain: "Нефункциональные требования фиксируют ограничениями рядом с действиями."
    },
    {
      topic: "ACT",
      q: "Что такое поток исключений (exception flow) и как отличить его от обычного?",
      options: ["Поток, запускаемый при ошибке; помечается типом исключения и идёт от защищённого узла к обработчику", "Обычный поток", "Пунктирный всегда"],
      answer: 0,
      explain: "Отличается маркировкой и семантикой: нормальный поток при исключении прерывается."
    },
    {
      topic: "ACT",
      q: "Какой риск несёт параллельное изменение одного объекта несколькими ветками?",
      options: ["Гонка: итог зависит от порядка, возможны потерянные обновления; нужна синхронизация или слияние результатов", "Никакого", "Лишние токены"],
      answer: 0,
      explain: "Явные точки слияния данных и ограничения доступа предотвращают неопределённость."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Что нужно добавить, чтобы процесс не зависал, если проверка документов не отвечает?",
      options: ["Таймаут на ветке и альтернативный поток (отказ или ручная проверка), обходящий join", "Ничего", "Убрать join"],
      answer: 0,
      explain: "Каждая параллельная ветвь должна иметь путь завершения, иначе join блокируется."
    },
    {
      topic: "ACT", act: "par_act",
      q: "Как изменить диаграмму, если достаточно любой одной проверки?",
      options: ["Заменить join на условие «один токен» или использовать слияние и отменить вторую ветку", "Оставить", "Добавить fork"],
      answer: 0,
      explain: "Семантика зависит от требования: ждать все или первую. Это явно выражают узлом и условием."
    },
    {
      topic: "ACT", act: "merge_bug",
      q: "Какой инструмент автоматически выявит эту ошибку?",
      options: ["Анализ модели (верификация): поиск блокировок и недостижимых узлов по токенной семантике", "Орфографическая проверка", "Профилировщик"],
      answer: 0,
      explain: "Формальные проверки выявляют узлы, которые никогда не получат необходимые токены."
    },
    {
      topic: "ACT", act: "merge_bug",
      q: "Какое изменение сохраняет поведение «Оплатить» один раз и безопасно при росте числа веток?",
      options: ["Заменить join на merge и сохранить решение, а не fork", "Добавить ещё одну ветку", "Удалить решение"],
      answer: 0,
      explain: "При добавлении веток решение остаётся с merge: выполняется только одна."
    },
    {
      topic: "ACT", act: "flow_final",
      q: "Почему важно различать активность-финал и конец потока при проектировании системы с очередью задач?",
      options: ["Активность-финал убьёт все параллельные задачи, а конец потока завершит только одну: от этого зависит, останутся ли незавершённые операции", "Не важно", "Нет разницы"],
      answer: 0,
      explain: "Неверный выбор приводит к потере работы или к зависшим ветвям."
    },
    {
      topic: "ACT", act: "flow_final",
      q: "Что произойдёт с токеном ветки «Отправить чек» после конца потока?",
      options: ["Он поглощается, но активность продолжит, пока не завершатся остальные ветки", "Он возвращается", "Он удваивается"],
      answer: 0,
      explain: "Flow final — локальное завершение."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Что нужно проверить по этой диаграмме в части ответственности?",
      options: ["Передачи между дорожками: нет ли действий без владельца и не накапливаются ли очереди на руководителе", "Только цвета", "Число стрелок"],
      answer: 0,
      explain: "Дорожки помогают найти действия без ответственного и места перегрузки."
    },
    {
      topic: "ACT", act: "support_act",
      q: "Как измерить SLA по этой диаграмме?",
      options: ["Отметить временные ограничения на участках (например, приём обращения за 15 минут) и событие времени с эскалацией", "Нельзя", "Только вручную"],
      answer: 0,
      explain: "Временные ограничения и события времени встраивают SLA в процесс."
    },
    {
      topic: "ACT", act: "signals",
      q: "Какой риск несёт асинхронный запрос-ответ без корреляции?",
      options: ["Ответ может прийти не тому экземпляру: нужен идентификатор корреляции", "Нет риска", "Потеря дорожки"],
      answer: 0,
      explain: "Корреляционный идентификатор связывает ответ с запросом."
    },
    {
      topic: "ACT", act: "signals",
      q: "Что произойдёт, если ответ придёт до того, как поток дошёл до «Получить ответ»?",
      options: ["Без буферизации событие потеряется; нужен буфер или предварительная подписка на ответ", "Ничего", "Ответ придёт снова"],
      answer: 0,
      explain: "Гонка между отправкой и ожиданием — типичная ошибка в асинхронных моделях."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Что произойдёт, если действие «Оплатить счёт» запускается без объекта «Счёт»?",
      options: ["Не запустится: действию нужен входной токен с объектом", "Запустится с пустым", "Ошибка в имени"],
      answer: 0,
      explain: "Входные параметры (пины) обязательны для запуска, если у них минимальная кратность не нулевая."
    },
    {
      topic: "ACT", act: "obj_act",
      q: "Как показать, что «Оплатить счёт» принимает только оплачиваемые счета?",
      options: ["Указать состояние объекта «Счёт [создан]» на входе и условие на потоке", "Не нужно", "Цветом"],
      answer: 0,
      explain: "Состояния объектов и условия задают допустимые входные данные."
    },
    {
      topic: "ACT", act: "time_act",
      q: "Что произойдёт, если предыдущий запуск ещё не завершён, а наступил следующий понедельник?",
      options: ["Будет создан новый токен: возможен параллельный запуск; нужно решить, допустим ли он (блокировка или пропуск)", "Старый остановится", "Ничего"],
      answer: 0,
      explain: "Периодические процессы требуют политики перекрытия запусков."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Как добавить обработку возврата товара, не усложняя основную диаграмму?",
      options: ["Вынести возврат в отдельную активность и вызвать её через call behavior из нужного места", "Дорисовать на той же диаграмме все шаги", "Удалить склад"],
      answer: 0,
      explain: "Вложенные активности удерживают основную диаграмму читаемой."
    },
    {
      topic: "ACT", act: "order_act",
      q: "Какое действие нужно сделать идемпотентным в этом процессе?",
      options: ["«Собрать заказ»/резервирование и уведомление: при повторе не должно возникать двойного резерва и повторных писем", "Начальный узел", "Решение"],
      answer: 0,
      explain: "Побочные эффекты в действиях должны выдерживать повторы."
    },
    {
      topic: "ACT", act: "call_act",
      q: "Что должно быть согласовано между вызывающей и вызываемой активностями?",
      options: ["Входные и выходные параметры, возможные исключения и условия завершения", "Только название", "Цвет"],
      answer: 0,
      explain: "Интерфейс активности — договор между уровнями диаграммы."
    },
    {
      topic: "ACT",
      q: "Что такое вход решения (decision input)?",
      options: ["Объект или значение, на основании которого вычисляются условия на выходах узла решения", "Название ромба", "Дорожка"],
      answer: 0,
      explain: "Вход решения показывает, какие данные определяют выбор ветки. Это делает условия проверяемыми и воспроизводимыми."
    },
    {
      topic: "ACT",
      q: "Чем явный fork отличается от нескольких исходящих потоков из действия?",
      options: ["В обоих случаях запускаются параллельные потоки, но явный fork делает параллелизм видимым и однозначным, а неявный легко пропустить", "Ничем", "Неявный быстрее"],
      answer: 0,
      explain: "Стандарт допускает неявный fork, но для читаемости и проверки модели его лучше рисовать явно."
    },
    {
      topic: "ACT",
      q: "Как смоделировать ожидание ответа не дольше 30 секунд?",
      options: ["Прерываемая область вокруг ожидания ответа с событием времени, которое по истечении срока запускает ветку обработки таймаута", "Просто действие", "Join"],
      answer: 0,
      explain: "Время и ответ конкурируют: побеждает событие, наступившее первым, и оставшиеся токены в области отменяются."
    },
    {
      topic: "ACT",
      q: "Почему в диаграмме активности не стоит показывать действия интерфейса вроде «нажать кнопку»?",
      options: ["Диаграмма должна выражать бизнес-действия и логику, а не детали интерфейса; иначе она быстро устаревает и теряет смысл", "Это запрещено", "Кнопки не нужны"],
      answer: 0,
      explain: "Детали UI меняются чаще, чем бизнес-логика. Их описывают в отдельных артефактах."
    },
    {
      topic: "ACT",
      q: "Зачем у вызываемой активности задают кратность параметров?",
      options: ["Чтобы определить, сколько объектов она принимает и возвращает (например, 0..1 или 1..*) и когда она может стартовать", "Для красоты", "Для дорожек"],
      answer: 0,
      explain: "Кратность влияет на запуск действия и на то, сколько токенов нужно для старта."
    }
  ]
};

// Схемы для ER-диаграмм: tables (col/row — позиция в сетке), rels — [родитель, потомок, метка у родителя, метка у потомка].
window.ERDS = {
  "shop": {
    "tables": [
      {
        "name": "users",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "email UQ",
          "name"
        ]
      },
      {
        "name": "orders",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "user_id FK",
          "status",
          "total"
        ]
      },
      {
        "name": "order_items",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "order_id FK",
          "product_id FK",
          "qty"
        ]
      },
      {
        "name": "categories",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "products",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "category_id FK",
          "name",
          "price"
        ]
      }
    ],
    "rels": [
      [
        "users",
        "orders",
        "1",
        "N"
      ],
      [
        "orders",
        "order_items",
        "1",
        "N"
      ],
      [
        "products",
        "order_items",
        "1",
        "N"
      ],
      [
        "categories",
        "products",
        "1",
        "N"
      ]
    ]
  },
  "school": {
    "tables": [
      {
        "name": "groups",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "title"
        ]
      },
      {
        "name": "students",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "group_id FK"
        ]
      },
      {
        "name": "enrollments",
        "col": 2,
        "row": 0,
        "cols": [
          "student_id PK,FK",
          "course_id PK,FK",
          "grade"
        ]
      },
      {
        "name": "teachers",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "courses",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "title",
          "teacher_id FK"
        ]
      }
    ],
    "rels": [
      [
        "groups",
        "students",
        "1",
        "N"
      ],
      [
        "students",
        "enrollments",
        "1",
        "N"
      ],
      [
        "courses",
        "enrollments",
        "1",
        "N"
      ],
      [
        "teachers",
        "courses",
        "1",
        "N"
      ]
    ]
  },
  "library": {
    "tables": [
      {
        "name": "authors",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "book_authors",
        "col": 1,
        "row": 0,
        "cols": [
          "book_id PK,FK",
          "author_id PK,FK"
        ]
      },
      {
        "name": "books",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "title",
          "isbn UQ"
        ]
      },
      {
        "name": "readers",
        "col": 0,
        "row": 1,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "loans",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "book_id FK",
          "reader_id FK",
          "issued_at",
          "returned_at"
        ]
      }
    ],
    "rels": [
      [
        "authors",
        "book_authors",
        "1",
        "N"
      ],
      [
        "books",
        "book_authors",
        "1",
        "N"
      ],
      [
        "readers",
        "loans",
        "1",
        "N"
      ],
      [
        "books",
        "loans",
        "1",
        "N"
      ]
    ]
  },
  "hr": {
    "tables": [
      {
        "name": "departments",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "employees",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "dept_id FK",
          "manager_id FK",
          "salary"
        ]
      }
    ],
    "rels": [
      [
        "departments",
        "employees",
        "1",
        "N"
      ]
    ]
  },
  "booking": {
    "tables": [
      {
        "name": "hotels",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "rooms",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "hotel_id FK",
          "number"
        ]
      },
      {
        "name": "bookings",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "room_id FK",
          "guest_id FK",
          "check_in",
          "check_out"
        ]
      },
      {
        "name": "guests",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "name",
          "email UQ"
        ]
      }
    ],
    "rels": [
      [
        "hotels",
        "rooms",
        "1",
        "N"
      ],
      [
        "rooms",
        "bookings",
        "1",
        "N"
      ],
      [
        "guests",
        "bookings",
        "1",
        "N"
      ]
    ]
  },
  "blog": {
    "tables": [
      {
        "name": "users",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "nickname"
        ]
      },
      {
        "name": "posts",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "author_id FK",
          "title"
        ]
      },
      {
        "name": "post_tags",
        "col": 2,
        "row": 0,
        "cols": [
          "post_id PK,FK",
          "tag_id PK,FK"
        ]
      },
      {
        "name": "comments",
        "col": 0,
        "row": 1,
        "cols": [
          "id PK",
          "post_id FK",
          "user_id FK",
          "text"
        ]
      },
      {
        "name": "tags",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "name UQ"
        ]
      }
    ],
    "rels": [
      [
        "users",
        "posts",
        "1",
        "N"
      ],
      [
        "posts",
        "post_tags",
        "1",
        "N"
      ],
      [
        "tags",
        "post_tags",
        "1",
        "N"
      ],
      [
        "posts",
        "comments",
        "1",
        "N"
      ],
      [
        "users",
        "comments",
        "1",
        "N"
      ]
    ]
  },
  "clinic": {
    "tables": [
      {
        "name": "patients",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "birth_date"
        ]
      },
      {
        "name": "appointments",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "patient_id FK",
          "doctor_id FK",
          "starts_at",
          "status"
        ]
      },
      {
        "name": "doctors",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "specialty_id FK"
        ]
      },
      {
        "name": "prescriptions",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "appointment_id FK",
          "drug",
          "dose"
        ]
      },
      {
        "name": "specialties",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "title"
        ]
      }
    ],
    "rels": [
      [
        "patients",
        "appointments",
        "1",
        "N"
      ],
      [
        "doctors",
        "appointments",
        "1",
        "N"
      ],
      [
        "appointments",
        "prescriptions",
        "1",
        "N"
      ],
      [
        "specialties",
        "doctors",
        "1",
        "N"
      ]
    ]
  },
  "bank": {
    "tables": [
      {
        "name": "clients",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "passport UQ"
        ]
      },
      {
        "name": "accounts",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "client_id FK",
          "currency",
          "balance"
        ]
      },
      {
        "name": "cards",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "account_id FK",
          "pan_hash UQ",
          "expires"
        ]
      },
      {
        "name": "transactions",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "account_id FK",
          "counterparty_id FK",
          "amount",
          "created_at"
        ]
      }
    ],
    "rels": [
      [
        "clients",
        "accounts",
        "1",
        "N"
      ],
      [
        "accounts",
        "cards",
        "1",
        "N"
      ],
      [
        "accounts",
        "transactions",
        "1",
        "N"
      ]
    ]
  },
  "saas": {
    "tables": [
      {
        "name": "tenants",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name"
        ]
      },
      {
        "name": "subscriptions",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "tenant_id FK",
          "plan_id FK",
          "started_at",
          "ended_at"
        ]
      },
      {
        "name": "plans",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "price"
        ]
      },
      {
        "name": "users",
        "col": 0,
        "row": 1,
        "cols": [
          "id PK",
          "tenant_id FK",
          "email"
        ]
      },
      {
        "name": "invoices",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "subscription_id FK",
          "amount",
          "paid_at"
        ]
      }
    ],
    "rels": [
      [
        "tenants",
        "subscriptions",
        "1",
        "N"
      ],
      [
        "plans",
        "subscriptions",
        "1",
        "N"
      ],
      [
        "tenants",
        "users",
        "1",
        "N"
      ],
      [
        "subscriptions",
        "invoices",
        "1",
        "N"
      ]
    ]
  },
  "inventory": {
    "tables": [
      {
        "name": "warehouses",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "city"
        ]
      },
      {
        "name": "stock",
        "col": 1,
        "row": 0,
        "cols": [
          "warehouse_id PK,FK",
          "product_id PK,FK",
          "qty"
        ]
      },
      {
        "name": "products",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "sku UQ",
          "name",
          "supplier_id FK"
        ]
      },
      {
        "name": "movements",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "product_id FK",
          "from_wh FK",
          "to_wh FK",
          "qty",
          "moved_at"
        ]
      },
      {
        "name": "suppliers",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "name"
        ]
      }
    ],
    "rels": [
      [
        "warehouses",
        "stock",
        "1",
        "N"
      ],
      [
        "products",
        "stock",
        "1",
        "N"
      ],
      [
        "suppliers",
        "products",
        "1",
        "N"
      ],
      [
        "products",
        "movements",
        "1",
        "N"
      ]
    ]
  },
  "delivery": {
    "tables": [
      {
        "name": "couriers",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "name",
          "vehicle"
        ]
      },
      {
        "name": "deliveries",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "order_id FK",
          "courier_id FK",
          "status",
          "delivered_at"
        ]
      },
      {
        "name": "orders",
        "col": 2,
        "row": 0,
        "cols": [
          "id PK",
          "customer_id FK",
          "address_id FK",
          "total"
        ]
      },
      {
        "name": "addresses",
        "col": 1,
        "row": 1,
        "cols": [
          "id PK",
          "customer_id FK",
          "city",
          "street"
        ]
      },
      {
        "name": "customers",
        "col": 2,
        "row": 1,
        "cols": [
          "id PK",
          "name",
          "phone"
        ]
      }
    ],
    "rels": [
      [
        "couriers",
        "deliveries",
        "1",
        "N"
      ],
      [
        "orders",
        "deliveries",
        "1",
        "N"
      ],
      [
        "customers",
        "orders",
        "1",
        "N"
      ],
      [
        "customers",
        "addresses",
        "1",
        "N"
      ],
      [
        "addresses",
        "orders",
        "1",
        "N"
      ]
    ]
  },
  "social": {
    "tables": [
      {
        "name": "users",
        "col": 0,
        "row": 0,
        "cols": [
          "id PK",
          "handle UQ"
        ]
      },
      {
        "name": "posts",
        "col": 1,
        "row": 0,
        "cols": [
          "id PK",
          "user_id FK",
          "text",
          "created_at"
        ]
      },
      {
        "name": "follows",
        "col": 0,
        "row": 1,
        "cols": [
          "follower_id PK,FK",
          "followee_id PK,FK"
        ]
      },
      {
        "name": "likes",
        "col": 1,
        "row": 1,
        "cols": [
          "user_id PK,FK",
          "post_id PK,FK"
        ]
      }
    ],
    "rels": [
      [
        "users",
        "posts",
        "1",
        "N"
      ],
      [
        "users",
        "follows",
        "1",
        "N"
      ],
      [
        "users",
        "likes",
        "1",
        "N"
      ],
      [
        "posts",
        "likes",
        "1",
        "N"
      ]
    ]
  }
};

// Схемы BPMN-диаграмм: lanes — дорожки (rows — число строк), nodes — элементы (col/row — позиция в сетке),
// flows — [от, к, подпись, вид]; вид: msg — поток сообщений, assoc — ассоциация, default — поток по умолчанию, down — поворот вниз.
window.BPMNS = {
 "shop_order": {
  "lanes": [
   {
    "name": "Клиент",
    "rows": 1
   },
   {
    "name": "Менеджер",
    "rows": 1
   },
   {
    "name": "Склад",
    "rows": 1
   }
  ],
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 1,
    "label": "Заказ оформлен"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 1,
    "label": "Проверить заказ",
    "task": "user"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 2,
    "row": 1,
    "label": "Товар есть?"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 2,
    "label": "Собрать заказ"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Уведомить клиента"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 4,
    "row": 0,
    "label": "Заказ отменён"
   },
   {
    "id": "t4",
    "type": "task",
    "col": 4,
    "row": 2,
    "label": "Отправить заказ"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 5,
    "row": 2,
    "label": "Заказ доставлен"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "t2",
    "да"
   ],
   [
    "g1",
    "t3",
    "нет"
   ],
   [
    "t3",
    "e1"
   ],
   [
    "t2",
    "t4"
   ],
   [
    "t4",
    "e2"
   ]
  ]
 },
 "hire": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Кандидат принят"
   },
   {
    "id": "g1",
    "type": "gw-and",
    "col": 1,
    "row": 0
   },
   {
    "id": "t1",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Подготовить рабочее место"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Оформить документы"
   },
   {
    "id": "g2",
    "type": "gw-and",
    "col": 3,
    "row": 0
   },
   {
    "id": "t3",
    "type": "task",
    "col": 4,
    "row": 0,
    "label": "Провести онбординг"
   },
   {
    "id": "e",
    "type": "end",
    "col": 5,
    "row": 0,
    "label": "Сотрудник вышел"
   }
  ],
  "flows": [
   [
    "s",
    "g1"
   ],
   [
    "g1",
    "t1"
   ],
   [
    "g1",
    "t2"
   ],
   [
    "t1",
    "g2"
   ],
   [
    "t2",
    "g2"
   ],
   [
    "g2",
    "t3"
   ],
   [
    "t3",
    "e"
   ]
  ]
 },
 "xor_and_bug": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заявка получена"
   },
   {
    "id": "t0",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Принять заявку"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 2,
    "row": 0,
    "label": "Сумма?"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Проверка юриста"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 1,
    "label": "Проверка финансиста"
   },
   {
    "id": "g2",
    "type": "gw-and",
    "col": 4,
    "row": 0
   },
   {
    "id": "t3",
    "type": "task",
    "col": 5,
    "row": 0,
    "label": "Подписать договор"
   },
   {
    "id": "e",
    "type": "end",
    "col": 6,
    "row": 0,
    "label": "Договор подписан"
   }
  ],
  "flows": [
   [
    "s",
    "t0"
   ],
   [
    "t0",
    "g1"
   ],
   [
    "g1",
    "t1",
    "до 1 млн"
   ],
   [
    "g1",
    "t2",
    "от 1 млн"
   ],
   [
    "t1",
    "g2"
   ],
   [
    "t2",
    "g2"
   ],
   [
    "g2",
    "t3"
   ],
   [
    "t3",
    "e"
   ]
  ]
 },
 "credit_or": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 1,
    "label": "Заявка на кредит"
   },
   {
    "id": "t0",
    "type": "task",
    "col": 1,
    "row": 1,
    "label": "Проверить заявку"
   },
   {
    "id": "g1",
    "type": "gw-or",
    "col": 2,
    "row": 1
   },
   {
    "id": "t1",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Проверить кредитную историю"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 1,
    "label": "Проверить залог"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 3,
    "row": 2,
    "label": "Проверить поручителя"
   },
   {
    "id": "g2",
    "type": "gw-or",
    "col": 4,
    "row": 1
   },
   {
    "id": "t4",
    "type": "task",
    "col": 5,
    "row": 1,
    "label": "Принять решение"
   },
   {
    "id": "e",
    "type": "end",
    "col": 6,
    "row": 1,
    "label": "Решение принято"
   }
  ],
  "flows": [
   [
    "s",
    "t0"
   ],
   [
    "t0",
    "g1"
   ],
   [
    "g1",
    "t1",
    "всегда"
   ],
   [
    "g1",
    "t2",
    "залог"
   ],
   [
    "g1",
    "t3",
    "поручитель"
   ],
   [
    "t1",
    "g2"
   ],
   [
    "t2",
    "g2"
   ],
   [
    "t3",
    "g2"
   ],
   [
    "g2",
    "t4"
   ],
   [
    "t4",
    "e"
   ]
  ]
 },
 "pay_wait": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заказ создан"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Выставить счёт"
   },
   {
    "id": "g1",
    "type": "gw-event",
    "col": 2,
    "row": 0
   },
   {
    "id": "c1",
    "type": "inter-catch",
    "col": 3,
    "row": 0,
    "label": "Оплата получена"
   },
   {
    "id": "c2",
    "type": "inter-timer",
    "col": 3,
    "row": 1,
    "label": "3 дня"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 4,
    "row": 0,
    "label": "Отгрузить заказ"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 4,
    "row": 1,
    "label": "Отменить заказ"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 5,
    "row": 0,
    "label": "Заказ выполнен"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 5,
    "row": 1,
    "label": "Заказ отменён"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "c1"
   ],
   [
    "g1",
    "c2"
   ],
   [
    "c1",
    "t2"
   ],
   [
    "c2",
    "t3"
   ],
   [
    "t2",
    "e1"
   ],
   [
    "t3",
    "e2"
   ]
  ]
 },
 "boundary_int": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Договор подготовлен"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Согласовать договор",
    "task": "user"
   },
   {
    "id": "b1",
    "type": "bound-timer",
    "attach": "t1",
    "col": 0,
    "row": 0,
    "dx": 34,
    "label": "2 дня"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 2,
    "row": 0,
    "label": "Договор согласован"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Эскалировать руководителю"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 3,
    "row": 1,
    "label": "Передано выше"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "e1"
   ],
   [
    "b1",
    "t2"
   ],
   [
    "t2",
    "e2"
   ]
  ]
 },
 "boundary_non": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Договор подготовлен"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Согласовать договор",
    "task": "user"
   },
   {
    "id": "b1",
    "type": "bound-timer",
    "attach": "t1",
    "col": 0,
    "row": 0,
    "dx": 34,
    "label": "2 дня",
    "non": true
   },
   {
    "id": "e1",
    "type": "end",
    "col": 2,
    "row": 0,
    "label": "Договор согласован"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Напомнить согласующему"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 3,
    "row": 1,
    "label": "Напоминание отправлено"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "e1"
   ],
   [
    "b1",
    "t2"
   ],
   [
    "t2",
    "e2"
   ]
  ]
 },
 "sub_error": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заявка получена"
   },
   {
    "id": "sub",
    "type": "sub",
    "col": 1,
    "row": 0,
    "label": "Обработать заявку"
   },
   {
    "id": "b1",
    "type": "bound-error",
    "attach": "sub",
    "col": 0,
    "row": 0,
    "dx": 34,
    "label": "Ошибка"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 2,
    "row": 0,
    "label": "Заявка обработана"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Уведомить об ошибке"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 3,
    "row": 1,
    "label": "Обработка не удалась"
   }
  ],
  "flows": [
   [
    "s",
    "sub"
   ],
   [
    "sub",
    "e1"
   ],
   [
    "b1",
    "t2"
   ],
   [
    "t2",
    "e2"
   ]
  ]
 },
 "bank_msg": {
  "lanes": [
   {
    "name": "Клиент",
    "rows": 1
   },
   {
    "name": "Банк",
    "rows": 1
   }
  ],
  "nodes": [
   {
    "id": "s1",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Нужен перевод"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Отправить платёж"
   },
   {
    "id": "c1",
    "type": "inter-catch",
    "col": 3,
    "row": 0,
    "label": "Подтверждение"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 4,
    "row": 0,
    "label": "Перевод получен"
   },
   {
    "id": "s2",
    "type": "start-msg",
    "col": 1,
    "row": 1,
    "label": "Платёж получен"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Провести платёж"
   },
   {
    "id": "th",
    "type": "inter-throw",
    "col": 3,
    "row": 1,
    "label": "Отправить подтверждение"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 4,
    "row": 1,
    "label": "Платёж проведён"
   }
  ],
  "flows": [
   [
    "s1",
    "t1"
   ],
   [
    "t1",
    "c1"
   ],
   [
    "c1",
    "e1"
   ],
   [
    "t1",
    "s2",
    "платёж",
    "msg"
   ],
   [
    "s2",
    "t2"
   ],
   [
    "t2",
    "th"
   ],
   [
    "th",
    "e2"
   ],
   [
    "th",
    "c1",
    "подтверждение",
    "msg"
   ]
  ]
 },
 "rework": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Документы поданы"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Проверить документы"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 2,
    "row": 0,
    "label": "Документы верны?"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 1,
    "row": 1,
    "label": "Запросить исправления"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Оформить договор"
   },
   {
    "id": "e",
    "type": "end",
    "col": 4,
    "row": 0,
    "label": "Договор оформлен"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "t3",
    "да"
   ],
   [
    "g1",
    "t2",
    "нет",
    "down"
   ],
   [
    "t2",
    "t1"
   ],
   [
    "t3",
    "e"
   ]
  ]
 },
 "support": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Обращение получено"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Принять обращение",
    "task": "user"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 2,
    "row": 0,
    "label": "Решено сразу?"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 3,
    "row": 0,
    "label": "Обращение закрыто"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 1,
    "label": "Передать на 2 линию"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "e1",
    "да"
   ],
   [
    "g1",
    "t2",
    "нет",
    "default"
   ]
  ]
 },
 "expense": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заявка на расходы"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Подать заявку"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 2,
    "row": 0,
    "label": "Сумма?"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Утвердить автоматически"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 3,
    "row": 1,
    "label": "Согласовать у руководителя"
   },
   {
    "id": "g2",
    "type": "gw-xor",
    "col": 4,
    "row": 0
   },
   {
    "id": "t4",
    "type": "task",
    "col": 5,
    "row": 0,
    "label": "Оплатить расходы"
   },
   {
    "id": "e",
    "type": "end",
    "col": 6,
    "row": 0,
    "label": "Расходы оплачены"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "t2",
    "до 10 000"
   ],
   [
    "g1",
    "t3",
    "от 10 000"
   ],
   [
    "t2",
    "g2"
   ],
   [
    "t3",
    "g2"
   ],
   [
    "g2",
    "t4"
   ],
   [
    "t4",
    "e"
   ]
  ]
 },
 "service_error": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заказ подтверждён"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Списать оплату",
    "task": "service"
   },
   {
    "id": "b1",
    "type": "bound-error",
    "attach": "t1",
    "col": 0,
    "row": 0,
    "dx": 34,
    "label": "Ошибка платежа"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Подтвердить заказ"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 3,
    "row": 0,
    "label": "Заказ принят"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Уведомить клиента"
   },
   {
    "id": "e2",
    "type": "end",
    "col": 3,
    "row": 1,
    "label": "Платёж не прошёл"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "t3"
   ],
   [
    "t3",
    "e1"
   ],
   [
    "b1",
    "t2"
   ],
   [
    "t2",
    "e2"
   ]
  ]
 },
 "multi": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заказ получен"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Проверить позицию заказа",
    "mi": "par"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Подтвердить заказ"
   },
   {
    "id": "e",
    "type": "end",
    "col": 3,
    "row": 0,
    "label": "Заказ подтверждён"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "t2"
   ],
   [
    "t2",
    "e"
   ]
  ]
 },
 "starts": {
  "nodes": [
   {
    "id": "s1",
    "type": "start-msg",
    "col": 0,
    "row": 0,
    "label": "Заявка получена"
   },
   {
    "id": "s2",
    "type": "start-timer",
    "col": 0,
    "row": 1,
    "label": "Каждый понедельник"
   },
   {
    "id": "s3",
    "type": "start",
    "col": 0,
    "row": 2,
    "label": "Создан вручную"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Сформировать отчёт"
   },
   {
    "id": "e",
    "type": "end",
    "col": 3,
    "row": 1,
    "label": "Отчёт готов"
   }
  ],
  "flows": [
   [
    "s1",
    "t1"
   ],
   [
    "s2",
    "t1"
   ],
   [
    "s3",
    "t1"
   ],
   [
    "t1",
    "e"
   ]
  ]
 },
 "doc_data": {
  "nodes": [
   {
    "id": "t1",
    "type": "task",
    "col": 0,
    "row": 0,
    "label": "Составить договор",
    "task": "user"
   },
   {
    "id": "d",
    "type": "data",
    "col": 1,
    "row": 1,
    "label": "Договор"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Согласовать договор",
    "task": "user"
   },
   {
    "id": "e",
    "type": "end",
    "col": 3,
    "row": 0,
    "label": "Договор согласован"
   }
  ],
  "flows": [
   [
    "t1",
    "t2"
   ],
   [
    "t2",
    "e"
   ],
   [
    "t1",
    "d",
    null,
    "assoc"
   ],
   [
    "d",
    "t2",
    null,
    "assoc"
   ]
  ]
 },
 "terminate": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заказ принят"
   },
   {
    "id": "g1",
    "type": "gw-and",
    "col": 1,
    "row": 0
   },
   {
    "id": "t1",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Подготовить заказ"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Проверить оплату"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 3,
    "row": 0,
    "label": "Заказ готов"
   },
   {
    "id": "e2",
    "type": "end-term",
    "col": 3,
    "row": 1,
    "label": "Оплата не прошла"
   }
  ],
  "flows": [
   [
    "s",
    "g1"
   ],
   [
    "g1",
    "t1"
   ],
   [
    "g1",
    "t2"
   ],
   [
    "t1",
    "e1"
   ],
   [
    "t2",
    "e2"
   ]
  ]
 },
 "wait_partner": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Нужен ответ партнёра"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Отправить запрос партнёру"
   },
   {
    "id": "c1",
    "type": "inter-catch",
    "col": 2,
    "row": 0,
    "label": "Ответ партнёра"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Обработать ответ"
   },
   {
    "id": "e",
    "type": "end",
    "col": 4,
    "row": 0,
    "label": "Запрос закрыт"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "c1"
   ],
   [
    "c1",
    "t2"
   ],
   [
    "t2",
    "e"
   ]
  ]
 },
 "approve_loop": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Отчёт подготовлен"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Проверить отчёт",
    "task": "user",
    "loop": true
   },
   {
    "id": "e",
    "type": "end",
    "col": 2,
    "row": 0,
    "label": "Отчёт принят"
   }
  ],
  "flows": [
   [
    "s",
    "t1"
   ],
   [
    "t1",
    "e"
   ]
  ]
 },
 "no_start": {
  "nodes": [
   {
    "id": "t1",
    "type": "task",
    "col": 0,
    "row": 0,
    "label": "Принять заказ"
   },
   {
    "id": "g1",
    "type": "gw-xor",
    "col": 1,
    "row": 0,
    "label": "Оплачен?"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Отгрузить"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Ждать оплату"
   }
  ],
  "flows": [
   [
    "t1",
    "g1"
   ],
   [
    "g1",
    "t2",
    "да"
   ],
   [
    "g1",
    "t3",
    "нет"
   ]
  ]
 },
 "and_split_xor_join": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Заказ принят"
   },
   {
    "id": "g1",
    "type": "gw-and",
    "col": 1,
    "row": 0
   },
   {
    "id": "t1",
    "type": "task",
    "col": 2,
    "row": 0,
    "label": "Собрать заказ"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Подготовить счёт"
   },
   {
    "id": "g2",
    "type": "gw-xor",
    "col": 3,
    "row": 0
   },
   {
    "id": "t3",
    "type": "task",
    "col": 4,
    "row": 0,
    "label": "Отправить клиенту"
   },
   {
    "id": "e",
    "type": "end",
    "col": 5,
    "row": 0,
    "label": "Заказ отправлен"
   }
  ],
  "flows": [
   [
    "s",
    "g1"
   ],
   [
    "g1",
    "t1"
   ],
   [
    "g1",
    "t2"
   ],
   [
    "t1",
    "g2"
   ],
   [
    "t2",
    "g2"
   ],
   [
    "g2",
    "t3"
   ],
   [
    "t3",
    "e"
   ]
  ]
 },
 "pools_msg": {
  "lanes": [
   {
    "name": "Покупатель",
    "rows": 1
   },
   {
    "name": "Поставщик",
    "rows": 1
   }
  ],
  "nodes": [
   {
    "id": "s1",
    "type": "start",
    "col": 0,
    "row": 0,
    "label": "Нужен товар"
   },
   {
    "id": "t1",
    "type": "task",
    "col": 1,
    "row": 0,
    "label": "Отправить заказ"
   },
   {
    "id": "c1",
    "type": "inter-catch",
    "col": 2,
    "row": 0,
    "label": "Счёт"
   },
   {
    "id": "t3",
    "type": "task",
    "col": 3,
    "row": 0,
    "label": "Оплатить счёт"
   },
   {
    "id": "e1",
    "type": "end",
    "col": 4,
    "row": 0,
    "label": "Оплачено"
   },
   {
    "id": "s2",
    "type": "start-msg",
    "col": 1,
    "row": 1,
    "label": "Заказ получен"
   },
   {
    "id": "t2",
    "type": "task",
    "col": 2,
    "row": 1,
    "label": "Выставить счёт"
   },
   {
    "id": "e2",
    "type": "end-msg",
    "col": 3,
    "row": 1,
    "label": "Счёт отправлен"
   }
  ],
  "flows": [
   [
    "s1",
    "t1"
   ],
   [
    "t1",
    "c1"
   ],
   [
    "c1",
    "t3"
   ],
   [
    "t3",
    "e1"
   ],
   [
    "t1",
    "s2",
    "заказ",
    "msg"
   ],
   [
    "s2",
    "t2"
   ],
   [
    "t2",
    "e2"
   ],
   [
    "e2",
    "c1",
    "счёт",
    "msg"
   ]
  ]
 },
 "sym_start": {
  "nodes": [
   {
    "id": "s",
    "type": "start",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_end": {
  "nodes": [
   {
    "id": "s",
    "type": "end",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_start_msg": {
  "nodes": [
   {
    "id": "s",
    "type": "start-msg",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_start_timer": {
  "nodes": [
   {
    "id": "s",
    "type": "start-timer",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_end_term": {
  "nodes": [
   {
    "id": "s",
    "type": "end-term",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_end_error": {
  "nodes": [
   {
    "id": "s",
    "type": "end-error",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_inter_timer": {
  "nodes": [
   {
    "id": "s",
    "type": "inter-timer",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_inter_catch": {
  "nodes": [
   {
    "id": "s",
    "type": "inter-catch",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_xor": {
  "nodes": [
   {
    "id": "s",
    "type": "gw-xor",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_and": {
  "nodes": [
   {
    "id": "s",
    "type": "gw-and",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_or": {
  "nodes": [
   {
    "id": "s",
    "type": "gw-or",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_event": {
  "nodes": [
   {
    "id": "s",
    "type": "gw-event",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "sym_user": {
  "nodes": [
   {
    "id": "s",
    "type": "task",
    "col": 0,
    "row": 0,
    "label": "Заполнить форму",
    "task": "user"
   }
  ],
  "flows": []
 },
 "sym_service": {
  "nodes": [
   {
    "id": "s",
    "type": "task",
    "col": 0,
    "row": 0,
    "label": "Рассчитать цену",
    "task": "service"
   }
  ],
  "flows": []
 },
 "sym_sub": {
  "nodes": [
   {
    "id": "s",
    "type": "sub",
    "col": 0,
    "row": 0,
    "label": "Обработать платёж"
   }
  ],
  "flows": []
 },
 "sym_data": {
  "nodes": [
   {
    "id": "s",
    "type": "data",
    "col": 0,
    "row": 0,
    "label": "Счёт"
   }
  ],
  "flows": []
 }
};

// Схемы диаграмм вариантов использования: system — граница системы (c0..c1 — колонки), nodes — actor/sys/uc (col/row — позиция),
// flows — [от, к, вид, подпись]; вид: include, extend, gen — обобщение (стрелка к родителю); без вида — ассоциация.
window.UCDS = {
 "shop": {
  "system": {
   "name": "Интернет-магазин",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "cust",
    "type": "actor",
    "label": "Покупатель",
    "col": 0,
    "row": 1
   },
   {
    "id": "admin",
    "type": "actor",
    "label": "Администратор",
    "col": 4,
    "row": 0
   },
   {
    "id": "pay",
    "type": "sys",
    "label": "Платёжная система",
    "col": 4,
    "row": 2
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Просмотреть каталог",
    "col": 1,
    "row": 0
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 1,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Оплатить заказ",
    "col": 2,
    "row": 1
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Применить промокод",
    "col": 1,
    "row": 2
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Войти в систему",
    "col": 2,
    "row": 0
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Управлять товарами",
    "col": 3,
    "row": 0
   },
   {
    "id": "u7",
    "type": "uc",
    "label": "Просмотреть заказы",
    "col": 3,
    "row": 1
   }
  ],
  "flows": [
   [
    "cust",
    "u1"
   ],
   [
    "cust",
    "u2"
   ],
   [
    "u2",
    "u3",
    "include"
   ],
   [
    "u2",
    "u5",
    "include"
   ],
   [
    "u4",
    "u2",
    "extend"
   ],
   [
    "admin",
    "u6"
   ],
   [
    "admin",
    "u7"
   ],
   [
    "pay",
    "u3"
   ]
  ]
 },
 "atm": {
  "system": {
   "name": "Банкомат",
   "c0": 1,
   "c1": 2
  },
  "nodes": [
   {
    "id": "client",
    "type": "actor",
    "label": "Клиент банка",
    "col": 0,
    "row": 1
   },
   {
    "id": "bank",
    "type": "sys",
    "label": "Банк",
    "col": 3,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Снять наличные",
    "col": 1,
    "row": 0
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Проверить баланс",
    "col": 1,
    "row": 2
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Ввести PIN-код",
    "col": 2,
    "row": 0
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Распечатать чек",
    "col": 2,
    "row": 1
   }
  ],
  "flows": [
   [
    "client",
    "u1"
   ],
   [
    "client",
    "u2"
   ],
   [
    "u1",
    "u3",
    "include"
   ],
   [
    "u2",
    "u3",
    "include"
   ],
   [
    "u4",
    "u1",
    "extend"
   ],
   [
    "bank",
    "u3"
   ],
   [
    "bank",
    "u2"
   ]
  ]
 },
 "library": {
  "system": {
   "name": "Библиотека",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "reader",
    "type": "actor",
    "label": "Читатель",
    "col": 0,
    "row": 1
   },
   {
    "id": "lib",
    "type": "actor",
    "label": "Библиотекарь",
    "col": 4,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Найти книгу",
    "col": 1,
    "row": 0
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Взять книгу",
    "col": 1,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Вернуть книгу",
    "col": 1,
    "row": 2
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Оплатить штраф",
    "col": 2,
    "row": 2
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Проверить билет",
    "col": 2,
    "row": 1
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Зарегистрировать читателя",
    "col": 3,
    "row": 0
   },
   {
    "id": "u7",
    "type": "uc",
    "label": "Списать книгу",
    "col": 3,
    "row": 2
   }
  ],
  "flows": [
   [
    "reader",
    "u1"
   ],
   [
    "reader",
    "u2"
   ],
   [
    "reader",
    "u3"
   ],
   [
    "u2",
    "u6",
    "include"
   ],
   [
    "u3",
    "u6",
    "include"
   ],
   [
    "u4",
    "u3",
    "extend"
   ],
   [
    "lib",
    "u5"
   ],
   [
    "lib",
    "u7"
   ],
   [
    "lib",
    "u6"
   ]
  ]
 },
 "actor_gen": {
  "system": {
   "name": "Магазин",
   "c0": 2,
   "c1": 3
  },
  "nodes": [
   {
    "id": "guest",
    "type": "actor",
    "label": "Гость",
    "col": 0,
    "row": 0
   },
   {
    "id": "buyer",
    "type": "actor",
    "label": "Покупатель",
    "col": 0,
    "row": 2
   },
   {
    "id": "visitor",
    "type": "actor",
    "label": "Посетитель",
    "col": 1,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Просмотреть каталог",
    "col": 2,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 3,
    "row": 2
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Зарегистрироваться",
    "col": 3,
    "row": 0
   }
  ],
  "flows": [
   [
    "guest",
    "visitor",
    "gen"
   ],
   [
    "buyer",
    "visitor",
    "gen"
   ],
   [
    "visitor",
    "u1"
   ],
   [
    "buyer",
    "u2"
   ],
   [
    "guest",
    "u3"
   ]
  ]
 },
 "uc_gen": {
  "system": {
   "name": "Оплата",
   "c0": 1,
   "c1": 2
  },
  "nodes": [
   {
    "id": "cust",
    "type": "actor",
    "label": "Покупатель",
    "col": 0,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Оплатить заказ",
    "col": 1,
    "row": 1
   },
   {
    "id": "c1",
    "type": "uc",
    "label": "Оплатить картой",
    "col": 2,
    "row": 0
   },
   {
    "id": "c2",
    "type": "uc",
    "label": "Оплатить наличными",
    "col": 2,
    "row": 2
   }
  ],
  "flows": [
   [
    "cust",
    "u1"
   ],
   [
    "c1",
    "u1",
    "gen"
   ],
   [
    "c2",
    "u1",
    "gen"
   ]
  ]
 },
 "hotel": {
  "system": {
   "name": "Система бронирования отеля",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "guest",
    "type": "actor",
    "label": "Гость",
    "col": 0,
    "row": 1
   },
   {
    "id": "admin",
    "type": "actor",
    "label": "Администратор отеля",
    "col": 4,
    "row": 1
   },
   {
    "id": "pay",
    "type": "sys",
    "label": "Платёжная система",
    "col": 4,
    "row": 2
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Забронировать номер",
    "col": 1,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Выбрать даты",
    "col": 2,
    "row": 0
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Добавить услуги",
    "col": 2,
    "row": 2
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Отменить бронь",
    "col": 1,
    "row": 2
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Заселить гостя",
    "col": 3,
    "row": 0
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Выставить счёт",
    "col": 3,
    "row": 1
   }
  ],
  "flows": [
   [
    "guest",
    "u1"
   ],
   [
    "guest",
    "u4"
   ],
   [
    "u1",
    "u2",
    "include"
   ],
   [
    "u3",
    "u1",
    "extend"
   ],
   [
    "admin",
    "u5"
   ],
   [
    "admin",
    "u6"
   ],
   [
    "pay",
    "u6"
   ]
  ]
 },
 "helpdesk": {
  "system": {
   "name": "Служба поддержки",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "client",
    "type": "actor",
    "label": "Клиент",
    "col": 0,
    "row": 1
   },
   {
    "id": "oper",
    "type": "actor",
    "label": "Оператор",
    "col": 4,
    "row": 1
   },
   {
    "id": "mgr",
    "type": "actor",
    "label": "Руководитель",
    "col": 4,
    "row": 0
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Создать обращение",
    "col": 1,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Отследить статус",
    "col": 1,
    "row": 2
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Оценить качество",
    "col": 1,
    "row": 0
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Обработать обращение",
    "col": 2,
    "row": 1
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Закрыть обращение",
    "col": 2,
    "row": 0
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Назначить оператора",
    "col": 3,
    "row": 0
   },
   {
    "id": "u7",
    "type": "uc",
    "label": "Эскалировать обращение",
    "col": 3,
    "row": 2
   }
  ],
  "flows": [
   [
    "client",
    "u1"
   ],
   [
    "client",
    "u2"
   ],
   [
    "client",
    "u5"
   ],
   [
    "oper",
    "u3"
   ],
   [
    "oper",
    "u4"
   ],
   [
    "mgr",
    "u6"
   ],
   [
    "u7",
    "u3",
    "extend"
   ],
   [
    "u5",
    "u4",
    "extend"
   ]
  ]
 },
 "clinic": {
  "system": {
   "name": "Поликлиника",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "pat",
    "type": "actor",
    "label": "Пациент",
    "col": 0,
    "row": 1
   },
   {
    "id": "doc",
    "type": "actor",
    "label": "Врач",
    "col": 4,
    "row": 0
   },
   {
    "id": "reg",
    "type": "actor",
    "label": "Регистратор",
    "col": 4,
    "row": 2
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Записаться на приём",
    "col": 1,
    "row": 0
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Отменить запись",
    "col": 1,
    "row": 2
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Проверить расписание",
    "col": 2,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Провести приём",
    "col": 3,
    "row": 0
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Выписать рецепт",
    "col": 3,
    "row": 1
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Зарегистрировать пациента",
    "col": 3,
    "row": 2
   }
  ],
  "flows": [
   [
    "pat",
    "u1"
   ],
   [
    "pat",
    "u2"
   ],
   [
    "u1",
    "u6",
    "include"
   ],
   [
    "u2",
    "u6",
    "include"
   ],
   [
    "doc",
    "u3"
   ],
   [
    "doc",
    "u4"
   ],
   [
    "u4",
    "u3",
    "extend"
   ],
   [
    "reg",
    "u5"
   ]
  ]
 },
 "mbank": {
  "system": {
   "name": "Мобильный банк",
   "c0": 1,
   "c1": 2
  },
  "nodes": [
   {
    "id": "client",
    "type": "actor",
    "label": "Клиент",
    "col": 0,
    "row": 1
   },
   {
    "id": "proc",
    "type": "sys",
    "label": "Процессинг",
    "col": 3,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Перевести деньги",
    "col": 1,
    "row": 0
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Посмотреть историю",
    "col": 1,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Оплатить услуги",
    "col": 1,
    "row": 2
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Подтвердить операцию",
    "col": 2,
    "row": 1
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Заблокировать карту",
    "col": 2,
    "row": 2
   }
  ],
  "flows": [
   [
    "client",
    "u1"
   ],
   [
    "client",
    "u4"
   ],
   [
    "client",
    "u3"
   ],
   [
    "u1",
    "u2",
    "include"
   ],
   [
    "u3",
    "u2",
    "include"
   ],
   [
    "client",
    "u5"
   ],
   [
    "proc",
    "u2"
   ]
  ]
 },
 "delivery": {
  "system": {
   "name": "Служба доставки",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "cust",
    "type": "actor",
    "label": "Клиент",
    "col": 0,
    "row": 1
   },
   {
    "id": "disp",
    "type": "actor",
    "label": "Диспетчер",
    "col": 4,
    "row": 0
   },
   {
    "id": "cour",
    "type": "actor",
    "label": "Курьер",
    "col": 4,
    "row": 2
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Оформить доставку",
    "col": 1,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Отследить заказ",
    "col": 1,
    "row": 2
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Рассчитать стоимость",
    "col": 2,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Назначить курьера",
    "col": 3,
    "row": 0
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Доставить заказ",
    "col": 3,
    "row": 2
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Сообщить о задержке",
    "col": 3,
    "row": 1
   }
  ],
  "flows": [
   [
    "cust",
    "u1"
   ],
   [
    "cust",
    "u2"
   ],
   [
    "u1",
    "u5",
    "include"
   ],
   [
    "disp",
    "u3"
   ],
   [
    "cour",
    "u4"
   ],
   [
    "u6",
    "u4",
    "extend"
   ],
   [
    "cour",
    "u6"
   ]
  ]
 },
 "elearn": {
  "system": {
   "name": "Платформа онлайн-обучения",
   "c0": 1,
   "c1": 3
  },
  "nodes": [
   {
    "id": "stud",
    "type": "actor",
    "label": "Студент",
    "col": 0,
    "row": 1
   },
   {
    "id": "teach",
    "type": "actor",
    "label": "Преподаватель",
    "col": 4,
    "row": 1
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "Пройти тест",
    "col": 1,
    "row": 0
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Записаться на курс",
    "col": 1,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Посмотреть оценки",
    "col": 1,
    "row": 2
   },
   {
    "id": "u7",
    "type": "uc",
    "label": "Оплатить курс",
    "col": 2,
    "row": 1
   },
   {
    "id": "u4",
    "type": "uc",
    "label": "Создать курс",
    "col": 3,
    "row": 0
   },
   {
    "id": "u5",
    "type": "uc",
    "label": "Проверить работы",
    "col": 3,
    "row": 1
   },
   {
    "id": "u6",
    "type": "uc",
    "label": "Выставить оценку",
    "col": 3,
    "row": 2
   }
  ],
  "flows": [
   [
    "stud",
    "u1"
   ],
   [
    "stud",
    "u3"
   ],
   [
    "stud",
    "u2"
   ],
   [
    "u7",
    "u3",
    "extend"
   ],
   [
    "teach",
    "u4"
   ],
   [
    "teach",
    "u5"
   ],
   [
    "u5",
    "u6",
    "include"
   ]
  ]
 },
 "bad_model": {
  "system": {
   "name": "Система учёта",
   "c0": 1,
   "c1": 2
  },
  "nodes": [
   {
    "id": "user",
    "type": "actor",
    "label": "Пользователь",
    "col": 0,
    "row": 0
   },
   {
    "id": "admin",
    "type": "actor",
    "label": "Администратор",
    "col": 0,
    "row": 2
   },
   {
    "id": "u1",
    "type": "uc",
    "label": "База данных",
    "col": 1,
    "row": 1
   },
   {
    "id": "u2",
    "type": "uc",
    "label": "Нажать кнопку «Сохранить»",
    "col": 2,
    "row": 1
   },
   {
    "id": "u3",
    "type": "uc",
    "label": "Войти",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "user",
    "admin"
   ],
   [
    "user",
    "u1"
   ],
   [
    "user",
    "u3"
   ],
   [
    "admin",
    "u2"
   ]
  ]
 },
 "uc_actor": {
  "nodes": [
   {
    "id": "a",
    "type": "actor",
    "label": "Пользователь",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "uc_uc": {
  "nodes": [
   {
    "id": "a",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "uc_sys_actor": {
  "nodes": [
   {
    "id": "a",
    "type": "sys",
    "label": "Платёжная система",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "uc_boundary": {
  "system": {
   "name": "Интернет-магазин",
   "c0": 0,
   "c1": 0
  },
  "nodes": [
   {
    "id": "a",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 0,
    "row": 0
   }
  ],
  "flows": []
 },
 "uc_assoc": {
  "nodes": [
   {
    "id": "a",
    "type": "actor",
    "label": "Покупатель",
    "col": 0,
    "row": 0
   },
   {
    "id": "u",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "a",
    "u"
   ]
  ]
 },
 "uc_include": {
  "nodes": [
   {
    "id": "a",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 0,
    "row": 0
   },
   {
    "id": "b",
    "type": "uc",
    "label": "Оплатить заказ",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "a",
    "b",
    "include"
   ]
  ]
 },
 "uc_extend": {
  "nodes": [
   {
    "id": "a",
    "type": "uc",
    "label": "Применить промокод",
    "col": 0,
    "row": 0
   },
   {
    "id": "b",
    "type": "uc",
    "label": "Оформить заказ",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "a",
    "b",
    "extend"
   ]
  ]
 },
 "uc_gen_actor": {
  "nodes": [
   {
    "id": "a",
    "type": "actor",
    "label": "Покупатель",
    "col": 0,
    "row": 0
   },
   {
    "id": "b",
    "type": "actor",
    "label": "Пользователь",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "a",
    "b",
    "gen"
   ]
  ]
 },
 "uc_gen_uc": {
  "nodes": [
   {
    "id": "a",
    "type": "uc",
    "label": "Оплатить картой",
    "col": 0,
    "row": 0
   },
   {
    "id": "b",
    "type": "uc",
    "label": "Оплатить заказ",
    "col": 1,
    "row": 0
   }
  ],
  "flows": [
   [
    "a",
    "b",
    "gen"
   ]
  ]
 }
};

// Схемы диаграмм последовательности: participants (obj/actor), events по порядку сверху вниз:
// ["msg", от, к, подпись, вид] (sync/async/reply/create/destroy), ["note", участник, текст], ["frag", alt|opt|loop|par|break, [[условие, события], ...]].
window.SEQS = {"login":{"participants":[{"id":"user","label":"Пользователь","type":"actor"},{"id":"ui","label":"Интерфейс","type":"obj"},{"id":"auth","label":"Сервис входа","type":"obj"},{"id":"db","label":"База данных","type":"obj"}],"events":[["msg","user","ui","ввести логин и пароль","sync"],["msg","ui","auth","authenticate()","sync"],["msg","auth","db","найти пользователя","sync"],["msg","db","auth","данные пользователя","reply"],["frag","alt",[["пароль верный",[["msg","auth","ui","токен","reply"]]],["пароль неверный",[["msg","auth","ui","ошибка 401","reply"]]]]],["msg","ui","user","результат входа","reply"]]},"order":{"participants":[{"id":"cust","label":"Покупатель","type":"actor"},{"id":"shop","label":"Магазин","type":"obj"},{"id":"pay","label":"Платёжный сервис","type":"obj"},{"id":"wh","label":"Склад","type":"obj"}],"events":[["msg","cust","shop","оформить заказ","sync"],["msg","shop","pay","списать оплату","sync"],["msg","pay","shop","результат оплаты","reply"],["frag","alt",[["оплата прошла",[["msg","shop","wh","зарезервировать товар","sync"],["msg","wh","shop","резерв создан","reply"],["msg","shop","cust","заказ принят","reply"]]],["оплата отклонена",[["msg","shop","cust","отказ в оплате","reply"]]]]]]},"atm":{"participants":[{"id":"client","label":"Клиент","type":"actor"},{"id":"atm","label":"Банкомат","type":"obj"},{"id":"bank","label":"Банк","type":"obj"}],"events":[["msg","client","atm","вставить карту, ввести PIN","sync"],["msg","atm","bank","проверить PIN","sync"],["msg","bank","atm","PIN верный","reply"],["msg","atm","atm","выдать наличные","sync"],["frag","opt",[["клиент запросил чек",[["msg","atm","atm","напечатать чек","sync"]]]]],["msg","atm","client","карта и наличные","reply"]]},"async":{"participants":[{"id":"orders","label":"Сервис заказов","type":"obj"},{"id":"broker","label":"Брокер сообщений","type":"obj"},{"id":"stock","label":"Сервис склада","type":"obj"}],"events":[["msg","orders","broker","OrderCreated","async"],["note","broker","сообщение хранится до доставки"],["msg","broker","stock","OrderCreated","async"],["msg","stock","stock","зарезервировать товар","sync"],["msg","stock","broker","StockReserved","async"]]},"poll":{"participants":[{"id":"client","label":"Клиент","type":"obj"},{"id":"server","label":"Сервер","type":"obj"}],"events":[["msg","client","server","POST /report","sync"],["msg","server","client","202 Accepted, id=42","reply"],["frag","loop",[["пока статус не готов",[["msg","client","server","GET /report/42","sync"],["msg","server","client","статус","reply"]]]]],["msg","client","server","GET /report/42/result","sync"],["msg","server","client","файл отчёта","reply"]]},"create_destroy":{"participants":[{"id":"ctrl","label":"Контроллер","type":"obj"},{"id":"sess","label":"Сессия","type":"obj"}],"events":[["msg","ctrl","sess","«create»","create"],["msg","ctrl","sess","process()","sync"],["msg","sess","ctrl","результат","reply"],["msg","ctrl","sess","«destroy»","destroy"]]},"parallel":{"participants":[{"id":"client","label":"Клиент","type":"obj"},{"id":"search","label":"Сервис поиска","type":"obj"},{"id":"cat","label":"Каталог","type":"obj"},{"id":"rev","label":"Отзывы","type":"obj"}],"events":[["msg","client","search","найти товар","sync"],["frag","par",[["",[["msg","search","cat","получить товары","sync"],["msg","cat","search","список","reply"]]],["",[["msg","search","rev","получить оценки","sync"],["msg","rev","search","оценки","reply"]]]]],["msg","search","client","результаты поиска","reply"]]},"gateway":{"participants":[{"id":"br","label":"Браузер","type":"obj"},{"id":"gw","label":"API-шлюз","type":"obj"},{"id":"auth","label":"Сервис авторизации","type":"obj"},{"id":"ord","label":"Сервис заказов","type":"obj"}],"events":[["msg","br","gw","GET /orders + токен","sync"],["msg","gw","auth","проверить токен","sync"],["msg","auth","gw","результат проверки","reply"],["frag","alt",[["токен действителен",[["msg","gw","ord","GET /orders","sync"],["msg","ord","gw","список","reply"],["msg","gw","br","200 OK","reply"]]],["токен недействителен",[["msg","gw","br","401 Unauthorized","reply"]]]]]]},"retry":{"participants":[{"id":"client","label":"Клиент","type":"obj"},{"id":"svc","label":"Платёжный сервис","type":"obj"}],"events":[["frag","loop",[["не более 3 попыток",[["msg","client","svc","POST /pay","sync"],["frag","alt",[["успех",[["msg","svc","client","200 OK","reply"]]],["ошибка 503",[["msg","svc","client","503","reply"]]]]]]]]]]},"saga":{"participants":[{"id":"order","label":"Заказ","type":"obj"},{"id":"pay","label":"Платёж","type":"obj"},{"id":"stock","label":"Склад","type":"obj"}],"events":[["msg","order","pay","списать оплату","sync"],["msg","pay","order","оплачено","reply"],["msg","order","stock","зарезервировать товар","sync"],["frag","alt",[["остатка нет",[["msg","stock","order","ошибка","reply"],["msg","order","pay","вернуть платёж","sync"],["msg","pay","order","возврат выполнен","reply"]]],["остаток есть",[["msg","stock","order","резерв создан","reply"]]]]]]},"notify":{"participants":[{"id":"svc","label":"Сервис заказов","type":"obj"},{"id":"mail","label":"Почтовый сервис","type":"obj"}],"events":[["msg","svc","svc","завершить заказ","sync"],["frag","opt",[["клиент подписан на уведомления",[["msg","svc","mail","отправить письмо","async"]]]]]]},"sym_lifeline":{"participants":[{"id":"a","label":"Заказ","type":"obj"}],"events":[]},"sym_actor":{"participants":[{"id":"a","label":"Покупатель","type":"actor"}],"events":[]},"sym_sync":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервер","type":"obj"}],"events":[["msg","a","b","getPrice()","sync"]]},"sym_async":{"participants":[{"id":"a","label":"Сервис А","type":"obj"},{"id":"b","label":"Сервис Б","type":"obj"}],"events":[["msg","a","b","событие","async"]]},"sym_reply":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервер","type":"obj"}],"events":[["msg","a","b","getPrice()","sync"],["msg","b","a","цена","reply"]]},"sym_self":{"participants":[{"id":"a","label":"Сервис","type":"obj"}],"events":[["msg","a","a","validate()","sync"]]},"sym_create":{"participants":[{"id":"a","label":"Контроллер","type":"obj"},{"id":"b","label":"Сессия","type":"obj"}],"events":[["msg","a","b","«create»","create"]]},"sym_destroy":{"participants":[{"id":"a","label":"Контроллер","type":"obj"},{"id":"b","label":"Сессия","type":"obj"}],"events":[["msg","a","b","close()","sync"],["msg","a","b","«destroy»","destroy"]]},"sym_alt":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервер","type":"obj"}],"events":[["frag","alt",[["оплата прошла",[["msg","a","b","подтвердить","sync"]]],["иначе",[["msg","a","b","отменить","sync"]]]]]]},"sym_loop":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервер","type":"obj"}],"events":[["frag","loop",[["пока есть данные",[["msg","a","b","запросить блок","sync"]]]]]]},"sym_opt":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервер","type":"obj"}],"events":[["frag","opt",[["есть промокод",[["msg","a","b","применить промокод","sync"]]]]]]},"sym_par":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервис Б","type":"obj"},{"id":"c","label":"Сервис В","type":"obj"}],"events":[["frag","par",[["",[["msg","a","b","запрос Б","sync"]]],["",[["msg","a","c","запрос В","sync"]]]]]]},"sym_nested":{"participants":[{"id":"a","label":"Клиент","type":"obj"},{"id":"b","label":"Сервис","type":"obj"},{"id":"c","label":"База","type":"obj"}],"events":[["msg","a","b","оформить()","sync"],["msg","b","c","сохранить()","sync"],["msg","c","b","ok","reply"],["msg","b","a","готово","reply"]]}};

// Схемы диаграмм состояний: nodes — state/init/final/choice/history/fork/comp (col/row — позиция в сетке; у comp — c0..c1, r0..r1),
// flows — [от, к, подпись перехода «событие [условие] / действие»].
window.STATES = {"order":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"new","type":"state","label":"Новый","col":1,"row":0},{"id":"paid","type":"state","label":"Оплачен","col":2,"row":0},{"id":"packed","type":"state","label":"Собран","col":3,"row":0},{"id":"cancel","type":"state","label":"Отменён","col":1,"row":2},{"id":"ship","type":"state","label":"Отправлен","col":3,"row":1},{"id":"deliv","type":"state","label":"Доставлен","col":3,"row":2},{"id":"fin","type":"final","col":2,"row":2}],"flows":[["i","new"],["new","paid","оплата получена"],["new","cancel","отмена"],["paid","packed","товар собран"],["paid","cancel","отмена / вернуть деньги"],["packed","ship","передан курьеру"],["ship","deliv","вручён"],["deliv","fin","срок возврата истёк"],["cancel","fin"]]},"door":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"closed","type":"state","label":"Закрыта","col":1,"row":0},{"id":"open","type":"state","label":"Открыта","col":2,"row":0},{"id":"locked","type":"state","label":"Заперта","col":1,"row":1}],"flows":[["i","closed"],["closed","open","открыть"],["open","closed","закрыть"],["closed","locked","запереть [есть ключ]"],["locked","closed","отпереть [есть ключ]"]]},"login":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"wait","type":"state","label":"Ожидание ввода","col":1,"row":0},{"id":"check","type":"state","label":"Проверка","col":2,"row":0},{"id":"ok","type":"state","label":"Вход выполнен","col":3,"row":0},{"id":"locked","type":"state","label":"Заблокирован","col":2,"row":1}],"flows":[["i","wait"],["wait","check","данные введены"],["check","wait","[пароль неверный, попыток < 3] / попыток++"],["check","ok","[пароль верный]"],["check","locked","[попыток = 3]"]]},"player":{"nodes":[{"id":"i","type":"init","col":0,"row":1},{"id":"stopped","type":"state","label":"Остановлен","col":1,"row":1},{"id":"playing","type":"state","label":"Воспроизведение","col":2,"row":0,"actions":["entry / включить звук","exit / выключить звук"]},{"id":"paused","type":"state","label":"Пауза","col":2,"row":2}],"flows":[["i","stopped"],["stopped","playing","play"],["playing","paused","pause"],["paused","playing","play"],["playing","stopped","stop"],["paused","stopped","stop"]]},"ticket":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"new","type":"state","label":"Новая","col":1,"row":0},{"id":"work","type":"state","label":"В работе","col":2,"row":0},{"id":"wait","type":"state","label":"Ожидает клиента","col":2,"row":2},{"id":"solved","type":"state","label":"Решена","col":3,"row":0},{"id":"closed","type":"state","label":"Закрыта","col":3,"row":2},{"id":"fin","type":"final","col":4,"row":2}],"flows":[["i","new"],["new","work","назначена"],["work","wait","запрошена информация"],["wait","work","ответ получен"],["work","solved","решение предложено"],["solved","work","клиент не согласен"],["solved","closed","after(3 дня)"],["closed","fin"]]},"comp_order":{"nodes":[{"id":"i","type":"init","col":0,"row":1},{"id":"proc","type":"comp","label":"Обработка заказа","c0":1,"c1":2,"r0":0,"r1":2},{"id":"pay","type":"state","label":"Ожидание оплаты","col":1,"row":1},{"id":"pack","type":"state","label":"Сборка","col":2,"row":1},{"id":"done","type":"state","label":"Отправлен","col":3,"row":0},{"id":"cancel","type":"state","label":"Отменён","col":3,"row":2}],"flows":[["i","pay","заказ создан"],["pay","pack","оплата получена"],["pack","done","собран"],["proc","cancel","отмена"]]},"history":{"nodes":[{"id":"i","type":"init","col":0,"row":1},{"id":"work","type":"comp","label":"Работает","c0":1,"c1":2,"r0":0,"r1":2},{"id":"h","type":"history","col":1,"row":0},{"id":"idle","type":"state","label":"Ожидание","col":1,"row":1},{"id":"print","type":"state","label":"Печать","col":2,"row":1},{"id":"err","type":"state","label":"Ошибка","col":3,"row":1}],"flows":[["i","idle"],["idle","print","получено задание"],["print","idle","задание завершено"],["work","err","сбой"],["err","h","сбой устранён"]]},"credit":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"app","type":"state","label":"Заявка","col":1,"row":0},{"id":"ch","type":"choice","col":2,"row":0},{"id":"auto","type":"state","label":"Одобрено автоматически","col":3,"row":0},{"id":"manual","type":"state","label":"Ручная проверка","col":2,"row":1},{"id":"reject","type":"state","label":"Отказано","col":3,"row":2}],"flows":[["i","app"],["app","ch","проверка завершена"],["ch","auto","[сумма ≤ 100 000]"],["ch","manual","[100 000 < сумма ≤ 1 000 000]"],["ch","reject","[сумма > 1 000 000]"]]},"fork_join":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"app","type":"state","label":"Заявка принята","col":0,"row":1},{"id":"fk","type":"fork","col":1,"row":1,"vert":true},{"id":"docs","type":"state","label":"Проверка документов","col":2,"row":0},{"id":"pay","type":"state","label":"Проверка платежа","col":2,"row":2},{"id":"jn","type":"fork","col":3,"row":1,"vert":true},{"id":"ready","type":"state","label":"Готово к выдаче","col":4,"row":1}],"flows":[["i","app"],["app","fk"],["fk","docs"],["fk","pay"],["docs","jn"],["pay","jn"],["jn","ready"]]},"traffic":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"red","type":"state","label":"Красный","col":1,"row":0},{"id":"green","type":"state","label":"Зелёный","col":3,"row":0},{"id":"yellow","type":"state","label":"Жёлтый","col":2,"row":1}],"flows":[["i","red"],["red","green","after(30 с)"],["green","yellow","after(25 с)"],["yellow","red","after(5 с)"]]},"conn":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"disc","type":"state","label":"Отключено","col":1,"row":0},{"id":"conn","type":"state","label":"Подключено","col":2,"row":0,"actions":["entry / открыть сокет","do / отправлять heartbeat","exit / закрыть сокет"]},{"id":"err","type":"state","label":"Ошибка","col":3,"row":0}],"flows":[["i","disc"],["disc","conn","connect()"],["conn","disc","disconnect()"],["conn","err","таймаут"],["err","disc","сброс"]]},"cart":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"empty","type":"state","label":"Пустая","col":1,"row":0},{"id":"filled","type":"state","label":"Не пустая","col":2,"row":0},{"id":"ordered","type":"state","label":"Оформлена","col":3,"row":0}],"flows":[["i","empty"],["empty","filled","добавить товар"],["filled","filled","добавить товар / count++"],["filled","empty","очистить"],["filled","ordered","оформить"]]},"bad_state":{"nodes":[{"id":"i","type":"init","col":0,"row":0},{"id":"a","type":"state","label":"Черновик","col":1,"row":0},{"id":"b","type":"state","label":"Опубликован","col":2,"row":0},{"id":"i2","type":"init","col":0,"row":1},{"id":"c","type":"state","label":"Архив","col":3,"row":1}],"flows":[["i","a"],["a","b","опубликовать"],["i2","c"]]},"sym_init":{"nodes":[{"id":"a","type":"init","col":0,"row":0}],"flows":[]},"sym_final":{"nodes":[{"id":"a","type":"final","col":0,"row":0}],"flows":[]},"sym_state":{"nodes":[{"id":"a","type":"state","label":"Подключено","col":0,"row":0,"actions":["entry / открыть сокет","exit / закрыть сокет"]}],"flows":[]},"sym_trans":{"nodes":[{"id":"a","type":"state","label":"Новый","col":0,"row":0},{"id":"b","type":"state","label":"Оплачен","col":1,"row":0}],"flows":[["a","b","оплата [сумма > 0] / списать"]]},"sym_choice":{"nodes":[{"id":"a","type":"choice","col":0,"row":0}],"flows":[]},"sym_fork":{"nodes":[{"id":"a","type":"fork","col":0,"row":0,"vert":true}],"flows":[]},"sym_history":{"nodes":[{"id":"a","type":"history","col":0,"row":0}],"flows":[]},"sym_comp":{"nodes":[{"id":"c","type":"comp","label":"Работает","c0":0,"c1":1,"r0":0,"r1":1},{"id":"a","type":"state","label":"Ожидание","col":0,"row":1},{"id":"b","type":"state","label":"Печать","col":1,"row":1}],"flows":[["a","b","задание"]]},"sym_self":{"nodes":[{"id":"a","type":"state","label":"Не пустая","col":0,"row":0}],"flows":[["a","a","добавить / count++"]]}};

// Схемы диаграмм активности: lanes — дорожки, nodes — start/end/fend/action/call/dec/merge/fork/join/obj/send/accept/time (col/row — позиция),
// flows — [от, к, подпись, вид]; вид obj — поток объектов (пунктир), down — поворот вниз.
window.ACTS = {"order_act":{"lanes":[{"name":"Клиент","rows":1},{"name":"Магазин","rows":1},{"name":"Склад","rows":1}],"nodes":[{"id":"s","type":"start","col":0,"row":1},{"id":"a1","type":"action","col":1,"row":1,"label":"Проверить заказ"},{"id":"d1","type":"dec","col":2,"row":1,"label":"Товар есть?"},{"id":"a2","type":"action","col":3,"row":2,"label":"Собрать заказ"},{"id":"a3","type":"action","col":3,"row":0,"label":"Уведомить клиента"},{"id":"a4","type":"action","col":4,"row":2,"label":"Отправить заказ"},{"id":"e1","type":"end","col":5,"row":2},{"id":"e2","type":"end","col":4,"row":0}],"flows":[["s","a1"],["a1","d1"],["d1","a2","[да]"],["d1","a3","[нет]"],["a3","e2"],["a2","a4"],["a4","e1"]]},"par_act":{"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"a1","type":"action","col":1,"row":0,"label":"Принять заявку"},{"id":"f","type":"fork","col":2,"row":0.5,"vert":true,"span":2},{"id":"a2","type":"action","col":3,"row":0,"label":"Проверить документы"},{"id":"a3","type":"action","col":3,"row":1,"label":"Проверить платёж"},{"id":"j","type":"join","col":4,"row":0.5,"vert":true,"span":2},{"id":"a4","type":"action","col":5,"row":0.5,"label":"Выдать результат"},{"id":"e","type":"end","col":6,"row":0.5}],"flows":[["s","a1"],["a1","f"],["f","a2"],["f","a3"],["a2","j"],["a3","j"],["j","a4"],["a4","e"]]},"loop_act":{"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"a1","type":"action","col":1,"row":0,"label":"Ввести пароль"},{"id":"d1","type":"dec","col":2,"row":0,"label":"Пароль верный?"},{"id":"a2","type":"action","col":3,"row":0,"label":"Войти в систему"},{"id":"e","type":"end","col":4,"row":0},{"id":"a3","type":"action","col":2,"row":1,"label":"Показать ошибку"}],"flows":[["s","a1"],["a1","d1"],["d1","a2","[да]"],["a2","e"],["d1","a3","[нет]"],["a3","a1"]]},"obj_act":{"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"a1","type":"action","col":1,"row":0,"label":"Создать счёт"},{"id":"o1","type":"obj","col":2,"row":0,"label":"Счёт [создан]"},{"id":"a2","type":"action","col":3,"row":0,"label":"Оплатить счёт"},{"id":"e","type":"end","col":4,"row":0}],"flows":[["s","a1"],["a1","o1",null,"obj"],["o1","a2",null,"obj"],["a2","e"]]},"signals":{"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"a1","type":"action","col":1,"row":0,"label":"Подготовить запрос"},{"id":"snd","type":"send","col":2,"row":0,"label":"Отправить запрос"},{"id":"acc","type":"accept","col":3,"row":0,"label":"Получить ответ"},{"id":"a2","type":"action","col":4,"row":0,"label":"Обработать ответ"},{"id":"e","type":"end","col":5,"row":0}],"flows":[["s","a1"],["a1","snd"],["snd","acc"],["acc","a2"],["a2","e"]]},"time_act":{"nodes":[{"id":"t","type":"time","col":0,"row":0,"label":"Каждый понедельник"},{"id":"a1","type":"action","col":1,"row":0,"label":"Сформировать отчёт"},{"id":"e","type":"end","col":2,"row":0}],"flows":[["t","a1"],["a1","e"]]},"flow_final":{"nodes":[{"id":"s","type":"start","col":0,"row":0.5},{"id":"f","type":"fork","col":1,"row":0.5,"vert":true,"span":2},{"id":"a1","type":"action","col":2,"row":0,"label":"Обработать платёж"},{"id":"a2","type":"action","col":2,"row":1,"label":"Отправить чек"},{"id":"a3","type":"action","col":3,"row":0,"label":"Подтвердить заказ"},{"id":"e","type":"end","col":4,"row":0},{"id":"fe","type":"fend","col":3,"row":1,"label":"Ветка завершена"}],"flows":[["s","f"],["f","a1"],["f","a2"],["a1","a3"],["a3","e"],["a2","fe"]]},"merge_bug":{"nodes":[{"id":"s","type":"start","col":0,"row":0.5},{"id":"a0","type":"action","col":1,"row":0.5,"label":"Принять заявку"},{"id":"d1","type":"dec","col":2,"row":0.5,"label":"Сумма заявки?"},{"id":"a1","type":"action","col":3,"row":0,"label":"Утвердить автоматически"},{"id":"a2","type":"action","col":3,"row":1,"label":"Согласовать у руководителя"},{"id":"j","type":"join","col":4,"row":0.5,"vert":true,"span":2},{"id":"a3","type":"action","col":5,"row":0.5,"label":"Оплатить"},{"id":"e","type":"end","col":6,"row":0.5}],"flows":[["s","a0"],["a0","d1"],["d1","a1","[малая]"],["d1","a2","[крупная]"],["a1","j"],["a2","j"],["j","a3"],["a3","e"]]},"merge_ok":{"nodes":[{"id":"s","type":"start","col":0,"row":0.5},{"id":"a0","type":"action","col":1,"row":0.5,"label":"Принять заявку"},{"id":"d1","type":"dec","col":2,"row":0.5,"label":"Сумма заявки?"},{"id":"a1","type":"action","col":3,"row":0,"label":"Утвердить автоматически"},{"id":"a2","type":"action","col":3,"row":1,"label":"Согласовать у руководителя"},{"id":"m","type":"merge","col":4,"row":0.5},{"id":"a3","type":"action","col":5,"row":0.5,"label":"Оплатить"},{"id":"e","type":"end","col":6,"row":0.5}],"flows":[["s","a0"],["a0","d1"],["d1","a1","[малая]"],["d1","a2","[крупная]"],["a1","m"],["a2","m"],["m","a3"],["a3","e"]]},"support_act":{"lanes":[{"name":"Клиент","rows":1},{"name":"Оператор","rows":1},{"name":"Руководитель","rows":1}],"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"a1","type":"action","col":1,"row":0,"label":"Создать обращение"},{"id":"a2","type":"action","col":1,"row":1,"label":"Принять обращение"},{"id":"d1","type":"dec","col":2,"row":1,"label":"Решено?"},{"id":"a3","type":"action","col":3,"row":1,"label":"Сообщить решение"},{"id":"e","type":"end","col":4,"row":1},{"id":"a4","type":"action","col":2,"row":2,"label":"Эскалировать"},{"id":"a5","type":"action","col":3,"row":2,"label":"Принять решение"}],"flows":[["s","a1"],["a1","a2"],["a2","d1"],["d1","a3","[да]"],["d1","a4","[нет]"],["a4","a5"],["a5","a3"],["a3","e"]]},"call_act":{"nodes":[{"id":"s","type":"start","col":0,"row":0},{"id":"c1","type":"call","col":1,"row":0,"label":"Оплатить заказ"},{"id":"a1","type":"action","col":2,"row":0,"label":"Отправить заказ"},{"id":"e","type":"end","col":3,"row":0}],"flows":[["s","c1"],["c1","a1"],["a1","e"]]},"sym_start":{"nodes":[{"id":"a","type":"start","col":0,"row":0}],"flows":[]},"sym_end":{"nodes":[{"id":"a","type":"end","col":0,"row":0}],"flows":[]},"sym_fend":{"nodes":[{"id":"a","type":"fend","col":0,"row":0}],"flows":[]},"sym_action":{"nodes":[{"id":"a","type":"action","col":0,"row":0,"label":"Проверить заказ"}],"flows":[]},"sym_call":{"nodes":[{"id":"a","type":"call","col":0,"row":0,"label":"Оплатить заказ"}],"flows":[]},"sym_dec":{"nodes":[{"id":"d","type":"dec","col":0,"row":0.5,"label":"Оплачено?"},{"id":"a","type":"action","col":1,"row":0,"label":"Отправить заказ"},{"id":"b","type":"action","col":1,"row":1,"label":"Напомнить об оплате"}],"flows":[["d","a","[да]"],["d","b","[нет]"]]},"sym_merge":{"nodes":[{"id":"a","type":"action","col":0,"row":0,"label":"Оплата картой"},{"id":"b","type":"action","col":0,"row":1,"label":"Оплата наличными"},{"id":"m","type":"merge","col":1,"row":0.5},{"id":"c","type":"action","col":2,"row":0.5,"label":"Выдать чек"}],"flows":[["a","m"],["b","m"],["m","c"]]},"sym_fork":{"nodes":[{"id":"x","type":"action","col":0,"row":0.5,"label":"Принять заказ"},{"id":"f","type":"fork","col":1,"row":0.5,"vert":true,"span":2},{"id":"a","type":"action","col":2,"row":0,"label":"Собрать заказ"},{"id":"b","type":"action","col":2,"row":1,"label":"Выставить счёт"}],"flows":[["x","f"],["f","a"],["f","b"]]},"sym_join":{"nodes":[{"id":"a","type":"action","col":0,"row":0,"label":"Собрать заказ"},{"id":"b","type":"action","col":0,"row":1,"label":"Выставить счёт"},{"id":"j","type":"join","col":1,"row":0.5,"vert":true,"span":2},{"id":"c","type":"action","col":2,"row":0.5,"label":"Отправить заказ"}],"flows":[["a","j"],["b","j"],["j","c"]]},"sym_obj":{"nodes":[{"id":"a","type":"obj","col":0,"row":0,"label":"Заказ [оплачен]"}],"flows":[]},"sym_send":{"nodes":[{"id":"a","type":"send","col":0,"row":0,"label":"Отправить запрос"}],"flows":[]},"sym_accept":{"nodes":[{"id":"a","type":"accept","col":0,"row":0,"label":"Получить ответ"}],"flows":[]},"sym_time":{"nodes":[{"id":"a","type":"time","col":0,"row":0,"label":"Каждый понедельник"}],"flows":[]},"sym_lane":{"lanes":[{"name":"Клиент","rows":1},{"name":"Магазин","rows":1}],"nodes":[{"id":"a","type":"action","col":0,"row":0,"label":"Оформить заказ"},{"id":"b","type":"action","col":1,"row":1,"label":"Подтвердить заказ"}],"flows":[["a","b"]]}};
