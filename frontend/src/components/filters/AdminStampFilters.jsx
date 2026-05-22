import { Select, Slider } from 'antd'
import './AdminStampFilters.css'

function AdminStampFilters({
  countryValue,
  yearValue,
  sortValue,
  priceLimit,
  onCountryChange,
  onYearChange,
  onSortChange,
  onPriceChange,
  maxPrice,
  countryOptions,
  yearOptions,
  sortOptions,
}) {
  return (
    <div className="admin-stamp-filters">
      <Select
        className="admin-stamp-filters__select"
        value={countryValue}
        onChange={onCountryChange}
        options={countryOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <Select
        className="admin-stamp-filters__select"
        value={yearValue}
        onChange={onYearChange}
        options={yearOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <Select
        className="admin-stamp-filters__select"
        value={sortValue}
        onChange={onSortChange}
        options={sortOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
    </div>
  )
}

export default AdminStampFilters