import React from 'react';
import CPUChart from '../../components/CpuChart';
import EventsTable from '../../components/Events/EventsTable/EventsTable';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <CPUChart />
      <EventsTable />
    </div>
  );
};

export default Home;
