import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateStampModal from '../../components/modal/CreateStampModal'

describe('CreateStampModal', () => {
  test('рендерит заголовок, поля и кнопку', () => {
    render(
      <CreateStampModal open={true} onCancel={jest.fn()} onCreate={jest.fn()} />
    )

    expect(screen.getByText(/Добавить марку/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Название марки/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Серия/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Год выпуска/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Страна/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Цена/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Создать/i })).toBeInTheDocument()
  })

  test('валидация: без обязательных полей показывает ошибку', async () => {
    const onCreate = jest.fn()
    const user = userEvent.setup()

    render(<CreateStampModal open={true} onCancel={jest.fn()} onCreate={onCreate} />)

    await user.click(screen.getByRole('button', { name: /Создать/i }))

    expect(await screen.findByText(/Введите название/i)).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  test('скрывает поле цены при showPriceField=false', () => {
    render(
      <CreateStampModal
        open={true}
        onCancel={jest.fn()}
        onCreate={jest.fn()}
        showPriceField={false}
      />
    )

    expect(screen.queryByLabelText(/Цена/i)).not.toBeInTheDocument()
  })

  test('скрывает поле ссылки на изображение при showImageUrlField=false', () => {
    render(
      <CreateStampModal
        open={true}
        onCancel={jest.fn()}
        onCreate={jest.fn()}
        showImageUrlField={false}
      />
    )

    expect(screen.queryByLabelText(/Ссылка на изображение/i)).not.toBeInTheDocument()
  })

  test('предзаполняет поля из initialData', () => {
    render(
      <CreateStampModal
        open={true}
        onCancel={jest.fn()}
        onCreate={jest.fn()}
        initialData={{
          title: 'Марка 1961',
          series: 'Космос',
          year: '1961',
          country: 'СССР',
          image: 'https://example.com/stamp.jpg',
        }}
      />
    )

    expect(screen.getByLabelText(/Название марки/i)).toHaveValue('Марка 1961')
    expect(screen.getByLabelText(/Серия/i)).toHaveValue('Космос')
    expect(screen.getByLabelText(/Год выпуска/i)).toHaveValue('1961')
    expect(screen.getByLabelText(/Страна/i)).toHaveValue('СССР')
    expect(screen.getByLabelText(/Ссылка на изображение/i)).toHaveValue(
      'https://example.com/stamp.jpg'
    )
  })

  test('успешное создание передает корректные данные', async () => {
    const onCreate = jest.fn()
    const user = userEvent.setup()

    render(<CreateStampModal open={true} onCancel={jest.fn()} onCreate={onCreate} />)

    await user.type(screen.getByLabelText(/Название марки/i), 'Восток-1')
    await user.type(screen.getByLabelText(/Серия/i), 'Космос')
    await user.type(screen.getByLabelText(/Год выпуска/i), '1961')
    await user.type(screen.getByLabelText(/Страна/i), 'СССР')
    await user.type(screen.getByLabelText(/Цена/i), '1500')
    await user.type(
      screen.getByLabelText(/Ссылка на изображение/i),
      'https://example.com/vostok.jpg'
    )
    await user.type(screen.getByLabelText(/Описание/i), 'Пилотируемый полет')
    await user.click(screen.getByRole('button', { name: /Создать/i }))

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Восток-1',
          series: 'Космос',
          year: '1961',
          country: 'СССР',
          image: 'https://example.com/vostok.jpg',
          description: 'Пилотируемый полет',
          rarity: 'Обычная',
          price: 1500,
          id: expect.stringMatching(/^stamp-/),
        })
      )
    })
  })

  test('при showPriceField=false использует цену из initialData', async () => {
    const onCreate = jest.fn()
    const user = userEvent.setup()

    render(
      <CreateStampModal
        open={true}
        onCancel={jest.fn()}
        onCreate={onCreate}
        showPriceField={false}
        initialData={{ price: 500 }}
      />
    )

    await user.type(screen.getByLabelText(/Название марки/i), 'Спутник')
    await user.type(screen.getByLabelText(/Серия/i), 'Космос')
    await user.type(screen.getByLabelText(/Год выпуска/i), '1957')
    await user.type(screen.getByLabelText(/Страна/i), 'СССР')
    await user.click(screen.getByRole('button', { name: /Создать/i }))

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 500,
        })
      )
    })
  })
})
