import { Typography } from 'antd'
import './AlbumStampsTable.css'

const { Text } = Typography

function AlbumStampsTable({ stamps }) {
  return (
    <div className="album-stamps">
      <div className="album-stamps__head">
        <span>Марка</span>
        <span>Информация</span>
        <span>Цена</span>
        <span>Год</span>
        <span>Действия</span>
      </div>
      <div className="album-stamps__body">
        {stamps.map((stamp) => (
          <div key={stamp.id} className="album-stamps__row">
            <div className="album-stamps__cell album-stamps__cell--stamp">
              <div className="album-stamps__thumb">
                <img src={stamp.image} alt={stamp.title} loading="lazy" />
              </div>
            </div>

            <div className="album-stamps__cell">
              <Text className="album-stamps__info">
                <Text className='album-stamps__name'> {stamp.title}</Text><br />
                {stamp.country} • {stamp.series}
              </Text>
            </div>

            <div className="album-stamps__cell">
              <span className="album-stamps__price">{stamp.price} ₽</span>
            </div>

            <div className="album-stamps__cell">
              <Text className="album-stamps__year">{stamp.year}</Text>
            </div>
            
            <div className="album-stamps__cell album-stamps__actions">
              <button type="button" className="album-stamps__action" aria-label="Просмотр">
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <button type="button" className="album-stamps__action" aria-label="Редактировать">
                <span class="material-symbols-outlined">edit</span> {/* https://lucide.dev/guide/react/getting-started */}
              </button>
              <button type="button" className="album-stamps__action" aria-label="Удалить">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlbumStampsTable