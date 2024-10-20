import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteObject,
  fetchObjects,
  updateObject,
} from '../../store/objectSlice';
// import ObjectFilters from './ObjectFilters';
import ObjectsTable from './ObjectsTable';
import { ObjectType } from '../../types';
import ObjectModal from './ObjectModal';
import ObjectForm from './ObjectForm';
import JSONResponse from './JSONResponse';
import { message } from 'antd';

const Objects: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<ObjectType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  const objects = useAppSelector((state) => state.objects.objects);
  const status = useAppSelector((state) => state.objects.status);
  const jsonResponse = useAppSelector((state) => state.objects.response);
  // const error = useAppSelector((state) => state.objects.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchObjects());
    }
  }, [status, dispatch]);

  // const onFiltersChange = () => {
  //   console.log('Filters changed');
  // };

  const handleRowClick = (record: ObjectType) => {
    setSelectedObject(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setSelectedObject(null);
    setIsModalVisible(false);
  };

  // Обработка сохранения изменений
  const handleSave = (updatedObject: ObjectType) => {
    console.log('handleSave', updatedObject);

    dispatch(updateObject(updatedObject)).then(() => {
      message.success(`Объект ${updatedObject.object_name} успешно изменен`);
      setSelectedObject(null);
      setIsModalVisible(false);
    });
  };

  // Обработка удаления объекта
  const handleDelete = (objectId: number) => {
    console.log('handleDelete', objectId);

    dispatch(deleteObject(objectId)).then(() => {
      message.success(`Объект с ID ${objectId} успешно удален`);
      setSelectedObject(null);
      setIsModalVisible(false);
    });
  };

  return (
    <div className="objects-page">
      <div className="objects-page__filters">
        {
          //<ObjectFilters onFilter={onFiltersChange} />
        }
        <ObjectsTable data={objects} onRowClick={handleRowClick} />
        <ObjectForm />
        <JSONResponse jsonResponse={jsonResponse} />
        {selectedObject && (
          <ObjectModal
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
