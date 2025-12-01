import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

export default function MexicoMap() {
    const leafletInstance = useRef(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        leafletInstance.current = L.map("map").setView([23.6345, -102.5528], 5);

        // Fix default icon URLs so markers show up in React builds
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletInstance.current);

        // Fetch MongoDB marker data
        const fetchMarkers = async () => {
            try {
                const url = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
                const res = await fetch(`${url}/markers`);
                const data = await res.json();
                setLoadingProgress(100);

                // Add a marker for each document from MongoDB
                data.forEach(marker => {
                    const popupHtml = `<img src="${marker.image}" style="width:100px;height:100x;" /> <br/> ${marker.url ? `<a href="${marker.url}" target="_blank" rel="noreferrer">${marker.speciesname}</a>` : ''}`;
                    L.marker([marker.coordinates.lat, marker.coordinates.lng])
                        .addTo(leafletInstance.current)
                        .bindPopup(popupHtml);
                });
                setLoading(false);
            } catch (error) {
                console.error("Error loading markers:", error);
                setLoading(false);
            }
        };

        fetchMarkers();

        return () => {
            leafletInstance.current?.remove(); // cleanup on component unmount
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

            <div id="map"
                ref={leafletInstance}
                style={{
                    height: "90vh",
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            />
        </div>
    );
}
