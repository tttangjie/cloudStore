<template>
  <div class="container" id="help_body">
    <el-card class="box-card">
      <div class="helpList">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="Web端支持预览的文件格式" name="1" class="eltitle">
            <div>支持预览图片、音频、视频和文档。</div>
            <div>支持的文档格式有：doc\docx\ppt\pptx\xls\xlsx\vsd\pot\pps\rtf\wps\et\dps\pdf\txt\epub\xlt\xltx\potx\dot\dotx\ppsx等；</div>
            <div>支持的音频格式有：mp3等；</div>
            <div>支持图片的格式有：jpg\gif\bmp\png\jpeg等</div>

          </el-collapse-item>
          <el-collapse-item title="文件上传限制" name="2" class="eltitle">
            <div>卓云微盘只支持1GB以内的文件上传</div>
          </el-collapse-item>
          <el-collapse-item title="会员特权" name="3" class="eltitle">
            <div>会员拥有比普通用户更大的存储空间</div>
            <div>会员图标高亮显示</div>
          </el-collapse-item>
          <el-collapse-item title="秒传" name="4" class="eltitle">
            <div>秒传是将上传的文件与百度网盘服务器中的文件进行比对，若云端存在相同文件，则百度网盘将直接把文件保存到你的网盘，节省上传时间。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

  </div>
</template>

<script>
  export default {
    name:'help',
    data(){
      return{
        bodyHeight: document.documentElement.clientHeight-60,
        activeNames: ['1','2','3','4']
      }
    },
    methods: {
    }

  }
</script>
<style scoped>
  .box-card {
    height: 90%;
    width: 80%;
    margin: auto;
    /*position: absolute;*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>

<style>
  .el-collapse-item__header {
    color: #42809d;
    font-size: 16px;
    font-weight: 400;
  }
  .el-collapse-item__content{

  }
</style>
