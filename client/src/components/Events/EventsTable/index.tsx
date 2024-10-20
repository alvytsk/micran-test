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

// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// import { fetchEvents, setFilters } from '../../../store/eventsSlice';
// import { EventType, EventVariants } from '../../../types';
// import './EventsTable.scss';

// const EventsTable: React.FC = React.memo(() => {
//   const dispatch = useAppDispatch();
//   const events = useAppSelector((state) => state.events.events);
//   const status = useAppSelector((state) => state.events.status);
//   const error = useAppSelector((state) => state.events.error);
//   const filters = useAppSelector((state) => state.events.filters);

//   const [eventType, setEventType] = useState<EventVariants | undefined | ''>(
//     filters.event_type || '',
//   );
//   const [limit, setLimit] = useState<number>(filters.limit || 100);
//   const [dateFrom, setDateFrom] = useState<string>(filters.date_start || '');
//   const [dateTo, setDateTo] = useState<string>(filters.date_end || '');

//   useEffect(() => {
//     const interval = setInterval(() => {
//       dispatch(fetchEvents(filters));
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [dispatch, filters]);

//   const handleFilterChange = () => {
//     dispatch(
//       setFilters({
//         event_type: eventType || undefined,
//         date_start: dateFrom || undefined,
//         date_end: dateTo || undefined,
//         limit,
//       }),
//     );
//   };

//   const handleFilterReset = () => {
//     dispatch(
//       setFilters({
//         event_type: undefined,
//         date_start: undefined,
//         date_end: undefined,
//         limit: 100,
//       }),
//     );

//     setEventType('');
//     setLimit(100);
//     setDateFrom('');
//     setDateTo('');
//   };

//   return (
//     <div className="events-table">
//       <h2 className="events-table__title">Последние События</h2>
//       <div className="events-table__filters">
//         <div className="events-table__filter">
//           <label htmlFor="limit">Количество:</label>
//           <input
//             type="number"
//             id="limit"
//             value={limit}
//             min={1}
//             max={1000}
//             onChange={(e) => setLimit(Number(e.target.value))}
//           />
//         </div>
//         <div className="events-table__filter">
//           <label htmlFor="eventType">Тип События:</label>
//           <select
//             id="eventType"
//             value={eventType}
//             onChange={(e) => setEventType(e.target.value as EventVariants)}
//           >
//             <option value="">Все</option>
//             <option value="critical">Critical</option>
//             <option value="warning">Warning</option>
//             <option value="info">Info</option>
//           </select>
//         </div>

//         <div className="events-table__filter">
//           <label htmlFor="dateFrom">Дата От:</label>
//           <input
//             type="date"
//             id="dateFrom"
//             value={dateFrom}
//             placeholder="DD-MM-YYYY"
//             onChange={(e) => setDateFrom(e.target.value)}
//           />
//         </div>
//         <div className="events-table__filter">
//           <label htmlFor="dateTo">Дата До:</label>
//           <input
//             type="date"
//             id="dateTo"
//             value={dateTo}
//             placeholder="DD-MM-YYYY"
//             onChange={(e) => setDateTo(e.target.value)}
//           />
//         </div>
//         <button
//           className="events-table__apply-btn"
//           onClick={handleFilterChange}
//         >
//           Применить
//         </button>

//         <button className="events-table__apply-btn" onClick={handleFilterReset}>
//           Сбросить
//         </button>
//       </div>
//       {/* {status === 'loading' && <p>Загрузка...</p>} */}
//       {status === 'failed' && (
//         <p className="events-table__error">Ошибка: {error}</p>
//       )}
//       <table className="events-table__table">
//         <thead>
//           <tr>
//             <th>Дата</th>
//             <th>Время</th>
//             <th>Событие</th>
//             <th>Тип События</th>
//           </tr>
//         </thead>
//         <tbody>
//           {events?.map((event: EventType, index: number) => (
//             <tr key={index}>
//               <td>{event.date}</td>
//               <td>{event.time}</td>
//               <td>{event.event}</td>
//               <td>{event.type}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// });

// export default EventsTable;
