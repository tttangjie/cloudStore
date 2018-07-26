<template>
  <div class="modify_pwd_body">
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="验证身份"> </el-step>
      <el-step title="设置密码"> </el-step>
      <el-step title="改密成功"> </el-step>
    </el-steps>

    <div class="modify_pwd_pane">
      <div class="modify_pane1" v-if="activeStep === 0">
        <el-input
          class="input_box"
          :placeholder="phone"
          disabled>
          <template slot="prepend">+86</template>
          {{phone}}
        </el-input>
        <div class="input_box code_box">
          <el-input
            class="input_code"
            placeholder="短信验证码"
            v-model="msgCode">
          </el-input>
          <el-button
            type="primary"
            @click="sendMsg"
            v-bind:disabled="!phoneVerify.canClick">
            {{phoneVerify.btnContent}}
          </el-button>
        </div>
        <el-button type="primary" class="submit_btn" @click="checkSmsMsg">下一步</el-button>
      </div>

      <div class="modify_pane2" v-if="activeStep === 1">
        <el-input
          class="input_box"
          placeholder="新密码"
          v-model="pwd.first"
          type="password"
          @blur="pwdFormat">
        </el-input>

        <div class="input_box code_box">
          <el-input
            class="input_box"
            placeholder="请再次输入密码"
            v-model="pwd.second"
            type="password"
            @blur="secondEqualsFirst">
          </el-input>
        </div>
        <el-button type="primary" class="submit_btn" @click="changePWD">下一步</el-button>
      </div>

      <div class="modify_pane3" v-if="activeStep === 2">
        <p class="modify_pwd_to_login">即将返回登录界面...</p>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
        name: "per-modify-pwd",
        data(){
          return{
            activeStep:0,
            phone:this.$cookie.get('phone'),
            msgCode:'',
            phoneVerify:{
              btnContent:'发送',
              canClick:true,
              countDown:60,
            },
            pwd:{
              first:'',
              second:'',
            }
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          backToLogin() {
            this.activeStep++;
            this.$router.push('/');
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
          checkSmsMsg(){
            this.$axios.get('/code/sms/verify',
              {
                params:{
                  sms:this.msgCode,
                }
              })
              .then(function (res) {
                console.log(res)
                if(res.data.code === 0) {
                  this.activeStep++;
                }
                else if(res.data.code === 1) {
                  this.drawMsg('error', '手机验证失败！')
                }
              }.bind(this))
              .catch((function (res) {
                console.log(res);
              }))
          },

          pwdFormat(){
            if(this.pwd.first.length < 6 || this.pwd.first.length>16 ) {
              this.drawMsg('warning', '密码长度应在6~16之间');
              return 1;
            }
            else if(this.pwd.first.indexOf(" ") !== -1 ) {
              this.drawMsg('warning', '密码中不可携带空格');
              return 1;
            }
            return 0;
          },
          secondEqualsFirst(){
            if(this.pwd.first !== this.pwd.second) {
              this.drawMsg('error', '两次密码输入不一致');
              return 1;
            }
            return 0;
          },
          changePWD(){
            console.log(this.pwd.first)
            if(!this.pwdFormat() && !this.secondEqualsFirst()) {
              this.$axios.put('/change/password',
                {
                  header:{'Content-Type':'application/json'}
                },
                {
                  params:{
                    newPassword:this.pwd.first,
                  }
                })
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.activeStep++;
                    setTimeout(() => {
                      this.backToLogin();
                    }, 3000);
                  }
                  else {
                    this.drawMsg('error', '密码修改失败！');
                  }
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }
          },


        },
    }
</script>

<style scoped>
  .modify_pwd_body {
    width: 55%;
    margin: 30px 15%;
  }
  .modify_pwd_pane{
    margin-top: 15%;
    width: 60%;
    margin-left: 15%;
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
  .submit_btn {
    margin-top: 60px;
    width: 100%;
  }

  .modify_pwd_to_login{
    font-size: 20px;
    text-align: center;
  }
</style>
