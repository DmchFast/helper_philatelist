import { Modal, Form, Input, InputNumber, Button } from 'antd'
import { useEffect } from 'react'
import defaultStamp from '../../assets/default-stamp.png'
import './EditStampModal.css'

const EditStampModal = ({ 
  open, 
  onCancel, 
  onSave, 
  stamp, 
  showPriceField = true,
  showDescriptionField = true 
}) => {
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  useEffect(() => {
    if (stamp && open) {
      form.setFieldsValue({
        title: stamp.title,
        series: stamp.series,
        year: stamp.year,
        country: stamp.country,
        price: stamp.price,
        imageUrl: stamp.image === defaultStamp ? '' : stamp.image,
        description: stamp.description || '',
      })
    }
  }, [stamp, open, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedStamp = {
          ...stamp,
          title: values.title,
          series: values.series,
          year: values.year,
          country: values.country,
          price: values.price,
          image: values.imageUrl || defaultStamp,
          description: values.description || '',
        }
        form.resetFields()
        onSave(updatedStamp)
      })
      .catch(() => {})
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={520}
      className="edit-stamp-modal"
    >
      <div className="edit-stamp-modal__title">Редактировать марку</div>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="Название марки"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="series"
          label="Серия"
          rules={[{ required: true, message: 'Введите серию' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="year"
          label="Год выпуска"
          rules={[{ required: true, message: 'Введите год' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="country"
          label="Страна"
          rules={[{ required: true, message: 'Введите страну' }]}
        >
          <Input />
        </Form.Item>
        {showPriceField && (
          <Form.Item
            name="price"
            label="Цена (₽)"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber min={0} step={100} style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item
          name="imageUrl"
          label="Ссылка на изображение (необязательно)"
          extra="Если не указать, будет использована стандартная картинка"
        >
          <Input />
        </Form.Item>
        {showDescriptionField && (
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
        )}
        <div className="edit-stamp-modal__actions">
          <Button onClick={handleCancel} className="edit-stamp-modal__cancel">
            Отмена
          </Button>
          <Button type="primary" onClick={handleOk} className="edit-stamp-modal__submit">
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default EditStampModal