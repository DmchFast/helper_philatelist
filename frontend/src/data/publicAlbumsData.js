import stamp from '../assets/default-stamp.png'

const createHistory = (price) => [
  { date: '01.04.2026', value: price - 150 },
  { date: '15.04.2026', value: price - 40 },
  { date: '01.05.2026', value: price },
]

const createStamp = (id, title, series, year, price, extra = {}) => ({
  id,
  title,
  series,
  year,
  country: 'СССР',
  image: stamp,
  price,
  priceHistory: createHistory(price),
  ...extra,
})

export const albums = [
  {
    id: 'space-ussr',
    title: ['Космос СССР'],
    badge: '15 марок',
    author: 'Серов Михаил',
    ownerName: 'Серов Михаил',
    theme: 'Космос',
    extraCount: '+12',
    tiles: [stamp, stamp, stamp],
    stamps: [
      createStamp('space-1', 'Спутник-1', 'Первые полёты', '1957', 1280, {
        rarity: 'Редкая',
        description: 'Марка к запуску первого искусственного спутника Земли.',
      }),
      createStamp('space-2', 'Восток-1', 'Первые полёты', '1961', 1540, {
        rarity: 'Особая',
        description: 'Посвящена первому пилотируемому полёту человека в космос.',
      }),
      createStamp('space-3', 'Луна-9', 'Космическая программа', '1966', 1190, {
        rarity: 'Коллекционная',
        description: 'Марка о первой мягкой посадке на поверхность Луны.',
      }),
      createStamp('space-4', 'Байконур', 'Космическая программа', '1965', 990, {
        rarity: 'Редкая',
        description: 'Тематическая марка о космодроме Байконур.',
      }),
    ],
  },
  {
    id: 'nature',
    title: ['Природа'],
    badge: '3 марки',
    author: 'Сидельников Иван',
    ownerName: 'Сидельников Иван',
    theme: 'Природа',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
    stamps: [
      createStamp('nature-1', 'Еловый лес', 'Леса СССР', '1968', 860, {
        rarity: 'Коллекционная',
        description: 'Тема хвойных лесов и северной природы.',
      }),
      createStamp('nature-2', 'Белый медведь', 'Фауна севера', '1972', 930, {
        rarity: 'Редкая',
        description: 'Марка с северной фауной и арктическим сюжетом.',
      }),
      createStamp('nature-3', 'Горная река', 'Ландшафты', '1975', 780, {
        rarity: 'Обычная',
        description: 'Пейзажная марка с водной темой.',
      }),
    ],
  },
  {
    id: 'imperial',
    title: ['Имперская', 'классика'],
    badge: '13 марок',
    author: 'Ратасеп Матвей',
    ownerName: 'Ратасеп Матвей',
    theme: 'Классика',
    extraCount: '+10',
    tiles: [stamp, stamp, stamp],
    stamps: [
      createStamp('imperial-1', 'Николай II', 'Императорская Россия', '1913', 2890, {
        rarity: 'Уникальная',
        description: 'Ранний выпуск с портретной композицией и глубокой печатью.',
      }),
      createStamp('imperial-2', 'Почтовый герб', 'Императорская Россия', '1909', 2440, {
        rarity: 'Редкая',
        description: 'Классический знак дореволюционной почты.',
      }),
      createStamp('imperial-3', 'Государственный орёл', 'Императорская Россия', '1911', 2680, {
        rarity: 'Редкая',
        description: 'Тематический выпуск с государственным символом.',
      }),
    ],
  },
  {
    id: 'art',
    title: ['Шедевры', 'Искусства'],
    badge: '3 марки',
    author: 'Демченков Алексей',
    ownerName: 'Демченков Алексей',
    theme: 'Искусство',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
    stamps: [
      createStamp('art-1', 'Айвазовский', 'Русская живопись', '1966', 1420, {
        rarity: 'Коллекционная',
        description: 'Марка из серии о русской живописи и морских пейзажах.',
      }),
      createStamp('art-2', 'Эрмитаж', 'Музеи СССР', '1964', 1600, {
        rarity: 'Редкая',
        description: 'Выпуск, посвящённый одному из главных музеев страны.',
      }),
      createStamp('art-3', 'Театр', 'Культурное наследие', '1970', 1210, {
        rarity: 'Обычная',
        description: 'Тематическая марка о сценическом искусстве.',
      }),
    ],
  },
  {
    id: 'flora-fauna',
    title: ['Флора и Фауна'],
    badge: '2 марки',
    author: 'Д Дмитрий',
    ownerName: 'Д Дмитрий',
    theme: 'Флора',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
    stamps: [
      createStamp('flora-1', 'Лилия', 'Цветы СССР', '1971', 740, {
        rarity: 'Обычная',
        description: 'Нежный ботанический сюжет с цветочным мотивом.',
      }),
      createStamp('flora-2', 'Олень', 'Фауна СССР', '1973', 980, {
        rarity: 'Коллекционная',
        description: 'Марка с характерным северным животным.',
      }),
      createStamp('flora-3', 'Пион', 'Цветы СССР', '1974', 820, {
        rarity: 'Обычная',
        description: 'Цветочный выпуск с мягкой декоративной подачей.',
      }),
    ],
  },
]

export const authorOptions = [
  { value: 'Все авторы', label: 'Все авторы' },
  { value: 'Серов Михаил', label: 'Серов Михаил' },
  { value: 'Сидельников Иван', label: 'Сидельников Иван' },
  { value: 'Ратасеп Матвей', label: 'Ратасеп Матвей' },
  { value: 'Демченков Алексей', label: 'Демченков Алексей' },
  { value: 'Д Дмитрий', label: 'Д Дмитрий' },
]

export const themeOptions = [
  { value: 'Все темы', label: 'Все темы' },
  { value: 'Космос', label: 'Космос' },
  { value: 'Природа', label: 'Природа' },
  { value: 'Классика', label: 'Классика' },
  { value: 'Искусство', label: 'Искусство' },
  { value: 'Флора', label: 'Флора' },
]
