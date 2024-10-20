import React from 'react';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { EventType } from '../../../types';
import './EventsTable.scss';

const columns: ColumnsType<EventType> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    width: '15%',
  },
  {
    title: 'Время',
    dataIndex: 'time',
    key: 'time',
    width: '15%',
  },
  {
    title: 'Событие',
    dataIndex: 'event',
    key: 'event',
  },
  {
    title: 'Тип',
    dataIndex: 'type',
    key: 'type',
    width: '25%',
    render: (_, { type }) => {
      switch (type) {
        case 'critical':
          return <Tag color="red">critical</Tag>;
        case 'warning':
          return <Tag color="gold">warning</Tag>;
        case 'info':
          return <Tag color="blue">info</Tag>;
      }
    },
  },
];

interface EventsTableProps {
  data: EventType[];
}

const propsUpdated = (
  prev: EventsTableProps,
  next: EventsTableProps,
): boolean => {
  return (
    prev.data.length === next.data.length &&
    prev.data[0]?.id === next.data[0]?.id
  );
};

const EventsTable: React.FC<EventsTableProps> = React.memo(({ data }) => {
  return (
    <Table
      className="events-table"
      columns={columns}
      dataSource={data}
      rowKey="id"
      //   pagination={{ hideOnSinglePage: true }}
    />
  );
}, propsUpdated);

export default EventsTable;
