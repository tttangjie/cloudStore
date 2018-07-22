<template>
  <el-row class="head_contain">
    <el-col :span="8"  class="head_title">
      <img src="../../assets/icon.png">
      <p>卓云微盘后台管理系统</p>
    </el-col>

    <div  class="head_tool_box" >
        <div class="el-dropdown-link head_dropdown">
          <p class="head_username">管理员： {{ username }}</p>
        </div>
      <p class="exit_login" @click="loginOut">退出</p>
    </div>
  </el-row>
</template>

<script>
    export default {
        name: "admin-header",
        data(){
          return{
            username:this.$cookie.get('username'),
          }
        },
        methods:{

          loginOut(){
            this.$axios.get('/loginPage?logout')
              .then(function (res) {
                if(res.data.code === 100) {
                  this.$router.push('/');
                  this.$store.state.token = '';
                  this.$store.state.role = '';
                  this.$store.state.username = '';
                  this.$store.state.phone = '';
                  sessionStorage.userToken =  '';
                  this.$cookie.delete('username');
                  this.$cookie.delete('phone');
                  this.$cookie.delete('role');
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
        }
    }
</script>

<style scoped>
  .head_contain  {
    width: 100%;
    height: 100%;
    background: #313131;
    min-width: 1050px;
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

  .head_tool_box {
    display: inline-flex;
    color: #FFFFFF;
    float: right;
    margin-right: 20px;
  }
  .head_dropdown{
    display: inline-flex;
    float: right;
  }

  .head_username  {
    font-size: 13px;
    margin: 21px 10px;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .exit_login {
    line-height: 60px;
    height: 60px;
    margin-left: 15px;
  }
  .exit_login:hover {
    cursor: pointer;
  }

  .head_info i {
    font-size: 13px;
    margin: 25px 6px;
  }
  .dropdown_item {
    padding: 3px 15px;
  }

</style>
