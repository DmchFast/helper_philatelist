import { Select } from 'antd'
import './SingleFilter.css'

function SingleFilter({ value, options, onChange, className = '', ariaLabel }) {
  return (
    <div className={`single-filter ${className}`.trim()}>
      <Select
        className="single-filter__select"
        value={value}
        onChange={onChange}
        options={options}
        aria-label={ariaLabel}
        suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
      />
    </div>
  )
}

export default SingleFilter