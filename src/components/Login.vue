<template>
  <div class="cont">
    <video autoplay loop poster="" id="bgvid">
      <source src="../assets/video/background_mp4.mp4" type="video/mp4">
    </video>

    <el-row class="login_body" id="login_body" >
      <el-row class="login_head">
        <el-col :span="10" :offset="2" class="head_title">
          <img src="../assets/icon.png">
          <p>卓云微盘</p>
        </el-col>
        <el-col :span="2" :offset="10">
          <p class="login_or_register">
            <span class="login_register">登录</span> | <span class="login_register" @click="jumpToRegister">注册</span>
          </p>
        </el-col>
      </el-row>

      <el-col :span="14">
        <div  class="login_title">
          <h3>EXCELLENT.class - 2018</h3>
          <h1>卓 云 微 盘</h1>
          <h3>cloud store</h3>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="login_box">
          <el-tabs v-model="activeChoice" type="card" @tab-click="handleFromClick">

            <el-tab-pane label="密码登录" name="fromPWD">
              <form action="javascript:">
              <el-input
                class="input_box"
                placeholder="用户名"
                v-model="username"
                clearable
                id="setInputPWD"
                name="username">
              </el-input>
              <el-input
                class="input_box"
                type="password"
                placeholder="请输入您的密码"
                v-model="pwd"
                name="password">
              </el-input>
              <div class="input_box code_box">
                <el-input
                  class="input_code"
                  placeholder="验证码"
                  v-model="imageCode"
                  name="imageCode"
                  @keyup.native.enter="login">
                </el-input>
                <!--使用后台存入session中随机生成的验证码-->
                <img v-bind:src="this.GLOBAL.BASE_URL+'/code/image'" ref="imageCodeRef" @click="changeImgCode">
                </div>

                <el-row class="login_tool">
                  <el-col :span="14">
                    <el-checkbox name="remember-me" v-model="autoLogin" v-bind:value="autoLogin">下次自动登录</el-checkbox>
                  </el-col>
                  <el-col :span="10"><p class="forget_pwd" @click="jumpToForget">忘记密码？</p></el-col>
                </el-row>
              </form>
            </el-tab-pane>

            <el-tab-pane label="快捷登录" name="fromPhone">
              <el-input
                class="input_box"
                placeholder="手机号"
                v-model="phone"
                clearable
                id="setInputPhone">
              </el-input>
              <div class="input_box code_box">
                <el-input
                  class="input_code"
                  placeholder="短信验证码"
                  v-model="msgCode">
                </el-input>
                <el-button type="primary" @click="checkAndSendPhone"
                   v-bind:disabled="!canClick">{{btnContent}}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="btn_tools">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="jumpToRegister">注册</el-button>
          </div>
        </div>
      </el-col>
    </el-row>


   <!-- <div class="info_body">
      <div>
        <p class="info_title"><span>-</span>智能化的上传管理<span>-</span></p>
        <el-row class="info_body_block">
          <el-col :span="8">
            <div class="info_box"><p>分片上传</p></div>
            <p class="info_intro">将一个大文件分割成多块，极大地提高大文件的上传速度。</p>
          </el-col>
          <el-col :span="8">
            <div class="info_box"><p>断点续传</p></div>
            <p class="info_intro">当网络问题导致传输错误时,可继续上传未传过的分片。</p>
          </el-col>
          <el-col :span="8">
            <div class="info_box"><p>极速秒传</p></div>
            <p class="info_intro">支持上传前做文件md5值验证，一致则可直接跳过。</p>
          </el-col>
        </el-row>
      </div>
      <div>
        <p class="info_title"><span>-</span>稳定可靠的文件管理<span>-</span></p>
        <el-row class="info_body_block">
          <el-col :span="8">
            <div class="info_box"><p>文件预览</p></div>
            <p class="info_intro">支持一切office、图片、音频、视频文件在线预览。</p>
          </el-col>
          <el-col :span="8">
            <div class="info_box"><p>加密分享</p></div>
            <p class="info_intro">更加安全可靠的加密分享机制。</p>
          </el-col>
          <el-col :span="8">
            <div class="info_box"><p>在线解压</p></div>
            <p class="info_intro">无须VIP，多种压缩包在线解压。</p>
          </el-col>
        </el-row>
      </div>
    </div>-->

    <div>
      <!--账号异常-->
      <el-dialog
        title="账号异常"
        :visible.sync="showAbnormalDialog"
        width="30%"
        center>
        <span>检测到您的账号异常，是否需要进行申诉？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAbnormalDialog = false">取 消</el-button>
          <el-button type="primary" @click="showAppealDialog  = true; showAbnormalDialog = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--申诉-->
      <el-dialog
        title="用户申诉"
        :visible.sync="showAppealDialog"
        width="50%">
        <span>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入申诉内容"
            v-model="appealContent">

          </el-input>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showAppealDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitAppeal">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>


