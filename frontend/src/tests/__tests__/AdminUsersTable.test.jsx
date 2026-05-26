import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AdminUsersTable from '../../components/tables/AdminUsersTable'

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Select: ({ value, options = [], onChange }) => (
      <select
        data-testid="role-select"
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
  }
})

describe('AdminUsersTable', () => {
  const baseUser = {
    id: 'u-1',
    name: 'Анна',
    surname: 'Петрова',
    email: 'anna@test.ru',
    city: 'Москва',
    country: 'Россия',
    role: 'collector',
  }

  test('показывает состояние пустого списка', () => {
    render(<AdminUsersTable users={[]} />)
    expect(screen.getByText(/Пользователи не найдены/i)).toBeInTheDocument()
  })

  test('рендерит данные пользователя', () => {
    render(<AdminUsersTable users={[baseUser]} />)

    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.getByText('Москва, Россия')).toBeInTheDocument()
    expect(screen.getByText('anna@test.ru')).toBeInTheDocument()
  })

  test('смена роли вызывает onRoleChange', () => {
    const onRoleChange = vi.fn()
    render(<AdminUsersTable users={[baseUser]} onRoleChange={onRoleChange} />)

    fireEvent.change(screen.getByTestId('role-select'), {
      target: { value: 'admin' },
    })

    expect(onRoleChange).toHaveBeenCalledWith(baseUser, 'admin')
  })

  test('удаление пользователя вызывает onDeleteUser', () => {
    const onDeleteUser = vi.fn()
    render(<AdminUsersTable users={[baseUser]} onDeleteUser={onDeleteUser} />)

    fireEvent.click(screen.getByRole('button', { name: /Удалить пользователя/i }))

    expect(onDeleteUser).toHaveBeenCalledWith(baseUser)
  })

  test('без города не показывает запятую и подставляет ? для аватара', () => {
    const user = { ...baseUser, id: 'u-2', name: '', city: '', country: 'Россия' }
    render(<AdminUsersTable users={[user]} />)

    expect(screen.getByText('Россия')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })
})
