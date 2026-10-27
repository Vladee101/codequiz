// Направление SQL: вопросы по уровням.
// Файл подгружается при выборе направления (см. window.TRACK_FILES в questions.js).

window.QUESTIONS.basic.push(
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
    }
);

window.QUESTIONS.medium.push(
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
    }
);

window.QUESTIONS.advanced.push(
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
    }
);
