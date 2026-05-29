import { Button, Typography } from 'antd'
import { useAuth } from '../auth/AuthContext'
import './StampCard.css'

const { Text } = Typography

function StampCard({ stamp, onAdd }) {
  const { user } = useAuth()
  const canAdd = user && (user.role === 'user' || user.role === 'admin')

  return (
    <article className={`stamp-card${!canAdd ? ' stamp-card--no-button' : ''}`}>
      <div className="stamp-card__image">
        <img src={stamp.photo || stamp.image} alt="" loading="lazy" />
      </div>
      <div className="stamp-card__body">
        <div className="stamp-card__text">
          <div className="stamp-card__title">{stamp.title}</div>
          <div className="stamp-card__meta-group">
            <div className="stamp-card__meta">Серия: {stamp.series}</div>
            <div className="stamp-card__meta">Год: {stamp.year}</div>
            <div className="stamp-card__meta">Страна: {stamp.country}</div>
          </div>
        </div>
        {canAdd && (
          <Button
            type="primary"
            className="card-add-btn btn-hover"
            onClick={() => onAdd(stamp)}
            aria-label={`Добавить ${stamp.title} в коллекцию`}
          >
            <span className="material-symbols-outlined">add</span>
          </Button>
        )}
      </div>
    </article>
  )
}

export default StampCard