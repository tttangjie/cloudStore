<template>
  <el-container id="home_body">
    <el-header>
      <adminHeader> </adminHeader>
    </el-header>

    <el-main>
      <el-container id="admin_body" >
        <el-aside  width="200px"  class="aside_left" >
          <el-menu
            default-active="dashboard"
            class="el-menu-vertical-demo"
            router
            background-color="transparent"
            text-color="#fff"
            active-text-color="#269D80">
            <el-menu-item index="dashboard"  route="/admin/dashboard">
              <i class="fa fa-home nav_icon"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="range">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户分布</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="area"  route="/admin/region">地区</el-menu-item>
                <el-menu-item index="age" route="/admin/age">年龄</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="users" route="/admin/users">
              <i class="fa fa-user nav_icon"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
            <el-menu-item index="notice" route="/admin/notice">
              <i class="fa fa-flag nav_icon"></i>
              <span slot="title">发布公告</span>
            </el-menu-item>
            <el-menu-item index="info" route="/admin/info">
              <i class="fa fa-vcard-o nav_icon"></i>
              <span slot="title">开发者资料</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="height: 100%;">
          <transition name="fade">
            <router-view> </router-view>
          </transition>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
    import adminHeader from './AdminHeader'
    export default {
        name: "admin",
        components:{
          adminHeader,
        },
        data(){
          return{
            bodyHeight: document.documentElement.clientHeight-60,
          }
        },
        beforeMount() {
          window.onresize = function() {
            this.bodyHeight = document.documentElement.clientHeight-60;
            if (document.getElementById('admin_body')!=null)
              document.getElementById('admin_body').style.height =this.bodyHeight + "px";
          }
        },
        mounted() {
          document.getElementById('admin_body').style.height =this.bodyHeight + "px";
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
  .aside_left {
    height: 100%;
    background: #313131;
  }
  .nav_icon {
    line-height: 56px;
    height: 56px;
    font-size: 19px;
    margin: 0px 5px;
  }
</style>
