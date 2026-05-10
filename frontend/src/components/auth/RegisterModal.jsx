import { Modal, Form, Input, Button, Divider, Typography, message } from 'antd'
import { useAuth } from './AuthContext'
import GoogleIcon from '../../assets/Google.svg'
import YandexIcon from '../../assets/Yandex.svg'
import GithubIcon from '../../assets/Github.svg'
import './LogRegModals.css'

const { Title, Text } = Typography

const RegisterModal = ({ open, onCancel }) => {
  const [form] = Form.useForm()
  const { register } = useAuth()

  const handleFinish = async (values) => {
    const success = await register(values.username, values.email, values.password)
    if (success) {
      form.resetFields()
      onCancel()
      message.success('Регистрация прошла успешно')
    } else {
      message.error('Не удалось зарегистрироваться (возможно, email уже используется)')
    }
  }

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={440} className="auth-modal">
      <Title level={3} className="auth-modal__title">
        Создать учетную запись
      </Title>

      <Form form={form} onFinish={handleFinish} layout="vertical" requiredMark={false}>
        <Form.Item
          name="username"
          label="Введите своё имя для регистрации"
          rules={[{ required: true, message: 'Введите имя пользователя' }]}
        >
          <Input placeholder="User" />
        </Form.Item>

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
          label="Пароль"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Пароль должен содержать не менее 6 символов' },
          ]}
        >
          <Input.Password placeholder="••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className="auth-modal__submit">
          Регистрация по электронной почте
        </Button>
      </Form>

      <Divider className="auth-modal__divider">или продолжить с</Divider>

      <div className="auth-modal__social">
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Регистрация через Google временно не доступна')}
        >
          <img className='app-icon' src={GoogleIcon} alt="Google"/>
        </Button>
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Регистрация через Яндекс временно не доступна')}
        >
          <img src={YandexIcon} alt="Яндекс" style={{ width: 20, height: 20 }} />
        </Button>
        <Button
          shape="square"
          size="large"
          className="auth-modal__social-btn auth-modal-btn"
          onClick={() => message.info('Регистрация через GitHub временно не доступна')}
        >
          <img src={GithubIcon} alt="GitHub" style={{ width: 20, height: 20 }} />
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

export default RegisterModal