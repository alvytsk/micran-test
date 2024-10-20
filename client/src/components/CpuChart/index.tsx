import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCPUUsage } from '../../store/cpuSlice';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './CpuChart.scss';

const CpuChart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cpuUsage = useAppSelector((state) => state.cpu.usage);
  const status = useAppSelector((state) => state.cpu.status);
  const error = useAppSelector((state) => state.cpu.error);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCPUUsage());
    }, 1000); // 1 секунда

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="cpu-chart">
      <h3 className="cpu-chart__title">Загрузка CPU</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={cpuUsage}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            style={{
              fontSize: '0.8rem',
              fontFamily: 'Arial',
            }}
          />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
      {status === 'failed' && (
        <p className="cpu-chart__error">Ошибка: {error}</p>
      )}
    </div>
  );
};

export default CpuChart;
