import React, { useState, memo } from 'react';
import moment from 'dayjs';
import { Form, InputNumber, Select, Button, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import './EventsFilters.scss';
import { EventVariants, IEventsFilters } from '../../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface EventsFiltersProps {
  onFilterChange: (filters: IEventsFilters) => void;
  values: IEventsFilters;
}

const EventsFilters: React.FC<EventsFiltersProps> = ({
  onFilterChange,
  values,
}) => {
  const [filters, setFilters] = useState<IEventsFilters>(values);

  const handleLimitChange = (value: number | null) => {
    setFilters((prev) => ({
      ...prev,
      limit: value || 0,
    }));
  };

  const handleTypeChange = (value: EventVariants | '' | null) => {
    setFilters((prev) => ({
      ...prev,
      event_type: value,
    }));
  };

  const handleDateChange: RangePickerProps['onChange'] = (_, dateStrings) => {
    setFilters((prev) => ({
      ...prev,
      date_start: dateStrings[0] ? dateStrings[0] : undefined,
      date_end: dateStrings[1] ? dateStrings[1] : undefined,
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
            value={filters.event_type}
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
            value={[
              filters.date_start ? moment(filters.date_start) : undefined,
              filters.date_end ? moment(filters.date_end) : undefined,
            ]}
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

export default memo(EventsFilters);
