const firebaseConfig = {
  apiKey: "AIzaSyBf5lQpTc3ylVUktOtGYi8D8QOwLwRmQbo",
  authDomain: "aisin-support.firebaseapp.com",
  projectId: "aisin-support"
}

window.firebaseApp = firebase.initializeApp(firebaseConfig);
window.db = window.firebaseApp.firestore();
