import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteConfirmModal from '../../components/modal/DeleteConfirmModal'

describe('DeleteConfirmModal', () => {
  test('нажатие Удалить вызывает onConfirm', async () => {
    const onConfirm = jest.fn()
    const user = userEvent.setup()

    render(
      <DeleteConfirmModal
        open={true}
        onCancel={jest.fn()}
        onConfirm={onConfirm}
        title="альбом"
      />
    )

    await user.click(screen.getByRole('button', { name: /Удалить/i }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  test('отображает заголовок подтверждения', () => {
    render(
      <DeleteConfirmModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} />
    )

    expect(screen.getByText(/Подтверждение удаления/i)).toBeInTheDocument()
  })

  test('отображает кнопку удаления', () => {
    render(
      <DeleteConfirmModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} />
    )

    expect(screen.getByRole('button', { name: /Удалить/i })).toBeInTheDocument()
  })

  test('использует дефолтный title в сообщении', () => {
    render(
      <DeleteConfirmModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} />
    )

    expect(screen.getByText(/удалить Удаление/i)).toBeInTheDocument()
  })

  test('использует кастомный title в сообщении', () => {
    render(
      <DeleteConfirmModal
        open={true}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        title="альбом"
      />
    )

    expect(screen.getByText(/удалить альбом/i)).toBeInTheDocument()
  })

  test('нажатие на крестик вызывает onCancel', async () => {
    const onCancel = jest.fn()
    const user = userEvent.setup()

    render(<DeleteConfirmModal open={true} onCancel={onCancel} onConfirm={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /Close/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('не отображается при open=false', () => {
    render(
      <DeleteConfirmModal open={false} onCancel={jest.fn()} onConfirm={jest.fn()} />
    )

    expect(screen.queryByText(/Подтверждение удаления/i)).not.toBeInTheDocument()
  })
})
