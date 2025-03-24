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
        center: [-123.0019, 49.2490], // Starting position
        zoom: 16 // Starting zoom
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

// Listen for changes in the authentication state (e.g., user logs in or out)
firebase.auth().onAuthStateChanged(user => {

    // Only proceed if a user is currently logged in
    if (user) {

        // Get a reference to the HTML element that will act as the session status indicator (the dot)
        const indicator = document.getElementById("session-indicator");
        // Get a reference to the HTML element that will act as the session status text label
        const label = document.getElementById("session-indicator-label");

        // Get a reference to the delete button
        const deleteBtn = document.getElementById("delete-session-btn");


        // Set up a real-time listener on the current user's document in the "users" Firestore collection
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            // Check if the user's document actually exists in Firestore
            if (doc.exists) {
                // Get the current value of the "session" field from the user's document
                const sessionId = doc.data().session;

                // If the session field exists and is not the string "null"
                if (sessionId && sessionId !== "null") {
                    //  Green dot for active session
                    indicator.style.backgroundColor = "green";
                    label.textContent = "Active Session"; // Set visible text
                    //Show the delete button
                    deleteBtn.style.display = "inline-block";
                } else {
                    // Red dot for no session
                    indicator.style.backgroundColor = "red";
                    label.textContent = "No Active Session"; //  Set visible text
                    // Hide the delete button
                    deleteBtn.style.display = "none";
                }
            }
        });
    }
});

function deleteCurrentUserSession() {
    // Get the currently authenticated user from Firebase Auth
    const user = firebase.auth().currentUser;

    // Access the user's document in Firestore and retrieve the session ID
    db.collection("users").doc(user.uid).get().then(doc => {
        // Extract the session ID from the user's Firestore document
        const sessionId = doc.data().session;

        // Since the delete button is only shown when a session is active,
        // we can safely proceed to delete the session document

        // Step 1: Delete the session document from the "sessions" collection
        db.collection("sessions").doc(sessionId).delete()
            .then(() => {
                // Step 2: After successfully deleting the session,
                // update the user's document to set the "session" field to null
                return db.collection("users").doc(user.uid).update({
                    session: null
                });
            })
            .then(() => {
                // Step 3: Log success message to the console
                console.log("Session deleted and user session field cleared.");
            })
            .catch(error => {
                // Handle any errors that occur during deletion or update
                console.error("Error deleting session:", error);
            });
    });
}
