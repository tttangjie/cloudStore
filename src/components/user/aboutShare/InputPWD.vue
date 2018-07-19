<template>
    <div class="input_pwd_contain" id="input_pwd_contain">
      <div class="input_pwd_contain_child">
        <el-row class="icon_and_title">
          <el-col :span="4" :offset="6">
            <img src="../../../assets/icon_blue.png">
          </el-col>
          <el-col :span="12">
            <p>卓云微盘</p>
          </el-col>
        </el-row>
        <p class="tip">"让美好永远相伴"</p>

        <div class="user_info">
          <img v-bind:src="this.GLOBAL.BASE_URL+'/icon/get?username='+username">
          <p>{{username}}</p>
          <span> 给您分享了文件</span>
        </div>

        <div class="input_pwd_box">
          <p>请输入提取密码</p>
          <div class="get_file">
            <el-input v-model="linkPWD">  </el-input>
            <el-button type="primary" @click="getFile">提取文件</el-button>
          </div>
        </div>

      </div>

      <footer class="footer_img">
        <img src="../../../assets/footer_cloud.png">
      </footer>
    </div>
</template>

<script>
    export default {
        name: "input-pwd",
        props: {
          username: String,
          id: String,
        },
        data(){
          return{
            bodyHeight: document.documentElement.clientHeight + "px",
            linkPWD:''
          }
        },
        methods:{
          getFile(){
            this.$axios.post('/home/share/goto',
              {
                id:this.id,
                passwd:this.linkPWD,
              })
              .then(function (res) {
                if(res.data.code === 0) {
                  this.$emit('getFileSuccess', res.data.data);
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },
      beforeMount(){
        window.onresize = function () {
          this.bodyHeight = window.innerHeight + "px";

          if(document.getElementById('input_pwd_contain') != null) {
            document.getElementById('input_pwd_contain').style.height = this.bodyHeight;
          }
        }
      },
      mounted(){
        document.getElementById('input_pwd_contain').style.height =this.bodyHeight;
      },
    }
</script>

<style scoped>
  .input_pwd_contain {
    background: #eef2f6;
    padding-top: 3%;
    height: 100%;
  }
  .input_pwd_contain_child {
    width: 460px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -240px 0 0 -230px;
    z-index: 1;
  }
  .icon_and_title p{
    font-weight: 600;
    font-size: 35px;
    line-height: 70px;
    height: 70px;
  }
  .tip {
    text-align: center;
  }

  .user_info {
    display: inline-flex;
    margin-top: 20px;
    color: white;
    height: 80px;
    width: 100%;
    background: #438aee;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .user_info img{
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-left: 30px;
    border-radius: 90px;
  }
  .user_info p{
    margin-left: 10px;
    line-height: 80px;
    height: 80px;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .user_info span{
    line-height: 80px;
    height: 80px;
    margin-left: 5px;
  }

  .input_pwd_box {
    height: 170px;
    width: 100%;
    background: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 0 18px 0 rgba(57, 141, 238, 0.12);
    padding: 30px 50px;
  }
  .get_file {
    display: inline-flex;
    margin-top: 30px;
  }
  .get_file .el-button{
    margin-left: 20px;
  }

  .footer_img {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-position: 0 bottom;
  }
  .footer_img img{
    width: 100%;
  }
</style>
