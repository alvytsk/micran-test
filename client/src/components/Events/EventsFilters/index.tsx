import React, { useState } from 'react';
import { Form, InputNumber, Select, Button, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import './EventsFilters.scss';
import { EventVariants } from '../../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface EventsFiltersProps {
  onFilterChange: (filters: IEventsFilters) => void;
}

export interface IEventsFilters {
  limit: number;
  type: EventVariants | '' | null;
  startDate: string | null;
  endDate: string | null;
}

const EventsFilters: React.FC<EventsFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<IEventsFilters>({
    limit: 100,
    type: '',
    startDate: null,
    endDate: null,
  });

  const handleLimitChange = (value: number | null) => {
    setFilters((prev) => ({
      ...prev,
      limit: value || 0,
    }));
  };

  const handleTypeChange = (value: EventVariants | '' | null) => {
    setFilters((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleDateChange: RangePickerProps['onChange'] = (_, dateStrings) => {
    const startDate = dateStrings[0] ? dateStrings[0] : null;
    const endDate = dateStrings[1] ? dateStrings[1] : null;

    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="events-filters">
      <Form layout="inline" className="filters-form">
        <Form.Item label="Лимит">
          <InputNumber
            min={1}
            value={filters.limit}
            onChange={handleLimitChange}
          />
        </Form.Item>
        <Form.Item label="Тип">
          <Select
            value={filters.type}
            defaultValue={''}
            onChange={handleTypeChange}
            style={{ width: '150px' }}
          >
            <Option value="">Все</Option>
            <Option value="info">Info</Option>
            <Option value="critical">Critical</Option>
            <Option value="warning">Warning</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Диапазон">
          <RangePicker
            // value={
            //   filters.startDate && filters.endDate
            //     ? [filters.startDate, filters.endDate]
            //     : null
            // }
            allowEmpty={[false, true]}
            onChange={handleDateChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            color="default"
            variant="outlined"
            onClick={handleApplyFilters}
          >
            Применить фильтры
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EventsFilters;
