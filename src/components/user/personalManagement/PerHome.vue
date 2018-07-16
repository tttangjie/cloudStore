<template>
  <div class="home_body">
    <el-row>
      <el-col :span="10">
        <el-row>
          <el-col :span="10">
            <img class="home_head_img" v-bind:src="this.GLOBAL.BASE_URL+'/user/icon/get'" ref="headImgRef">

          </el-col>
          <el-col :span="14" class="home_user_body">
            <p class="home_username">{{username}}</p>
            <p v-show="!isVIP" class="home_user">普通用户<span><img src="../../../assets/icon_no_vip.png" /></span></p>
            <p v-show="isVIP" class="home_user">VIP用户<span><img src="../../../assets/icon_vip.png" /></span></p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "per-home",
        data(){
          return{
            username:sessionStorage.getItem('username'),
            isVIP:false,
            headImgRef:'',
          }
        },
        mounted(){

        },
    }
</script>

<style scoped>
  .home_body{
    min-width: 960px;
  }
  .home_head_img {
    width: 70%;
    height: 70%;
    margin-top: 30px;
    margin-left: 15%;
    border: 1px solid #b2b2b2;
  }
  .home_user_body {
    min-width: 200px;
    margin-top: 40px;
  }
  .home_username{
    max-width: 260px;
    font-size: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .home_user{
    margin-top: 30px;
    font-size: 18px;
  }
  .home_user img {
    width: 20px;
    height: 20px;
  }
</style>
