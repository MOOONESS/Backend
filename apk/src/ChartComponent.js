import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';


function ChartComponent() {
  
  const canvasRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    if (chartInstance) {
      // If a chart instance already exists, destroy it before creating a new one
      chartInstance.destroy();
    }

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Set the newly created chart instance to state
    setChartInstance(newChartInstance);

    // Cleanup function
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myChart"></canvas>
    </div>
  );
}

export default ChartComponent;
