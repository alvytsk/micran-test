import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { EventType, EventVariants } from '../types';
import { format } from 'date-fns';

interface EventsFilters {
  event_type?: EventVariants;
  date_start?: string; // Формат: YYYY-MM-DD
  date_end?: string; // Формат: YYYY-MM-DD
  limit?: number;
}

interface EventsState {
  events: EventType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: EventsFilters;
}

const initialState: EventsState = {
  events: [],
  status: 'idle',
  error: null,
  filters: {
    limit: 100,
  },
};

// Асинхронный экшен для получения событий
export const fetchEvents = createAsyncThunk<EventType[], EventsFilters>(
  'events/fetchEvents',
  async (filters) => {
    const params: Partial<EventsFilters> = {};

    if (filters.event_type) params.event_type = filters.event_type;
    if (filters.date_start)
      params.date_start = format(
        new Date(filters.date_start),
        'dd.MM.yyyy',
      ).toString();
    if (filters.date_end)
      params.date_end = format(
        new Date(filters.date_end),
        'dd.MM.yyyy',
      ).toString();
    if (filters.limit) params.limit = filters.limit;

    const response = await axios.get<{ events: EventType[] }>(
      'http://localhost:8000/recent_events',
      { params },
    );

    return response.data.events;
  },
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<EventsFilters>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchEvents.fulfilled,
        (state, action: PayloadAction<EventType[]>) => {
          state.status = 'succeeded';
          state.events = action.payload;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  },
});

export const { setFilters } = eventsSlice.actions;

export default eventsSlice.reducer;
