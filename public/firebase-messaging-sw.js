importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDWhETxsBM8hxztEGQ-DawasJcK4bBlk5U",
  authDomain: "whiteline-prod.firebaseapp.com",
  projectId: "whiteline-prod",
  storageBucket: "whiteline-prod.firebasestorage.app",
  messagingSenderId: "475483346381",
  appId: "1:475483346381:web:85bd80ba54e4f4d9f66084",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'WhiteLine';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, { body, icon: '/dashboard_logo.png' });
});
