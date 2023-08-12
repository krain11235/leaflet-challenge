// Create a map centered at a specific location
const map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch JSON data from the URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    const features = data.features;

    // Loop through each earthquake feature and add a marker to the map
    features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;
      const depth = coordinates[2]; // Depth is the third coordinate

          // Calculate marker size based on magnitude
          const markerSize = Math.sqrt(magnitude) **2*5;

          // Calculate marker color based on depth
          const color = getColorByDepth(depth);

          const marker = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: markerSize,
            fillColor: color,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).bindPopup(`
            Magnitude: ${magnitude}<br>
            Depth: ${depth} km<br>
            Location: ${feature.properties.place}
          `).addTo(map);
        });

        // Create a legend
        const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'legend'); // Change 'info legend' to 'legend'
  const depths = [0, 40, 100, 200, 300, 400];
  const colors = ['lightyellow', 'yellow', 'gold', 'orange', 'red', 'darkred'];
  div.innerHTML += '<strong>Depth (km)</strong><br>';
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);


    })
      function getColorByDepth(depth) {
        if (depth >= 400) {
          return 'darkred';
        } else if (depth >= 300) {
          return 'red';
        } else if (depth >= 200) {
          return 'orange';
        } else if (depth >= 100) {
          return 'gold';
        } else if (depth >=40) {
          return 'yellow';
        }
        else return 'lightyellow'
      }
  

