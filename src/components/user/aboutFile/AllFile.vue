<template>
  <div class="all_file_contain">
    <div class="all_operate">
      <el-button type="primary" icon="el-icon-upload2" class="btn_primary">
        上传
      </el-button>
      <el-button>
        <i class="fa fa-folder-o"></i>
        <span>新建文件夹</span>
      </el-button>
      <el-button icon="el-icon-download">
        下载
      </el-button>
    </div>

    <div class="search_and_sort">
      <el-input
        placeholder="搜索您的文件"
        suffix-icon="el-icon-search"
        v-model="searchContent">
      </el-input>
    </div>
  </div>
</template>

<script>
  export default {
    name: "all-file",
    data(){
      return{
        searchContent:'',
      }
    }
  }
</script>

<style scoped>
  .all_file_contain{

  }
  .all_operate {
    display: inline-flex;
    padding: 15px 20px;
    min-width: 65px;
  }

  .search_and_sort {
    display: inline-flex;
  }
  .search_and_sort el-input {
    height: 35px;
  }

  .el-button {
    color: #3b8cff;
    height: 34px;
    padding: 8px 15px;
  }
  .btn_primary {
    color: #FFF;
  }
  .el-button span {
    margin-left: 6px;
  }
</style>
