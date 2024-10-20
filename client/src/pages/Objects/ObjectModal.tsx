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
import './ObjectModal.scss';
import { ObjectType } from '../../types';

interface ObjectModalProps {
  visible: boolean;
  object: ObjectType | undefined;
  onSave: (updatedObject: ObjectType) => void;
  onDelete: (objectId: number) => void;
  onCancel: () => void;
}

// const { Option } = Select;

const options: SelectProps['options'] = [];
options.push({ value: 'EMS', label: 'EMS' });
options.push({ value: 'Network Node', label: 'Network Node' });
options.push({ value: 'Data Element SNMP', label: 'Data Element SNMP' });

const ObjectModal: React.FC<ObjectModalProps> = ({
  visible,
  object,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave({ ...object, ...values });
      form.resetFields();
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
          rules={[{ required: true, message: 'Please input the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="object_type"
          label="Тип"
          rules={[{ required: true, message: 'Please select the type' }]}
        >
          <Select options={options}></Select>
        </Form.Item>
        <Form.Item
          name="object_description"
          label="Описание"
          rules={[{ required: true, message: 'Please select the status' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ObjectModal;
