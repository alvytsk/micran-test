import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCPUUsage } from '../../store/cpuSlice';
import {
  LineChart,
  Line,
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
      <h2 className="cpu-chart__title">CPU</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cpuUsage}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#63b3ed" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {status === 'failed' && <p className="cpu-chart__error">Ошибка: {error}</p>}
    </div>
  );
};

export default CpuChart;