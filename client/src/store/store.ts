import { configureStore } from '@reduxjs/toolkit';
import cpuReducer from './cpuSlice';
import eventsReducer from './eventsSlice';
import objectsReducer from './objectSlice';

const store = configureStore({
  reducer: {
    cpu: cpuReducer,
    events: eventsReducer,
    objects: objectsReducer,
  },
});

// Определяем типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
