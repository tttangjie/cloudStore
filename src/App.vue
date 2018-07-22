<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
  import {userRoutes, adminRoutes, falseRoutes} from './router'

  export default {
    name: 'App',
    created(){
      if(this.$cookie.get('role') === 'user') {
        this.$router.addRoutes(userRoutes);
      }
      else if(this.$cookie.get('role') === 'admin') {
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
