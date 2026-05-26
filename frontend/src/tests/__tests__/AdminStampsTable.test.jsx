import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AdminStampsTable from '../../components/tables/AdminStampsTable'

vi.mock('../../components/modal/EditStampModal', () => ({
  default: ({ open, onSave }) =>
    open ? (
      <button type="button" onClick={() => onSave?.({ id: 's-1', title: 'Обновлено' })}>
        mock-edit-save
      </button>
    ) : null,
}))

vi.mock('../../components/modal/DeleteConfirmModal', () => ({
  default: ({ open, onConfirm }) =>
    open ? (
      <button type="button" onClick={() => onConfirm?.()}>
        mock-delete-confirm
      </button>
    ) : null,
}))

describe('AdminStampsTable', () => {
  const stamp = {
    id: 's-1',
    title: 'Восток-1',
    country: 'СССР',
    series: 'Космос',
    year: '1961',
    image: 'https://example.com/stamp.jpg',
  }

  test('показывает состояние пустого списка', () => {
    render(<AdminStampsTable stamps={[]} />)
    expect(screen.getByText(/Марки не найдены/i)).toBeInTheDocument()
  })

  test('рендерит строку марки', () => {
    render(<AdminStampsTable stamps={[stamp]} />)

    expect(screen.getByText('Восток-1')).toBeInTheDocument()
    expect(screen.getByText('СССР')).toBeInTheDocument()
    expect(screen.getByText('Космос')).toBeInTheDocument()
    expect(screen.getByText('1961')).toBeInTheDocument()
  })

  test('сохранение из модалки вызывает onEditStamp', async () => {
    const onEditStamp = vi.fn()
    const user = userEvent.setup()

    render(<AdminStampsTable stamps={[stamp]} onEditStamp={onEditStamp} />)

    await user.click(screen.getByRole('button', { name: /Редактировать/i }))
    await user.click(screen.getByText('mock-edit-save'))

    expect(onEditStamp).toHaveBeenCalledWith({ id: 's-1', title: 'Обновлено' })
  })

  test('подтверждение удаления вызывает onDeleteStamp', async () => {
    const onDeleteStamp = vi.fn()
    const user = userEvent.setup()

    render(<AdminStampsTable stamps={[stamp]} onDeleteStamp={onDeleteStamp} />)

    await user.click(screen.getByRole('button', { name: /Удалить/i }))
    await user.click(screen.getByText('mock-delete-confirm'))

    expect(onDeleteStamp).toHaveBeenCalledWith('s-1')
  })

  test('удаление без onDeleteStamp не падает', async () => {
    const user = userEvent.setup()

    render(<AdminStampsTable stamps={[stamp]} />)

    await user.click(screen.getByRole('button', { name: /Удалить/i }))
    await user.click(screen.getByText('mock-delete-confirm'))
  })

  test('если у марки нет изображения, используется дефолтное', () => {
    render(<AdminStampsTable stamps={[{ ...stamp, image: '' }]} />)

    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBeTruthy()
  })
})
