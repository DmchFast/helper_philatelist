import stamp from '../assets/default-stamp.png'

const createStamp = (id, title, series, year, price, extra = {}) => ({
  id,
  title,
  series,
  year,
  country: 'СССР',
  image: stamp,
  price,
  priceHistory: [
    { date: '01.04.2026', value: price - 150 },
    { date: '15.04.2026', value: price - 40 },
    { date: '01.05.2026', value: price },
  ],
  ...extra,
})

export const albums = [
  {
    id: 'my-space',
    title: ['Космическая коллекция'],
    badge: '8 марок',
    author: 'Администратор',
    ownerName: 'Администратор',
    theme: 'Космос',
    extraCount: '+5',
    tiles: [stamp, stamp, stamp],
    isPublic: true,
    stamps: [
      createStamp('my-space-1', 'Гагарин', 'Первый полёт', '1961', 4800, {
        rarity: 'Уникальная',
        description: 'Марка с портретом Юрия Гагарина.',
      }),
      createStamp('my-space-2', 'Спутник', 'Космическая гонка', '1957', 2300, {
        rarity: 'Редкая',
        description: 'Первый искусственный спутник Земли.',
      }),
      createStamp('my-space-3', 'Луноход', 'Лунная программа', '1970', 1600, {
        rarity: 'Коллекционная',
        description: 'Советский луноход на поверхности Луны.',
      }),
    ],
  },
  {
    id: 'my-nature',
    title: ['Родная природа'],
    badge: '5 марок',
    author: 'Администратор',
    ownerName: 'Администратор',
    theme: 'Природа',
    extraCount: '+2',
    tiles: [stamp, stamp, stamp],
    isPublic: false,
    stamps: [
      createStamp('my-nature-1', 'Байкал', 'Озёра СССР', '1978', 950, {
        rarity: 'Коллекционная',
        description: 'Живописный вид озера Байкал.',
      }),
      createStamp('my-nature-2', 'Кедр', 'Деревья', '1982', 720, {
        rarity: 'Обычная',
        description: 'Сибирский кедр на фоне гор.',
      }),
      createStamp('my-nature-3', 'Амурский тигр', 'Фауна', '1985', 1100, {
        rarity: 'Редкая',
        description: 'Редкий хищник дальневосточной тайги.',
      }),
    ],
  },
  {
    id: 'my-sport',
    title: ['Спорт'],
    badge: '3 марки',
    author: 'Администратор',
    ownerName: 'Администратор',
    theme: 'Спорт',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
    isPublic: true,
    stamps: [
      createStamp('my-sport-1', 'Олимпиада-80', 'Московская олимпиада', '1980', 1400, {
        rarity: 'Коллекционная',
        description: 'Символика летних Олимпийских игр 1980 года.',
      }),
      createStamp('my-sport-2', 'Хоккей', 'Зимние виды', '1975', 890, {
        rarity: 'Обычная',
        description: 'Советские хоккеисты на льду.',
      }),
      createStamp('my-sport-3', 'Футбол', 'Чемпионат мира', '1966', 1250, {
        rarity: 'Редкая',
        description: 'Марка, посвящённая чемпионату мира по футболу.',
      }),
    ],
  },
]