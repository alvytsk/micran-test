import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import './ObjectFilters.scss';

interface ObjectFiltersProps {
  onFilter: (filters: { name?: string; type?: string }) => void;
}

const { Option } = Select;

const ObjectFilters: React.FC<ObjectFiltersProps> = ({ onFilter }) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);

  const handleFilter = () => {
    onFilter({ name, type });
  };

  return (
    <div className="object-filters">
      <Input
        className="object-filters__input"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        className="object-filters__select"
        placeholder="Select type"
        value={type}
        onChange={(value) => setType(value)}
        allowClear
      >
        <Option value="Type 1">Type 1</Option>
        <Option value="Type 2">Type 2</Option>
      </Select>
      <Button
        className="object-filters__button"
        type="primary"
        onClick={handleFilter}
      >
        Filter
      </Button>
    </div>
  );
};

export default ObjectFilters;
