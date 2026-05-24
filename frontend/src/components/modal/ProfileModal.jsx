import { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, DatePicker, Typography, Avatar, message } from 'antd'
import dayjs from 'dayjs'
import { useAuth } from '../auth/AuthContext'
import { useCollection } from '../../context/CollectionContext'
import './ProfileModal.css'

const { Title, Text } = Typography
const { TextArea } = Input

const ProfileModal = ({ open, onClose }) => {
  const { user, updateUserProfile } = useAuth()
  const { albums } = useCollection()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const albumsCount = albums.length
  const stampsCount = albums.reduce((total, album) => total + (album.stamps?.length || 0), 0)

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        name: user.name,
        surname: user.surname || '',
        email: user.email,
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
        collectionSince: user.collectionSince ? dayjs(String(user.collectionSince), 'YYYY') : null
      })
    }
  }, [open, user, form])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const collectionSince = values.collectionSince ? values.collectionSince.year() : new Date().getFullYear()
      updateUserProfile({
        name: values.name,
        surname: values.surname,
        email: values.email,
        city: values.city,
        country: values.country,
        bio: values.bio,
        collectionSince
      })
      message.success('Профиль обновлён')
      onClose()
    } catch (error) {
      message.error('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const fullName = [user.name, user.surname].filter(Boolean).join(' ')

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      className="profile-modal"
      closable
    >
      <div className="profile-modal__content">
        <div className={`profile-modal__badge${isAdmin ? ' profile-modal__badge--admin' : ''}`}>
          {user.role === 'admin' ? 'АДМИНИСТРАТОР' : 'КОЛЛЕКЦИОНЕР'}
        </div>

        <div className="profile-modal__header-row">
          <Avatar className={`profile-modal__avatar${isAdmin ? ' profile-modal__avatar--admin' : ''}`} size={64}>
            {user.name?.[0] || 'U'}
          </Avatar>
          <div className="profile-modal__identity">
            <div className="profile-modal__name-line">
              <Text className="profile-modal__name">{fullName}</Text>
              <Text className="profile-modal__email">{user.email}</Text>
            </div>
          </div>
        </div>

        <div className="profile-modal__stats">
          <div className="profile-modal__stat">
            <div className="profile-modal__stat-value">{albumsCount}</div>
            <div className="profile-modal__stat-label">АЛЬБОМОВ</div>
          </div>
          <div className="profile-modal__stat">
            <div className="profile-modal__stat-value profile-modal__stat-value--accent">{stampsCount}</div>
            <div className="profile-modal__stat-label">МАРОК</div>
          </div>
          <div className="profile-modal__stat">
            <div className="profile-modal__stat-value">{user.collectionSince || new Date().getFullYear()}</div>
            <div className="profile-modal__stat-label">КОЛЛЕКЦИОНЕР С</div>
          </div>
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false} className="profile-modal__form">
          <div className="profile-modal__form-row">
            <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]} className="profile-modal__form-item">
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item name="surname" label="Фамилия" className="profile-modal__form-item">
              <Input placeholder="Фамилия" />
            </Form.Item>
          </div>

          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Введите корректный email' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>

          <div className="profile-modal__form-row">
            <Form.Item name="city" label="Город" className="profile-modal__form-item">
              <Input placeholder="Москва" />
            </Form.Item>
            <Form.Item name="country" label="Страна" className="profile-modal__form-item">
              <Input placeholder="Россия" />
            </Form.Item>
          </div>

          <Form.Item name="collectionSince" label="Год начала коллекционирования">
            <DatePicker picker="year" placeholder="Выберите год" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="bio" label="О себе">
            <TextArea rows={3} placeholder="Расскажите о своих интересах в филателии..." />
          </Form.Item>

          <div className="profile-modal__actions">
            <Button type="primary" htmlType="submit" loading={loading} block className="profile-modal__submit">
              Сохранить изменения
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ProfileModal