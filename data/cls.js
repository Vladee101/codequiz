// Направление CLS: вопросы по уровням и схемы диаграмм.
// Файл подгружается при выборе направления (см. window.TRACK_FILES в questions.js).

// Схемы диаграмм классов: nodes — классы (kind: class/abstract/interface/enum; attrs, ops; префикс _ — static, * — abstract; col/row — позиция),
// rels — [от, к, вид, подпись, кратность у «от», кратность у «к»]; вид: assoc, assocd, agg, comp (ромб у «от»), inherit, realize, dep (стрелка к «к»).
window.CLASSES = {
  "shop": {"nodes":[{"id":"cust","name":"Customer","col":0,"row":0,"kind":"class","attrs":["-name: String","-email: String"],"ops":["+placeOrder(): Order"]},{"id":"ord","name":"Order","col":1,"row":0,"kind":"class","attrs":["-id: int","-date: Date","-status: OrderStatus"],"ops":["+total(): Money"]},{"id":"item","name":"OrderItem","col":2,"row":0,"kind":"class","attrs":["-qty: int","-price: Money"],"ops":["+subtotal(): Money"]},{"id":"pm","name":"PaymentMethod","col":1,"row":1,"kind":"interface","ops":["+pay(amount: Money): bool"]},{"id":"prod","name":"Product","col":2,"row":1,"kind":"class","attrs":["-name: String","-price: Money"]},{"id":"card","name":"CardPayment","col":0,"row":2,"kind":"class","attrs":["-cardNumber: String"],"ops":["+pay(amount: Money): bool"]},{"id":"cash","name":"CashPayment","col":2,"row":2,"kind":"class","ops":["+pay(amount: Money): bool"]}],"rels":[["cust","ord","assoc","размещает","1","0..*"],["ord","item","comp",null,"1","1..*"],["item","prod","assocd",null,"*","1"],["ord","pm","assocd","оплачивается","*","1"],["card","pm","realize"],["cash","pm","realize"]]},
  "animals": {"nodes":[{"id":"an","name":"Animal","col":1,"row":0,"kind":"abstract","attrs":["#name: String"],"ops":["*+makeSound()","+getName(): String"]},{"id":"dog","name":"Dog","col":0,"row":1,"kind":"class","ops":["+makeSound()","+fetch()"]},{"id":"cat","name":"Cat","col":2,"row":1,"kind":"class","ops":["+makeSound()","+scratch()"]},{"id":"own","name":"Owner","col":0,"row":2,"kind":"class","attrs":["-name: String"]}],"rels":[["dog","an","inherit"],["cat","an","inherit"],["own","dog","assoc","владеет","1","0..*"]]},
  "library": {"nodes":[{"id":"lib","name":"Library","col":0,"row":0,"kind":"class","attrs":["-name: String"]},{"id":"book","name":"Book","col":1,"row":0,"kind":"class","attrs":["-title: String","-isbn: String"]},{"id":"auth","name":"Author","col":2,"row":0,"kind":"class","attrs":["-name: String"]},{"id":"mem","name":"Member","col":0,"row":1,"kind":"class","attrs":["-name: String","-cardNo: int"]},{"id":"loan","name":"Loan","col":1,"row":1,"kind":"class","attrs":["-issuedAt: Date","-returnedAt: Date"],"ops":["+isOverdue(): bool"]}],"rels":[["lib","book","agg",null,"1","*"],["book","auth","assoc","написана","*","1..*"],["mem","loan","assoc","берёт","1","*"],["loan","book","assocd",null,"*","1"]]},
  "notify": {"nodes":[{"id":"svc","name":"OrderService","col":1,"row":0,"kind":"class","ops":["+complete(order: Order)"]},{"id":"nt","name":"Notifier","col":1,"row":1,"kind":"interface","ops":["+send(msg: String)"]},{"id":"em","name":"EmailNotifier","col":0,"row":2,"kind":"class","attrs":["-smtpHost: String"],"ops":["+send(msg: String)"]},{"id":"sms","name":"SmsNotifier","col":2,"row":2,"kind":"class","attrs":["-gateway: String"],"ops":["+send(msg: String)"]}],"rels":[["svc","nt","dep","использует"],["em","nt","realize"],["sms","nt","realize"]]},
  "university": {"nodes":[{"id":"uni","name":"University","col":0,"row":0,"kind":"class","attrs":["-name: String"]},{"id":"dep","name":"Department","col":1,"row":0,"kind":"class","attrs":["-title: String"]},{"id":"prof","name":"Professor","col":2,"row":0,"kind":"class","attrs":["-name: String"]}],"rels":[["uni","dep","comp",null,"1","1..*"],["dep","prof","agg",null,"1","*"]]},
  "enum_vis": {"nodes":[{"id":"ord","name":"Order","col":0,"row":0,"kind":"class","attrs":["-id: int","#status: OrderStatus","+total: Money","_count: int"],"ops":["+pay()","~recalc()","-validate()","_create(): Order"]},{"id":"st","name":"OrderStatus","col":1,"row":0,"kind":"enum","attrs":["NEW","PAID","SHIPPED","CANCELLED"]}],"rels":[["ord","st","assocd"]]},
  "strategy": {"nodes":[{"id":"ctx","name":"Context","col":0,"row":0,"kind":"class","attrs":["-strategy: Strategy"],"ops":["+setStrategy(s: Strategy)","+execute()"]},{"id":"st","name":"Strategy","col":1,"row":0,"kind":"interface","ops":["+algorithm()"]},{"id":"a","name":"ConcreteStrategyA","col":0,"row":1,"kind":"class","ops":["+algorithm()"]},{"id":"b","name":"ConcreteStrategyB","col":2,"row":1,"kind":"class","ops":["+algorithm()"]}],"rels":[["ctx","st","assocd",null,null,"1"],["a","st","realize"],["b","st","realize"]]},
  "observer": {"nodes":[{"id":"sub","name":"Subject","col":0,"row":0,"kind":"class","attrs":["-observers: List<Observer>"],"ops":["+attach(o: Observer)","+detach(o: Observer)","+notifyAll()"]},{"id":"obs","name":"Observer","col":1,"row":0,"kind":"interface","ops":["+update()"]},{"id":"cs","name":"ConcreteSubject","col":0,"row":1,"kind":"class","attrs":["-state: int"],"ops":["+getState(): int"]},{"id":"co","name":"ConcreteObserver","col":1,"row":1,"kind":"class","ops":["+update()"]}],"rels":[["sub","obs","assocd","уведомляет","1","*"],["cs","sub","inherit"],["co","obs","realize"]]},
  "layers": {"nodes":[{"id":"ctl","name":"OrderController","col":0,"row":0,"kind":"class","ops":["+create(req: Request)"]},{"id":"svc","name":"OrderService","col":1,"row":0,"kind":"class","ops":["+create(order: Order)"]},{"id":"repo","name":"OrderRepository","col":2,"row":0,"kind":"interface","ops":["+save(order: Order)","+findById(id: int): Order"]},{"id":"jpa","name":"JpaOrderRepository","col":2,"row":1,"kind":"class","ops":["+save(order: Order)","+findById(id: int): Order"]}],"rels":[["ctl","svc","dep"],["svc","repo","dep"],["jpa","repo","realize"]]},
  "bad_class": {"nodes":[{"id":"car","name":"Car","col":0,"row":0,"kind":"class","attrs":["-model: String"]},{"id":"eng","name":"Engine","col":1,"row":0,"kind":"class","attrs":["-power: int"]},{"id":"emp","name":"Employee","col":0,"row":1,"kind":"class","attrs":["-name: String"]},{"id":"mgr","name":"Manager","col":1,"row":1,"kind":"class","attrs":["-bonus: Money"]}],"rels":[["car","eng","comp",null,"1","1"],["eng","car","comp",null,"1","1"],["emp","mgr","inherit"],["mgr","emp","inherit"]]},
  "sym_class": {"nodes":[{"id":"a","name":"Customer","col":0,"row":0,"kind":"class","attrs":["-name: String","-email: String"],"ops":["+placeOrder(): Order"]}],"rels":[]},
  "sym_abstract": {"nodes":[{"id":"a","name":"Shape","col":0,"row":0,"kind":"abstract","attrs":["#color: String"],"ops":["*+area(): double","+describe(): String"]}],"rels":[]},
  "sym_interface": {"nodes":[{"id":"a","name":"Payable","col":0,"row":0,"kind":"interface","ops":["+pay(amount: Money)"]}],"rels":[]},
  "sym_enum": {"nodes":[{"id":"a","name":"OrderStatus","col":0,"row":0,"kind":"enum","attrs":["NEW","PAID","SHIPPED"]}],"rels":[]},
  "sym_assoc": {"nodes":[{"id":"a","name":"Customer","col":0,"row":0,"kind":"class","attrs":["-name: String"]},{"id":"b","name":"Order","col":1,"row":0,"kind":"class","attrs":["-id: int"]}],"rels":[["a","b","assoc","размещает","1","0..*"]]},
  "sym_assocd": {"nodes":[{"id":"a","name":"Order","col":0,"row":0,"kind":"class","attrs":["-id: int"]},{"id":"b","name":"Product","col":1,"row":0,"kind":"class","attrs":["-name: String"]}],"rels":[["a","b","assocd",null,"*","1"]]},
  "sym_agg": {"nodes":[{"id":"a","name":"Team","col":0,"row":0,"kind":"class","attrs":["-name: String"]},{"id":"b","name":"Player","col":1,"row":0,"kind":"class","attrs":["-name: String"]}],"rels":[["a","b","agg",null,"1","*"]]},
  "sym_comp": {"nodes":[{"id":"a","name":"House","col":0,"row":0,"kind":"class","attrs":["-address: String"]},{"id":"b","name":"Room","col":1,"row":0,"kind":"class","attrs":["-area: double"]}],"rels":[["a","b","comp",null,"1","1..*"]]},
  "sym_inherit": {"nodes":[{"id":"a","name":"Dog","col":0,"row":0,"kind":"class","ops":["+fetch()"]},{"id":"b","name":"Animal","col":1,"row":0,"kind":"class","attrs":["#name: String"]}],"rels":[["a","b","inherit"]]},
  "sym_realize": {"nodes":[{"id":"a","name":"EmailNotifier","col":0,"row":0,"kind":"class","ops":["+send(msg: String)"]},{"id":"b","name":"Notifier","col":1,"row":0,"kind":"interface","ops":["+send(msg: String)"]}],"rels":[["a","b","realize"]]},
  "sym_dep": {"nodes":[{"id":"a","name":"OrderService","col":0,"row":0,"kind":"class","ops":["+complete()"]},{"id":"b","name":"Logger","col":1,"row":0,"kind":"class","ops":["+log(msg: String)"]}],"rels":[["a","b","dep"]]},
  "sym_vis": {"nodes":[{"id":"a","name":"Account","col":0,"row":0,"kind":"class","attrs":["+id: int","-balance: Money","#owner: String","~bank: String","_count: int"],"ops":["+deposit(sum: Money)","-audit()","#validate()","_open(): Account"]}],"rels":[]}
};

