import React, { useEffect } from 'react';
import './EventsSection.scss';
import EventsTable from '../EventsTable';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchEvents, setFilters } from '../../../store/eventsSlice';
import EventsFilters, { IEventsFilters } from '../EventsFilters';

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

  const handleFilterChange = (data: IEventsFilters) => {
    dispatch(
      setFilters({
        event_type: data.type || undefined,
        date_start: data.startDate || undefined,
        date_end: data.endDate || undefined,
        limit: data.limit || 100,
      }),
    );
  };

  return (
    <div className="events-section">
      <h3>Последние события</h3>
      <div className="events-section__table-container">
        <EventsFilters onFilterChange={handleFilterChange} />
        <EventsTable data={events} />
      </div>
    </div>
  );
};

export default EventsSection;
