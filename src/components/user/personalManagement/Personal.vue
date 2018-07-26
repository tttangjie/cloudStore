<template>
    <div>
      <home_header :VIPState="isVIP" :changeHeadImg="changeHeadImg"> </home_header>

      <div id="personal_body" class="personal_body">
        <el-tabs tab-position="left" class="tabs_menu" v-model="activePersonal">
          <el-tab-pane name="home">
            <span slot="label" > 首页 </span>
            <per_home @changeVIPState="changeVIPState" :changeHeadImg="changeHeadImg"> </per_home>
          </el-tab-pane>
          <el-tab-pane name="modifyInfo">
            <span slot="label" > 信息修改 </span>
            <per_modify_info @modifyHeadImg = modifyHeadImg> </per_modify_info>
          </el-tab-pane>
          <el-tab-pane name="modifyPWD">
            <span slot="label" > 密码修改 </span>
            <per_modify_pwd> </per_modify_pwd>
          </el-tab-pane>
          <el-tab-pane name="modifyPhone">
            <span slot="label" > 手机号更改 </span>
            <per_modify_phone> </per_modify_phone>
          </el-tab-pane>
          <el-tab-pane name="privatePWD">
            <span slot="label" > 私人空间密码 </span>
            <per_private_pwd> </per_private_pwd>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
  import home_header from '../HomeHeader'
  import per_home from './PerHome'
  import per_modify_pwd from './PerModifyPWD'
  import per_modify_info from './PerModifyInfo'
  import per_private_pwd from './PerPrivatePWD'
  import per_modify_phone from './PerModifyPhone'
    export default {
        name: "personal",
        components:{
          home_header,
          per_home,
          per_modify_pwd,
          per_modify_info,
          per_private_pwd,
          per_modify_phone,
        },
        data(){
          return{
            bodyHeight: document.documentElement.clientHeight-65,
            activePersonal: 'home',
            isVIP:this.$cookie.get('isVIP'),
            changeHeadImg:false,
          }
        },
        methods:{
          changeVIPState(state){
            if(state === 'false')
              this.isVIP = false;
            else
              this.isVIP = true;
          },
          modifyHeadImg(){
            this.changeHeadImg = !this.changeHeadImg;
          }
        },
        beforeMount() {
          window.onresize = function() {
            this.bodyHeight = document.documentElement.clientHeight-65;
            if (document.getElementById('personal_body')!=null)
              document.getElementById('personal_body').style.height =this.bodyHeight + "px";
          }
        },
        mounted() {
          document.getElementById('personal_body').style.height =this.bodyHeight + "px";
        },
    }
</script>

<style scoped>
  .tabs_menu {
    height: 100%;
    padding-top: 3%;
    padding-left: 10%;
  }
</style>