window.QUESTIONS.basic.push(
    {
      topic: "CLS",
      cls: "sym_class",
      q: "Из каких трёх секций состоит прямоугольник класса?",
      options: ["Имя, атрибуты, операции (методы)", "Имя, связи, события", "Имя, интерфейсы, таблицы"],
      answer: 0,
      explain: "Верхняя секция — имя класса, средняя — атрибуты (поля), нижняя — операции (методы)."
    },
    {
      topic: "CLS",
      cls: "sym_abstract",
      q: "Как отличить абстрактный класс на диаграмме?",
      options: ["Имя класса и абстрактные методы пишут курсивом", "Имя подчёркнуто", "В рамке двойная линия"],
      answer: 0,
      explain: "Курсив означает абстрактность: нельзя создать экземпляр, а абстрактные методы реализуют потомки."
    },
    {
      topic: "CLS",
      cls: "sym_interface",
      q: "Что означает стереотип «interface» над именем?",
      options: ["Это интерфейс: набор операций без реализации, который реализуют классы", "Это абстрактный класс", "Это перечисление"],
      answer: 0,
      explain: "Интерфейс задаёт контракт. Реализующие его классы обязаны предоставить указанные операции."
    },
    {
      topic: "CLS",
      cls: "sym_enum",
      q: "Что обозначает стереотип «enum»?",
      options: ["Перечисление: тип с конечным набором именованных значений", "Интерфейс", "Класс-сущность"],
      answer: 0,
      explain: "В секции значений перечисляют допустимые константы: NEW, PAID, SHIPPED."
    },
    {
      topic: "CLS",
      cls: "sym_assoc",
      q: "Что означает сплошная линия между Customer и Order с подписью «размещает»?",
      options: ["Ассоциация: объекты классов связаны друг с другом", "Наследование", "Зависимость"],
      answer: 0,
      explain: "Ассоциация — структурная связь «один объект знает о другом». Подпись описывает смысл, а числа у концов — кратность."
    },
    {
      topic: "CLS",
      cls: "sym_assoc",
      q: "Что означают числа 1 и 0..* у концов линии?",
      options: ["Кратность: один клиент может иметь ноль или больше заказов", "Номера версий", "Приоритеты"],
      answer: 0,
      explain: "Кратность показывает, сколько объектов участвуют в связи. «0..*» — любое число, включая ноль."
    },
    {
      topic: "CLS",
      cls: "sym_assocd",
      q: "Что означает стрелка на ассоциации от Order к Product?",
      options: ["Навигируемость: Order знает о Product, а Product о Order — нет", "Наследование", "Порядок вызова"],
      answer: 0,
      explain: "Направленная ассоциация показывает, откуда возможна навигация. У Order есть ссылка на Product."
    },
    {
      topic: "CLS",
      cls: "sym_agg",
      q: "Что означает пустой (незакрашенный) ромб у класса Team?",
      options: ["Агрегация: команда состоит из игроков, но игроки могут существовать отдельно", "Композиция", "Наследование"],
      answer: 0,
      explain: "Агрегация — слабая связь «целое — часть». Часть не уничтожается вместе с целым."
    },
    {
      topic: "CLS",
      cls: "sym_comp",
      q: "Что означает закрашенный ромб у класса House?",
      options: ["Композиция: комнаты входят в дом и не существуют без него", "Агрегация", "Реализация"],
      answer: 0,
      explain: "Композиция — сильная связь «целое — часть» с общим жизненным циклом."
    },
    {
      topic: "CLS",
      cls: "sym_inherit",
      q: "Что означает сплошная линия с пустым треугольником от Dog к Animal?",
      options: ["Наследование: Dog — подкласс Animal («является»)", "Реализация интерфейса", "Зависимость"],
      answer: 0,
      explain: "Треугольник указывает на родителя. Потомок наследует атрибуты и операции базового класса."
    },
    {
      topic: "CLS",
      cls: "sym_realize",
      q: "Что означает пунктирная линия с пустым треугольником от EmailNotifier к Notifier?",
      options: ["Реализация: класс реализует интерфейс", "Наследование классов", "Агрегация"],
      answer: 0,
      explain: "Пунктир с пустым треугольником — реализация интерфейса."
    },
    {
      topic: "CLS",
      cls: "sym_dep",
      q: "Что означает пунктирная стрелка от OrderService к Logger?",
      options: ["Зависимость: OrderService использует Logger, и изменения Logger могут повлиять на него", "Наследование", "Композиция"],
      answer: 0,
      explain: "Зависимость — самая слабая связь: класс временно использует другой, например как параметр метода."
    },
    {
      topic: "CLS",
      cls: "sym_vis",
      q: "Что означает знак «+» перед членом класса?",
      options: ["Открытый (public) член", "Закрытый член", "Защищённый член"],
      answer: 0,
      explain: "Знаки видимости: + public, − private, # protected, ~ package."
    },
    {
      topic: "CLS",
      cls: "sym_vis",
      q: "Что означает знак «−» перед атрибутом?",
      options: ["Закрытый (private): виден только внутри класса", "Открытый", "Защищённый"],
      answer: 0,
      explain: "Атрибуты обычно делают закрытыми и предоставляют доступ через методы."
    },
    {
      topic: "CLS",
      cls: "sym_vis",
      q: "Что означает знак «#»?",
      options: ["Защищённый (protected): виден классу и его потомкам", "Открытый", "Закрытый"],
      answer: 0,
      explain: "Protected позволяет подклассам использовать член, но скрывает его от остального кода."
    },
    {
      topic: "CLS",
      cls: "sym_vis",
      q: "Что означает подчёркивание у члена класса (например, count)?",
      options: ["Статический член: принадлежит классу, а не экземпляру", "Абстрактный", "Приватный"],
      answer: 0,
      explain: "Подчёркивание — признак static: один на весь класс."
    },
    {
      topic: "CLS",
      q: "Для чего нужна диаграмма классов?",
      options: ["Для описания статической структуры системы: классов, их свойств, операций и связей", "Для описания порядка вызовов", "Для описания состояний"],
      answer: 0,
      explain: "Диаграмма классов — основной вид структурного моделирования в UML."
    },
    {
      topic: "CLS",
      q: "Что такое класс?",
      options: ["Шаблон для создания объектов с общими атрибутами и поведением", "Конкретный объект", "База данных"],
      answer: 0,
      explain: "Класс описывает тип, а объект — его экземпляр."
    },
    {
      topic: "CLS",
      q: "Что такое атрибут класса?",
      options: ["Свойство, хранящее данные объекта", "Метод", "Связь"],
      answer: 0,
      explain: "Атрибуты записывают как «видимость имя: тип», например «−name: String»."
    },
    {
      topic: "CLS",
      q: "Что такое операция (метод) класса?",
      options: ["Поведение, которое объект может выполнить", "Свойство", "Связь"],
      answer: 0,
      explain: "Операции записывают как «видимость имя(параметры): тип результата»."
    },
    {
      topic: "CLS",
      q: "Как записывается атрибут «закрытое поле имя типа строка»?",
      options: ["-name: String", "name -String", "String: name"],
      answer: 0,
      explain: "Формат: видимость, имя, двоеточие, тип."
    },
    {
      topic: "CLS",
      q: "Что показывает кратность 1..* у конца ассоциации?",
      options: ["От одного объекта до бесконечного числа", "Ровно один", "Ноль или один"],
      answer: 0,
      explain: "1..* — «один или больше». 0..1 — «ноль или один», 1 — «ровно один»."
    },
    {
      topic: "CLS",
      q: "Что означает кратность 0..1?",
      options: ["Связь необязательна: объект либо есть, либо нет", "Ровно один", "Много"],
      answer: 0,
      explain: "Кратность 0..1 выражает необязательную связь с единичным значением."
    },
    {
      topic: "CLS",
      q: "Чем интерфейс отличается от абстрактного класса на диаграмме?",
      options: ["У интерфейса нет атрибутов и реализации, он задаёт только контракт; у абстрактного класса могут быть и реализация, и поля", "Ничем", "Интерфейс — подкласс"],
      answer: 0,
      explain: "Интерфейс описывает «что», абстрактный класс — частично «как»."
    },
    {
      topic: "CLS",
      q: "Как называется связь «является» между классами?",
      options: ["Наследование (обобщение)", "Композиция", "Зависимость"],
      answer: 0,
      explain: "Dog является Animal: подкласс — частный случай базового."
    },
    {
      topic: "CLS",
      q: "Как называется связь «состоит из», при которой часть не живёт без целого?",
      options: ["Композиция", "Агрегация", "Зависимость"],
      answer: 0,
      explain: "Композиция — сильное владение: уничтожение целого уничтожает части."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Сколько заказов может быть у одного клиента?",
      options: ["Ноль или больше", "Ровно один", "Только один активный"],
      answer: 0,
      explain: "Кратность «0..*» у Order означает, что у клиента может не быть заказов или быть много."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Что означает закрашенный ромб у Order рядом с OrderItem?",
      options: ["Композиция: позиции заказа не существуют без заказа", "Агрегация", "Наследование"],
      answer: 0,
      explain: "Позиция заказа — часть заказа и удаляется вместе с ним."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Сколько позиций должно быть в заказе?",
      options: ["Минимум одна", "Ноль или больше", "Ровно одна"],
      answer: 0,
      explain: "Кратность «1..*» у OrderItem означает хотя бы одну позицию."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Какие классы реализуют интерфейс PaymentMethod?",
      options: ["CardPayment и CashPayment", "Order и Customer", "Product"],
      answer: 0,
      explain: "Пунктирные линии с пустым треугольником ведут от обоих платёжных классов к интерфейсу."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Что означает стрелка от OrderItem к Product?",
      options: ["Позиция заказа знает товар, а товар о позициях — нет", "Товар знает о позиции", "Наследование"],
      answer: 0,
      explain: "Направленная ассоциация указывает направление навигации."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Какой метод есть у Customer?",
      options: ["placeOrder()", "pay()", "subtotal()"],
      answer: 0,
      explain: "В нижней секции класса Customer указан метод placeOrder() с результатом Order."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Какой класс является абстрактным?",
      options: ["Animal: имя набрано курсивом", "Dog", "Owner"],
      answer: 0,
      explain: "Курсив в имени класса и метода makeSound() показывает абстрактность."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "От какого класса наследуются Dog и Cat?",
      options: ["Animal", "Owner", "Друг от друга"],
      answer: 0,
      explain: "Стрелки с пустым треугольником направлены к Animal."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Что означает «#name» в классе Animal?",
      options: ["Защищённый атрибут: доступен потомкам", "Открытый", "Закрытый"],
      answer: 0,
      explain: "Символ # означает protected: подклассы Dog и Cat могут использовать name."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Сколько собак может быть у одного владельца?",
      options: ["Ноль или больше", "Ровно одна", "Не более одной"],
      answer: 0,
      explain: "Кратность 0..* у Dog допускает отсутствие собак и несколько."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Что означает пустой ромб у Library рядом с Book?",
      options: ["Агрегация: библиотека содержит книги, но они могут существовать отдельно", "Композиция", "Наследование"],
      answer: 0,
      explain: "Агрегация показывает слабую принадлежность."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Сколько авторов может быть у книги?",
      options: ["Один или больше", "Ровно один", "Ни одного"],
      answer: 0,
      explain: "Кратность 1..* у Author: у книги всегда есть хотя бы один автор."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Какой класс связывает читателя и книгу?",
      options: ["Loan: выдача", "Library", "Author"],
      answer: 0,
      explain: "Выдача связывает читателя с книгой и хранит даты."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Что делает метод isOverdue() в Loan?",
      options: ["Проверяет просрочку выдачи (результат bool)", "Выдаёт книгу", "Регистрирует читателя"],
      answer: 0,
      explain: "Метод возвращает логическое значение: просрочена ли выдача."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Какой класс является интерфейсом?",
      options: ["Notifier", "EmailNotifier", "OrderService"],
      answer: 0,
      explain: "Над именем указан стереотип «interface»."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Что означает пунктирная стрелка от OrderService к Notifier?",
      options: ["Зависимость: сервис использует интерфейс уведомлений", "Наследование", "Композиция"],
      answer: 0,
      explain: "Сервис зависит от абстракции, а не от конкретных реализаций."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Сколько реализаций интерфейса Notifier на диаграмме?",
      options: ["Две: email и SMS", "Одна", "Три"],
      answer: 0,
      explain: "EmailNotifier и SmsNotifier реализуют интерфейс."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Что означает закрашенный ромб у University рядом с Department?",
      options: ["Композиция: кафедры не существуют без университета", "Агрегация", "Наследование"],
      answer: 0,
      explain: "Композиция — сильное владение с общим жизненным циклом."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Что означает пустой ромб у Department рядом с Professor?",
      options: ["Агрегация: преподаватели входят в кафедру, но могут существовать отдельно", "Композиция", "Реализация"],
      answer: 0,
      explain: "Преподаватель может перейти на другую кафедру, поэтому это агрегация."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Что произойдёт с кафедрами при закрытии университета (композиция)?",
      options: ["Они прекратят существование вместе с ним", "Останутся", "Станут преподавателями"],
      answer: 0,
      explain: "Часть при композиции не живёт без целого."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Что означает «#status» в классе Order?",
      options: ["Защищённый атрибут типа OrderStatus", "Закрытый", "Открытый"],
      answer: 0,
      explain: "Знак # — protected. Тип атрибута — перечисление."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Какие значения может принимать OrderStatus?",
      options: ["NEW, PAID, SHIPPED, CANCELLED", "Любую строку", "Любое число"],
      answer: 0,
      explain: "Перечисление ограничивает значения заданным набором."
    },
    {
      topic: "CLS",
      cls: "strategy",
      q: "Что означает интерфейс Strategy на диаграмме?",
      options: ["Контракт алгоритма, который реализуют ConcreteStrategyA и ConcreteStrategyB", "Абстрактный класс", "Перечисление"],
      answer: 0,
      explain: "Конкретные стратегии реализуют общий интерфейс."
    },
    {
      topic: "CLS",
      cls: "observer",
      q: "Что делает метод notifyAll() в Subject?",
      options: ["Уведомляет всех наблюдателей об изменении", "Удаляет наблюдателей", "Создаёт субъекта"],
      answer: 0,
      explain: "В паттерне «Наблюдатель» субъект рассылает уведомления всем подписчикам."
    }
);

