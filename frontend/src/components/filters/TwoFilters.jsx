import { Select } from 'antd'
import './TwoFilters.css'

function TwoFilters({
   firstValue,
   secondValue,
   firstOptions,
   secondOptions,
   onFirstChange,
   onSecondChange,
}) {
   return (
      <div className="two-filters">
         <Select
            className="two-filter"
            value={firstValue}
            onChange={onFirstChange}
            options={firstOptions}
            suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
         />
         <Select
            className="two-filter"
            value={secondValue}
            onChange={onSecondChange}
            options={secondOptions}
            suffixIcon={<span className="material-symbols-outlined">expand_more</span>}
         />
      </div>
   )
}

export default TwoFilters