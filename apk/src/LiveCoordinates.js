import React, { useEffect, useState } from 'react';

function LiveCoordinates() {
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource('http://127.0.0.1:8000/get-waypoints');

        eventSource.onopen = () => {
            console.log('EventSource connected');
            // Clear previous data when connection is established
            setCoordinates([]);
        };

        eventSource.addEventListener('locationUpdate', function (event) {
            const newCoords = JSON.parse(event.data);
            console.log('LocationUpdate', newCoords);
            setCoordinates(prevCoordinates => [...prevCoordinates, newCoords]);
        });

        eventSource.onerror = (error) => {
            console.error('EventSource failed', error);
            eventSource.close();
        };

        // Clean up event source when component unmounts
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div id="coordinates-container">
            <h2>Live Drones Coordinates</h2>
            <div id="coordinates">
                {coordinates.map((coords, index) => (
                    <p key={index}>Latitude: {coords.lat}, Longitude: {coords.lng}</p>
                ))}
            </div>
        </div>
    );
}

export default LiveCoordinates;
