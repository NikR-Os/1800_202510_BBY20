const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.032, 38.913]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.414, 37.776]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        }
    ]
};



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
        addSessionPinsCircle(map);

        //--------------------------------------
        // Add interactive pin for the user's location
        //--------------------------------------
        //addUserPin(map);

    });
}

showMap();   // Call it! 

// update the Length button's text when a dropdown item is selected.
function updateLength(selectedLength) {
    document.getElementById("lengthInput").textContent = selectedLength;
}

function addSessionPinsCircle(map) {
    db.collection('sessions').get().then(allEvents => {

        const features = [];

        allEvents.forEach(doc => {
            // Extract coordinates of the session
            console.log(doc.data().geolocation.longitude);
            var coordinates = [doc.data().geolocation.longitude, doc.data().geolocation.latitude];
            console.log(coordinates);

            var sessionDesc = doc.data().description;
            console.log(sessionDesc);

            var sessionLength = doc.data().length;
            console.log(sessionLength);

            features.push({
                'type': 'Feature',
                'properties': {
                    'description': sessionDesc,
                    'length': length
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': coordinates
                }
            });

            console.log(features);

        })

        // Adds features (in our case, pins) to the map
        // "places" is the name of this array of features
        map.addSource('places', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': features
            }
        });

        // Creates a layer above the map displaying the pins
        // Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'circle', // what the pins/markers/points look like
            'source': 'places',
            'paint': {   // customize colour and size
                'circle-color': '#4264fb',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // When one of the "places" markers are clicked,
        // create a popup that shows information 
        // Everything related to a marker is save in features[] array
        map.on('click', 'places', (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple 
            // copies of the feature are visible, the popup appears over 
            // the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse hovers over the places layer.
        map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Defaults cursor when not hovering over the places layer
        map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
        });

    })
}
