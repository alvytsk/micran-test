import React from 'react';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ObjectType } from '../../../types';
import './ObjectsTable.scss';

const columns: ColumnsType<ObjectType> = [
  {
    title: 'ID',
    dataIndex: 'object_id',
    key: 'object_id',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.object_id - b.object_id,
    width: '5%',
  },
  {
    title: 'Имя',
    dataIndex: 'object_name',
    key: 'object_name',
    width: '20%',
  },
  {
    title: 'Тип',
    dataIndex: 'object_type',
    key: 'object_type',
    width: '20%',
    render: (_, { object_type }) => {
      switch (object_type) {
        case 'EMS':
          return <Tag color="green">EMS</Tag>;
        case 'Network Node':
          return <Tag color="cyan">Network Node</Tag>;
        case 'Data Element SNMP':
          return <Tag color="blue">Data Element SNMP</Tag>;
      }
    },
  },
  {
    title: 'Описание',
    dataIndex: 'object_description',
    key: 'object_description',
  },
];

interface ObjectsTableProps {
  data: ObjectType[];
  onRowClick: (row: ObjectType) => void;
  loading?: boolean;
}

const ObjectsTable: React.FC<ObjectsTableProps> = ({
  data,
  onRowClick,
  loading,
}) => {
  return (
    <Table
      className="objects-table"
      columns={columns}
      dataSource={data}
      rowKey="object_id"
      loading={!!loading}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      onRow={(record) => ({
        onClick: () => {
          onRowClick(record);
        },
      })}
    />
  );
};

export default ObjectsTable;
