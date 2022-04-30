import App from './App'
// #ifndef VUE3
import Vue from 'vue'

import uni_section from './components/uni-section/uni-section.vue';

Vue.config.productionTip = false
Vue.component('uni_section', uni_section);
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif