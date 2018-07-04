<template>
  <div>
    <el-row class="register_contain">
      <el-col :span="7" class="register_affix">
        <el-carousel class="register_image" id="register_image_box" :interval="5000" arrow="none" :height=bodyHeight>
          <el-carousel-item
            v-for="(item, index) in imageList"
            :key="index">
            <img :src="item.src">
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="12" :offset="12" class="register_welcome">欢迎注册卓云微盘</el-col>
      <el-col :span="7" :offset="12 " class="register_box">
        <div class="register_title">
          <p>每一天，快乐相伴</p>
        </div>

        <div class="register_form">
          <div class="bring_info">
            <el-input
              id="inputUsername"
              class="input_box"
              placeholder="用户名"
              v-on:blur="checkUsername"
              v-on:focus="showUsernameSuccess = false"
              v-model="registerData.username">
              <i slot="suffix" class="el-input__icon el-icon-check" v-show="showUsernameSuccess"></i>
            </el-input>
            <el-tooltip class="item" effect="dark"  placement="right">
              <div slot="content">
                用户名不可携带空格
              </div>
              <i class="el-icon-info" ></i>
            </el-tooltip>
          </div>

          <div class="bring_info">
            <el-input
              class="input_box"
              placeholder="密码"
              type="password"
              v-model="registerData.password">
            </el-input>

            <el-tooltip class="item" effect="dark"  placement="right">
              <div slot="content">
                密码长度在6~16之间<br/>
                且不能含有空格
              </div>
              <i class="el-icon-info" ></i>
            </el-tooltip>
          </div>

          <el-input
            class="input_box"
            placeholder="手机号"
            clearable
            v-model="registerData.phone">
            <template slot="prepend">+86</template>
          </el-input>

          <div class="input_box code_box">
              <el-input
                class="input_code"
                placeholder="短信验证码"
                v-model="registerData.code">
              </el-input>
              <el-button
                type="primary"
                @click="checkAndSendPhone"
                v-bind:disabled="!phoneVerify.canClick">
                <!--:class="{send_disabled: !phoneVerify.canClick}"-->
                {{phoneVerify.btnContent}}
              </el-button>
          </div>


          <el-checkbox v-model="knowService">我已阅读并同意相关服务条款和隐私政策</el-checkbox>
          <el-button
            class="register_btn"
            type="primary"
            @click="register">
            注册
          </el-button>
          <el-button
            class="register_btn"
            type="primary" plain
            @click="jumpToLogin">
            登录
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "register",
        data(){
          return {
            bodyHeight: document.documentElement.clientHeight + "px",
            registerData: {
              username:'',
              password:'',
              phone:'',
              code:'',
            },
            showUsernameSuccess:false,
            phoneVerify:{
              btnContent:'发送',
              canClick:true,
              countDown:60,
            },
            knowService:false,
            imageList:[{src: require('../assets/login_back_2.jpg')},{src:require('../assets/login_back.jpg')}],
          }
        },
        methods:{
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
                  mobile:this.registerData.phone,
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
            if (!this.phoneVerify.canClick)
              return 0;
            this.phoneVerify.canClick = false;
            this.phoneVerify.btnContent = this.phoneVerify.countDown + "s";
            let clock = window.setInterval(() => {
              this.phoneVerify.countDown--;
              this.phoneVerify.btnContent = this.phoneVerify.countDown + "s";
              if(this.phoneVerify.countDown < 0) {
                window.clearInterval(clock);
                this.phoneVerify.btnContent = "发送";
                this.phoneVerify.countDown = 60;
                this.phoneVerify.canClick = true;
              }
            }, 1000)
          },
          checkUsername(){
            if(this.registerData.username.indexOf(" ") != -1 )
              this.drawMsg('warning', '用户名中不可携带空格');
            else if(this.registerData.username != ''){
              this.$axios.get('/user/check',
                {
                  params:{
                    username:this.registerData.username,
                  }
                })
                .then(function (res) {
                  if(res.data.code === 1)
                    this.drawMsg('error', '用户名已存在');
                  else if(res.data.code === 0)
                    this.showUsernameSuccess = true;
                }.bind(this))
                .catch((function (res) {
                  console.log(res);
                }))
            }
          },
          checkAndSendPhone(){
              if(this.registerData.phone === ''){
                this.drawMsg('warning', '请先输入手机号');
                return 0;
              }
              this.$axios.get('/user/check',
                {
                  params:{
                    tel:this.registerData.phone,
                  }
                })
                .then(function (res) {
                  if(res.data.code === 1)
                    this.drawMsg('error', '手机号已被注册');
                  else if(res.data.code === 0) {
                    this.sendMsg();
                  }
                }.bind(this))
                .catch((function (res) {
                  console.log(res);
                }))
          },
          askForRegister(){
            this.$axios.post('/register',
              {
                  'username': this.registerData.username,
                  'tel': this.registerData.phone,
                  'password': this.registerData.password,
                  'sms': this.registerData.code,
                })
              .then(function (res) {
                if(res.data.code === 0) {
                  this.drawMsg('success','账号注册成功！')
                }
                else if(res.data.code === 1) {
                  if(res.data.msg === '验证码错误')
                    this.drawMsg('error', '验证码错误');
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          register(){
            if(this.registerData.username === '')
              this.drawMsg('warning', '用户名不能为空');
            else if(this.registerData.password.length < 6 || this.registerData.password.length>16 )
              this.drawMsg('warning', '密码长度应在6~16之间');
            else if(this.registerData.phone === '')
              this.drawMsg('warning', '手机号不能为空');
            else if(this.registerData.code === '')
              this.drawMsg('warning', '短信验证不能为空');
            else
              this.askForRegister();
          },
          jumpToLogin() {
            this.$router.push('/');
          }
        },
        beforeMount(){
          window.onresize = function () {
            this.bodyHeight = window.innerHeight + "px";

            if(document.getElementById('register_image_box') != null) {
              document.getElementById('register_image_box').style.height = this.bodyHeight;
              document.getElementById('register_image_box').children[0].style.height = this.bodyHeight;
            }
          }
        },
        mounted(){
          document.getElementById('register_image_box').style.height =this.bodyHeight;
          document.getElementById('register_image_box').children[0].style.height = this.bodyHeight;

          document.getElementById('inputUsername').focus();
        },
    }
</script>

<style scoped>
  .register_contain {
    min-width: 900px;
  }
  .register_image{
    position: absolute;
    width: 35%;
    max-width: 500px;
    min-width: 400px;
  }
  .register_image img {
    height: 100%;
  }
  .register_box {
    max-width: 400px;
    min-width: 400px;
  }
  .register_welcome {
    font-size: 44px;
    margin-bottom: 20px;
    margin-top: 80px;
  }
  .register_title p{
    font-size: 28px;
    margin-bottom: 64px;
    line-height: 1.2;
    color: #333;
  }
  .input_box{
    margin:3% 0;
  }
  .code_box {
    width: 100%;
    display: inline-flex;
  }
  .input_code {
    width: 60%;
  }
  .code_box  button {
    width: 40%;
    height: 40px;
    margin-left: 5%;
  }
  .register_btn {
    margin-left: 5%;
    width: 40%;
    margin-top: 40px;
  }
  .bring_info {
    display: flex;
  }
  .el-icon-info {
    line-height: 60px;
    margin-left: 20px;
  }
/*  .send_disabled {
    cursor: not-allowed;
    background-color: rgba(242, 246, 252, 0.87);
    border-color: #ddd;
    color:#57a3f3;
  }*/
</style>
