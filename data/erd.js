// Направление ERD: вопросы по уровням и схемы диаграмм.
// Файл подгружается при выборе направления (см. window.TRACK_FILES в questions.js).

// Схемы для ER-диаграмм: tables (col/row — позиция в сетке), rels — [родитель, потомок, метка у родителя, метка у потомка].
window.ERDS = {
  "shop": {"tables":[{"name":"users","col":0,"row":0,"cols":["id PK","email UQ","name"]},{"name":"orders","col":1,"row":0,"cols":["id PK","user_id FK","status","total"]},{"name":"order_items","col":2,"row":0,"cols":["id PK","order_id FK","product_id FK","qty"]},{"name":"categories","col":1,"row":1,"cols":["id PK","name"]},{"name":"products","col":2,"row":1,"cols":["id PK","category_id FK","name","price"]}],"rels":[["users","orders","1","N"],["orders","order_items","1","N"],["products","order_items","1","N"],["categories","products","1","N"]]},
  "school": {"tables":[{"name":"groups","col":0,"row":0,"cols":["id PK","title"]},{"name":"students","col":1,"row":0,"cols":["id PK","name","group_id FK"]},{"name":"enrollments","col":2,"row":0,"cols":["student_id PK,FK","course_id PK,FK","grade"]},{"name":"teachers","col":1,"row":1,"cols":["id PK","name"]},{"name":"courses","col":2,"row":1,"cols":["id PK","title","teacher_id FK"]}],"rels":[["groups","students","1","N"],["students","enrollments","1","N"],["courses","enrollments","1","N"],["teachers","courses","1","N"]]},
  "library": {"tables":[{"name":"authors","col":0,"row":0,"cols":["id PK","name"]},{"name":"book_authors","col":1,"row":0,"cols":["book_id PK,FK","author_id PK,FK"]},{"name":"books","col":2,"row":0,"cols":["id PK","title","isbn UQ"]},{"name":"readers","col":0,"row":1,"cols":["id PK","name"]},{"name":"loans","col":1,"row":1,"cols":["id PK","book_id FK","reader_id FK","issued_at","returned_at"]}],"rels":[["authors","book_authors","1","N"],["books","book_authors","1","N"],["readers","loans","1","N"],["books","loans","1","N"]]},
  "hr": {"tables":[{"name":"departments","col":0,"row":0,"cols":["id PK","name"]},{"name":"employees","col":1,"row":0,"cols":["id PK","name","dept_id FK","manager_id FK","salary"]}],"rels":[["departments","employees","1","N"]]},
  "booking": {"tables":[{"name":"hotels","col":0,"row":0,"cols":["id PK","name"]},{"name":"rooms","col":1,"row":0,"cols":["id PK","hotel_id FK","number"]},{"name":"bookings","col":2,"row":0,"cols":["id PK","room_id FK","guest_id FK","check_in","check_out"]},{"name":"guests","col":2,"row":1,"cols":["id PK","name","email UQ"]}],"rels":[["hotels","rooms","1","N"],["rooms","bookings","1","N"],["guests","bookings","1","N"]]},
  "blog": {"tables":[{"name":"users","col":0,"row":0,"cols":["id PK","nickname"]},{"name":"posts","col":1,"row":0,"cols":["id PK","author_id FK","title"]},{"name":"post_tags","col":2,"row":0,"cols":["post_id PK,FK","tag_id PK,FK"]},{"name":"comments","col":0,"row":1,"cols":["id PK","post_id FK","user_id FK","text"]},{"name":"tags","col":2,"row":1,"cols":["id PK","name UQ"]}],"rels":[["users","posts","1","N"],["posts","post_tags","1","N"],["tags","post_tags","1","N"],["posts","comments","1","N"],["users","comments","1","N"]]},
  "clinic": {"tables":[{"name":"patients","col":0,"row":0,"cols":["id PK","name","birth_date"]},{"name":"appointments","col":1,"row":0,"cols":["id PK","patient_id FK","doctor_id FK","starts_at","status"]},{"name":"doctors","col":2,"row":0,"cols":["id PK","name","specialty_id FK"]},{"name":"prescriptions","col":1,"row":1,"cols":["id PK","appointment_id FK","drug","dose"]},{"name":"specialties","col":2,"row":1,"cols":["id PK","title"]}],"rels":[["patients","appointments","1","N"],["doctors","appointments","1","N"],["appointments","prescriptions","1","N"],["specialties","doctors","1","N"]]},
  "bank": {"tables":[{"name":"clients","col":0,"row":0,"cols":["id PK","name","passport UQ"]},{"name":"accounts","col":1,"row":0,"cols":["id PK","client_id FK","currency","balance"]},{"name":"cards","col":2,"row":0,"cols":["id PK","account_id FK","pan_hash UQ","expires"]},{"name":"transactions","col":1,"row":1,"cols":["id PK","account_id FK","counterparty_id FK","amount","created_at"]}],"rels":[["clients","accounts","1","N"],["accounts","cards","1","N"],["accounts","transactions","1","N"]]},
  "saas": {"tables":[{"name":"tenants","col":0,"row":0,"cols":["id PK","name"]},{"name":"subscriptions","col":1,"row":0,"cols":["id PK","tenant_id FK","plan_id FK","started_at","ended_at"]},{"name":"plans","col":2,"row":0,"cols":["id PK","name","price"]},{"name":"users","col":0,"row":1,"cols":["id PK","tenant_id FK","email"]},{"name":"invoices","col":1,"row":1,"cols":["id PK","subscription_id FK","amount","paid_at"]}],"rels":[["tenants","subscriptions","1","N"],["plans","subscriptions","1","N"],["tenants","users","1","N"],["subscriptions","invoices","1","N"]]},
  "inventory": {"tables":[{"name":"warehouses","col":0,"row":0,"cols":["id PK","city"]},{"name":"stock","col":1,"row":0,"cols":["warehouse_id PK,FK","product_id PK,FK","qty"]},{"name":"products","col":2,"row":0,"cols":["id PK","sku UQ","name","supplier_id FK"]},{"name":"movements","col":1,"row":1,"cols":["id PK","product_id FK","from_wh FK","to_wh FK","qty","moved_at"]},{"name":"suppliers","col":2,"row":1,"cols":["id PK","name"]}],"rels":[["warehouses","stock","1","N"],["products","stock","1","N"],["suppliers","products","1","N"],["products","movements","1","N"]]},
  "delivery": {"tables":[{"name":"couriers","col":0,"row":0,"cols":["id PK","name","vehicle"]},{"name":"deliveries","col":1,"row":0,"cols":["id PK","order_id FK","courier_id FK","status","delivered_at"]},{"name":"orders","col":2,"row":0,"cols":["id PK","customer_id FK","address_id FK","total"]},{"name":"addresses","col":1,"row":1,"cols":["id PK","customer_id FK","city","street"]},{"name":"customers","col":2,"row":1,"cols":["id PK","name","phone"]}],"rels":[["couriers","deliveries","1","N"],["orders","deliveries","1","N"],["customers","orders","1","N"],["customers","addresses","1","N"],["addresses","orders","1","N"]]},
  "social": {"tables":[{"name":"users","col":0,"row":0,"cols":["id PK","handle UQ"]},{"name":"posts","col":1,"row":0,"cols":["id PK","user_id FK","text","created_at"]},{"name":"follows","col":0,"row":1,"cols":["follower_id PK,FK","followee_id PK,FK"]},{"name":"likes","col":1,"row":1,"cols":["user_id PK,FK","post_id PK,FK"]}],"rels":[["users","posts","1","N"],["users","follows","1","N"],["users","likes","1","N"],["posts","likes","1","N"]]}
};

