// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    onclick: () => { alert("???") }
  };

  let notification = self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
  /* console.log("notification::", self.registration) */
  Notification.onclick = function () {
    alert(JSON.stringify(payload))
    if (payload && payload.order) {
      window.focus();
      window.location.href = `http://localhost:3000/dashboard/orders?order_id=${data.order}`
    }
  };
});
