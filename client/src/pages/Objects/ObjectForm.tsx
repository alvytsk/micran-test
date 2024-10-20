import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { Input, Select, Button, message } from 'antd';
import { addObject } from '../../store/objectSlice';
import { InsertObjectData, ObjectTypeVariants } from '../../types';

const { TextArea } = Input;
const { Option } = Select;

const ObjectForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name || !type || !description) {
      message.error('Все поля должны быть заполнены');
      return;
    }

    const newObject: InsertObjectData = {
      object_name: name,
      object_type: type as ObjectTypeVariants,
      object_description: description,
    };

    dispatch(addObject(newObject)).then(() => {
      message.success('Объект успешно добавлен');
      setName('');
      setType('');
      setDescription('');
    });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
      />
      <Select
        value={type}
        onChange={setType}
        placeholder="Тип"
        style={{ width: '100%', marginTop: 10 }}
      >
        <Option value="EMS">EMS</Option>
        <Option value="Network Node">Network Node</Option>
        <Option value="Data Element SNMP">Data Element SNMP</Option>
      </Select>
      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        rows={4}
        style={{ marginTop: 10 }}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
        Submit
      </Button>
    </div>
  );
};

export default ObjectForm;
