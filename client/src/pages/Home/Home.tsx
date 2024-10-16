import React from 'react';
import CPUChart from '../../components/CpuChart';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <CPUChart />
    </div>
  );
};

export default Home;