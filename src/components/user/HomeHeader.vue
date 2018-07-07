<template>
  <el-row class="head_contain">
    <el-col :span="4"  class="head_title">
      <img src="../../assets/icon.png">
      <p>卓云微盘</p>
    </el-col>

    <el-col :span="4"  class="head_menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        background-color="#313131"
        text-color="#FFFFFF"
        active-text-color="#FFFFFF"
        mode="horizontal"
        @select="handleSelect">
        <el-menu-item index="cStore">云盘</el-menu-item>
        <el-menu-item index="help">帮助</el-menu-item>
        <el-menu-item index="more">更多</el-menu-item>
      </el-menu>
    </el-col>

    <div class="head_tool_box">
      <el-dropdown class="head_info">
        <div class="el-dropdown-link head_dropdown">
          <img class="head_img" src="../../assets/default_head_img.jpg">
          <p class="head_username">{{ username }}</p>
          <img class="head_vip_icon" src="../../assets/icon_no_vip.png">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            个人资料
          </el-dropdown-item>
          <el-dropdown-item>
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="head_line">|</div>
      <div class="head_tools">
        <i class="fa fa-bell-o"></i>
        <i class="fa fa-envelope-o"></i>
        <i class="fa fa-bolt"></i>
      </div>
    </div>
  </el-row>
</template>

<script>
    export default {
      name: "home_header",
      data(){
        return{
          activeIndex:'cStore',
          username:'拟糖',
        }
      },
      methods:{
        handleSelect(homeNav) {
          this.$emit('homeNav',homeNav);
        }
      },
      mounted(){

      }
    }
</script>

<style scoped>
  .head_contain  {
    width: 100%;
    height: 100%;
    background: #313131;
    min-width: 850px;
  }
  .head_title {
    display: inline-flex;
    padding: 5px 10px;
    min-width: 180px;
  }
  .head_title img {
    height: 50px;
  }
  .head_title p {
    line-height: 45px;
    text-align: center;
    font-size: 23px;
    margin: 5px;
    color: #f3f3f3;
  }

  .head_menu {
    min-width: 220px;
  }
  .head_menu .el-menu {
    border: 0;
  }
  .head_menu .el-menu-item {
    height: 50px;
  }

  .head_tool_box {
    display: inline-flex;
    color: #FFFFFF;
    min-width: 200px;
    float: right;
    margin-right: 20px;
  }
  .head_info {
    display: inline-flex;
    color: white;
  }
  .head_dropdown{
    display: inline-flex;
  }
  .head_img {
    height: 30px;
    width: 30px;
    margin-top: 14px;
    border-radius: 90px;
    border: #FFFFFF solid 1px;
  }
  .head_username  {
    font-size: 13px;
    margin: 21px 10px;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .head_vip_icon {
    height: 22px;
    width: 22px;
    margin-top: 16px;
  }
  .head_info i {
    font-size: 13px;
    margin: 25px 6px;
  }

  .head_line {
    margin: 21px 15px;
    font-size: 13px;
  }
  .head_tools{
    font-size: 19px;
    margin-top: 23px;
  }
  .head_tools i {
    margin-left: 8px;
  }

</style>
