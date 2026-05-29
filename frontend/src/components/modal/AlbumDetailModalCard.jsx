import { Modal, Typography } from 'antd'

const { Text } = Typography

function AlbumDetailModalCard({ open, stamp, onClose }) {
  if (!stamp) return null

  return (
    <Modal
      title={stamp.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <img
          src={stamp.image}
          alt={stamp.title}
          style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text><strong>Серия:</strong> {stamp.series}</Text>
        <Text><strong>Год выпуска:</strong> {stamp.year}</Text>
        <Text><strong>Страна:</strong> {stamp.country}</Text>
        <Text><strong>Цена:</strong> {stamp.price ? `${stamp.price} ₽` : 'Нет данных'}</Text>
        {stamp.description && <Text>{stamp.description}</Text>}
      </div>
    </Modal>
  )
}

export default AlbumDetailModalCard