</template>

<script>
  import {userRoutes, adminRoutes, falseRoutes, constantRouterMap} from "../router";
  import router from '../router'
  export default {
        name: "login",
        data() {
          return {
            bodyHeight: document.documentElement.clientHeight + "px",
            activeChoice: 'fromPWD',
            autoLogin:false,

            username:'',
            pwd:'',
            imageCode:'',
            imageCodeRef:'',

            phone:'',
            msgCode:'',

            countDown:60, /*发送验证码60s倒计时*/
            canClick:true,
            btnContent:"发送",

            showAppealDialog:false,
            showAbnormalDialog:false,
            appealContent:'',
          }
        },
        methods:{
          jumpToRegister(){
            this.$router.push('/register');
          },
          jumpToForget(){
            this.$router.push('/forget');
          },
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          sendMsg() {
            this.$axios.get('/code/sms',
              {
                params:{
                  mobile:this.phone,
                }
              })
              .then(function () {
                this.drawMsg('success', '验证码发送成功');
                this.setTime();
              }.bind(this))
              .catch(function (err) {
                this.drawMsg('error','验证码发送失败');
                console.log(err);
              }.bind(this));
          },
          setTime() {
            if (!this.canClick)
              return 0;
            this.canClick = false;
            this.btnContent = this.countDown + "s";
            let clock = window.setInterval(() => {
              this.countDown--;
              this.btnContent = this.countDown + "s";
              if(this.countDown < 0) {
                window.clearInterval(clock);
                this.btnContent = "发送";
                this.countDown = 60;
                this.canClick = true;
              }
            }, 1000)
          },
          loginSuccess(res){
            console.log(res)
            this.$store.state.token = res.data.Token;
            this.$store.state.role = res.data.role;
            this.$store.state.username = res.data.username;
            this.$store.state.phone = res.data.tel;
            sessionStorage.userToken =  this.$store.state.token;

            this.$cookie.set('isVIP', res.data.isVIP);
            this.$cookie.set('username', this.$store.state.username);
            this.$cookie.set('phone', this.$store.state.phone);

            if(res.data.role === '[ROLE_USER]'){
              this.$router.addRoutes(userRoutes);
              this.$cookie.set('role', 'user');
              this.$router.addRoutes(falseRoutes);
              this.$router.push('/home/all');
            }
            else if(res.data.role === '[ROLE_ADMIN]') {
              this.$router.addRoutes(adminRoutes);
              this.$cookie.set('role', 'admin');
              this.$router.addRoutes(falseRoutes);
              this.$router.push('/admin/dashboard');
            }
          },
          /*发送登录请求*/
          login() {
            if(this.activeChoice === 'fromPWD') {
              this.loginWithPWD();
            } else {
              this.loginWithPhone();
            }
          },
          askForLoginWithPWD(){
            this.$axios.post('/authentication/login',
              {
                  'username':this.username,
                  'password':this.pwd,
                  'imageCode':this.imageCode,
              })
              .then(function (res) {
                if ( res.data.code === 0) {
                  if(res.data.state === '0'){
                    this.showAbnormalDialog = true;
                    this.username = res.data.username;
                    return ;
                  }
                  this.drawMsg('success', '登录成功！');
                  this.loginSuccess(res);
                }
                else if( res.data.code === 1) {
                  if(res.data.msg === "Bad credentials")
                    this.drawMsg('error', '用户名或密码输入错误');
                  else if(res.data.msg === "验证码不存在")
                    this.drawMsg('error', '验证码过期');
                  else if(res.data.msg === "验证码错误")
                    this.drawMsg('error', '验证码错误');
                  this.changeImgCode()
                }
              }.bind(this))
              .catch(function (err) {
                //alert(err.response.data.content)
                console.log(err)
              })
          },
          askForLoginWithPhone(){
            this.$axios.post('/authentication/mobile',
              {
                  mobile:this.phone,
                  smsCode:this.msgCode,
             })
              .then(function (res) {
                if(res.data.code === 0) {
                  if(res.data.state === '0'){
                    this.showAbnormalDialog = true;
                    this.username = res.data.username;
                    return ;
                  }
                  this.drawMsg('success', '登录成功！');
                  this.loginSuccess(res)
                }
                else if (res.data.code === 1) {
                  this.drawMsg('error', '短信验证码错误');
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          loginWithPWD() {
            if (this.username === '')
              this.drawMsg('warning', '用户名不能为空');
            else if(this.username.indexOf(" ") != -1 )
              this.drawMsg('warning', '用户名中不可携带空格');
            else if (this.pwd === '')
              this.drawMsg('warning', '密码不能为空');
            else if (this.imageCode === '')
              this.drawMsg('warning', '验证码不能为空');
            else
              this.askForLoginWithPWD();
          },
          loginWithPhone() {
            if (this.phone === '')
              this.drawMsg('warning', '手机号不能为空');
            else if (this.msgCode === '')
              this.drawMsg('warning', '短信验证码不能为空');
            else
              this.askForLoginWithPhone();
          },
          checkAndSendPhone(){
            if(this.phone === ''){
              this.drawMsg('warning', '请先输入手机号');
              return 0;
            }
            this.$axios.get('/user/check',
              {
                params:{
                  tel:this.phone,
                }
              })
              .then(function (res) {
                if(res.data.code === 0)
                  this.drawMsg('error', '该手机号未被注册');
                else if(res.data.code === 1) {
                  this.sendMsg();
                }
              }.bind(this))
              .catch((function (err) {
                console.log(err);
              }))
          },
          changeImgCode() {
            this.$refs.imageCodeRef.src = this.$refs.imageCodeRef.src + '?'
          },
          handleFromClick() {
            if(this.activeChoice === 'fromPWD') {
              setTimeout(function () {
                document.getElementById('setInputPWD').focus();
                }, 5);
            }
            else {
              setTimeout(function () {
                document.getElementById('setInputPhone').focus();
              }, 5)
            }
          },
          submitAppeal() {
            this.$axios.post('comSub',
              {
                username:this.username,
                cominfo:this.appealContent,
              })
              .then(function (res) {
                this.showAppealDialog = false;
                if(res.data === '申诉成功，请耐心等候')
                  this.drawMsg('success', res.data);
                else if(res.data === '已经申诉过了，请稍后再试')
                  this.drawMsg('warning', res.data);
                else if(res.data === '您之前提交的申诉审核失败,请重新申诉') {
                  this.drawMsg('warning', res.data);
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },
        created() {
          this.$cookie.delete('role');
          router.options.routes = constantRouterMap;
        },
        beforeMount() {
          window.onresize = function() {
            this.bodyHeight = document.documentElement.clientHeight + "px";
            if (document.getElementById('login_body')!=null)
              document.getElementById('login_body').style.height =this.bodyHeight;
          }
        },
        mounted() {
          document.getElementById('login_body').style.height =this.bodyHeight;
          document.getElementById('setInputPWD').focus();
          this.$store.state.headImgFlag = true;
        },
    }
</script>

<style scoped>
  @import url("https://fonts.googleapis.com/css?family=Montserrat:200,300,400,600");
/*
  登录页头部相关样式
*/
  .login_head {
    width: 100%;
    height:70px;
    color: white;
    background: rgba(0, 0, 0, 0.41);
    padding: 10px;
  }
  .head_title {
    display: inline-flex;
  }
  .head_title img {
    height: 50px;
  }
  .head_title p {
    line-height: 50px;
    text-align: center;
    font-size: 25px;
    margin: 5px;
  }
  .login_or_register{
    color: white;
    line-height: 50px;
    font-size: 16px;
  }
  .login_register:hover{
    cursor: pointer;
  }

/*
  登录页整体及左侧介绍相关样式
*/
  video#bgvid {
    position: absolute;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    background: url('../assets/video/background.png') no-repeat;
    background-size: cover;
  }
  video {
    display: block;
  }
  .login_body {
    min-width: 850px;
    overflow: hidden;
    min-height: 650px;
    width: 100%;

  }
  .login_title {
    position: relative;
     min-width: 420px;
     margin-top: 40%;
     margin-left: 45%;
     transform: translateX(-50%) translateY(-50%);
     font-family: "Montserrat";
     text-align: center;
     width: 100%;
   }
  .login_title h1 {
    position: relative;
    color: #EEEEEE;
    font-weight: 600;
    font-size: 70px;
    line-height: 1;
    text-shadow: 0 0 30px #000155;
  }
  .login_title h3 {
    font-size: 20px;
    font-weight: 200;
    line-height: 1;
    color: #EEEEEE;
    letter-spacing: 2px;
    text-shadow: 0 0 30px #000155;
    margin: 15px;
  }

/*
  登录表单相关样式
*/
  .login_box {
    width: 70%;
    min-height: 60%;
    min-width: 400px;
    margin: 20% 0;
    padding: 40px;
    background-color: rgb(255, 255, 255);
    border: 2px ridge rgba(238, 238, 238, 0.13);
    border-radius: 5px;
    box-shadow: 0 0 18px 0 rgba(57, 141, 238, 0.12);
  }
  .input_box{
    margin:2% 10% ;
    max-width: 70%;
  }
  .code_box {
    display: inline-flex;
  }
  .input_code {
    width: 55%;
  }
  .code_box img,button {
    width: 40%;
    height: 40px;
    margin-left: 5%;
  }
  .login_tool {
    margin: 4% 10%;
  }
  .forget_pwd {
    margin-left:20%;
  }
  .forget_pwd:hover {
    cursor: pointer;
    color: #409EFF;
  }
  .btn_tools button{
    width: 40%;
    margin-left: 5%;
    margin-top: 10%;
  }

 /*
   消息提示相关样式
 */
  .alert_style {
    width: 30%;
    margin-left: 35%;
  }
  .appeal {
    color: red;
  }

  .info_body {
    width: 60%;
    margin-left: 20%;
  }
  .info_title{
    margin-top: 60px;
    text-align: center;
    color: #3c4441;
    font-size: 24px;
    height: 60px;
    line-height: 60px;
  }
  .info_title span {
    color: #409eff;
    margin: 0 10px;
    font-weight: 900;
  }
  .info_body_block {
    margin-top: 30px;
  }
  .info_box{
    width: 100px;
    height: 100px;
    border-radius: 180px;
    background: rgba(64, 158, 255, 0.76);
    margin: auto;
    transform: scale(1);
    transition: all 1s ease 0s;
    -webkit-transform: scale(1);
  }
  .info_box:hover{
    transform: scale(1.2);
    transition: all 1s ease 0s;
    -webkit-transform: scale(1.2);
  }
  .info_box p {
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: white;
    font-size: 18px;
  }
  .info_intro {
    width: 150px;
    margin:30px auto;
  }
</style>
