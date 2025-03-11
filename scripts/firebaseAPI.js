// Firebase v8 Initialization
var firebaseConfig = {
    apiKey: "AIzaSyB7qPRsyeC7zMbuVqV2GVh1PJAxo0F088g",
    authDomain: "campusnav-8ebd2.firebaseapp.com",
    projectId: "campusnav-8ebd2",
    storageBucket: "campusnav-8ebd2.appspot.com", // Fixed this line
    messagingSenderId: "246201040989",
    appId: "1:246201040989:web:dddedb4520551afda34db4"
  };
  
  // Initialize Firebase  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  

