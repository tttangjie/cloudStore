import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import VueBlu from 'vue-blu'
import Vuex from 'vuex'
import axios from  'axios'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-blu/dist/css/vue-blu.min.css'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
/*axios.defaults.baseURL = 'http://192.168.100.131:8080';*/
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
/*axios.defaults.timeout = 6000;*/

Vue.use(Router);
Vue.use(ElementUI);
Vue.use(VueBlu);
Vue.use(Vuex);

export default new Router({
 /* mode: 'history',*/
  routes: [
    {
      path: '/',
      name: 'Login',
      component: (resolve) => require(['../components/Login'], resolve)
    },
    {
      path: '/register',
      name: 'Register',
      component: (resolve) => require(['../components/Register'], resolve)
    },
    {
      path: '/home',
      name: 'Home',
      component: (resolve) => require(['../components/user/Home'], resolve),
      children:[
        {
          path:'/home/all',
          name:'All',
          component: (resolve) => require(['../components/user/aboutFile/AllFile'], resolve),
        }
      ]
    }
  ]
})

import qs from 'qs'

axios.interceptors.request.use( (config) => {
  if (sessionStorage.userToken) {
    config.headers.Authorization = "Bearer "+sessionStorage.userToken;
  }
  if (config.method == "post"){
    config.data = qs.stringify(config.data);
    config.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
  }
  return config;
},  (error) => {
  return Promise.reject(error);
});

