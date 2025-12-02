import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

export default function FishingMap() {
    const leafletInstance = useRef(null);
    const url = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        leafletInstance.current = L.map('map').setView([23.6345, -102.5528], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletInstance.current);

        //Creates the layer for economic zone in the map
        const fetcheconomicZoneLayer = async () => {
            try {
                const res = await fetch(`${url}/economicZoneLayer`);
                const data = await res.json();
                setLoadingProgress(33);

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

        //Creates the layer for protectedAreas1 in the map
        const fetchprotectedAreas1Layer = async () => {
            try {
                const res = await fetch(`${url}/protectedAreas1Layer`);
                const data = await res.json();
                setLoadingProgress(66);

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

        //Creates the layer for protectedAreas2 in the map
        const fetchprotectedAreas2Layer = async () => {
            try {
                const res = await fetch(`${url}/protectedAreas2Layer`);
                const data = await res.json();
                setLoadingProgress(100);

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
            try {
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
                
                setLoading(false);
            } catch (error) {
                console.error("Error loading layers:", error);
                setLoading(false);
            }
        }

        loadLayers();

        return () => {
            leafletInstance.current?.remove();
        };

    }, []);

    return (
        <div style={{ position: 'relative', width: '80%', margin: '0 auto' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    borderRadius: '12px',
                    minHeight: '600px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '6px solid #e0e0e0',
                        borderTop: '6px solid #3388ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <p style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '10px'
                    }}>
                        Loading information...
                    </p>
                    <div style={{
                        width: '300px',
                        height: '8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${loadingProgress}%`,
                            height: '100%',
                            backgroundColor: '#3388ff',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        marginTop: '10px'
                    }}>
                        {loadingProgress}%
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
            <div 
                id="map"
                ref={leafletInstance}
                style={{
                    height: "600px",
                    width: "100%",
                    display: 'block',
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            />
        </div>
    );
}