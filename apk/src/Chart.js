import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function Chart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8081/geoserver/pfa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pfa%3Adrones&maxFeatures=50&outputFormat=application%2Fjson'
        );
        const processedData = processData(response.data);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (data) => {
    const positions = data.features.map((feature) => feature.properties.pos);
    const labels = positions.map((pos, index) => `Feature ${index + 1}`);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Position',
          data: positions,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    };
  };

  return (
    <div>
      <h2>Drone Positions</h2>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
