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
    author: 'Я',
    theme: 'Космос',
    extraCount: '+5',
    tiles: [stamp, stamp, stamp],
    isPublic: true,
  },
  {
    id: 'my-nature',
    title: ['Родная природа'],
    badge: '5 марок',
    author: 'Я',
    theme: 'Природа',
    extraCount: '+2',
    tiles: [stamp, stamp, stamp],
    isPublic: false,
  },
  {
    id: 'my-sport',
    title: ['Спорт'],
    badge: '3 марки',
    author: 'Я',
    theme: 'Спорт',
    extraCount: '+0',
    tiles: [stamp, stamp, stamp],
    isPublic: true,
  },
]