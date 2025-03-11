
function showMap() {
    //------------------------------------------
    // Defines and initiates basic mapbox data
    //------------------------------------------
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1IjoiLWNsYW5rYXBsdW0tIiwiYSI6ImNtODR0Zm54YzJhenAyanEza2Z3eG50MmwifQ.Kx9Kioj3BBgqC5-pSkZkNg';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-122.964274, 49.236082], // Starting position
        zoom: 8 // Starting zoom
    });

    // Add user controls to map, zoom bar
    map.addControl(new mapboxgl.NavigationControl());

    //------------------------------------------------
    // Add listener for when the map finishes loading.
    // After loading, we can add map features
    //------------------------------------------------
    map.on('load', () => {

        //---------------------------------
        // Add interactive pins for the sessions
        //---------------------------------
        //addSessionPins(map);

        //--------------------------------------
        // Add interactive pin for the user's location
        //--------------------------------------
        addUserPin(map);

    });
}

showMap();   // Call it! 

//-----------------------------------------------------
// Add pin for showing where the user is.
// This is a separate function so that we can use a different
// looking pin for the user.  
// This version uses a pin that is just a circle. 
//------------------------------------------------------
function addUserPinCircle(map) {

    // Adds user's current location as a source to the map
    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = [position.coords.longitude, position.coords.latitude];
        console.log(userLocation);
        if (userLocation) {
            map.addSource('userLocation', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': userLocation
                        },
                        'properties': {
                            'description': 'Your location'
                        }
                    }]
                }
            });

            // Creates a layer above the map displaying the pins
            // Add a layer showing the places.
            map.addLayer({
                'id': 'userLocation',
                'type': 'circle', // what the pins/markers/points look like
                'source': 'userLocation',
                'paint': { // customize colour and size
                    'circle-color': 'blue',
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });

            // Map On Click function that creates a popup displaying the user's location
            map.on('click', 'userLocation', (e) => {
                // Copy coordinates array.
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the userLocation layer.
            map.on('mouseenter', 'userLocation', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Defaults
            // Defaults cursor when not hovering over the userLocation layer
            map.on('mouseleave', 'userLocation', () => {
                map.getCanvas().style.cursor = '';
            });
        }
    });
}



