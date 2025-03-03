// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true;  // This redirects the user to main.html upon successful login
        },
        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: "main.html",  // Redirect to main.html on success
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
};

// Start the FirebaseUI widget
ui.start('#firebaseui-auth-container', uiConfig);
