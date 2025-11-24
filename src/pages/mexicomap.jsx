import { useEffect, useRef } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

export default function MexicoMap() {
    const leafletInstance = useRef(null);

    useEffect(() => {
        leafletInstance.current = L.map("map").setView([23.6345, -102.5528], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletInstance.current);

        // Fetch MongoDB marker data
        const fetchMarkers = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/markers");
                const data = await res.json();

                // Add a marker for each document from MongoDB
                data.forEach(marker => {
                    const popupHtml = `<img src="${marker.image}" style="width:100px;height:100x;" /> <br/> ${marker.url ? `<a href="${marker.url}" target="_blank" rel="noreferrer">${marker.speciesname}</a>` : ''}`;
                    L.marker([marker.coordinates.lat, marker.coordinates.lng])
                        .addTo(leafletInstance.current)
                        .bindPopup(popupHtml);
                });
            } catch (error) {
                console.error("Error loading markers:", error);
            }
        };

        fetchMarkers();

        return () => {
            leafletInstance.current?.remove(); // cleanup on component unmount
        };

    }, []);

    return <div id="map"
        ref={leafletInstance}
        style={{
            height: "90vh",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
        }}
    />
};

