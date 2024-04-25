import React, { useState } from 'react';
import Map from './Map';


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
        {mapVisible && <Map />}
    </div>
  );
}

export default Dashboard;