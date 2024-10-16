import { configureStore } from '@reduxjs/toolkit';
import cpuReducer from './cpuSlice';

const store = configureStore({
  reducer: {
    cpu: cpuReducer,
  },
});

// Определяем типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;