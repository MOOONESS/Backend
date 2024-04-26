import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import amiIconUrl from './ami.png'; // Import custom ami icon
import hostileIconUrl from './hostile.png'; // Import custom hostile icon

function Map() {
  const [drones, setDrones] = useState([]);
  const [maxPos, setMaxPos] = useState(0); // Initialize maxPos state
  const [i, setI] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/drones/sse');

    eventSource.onopen = () => console.log('Connected to SSE server');

    eventSource.onmessage = (event) => {
      try {
        const newDrones = JSON.parse(JSON.parse(event.data).data);
        setDrones(Array.isArray(newDrones) ? newDrones : []);

        // Find the maximum position among the new drones
        const newPos = Math.max(...newDrones.map(drone => drone.pos));
        setMaxPos(newPos);

        console.log(newDrones);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error with SSE connection:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // No need to find max_pos here, just use maxPos state
      setI((prevI) => (prevI < maxPos ? prevI + 1 : maxPos));
    }, 4000);

    return () => clearInterval(intervalId);
  }, [maxPos]); // Include maxPos in the dependency array

  // Define custom drone icon for each type
  let droneIcons = {
    ami: L.icon({
      iconUrl: amiIconUrl,
      iconSize: [33, 33],
      iconAnchor: [16, 16],
    }),
    hostile: L.icon({
      iconUrl: hostileIconUrl,
      iconSize: [35, 35],
      iconAnchor: [16, 16],
    }),
  };

  return (
    <div>
      <MapContainer
        center={[36.5, 9.93]}
        zoom={9}
        style={{ width: '100%', height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {drones
          .filter(drone => drone.pos === i)
          .map((drone) => (
            <Marker
              key={drone.id}
              position={[drone.latitude, drone.longitude]}
              icon={droneIcons[drone.nature]} // Set icon based on drone nature
            >
              <Popup>
                <div>
                  <h3>Drone {drone.nature}</h3>
                  <p>Drone ID: {drone.id}</p>
                  <p>Drone Numero: {drone.numero}</p>
                  <p>Drone Position: {drone.pos}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default Map;
