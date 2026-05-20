import { Button, Typography } from 'antd'
import './UserCard.css'

const { Text } = Typography

function UserCard({ user, onOpenProfile }) {
  const isAdmin = user.role === 'admin'

  return (
    <article className="user-card">
      <div className={`user-card__badge${isAdmin ? ' user-card__badge--admin' : ''}`}>
        {user.roleLabel}
      </div>

      <div className="user-card__name">{user.name}</div>
      <Text className="user-card__email">{user.email}</Text>

      <div className="user-card__stats">
        <div className="user-card__stat">
          <div className="user-card__stat-value">{user.albumsCount}</div>
          <div className="user-card__stat-label">АЛЬБОМОВ</div>
        </div>
        <div className="user-card__stat user-card__stat--accent">
          <div className="user-card__stat-value">{user.stampsCount}</div>
          <div className="user-card__stat-label">МАРОК</div>
        </div>
      </div>

      <Button
        type="default"
        htmlType="button"
        className="user-card__profile-btn"
        onClick={() => onOpenProfile(user)}
      >
        <span>Перейти в профиль</span>
        <span className="material-symbols-outlined">person</span>
      </Button>
    </article>
  )
}

export default UserCard