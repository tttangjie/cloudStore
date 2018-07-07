// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from "./vuex/store";

import global_ from '../static/config/global'
import axios from "axios/index";

Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global_;
axios.defaults.baseURL = global_.BASE_URL;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>'
})