window.QUESTIONS.medium.push(
    {
      topic: "CLS",
      q: "Чем агрегация отличается от композиции по жизненному циклу?",
      options: ["При композиции часть уничтожается вместе с целым, при агрегации — живёт независимо", "Ничем", "Агрегация сильнее композиции"],
      answer: 0,
      explain: "Композиция — «владение»: часть не может существовать без целого. Агрегация — «включение» без владения."
    },
    {
      topic: "CLS",
      q: "Чем ассоциация отличается от зависимости?",
      options: ["Ассоциация — устойчивая структурная связь (поле), зависимость — временное использование (параметр, локальная переменная)", "Ничем", "Зависимость сильнее"],
      answer: 0,
      explain: "Ассоциация обычно выражается полем класса, зависимость — использованием в методе без хранения ссылки."
    },
    {
      topic: "CLS",
      q: "Когда вместо наследования лучше применить композицию?",
      options: ["Когда связь «имеет», а не «является», или нужно менять поведение во время выполнения", "Никогда", "Всегда"],
      answer: 0,
      explain: "Принцип «предпочитайте композицию наследованию»: композиция гибче и снижает связанность."
    },
    {
      topic: "CLS",
      q: "Что означает кратность * без нижней границы?",
      options: ["Сокращённая запись 0..*: любое число, включая ноль", "Ровно один", "Ноль или один"],
      answer: 0,
      explain: "Звёздочка означает «0..*». «1..*» нужно писать явно."
    },
    {
      topic: "CLS",
      q: "Что такое навигируемость ассоциации?",
      options: ["Возможность перейти от одного объекта к другому по ссылке в заданном направлении", "Порядок вызова", "Скорость"],
      answer: 0,
      explain: "Однонаправленные ассоциации снижают связанность по сравнению с двунаправленными."
    },
    {
      topic: "CLS",
      q: "Что такое класс ассоциации?",
      options: ["Класс, описывающий свойства самой связи, например Loan для Member и Book", "Абстрактный класс", "Интерфейс"],
      answer: 0,
      explain: "Если у связи есть собственные атрибуты (дата выдачи), их выносят в класс ассоциации."
    },
    {
      topic: "CLS",
      q: "Как реализуется связь «многие ко многим» между классами в коде и БД?",
      options: ["Коллекциями на обеих сторонах в коде и таблицей связи в БД, часто через класс ассоциации", "Одним полем", "Наследованием"],
      answer: 0,
      explain: "Класс ассоциации превращается в таблицу связи с внешними ключами и атрибутами."
    },
    {
      topic: "CLS",
      q: "Что такое полиморфизм в терминах диаграммы классов?",
      options: ["Объекты разных подклассов обрабатываются через базовый тип, и вызывается нужная реализация", "Много атрибутов", "Много связей"],
      answer: 0,
      explain: "Полиморфизм опирается на наследование и интерфейсы: клиент зависит от абстракции."
    },
    {
      topic: "CLS",
      q: "Что такое принцип инверсии зависимостей (DIP)?",
      options: ["Модули высокого уровня зависят от абстракций, а не от конкретных реализаций", "Классы зависят от конкретных классов", "Зависимости не нужны"],
      answer: 0,
      explain: "Интерфейс между слоями позволяет подменять реализации и тестировать код."
    },
    {
      topic: "CLS",
      q: "Что такое производный атрибут (derived)?",
      options: ["Атрибут, значение которого вычисляется из других, обозначается «/» перед именем", "Статический атрибут", "Атрибут интерфейса"],
      answer: 0,
      explain: "Пример: /age вычисляется из birthDate."
    },
    {
      topic: "CLS",
      q: "Что означает ограничение {ordered} у конца ассоциации?",
      options: ["Элементы коллекции упорядочены", "Элементы уникальны", "Связь обязательна"],
      answer: 0,
      explain: "Модификаторы {ordered}, {unique}, {readOnly} уточняют свойства конца связи."
    },
    {
      topic: "CLS",
      q: "Что такое квалифицированная ассоциация?",
      options: ["Ассоциация, где объект выбирается по ключу (квалификатору), например словарь", "Ассоциация с наследованием", "Агрегация"],
      answer: 0,
      explain: "Квалификатор рисуют небольшим прямоугольником у класса и используют как индекс."
    },
    {
      topic: "CLS",
      q: "Что такое стереотип?",
      options: ["Расширение UML, уточняющее смысл элемента: «interface», «entity», «service»", "Цвет", "Вид связи"],
      answer: 0,
      explain: "Стереотипы пишут в кавычках-ёлочках и используют для доменных и технических пометок."
    },
    {
      topic: "CLS",
      q: "Что такое интерфейс в терминах «леденец» (lollipop)?",
      options: ["Краткая запись реализуемого интерфейса кругом на линии", "Наследование", "Композиция"],
      answer: 0,
      explain: "Круг означает предоставляемый интерфейс, а полукруг — требуемый."
    },
    {
      topic: "CLS",
      q: "Что означает дженерик-класс List<T> на диаграмме?",
      options: ["Шаблонный (параметризованный) класс: тип T подставляется при использовании", "Абстрактный класс", "Интерфейс"],
      answer: 0,
      explain: "Параметры шаблона показывают в пунктирном прямоугольнике в углу класса."
    },
    {
      topic: "CLS",
      q: "В каком порядке принято проектировать диаграмму классов предметной области?",
      options: ["Найти сущности и связи, затем атрибуты, затем операции и ограничения", "Сначала методы", "Сначала БД"],
      answer: 0,
      explain: "Сначала понимают предметную область, затем детализируют структуру."
    },
    {
      topic: "CLS",
      q: "Как диаграмма классов предметной области отличается от диаграммы классов реализации?",
      options: ["Предметная область описывает понятия бизнеса, реализация — классы кода с типами, видимостью и технологическими деталями", "Ничем", "Предметная — это БД"],
      answer: 0,
      explain: "Модель домена — концептуальна и не обязана совпадать с кодом."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Что произойдёт с позициями заказа при удалении заказа?",
      options: ["Они удалятся вместе с ним: это композиция", "Останутся", "Станут товарами"],
      answer: 0,
      explain: "Закрашенный ромб означает общий жизненный цикл."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Почему Order зависит от интерфейса PaymentMethod, а не от конкретных способов оплаты?",
      options: ["Это позволяет добавлять новые способы оплаты, не меняя Order (принцип открытости/закрытости и DIP)", "Это ошибка", "Так быстрее"],
      answer: 0,
      explain: "Order знает только контракт, а реализации подключаются снаружи."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Что нужно изменить, чтобы товар мог принадлежать нескольким категориям?",
      options: ["Добавить класс Category и ассоциацию «многие ко многим» между Product и Category", "Ничего", "Добавить атрибут category2"],
      answer: 0,
      explain: "Многозначная связь выражается ассоциацией с кратностями * с обеих сторон."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Куда логичнее добавить расчёт стоимости заказа?",
      options: ["В Order (метод total()), который суммирует subtotal() позиций", "В Customer", "В Product"],
      answer: 0,
      explain: "Принцип «информационного эксперта»: логика в классе, который владеет данными."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Что должен сделать класс Dog при наследовании от абстрактного Animal?",
      options: ["Реализовать абстрактный метод makeSound()", "Ничего", "Удалить метод"],
      answer: 0,
      explain: "Конкретный потомок обязан реализовать все абстрактные операции."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Можно ли создать объект класса Animal напрямую?",
      options: ["Нет: класс абстрактный", "Да", "Только в Java"],
      answer: 0,
      explain: "Абстрактный класс служит основой для наследования."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Что означает «+getName()» у Animal без курсива?",
      options: ["Конкретный метод с реализацией, который наследуют потомки", "Абстрактный метод", "Статический метод"],
      answer: 0,
      explain: "Только курсив отмечает абстрактные операции."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Почему между Member и Book введён класс Loan?",
      options: ["У связи есть собственные данные (даты), и она многозначная", "Это ошибка", "Для красоты"],
      answer: 0,
      explain: "Класс ассоциации хранит свойства связи и превращается в таблицу."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Что означает «*» у Book при связи с Library?",
      options: ["В библиотеке может быть много книг", "Одна книга", "Нет книг"],
      answer: 0,
      explain: "Кратность * (0..*) допускает любое число."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Что произойдёт с книгами при закрытии библиотеки (агрегация)?",
      options: ["Они продолжат существовать", "Исчезнут", "Станут авторами"],
      answer: 0,
      explain: "Агрегация не означает владения жизненным циклом."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Что нужно сделать, чтобы добавить Telegram-уведомления?",
      options: ["Создать новый класс, реализующий Notifier, не меняя OrderService", "Изменить OrderService", "Удалить интерфейс"],
      answer: 0,
      explain: "Это следствие принципа открытости/закрытости: расширение без изменения."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Почему OrderService не должен создавать EmailNotifier через new?",
      options: ["Это привяжет его к конкретной реализации; лучше передавать Notifier снаружи (внедрение зависимостей)", "Можно", "Это быстрее"],
      answer: 0,
      explain: "Внедрение зависимостей упрощает подмену и тестирование."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Что означает пунктир у зависимости?",
      options: ["Слабая и временная связь по сравнению с ассоциацией", "Сильная связь", "Наследование"],
      answer: 0,
      explain: "Пунктирная стрелка — самая слабая связь между классами."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Можно ли считать связь University — Department агрегацией, а не композицией?",
      options: ["Зависит от предметной области: если кафедра не существует без университета, то композиция", "Всегда агрегация", "Нельзя"],
      answer: 0,
      explain: "Выбор между агрегацией и композицией определяется правилами домена о времени жизни частей."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Что значит кратность 1..* у Department?",
      options: ["В университете минимум одна кафедра", "Ровно одна", "Может не быть"],
      answer: 0,
      explain: "1..* — как минимум один."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Почему OrderStatus лучше типа String?",
      options: ["Допустимы только перечисленные значения, ошибки в написании исключены", "Занимает меньше места", "Нет разницы"],
      answer: 0,
      explain: "Перечисление ограничивает набор значений и делает его самодокументируемым."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Что означает подчёркнутый «count: int»?",
      options: ["Статический атрибут класса Order", "Атрибут экземпляра", "Приватный атрибут"],
      answer: 0,
      explain: "Подчёркивание — static: значение общее для всех объектов."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Что означает «~recalc()»?",
      options: ["Метод с видимостью на уровне пакета", "Публичный метод", "Защищённый метод"],
      answer: 0,
      explain: "Тильда обозначает package-private."
    },
    {
      topic: "CLS",
      cls: "strategy",
      q: "Какую проблему решает паттерн «Стратегия» на этой диаграмме?",
      options: ["Позволяет выбирать алгоритм во время выполнения, не изменяя Context", "Создание объектов", "Доступ к БД"],
      answer: 0,
      explain: "Контекст делегирует работу интерфейсу, а конкретные стратегии подменяются."
    },
    {
      topic: "CLS",
      cls: "strategy",
      q: "Что означает ассоциация со стрелкой от Context к Strategy?",
      options: ["Context хранит ссылку на Strategy", "Strategy хранит ссылку на Context", "Наследование"],
      answer: 0,
      explain: "Атрибут «-strategy: Strategy» реализует эту связь."
    },
    {
      topic: "CLS",
      cls: "observer",
      q: "Что означает двунаправленная независимость Subject и ConcreteObserver в паттерне?",
      options: ["Subject знает лишь интерфейс Observer, а не конкретных наблюдателей", "Subject знает все классы", "Нет связи"],
      answer: 0,
      explain: "Слабая связанность — основная цель паттерна."
    },
    {
      topic: "CLS",
      cls: "observer",
      q: "Какой класс реализует интерфейс Observer?",
      options: ["ConcreteObserver", "ConcreteSubject", "Subject"],
      answer: 0,
      explain: "Реализация обозначена пунктиром с пустым треугольником."
    },
    {
      topic: "CLS",
      cls: "layers",
      q: "Какое направление зависимостей правильное в слоистой архитектуре?",
      options: ["Контроллер → сервис → интерфейс репозитория ← реализация", "Реализация → контроллер", "Репозиторий → контроллер"],
      answer: 0,
      explain: "Зависимости направлены от верхних слоёв к абстракциям нижних."
    },
    {
      topic: "CLS",
      cls: "layers",
      q: "Зачем OrderService зависит от интерфейса OrderRepository, а не от JpaOrderRepository?",
      options: ["Чтобы не привязываться к технологии хранения и упрощать тесты", "Для красоты", "Так принято"],
      answer: 0,
      explain: "Абстракция скрывает деталь и позволяет подменять реализацию."
    },
    {
      topic: "CLS",
      cls: "bad_class",
      q: "Что не так с взаимной композицией Car и Engine?",
      options: ["Каждый не может одновременно владеть другим: часть не может владеть целым; нужна одна композиция", "Всё верно", "Нужна агрегация"],
      answer: 0,
      explain: "Взаимное владение создаёт циклическую зависимость жизненных циклов."
    },
    {
      topic: "CLS",
      cls: "bad_class",
      q: "Что не так с наследованием Employee и Manager в обе стороны?",
      options: ["Циклическое наследование недопустимо: иерархия должна быть ациклична", "Всё верно", "Нужна композиция"],
      answer: 0,
      explain: "Класс не может быть предком самого себя."
    },
    {
      topic: "CLS",
      cls: "bad_class",
      q: "Как правильно связать Employee и Manager?",
      options: ["Manager наследуется от Employee", "Employee наследуется от Manager", "Они независимы"],
      answer: 0,
      explain: "Менеджер является сотрудником: потомок — менеджер, предок — сотрудник."
    },
    {
      topic: "CLS",
      cls: "sym_inherit",
      q: "Что получает Dog от Animal при наследовании?",
      options: ["Доступные члены базового класса (открытые и защищённые), к которым добавляет собственные", "Ничего", "Только имя"],
      answer: 0,
      explain: "Потомок наследует поведение и состояние родителя, за исключением закрытых членов."
    },
    {
      topic: "CLS",
      cls: "sym_realize",
      q: "Что обязан сделать EmailNotifier при реализации интерфейса Notifier?",
      options: ["Реализовать все операции интерфейса, в данном случае send()", "Ничего", "Унаследовать атрибуты"],
      answer: 0,
      explain: "Класс, реализующий интерфейс, обязан предоставить реализации всех его операций."
    },
    {
      topic: "CLS",
      cls: "sym_agg",
      q: "Что произойдёт с Player при расформировании Team (агрегация)?",
      options: ["Игроки продолжат существовать и смогут перейти в другую команду", "Они исчезнут", "Они станут командой"],
      answer: 0,
      explain: "Агрегация не подразумевает владения жизненным циклом."
    },
    {
      topic: "CLS",
      cls: "sym_dep",
      q: "Что изменится, если OrderService начнёт хранить Logger в поле?",
      options: ["Зависимость превратится в ассоциацию: связь станет устойчивой, а не временной", "Ничего", "Станет наследованием"],
      answer: 0,
      explain: "Поле — признак структурной связи (ассоциации)."
    },
    {
      topic: "CLS",
      q: "Что гласит принцип единственной ответственности (SRP)?",
      options: ["У класса должна быть одна причина для изменения", "Класс должен делать всё", "Класс не должен иметь методов"],
      answer: 0,
      explain: "Класс, объединяющий несколько обязанностей, трудно менять и тестировать."
    },
    {
      topic: "CLS",
      q: "Что такое связность (cohesion) класса?",
      options: ["Степень, в которой члены класса относятся к одной задаче: высокая связность — хорошо", "Число связей", "Число методов"],
      answer: 0,
      explain: "Высокая связность упрощает понимание и поддержку. Низкая указывает на «разнородные» обязанности."
    }
);

