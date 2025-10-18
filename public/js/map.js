// Initialize the map
const map = L.map('map').setView([23.6345, -102.5528], 5); // Center on Mexico

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON
fetch('/data/mexico_zones.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        // Add the GeoJSON layer
        L.geoJSON(geojsonData, {
            style: feature => {
                // Change colors based on properties
                if(feature.properties.type === 'protected') return { color: 'green', fillOpacity: 0.5 };
                if(feature.properties.type === 'commercial') return { color: 'blue', fillOpacity: 0.3 };
                return { color: 'gray' };
            },
            onEachFeature: (feature, layer) => {
                if(feature.properties && feature.properties.name){
                    layer.bindPopup(`<strong>${feature.properties.name}</strong><br>Type: ${feature.properties.type}`);
                }
            }
        }).addTo(map);
    })
.catch(err => console.error('Error loading GeoJSON:', err));