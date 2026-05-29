import { Modal, Form, Input, Button } from 'antd'
import './EditAlbumModal.css'

const EditAlbumModal = ({ open, onCancel, onSave, currentTitle }) => {
  const [form] = Form.useForm()

  const getPlaceholder = () => {
    if (!currentTitle) return 'Новое название альбома'
    if (Array.isArray(currentTitle)) return currentTitle.join(' ')
    return currentTitle
  }

  const handleCancel = () => {
    form.resetFields()
    if (onCancel) onCancel()
  }

  const handleFinish = (values) => {
    if (onSave) onSave(values.title)
    form.resetFields()
    if (onCancel) onCancel()
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={440}
      className="edit-album-modal"
      forceRender
    >
      <div className="edit-album-modal__title">Изменение названия альбома</div>

      <Form form={form} onFinish={handleFinish} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="Название альбома"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder={getPlaceholder()} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className="edit-album-modal__submit">
          Сохранить
        </Button>
      </Form>
    </Modal>
  )
}

export default EditAlbumModal