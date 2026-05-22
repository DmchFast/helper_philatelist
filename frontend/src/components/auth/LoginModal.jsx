import { Modal, Form, Input, Button, Divider, Typography, message } from 'antd'
import { useAuth } from './AuthContext'
import GoogleIcon from '../../assets/Google.svg'
import YandexIcon from '../../assets/Yandex.svg'
import GithubIcon from '../../assets/Github.svg'
import './LogRegModals.css'

const { Title, Text } = Typography

const LoginModal = ({ open, onCancel, onSwitchToRegister }) => {
  const [form] = Form.useForm()
  const { login } = useAuth()

  const handleFinish = async (values) => {
    const success = await login(values.email, values.password)
    if (success) {
      form.resetFields()
      onCancel()
    } else {
      message.error('Неверный email или пароль')
    }
  }

  const handleSwitch = (e) => {
    e.preventDefault()
    if (onSwitchToRegister) onSwitchToRegister()
  }

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={440} className="auth-modal">
      <Title level={3} className="auth-modal__title">
        Вход в учетную запись
      </Title>

      <Form form={form} onFinish={handleFinish} layout="vertical" requiredMark={false}>
        <Form.Item
          name="email"
          label="Электронная почта"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}
        >
          <Input placeholder="email@mail.ru" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Введите свой пароль для входа"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className="auth-modal__submit">
          Войти
        </Button>
      </Form>

      <div className="auth-modal__switch">
        <Text type="secondary">Нет аккаунта? </Text>
        <a href="#" onClick={handleSwitch} className="auth-modal__switch-link">
          Зарегистрироваться
        </a>
      </div>

      <Divider className="auth-modal__divider">или продолжить с</Divider>

      <div className="auth-modal__social">
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Вход через Google временно не доступен')}
        >
          <img className='app-icon' src={GoogleIcon} alt="Google" />
        </Button>
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Вход через Яндекс временно не доступен')}
        >
          <img className='app-icon' src={YandexIcon} alt="Яндекс" />
        </Button>
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Вход через GitHub временно не доступен')}
        >
          <img className='app-icon' src={GithubIcon} alt="GitHub" />
        </Button>
      </div>

      <Text className="auth-modal__terms">
        Нажав продолжить, вы соглашаетесь с нашими{' '}
        <a href="#">Условиями предоставления услуг</a> и{' '}
        <a href="#">Политикой конфиденциальности</a>.
      </Text>
    </Modal>
  )
}

export default LoginModal