// src/store/cpuSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CPUUsage } from '../types';

export const fetchCPUUsage = createAsyncThunk<number>(
  'cpu/fetchCPUUsage',
  async () => {
    const response = await axios.get<{ cpu_usage: number }>('http://localhost:8000/current_cpu_usage');
    return response.data.cpu_usage;
  }
);

interface CPUState {
  usage: CPUUsage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CPUState = {
  usage: [],
  status: 'idle',
  error: null,
};

const cpuSlice = createSlice({
  name: 'cpu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCPUUsage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCPUUsage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        const currentTime = new Date().toLocaleTimeString();
        state.usage.push({ time: currentTime, value: action.payload });
        
        // Ограничиваем количество точек на графике (например, 60 секунд)
        if (state.usage.length > 60) 
          state.usage.shift();
      })
      .addCase(fetchCPUUsage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  },
});

export default cpuSlice.reducer;