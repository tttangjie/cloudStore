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
        <el-menu-item index="cStore" @click="jumpToHeaderVue('/home/all')">云盘</el-menu-item>
        <el-menu-item index="help">帮助</el-menu-item>
        <el-menu-item index="more">更多</el-menu-item>
      </el-menu>
    </el-col>

    <div v-if="isLogin" class="head_tool_box">
      <el-dropdown class="head_info"  @command="dropDownCommend">
        <div class="el-dropdown-link head_dropdown">
          <img class="head_img" v-bind:src="this.GLOBAL.BASE_URL+'/user/icon/get'" ref="headImgHeadRef">
          <p class="head_username">{{ username }}</p>
          <img v-show="!isVIP" class="head_vip_icon" src="../../assets/icon_no_vip.png">
          <img v-show="isVIP" class="head_vip_icon" src="../../assets/icon_vip.png">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <div class="username_and_img">
              <el-row class="dropdown_item">
                <el-col :span="6">
                  <img class="dropdown_head_img" v-bind:src="this.GLOBAL.BASE_URL+'/user/icon/get'" ref="headImgRef">
                </el-col>
                <el-col :span="17" :offset="1">
                  <p class="dropdown_username">{{ username }}</p>
                  <p v-show="!isVIP" class="dropdown_vip_icon">普通用户<span><img src="../../assets/icon_no_vip.png" /></span></p>
                  <p v-show="isVIP" class="dropdown_vip_icon">VIP用户<span><img src="../../assets/icon_vip.png" /></span></p>
                </el-col>
              </el-row>
            </div>
          <el-dropdown-item  command="beVIP" :disabled="isVIP" >
            <div class="dropdown_item" >成为VIP用户</div>
          </el-dropdown-item>
          <el-dropdown-item command="personal" divided>
            <div class="dropdown_item" >个人资料</div>
          </el-dropdown-item>
          <el-dropdown-item command="exit">
            <div class="dropdown_item">退出登录</div>
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

    <p class="login_or_register" v-if="!isLogin">
      <span class="login_register" @click="jumpToHeaderVue('/')">登录</span> | <span class="login_register" @click="jumpToHeaderVue('/register')">注册</span>
    </p>

  </el-row>

</template>

<script>
    import { Notification } from 'element-ui';
    export default {
      name: "home_header",
      props:['VIPState', 'changeHeadImg'],
      data(){
        return{
          activeIndex:'cStore',
          username:this.$cookie.get('username'),
          isVIP:true,
          headImgRef:'',
          headImgHeadRef:'',
          isLogin:true,
          htmlContent:'',
          showTest:false,
        }
      },
      methods:{
        changeToVIP(){
          if(this.$cookie.get('isVIP') === 'false')
            this.isVIP = false;
          else
            this.isVIP = true;
        },
        jumpToHeaderVue(page) {
          this.$router.push(page)
        },
        handleSelect(homeNav) {
          this.$emit('homeNav',homeNav);
        },
        dropDownCommend(command){
          if(command === 'beVIP'){
            this.$axios.get('./become/vip')
              .then(function (res) {
                this.htmlContent = res.data;

                const div = document.createElement('div');
                div.innerHTML = res.data;
                document.body.appendChild(div);
                document.forms[0].submit();
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })

          } else if(command === 'personal') {
              this.$router.push('/personal');
          } else if(command === 'exit') {
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
          }
        },
        changeHtml (html) {
          return html
            .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#39;/g, "\'");
        },

        showNotice(msg) {
          Notification({
            title: '公告',
            dangerouslyUseHTMLString: true,
            message: msg,
            duration: 0
          });
        },
      },
      mounted(){
        this.changeToVIP();
        if(this.$cookie.get('username')===null){
          this.isLogin = false;
        }
        else {
          let socket = new SockJS(this.GLOBAL.BASE_URL+'/gs-guide-websocket');
          let stompClient = Stomp.over(socket);
          stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/greetings', function (greeting) {
              this.showNotice(this.changeHtml(JSON.parse(greeting.body).content));
            }.bind(this));
          }.bind(this));
        }

      },
      watch:{
        VIPState:function () {
          this.changeToVIP();
        },
        changeHeadImg:function () {
          this.$refs.headImgHeadRef.src = this.$refs.headImgHeadRef.src + '?';
          this.$refs.headImgRef.src = this.$refs.headImgRef.src + '?';
        }
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
  .el-dropdown-menu{
    padding: 0;
    margin: 0;
  }
  .el-dropdown-menu__item{
    width: 260px ;
    padding: 0;
    margin: 0;
  }
  .dropdown_item{
    padding: 3px 15px;
  }
  .username_and_img{
    padding: 0;
    margin: 0;
    height: 90px;
    width: 100%;
    background: #468ce9;;
  }
  .dropdown_head_img {
    height: 55px;
    width: 55px;
    margin-top: 15px;
    line-height: 90px;
    border: 1px solid white;
  }
  .dropdown_username{
    margin-top: 25px;
    font-size: 18px;
    line-height: 18px;
    height: 18px;
    color: white;
    max-width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .dropdown_vip_icon {
    color: #d6d6d6;
  }
  .dropdown_vip_icon img {
    margin-left: 10px;
    width: 15px;
    height: 15px;
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

  .btn_tools button{
    width: 40%;
    margin-left: 5%;
    margin-top: 10%;
  }

  .login_or_register{
    margin-right: 15px;
    float: right;
    color: white;
    line-height: 60px;
    font-size: 14px;
  }
  .login_register:hover{
    cursor: pointer;
  }

  .html_content {
    width: 100%;
    height: 300px;
  }

</style>