window.QUESTIONS.advanced.push(
    {
      topic: "CLS",
      q: "В чём суть принципа подстановки Лисков (LSP)?",
      options: ["Объекты подкласса должны безопасно заменять объекты базового класса без нарушения ожиданий клиента", "Подкласс может менять смысл методов", "Базовые классы не нужны"],
      answer: 0,
      explain: "Нарушение LSP: Square наследуется от Rectangle, но ломает ожидание независимости ширины и высоты."
    },
    {
      topic: "CLS",
      q: "Что такое принцип разделения интерфейсов (ISP)?",
      options: ["Клиенты не должны зависеть от методов, которые не используют: лучше несколько узких интерфейсов", "Один большой интерфейс", "Интерфейсы не нужны"],
      answer: 0,
      explain: "Жирные интерфейсы вынуждают реализации и клиентов зависеть от лишнего."
    },
    {
      topic: "CLS",
      q: "Что такое принцип открытости/закрытости (OCP)?",
      options: ["Модули открыты для расширения, но закрыты для изменения", "Класс нельзя расширять", "Класс всегда меняют"],
      answer: 0,
      explain: "Добавление поведения должно происходить через новые классы, а не правку работающего кода."
    },
    {
      topic: "CLS",
      q: "Что такое «божественный объект» (God class)?",
      options: ["Класс с чрезмерным числом обязанностей и связей, знающий и делающий слишком много", "Абстрактный класс", "Интерфейс"],
      answer: 0,
      explain: "Такой класс нарушает SRP, и его трудно тестировать и менять."
    },
    {
      topic: "CLS",
      q: "Что такое циклическая зависимость между классами или пакетами и чем она плоха?",
      options: ["Взаимная зависимость A ↔ B: нельзя использовать, тестировать и собирать части независимо", "Рекурсия", "Нормальная практика"],
      answer: 0,
      explain: "Циклы разрывают введением интерфейса или перемещением общей части."
    },
    {
      topic: "CLS",
      q: "Что такое анемичная модель предметной области?",
      options: ["Классы содержат только данные, а вся логика вынесена в сервисы, что нарушает инкапсуляцию", "Модель без классов", "Модель с интерфейсами"],
      answer: 0,
      explain: "Богатая модель держит поведение рядом с данными."
    },
    {
      topic: "CLS",
      q: "Что такое сущность (entity) и объект-значение (value object) в DDD?",
      options: ["Сущность имеет идентичность и жизненный цикл, объект-значение определяется значениями атрибутов и неизменяем", "Одно и то же", "Тип БД"],
      answer: 0,
      explain: "Деньги, адрес — объекты-значения. Заказ, клиент — сущности."
    },
    {
      topic: "CLS",
      q: "Что такое агрегат (aggregate) в DDD?",
      options: ["Группа связанных объектов с корнем: изменения выполняются через корень, который обеспечивает инварианты", "Агрегация UML", "Таблица"],
      answer: 0,
      explain: "Order с OrderItem — типичный агрегат: внешний код обращается к позициям только через заказ."
    },
    {
      topic: "CLS",
      q: "Зачем репозиторий в DDD представлен интерфейсом в доменном слое?",
      options: ["Домен не должен зависеть от технологии хранения; реализация находится в инфраструктуре", "Для красоты", "Из-за правил языка"],
      answer: 0,
      explain: "Направление зависимостей: инфраструктура → домен, а не наоборот."
    },
    {
      topic: "CLS",
      q: "Что такое гексагональная архитектура (порты и адаптеры)?",
      options: ["Ядро домена окружено портами-интерфейсами, к которым подключаются адаптеры (БД, UI, внешние системы)", "Шестиугольные классы", "Сетевая топология"],
      answer: 0,
      explain: "Зависимости идут внутрь: адаптеры знают порты, а ядро их не знает."
    },
    {
      topic: "CLS",
      q: "Какие есть стратегии отображения наследования в таблицы (ORM)?",
      options: ["Одна таблица на иерархию, таблица на класс с join, таблица на конкретный класс", "Только одна", "Нельзя"],
      answer: 0,
      explain: "Выбор влияет на производительность, null-колонки и сложность запросов."
    },
    {
      topic: "CLS",
      q: "Какой недостаток у стратегии «одна таблица на иерархию»?",
      options: ["Много пустых колонок и слабые ограничения целостности", "Много JOIN", "Нельзя хранить"],
      answer: 0,
      explain: "Зато такие запросы быстрые и без соединений."
    },
    {
      topic: "CLS",
      q: "Что такое проблема N+1 в ORM?",
      options: ["Один запрос списка и N дополнительных запросов на связанные объекты из-за ленивой загрузки", "Ошибка наследования", "Дубли классов"],
      answer: 0,
      explain: "Решение: загрузка связей одним запросом (join fetch, батчи)."
    },
    {
      topic: "CLS",
      q: "Зачем переопределять equals и hashCode у объектов-значений?",
      options: ["Чтобы объекты с одинаковыми значениями считались равными и корректно работали в коллекциях", "Для скорости", "Не нужно"],
      answer: 0,
      explain: "Равенство по значению — суть value object."
    },
    {
      topic: "CLS",
      q: "Что такое DTO и чем он отличается от сущности?",
      options: ["Объект для передачи данных между слоями или системами без бизнес-логики; сущность содержит логику и идентичность", "Одно и то же", "Тип БД"],
      answer: 0,
      explain: "DTO защищает внутреннюю модель от изменений API."
    },
    {
      topic: "CLS",
      q: "Что такое паттерн «Декоратор» и как его показывают на диаграмме?",
      options: ["Класс реализует тот же интерфейс и содержит ссылку на другой объект того же интерфейса, добавляя поведение", "Наследование", "Синглтон"],
      answer: 0,
      explain: "Декоратор гибче наследования: поведение комбинируется во время выполнения."
    },
    {
      topic: "CLS",
      q: "Что такое паттерн «Компоновщик» (Composite) на диаграмме?",
      options: ["Общий интерфейс для листьев и контейнеров, контейнер хранит коллекцию элементов этого интерфейса", "Агрегат", "Фабрика"],
      answer: 0,
      explain: "Позволяет работать с деревом объектов единообразно."
    },
    {
      topic: "CLS",
      q: "Какова основная идея паттерна «Адаптер»?",
      options: ["Приводит интерфейс существующего класса к ожидаемому клиентом без его изменения", "Создаёт объект", "Хранит состояние"],
      answer: 0,
      explain: "Адаптер оборачивает несовместимый класс и реализует нужный интерфейс."
    },
    {
      topic: "CLS",
      q: "Что такое «Фабричный метод»?",
      options: ["Метод, создающий объекты, тип которых определяют подклассы или параметры, скрывая конструктор", "Метод доступа", "Тип данных"],
      answer: 0,
      explain: "Клиент зависит от интерфейса продукта, а не от конкретных классов."
    },
    {
      topic: "CLS",
      q: "Почему Singleton часто считают антипаттерном?",
      options: ["Он скрывает зависимости, усложняет тестирование и создаёт глобальное состояние", "Он медленный", "Он запрещён"],
      answer: 0,
      explain: "Лучше внедрять единственный экземпляр через контейнер зависимостей."
    },
    {
      topic: "CLS",
      q: "Что такое афферентная и эфферентная связанность?",
      options: ["Ca — число внешних классов, зависящих от данного; Ce — число классов, от которых зависит он", "Скорость и память", "Число методов"],
      answer: 0,
      explain: "Метрики показывают устойчивость модуля. Высокая Ca — изменять опасно."
    },
    {
      topic: "CLS",
      q: "Что такое принцип стабильных зависимостей?",
      options: ["Зависеть нужно в сторону более стабильных модулей", "Зависеть от нестабильных", "Не зависеть"],
      answer: 0,
      explain: "Нестабильные модули не должны быть основой для стабильных."
    },
    {
      topic: "CLS",
      q: "Что означает «закон Деметры»?",
      options: ["Объект должен общаться только с ближайшими знакомыми, а не вызывать цепочки a.b().c().d()", "Закон о данных", "Закон наследования"],
      answer: 0,
      explain: "Нарушение создаёт скрытые зависимости от внутренней структуры других объектов."
    },
    {
      topic: "CLS",
      q: "Как избежать иерархий наследования глубиной в 6–7 уровней?",
      options: ["Использовать композицию и интерфейсы, ограничивать глубину наследования", "Добавлять уровни", "Использовать только наследование"],
      answer: 0,
      explain: "Глубокие иерархии хрупки: изменение базового класса ломает много потомков."
    },
    {
      topic: "CLS",
      q: "Что такое инвариант класса?",
      options: ["Условие, которое должно быть истинным для объекта в течение всей его жизни (например, сумма ≥ 0)", "Статический атрибут", "Тип метода"],
      answer: 0,
      explain: "Инкапсуляция и проверки в конструкторе и методах поддерживают инварианты."
    },
    {
      topic: "CLS",
      q: "Как показать инвариант на диаграмме классов?",
      options: ["Ограничением в фигурных скобках или в заметке на языке OCL: {balance >= 0}", "Цветом", "Никак"],
      answer: 0,
      explain: "OCL позволяет формально записывать ограничения для элементов модели."
    },
    {
      topic: "CLS",
      q: "Для чего нужна диаграмма пакетов в дополнение к диаграмме классов?",
      options: ["Показать зависимости между группами классов и контролировать архитектуру на крупном уровне", "Для данных", "Для UI"],
      answer: 0,
      explain: "Пакеты и их зависимости удобно проверять автоматическими тестами архитектуры."
    },
    {
      topic: "CLS",
      q: "Как обеспечить, чтобы код соответствовал диаграмме классов?",
      options: ["Использовать генерацию кода и обратное проектирование или тесты архитектуры, а также ревью изменений модели", "Не обеспечивать", "Хранить диаграмму отдельно"],
      answer: 0,
      explain: "Рассинхронизация модели и кода — основная причина устаревания диаграмм."
    },
    {
      topic: "CLS",
      q: "Что такое иммутабельный (неизменяемый) класс и почему он полезен?",
      options: ["Состояние задаётся при создании и не меняется; безопасен для многопоточности и проще для рассуждений", "Класс без методов", "Статический класс"],
      answer: 0,
      explain: "Иммутабельность исключает побочные эффекты и гонки."
    },
    {
      topic: "CLS",
      cls: "strategy",
      q: "Какой принцип проектирования демонстрирует диаграмма «Стратегия»?",
      options: ["Открытость/закрытость и композиция вместо наследования: поведение подменяется без изменения Context", "Наследование", "Синглтон"],
      answer: 0,
      explain: "Новые алгоритмы добавляют новыми классами, а Context остаётся неизменным."
    },
    {
      topic: "CLS",
      cls: "strategy",
      q: "Что нужно сделать, чтобы добавить третий алгоритм?",
      options: ["Создать ещё один класс, реализующий Strategy", "Изменить Context", "Изменить интерфейс"],
      answer: 0,
      explain: "Интерфейс стабилен, расширение происходит добавлением реализации."
    },
    {
      topic: "CLS",
      cls: "observer",
      q: "Какой риск несёт паттерн «Наблюдатель» при большом числе подписчиков?",
      options: ["Каскад обновлений и утечки памяти из-за неотписанных наблюдателей", "Нет рисков", "Потеря интерфейса"],
      answer: 0,
      explain: "Нужно следить за отпиской и избегать циклических уведомлений."
    },
    {
      topic: "CLS",
      cls: "observer",
      q: "Что произойдёт, если ConcreteObserver в update() изменит ConcreteSubject?",
      options: ["Возможна рекурсия уведомлений и бесконечный цикл: нужно защищаться от повторных вызовов", "Ничего", "Субъект удалится"],
      answer: 0,
      explain: "Циклические обновления — типичная проблема паттерна."
    },
    {
      topic: "CLS",
      cls: "layers",
      q: "Что нарушится, если OrderRepository будет зависеть от OrderController?",
      options: ["Направление зависимостей и слоистость: нижний слой не должен знать о верхнем", "Ничего", "Нужна композиция"],
      answer: 0,
      explain: "Обратные зависимости создают циклы и мешают повторному использованию."
    },
    {
      topic: "CLS",
      cls: "layers",
      q: "Как проверить правила слоёв автоматически?",
      options: ["Тестами архитектуры (например, ArchUnit), запрещающими зависимости не в ту сторону", "Не проверять", "Вручную раз в год"],
      answer: 0,
      explain: "Автоматическая проверка удерживает архитектуру от деградации."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Как защитить инварианты агрегата Order?",
      options: ["Менять позиции только через методы Order, который проверяет правила (например, сумма и количество)", "Открыть список позиций всем", "Не защищать"],
      answer: 0,
      explain: "Корень агрегата — единственная точка входа для изменений."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Почему Order не должен напрямую знать о CardPayment и CashPayment?",
      options: ["Это нарушило бы DIP и OCP: добавление способа оплаты потребовало бы изменения Order", "Это необходимо", "Нет разницы"],
      answer: 0,
      explain: "Order зависит только от интерфейса PaymentMethod."
    },
    {
      topic: "CLS",
      cls: "shop",
      q: "Что потребуется в БД для композиции Order–OrderItem?",
      options: ["Внешний ключ order_id в таблице позиций, часто с каскадным удалением", "Отдельная база", "Ничего"],
      answer: 0,
      explain: "Композиция отображается внешним ключом и каскадом, отражая общий жизненный цикл."
    },
    {
      topic: "CLS",
      cls: "library",
      q: "Как связь «Member — Loan — Book» превратится в таблицы?",
      options: ["Три таблицы: members, books и loans с внешними ключами на обе и атрибутами выдачи", "Одна таблица", "Две таблицы без ключей"],
      answer: 0,
      explain: "Класс ассоциации становится таблицей связи с собственными колонками."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Какой риск несёт добавление метода fly() в Animal ради птиц?",
      options: ["Нарушение LSP: собаки и кошки не умеют летать, и вызов приведёт к ошибке", "Нет риска", "Улучшение"],
      answer: 0,
      explain: "Лучше ввести отдельный интерфейс Flyer или иерархию."
    },
    {
      topic: "CLS",
      cls: "animals",
      q: "Как разделить поведение животных, которые умеют разные вещи?",
      options: ["Интерфейсы по возможностям (Swimmer, Flyer) вместо раздувания базового класса", "Один большой класс", "Удалить наследование"],
      answer: 0,
      explain: "ISP: клиентам нужны узкие интерфейсы."
    },
    {
      topic: "CLS",
      cls: "notify",
      q: "Что даёт интерфейс Notifier при тестировании OrderService?",
      options: ["Можно подставить фиктивную реализацию (mock) и не отправлять реальные письма", "Ничего", "Усложняет"],
      answer: 0,
      explain: "Зависимость от абстракции облегчает юнит-тесты."
    },
    {
      topic: "CLS",
      cls: "university",
      q: "Как реализовать композицию University–Department в коде?",
      options: ["Университет создаёт и владеет кафедрами; снаружи кафедры не создаются и не передаются", "Кафедры создаются снаружи", "Через статические методы"],
      answer: 0,
      explain: "Владение выражается созданием частей внутри целого."
    },
    {
      topic: "CLS",
      cls: "enum_vis",
      q: "Как правильно расширять набор значений перечисления OrderStatus?",
      options: ["Продумать влияние на условные конструкции и сериализацию: новые значения могут сломать клиентов, поэтому нужна обратная совместимость", "Добавлять без проверки", "Заменить строкой"],
      answer: 0,
      explain: "Неизвестное значение перечисления должно обрабатываться безопасно."
    },
    {
      topic: "CLS",
      cls: "bad_class",
      q: "Как исправить циклическую композицию Car и Engine?",
      options: ["Оставить композицию Car◆Engine, а Engine ссылается на Car обычной ассоциацией (если нужно) или вообще не ссылается", "Двойная композиция", "Убрать оба класса"],
      answer: 0,
      explain: "Целое владеет частью, а обратная связь — слабая навигация, если она действительно нужна."
    },
    {
      topic: "CLS",
      cls: "bad_class",
      q: "Какая проверка выявила бы циклическое наследование на этапе проектирования?",
      options: ["Статический анализ модели: иерархия наследования должна быть ациклическим графом", "Нет такой", "Только тесты"],
      answer: 0,
      explain: "Инструменты моделирования валидируют правила метамодели UML."
    },
    {
      topic: "CLS",
      q: "Что означает совет «программируйте на уровне интерфейсов, а не реализаций»?",
      options: ["Клиент должен зависеть от абстракции (интерфейса), чтобы реализации можно было менять без правки клиента", "Использовать только интерфейсы", "Не писать реализации"],
      answer: 0,
      explain: "Зависимость от абстракции снижает связанность и упрощает тестирование и расширение."
    },
    {
      topic: "CLS",
      q: "Чем агрегат в DDD важен для транзакций?",
      options: ["Он задаёт границу согласованности: инварианты проверяются и сохраняются в одной транзакции, а между агрегатами согласованность допускается отложенная", "Агрегат не связан с транзакциями", "Все агрегаты в одной транзакции"],
      answer: 0,
      explain: "Небольшие агрегаты уменьшают конкуренцию и упрощают масштабирование."
    },
    {
      topic: "CLS",
      q: "Как показать на диаграмме зависимость от внешней библиотеки, не загромождая модель?",
      options: ["Отдельным пакетом или классом со стереотипом «external» и зависимостью только от нужных классов", "Рисовать всю библиотеку", "Не показывать никогда"],
      answer: 0,
      explain: "Явная граница внешних зависимостей помогает контролировать связанность с чужим кодом."
    },
    {
      topic: "CLS",
      q: "Почему общая база данных между сервисами считают антипаттерном связывания?",
      options: ["Сервисы зависят от структуры чужих таблиц, и изменение схемы ломает остальных; лучше обмен через API или события", "Это быстрее", "Это стандарт"],
      answer: 0,
      explain: "Владение данными должно быть у одного сервиса. Остальные получают их через контракт."
    }
);
