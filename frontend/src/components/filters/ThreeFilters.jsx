import { Select } from 'antd'
import './ThreeFilters.css'

function ThreeFilters({
  countryValue,
  decadeValue,
  sortValue,
  onCountryChange,
  onDecadeChange,
  onSortChange,
  countryOptions,
  decadeOptions,
  sortOptions,
}) {
  return (
    <div className="three-filtersfilters">
      <Select
        className="three-filtersfilters__select"
        value={countryValue}
        onChange={onCountryChange}
        options={countryOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <Select
        className="three-filtersfilters__select"
        value={decadeValue}
        onChange={onDecadeChange}
        options={decadeOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <Select
        className="three-filtersfilters__select"
        value={sortValue}
        onChange={onSortChange}
        options={sortOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
    </div>
  )
}

export default ThreeFilters