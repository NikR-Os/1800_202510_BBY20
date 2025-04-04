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
        addUserPinCircle(map);

    });
}

showMap();   // Call it! 

// update the Length button's text when a dropdown item is selected.
function updateLength(length) {
    document.getElementById("lengthInput").textContent = length;
    document.getElementById("sessionLengthValue").value = length;
    checkFormReady(); // call validation check
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

            var sessionOwner = doc.data().owner;

            var sessionEmail = doc.data().ownerEmail;

            features.push({
                'type': 'Feature',
                'properties': {
                    'description': sessionDesc,
                    'length': sessionLength,
                    "owner": sessionOwner,
                    "email" : sessionEmail
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
            'type': 'circle',
            'source': 'places',
            'paint': {   // customize colour and size
                'circle-color': 'orange',
                'circle-radius': 10,
                'circle-stroke-width': 4,
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
            const length = e.features[0].properties.length;
            const owner = e.features[0].properties.owner;
            const email = e.features[0].properties.email;

            console.log("Email!" + email);

            // Ensure that if the map is zoomed out such that multiple 
            // copies of the feature are visible, the popup appears over 
            // the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description + " " + length + " created by " + owner + " (" + email + ")")
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
                    'circle-radius': 8,
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


// Listen for changes in the authentication state (e.g., user logs in or out)
firebase.auth().onAuthStateChanged(user => {
    // Only proceed if a user is currently logged in
    if (user) {
        // Get references to HTML elements used in the session status indicator
        const indicator = document.getElementById("session-indicator");
        const label = document.getElementById("session-indicator-label");
        const deleteBtn = document.getElementById("delete-session-btn");
        const statusMessageElem = document.getElementById("session-status-message");

        // Set up a real-time listener on the current user's document in Firestore
        db.collection("users").doc(user.uid).onSnapshot(userDoc => {
            // Ensure the user's document exists
            if (userDoc.exists) {
                const userName = userDoc.data().name || "there";

                // Get the current session ID for this user
                const sessionId = userDoc.data().session;

                // Check if the user currently has an active session
                if (sessionId && sessionId !== "null") {
                    // Green dot for active session
                    indicator.style.backgroundColor = "green";
                    label.textContent = "Active Session";
                    deleteBtn.style.display = "inline-block";

                    // Fetch session details from Firestore using the active session ID
                    db.collection("sessions").doc(sessionId).get().then(sessionDoc => {
                        // Ensure the session document exists in Firestore
                        if (sessionDoc.exists) {
                            const sessionData = sessionDoc.data();

                            // Retrieve the session's start time and length from the session document
                            const startTime = sessionData.timestamp?.toDate?.(); // Firestore Timestamp to JS Date
                            const length = sessionData.length;


                            console.log("Session Data:", sessionData);
                            console.log("Start Time:", sessionData.timestamp);
                            console.log("Length:", sessionData.length);

                            // Check that both start time and session length are available
                            if (startTime && length) {
                                // Calculate the exact session end time based on its length
                                let endTime = new Date(startTime);
                                if (length === "30 minutes") {
                                    endTime.setMinutes(endTime.getMinutes() + 30);
                                } else if (length === "1 hour") {
                                    endTime.setHours(endTime.getHours() + 1);
                                } else if (length === "2 hours") {
                                    endTime.setHours(endTime.getHours() + 2);
                                }

                                // Format the calculated end time as a readable string (e.g., "02:30 PM")
                                const endTimeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                // Update the UI with a friendly status message including user's name, session length, and exact end time
                                statusMessageElem.textContent = `Hey ${userName}, your ${length} session ends at ${endTimeString}.`;

                            } else {
                                // Graceful fallback message in case session data is incomplete or missing
                                statusMessageElem.textContent = `Hey ${userName}, session details aren't available.`;
                            }
                        }
                    });

                } else {
                    // Red dot for no active session
                    indicator.style.backgroundColor = "red";
                    label.textContent = "No Active Session";
                    deleteBtn.style.display = "none";

                    // Friendly message for no active sessions
                    statusMessageElem.textContent = `Hey ${userName}, you have no active sessions.`;
                }
            }
        });  // <-- Closes onSnapshot listener
    } // <-- Closes if(user)
}); // <-- Closes firebase.auth listener

                


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

/**
 * Toggles the visibility of the session creation form.
 */
function toggleForm() {
    const form = document.getElementById("sessionFormPopup");
    const button = document.querySelector(".btn-sage"); // Create Session button
  
    const isFormVisible = form.style.display === "block";
  
    // Toggle visibility
    form.style.display = isFormVisible ? "none" : "block";
    button.style.display = isFormVisible ? "inline-block" : "none"; // Hide or show button
  }
  

// Enable the submit button only if both fields are filled
function checkFormReady() {
    const desc = document.getElementById("sessionFormInput").value.trim();
    const length = document.getElementById("sessionLengthValue").value.trim();
    const submitBtn = document.getElementById("submitSessionBtn");
    submitBtn.disabled = !(desc && length);
}
//  Add listener to check description input on every keystroke
document.addEventListener("DOMContentLoaded", () => {
    const descInput = document.getElementById("sessionFormInput");
    descInput.addEventListener("input", checkFormReady);
});

