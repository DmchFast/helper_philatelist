import { Modal, Button } from 'antd'
import './DeleteConfirmModal.css'

const DeleteConfirmModal = ({ open, onCancel, onConfirm, title = 'Удаление' }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      className="delete-confirm-modal"
    >
      <div className="delete-confirm-modal__icon">
        <span className="material-symbols-outlined">delete_forever</span>
      </div>
      <div className="delete-confirm-modal__title">Подтверждение удаления</div>
      <div className="delete-confirm-modal__message">
        Вы действительно хотите удалить {title}? Это действие нельзя отменить.
      </div>
      <div className="delete-confirm-modal__actions">
        <Button onClick={onCancel} className="delete-confirm-modal__cancel">
          Отмена
        </Button>
        <Button danger onClick={onConfirm} className="delete-confirm-modal__submit">
          Удалить
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal