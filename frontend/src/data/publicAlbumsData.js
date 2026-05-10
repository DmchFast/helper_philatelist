import stamp from '../assets/default-stamp.png'

export const albums = [
  {
    id: 'space-ussr',
    title: ['Космос СССР'],
    badge: '15 марок',
    author: 'Серов Михаил',
    theme: 'Космос',
    extraCount: '+12',
    tiles: [stamp, stamp, stamp],
  },
  {
    id: 'nature',
    title: ['Природа'],
    badge: '3 марки',
    author: 'Сидельников Иван',
    theme: 'Природа',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
  },
  {
    id: 'imperial',
    title: ['Имперская', 'классика'],
    badge: '13 марок',
    author: 'Ратасеп Матвей',
    theme: 'Классика',
    extraCount: '+10',
    tiles: [stamp, stamp, stamp],
  },
  {
    id: 'art',
    title: ['Шедевры', 'Искусства'],
    badge: '3 марки',
    author: 'Демченков Алексей',
    theme: 'Искусство',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
  },
  {
    id: 'flora-fauna',
    title: ['Флора и Фауна'],
    badge: '2 марки',
    author: 'Д Дмитрий',
    theme: 'Флора',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
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
