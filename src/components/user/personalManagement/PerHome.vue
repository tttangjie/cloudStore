<template>
  <div class="home_body">
    <el-row>
      <el-col :span="11">
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

      <el-col :span="9" class="total_space">
        <el-progress type="circle" :percentage="totalSpace.scale" :stroke-width="12"> </el-progress>
        <p>{{totalSpace.size}} / {{totalSpace.availableCapacity}}</p>
      </el-col>
    </el-row>

    <div class="type_progress">
      <el-row>
        <el-col :span="2">
          <p>文档</p>
        </el-col>
        <el-col :span="15">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="docSpace.laterScale" color="#67C23A"> </el-progress>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <p>图片</p>
        </el-col>
        <el-col :span="15">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="pictSpace.laterScale" color="#E6A23C"> </el-progress>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <p>视频</p>
        </el-col>
        <el-col :span="15">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="videoSpace.laterScale" color="#F56C6C"> </el-progress>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <p>音乐</p>
        </el-col>
        <el-col :span="15">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="musicSpace.laterScale" > </el-progress>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <p>其他</p>
        </el-col>
        <el-col :span="15">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="otherSpace.laterScale" color="#909399"> </el-progress>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    export default {
        name: "per-home",
        data(){
          return{
            username:this.$cookie.get('username'),
            isVIP:false,
            headImgRef:'',
            totalSpace:[],
            docSpace:[],
            pictSpace:[],
            videoSpace:[],
            musicSpace:[],
            otherSpace:[],
          }
        },
        methods:{
          getSpace(){
            this.$axios.post('/sort/capacity')
              .then(function (res) {
                console.log(res);
                if(res.data.code === 0) {
                  this.totalSpace = res.data.data[5];
                  this.docSpace = res.data.data[0];
                  this.pictSpace = res.data.data[1];
                  this.videoSpace = res.data.data[2];
                  this.musicSpace = res.data.data[3];
                  this.otherSpace = res.data.data[4]
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
        },
        mounted(){
          this.getSpace();
        },
    }
</script>

<style scoped>
  .home_body{
    min-width: 960px;
  }
  .home_head_img {
    width: 150px;
    height: 150px;
    margin-top: 30px;
    margin-left: 15%;
    border: 1px solid #b2b2b2;
    border-radius: 10px;
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

  .total_space {
    margin-top: 35px;
  }

  .type_progress {
    margin-top: 50px;
  }
  .type_progress p {
    float: right;
    margin-right: 5px;
    margin-top: 20px;
  }
  .type_progress .el-progress {
    margin-left: 10%;
    margin-top: 20px;
  }
</style>
