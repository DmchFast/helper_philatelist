import stamp from '../assets/default-stamp.png'

export const navItems = [
  { id: 'catalog', label: 'Каталог', icon: 'menu_book' },
  { id: 'collection', label: 'Коллекция', icon: 'collections_bookmark' },
  { id: 'my', label: 'Моя коллекция', icon: 'photo_album' },
  { id: 'users', label: 'Пользователи', icon: 'group' },
  { id: 'admin', label: 'Администрирование', icon: 'admin_panel_settings' },
]

export const stamps = [
  {
    id: '1',
    title: 'Слава труду!',
    series: 'Трудовые будни',
    year: '1958',
    country: 'ГДР',
    image: stamp,
  },
  {
    id: '2',
    title: 'Олимпийские игры',
    series: 'Москва-80',
    year: '1980',
    country: 'СССР',
    image: stamp,
  },
  {
    id: '3',
    title: 'Покорение космоса',
    series: 'Первый полет',
    year: '1980',
    country: 'СССР',
    image: stamp,
  },
  {
    id: '4',
    title: 'Животные Арктики',
    series: 'Фауна севера',
    year: '1980',
    country: 'СССР',
    image: stamp,
  },
  {
    id: '5',
    title: 'Шедевры Эрмитажа',
    series: 'Русское искусство',
    year: '1966',
    country: 'СССР',
    image: stamp,
  },
  {
    id: '6',
    title: 'Победа!',
    series: 'Победа',
    year: '1945',
    country: 'CCCР',
    image: stamp,
  },

]


export const countryOptions = [
  { value: 'Все страны', label: 'Все страны' },
  { value: 'СССР', label: 'СССР' },
]

export const sortOptions = [
  { value: 'По названию', label: 'По названию' },
]
