import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import droneIconUrl from './drone.png';

function Map() {

  const [drones, setDrones] = useState([]);

    useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/drones/sse');

    eventSource.onopen = () => console.log('Connected to SSE server');

    eventSource.onmessage = (event) => {
        try {
        const newDrones = JSON.parse(JSON.parse(event.data).data);
        setDrones(Array.isArray(newDrones) ? newDrones : []);
        console.log(newDrones)
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

  const [i, setI] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setI((prevI) => (prevI < 6 ? prevI + 1 : 6));
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <MapContainer
        center={[36.7931055164204685, 9.92767926364837]}
        zoom={8}
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
  ))
}

      </MapContainer>
    </div>
  );
}

// Define custom drone icon
let droneIcon = L.icon({
  iconUrl: droneIconUrl,
  iconSize: [32, 32], // Adjust the size of the icon as needed
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

L.Marker.prototype.options.icon = droneIcon;

export default Map;
