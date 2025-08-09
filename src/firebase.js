/*firebase daniel start*/
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCx6MGJKuGg_BOWuN4xAqspViZS1XJMapk",
  authDomain: "apparta-app.firebaseapp.com",
  databaseURL: "https://apparta-app.firebaseio.com",
  projectId: "apparta-app",
  storageBucket: "apparta-app.appspot.com",
  messagingSenderId: "927332588055",
  appId: "1:927332588055:web:418449ed05f9fbba91da52",
  measurementId: "G-S64EJKSEMC",
};

const fapp = initializeApp(firebaseConfig);
const messaging = getMessaging(fapp);

getToken(messaging, {
  vapidKey:
    "BJscdz8mrOfOES_F2M2UWH7yvxKzDIayIFjzfhFdfwDEgsELiRC0Ewc-UON1-gUpY3LuZ-yb0IYXNXf8sbJGfjc",
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("Firebase Token");
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // ...
});

/*firebase daniel end*/
