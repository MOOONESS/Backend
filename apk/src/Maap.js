import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import droneIconUrl from './drone.png';


function Maap() {
  const [wfsData, setWfsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8081/geoserver/pfa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pfa%3Adrones&maxFeatures=50&outputFormat=application%2Fjson'
        );
        setWfsData(response.data);
      } catch (error) {
        console.error('Error fetching WFS data:', error);
      }
    };

    fetchData();
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
        
        {wfsData &&
          wfsData.features
            .filter(feature => feature.properties.pos === i) // Filter features with id=0
            .map((feature) => (
              <Marker
                key={feature.properties.id}
                position={[
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0],
                ]}
              >
                <Popup>
                  <div>
                    <h3>drone {feature.properties.nature}</h3>
                    <p>Drone-id: {feature.properties.id}</p>
                    <p>Drone-Numero: {feature.properties.numero}</p>
                    <p>Drone-position: {feature.properties.pos}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
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

export default Maap;
