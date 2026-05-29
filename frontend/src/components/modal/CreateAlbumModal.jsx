import { useEffect } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import './CreateAlbumModal.css'

const CreateAlbumModal = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [form, open])

  const handleFinish = (values) => {
    if (onCreate) onCreate(values.title)
    form.resetFields()
    if (onCancel) onCancel()
  }

  const handleCancel = () => {
    form.resetFields()
    if (onCancel) onCancel()
  }

  return (
    <Modal open={open} onCancel={handleCancel} footer={null} centered width={440} className="auth-modal" forceRender>
      <div className="auth-modal__title">Создать новый альбом</div>

      <Form form={form} onFinish={handleFinish} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="Название альбома"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Серия..." />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className="auth-modal__submit">
          Создать
        </Button>
      </Form>
    </Modal>
  )
}

export default CreateAlbumModal