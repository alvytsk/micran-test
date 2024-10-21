import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Popconfirm,
  SelectProps,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './ObjectEditModal.scss';
import { ObjectType } from '../../../types';

interface ObjectModalProps {
  visible: boolean;
  object: ObjectType | undefined;
  onSave: (updatedObject: Partial<ObjectType>) => void;
  onDelete: (objectId: number) => void;
  onCancel: () => void;
}

// const { Option } = Select;

const options: SelectProps['options'] = [];
options.push({ value: 'EMS', label: 'EMS' });
options.push({ value: 'Network Node', label: 'Network Node' });
options.push({ value: 'Data Element SNMP', label: 'Data Element SNMP' });

const ObjectEditModal: React.FC<ObjectModalProps> = ({
  visible,
  object,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    let touchedKeys: Array<string> = [];
    let touched: Partial<ObjectType> = {};

    //получаем массив изменившихся полей
    if (form.isFieldsTouched()) {
      touchedKeys = Object.keys(form.getFieldsValue()).filter((el) =>
        form.isFieldTouched(el),
      );

      //собираем объект с изменившимися полями
      touched = touchedKeys.reduce((acc, key) => {
        return {
          ...acc,
          [key]: form.getFieldValue(key),
        };
      }, {});
    }

    console.log(touched);

    const updatedObject = {
      object_id: object?.object_id,
      ...touched,
    };

    console.log({ updatedObject });

    form.validateFields().then(() => {
      onSave(updatedObject);
    });
  };

  const handleDelete = () => {
    if (object) {
      onDelete(object.object_id);
    }
  };

  return (
    <Modal
      title={`Редактирование объекта ${object?.object_name}`}
      open={visible}
      onOk={handleSave}
      onCancel={onCancel}
      footer={[
        <Popconfirm
          key="delete"
          title="Уверены, что хотите удалить объект?"
          placement="bottom"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete()}
          okText="Удалить"
          okType="danger"
          cancelText="Отмена"
        >
          <Button danger>Удалить</Button>
        </Popconfirm>,
        <Button key="save" type="primary" onClick={handleSave}>
          Сохранить
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={object}>
        <Form.Item
          name="object_name"
          label="Имя"
          rules={[
            { required: true, message: 'Это поле обязательно к заполнению' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="object_type"
          label="Тип"
          rules={[{ required: true, message: 'Выберите тип' }]}
        >
          <Select options={options}></Select>
        </Form.Item>
        <Form.Item
          name="object_description"
          label="Описание"
          rules={[
            { required: true, message: 'Это поле обязательно к заполнению' },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ObjectEditModal;
