import { renderHook } from '@testing-library/react'
import {
  sortStamps,
  filterRare,
  getUniqueDecades,
  getUniqueCountries,
  SORT_OPTIONS,
  useStampFilters,
  sortAlbums,
  SORT_ALBUM_OPTIONS,
  getUniqueAlbumAuthors,
  getUniqueAlbumThemes,
} from '../../useFilters';

const mockStamps = [
  { id: 1, title: 'Байкал', year: '1978', price: 950 },
  { id: 2, title: 'Гагарин', year: '1961', price: 4800 },
  { id: 3, title: 'Спутник', year: '1957', price: 2300 },
];

describe('sortStamps', () => {
  test('сортировка по названию (А-Я)', () => {
    const sorted = sortStamps(mockStamps, 'По названию');
    expect(sorted.map(s => s.title)).toEqual(['Байкал', 'Гагарин', 'Спутник']);
  });

  test('сортировка по году по возрастанию', () => {
    const sorted = sortStamps(mockStamps, 'По году ↗️');
    expect(sorted.map(s => s.year)).toEqual(['1957', '1961', '1978']);
  });

  test('сортировка по цене по убыванию', () => {
    const sorted = sortStamps(mockStamps, 'По цене ↘️');
    expect(sorted.map(s => s.price)).toEqual([4800, 2300, 950]);
  });

  test('сортировка по году по убыванию', () => {
    const sorted = sortStamps(mockStamps, 'По году ↘️');
    expect(sorted.map(s => s.year)).toEqual(['1978', '1961', '1957']);
  });

  test('сортировка по цене по возрастанию', () => {
    const sorted = sortStamps(mockStamps, 'По цене ↗️');
    expect(sorted.map(s => s.price)).toEqual([950, 2300, 4800]);
  });

  test('неизвестный режим сортировки возвращает исходный порядок', () => {
    const sorted = sortStamps(mockStamps, 'Неизвестно');
    expect(sorted.map(s => s.id)).toEqual([1, 2, 3]);
  });
});

describe('filterRare', () => {
  test('возвращает только марки с ценой >= 1000', () => {
    const rare = filterRare(mockStamps, true);
    expect(rare).toHaveLength(2);
    expect(rare.map(s => s.title)).toEqual(['Гагарин', 'Спутник']);
  });

  test('при rareOnly=false возвращает все марки', () => {
    const all = filterRare(mockStamps, false);
    expect(all).toHaveLength(3);
  });

  test('игнорирует марки без цены', () => {
    const stamps = [...mockStamps, { id: 4, title: 'Без цены' }];
    const rare = filterRare(stamps, true);
    expect(rare.map(s => s.title)).not.toContain('Без цены');
  });
});

describe('getUniqueDecades', () => {
  test('извлекает уникальные десятилетия и сортирует по убыванию', () => {
    const stamps = [{ year: '1961' }, { year: '1957' }, { year: '1978' }, { year: '1965' }];
    const decades = getUniqueDecades(stamps);
    expect(decades).toEqual([
      { value: 'Все года', label: 'Все года' },
      { value: '1970', label: '1970-е' },
      { value: '1960', label: '1960-е' },
      { value: '1950', label: '1950-е' },
    ]);
  });

  test('пропускает некорректные значения года', () => {
    const stamps = [{ year: '1961' }, { year: 'N/A' }, { year: '' }, {}];
    const decades = getUniqueDecades(stamps);
    expect(decades).toEqual([
      { value: 'Все года', label: 'Все года' },
      { value: '1960', label: '1960-е' },
    ]);
  });
});

describe('getUniqueCountries', () => {
  test('возвращает список уникальных стран', () => {
    const stamps = [
      { country: 'СССР' },
      { country: 'Россия' },
      { country: 'СССР' },
      { country: '' },
    ];
    expect(getUniqueCountries(stamps)).toEqual(['Все страны', 'СССР', 'Россия']);
  });
});

describe('useStampFilters', () => {
  const stamps = [
    { id: 1, title: 'Байкал', year: '1978', price: 950, country: 'СССР' },
    { id: 2, title: 'Гагарин', year: '1961', price: 4800, country: 'СССР' },
    { id: 3, title: 'Apollo', year: '1969', price: 2300, country: 'США' },
  ];

  test('фильтрует по поиску, стране, десятилетию и цене', () => {
    const { result } = renderHook(() =>
      useStampFilters(
        stamps,
        'га',
        'СССР',
        '1960',
        SORT_OPTIONS.TITLE_ASC,
        5000,
        false
      )
    );

    expect(result.current.map(s => s.title)).toEqual(['Гагарин']);
  });

  test('учитывает фильтр редких марок', () => {
    const { result } = renderHook(() =>
      useStampFilters(
        stamps,
        '',
        'Все страны',
        'Все года',
        SORT_OPTIONS.PRICE_DESC,
        5000,
        true
      )
    );

    expect(result.current.map(s => s.title)).toEqual(['Гагарин', 'Apollo']);
  });

  test('priceLimit=0 не ограничивает результаты', () => {
    const { result } = renderHook(() =>
      useStampFilters(
        stamps,
        '',
        'Все страны',
        'Все года',
        SORT_OPTIONS.TITLE_ASC,
        0,
        false
      )
    );

    expect(result.current).toHaveLength(3);
  });
});

describe('album helpers', () => {
  const albums = [
    { id: 1, title: ['Космос'], ownerName: 'Анна', theme: 'СССР' },
    { id: 2, title: ['Марки', 'Европы'], author: 'Иван', theme: 'Европа' },
    { id: 3, title: ['Коллекция'], ownerName: 'Анна', theme: '' },
  ];

  test('sortAlbums сортирует по названию', () => {
    const sorted = sortAlbums(albums, SORT_ALBUM_OPTIONS.TITLE_ASC);
    expect(sorted.map(a => a.id)).toEqual([3, 1, 2]);
  });

  test('sortAlbums возвращает исходный порядок при неизвестном фильтре', () => {
    const sorted = sortAlbums(albums, 'other');
    expect(sorted.map(a => a.id)).toEqual([1, 2, 3]);
  });

  test('getUniqueAlbumAuthors возвращает уникальных авторов', () => {
    expect(getUniqueAlbumAuthors(albums)).toEqual(['Все авторы', 'Анна', 'Иван']);
  });

  test('getUniqueAlbumThemes возвращает уникальные темы', () => {
    expect(getUniqueAlbumThemes(albums)).toEqual(['Все темы', 'СССР', 'Европа']);
  });
});