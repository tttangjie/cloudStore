<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
  import {userRoutes, adminRoutes, falseRoutes, constantRouterMap} from './router'

  export default {
    name: 'App',
    created(){
      if(this.$cookie.get('role') === 'user') {
        this.$router.options.routes = constantRouterMap;
        this.$router.addRoutes(userRoutes);
      }
      else if(this.$cookie.get('role') === 'admin') {
        this.$router.options.routes = constantRouterMap;
        this.$router.addRoutes(adminRoutes);
      }
      this.$router.addRoutes(falseRoutes);
    }
  }
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
