import { Modal, Form, Input, InputNumber, Button } from 'antd'
import { useEffect } from 'react'
import defaultStamp from '../../assets/default-stamp.png'
import './CreateStampModal.css'

const CreateStampModal = ({
  open,
  onCancel,
  onCreate,
  initialData,
  showImageUrlField = true,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialData && open) {
      const initialImage = initialData.photo || initialData.image
      form.setFieldsValue({
        title: initialData.title,
        series: initialData.series,
        year: initialData.year,
        country: initialData.country,
        price: initialData.price || '',
        imageUrl: initialImage === defaultStamp ? '' : initialImage,
        description: '',
      })
    } else if (!open) {
      form.resetFields()
    }
  }, [initialData, open, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newStamp = {
          id: `stamp-${Date.now()}`,
          title: values.title,
          series: values.series,
          year: values.year,
          country: values.country,
          price: values.price,
          image: values.imageUrl || initialData?.photo || initialData?.image || defaultStamp,
          description: values.description || '',
          rarity: 'Обычная',
          priceHistory: [
            { date: new Date().toLocaleDateString('ru-RU'), value: values.price }
          ],
        }
        form.resetFields()
        onCreate(newStamp)
      })
      .catch(() => { })
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={520}
      className="create-stamp-modal"
    >
      <div className="create-stamp-modal__title">Добавить марку</div>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="Название марки"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Например: Первый полёт в космос" />
        </Form.Item>
        <Form.Item
          name="series"
          label="Серия"
          rules={[{ required: true, message: 'Введите серию' }]}
        >
          <Input placeholder="Например: Космическая программа" />
        </Form.Item>
        <Form.Item
          name="year"
          label="Год выпуска"
          rules={[{ required: true, message: 'Введите год' }]}
        >
          <Input placeholder="1961" />
        </Form.Item>
        <Form.Item
          name="country"
          label="Страна"
          rules={[{ required: true, message: 'Введите страну' }]}
        >
          <Input placeholder="СССР" />
        </Form.Item>
        <Form.Item
          name="price"
          label="Цена (₽)"
          rules={[{ required: true, message: 'Введите цену' }]}
        >
          <InputNumber min={0} step={100} style={{ width: '100%' }} placeholder="1500" />
        </Form.Item>
        {showImageUrlField && (
          <Form.Item
            name="imageUrl"
            label="Ссылка на изображение (необязательно)"
            extra="Если не указать, будет использована стандартная картинка"
          >
            <Input placeholder="https://example.com/stamp.jpg" />
          </Form.Item>
        )}
        <Form.Item name="description" label="Описание (необязательно)">
          <Input.TextArea rows={3} placeholder="Дополнительная информация о марке" />
        </Form.Item>
        <div className="create-stamp-modal__actions">
          <Button onClick={onCancel} className="create-stamp-modal__cancel">
            Отмена
          </Button>
          <Button type="primary" onClick={handleOk} className="create-stamp-modal__submit">
            Создать
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default CreateStampModal