window.QUESTIONS.basic.push(
    {
      topic: "ERD",
      erd: "shop",
      q: "Что означает связь «1 — N» между users и orders?",
      options: ["У одного пользователя может быть много заказов, а у заказа один пользователь", "У одного заказа может быть много пользователей", "Один пользователь может сделать ровно один заказ"],
      answer: 0,
      explain: "Метка 1 стоит у «родительской» таблицы, N — у «дочерней». Одна запись users связана со многими записями orders, а каждая запись orders — с одной записью users."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "В какой таблице и в какой колонке хранится внешний ключ связи users — orders?",
      options: ["В users.order_id", "В orders.user_id", "В отдельной таблице связей"],
      answer: 1,
      explain: "Внешний ключ всегда хранится на стороне N (дочерней таблицы) и ссылается на первичный ключ родителя. Здесь это orders.user_id → users.id."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Как получить товары конкретного заказа, исходя из диаграммы?",
      options: ["Соединить orders напрямую с products", "Пройти orders → order_items → products", "Соединить users с products"],
      answer: 1,
      explain: "Напрямую orders и products не связаны: связь «многие ко многим» реализована через order_items. Нужны два соединения: orders с order_items и order_items с products."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Какое поле в orders является первичным ключом?",
      options: ["user_id", "id", "status"],
      answer: 1,
      explain: "Пометка PK означает первичный ключ: уникальный идентификатор строки, не допускающий NULL. user_id — внешний ключ (FK)."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Что гарантирует внешний ключ orders.user_id?",
      options: ["Что у пользователя будет не больше одного заказа", "Что заказ нельзя привязать к несуществующему пользователю", "Что значения user_id всегда отсортированы"],
      answer: 1,
      explain: "Внешний ключ обеспечивает ссылочную целостность: каждое значение user_id должно существовать в users.id (или быть NULL, если колонка допускает NULL)."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Как на диаграмме реализована связь «студент ↔ курс»?",
      options: ["Колонкой course_id в students", "Таблицей связи enrollments", "Колонкой student_id в courses"],
      answer: 1,
      explain: "Студент посещает много курсов, а на курсе много студентов, то есть связь M:N. В реляционной модели её раскладывают на две связи 1:N через промежуточную таблицу."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Сколько студентов может быть в одной группе?",
      options: ["Ровно один", "Много: связь groups — students равна 1:N", "Ни одного: группа хранится отдельно"],
      answer: 1,
      explain: "Группа связана со многими студентами, а студент входит ровно в одну группу (в students есть group_id)."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Что означает составной первичный ключ (student_id, course_id) в enrollments?",
      options: ["Студент может быть записан на конкретный курс только один раз", "Студент может учиться только на одном курсе", "Оценка должна быть уникальной"],
      answer: 0,
      explain: "Пара значений должна быть уникальной, но каждая из колонок по отдельности может повторяться. Так один студент записан на разные курсы, а на один курс — один раз."
    },
    {
      topic: "ERD",
      erd: "library",
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
      topic: "ERD",
      erd: "clinic",
      q: "Сколько приёмов может быть у одного пациента?",
      options: ["Ровно один", "Много: связь patients — appointments это 1:N", "Ни одного: приёмы привязаны только к врачам"],
      answer: 1,
      explain: "У приёма один пациент (patient_id), а пациент может приходить много раз. Метка N стоит на стороне appointments."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Как на диаграмме связаны пациенты и врачи?",
      options: ["Напрямую внешним ключом patients.doctor_id", "Через таблицу appointments: это связь M:N, разложенная на две 1:N", "Никак"],
      answer: 1,
      explain: "Пациент бывает у многих врачей, а у врача много пациентов. Промежуточная таблица appointments хранит каждую встречу и её атрибуты."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Сколько внешних ключей содержит таблица appointments?",
      options: ["Один", "Два: patient_id и doctor_id", "Три"],
      answer: 1,
      explain: "Каждая пометка FK задаёт связь с родительской таблицей. Здесь приём ссылается и на пациента, и на врача."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Как получить рецепты пациента?",
      options: ["Прямое соединение patients с prescriptions", "Путь patients → appointments → prescriptions", "Путь doctors → specialties → prescriptions"],
      answer: 1,
      explain: "Рецепт привязан к приёму, а не к пациенту напрямую. Поэтому нужны два соединения по цепочке внешних ключей."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Может ли у одного клиента быть несколько счетов?",
      options: ["Нет: у клиента ровно один счёт", "Да: связь clients — accounts это 1:N", "Только если счета в разных банках"],
      answer: 1,
      explain: "Внешний ключ client_id находится в accounts, поэтому клиенту может соответствовать много счетов, а счёту — один клиент."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "К какой сущности привязана банковская карта?",
      options: ["К клиенту напрямую", "К счёту (account_id)", "К транзакции"],
      answer: 1,
      explain: "Внешний ключ cards.account_id говорит, что карта выпущена по счёту. Клиента можно найти через счёт."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Что означает UQ у passport?",
      options: ["Паспорт может повторяться у разных клиентов", "Один паспорт — один клиент: значения уникальны", "Колонка является первичным ключом"],
      answer: 1,
      explain: "UQ означает ограничение уникальности. Первичным ключом остаётся id, а passport защищён от дублей."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Что хранится в таблице transactions?",
      options: ["Текущий баланс клиента", "История операций по счёту: каждая строка — одна операция", "Данные карты"],
      answer: 1,
      explain: "Таблица на стороне N фиксирует события во времени. Баланс обычно хранят в accounts либо вычисляют по операциям."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Сколько организаций (tenants) может быть у одного пользователя по этой диаграмме?",
      options: ["Много", "Одна: users.tenant_id указывает на одну организацию", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ tenant_id в users означает, что пользователь принадлежит одной организации, а организация имеет много пользователей."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Сколько подписок может быть на один тарифный план?",
      options: ["Одна", "Много: plans — subscriptions это 1:N", "Ни одной"],
      answer: 1,
      explain: "Тариф — справочник, на который ссылаются подписки разных организаций."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Как узнать тариф организации?",
      options: ["tenants → plans напрямую", "tenants → subscriptions → plans", "users → invoices → plans"],
      answer: 1,
      explain: "Прямой связи между tenants и plans нет: тариф подключается через подписку, в которой есть и период действия."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Что обычно означает NULL в subscriptions.ended_at?",
      options: ["Ошибка в данных", "Подписка ещё действует: даты окончания нет", "Подписка бесплатна"],
      answer: 1,
      explain: "Пустая дата окончания часто используется как признак открытого интервала. Это соглашение нужно зафиксировать в описании модели."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Что означает составной ключ (warehouse_id, product_id) в stock?",
      options: ["Склад может хранить только один товар", "Для каждой пары «склад — товар» существует не более одной строки остатка", "Товар может лежать только на одном складе"],
      answer: 1,
      explain: "Составной PK требует уникальности пары значений, но каждое из значений по отдельности может повторяться."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Где хранится остаток товара на конкретном складе?",
      options: ["products.qty", "stock.qty", "warehouses.qty"],
      answer: 1,
      explain: "Количество зависит от пары «склад — товар», поэтому это атрибут связи M:N и хранится в stock."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Сколько поставщиков у одного товара по этой диаграмме?",
      options: ["Много", "Один: products.supplier_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ на стороне products фиксирует одного поставщика на товар. Если нужны несколько, потребуется таблица связи."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Зачем в products колонка sku с пометкой UQ?",
      options: ["Это внешний ключ", "Артикул должен быть уникальным и по нему можно однозначно найти товар", "Это счётчик количества"],
      answer: 1,
      explain: "Бизнес-идентификатор (артикул) защищают уникальным ограничением. Технический id остаётся первичным ключом."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Сколько доставок может выполнить один курьер?",
      options: ["Одну", "Много: couriers — deliveries это 1:N", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ courier_id находится в deliveries, поэтому у курьера много доставок, а у доставки один курьер."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Как узнать, куда доставить заказ?",
      options: ["Через orders.address_id → addresses", "Через couriers.address_id", "Адрес хранится в deliveries.city"],
      answer: 0,
      explain: "Заказ ссылается на адрес через address_id. Адреса, в свою очередь, принадлежат клиенту."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Сколько адресов может быть у одного клиента?",
      options: ["Один", "Много: customers — addresses это 1:N", "Адреса не связаны с клиентами"],
      answer: 1,
      explain: "Внешний ключ customer_id находится в addresses, значит клиент может иметь несколько адресов доставки."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Что означает составной ключ (user_id, post_id) в likes?",
      options: ["Один пользователь может лайкнуть пост только один раз", "Пост может иметь только один лайк", "Пользователь может лайкнуть только один пост"],
      answer: 0,
      explain: "Уникальная пара «пользователь — пост» защищает от повторных лайков, при этом пользователь лайкает много постов, а пост получает много лайков."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Какую связь реализует таблица follows?",
      options: ["1:1 между пользователем и постом", "M:N «пользователь — пользователь»: подписки на других пользователей", "Связь поста с тегами"],
      answer: 1,
      explain: "В follows обе колонки ссылаются на users: follower_id (кто подписан) и followee_id (на кого). Это самосвязь типа M:N."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Как посчитать число лайков поста?",
      options: ["Подсчитать строки likes с нужным post_id", "Прочитать users.likes", "Подсчитать follows"],
      answer: 0,
      explain: "Каждая строка likes — один лайк. Агрегат COUNT(*) по фильтру post_id даёт результат."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Как узнать категорию товара из конкретного заказа?",
      options: ["orders → categories", "order_items → products → categories", "users → categories"],
      answer: 1,
      explain: "В позиции заказа хранится product_id, а товар ссылается на категорию. Поэтому нужны два соединения по цепочке."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Что хранит колонка qty в order_items?",
      options: ["Количество товара на складе", "Количество единиц товара в этой позиции заказа", "Количество заказов пользователя"],
      answer: 1,
      explain: "order_items — строка заказа. Qty описывает, сколько единиц выбранного товара включено в заказ."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Сколько позиций может содержать один заказ?",
      options: ["Ровно одну", "Много: связь orders — order_items это 1:N", "Ни одной"],
      answer: 1,
      explain: "Внешний ключ order_id находится в order_items. Один заказ — много позиций, а позиция принадлежит одному заказу."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Сколько преподавателей у одного курса по этой диаграмме?",
      options: ["Много", "Один: courses.teacher_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ на стороне courses связывает курс с одним преподавателем. Один преподаватель может вести много курсов."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Как узнать, в каких группах учатся студенты курса?",
      options: ["courses → groups", "enrollments → students → groups", "teachers → groups"],
      answer: 1,
      explain: "От курса переходим к записям на курс, затем к студентам и их группам."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Что определяет, обязательна ли связь студента с группой?",
      options: ["Название таблицы", "Допускает ли колонка group_id значение NULL", "Количество колонок в таблице"],
      answer: 1,
      explain: "Если внешний ключ NOT NULL, связь обязательна. Если допускает NULL, студент может быть без группы (необязательная связь)."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Что фиксирует таблица loans?",
      options: ["Список авторов", "Факт выдачи книги читателю в конкретный момент", "Перечень жанров"],
      answer: 1,
      explain: "loans — событие, связывающее книгу и читателя во времени. У него есть даты выдачи и возврата."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Что означает NULL в loans.returned_at?",
      options: ["Данные потеряны", "Книга ещё не возвращена", "Книга утеряна навсегда"],
      answer: 1,
      explain: "Отсутствие даты возврата обычно означает, что выдача ещё продолжается. Этим пользуются для поиска книг «на руках»."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Сколько раз одну и ту же книгу можно выдавать разным читателям?",
      options: ["Один раз за всё время", "Много раз: books — loans это 1:N", "Только пока она новая"],
      answer: 1,
      explain: "Выдачи — отдельные строки, и у одной книги их может быть сколько угодно."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Сколько отделов может быть у сотрудника по этой диаграмме?",
      options: ["Много", "Один: employees.dept_id", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ dept_id в employees задаёт принадлежность к одному отделу. В отделе при этом много сотрудников."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Какая колонка хранит ссылку на руководителя сотрудника?",
      options: ["dept_id", "manager_id", "salary"],
      answer: 1,
      explain: "manager_id — внешний ключ на id той же таблицы employees. Он выражает отношение «подчинённый — руководитель»."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Что обозначает FK у dept_id?",
      options: ["Колонка ссылается на departments.id и принимает только существующие значения", "Колонка уникальна", "Колонка хранит дату"],
      answer: 0,
      explain: "FK — внешний ключ. Он защищает от ссылок на несуществующие отделы."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Сколько отелей у одного номера?",
      options: ["Много", "Один: rooms.hotel_id", "Номер не принадлежит отелю"],
      answer: 1,
      explain: "У номера один внешний ключ на отель. В отеле при этом много номеров."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Может ли один гость бронировать несколько раз?",
      options: ["Нет", "Да: guests — bookings это 1:N", "Только в разных отелях"],
      answer: 1,
      explain: "Бронирования — отдельные строки со ссылкой на гостя, и повторных броней у гостя может быть сколько угодно."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Что представляют check_in и check_out в bookings?",
      options: ["Атрибуты самой брони: даты заезда и выезда", "Внешние ключи", "Атрибуты отеля"],
      answer: 0,
      explain: "Даты относятся к факту бронирования номера гостем, поэтому хранятся в таблице связи."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Как определить автора статьи?",
      options: ["Через posts.author_id → users", "Через comments.user_id", "Через tags.name"],
      answer: 0,
      explain: "Автор — пользователь, на которого ссылается внешний ключ author_id таблицы posts."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Сколько комментариев может быть у одной статьи?",
      options: ["Один", "Много: posts — comments это 1:N", "Ни одного"],
      answer: 1,
      explain: "Внешний ключ post_id в comments связывает комментарии со статьёй: у статьи много комментариев, а у комментария одна статья."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Зачем нужна таблица post_tags?",
      options: ["Чтобы хранить текст статьи", "Чтобы реализовать связь M:N между статьями и тегами", "Чтобы хранить комментарии"],
      answer: 1,
      explain: "У статьи много тегов и у тега много статей. В реляционной модели такая связь раскладывается через промежуточную таблицу."
    }
);

window.QUESTIONS.medium.push(
    {
      topic: "ERD",
      erd: "library",
      q: "Зачем нужна таблица book_authors?",
      options: ["Чтобы хранить биографии авторов", "Чтобы реализовать связь M:N: у книги может быть несколько авторов, а у автора несколько книг", "Чтобы ускорить поиск по названию книги"],
      answer: 1,
      explain: "Прямая связь M:N в реляционной модели невозможна, поэтому добавляют таблицу связи с двумя внешними ключами. Составной PK не даёт записать одну и ту же пару дважды."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "library",
      q: "Как найти читателей, которые ни разу не брали книги?",
      code: `-- readers (id) 1 — N loans (reader_id)`,
      options: ["INNER JOIN readers и loans", "LEFT JOIN readers → loans с условием loans.id IS NULL", "SELECT FROM loans GROUP BY reader_id"],
      answer: 1,
      explain: "INNER JOIN оставит только читателей с выдачами. LEFT JOIN сохраняет всех, а фильтр IS NULL по правой таблице оставляет тех, для кого пары не нашлось."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Что означает колонка manager_id в employees, если она ссылается на employees.id?",
      options: ["Ошибка проектирования: таблица не может ссылаться на саму себя", "Рекурсивная связь: руководитель — тоже сотрудник той же таблицы", "Связь с таблицей departments"],
      answer: 1,
      explain: "Самоссылка — стандартный способ хранить иерархию. Чтобы получить имя руководителя, таблицу соединяют сама с собой (self join) под разными псевдонимами."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Как узнать название отеля, в котором сделано бронирование?",
      options: ["bookings → hotels одним соединением", "bookings → rooms → hotels двумя соединениями", "guests → hotels"],
      answer: 1,
      explain: "В bookings нет прямой ссылки на отель: бронь привязана к номеру, а номер — к отелю. Путь по внешним ключам проходит через rooms."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Почему плохая идея добавить hotel_id в bookings, если он уже есть в rooms?",
      options: ["Это ускоряет запросы, поэтому идея хорошая", "Дублирование: hotel_id определяется через room_id, возможна рассинхронизация (нарушение 3НФ)", "Внешний ключ нельзя ссылаться дважды"],
      answer: 1,
      explain: "Если hotel_id однозначно вычисляется через room_id, хранить его второй раз значит создавать риск противоречий. Денормализацию допускают осознанно, с контролем согласованности."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Где хранить цену товара на момент покупки?",
      options: ["Только в products.price: она всегда актуальна", "Копией в order_items: цена в каталоге меняется, а в старых заказах должна остаться прежней", "В users"],
      answer: 1,
      explain: "Если читать цену из products, изменение прайса переписывает историю заказов. Поэтому в строке заказа фиксируют цену и, при необходимости, скидку и налог на момент покупки."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Что случится при попытке удалить пользователя, у которого есть заказы (FK без каскада)?",
      options: ["Удалится пользователь, а заказы останутся без владельца", "СУБД отклонит удаление: нарушается внешний ключ orders.user_id", "Удалятся и пользователь, и заказы автоматически"],
      answer: 1,
      explain: "По умолчанию действует поведение NO ACTION/RESTRICT: пока есть ссылающиеся строки, родителя удалить нельзя. Другие варианты (CASCADE, SET NULL) задают явно."
    },
    {
      topic: "ERD",
      erd: "blog",
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
      topic: "ERD",
      erd: "school",
      q: "К какой сущности относится оценка grade, исходя из диаграммы?",
      options: ["К студенту: это его свойство", "К курсу: это свойство курса", "К связи «студент — курс»: оценка зависит от обеих сущностей, поэтому лежит в enrollments"],
      answer: 2,
      explain: "Оценка студента по конкретному курсу — атрибут связи M:N. Если хранить её в students или courses, потеряется привязка к паре."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Один врач не может принимать двух пациентов в одно время. Как выразить это в модели?",
      options: ["Это невозможно проверить в базе", "Ограничением уникальности (doctor_id, starts_at) для слотов или проверкой пересечения интервалов", "Хранить врача в таблице patients"],
      answer: 1,
      explain: "Правило бизнеса можно защитить на уровне БД: уникальным индексом по слоту или exclusion-ограничением по интервалу. Проверка только в приложении уязвима для гонок."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "clinic",
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
      topic: "ERD",
      erd: "clinic",
      q: "Зачем специальности вынесены в отдельную таблицу specialties?",
      options: ["Чтобы замедлить запросы", "Справочник исключает опечатки и дубли названий, а изменение названия делается в одном месте", "Это требование стандарта SQL"],
      answer: 1,
      explain: "Нормализация избавляет от повторов текста в doctors. Ссылка по id даёт согласованность и позволяет менять название централизованно."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Как лучше хранить статус приёма (запланирован, состоялся, отменён)?",
      options: ["Произвольным текстом без ограничений", "Справочником или перечислением с CHECK-ограничением допустимых значений", "Числом без описания"],
      answer: 1,
      explain: "Ограничение допустимых значений защищает от опечаток («cancelled» и «canceled»). Набор статусов нужно описать в модели."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Баланс счёта хранить в accounts.balance или вычислять по transactions?",
      options: ["Только вычислять: хранить нельзя", "Оба подхода применяют: хранимый баланс ускоряет чтение, но требует атомарного обновления вместе с записью операции", "Только хранить: операции не нужны"],
      answer: 1,
      explain: "Хранимый остаток быстро читается, но может разойтись с журналом. Поэтому изменение баланса и вставку операции делают в одной транзакции."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Как корректно записать перевод между двумя счетами?",
      options: ["Два независимых запроса без транзакции", "Две записи в transactions (списание и зачисление) и обновление балансов в одной транзакции", "Одна запись без указания второго счёта"],
      answer: 1,
      explain: "Перевод затрагивает два счёта, и частичное выполнение нарушает деньги. Атомарность транзакции обеспечивает либо оба изменения, либо ни одного."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Почему currency хранится в accounts, а не в clients?",
      options: ["Это случайность", "У клиента может быть несколько счетов в разных валютах, валюта — свойство счёта", "Валюта вообще не нужна"],
      answer: 1,
      explain: "Валюта определяет, в каких единицах хранится баланс счёта. У клиента может быть и рублёвый, и долларовый счёт."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Почему в cards хранят pan_hash, а не полный номер карты?",
      options: ["Хэш удобнее читать", "Хранение полного номера повышает риск утечки и требует соблюдения PCI DSS; хэш или токен позволяет искать без раскрытия номера", "Номер карты слишком короткий"],
      answer: 1,
      explain: "Платёжные реквизиты стараются не хранить в открытом виде. Токенизация и хэширование снижают последствия утечки."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Как гарантировать, что пользователь одной организации не увидит данные другой?",
      options: ["Достаточно скрыть кнопки в интерфейсе", "Фильтровать по tenant_id на каждом запросе на уровне данных (и защитить правами/политиками БД)", "Хранить всех в одной общей таблице без идентификатора"],
      answer: 1,
      explain: "Изоляция должна обеспечиваться на сервере, а не в UI. Забытый фильтр по tenant_id — классическая утечка данных между клиентами."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Почему subscriptions хранит started_at и ended_at, а не просто текущий план в tenants?",
      options: ["Для красоты", "Чтобы сохранялась история смены тарифов и можно было узнать, какой план действовал в любой момент", "Это нужно только для users"],
      answer: 1,
      explain: "Хранение интервалов даёт временную историю: счета, отчёты и споры опираются на тариф, действовавший в тот период."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Почему счёт (invoices) привязан к subscription_id, а не к tenant_id?",
      options: ["Это ошибка проектирования", "Счёт выставляется за конкретную подписку и период, а организацию можно найти через подписку", "Счёт не нужен организации"],
      answer: 1,
      explain: "Привязка к подписке сохраняет контекст: какой тариф и какой период оплачены. Клиента при необходимости находят через связь."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "saas",
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
      topic: "ERD",
      erd: "inventory",
      q: "Остаток хранится в stock.qty, а движения — в movements. Что важно учитывать?",
      options: ["Ничего: данные не связаны", "Остаток и журнал должны меняться вместе в одной транзакции, иначе они разойдутся", "Достаточно хранить только movements без проверок"],
      answer: 1,
      explain: "Если один и тот же факт записан в двух местах, нужно гарантировать согласованность. Атомарная транзакция или пересчёт по журналу решают проблему."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Почему связь «склады — товары» реализована таблицей stock, а не колонкой в products?",
      options: ["Товар может лежать на многих складах, а склад — хранить много товаров, поэтому нужна таблица связи с количеством", "Так быстрее", "Это нужно только для поставщиков"],
      answer: 0,
      explain: "Связь M:N с собственным атрибутом (qty) требует отдельной таблицы с составным ключом."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "В movements две колонки from_wh и to_wh ссылаются на warehouses. Что это значит?",
      options: ["Две отдельные связи с одной и той же таблицей: склад-источник и склад-получатель", "Ошибка: на таблицу нельзя ссылаться дважды", "Это одна связь M:N"],
      answer: 0,
      explain: "Таблица может иметь несколько внешних ключей на одну родительскую таблицу, у каждого своя роль. Для запросов нужны два соединения с разными псевдонимами."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "inventory",
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
      topic: "ERD",
      erd: "delivery",
      q: "Заказ не доставили с первой попытки. Как это отражается в модели?",
      options: ["Нельзя: у заказа только одна доставка", "Связь orders — deliveries 1:N позволяет иметь несколько попыток доставки одного заказа", "Нужно удалить заказ"],
      answer: 1,
      explain: "Если доставки — отдельные строки, то повторная попытка — это ещё одна строка с тем же order_id."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Клиент изменил свой адрес, и теперь старые заказы показывают новый. Что упущено?",
      options: ["Ничего: это правильное поведение", "Заказ должен хранить снимок адреса на момент оформления или ссылаться на неизменяемую запись адреса", "Нужно удалить адреса"],
      answer: 1,
      explain: "История заказов не должна меняться из-за правок справочных данных. Адрес фиксируют копией или делают записи адресов неизменяемыми."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Как показать всех курьеров, включая тех, у кого нет доставок?",
      options: ["couriers LEFT JOIN deliveries", "couriers INNER JOIN deliveries", "deliveries LEFT JOIN couriers"],
      answer: 0,
      explain: "Нужно сохранить все строки couriers, поэтому они стоят слева в LEFT JOIN. INNER JOIN оставил бы только курьеров с доставками."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "social",
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
      topic: "ERD",
      erd: "social",
      q: "В posts добавили колонку likes_count. В чём компромисс?",
      options: ["Нет компромисса: хранить счётчик всегда лучше", "Чтение ускоряется, но нужно поддерживать счётчик синхронно с таблицей likes, иначе значения разойдутся", "Запросы станут невозможными"],
      answer: 1,
      explain: "Денормализация экономит агрегацию, но создаёт два источника правды. Обновление счётчика и вставку лайка делают атомарно или пересчитывают."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "social",
      q: "Как запретить подписку пользователя на самого себя?",
      code: `ALTER TABLE follows
ADD CONSTRAINT no_self_follow CHECK (???);`,
      options: ["follower_id <> followee_id", "follower_id = followee_id", "follower_id IS NULL"],
      answer: 0,
      explain: "Ограничение CHECK проверяет каждую строку. Условие «идентификаторы различаются» исключает самоподписку."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Один товар должен входить в несколько категорий. Как изменить модель?",
      options: ["Добавить в products ещё category_id2", "Заменить связь на M:N через таблицу product_categories", "Хранить категории строкой через запятую"],
      answer: 1,
      explain: "Для множественной принадлежности нужна таблица связи. Списки в одной колонке нарушают нормализацию и усложняют запросы."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Как посчитать выручку по категориям?",
      options: ["order_items → products → categories, суммируя qty × price", "users → orders → categories", "categories → users"],
      answer: 0,
      explain: "Выручка складывается из позиций заказов. Категорию берут через товар, поэтому путь идёт по цепочке order_items → products → categories."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Что даёт внешний ключ order_items.order_id?",
      options: ["Позиция не может ссылаться на несуществующий заказ", "Позиции автоматически сортируются", "Заказ нельзя изменить"],
      answer: 0,
      explain: "Внешний ключ обеспечивает ссылочную целостность и не позволяет появляться «осиротевшим» позициям."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Студент пересдаёт курс в другом семестре. Что нужно изменить в enrollments?",
      options: ["Ничего", "Включить семестр (или год) в составной ключ либо ввести отдельный id записи", "Удалить колонку grade"],
      answer: 1,
      explain: "Ключ (student_id, course_id) допускает только одну запись. Для нескольких попыток нужен дополнительный элемент ключа или суррогатный id."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Как найти средний балл по каждой группе?",
      options: ["Соединить groups → students → enrollments и усреднить grade по группе", "Усреднить courses.title", "Соединить teachers и groups"],
      answer: 0,
      explain: "Оценки лежат в enrollments, а группа — у студента. Агрегат AVG(grade) с GROUP BY группы даёт результат."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Нужно хранить расписание занятий. Что логично добавить в модель?",
      options: ["Поле schedule в students", "Сущность lessons со ссылками на курс, преподавателя, время и аудиторию", "Ничего: расписание не относится к данным"],
      answer: 1,
      explain: "Расписание — отдельный объект предметной области со своими атрибутами и связями. Ему нужна собственная таблица."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "В библиотеке несколько экземпляров одной книги. Как изменить модель?",
      options: ["Дублировать строки в books", "Добавить сущность copies: книга 1—N экземпляров, а выдача ссылается на экземпляр", "Увеличить qty в loans"],
      answer: 1,
      explain: "Книга как произведение и физический экземпляр — разные объекты. Выдача относится к конкретному экземпляру."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "library",
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
      topic: "ERD",
      erd: "library",
      q: "Штраф за просрочку лучше хранить или вычислять?",
      options: ["Только хранить", "Вычислять по датам и тарифу; хранить, когда нужно зафиксировать фактически начисленную сумму", "Не нужен никогда"],
      answer: 1,
      explain: "Производные значения лучше вычислять, чтобы не получить рассинхронизацию. Начисленный штраф как финансовый факт фиксируют отдельно."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Сотрудник работает сразу в двух отделах. Что поменять в модели?",
      options: ["Добавить dept_id2", "Заменить связь на M:N через таблицу employee_departments", "Дублировать сотрудника"],
      answer: 1,
      explain: "Связь «много ко многим» требует таблицы связи. Дополнительные колонки не масштабируются."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Нужно знать, какую должность и зарплату сотрудник имел год назад. Что добавить?",
      options: ["Ничего: employees хранит всё", "Таблицу истории назначений с периодами действия", "Колонку old_salary"],
      answer: 1,
      explain: "Перезапись значений теряет прошлое. История ведётся отдельными строками с датами начала и конца."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Как запретить сотруднику быть собственным руководителем?",
      options: ["CHECK (id <> manager_id)", "UNIQUE (manager_id)", "NOT NULL (manager_id)"],
      answer: 0,
      explain: "Простая проверка исключает самоссылку. Циклы большей длины требуют отдельной проверки (триггер или рекурсивный запрос)."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Цена номера за ночь меняется. Где хранить цену, по которой гость оплатил проживание?",
      options: ["Только в rooms: она всегда актуальна", "В bookings (или в строках проживания): цена должна фиксироваться на момент бронирования", "В hotels"],
      answer: 1,
      explain: "Изменение прайса не должно менять уже оформленные брони. Поэтому цена копируется в бронь."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "booking",
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
      topic: "ERD",
      erd: "booking",
      q: "Номера бывают одно- и двухместные. Куда добавить вместимость?",
      options: ["В guests", "В rooms (capacity): свойство номера", "В bookings.check_in"],
      answer: 1,
      explain: "Вместимость — характеристика номера. Её хранят в rooms (или в справочнике типов номеров)."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Нужны ответы на комментарии. Как расширить comments?",
      options: ["Добавить колонку parent_id, ссылающуюся на comments.id", "Создать таблицу replies без связи", "Хранить ответы текстом в одной ячейке"],
      answer: 0,
      explain: "Самоссылка по parent_id описывает дерево комментариев. Корневые комментарии имеют NULL в parent_id."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Удалили тег. Что произойдёт со строками post_tags при ON DELETE CASCADE?",
      options: ["Строки связи с этим тегом удалятся, статьи останутся", "Удалятся и статьи", "Ничего"],
      answer: 0,
      explain: "CASCADE распространяется на дочерние строки, то есть на связи post_tags. Статьи — не дочерние для тега и не затрагиваются."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "blog",
      q: "Как найти статьи без комментариев?",
      code: `SELECT p.id
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE c.id IS NULL;`,
      options: ["Запрос вернёт статьи, к которым нет ни одного комментария", "Запрос вернёт комментарии без статьи", "Запрос вернёт все статьи"],
      answer: 0,
      explain: "LEFT JOIN сохраняет все статьи, а фильтр IS NULL по правой таблице оставляет те, для которых пары не нашлось."
    }
);

window.QUESTIONS.advanced.push(
    {
      topic: "ERD",
      erd: "booking",
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
      topic: "ERD",
      erd: "hr",
      q: "Как получить всех подчинённых руководителя на любой глубине иерархии?",
      options: ["Один JOIN employees с employees", "Рекурсивный CTE (WITH RECURSIVE) по manager_id", "GROUP BY manager_id"],
      answer: 1,
      explain: "Одно самосоединение даёт только один уровень. Для произвольной глубины используют рекурсивный запрос, который шаг за шагом добавляет подчинённых."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Пользователь просит удалить аккаунт, но у него есть комментарии. Что предпочтительнее при внешних ключах?",
      options: ["Удалить пользователя и каскадно все комментарии: так проще", "Пометить пользователя удалённым (deleted_at) либо обезличить, не нарушая ссылочную целостность", "Обнулить id пользователя"],
      answer: 1,
      explain: "Каскадное удаление уничтожает чужие обсуждения, а жёсткое удаление мешает ссылкам. Мягкое удаление или обезличивание сохраняет данные и целостность."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Нужен ли в book_authors отдельный суррогатный ключ id, если уже есть составной PK (book_id, author_id)?",
      options: ["Обязательно: без id таблица не работает", "Не обязательно: составной PK уже уникально идентифицирует строку и запрещает дубли пары", "Нет, потому что составные ключи запрещены"],
      answer: 1,
      explain: "Для чистой таблицы связи составной PK — естественный выбор. Суррогатный id добавляют, если на строку ссылаются другие таблицы или есть собственные атрибуты связи."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "В PostgreSQL на orders.user_id есть FK, но нет индекса. Чем это грозит?",
      options: ["Ничем: индекс создаётся для каждого FK автоматически", "PostgreSQL не создаёт индекс на FK сам: соединения по user_id и проверки при удалении пользователя идут полным сканом", "FK без индекса не работает"],
      answer: 1,
      explain: "Индекс на PK есть всегда, а индекс на внешний ключ нужно создавать отдельно. Без него растёт стоимость JOIN и проверок целостности на больших таблицах."
    },
    {
      topic: "ERD",
      erd: "school",
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
      topic: "ERD",
      erd: "shop",
      q: "orders.total можно вычислить как сумму qty × price по order_items. Как относиться к хранению total?",
      options: ["Хранить без проверок: это ускорит чтение", "Это производное значение: хранить можно осознанно, но с гарантией пересчёта (транзакция, триггер, ограничение), иначе total разойдётся с позициями", "Запрещено в любой модели данных"],
      answer: 1,
      explain: "Хранение вычисляемых значений — компромисс между скоростью и согласованностью. Если выбрали его, нужно описать, кто и когда пересчитывает значение."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Что произойдёт с позициями заказа, если FK order_items.order_id объявлен с ON DELETE CASCADE и удаляют заказ?",
      options: ["Позиции останутся без заказа", "Позиции удалятся вместе с заказом автоматически", "Удаление заказа будет заблокировано"],
      answer: 1,
      explain: "CASCADE распространяет удаление на дочерние строки. Это удобно для «частей целого» вроде позиций заказа, но опасно для независимых данных: каскад нужно выбирать осознанно."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Врач сменил специальность, но в старых приёмах он должен остаться в прежней. Как смоделировать?",
      options: ["Перезаписывать specialty_id", "Хранить историю: отдельная таблица назначений специальностей с периодами действия либо фиксация специальности в приёме", "Удалить врача и создать нового"],
      answer: 1,
      explain: "Перезапись уничтожает исторический контекст. Темпоральная таблица или копия значения в факт (приём) сохраняют правду на момент события."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Медицинские данные пациента нужно защитить. Какой подход к модели разумен?",
      options: ["Хранить всё в открытом виде в одной таблице", "Разделить идентифицирующие данные и медицинские записи, ограничить доступ по ролям, шифровать чувствительные поля и вести аудит обращений", "Скрыть данные в интерфейсе"],
      answer: 1,
      explain: "Минимизация доступа и разделение персональных данных снижают последствия утечки. Аудит позволяет доказать, кто и когда читал запись."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Два пациента одновременно записываются в один слот врача. Как избежать двойной записи?",
      options: ["Проверить слот запросом и вставить без блокировок", "Уникальное ограничение на (doctor_id, starts_at) либо блокировка слота в транзакции", "Положиться на интерфейс"],
      answer: 1,
      explain: "Проверка «свободен ли слот» отдельным запросом уязвима для гонки. Ограничение целостности в БД гарантирует результат при любой конкуренции."
    },
    {
      topic: "ERD",
      erd: "clinic",
      q: "Закон требует хранить записи об оказанной помощи годами, но пациент просит удалить данные. Что учесть в модели?",
      options: ["Всегда физически удалять по запросу", "Разделять данные по срокам хранения и основаниям обработки, применять анонимизацию или ограничение доступа вместо немедленного удаления обязательных записей", "Игнорировать запрос"],
      answer: 1,
      explain: "Право на удаление ограничено обязанностями по хранению. Модель должна позволять выделить удаляемые данные и обезличить остальные."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Как организовать учёт, чтобы баланс всегда можно было доказать?",
      options: ["Только перезаписывать accounts.balance", "Хранить неизменяемый журнал операций (двойная запись) и считать баланс как сумму, а хранимое значение использовать как кэш", "Удалять старые операции"],
      answer: 1,
      explain: "Неизменяемый журнал даёт аудит и возможность восстановления. Исправления делают новыми сторнирующими записями, а не правкой старых."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Два параллельных перевода между счетами A и B в разных направлениях иногда падают с ошибкой взаимной блокировки. Что делать?",
      options: ["Ничего: так и должно быть", "Блокировать строки счетов в едином порядке (например, по возрастанию id)", "Отключить транзакции"],
      answer: 1,
      explain: "Взаимная блокировка возникает при циклическом ожидании. Единый порядок захвата ресурсов исключает цикл."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "bank",
      q: "Клиентское приложение повторило запрос на перевод после таймаута. Как защитить модель от двойного списания?",
      code: `ALTER TABLE transactions
ADD COLUMN idempotency_key text,
ADD CONSTRAINT uq_idem UNIQUE (account_id, idempotency_key);`,
      options: ["Это не нужно: повтор не опасен", "Уникальный ключ идемпотентности: повторная вставка нарушит ограничение, и сервис вернёт результат первой операции", "Увеличить таймаут"],
      answer: 1,
      explain: "Ограничение уникальности превращает повтор в детерминированный отказ вставки. Сервис возвращает ранее сохранённый результат."
    },
    {
      topic: "ERD",
      erd: "bank",
      q: "Таблица transactions выросла до миллиардов строк. Что поможет управлять данными?",
      options: ["Ничего: только удалять старые", "Секционирование по дате и архивирование старых секций, индексы под основные запросы", "Хранить в одном текстовом поле"],
      answer: 1,
      explain: "Секции позволяют ограничить запросы нужными периодами и обслуживать данные частями: отдельно индексировать, архивировать, удалять."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Как надёжно изолировать данные арендаторов на уровне БД PostgreSQL?",
      options: ["Фильтровать вручную в каждом запросе без других мер", "Использовать row-level security с политикой по tenant_id (и tenant_id в каждой таблице)", "Хранить tenant_id только в users"],
      answer: 1,
      explain: "RLS применяет политику на уровне БД, поэтому забытый фильтр в приложении не раскрывает чужие строки."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Как гарантировать, что invoice и subscription принадлежат одной организации?",
      options: ["Это невозможно", "Включить tenant_id в составной внешний ключ (tenant_id, id) родителя и дочерней таблицы", "Достаточно соглашения между разработчиками"],
      answer: 1,
      explain: "Обычный FK проверяет только id. Составной ключ с tenant_id запрещает ссылки между разными организациями на уровне данных."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Организация меняет тариф в середине месяца. Какая модель позволит корректно посчитать оплату?",
      options: ["Хранить только текущий plan_id", "Хранить периоды подписок (или события изменения тарифа) и считать по ним фактическое использование/пропорцию", "Хранить дату последней оплаты"],
      answer: 1,
      explain: "Без интервалов нельзя восстановить, какой тариф действовал в каждый день. История изменений — основа корректного биллинга."
    },
    {
      topic: "ERD",
      erd: "saas",
      q: "Как запретить две одновременные активные подписки у организации?",
      options: ["Проверкой в приложении", "Частичный уникальный индекс по tenant_id WHERE ended_at IS NULL", "Колонка status без ограничений"],
      answer: 1,
      explain: "Условный уникальный индекс гарантирует, что открытая подписка у организации одна, и работает при конкурентных запросах."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "inventory",
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
      topic: "ERD",
      erd: "inventory",
      q: "Как организовать модель, чтобы остаток всегда можно было восстановить и проверить?",
      options: ["Хранить только текущий остаток", "Журнал движений как источник правды (event sourcing) плюс производный остаток, который можно перестроить", "Хранить остаток текстом"],
      answer: 1,
      explain: "Журнал событий позволяет аудит и пересчёт. Остаток в stock остаётся оптимизацией чтения."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Составной PK stock — (warehouse_id, product_id). Запросы «где лежит товар X» медленные. Что сделать?",
      options: ["Ничего: PK покрывает все запросы", "Добавить индекс по product_id: индекс PK эффективен только для запросов, начинающихся с warehouse_id", "Удалить PK"],
      answer: 1,
      explain: "Составной индекс помогает запросам по левому префиксу ключа. Для поиска по второй колонке нужен отдельный индекс."
    },
    {
      topic: "ERD",
      erd: "inventory",
      q: "Нужно запретить отрицательные остатки. Где реализовать это правило?",
      options: ["Только в интерфейсе", "CHECK (qty >= 0) в базе, а приложение обрабатывает ошибку нарушения", "Никак"],
      answer: 1,
      explain: "Ограничение в БД работает для любого клиента и при любых гонках. Приложение превращает ошибку в понятный ответ."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Статусы доставки должны проходить в допустимом порядке. Как отразить это в модели?",
      options: ["Хранить свободный текст", "Фиксировать допустимые значения и хранить журнал переходов статусов (кто, когда, откуда, куда) с проверкой допустимости", "Перезаписывать статус без истории"],
      answer: 1,
      explain: "Явная машина состояний и журнал изменений позволяют расследовать инциденты и анализировать время в каждом статусе."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Нужно искать ближайшего курьера по координатам. Что подойдёт для хранения и поиска?",
      options: ["Две текстовые колонки lat и lon без индекса", "Геотип (например, PostGIS geography) и пространственный индекс GiST", "Хранить адрес строкой"],
      answer: 1,
      explain: "Пространственные типы и индексы позволяют эффективно искать по расстоянию. Текстовые координаты вынуждают к полному скану."
    },
    {
      topic: "ERD",
      erd: "delivery",
      q: "Два диспетчера одновременно назначают одного курьера на разные активные доставки, а правило требует одну активную доставку на курьера. Как защититься?",
      options: ["Положиться на аккуратность диспетчеров", "Частичный уникальный индекс по courier_id для активных статусов либо блокировка строки курьера в транзакции", "Добавить колонку в orders"],
      answer: 1,
      explain: "Правило «не более одной активной» формулируют как ограничение в БД. Частичный уникальный индекс гарантирует его при конкуренции."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Лента строится из постов подписок. При миллионах подписчиков у одного автора что ломается?",
      options: ["Ничего", "Запись поста в ленту каждого подписчика (fan-out on write) дорога для популярных авторов; применяют гибрид: для знаменитостей собирают ленту при чтении", "Ничего, кроме цвета интерфейса"],
      answer: 1,
      explain: "Выбор между записью и чтением определяется распределением нагрузки. Гибридные схемы обрабатывают «горячих» авторов отдельно."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Счётчик лайков популярного поста обновляется тысячи раз в секунду. Что становится проблемой?",
      options: ["Ничего", "Конкуренция за одну строку счётчика (hot row); помогают шардирование счётчика, асинхронная агрегация или кэш", "Размер колонки"],
      answer: 1,
      explain: "Одна строка с частыми обновлениями превращается в узкое место. Рассредоточение записей и отложенный сбор значений снимают нагрузку."
    },
    {
      topic: "ERD",
      erd: "social",
      q: "Пользователь удаляет аккаунт по требованию закона о персональных данных. Как поступить с его постами и лайками?",
      options: ["Каскадно удалить всё", "Удалить или обезличить персональные данные, а связанный контент либо удалить, либо оставить без привязки к личности в соответствии с политикой", "Ничего не менять"],
      answer: 1,
      explain: "Нужно удалить персональные данные, но целостность чужих данных и обсуждений тоже важна. Решение фиксируется политикой и реализуется анонимизацией или каскадом."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Адрес и цена в заказе должны оставаться неизменными после оформления. Как реализовать?",
      options: ["Ссылаться на текущие строки справочников", "Копировать значимые данные в заказ (снимок) или хранить неизменяемые версии справочников", "Запретить менять справочники"],
      answer: 1,
      explain: "Факт заказа — исторический. Копии (price_at_purchase, shipping_address) защищают от последующих правок справочников."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Магазин продаёт в нескольких валютах. Что добавить, чтобы отчёты были корректными?",
      options: ["Только сумму числом", "Валюту рядом с каждой суммой и курс на дату операции (или сумму в базовой валюте на момент операции)", "Ничего: курсы не меняются"],
      answer: 1,
      explain: "Сумма без валюты неоднозначна, а курс меняется со временем. Для отчётов нужна фиксация курса на момент операции."
    },
    {
      topic: "ERD",
      erd: "shop",
      q: "Каталог товаров меняется часто, нужна история изменений описания и цены. Что выбрать?",
      options: ["Перезаписывать строки", "Версионирование записей (SCD типа 2: версии с периодами действия) и ссылки заказов на версию или снимок цены", "Хранить историю в логах приложения"],
      answer: 1,
      explain: "Версии с интервалами позволяют восстановить состояние на любую дату и связывать факты с нужной версией."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Студент переходит из группы в группу. Как сохранить историю принадлежности?",
      options: ["Перезаписывать students.group_id", "Отдельная таблица членства в группах с датами начала и окончания", "Хранить историю в имени студента"],
      answer: 1,
      explain: "Текущая колонка отвечает на вопрос «где сейчас», а таблица интервалов — «где был на любую дату»."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Запись enrollments имеет составной PK (student_id, course_id) и собственные атрибуты. Как называется такая сущность?",
      options: ["Справочник", "Ассоциативная сущность (таблица связи с атрибутами): существует только как пара родителей", "Представление"],
      answer: 1,
      explain: "Ассоциативная сущность реализует связь M:N и хранит свойства самой связи, например оценку."
    },
    {
      topic: "ERD",
      erd: "school",
      q: "Как не допустить пересечения занятий одного преподавателя по времени?",
      options: ["Не нужно: проверять вручную", "Exclusion-ограничение по преподавателю и интервалу времени (например, btree_gist + tsrange)", "Колонка time в teachers"],
      answer: 1,
      explain: "Правило о непересечении интервалов выражается ограничением исключения, которое сравнивает пары значений по оператору «пересекаются»."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Библиотека хранит произведение, издание и физический экземпляр. Как выстроить сущности?",
      options: ["Одна таблица books для всего", "Work → Edition → Copy: произведение 1—N изданий 1—N экземпляров; ISBN относится к изданию", "Три несвязанные таблицы"],
      answer: 1,
      explain: "Разные уровни абстракции имеют разные свойства: автор и название у произведения, ISBN и издатель у издания, инвентарный номер у экземпляра."
    },
    {
      topic: "ERD",
      erd: "library",
      q: "Читатели хотят бронировать выданную книгу. Что добавить?",
      options: ["Колонку reserved в books", "Сущность резервирований с очередью (дата, читатель, состояние) и правилами выдачи по порядку", "Ничего: резервирование невозможно"],
      answer: 1,
      explain: "Очередь — отдельные записи с порядком и состоянием. Это позволяет отслеживать ожидание и автоматизировать уведомления."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "library",
      q: "Как запретить две одновременно активные выдачи одного экземпляра?",
      code: `CREATE UNIQUE INDEX uq_active_loan
ON loans (book_id)
WHERE returned_at IS NULL;`,
      options: ["Частичный уникальный индекс гарантирует, что открытая выдача книги может быть только одна", "Индекс запрещает возвращать книги", "Индекс ускоряет только чтение"],
      answer: 0,
      explain: "Уникальность применяется только к строкам с условием WHERE, то есть к незавершённым выдачам. Остальные строки истории не ограничены."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Нужно быстро получать всех подчинённых на любой глубине в большой иерархии. Какой способ хранения подходит помимо списка смежности?",
      options: ["Хранить имена начальников строкой", "Closure table (все пары предок—потомок), материализованный путь или вложенные множества", "Только manager_id"],
      answer: 1,
      explain: "Список смежности требует рекурсии. Closure table хранит транзитивные связи, что делает чтение простым за счёт усложнения записи."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Должность, отдел и руководитель сотрудника меняются во времени. Как смоделировать «кто чем руководил на дату X»?",
      options: ["Перезаписывать поля", "Темпоральные таблицы: записи с valid_from/valid_to и запросы «на дату»", "Хранить текущее и предыдущее значение в двух колонках"],
      answer: 1,
      explain: "Интервалы действия позволяют восстанавливать состояние на любую дату без потери прошлого."
    },
    {
      topic: "ERD",
      erd: "hr",
      q: "Как запретить циклы в иерархии подчинённости (A → B → A)?",
      options: ["CHECK достаточно", "Проверка при изменении (триггер с рекурсивным запросом) либо использование структуры, не допускающей циклов", "Циклы невозможны по определению"],
      answer: 1,
      explain: "Простой CHECK видит только одну строку. Циклы длиннее двух шагов обнаруживаются обходом иерархии при вставке или обновлении."
    },
    {
      topic: "ERD", lang: "sql",
      erd: "booking",
      q: "Как гарантировать отсутствие пересекающихся броней одного номера на уровне БД?",
      code: `ALTER TABLE bookings
ADD CONSTRAINT no_overlap
EXCLUDE USING gist (room_id WITH =, daterange(check_in, check_out) WITH &&);`,
      options: ["Ограничение исключения: запрещает строки с тем же номером и пересекающимися диапазонами дат", "Ограничение делает даты уникальными", "Оно ускоряет поиск гостей"],
      answer: 0,
      explain: "EXCLUDE обобщает UNIQUE: сравнивает значения произвольным оператором. Здесь запрещены пары строк с равным номером и пересекающимися датами."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Отель и гость находятся в разных часовых поясах. Как хранить время заезда?",
      options: ["Текстом без пояса", "Дату заезда как календарную дату в зоне отеля, а моменты событий как timestamptz (UTC)", "В часовом поясе гостя без указания"],
      answer: 1,
      explain: "Бронь «на ночь 1 ноября» привязана к календарю отеля, а момент оплаты — абсолютное время. Смешение приводит к сдвигу дат."
    },
    {
      topic: "ERD",
      erd: "booking",
      q: "Отмена брони зависит от политики возврата. Как это отразить в модели?",
      options: ["Добавить колонку refund_percent к гостю", "Хранить политику отмены (условия по срокам) и фиксировать при бронировании применённую версию; сами отмены и возвраты — отдельными событиями", "Не хранить: считать на лету по текущим правилам"],
      answer: 1,
      explain: "Условия на момент оформления брони обязательны к соблюдению. Версия политики и события отмены дают воспроизводимость расчёта."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Теги и лайки нужны и постам, и фотографиям. Как реализовать без нарушения ссылочной целостности?",
      options: ["Колонки target_type и target_id без внешних ключей", "Отдельные таблицы связи для каждого типа (post_tags, photo_tags) либо общий родительский объект «контент» с FK", "Хранить всё в JSON"],
      answer: 1,
      explain: "Полиморфная ссылка без FK оставляет целостность на совести приложения. Раздельные таблицы или общий супертип сохраняют проверки БД."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Счётчик комментариев показывается в списке статей и сильно грузит базу агрегатами. Что делать?",
      options: ["Ничего", "Хранить денормализованный comments_count в posts и обновлять при вставке и удалении (или считать асинхронно)", "Показывать счётчик только админам"],
      answer: 1,
      explain: "Предрасчёт убирает агрегацию на чтении. Цена — необходимость поддерживать значение согласованным."
    },
    {
      topic: "ERD",
      erd: "blog",
      q: "Глубокие деревья комментариев нужно читать одним запросом. Какой способ хранения подходит?",
      options: ["Только parent_id и рекурсия на клиенте", "Материализованный путь (например, ltree) или closure table: ветку можно получить обычным запросом", "Хранить дерево строкой без структуры"],
      answer: 1,
      explain: "Материализованный путь хранит предков в одной колонке, и выборка поддерева выполняется по индексу, без рекурсии."
    }
);
