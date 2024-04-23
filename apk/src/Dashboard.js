import React, { useState } from 'react';
import Maap from './Maap';

function Dashboard() {
  const [mapVisible, setMapVisible] = useState(false);

  const toggleMapVisibility = () => {
    setMapVisible((prevVisible) => !prevVisible);
  };

  return (
    <div>
        <button onClick={toggleMapVisibility}>
        {mapVisible ? 'Hide Map' : 'Show Map'}
        </button>
        {mapVisible && <Maap />}
    </div>
  );
}

export default Dashboard;
