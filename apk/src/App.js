// import LiveCoordinates from "./LiveCoordinates";
// import React from 'react'

// function App() {
//   return (
//     <div >
//       <LiveCoordinates />
//     </div>
//   );
// }
// export default App;



import React, { useEffect, useState } from 'react';

function App() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/drones/sse');

    eventSource.onopen = () => console.log('Connected to SSE server');

    eventSource.addEventListener("new_message", function (event) {
      const dronesData = JSON.parse(event.data);
      setDrones((drones) => [...drones, ...dronesData]); // Spread the array of drones
  });
  
    eventSource.addEventListener("end_event", function (event) {
      setDrones((drones) => [...drones, event.data]);
      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.error('Error with SSE connection:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  }, []);

  return (
    <div className="App">
      <h1>Drones List</h1>
      <ul>
        {drones.map((drone) => (
          <li key={drone.id}>{drone.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;







