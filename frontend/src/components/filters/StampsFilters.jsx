import { Select, Slider } from 'antd'
import './StampsFilters.css'

function StampsFilters({
  countryValue,
  yearValue,
  sortValue,
  priceLimit,
  rareOnly,
  onCountryChange,
  onYearChange,
  onSortChange,
  onPriceChange,
  onRareToggle,
  maxPrice,
  countryOptions,
  yearOptions,
  sortOptions,
}) {
  return (
    <div className="stamps-filters">
      <Select
        className="stamps-filters__select"
        value={countryValue}
        onChange={onCountryChange}
        options={countryOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <Select
        className="stamps-filters__select"
        value={yearValue}
        onChange={onYearChange}
        options={yearOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <div className="stamps-filters__price-control">
        <span className="stamps-filters__price-label">Цена до:</span>
        <Slider
          className="stamps-filters__price-slider"
          min={0}
          max={maxPrice}
          value={priceLimit}
          onChange={onPriceChange}
          tooltip={{ open: false }}
        />
        <span className="stamps-filters__price-value">{priceLimit} ₽</span>
      </div>
      <Select
        className="stamps-filters__select"
        value={sortValue}
        onChange={onSortChange}
        options={sortOptions}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
      <button
        type="button"
        className={`stamps-filters__rare-btn${rareOnly ? ' is-active' : ''}`}
        onClick={onRareToggle}
      >
        Редкие
      </button>
    </div>
  )
}

export default StampsFilters