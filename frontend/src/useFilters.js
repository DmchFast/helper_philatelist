import { useMemo } from 'react'

export const SORT_OPTIONS = {
  TITLE_ASC: 'По названию',
  YEAR_ASC: 'По году ↗️',
  YEAR_DESC: 'По году ↘️',
  PRICE_ASC: 'По цене ↗️',
  PRICE_DESC: 'По цене ↘️',
}

export const SORT_OPTIONS_LIST_NO_PRICE = [
  { value: SORT_OPTIONS.TITLE_ASC, label: 'По названию' },
  { value: SORT_OPTIONS.YEAR_ASC, label: 'По году ↗️' },
  { value: SORT_OPTIONS.YEAR_DESC, label: 'По году ↘️' },
]

export const SORT_OPTIONS_LIST = [
  { value: SORT_OPTIONS.TITLE_ASC, label: 'По названию' },
  { value: SORT_OPTIONS.YEAR_ASC, label: 'По году ↗️' },
  { value: SORT_OPTIONS.YEAR_DESC, label: 'По году ↘️' },
  { value: SORT_OPTIONS.PRICE_ASC, label: 'По цене ↗️' },
  { value: SORT_OPTIONS.PRICE_DESC, label: 'По цене ↘️' },
]

export const sortStamps = (stamps, sortValue) => {
  const sorted = [...stamps]
  switch (sortValue) {
    case SORT_OPTIONS.TITLE_ASC:
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case SORT_OPTIONS.YEAR_ASC:
      return sorted.sort((a, b) => Number(a.year) - Number(b.year))
    case SORT_OPTIONS.YEAR_DESC:
      return sorted.sort((a, b) => Number(b.year) - Number(a.year))
    case SORT_OPTIONS.PRICE_ASC:
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    case SORT_OPTIONS.PRICE_DESC:
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    default:
      return sorted
  }
}

export const filterRare = (stamps, rareOnly) => {
  if (!rareOnly) return stamps
  return stamps.filter(stamp => (stamp.price || 0) >= 1000)
}

export const getUniqueCountries = (stamps) => {
  const countries = stamps.map(s => s.country).filter(Boolean)
  return ['Все страны', ...new Set(countries)]
}

// ---- Десятилетия ----
export const getUniqueDecades = (stamps) => {
  const decadesSet = new Set()
  stamps.forEach(stamp => {
    const year = stamp.year
    if (year && !isNaN(Number(year))) {
      const decadeStart = Math.floor(Number(year) / 10) * 10
      decadesSet.add(decadeStart)
    }
  })
  const sortedDecades = Array.from(decadesSet).sort((a, b) => b - a) // от новых к старым
  const options = sortedDecades.map(decade => ({
    value: String(decade),
    label: `${decade}-е`
  }))
  return [{ value: 'Все года', label: 'Все года' }, ...options]
}

const isYearInDecade = (year, decadeValue) => {
  if (decadeValue === 'Все года') return true
  const decadeStart = Number(decadeValue)
  const yearNum = Number(year)
  return yearNum >= decadeStart && yearNum <= decadeStart + 9
}

// Хук фильтрации с десятилетиями
export const useStampFilters = (
  stamps,
  searchTerm,
  country,
  decade,      // ← теперь десятилетие
  sort,
  priceLimit,
  rareOnly
) => {
  return useMemo(() => {
    let filtered = stamps.filter(stamp => {
      const searchMatch = stamp.title.toLowerCase().includes(searchTerm.toLowerCase())
      const countryMatch = country === 'Все страны' || stamp.country === country
      const decadeMatch = isYearInDecade(stamp.year, decade)
      const priceMatch = priceLimit ? (stamp.price || 0) <= priceLimit : true
      return searchMatch && countryMatch && decadeMatch && priceMatch
    })
    filtered = filterRare(filtered, rareOnly)
    filtered = sortStamps(filtered, sort)
    return filtered
  }, [stamps, searchTerm, country, decade, sort, priceLimit, rareOnly])
}

// Функции для альбомов (без изменений)
export const SORT_ALBUM_OPTIONS = { TITLE_ASC: 'По названию' }
export const SORT_ALBUM_LIST = [{ value: SORT_ALBUM_OPTIONS.TITLE_ASC, label: 'По названию' }]
export const sortAlbums = (albums, sortValue) => {
  const sorted = [...albums]
  if (sortValue === SORT_ALBUM_OPTIONS.TITLE_ASC) {
    return sorted.sort((a, b) => a.title.join(' ').localeCompare(b.title.join(' ')))
  }
  return sorted
}
export const getUniqueAlbumAuthors = (albums) => {
  const authors = albums.map(a => a.ownerName || a.author).filter(Boolean)
  return ['Все авторы', ...new Set(authors)]
}
export const getUniqueAlbumThemes = (albums) => {
  const themes = albums.map(a => a.theme).filter(Boolean)
  return ['Все темы', ...new Set(themes)]
}