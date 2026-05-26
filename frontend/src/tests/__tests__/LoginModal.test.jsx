import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginModal from '../../components/auth/LoginModal';
import { AuthContext } from '../../components/auth/AuthContext';
import { message } from 'antd';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      error: vi.fn(),
      info: vi.fn(),
    },
  };
});

const mockLogin = jest.fn();
const mockOnCancel = jest.fn();
const mockOnSwitch = jest.fn();

const renderWithAuth = () => {
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <LoginModal
        open={true}
        onCancel={mockOnCancel}
        onSwitchToRegister={mockOnSwitch}
      />
    </AuthContext.Provider>
  );
};

describe('LoginModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    message.error.mockClear();
    message.info.mockClear();
  });

  test('отображает поля email и пароль', () => {
    renderWithAuth();
    expect(screen.getByLabelText(/Электронная почта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
  });

  test('валидация email – показывает ошибку при некорректном вводе', async () => {
    const user = userEvent.setup();
    renderWithAuth();
    const emailInput = screen.getByLabelText(/Электронная почта/i);
    const submitBtn = screen.getByRole('button', { name: /Войти/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitBtn);

    expect(await screen.findByText(/Введите корректный email/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('успешный вход – вызывается login и закрывается модалка', async () => {
    mockLogin.mockResolvedValueOnce(true);
    const user = userEvent.setup();
    renderWithAuth();

    await user.type(screen.getByLabelText(/Электронная почта/i), 'user@test.ru');
    await user.type(screen.getByLabelText(/пароль/i), '123456');
    await user.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.ru', '123456');
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  test('ошибка входа – показывается сообщение об ошибке', async () => {
    mockLogin.mockResolvedValueOnce(false);
    const user = userEvent.setup();
    renderWithAuth();

    await user.type(screen.getByLabelText(/Электронная почта/i), 'wrong@mail.ru');
    await user.type(screen.getByLabelText(/пароль/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Неверный email или пароль');
    });
  });

  test('клик по ссылке регистрации вызывает onSwitchToRegister', async () => {
    const user = userEvent.setup();
    renderWithAuth();

    await user.click(screen.getByRole('link', { name: /Зарегистрироваться/i }));

    expect(mockOnSwitch).toHaveBeenCalledTimes(1);
  });

  test('клик по ссылке регистрации без коллбэка не падает', async () => {
    const user = userEvent.setup();
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginModal open={true} onCancel={mockOnCancel} />
      </AuthContext.Provider>
    );

    await user.click(screen.getByRole('link', { name: /Зарегистрироваться/i }));

    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test('социальные кнопки вызывают message.info', async () => {
    const user = userEvent.setup();
    renderWithAuth();

    await user.click(screen.getByAltText('Google').closest('button'));
    await user.click(screen.getByAltText('Яндекс').closest('button'));
    await user.click(screen.getByAltText('GitHub').closest('button'));

    expect(message.info).toHaveBeenCalledTimes(3);
  });
});