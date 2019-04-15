import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import Vue2Filters from 'vue2-filters'

import App from './App'
import router from './router'
import store from './store'
import './assets/style.scss'
import db from './datastore'

Vue.prototype.$db = db
Vue.use(Buefy)
Vue.use(Vue2Filters)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
