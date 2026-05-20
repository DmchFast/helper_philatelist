import { Avatar, Modal, Typography } from 'antd'
import './UserInfoModal.css'

const { Text, Title } = Typography

function UserInfoModal({ open, user, onCancel }) {
  const title = user?.name || ''

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={620}
      className="user-info-modal"
    >
      {user ? (
        <div className="user-info-modal__content">
          <div className={`user-info-modal__badge${user.role === 'admin' ? ' user-info-modal__badge--admin' : ''}`}>
            {user.roleLabel}
          </div>

          <div className="user-info-modal__header">
            <Avatar className={`user-info-modal__avatar${user.role === 'admin' ? ' user-info-modal__avatar--admin' : ''}`} size={72}>
              {user.avatar}
            </Avatar>
            <div className="user-info-modal__identity">
              <Title level={3} className="user-info-modal__name">
                {title}
              </Title>
              <Text className="user-info-modal__email">{user.email}</Text>
            </div>
          </div>

          <div className="user-info-modal__stats">
            <div className="user-info-modal__stat">
              <div className="user-info-modal__stat-value">{user.albumsCount}</div>
              <div className="user-info-modal__stat-label">АЛЬБОМОВ</div>
            </div>
            <div className="user-info-modal__stat">
              <div className="user-info-modal__stat-value user-info-modal__stat-value--accent">
                {user.stampsCount}
              </div>
              <div className="user-info-modal__stat-label">МАРОК</div>
            </div>
            <div className="user-info-modal__stat">
              <div className="user-info-modal__stat-value">{user.joinedAt}</div>
              <div className="user-info-modal__stat-label">КОЛЛИКЦИОНЕР С</div>
            </div>
          </div>

          <div className="user-info-modal__details">
            <div className="user-info-modal__detail-row">
              <span className="user-info-modal__detail-label">Город</span>
              <span className="user-info-modal__detail-value">{user.city}</span>
            </div>
            <div className="user-info-modal__detail-row">
              <span className="user-info-modal__detail-label">Страна</span>
              <span className="user-info-modal__detail-value">{user.country}</span>
            </div>
          </div>

          <div className="user-info-modal__bio">
            <Text className="user-info-modal__bio-label">О пользователе</Text>
            <p className="user-info-modal__bio-text">{user.bio}</p>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

export default UserInfoModal