// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from 'jquery'

import echarts from 'echarts'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

const baseURL = baseURL
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

Vue.prototype.pinyin = pinyin
Vue.prototype.alertTip = alertTip
Vue.prototype.showLoading = showLoading
Vue.prototype.hideLoading = hideLoading
