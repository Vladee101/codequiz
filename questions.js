// Банк вопросов. answer — индекс верного варианта в options (0..2); порядок вариантов перемешивается при показе.
// topic: "SQL" | "API" | "ERD"; lang: "sql" | "json" | "yaml" | "http" | "text"
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
