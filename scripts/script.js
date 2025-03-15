function writeSessions() {
    //define a variable for the collection you want to create in Firestore to populate data
    var sessionsRef = db.collection("sessions");

    // Get the selected length from the button text
    var selectedLength = document.getElementById("lengthInput").textContent;

    navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);



        sessionsRef.add({
            owner: sessionStorage.getItem("name"),
            geolocation: geolocation,
            description: document.querySelector('#sessionFormInput').value,
            length: selectedLength,// Store selected length
            created: firebase.firestore.FieldValue.serverTimestamp()  //current system time

        });
    }, function (error) {
        console.error("Geolocation error: " + error.message);
        alert("Could not retrieve geolocation. Please try again.");
    });
}
function checkSessionExpiration(sessionId, created, length) {
    // Convert session length to milliseconds
    let lengthInMillis = convertLengthToMillis(length);

    // Calculate the expiration time (created time + session length)
    let expirationTime = created.seconds * 1000 + lengthInMillis; // created is a Firestore timestamp

    // Get the current time
    let currentTime = Date.now();

    // If the current time has passed the expiration time, delete the session
    if (currentTime >= expirationTime) {
        deleteSession(sessionId);
    }
}

function convertLengthToMillis(length) {
    // Convert session length string to milliseconds
    if (length === "30 minutes") {
        return 30 * 60 * 1000;
    } else if (length === "1 hour") {
        return 60 * 60 * 1000;
    } else if (length === "2 hours") {
        return 2 * 60 * 60 * 1000;
    }
    return 0; // Default to 0 if no length is matched
}

function deleteSession(sessionId) {
    var sessionRef = db.collection("sessions").doc(sessionId);

    sessionRef.delete().then(function() {
        console.log("Session successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing session: ", error);
    });
}
// Example: Check every minute
setInterval(function() {
    db.collection("sessions").get().then(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            const created = data.created; // Firestore timestamp
            const length = data.length;

            // Check if session is expired
            checkSessionExpiration(doc.id, created, length);
        });
    });
}, 60000); // Check every minute (60000 ms)
