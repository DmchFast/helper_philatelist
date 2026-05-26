import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import HeaderBar from '../../components/bars/HeaderBar'
import { useAuth } from '../../components/auth/AuthContext'

vi.mock('../../components/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../components/auth/LoginModal', () => ({
  default: ({ open, onSwitchToRegister, onCancel }) => (
    <div data-testid="login-modal" data-open={open ? 'true' : 'false'}>
      <button type="button" onClick={onSwitchToRegister}>
        switch-to-register
      </button>
      <button type="button" onClick={onCancel}>
        login-cancel
      </button>
    </div>
  ),
}))

vi.mock('../../components/auth/RegisterModal', () => ({
  default: ({ open, onSwitchToLogin, onCancel }) => (
    <div data-testid="register-modal" data-open={open ? 'true' : 'false'}>
      <button type="button" onClick={onSwitchToLogin}>
        switch-to-login
      </button>
      <button type="button" onClick={onCancel}>
        register-cancel
      </button>
    </div>
  ),
}))

vi.mock('../../components/modal/ProfileModal', () => ({
  default: ({ open, onClose }) => (
    <div data-testid="profile-modal" data-open={open ? 'true' : 'false'}>
      <button type="button" onClick={onClose}>
        profile-close
      </button>
    </div>
  ),
}))

describe('HeaderBar', () => {
  beforeEach(() => {
    useAuth.mockReset()
  })

  test('показывает кнопки входа и регистрации для гостя', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    const { unmount } = render(
      <HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />
    )

    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Регистрация/i })).toBeInTheDocument()
  })

  test('клик по Войти открывает LoginModal', async () => {
    const user = userEvent.setup()
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    await user.click(screen.getByRole('button', { name: /Войти/i }))

    expect(screen.getByTestId('login-modal')).toHaveAttribute('data-open', 'true')
  })

  test('клик по Регистрация открывает RegisterModal', async () => {
    const user = userEvent.setup()
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    await user.click(screen.getByRole('button', { name: /Регистрация/i }))

    expect(screen.getByTestId('register-modal')).toHaveAttribute('data-open', 'true')
  })

  test('поиск вызывает onSearchChange', async () => {
    const onSearchChange = vi.fn()
    const user = userEvent.setup()
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    render(
      <HeaderBar searchTerm="" onSearchChange={onSearchChange} placeholder="Поиск" />
    )

    await user.type(screen.getByPlaceholderText('Поиск'), 'марка')

    expect(onSearchChange).toHaveBeenCalledWith('м')
  })

  test('показывает данные пользователя и кнопку выхода', () => {
    const logout = vi.fn()
    useAuth.mockReturnValue({
      user: { name: 'Анна', surname: 'Петрова', role: 'admin' },
      logout,
    })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    expect(screen.getByText('Анна Петрова')).toBeInTheDocument()
    expect(screen.getByText('АДМИНИСТРАТОР')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Выйти/i })).toBeInTheDocument()
  })

  test('кнопка выхода вызывает logout', async () => {
    const logout = vi.fn()
    const user = userEvent.setup()
    useAuth.mockReturnValue({
      user: { name: 'Анна', surname: 'Петрова', role: 'admin' },
      logout,
    })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    await user.click(screen.getByRole('button', { name: /Выйти/i }))

    expect(logout).toHaveBeenCalledTimes(1)
  })

  test('для пользователя без фамилии показывает имя и роль коллекционера', () => {
    useAuth.mockReturnValue({
      user: { name: 'Игорь', role: 'user' },
      logout: vi.fn(),
    })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    expect(screen.getByText('Игорь')).toBeInTheDocument()
    expect(screen.getByText('КОЛЛЕКЦИОНЕР')).toBeInTheDocument()
  })

  test('клик по аватару открывает профиль', async () => {
    const user = userEvent.setup()
    useAuth.mockReturnValue({
      user: { name: 'Анна', surname: 'Петрова', role: 'admin' },
      logout: vi.fn(),
    })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    await user.click(screen.getByText('А'))

    expect(screen.getByTestId('profile-modal')).toHaveAttribute('data-open', 'true')
  })

  test('переключение между логином и регистрацией меняет состояния', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)

    await user.click(screen.getByRole('button', { name: /Войти/i }))
    await user.click(screen.getByText('switch-to-register'))
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByTestId('register-modal')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('login-modal')).toHaveAttribute('data-open', 'false')

    await user.click(screen.getByText('switch-to-login'))
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByTestId('login-modal')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('register-modal')).toHaveAttribute('data-open', 'false')

    vi.useRealTimers()
  })

  test('onCancel и onClose закрывают модалки', async () => {
    const user = userEvent.setup()
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })

    const { unmount } = render(
      <HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />
    )

    await user.click(screen.getByRole('button', { name: /Войти/i }))
    await user.click(screen.getByText('login-cancel'))
    expect(screen.getByTestId('login-modal')).toHaveAttribute('data-open', 'false')

    await user.click(screen.getByRole('button', { name: /Регистрация/i }))
    await user.click(screen.getByText('register-cancel'))
    expect(screen.getByTestId('register-modal')).toHaveAttribute('data-open', 'false')

    unmount()

    useAuth.mockReturnValue({
      user: { name: 'Анна', surname: 'Петрова', role: 'admin' },
      logout: vi.fn(),
    })

    render(<HeaderBar searchTerm="" onSearchChange={vi.fn()} placeholder="Поиск" />)
    await user.click(screen.getByText('А'))
    await user.click(screen.getByText('profile-close'))
    expect(screen.getByTestId('profile-modal')).toHaveAttribute('data-open', 'false')
  })
})
