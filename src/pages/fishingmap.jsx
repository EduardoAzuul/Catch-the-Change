import { useEffect, useRef } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

export default function FishingMap() {
    const leafletInstance = useRef(null);

    useEffect(() => {
        leafletInstance.current = L.map('map').setView([23.6345, -102.5528], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletInstance.current);

        // Fetch MongoDB marker data
        const fetcheconomicZoneLayer = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/economicZoneLayer");
                const data = await res.json();

                return L.geoJSON(data, {
                    style: {
                        color: '#3388ff',
                        weight: 2,
                        fillOpacity: 0.2,
                        fillColor: '#3388ff'
                    },
                    onEachFeature: function (feature, layer) {
                        let popupContent = '<strong>Mexico Economic Zone</strong><br/>';
                        if (feature.properties) {
                            for (let prop in feature.properties) {
                                popupContent += `${prop}: ${feature.properties[prop]}<br/>`;
                            }
                        }
                        layer.bindPopup(popupContent);
                    }
                }).addTo(leafletInstance.current);

            } catch (error) {
                console.error("Error loading economicZoneLayer:", error);
            }
        };

        const fetchprotectedAreas1Layer = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/protectedAreas1Layer");
                const data = await res.json();

                return L.geoJSON(data, {
                    style: {
                        color: '#00ff00',
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: '#00ff00'
                    },
                    onEachFeature: function (feature, layer) {
                        let popupContent = '<strong>Protected Area</strong><br/>';
                        if (feature.properties) {
                            for (let prop in feature.properties) {
                                popupContent += `${prop}: ${feature.properties[prop]}<br/>`;
                            }
                        }
                        layer.bindPopup(popupContent);
                    }
                }).addTo(leafletInstance.current);

            } catch (error) {
                console.error("Error loading protectedAreas1Layer:", error);
            }
        };

        const fetchprotectedAreas2Layer = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/protectedAreas2Layer");
                const data = await res.json();

                return L.geoJSON(data, {
                    style: {
                        color: '#ff6600',
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: '#ff6600'
                    },
                    onEachFeature: function (feature, layer) {
                        let popupContent = '<strong>Protected Area 2</strong><br/>';
                        if (feature.properties) {
                            for (let prop in feature.properties) {
                                popupContent += `${prop}: ${feature.properties[prop]}<br/>`;
                            }
                        }
                        layer.bindPopup(popupContent);
                    }
                }).addTo(leafletInstance.current);

            } catch (error) {
                console.error("Error loading protectedAreas2Layer:", error);
            }
        };

        // Add legend
        // Layer control to toggle visibility
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = `
                <h4>Map Layers</h4>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #3388ff; display: inline-block; width: 20px; height: 20px; margin-right: 5px; border: 1px solid #000;"></span>
                    Economic Zone
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #00ff00; display: inline-block; width: 20px; height: 20px; margin-right: 5px; border: 1px solid #000;"></span>
                    Protected Areas 1
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ff6600; display: inline-block; width: 20px; height: 20px; margin-right: 5px; border: 1px solid #000;"></span>
                    Protected Areas 2
                </div>
            `;
            return div;
        };
        legend.addTo(leafletInstance.current);

        // Layer control to toggle visibility
        const loadLayers = async () => {
            const economicZoneLayer = await fetcheconomicZoneLayer();
            const protectedAreas1Layer = await fetchprotectedAreas1Layer();
            const protectedAreas2Layer = await fetchprotectedAreas2Layer();
            const overlays = {
                "Mexico Economic Zone": economicZoneLayer,
                "Protected Areas 1": protectedAreas1Layer,
                "Protected Areas 2": protectedAreas2Layer
            };
            L.control.layers(null, overlays).addTo(leafletInstance.current);

            // Fit map to show all layers
            const allLayers = L.featureGroup([
                economicZoneLayer,
                protectedAreas1Layer,
                protectedAreas2Layer
            ]);
            leafletInstance.current.fitBounds(allLayers.getBounds());
        }

        loadLayers();

        return () => {
            leafletInstance.current?.remove(); // cleanup on component unmount
        };

    }, []);

    return <div id="map"
        ref={leafletInstance}
        style={{
            height: "600px",
            width: "80%",
            display: 'block',
            margin: '0 auto',
            borderRadius: "12px",
            overflow: "hidden",
        }}
    />
};