import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Particles from "vue3-particles";

import router from './router'
createApp(App).use(router).use(Particles).mount('#app')
