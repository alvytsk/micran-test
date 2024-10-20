import React from 'react';
// import CPUChart from '../../components/CpuChart';
import EventsSection from '../../components/Events/EventsSection';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* <CPUChart /> */}
      <EventsSection />
    </div>
  );
};

export default Home;
