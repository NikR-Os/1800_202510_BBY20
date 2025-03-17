// Get the action from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action'); // "login" or "signup"

// Show the appropriate form based on the action
if (action === "signup") {
    document.getElementById("signup-form").style.display = "block";
} else {
    document.getElementById("login-form").style.display = "block";
}

// Event listener for the "Log in" form
document.getElementById("login-submit")?.addEventListener("click", function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email && password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("User logged in:", userCredential.user); // Debugging
                window.location.assign("main.html"); // Redirect to main.html after login
            })
            .catch(function (error) {
                console.log("Error logging in:", error); // Debugging
                alert("Error logging in: " + error.message); // Show error to user
            });
    } else {
        alert("Please fill out all fields."); // Show error if fields are empty
    }
});

// Event listener for the "Sign Up" form
document.getElementById("signup-submit")?.addEventListener("click", function () {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (name && email && password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("New user created:", userCredential.user); // Debugging
                const user = userCredential.user;

                // Write user details to Firestore
                db.collection("users").doc(user.uid).set({
                    name: name,
                    email: user.email,
                    session: "null"
                }).then(function () {
                    console.log("New user added to Firestore"); // Debugging
                    window.location.assign("main.html"); // Redirect to main.html after signup
                }).catch(function (error) {
                    console.log("Error adding new user to Firestore:", error); // Debugging
                });
            })
            .catch(function (error) {
                console.log("Error creating new user:", error); // Debugging
                alert("Error creating account: " + error.message); // Show error to user
            });
    } else {
        alert("Please fill out all fields."); // Show error if fields are empty
    }
});