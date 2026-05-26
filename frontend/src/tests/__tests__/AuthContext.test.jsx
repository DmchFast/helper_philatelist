import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../components/auth/AuthContext';

const TestComponent = () => {
  const { user, login, logout, register, updateUserProfile, updateUserStats } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="stats">
        {user ? `${user.albumsCount}:${user.stampsCount}` : '0:0'}
      </div>
      <button onClick={() => login('a@mail.ru', '123')}>AdminLogin</button>
      <button onClick={() => login('test@test.ru', 'pass')}>UserLogin</button>
      <button onClick={() => login('', '')}>InvalidLogin</button>
      <button onClick={() => register('TestUser', 'test@test.ru', 'pass')}>Register</button>
      <button onClick={() => register('TestUser', 'a@mail.ru', 'pass')}>RegisterConflict</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateUserProfile({ name: 'Updated' })}>UpdateProfile</button>
      <button onClick={() => updateUserStats(3, 7)}>UpdateStats</button>
    </div>
  );
};

describe('AuthContext', () => {
  test('начальное состояние – пользователь не авторизован', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });

  test('вход администратора', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('AdminLogin'));
    expect(screen.getByTestId('user').textContent).toBe('Администратор');
  });

  test('вход обычного пользователя', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('UserLogin'));
    expect(screen.getByTestId('user').textContent).not.toBe('No user');
    expect(screen.getByTestId('user').textContent).toContain('test');
  });

  test('регистрация нового пользователя', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Register'));
    expect(screen.getByTestId('user').textContent).toBe('TestUser');
  });

  test('выход из системы', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('UserLogin'));
    expect(screen.getByTestId('user').textContent).not.toBe('No user');
    await userEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });

  test('неуспешный вход возвращает false', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('InvalidLogin'));
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });

  test('регистрация с занятым email не меняет пользователя', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('RegisterConflict'));
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });

  test('обновление профиля меняет имя пользователя', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('UserLogin'));
    await userEvent.click(screen.getByText('UpdateProfile'));
    expect(screen.getByTestId('user').textContent).toBe('Updated');
  });

  test('обновление статистики меняет счётчики', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('UserLogin'));
    await userEvent.click(screen.getByText('UpdateStats'));
    expect(screen.getByTestId('stats').textContent).toBe('3:7');
  });
});

describe('useAuth', () => {
  test('выбрасывает ошибку вне AuthProvider', () => {
    const Failing = () => {
      useAuth();
      return null;
    };
    expect(() => render(<Failing />)).toThrow('useAuth must be used within AuthProvider');
  });
});