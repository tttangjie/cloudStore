<template>
  <div class="modify_phone_body">
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="验证身份"> </el-step>
      <el-step title="设置新手机号"> </el-step>
      <el-step title="更改成功"> </el-step>
    </el-steps>

    <div class="modify_phone_pane">
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

      <div class="modify_pane1" v-if="activeStep === 1">
        <el-input
          class="input_box"
          placeholder="请输入手机号"
          v-model="newPhone">
          <template slot="prepend">+86</template>
        </el-input>
        <div class="input_box code_box">
          <el-input
            class="input_code"
            placeholder="短信验证码"
            v-model="newMsgCode">
          </el-input>
          <el-button
            type="primary"
            v-bind:disabled="!phoneVerify.canClick"
            @click="checkAndSendPhone">
            {{phoneVerify.btnContent}}
          </el-button>
        </div>
        <el-button type="primary" class="submit_btn" @click="checkAndModifyPhone">下一步</el-button>
      </div>

      <div class="modify_pane3" v-if="activeStep === 2">
        <p class="modify_phone_to_login">即将返回登录界面...</p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "per-modify-phone",
        data(){
          return{
            activeStep:0,
            phone:sessionStorage.getItem('phone'),
            msgCode:'',
            phoneVerify:{
              btnContent:'发送',
              canClick:true,
              countDown:60,
            },

            newPhone:'',
            newMsgCode:'',
          }
        },
        methods: {
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

          checkAndSendPhone(){
            if(this.newPhone === ''){
              this.drawMsg('warning', '请先输入手机号');
              return 0;
            }
            this.$axios.get('/user/check',
              {
                params:{
                  tel:this.newPhone,
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
          checkAndModifyPhone(){
            this.$axios.put('/change/tel',
              {
                header:{'Content-Type':'application/json'}
              },
              {
                params:{
                  newTel:this.newPhone,
                  sms:this.newMsgCode,
                }
              })
              .then(function (res) {
                console.log(res)
                if(res.data.code === 0) {
                  this.activeStep++;
                  setTimeout(() => {
                    this.backToLogin();
                  }, 3000);
                }
                else
                  this.drawMsg('error', '验证码有误！')
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
        }

    }
</script>

<style scoped>
  .modify_phone_body {
    width: 55%;
    margin: 30px 15%;
  }
  .modify_phone_pane{
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
  .modify_phone_to_login{
    font-size: 20px;
    text-align: center;
  }
</style>
