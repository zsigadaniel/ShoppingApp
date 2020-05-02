import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dom } from '@fortawesome/fontawesome-svg-core'
export const bus = new Vue();
export const train = new Vue();


dom.watch()



library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)



Vue.config.productionTip = false
new Vue({
    render: h => h(App),
}).$mount('#app')