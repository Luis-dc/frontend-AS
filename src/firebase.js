// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as gaLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDyvZfJtJAUQ8i4JjoiwnKFknNwXOY7KqQ",
  authDomain: "auditoriasocial.firebaseapp.com",
  projectId: "auditoriasocial",
  storageBucket: "auditoriasocial.firebasestorage.app",
  messagingSenderId: "1028966724254",
  appId: "1:1028966724254:web:24c6af3b731eee3cbbc18f",
  measurementId: "G-XYECDTHL13",
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Firebase Analytics no se pudo inicializar:", err);
  }
}

export function logAnalyticsEvent(name, params = {}) {
  if (!analytics) return;
  gaLogEvent(analytics, name, params);
}