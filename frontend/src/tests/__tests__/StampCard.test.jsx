import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import StampCard from '../../components/cards/StampCard'
import { useAuth } from '../../components/auth/AuthContext'

vi.mock('../../components/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('StampCard', () => {
  const stamp = {
    id: 's-1',
    title: 'Восток-1',
    series: 'Космос',
    year: '1961',
    country: 'СССР',
    image: 'https://example.com/stamp.jpg',
  }

  beforeEach(() => {
    useAuth.mockReset()
  })

  test('показывает кнопку добавления для авторизованного пользователя', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    useAuth.mockReturnValue({ user: { role: 'user', name: 'Анна' } })

    render(<StampCard stamp={stamp} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /Добавить Восток-1/i }))

    expect(onAdd).toHaveBeenCalledWith(stamp)
  })

  test('скрывает кнопку добавления для неавторизованного', () => {
    useAuth.mockReturnValue({ user: null })

    render(<StampCard stamp={stamp} onAdd={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /Добавить/i })).not.toBeInTheDocument()
    expect(screen.getByRole('article')).toHaveClass('stamp-card--no-button')
  })

  test('использует фото из stamp.photo при наличии', () => {
    useAuth.mockReturnValue({ user: { role: 'admin', name: 'Игорь' } })

    render(
      <StampCard
        stamp={{ ...stamp, photo: 'https://example.com/photo.jpg' }}
        onAdd={vi.fn()}
      />
    )

    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      'https://example.com/photo.jpg'
    )
  })

  test('отображает основные метаданные', () => {
    useAuth.mockReturnValue({ user: { role: 'admin', name: 'Игорь' } })

    render(<StampCard stamp={stamp} onAdd={vi.fn()} />)

    expect(screen.getByText(/Серия: Космос/i)).toBeInTheDocument()
    expect(screen.getByText(/Год: 1961/i)).toBeInTheDocument()
    expect(screen.getByText(/Страна: СССР/i)).toBeInTheDocument()
  })
})
