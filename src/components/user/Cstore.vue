<template>
    <el-container id="cStore_body" >
        <el-aside  width="200px">
          <el-menu
            default-active="all"
            class="el-menu-vertical-demo"
            background-color="#eaf0fb"
            router
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="all" route="/home/all">
              <i class="el-icon-document"></i>
              <span slot="title">全部文件</span>
            </el-menu-item>
            <div class="file-group">
              <el-menu-item index="img" route="/home"><p>图片</p></el-menu-item>
              <el-menu-item index="doc" route="/home"><p>文档</p></el-menu-item>
              <el-menu-item index="video" route="/home"><p>视频</p></el-menu-item>
              <el-menu-item index="music" route="/home"><p>音乐</p></el-menu-item>
              <el-menu-item index="other" route="/home"><p>其他</p></el-menu-item>
            </div>
            <el-menu-item index="share" route="/home">
              <i class="el-icon-share"></i>
              <span slot="title">我的分享</span>
            </el-menu-item>
            <el-menu-item index="recycle" route="/home">
              <i class="el-icon-delete"></i>
              <span slot="title">回收站</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "cStore",
        data(){
          return{
            bodyHeight: document.documentElement.clientHeight-60,
          }
        },
        methods: {
          handleOpen(key, keyPath) {
            console.log(key, keyPath);
          },
          handleClose(key, keyPath) {
            console.log(key, keyPath);
          }
        },
        beforeMount() {
          window.onresize = function() {
            this.bodyHeight = document.documentElement.clientHeight-60;
            if (document.getElementById('cStore_body')!=null)
              document.getElementById('cStore_body').style.height =this.bodyHeight + "px";
          }
        },
        mounted() {
          document.getElementById('cStore_body').style.height =this.bodyHeight + "px";
        },
    }
</script>

<style scoped>

  .el-aside{
    background: #eaf0fb;
  }
  .el-main{
    padding: 0;
  }
  .file-group li {
    height: 40px;
    line-height: 40px;
  }
  .file-group li p{
    margin-left: 32px;
  }
</style>
