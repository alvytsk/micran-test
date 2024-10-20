import React from 'react';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './ObjectsTable.scss';
import { ObjectType } from '../../types';

const columns: ColumnsType<ObjectType> = [
  {
    title: 'ID',
    dataIndex: 'object_id',
    key: 'object_id',
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
}

const ObjectsTable: React.FC<ObjectsTableProps> = ({ data, onRowClick }) => {
  return (
    <Table
      className="objects-table"
      columns={columns}
      dataSource={data}
      rowKey="object_id"
      onRow={(record) => ({
        onClick: () => {
          onRowClick(record);
        },
      })}
    />
  );
};

export default ObjectsTable;
