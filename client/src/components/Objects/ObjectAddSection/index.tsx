import React from 'react';
import ObjectForm from '../ObjectAddForm';
import './ObjectAddSection.scss';

const ObjectAddSection: React.FC = () => {
  return (
    <div className="object-add">
      <h3>Добавление объекта</h3>
      <div className="object-add__form-container">
        <ObjectForm />
      </div>
    </div>
  );
};

export default ObjectAddSection;
