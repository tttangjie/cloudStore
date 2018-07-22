import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import VueBlu from 'vue-blu'
import Vuex from 'vuex'
import axios from  'axios'
import VueCookie from 'vue-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-blu/dist/css/vue-blu.min.css'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
/*axios.defaults.baseURL = 'http://192.168.100.131:8080';*/
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
/*axios.defaults.timeout = 6000;*/

Vue.use(ElementUI);
Vue.use(VueBlu);
Vue.use(Vuex);
Vue.use(VueCookie)

export const constantRouterMap = [
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
    path: '/share/:id',
    name: 'Share',
    component: (reslove) => require(['../components/user/aboutShare/ShareLink'], reslove),
  },

]
Vue.use(Router);

export default new Router({
 /* mode: 'history',*/
  routes: constantRouterMap
})


 const userRoutes = [
    {
      path: '/home',
      name: 'Home',
      meta:{
        role:['user']
      },
      component: (resolve) => require(['../components/user/Home'], resolve),
      children:[
        {
          path:'/home/all',
          name:'All',
          meta:{
            role:['user']
          },
          component: (resolve) => require(['../components/user/aboutFile/AllFile'], resolve),
        },
        {
          path:'/home/recycle',
          name:'Recycle',
          meta:{
            role:['user']
          },
          component: (resolve) => require(['../components/user/aboutRecycle/Recycle'], resolve),
        },
        {
          path:'/home/category',
          name:'Category',
          meta:{
            role:['user']
          },
          component: (resolve) => require(['../components/user/aboutCategory/Category'], resolve),
        },
        {
          path:'/home/share',
          name:'MyShare',
          meta:{
            role:['user']
          },
          component: (resolve) => require(['../components/user/aboutShare/MyShare'], resolve),
        }
      ]
    },
    {
      path: '/personal',
      name: 'Personal',
      meta:{
        role:['user']
      },
      component: (reslove) => require(['../components/user/personalManagement/Personal'], reslove),
    }
  ];

  const adminRoutes = [
    {
      path: '/admin',
      name: 'Admin',
      meta:{
        role:['admin']
      },
      component: (resolve) => require(['../components/admin/Admin'], resolve),
      children:[
        {
          path: '/admin/dashboard',
          name: 'Dashboard',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutDashboard/Dashboard'], resolve)
        },
        {
          path: '/admin/users',
          name: 'Users',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutUsers/Users'], resolve)
        },
        {
          path: '/admin/info',
          name: 'Info',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutInfo/Info'], resolve)
        },
        {
          path: '/admin/region',
          name: 'Region',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutEchars/userRegion'], resolve)
        },
        {
          path: '/admin/age',
          name: 'Age',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutEchars/userAge'], resolve)
        },
        {
          path: '/admin/notice',
          name: 'Notice',
          meta: {
            role: ['admin']
          },
          component: (resolve) => require(['../components/admin/aboutNotice/Notice'], resolve)
        }
      ]
    }

  ];
  const falseRoutes = [
  {
    path:'/404',
    component:(reslove) => require(['../components/404'], reslove),
  },
  {
    path:'*',
    redirect:'/404'
  }
]

export {userRoutes, adminRoutes, falseRoutes}

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

