import { Modal, Button, Typography, Empty } from 'antd'
import './SelectAlbumModal.css'

const { Text } = Typography

const SelectAlbumModal = ({ open, onCancel, onSelect, albums }) => {
  const myAlbums = albums.filter(album => album.author === 'Я')

  if (myAlbums.length === 0) {
    return (
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        centered
        width={440}
        className="select-album-modal"
      >
        <div className="select-album-modal__title">Выберите альбом</div>
        <Empty
          description="У вас пока нет альбомов. Создайте альбом в разделе «Моя коллекция»"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="select-album-modal__actions">
          <Button onClick={onCancel} className="select-album-modal__cancel">
            Закрыть
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={440}
      className="select-album-modal"
    >
      <div className="select-album-modal__title">Выберите альбом</div>
      <div className="select-album-modal__list">
        {myAlbums.map((album) => (
          <button
            key={album.id}
            className="select-album-modal__item"
            onClick={() => onSelect(album)}
          >
            <span className="material-symbols-outlined select-album-modal__item-icon">
              photo_album
            </span>
            <div className="select-album-modal__item-info">
              <Text className="select-album-modal__item-title">
                {album.title.join(' ')}
              </Text>
              <Text className="select-album-modal__item-count">
                {album.stamps?.length || 0} марок
              </Text>
            </div>
            <span className="material-symbols-outlined select-album-modal__item-arrow">
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default SelectAlbumModal