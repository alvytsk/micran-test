import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { message } from 'antd';
import {
  deleteObject,
  fetchObjects,
  updateObject,
} from '../../store/objectSlice';
import { ObjectType, UpdateObjectData } from '../../types';
import ObjectsTable from '../../components/Objects/ObjectsTable';
import ObjectEditModal from '../../components/Objects/ObjectEditModal';
import JSONResponse from '../../components/Objects/JSONResponse';
import ObjectAdd from '../../components/Objects/ObjectAddSection';

const Objects: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<ObjectType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  const objects = useAppSelector((state) => state.objects.objects);
  const status = useAppSelector((state) => state.objects.status);
  const jsonResponse = useAppSelector((state) => state.objects.response);

  useEffect(() => {
    dispatch(fetchObjects());
  }, [dispatch]);

  const handleRowClick = (record: ObjectType) => {
    setSelectedObject(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setSelectedObject(null);
    setIsModalVisible(false);
  };

  // Обработка сохранения изменений
  const handleSave = useCallback(
    (updatedObject: Partial<ObjectType>) => {
      dispatch(updateObject(updatedObject)).then(() => {
        message.success(`Объект ${updatedObject.object_name} успешно изменен`);
        setSelectedObject(null);
        setIsModalVisible(false);
      });
    },
    [dispatch],
  );

  // Обработка удаления объекта
  const handleDelete = useCallback(
    (objectId: number) => {
      dispatch(deleteObject(objectId)).then(() => {
        message.success(`Объект с ID ${objectId} успешно удален`);
        setSelectedObject(null);
        setIsModalVisible(false);
      });
    },
    [dispatch],
  );

  return (
    <div className="objects-page">
      <div className="objects-page__filters">
        <ObjectsTable
          data={objects}
          onRowClick={handleRowClick}
          loading={status === 'loading'}
        />
        <ObjectAdd />
        {jsonResponse && <JSONResponse jsonResponse={jsonResponse} />}
        {selectedObject && (
          <ObjectEditModal
            visible={isModalVisible}
            object={selectedObject}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Objects;
