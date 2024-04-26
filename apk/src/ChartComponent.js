// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';

// function ChartComponent() {
//   const [drones, setDrones] = useState([]);

//   useEffect(() => {
//     const eventSource = new EventSource('http://localhost:8000/drones/sse');

//     eventSource.onopen = () => console.log('start connection');

//     eventSource.onmessage = (event) => {
//       try {
//         const newDrones = JSON.parse(JSON.parse(event.data).data);
//         setDrones(Array.isArray(newDrones) ? newDrones : []);
//       } catch (error) {
//         console.error('Error parsing SSE data:', error);
//       }
//     };

//     eventSource.onerror = (error) => {
//       console.error('Error with SSE connection:', error);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//       console.log('SSE connection closed');
//     };
//   }, []);

//   // Prepare data for the chart
//   const chartData = {
//     labels: drones.map(drone => drone.id), // X-axis: drone IDs
//     datasets: [
//       {
//         label: 'Drone Positions',
//         data: drones.map(drone => drone.pos), // Y-axis: positions
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgb(75, 192, 192)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Drone Positions Over Time</h2>
//       <Bar data={chartData} options={options} />
//     </div>
//   );
// }

// export default ChartComponent;
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function ChartComponent() {
  const [droneData, setDroneData] = useState([]);

  useEffect(() => {
    // Simulate fetching drone data
    const fetchData = async () => {
      // Assuming data is fetched from an API
      const data = {
        ids: [0, 1, 2],
        positions: [1, 2, 3]
      };
      setDroneData(data);
    };

    fetchData();
  }, []);

  const { ids, positions } = droneData;

  const chartData = {
    labels: ids, // X-axis: drone ids
    datasets: [
      {
        label: 'Drone Positions',
        data: positions, // Y-axis: drone positions
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Drone Positions</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default ChartComponent;
