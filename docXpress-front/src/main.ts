import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

import App from './App.vue';
import router from './router';

const firebaseConfig = {
  apiKey: 'AIzaSyCF5sHsekhEe-_y7s0Hha_NIAjmE8JK42A',
  authDomain: 'docxpress-77939.firebaseapp.com',
  projectId: 'docxpress-77939',
  storageBucket: 'docxpress-77939.appspot.com',
  messagingSenderId: '989267613866',
  appId: '1:989267613866:web:d988bfcfd503aa101418d3',
  measurementId: 'G-Z1T50F1JDL',
};

const firebase = initializeApp(firebaseConfig);
getAnalytics(firebase);
getDatabase(firebase);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
