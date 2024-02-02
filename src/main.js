import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { loadFonts } from './plugins/webfontloader';
import router from './router'; // Import the router
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'leaflet/dist/leaflet.css';


loadFonts();

// Add FontAwesome icons to the library
library.add(faMapPin);

const vuetify = createVuetify({
  // Vuetify options
});

createApp(App)
  .use(vuetify)
  .use(router) // Use the router
  .component('font-awesome-icon', FontAwesomeIcon) // Register FontAwesomeIcon globally
  .mount('#app');
