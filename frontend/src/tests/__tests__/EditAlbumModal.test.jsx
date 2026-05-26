import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditAlbumModal from '../../components/modal/EditAlbumModal'

const renderModal = (props = {}) => {
  const defaultProps = {
    open: true,
    onCancel: jest.fn(),
    onSave: jest.fn(),
    currentTitle: 'Мой альбом',
  }
  return {
    ...defaultProps,
    ...props,
    ...render(<EditAlbumModal {...defaultProps} {...props} />),
  }
}

describe('EditAlbumModal', () => {
  test('рендерит заголовок', () => {
    renderModal()
    expect(screen.getByText(/Изменение названия альбома/i)).toBeInTheDocument()
  })

  test('рендерит поле и кнопку сохранения', () => {
    renderModal()
    expect(screen.getByLabelText(/Название альбома/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Сохранить/i })).toBeInTheDocument()
  })

  test('placeholder по умолчанию при отсутствии текущего названия', () => {
    renderModal({ currentTitle: undefined })
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Новое название альбома'
    )
  })

  test('placeholder по умолчанию при currentTitle=null', () => {
    renderModal({ currentTitle: null })
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Новое название альбома'
    )
  })

  test('placeholder по умолчанию при currentTitle=""', () => {
    renderModal({ currentTitle: '' })
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Новое название альбома'
    )
  })

  test('placeholder использует строковое название', () => {
    renderModal({ currentTitle: 'Коллекция 1960-х' })
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Коллекция 1960-х'
    )
  })

  test('placeholder объединяет массив в строку', () => {
    renderModal({ currentTitle: ['Коллекция', 'СССР', '1960'] })
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Коллекция СССР 1960'
    )
  })

  test('валидация: без названия показывает ошибку и не вызывает onSave', async () => {
    const { onSave } = renderModal({ currentTitle: undefined })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Сохранить/i }))

    expect(await screen.findByText(/Введите название/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  test('успешное сохранение вызывает onSave с новым названием', async () => {
    const { onSave } = renderModal()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Название альбома/i), 'Новый альбом')
    await user.click(screen.getByRole('button', { name: /Сохранить/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Новый альбом')
    })
  })

  test('успешное сохранение вызывает onCancel', async () => {
    const { onCancel } = renderModal()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Название альбома/i), 'Новый альбом')
    await user.click(screen.getByRole('button', { name: /Сохранить/i }))

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled()
    })
  })

  test('после сохранения поле очищается', async () => {
    renderModal()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Название альбома/i), 'Новый альбом')
    await user.click(screen.getByRole('button', { name: /Сохранить/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/Название альбома/i)).toHaveValue('')
    })
  })

  test('форма использует новое значение, не placeholder', async () => {
    const { onSave } = renderModal({ currentTitle: 'Старый альбом' })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Название альбома/i), 'Обновленный альбом')
    await user.click(screen.getByRole('button', { name: /Сохранить/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Обновленный альбом')
    })
  })

  test('сохранение без onSave не падает', async () => {
    const user = userEvent.setup()
    render(<EditAlbumModal open={true} currentTitle="Альбом" onCancel={jest.fn()} />)

    await user.type(screen.getByLabelText(/Название альбома/i), 'Без коллбэка')
    await user.click(screen.getByRole('button', { name: /Сохранить/i }))
  })

  test('закрытие без onCancel не вызывает ошибок', async () => {
    const user = userEvent.setup()
    render(<EditAlbumModal open={true} currentTitle="Альбом" onSave={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /Close/i }))
  })
})
