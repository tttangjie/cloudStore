<template>
  <el-container id="home_body">
      <el-header>
        <home_header v-on:homeNav="homeHeaderChoice"> </home_header>
      </el-header>

    <el-main>
      <cStore v-show='homeNav === "cStore"'> </cStore>
    </el-main>
  </el-container>
</template>

<script>
    import home_header from './HomeHeader'
    import cStore from './Cstore'
    export default {
        name: "home",
        components:{
          home_header,
          cStore,
        },
        data(){
          return{
            homeNav:'cStore',
          }
        },
        methods:{
          homeHeaderChoice(homeNav){
            this.homeNav = homeNav;
          },
        },
    }
</script>

<style scoped>
  .el-header {
    padding: 0;
  }
  .el-main{
    padding: 0;
    min-width: 850px;
  }
</style>
