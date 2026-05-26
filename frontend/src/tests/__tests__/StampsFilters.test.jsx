import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import StampsFilters from '../../components/filters/StampsFilters'

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Select: ({ value, options = [], onChange }) => (
      <select
        aria-label="select"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
    Slider: ({ value, onChange, min, max }) => (
      <input
        aria-label="price-slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
    ),
  }
})

describe('StampsFilters', () => {
  const baseProps = {
    countryValue: 'all',
    decadeValue: 'all',
    sortValue: 'name',
    priceLimit: 1500,
    rareOnly: false,
    onCountryChange: vi.fn(),
    onDecadeChange: vi.fn(),
    onSortChange: vi.fn(),
    onPriceChange: vi.fn(),
    onRareToggle: vi.fn(),
    maxPrice: 5000,
    countryOptions: [
      { value: 'all', label: 'Все страны' },
      { value: 'ru', label: 'Россия' },
    ],
    decadeOptions: [
      { value: 'all', label: 'Все годы' },
      { value: '1960', label: '1960-е' },
    ],
    sortOptions: [
      { value: 'name', label: 'По названию' },
      { value: 'price', label: 'По цене' },
    ],
  }

  test('отображает значение цены', () => {
    render(<StampsFilters {...baseProps} />)
    expect(screen.getByText(/Цена до:/i)).toBeInTheDocument()
    expect(screen.getByText('1500 ₽')).toBeInTheDocument()
  })

  test('кнопка редких марок вызывает onRareToggle', async () => {
    const user = userEvent.setup()
    render(<StampsFilters {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /Редкие/i }))

    expect(baseProps.onRareToggle).toHaveBeenCalledTimes(1)
  })

  test('кнопка редких марок скрыта при showRareButton=false', () => {
    render(<StampsFilters {...baseProps} showRareButton={false} />)

    expect(screen.queryByRole('button', { name: /Редкие/i })).not.toBeInTheDocument()
  })

  test('изменение слайдера вызывает onPriceChange', async () => {
    render(<StampsFilters {...baseProps} />)

    fireEvent.change(screen.getByLabelText('price-slider'), {
      target: { value: '2000' },
    })

    expect(baseProps.onPriceChange).toHaveBeenCalled()
  })
})
