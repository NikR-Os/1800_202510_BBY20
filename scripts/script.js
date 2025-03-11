function writeSessions() {
    //define a variable for the collection you want to create in Firestore to populate data
    var sessionsRef = db.collection("sessions");

    sessionsRef.add({
        owner: sessionStorage.getItem("name"),
        geolocation: null, //replace with your own city?
        description: document.querySelector('#sessionFormInput').value,
        length: null,
        created: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}