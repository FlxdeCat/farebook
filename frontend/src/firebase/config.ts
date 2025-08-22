// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXj-rMqWykNIRz-RM8IjXbEUyqSYyJX6U",
  authDomain: "farebook-6bf9a.firebaseapp.com",
  projectId: "farebook-6bf9a",
  storageBucket: "farebook-6bf9a.appspot.com",
  messagingSenderId: "532596587584",
  appId: "1:532596587584:web:2ee885d3f4321e2c69b3a5",
  measurementId: "G-ML9V92G887"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;