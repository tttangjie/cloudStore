<template>
  <div class="main-box">

    <el-row>
      <el-col :span="6"  class="more_list" v-for="item in moreList" :key="item.title">
        <img v-bind:src="item.src">
        <p>{{item.title}}</p>
      </el-col>
    </el-row>
  </div>

</template>

<script>
    export default {
      name: "more",
      data() {
        return {
          moreList:[
            {
              title:'文章',
              src: require('../../assets/more_icon/article.png')
            },
            {
              title:'垃圾文件清理',
              src: require('../../assets/more_icon/clear.png')
            },
            {
              title:'通讯录',
              src: require('../../assets/more_icon/contact.png')
            },
            {
              title:'照片电影',
              src: require('../../assets/more_icon/director.png')
            },
            {
              title:'企业网盘',
              src: require('../../assets/more_icon/eyun.png')
            },
            {
              title:'记事本',
              src: require('../../assets/more_icon/note.png')
            },
            {
              title:'云冲印',
              src: require('../../assets/more_icon/print.png')
            },
            {
              title:'通话记录',
              src: require('../../assets/more_icon/record.png')
            },
            {
              title:'分享动态',
              src: require('../../assets/more_icon/share.png')
            },
            {
              title:'短信',
              src: require('../../assets/more_icon/sms.png')
            },
            {
              title:'手机找回',
              src: require('../../assets/more_icon/zhaohui.png')
            },
          ]
        };
      },
    }
</script>

<style scoped>
  .main-box{
    width: 80%;
    border-radius: 4px;
    background-color: #fff;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

  }
  .more_list img{
    margin-top: 16%;
    width: 90px;
    height: 90px;
    margin-left: 30%;
    transform: scale(1);
    transition: all 1s ease 0s;
    -webkit-transform: scale(1);
  }
  .more_list p {
    margin-top: 5%;
    text-align: center;
    width: 90px;
    margin-left: 30%;
  }
  .more_list img:hover {
    cursor: pointer;
    transform: scale(1.1);
    transition: all 1s ease 0s;
    -webkit-transform: scale(1.1);
  }

</style>
