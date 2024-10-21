import React, { useCallback, useEffect } from 'react';
import './EventsSection.scss';
import EventsTable from '../EventsTable';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchEvents, setFilters } from '../../../store/eventsSlice';
import EventsFilters from '../EventsFilters';
import { IEventsFilters } from '../../../types';

const EventsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.events);
  // const status = useAppSelector((state) => state.events.status);
  // const error = useAppSelector((state) => state.events.error);
  const filters = useAppSelector((state) => state.events.filters);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchEvents(filters));
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchEvents(filters));
  }, [dispatch, filters]);

  const handleFilterChange = useCallback(
    (data: IEventsFilters) => {
      const { event_type, date_start, date_end, limit } = data;

      dispatch(
        setFilters({
          event_type: event_type || undefined,
          date_start: date_start || undefined,
          date_end: date_end || undefined,
          limit: limit || 100,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="events-section">
      <h3>Последние события</h3>
      <div className="events-section__table-container">
        <EventsFilters onFilterChange={handleFilterChange} values={filters} />
        <EventsTable data={events} />
      </div>
    </div>
  );
};

export default EventsSection;
