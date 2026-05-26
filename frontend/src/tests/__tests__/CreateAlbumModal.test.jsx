import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAlbumModal from '../../components/modal/CreateAlbumModal';

describe('CreateAlbumModal', () => {
  const mockOnCreate = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('отображается при open=true', () => {
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );
    expect(screen.getByText(/Создать новый альбом/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Название альбома/i)).toBeInTheDocument();
  });

  test('валидация: поле обязательно', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );
    await user.click(screen.getByRole('button', { name: /Создать/i }));
    expect(await screen.findByText(/Введите название/i)).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  test('успешное создание альбома', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );
    await user.type(screen.getByLabelText(/Название альбома/i), 'Мои любимые марки');
    await user.click(screen.getByRole('button', { name: /Создать/i }));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith('Мои любимые марки');
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  test('placeholder для поля названия', () => {
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );
    expect(screen.getByLabelText(/Название альбома/i)).toHaveAttribute(
      'placeholder',
      'Серия...'
    );
  });

  test('нажатие на крестик вызывает onCancel', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    await user.click(screen.getByRole('button', { name: /Close/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('не отображается при open=false', () => {
    render(
      <CreateAlbumModal open={false} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );
    expect(screen.queryByText(/Создать новый альбом/i)).not.toBeInTheDocument();
  });

  test('сброс формы при смене open в false', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    const user = userEvent.setup();
    const { rerender } = render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    await user.type(screen.getByLabelText(/Название альбома/i), 'Временный альбом');

    rerender(
      <CreateAlbumModal open={false} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    rerender(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    expect(screen.getByLabelText(/Название альбома/i)).toHaveValue('');
    consoleErrorSpy.mockRestore();
  });

  test('успешное сохранение вызывает onCreate один раз', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    await user.type(screen.getByLabelText(/Название альбома/i), 'Альбом 1970-х');
    await user.click(screen.getByRole('button', { name: /Создать/i }));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });
  });

  test('успешное сохранение вызывает onCancel один раз', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCancel={mockOnCancel} onCreate={mockOnCreate} />
    );

    await user.type(screen.getByLabelText(/Название альбома/i), 'Альбом 1980-х');
    await user.click(screen.getByRole('button', { name: /Создать/i }));

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  test('успешное создание без onCreate не падает и вызывает onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <CreateAlbumModal open={true} onCancel={onCancel} />
    );

    await user.type(screen.getByLabelText(/Название альбома/i), 'Альбом тест');
    await user.click(screen.getByRole('button', { name: /Создать/i }));

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  test('закрытие без onCancel не вызывает ошибок', async () => {
    const user = userEvent.setup();
    render(
      <CreateAlbumModal open={true} onCreate={mockOnCreate} />
    );

    await user.click(screen.getByRole('button', { name: /Close/i }));
  });
});