// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'

Vue.use(ElementUI)
Vue.use(VCharts)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$qs = qs

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
