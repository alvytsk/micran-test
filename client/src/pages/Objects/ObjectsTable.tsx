import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './ObjectsTable.scss';
import { ObjectType } from '../../types';

const columns: ColumnsType<ObjectType> = [
  {
    title: 'ID',
    dataIndex: 'object_id',
    key: 'object_id',
  },
  {
    title: 'Имя',
    dataIndex: 'object_name',
    key: 'object_name',
  },
  {
    title: 'Тип',
    dataIndex: 'object_type',
    key: 'object_type',
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
