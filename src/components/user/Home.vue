<template>
  <el-container id="home_body">
      <el-header>
        <home_header v-on:homeNav="homeHeaderChoice"> </home_header>
      </el-header>

    <el-main>
      <cStore v-show='homeNav === "cStore"'> </cStore>
      <help v-show="homeNav === 'help'"> </help>
      <more v-show="homeNav === 'more'"> </more>
    </el-main>
  </el-container>
</template>

<script>
    import home_header from './HomeHeader'
    import cStore from './Cstore'
    import help from './Help'
    import more from './More'
    export default {
        name: "home",
        components:{
          home_header,
          cStore,
          help,
          more,
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
    min-width: 1050px;
  }
</style>
