// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD8cUsxydmtR3hUmzKX7Re2Kernf4quloE",
  authDomain: "item-logs.firebaseapp.com",
  projectId: "item-logs",
  storageBucket: "item-logs.firebasestorage.app",
  messagingSenderId: "761854714969",
  appId: "1:761854714969:web:eaad5b51951a98f93bfd48",
  databaseURL: "https://item-logs-default-rtdb.asia-southeast1.firebasedatabase.app", 
    
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);