// map.js
// Import the necessary Google Maps API script in your HTML file before including this script.

// Initialize the map
function initMap() {
    // Create a map centered at a specific location (e.g., your fleet's headquarters)
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.7749, lng: -122.4194 }, // Replace with your desired center coordinates
      zoom: 10, // Adjust the initial zoom level as needed
    });
  
    // Fetch vehicle locations from your database (e.g., via an API)
    fetch('/fleet/vehicles')
      .then((response) => response.json())
      .then((data) => {
        // Loop through the list of vehicles and add markers to the map
        data.forEach((vehicle) => {
          const marker = new google.maps.Marker({
            position: { lat: vehicle.current_location_lat, lng: vehicle.current_location_lng },
            map,
            title: vehicle.name, // Display vehicle name as a tooltip
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching vehicle locations:', error);
      });
  }
  