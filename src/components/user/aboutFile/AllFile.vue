<template>
  <div>
    <!--全部文件上面一排工具菜单-->
    <div>
      <div class="all_operate">
        <el-button type="primary" icon="el-icon-upload2" class="btn_primary">
          上传
        </el-button>
        <el-button @click="newFolderPushToFileList">
          <i class="fa fa-folder-o"></i>
          <span>新建文件夹</span>
        </el-button>
        <el-button icon="el-icon-download" @click="downloadFiles">
          下载
        </el-button>
      </div>
      <div class="search_and_sort">
        <el-input
          placeholder="搜索您的文件"
          v-model="searchContent">
          <i slot="suffix" class="el-input__icon el-icon-search search_icon"></i>
        </el-input>
        <i class="el-icon-sort sort_icon"></i>
        <i class="fa fa-reorder sort_icon"></i>
      </div>
    </div>

    <!--面包屑及文件个数-->
    <el-row class="bread_and_count">
      <el-col class="about_bread" :span="16">
        <div class="about_return_to_pre" v-show="showBackToPre">
          <a class="return_to_pre" @click="loadDir(breadList[breadList.length-2].path)">返回上一级</a>
          <p class="bread_line">|</p>
        </div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="item in breadList"
            :key="item.path">
            <a class="bread_style" @click="loadDir(item.path)">{{item.name}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col class="file_count">已加载全部，共{{fileList.length}}个</el-col>
    </el-row>

    <!--文件表格/文件表格-->
    <el-table
      ref="fileSelection"
      :data="fileList"
      tooltip-effect="dark"
      style="width: 100%"
      size="mini"

      highlight-current-row
      @selection-change="handleFileSelect"
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
      @current-change="handleCurrentClick">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名"
        sortable>
          <template slot-scope="scope">
            <el-row class="file_and_tools"  v-bind:hoverFilePath=scope.row.path>
              <el-col :span="18" class="icon_and_name">
                <img class="table_file_icon"
                     :src="require('../../../assets/file_icon/'+scope.row.type+'.png')">
                <p class="table_file_name" v-show="!(clickFile === scope.row.path && showRenameDiv)"
                    @click="enterOrPreview(scope.row.path, scope.row.type, scope.row.fileName)">{{ scope.row.fileName }}</p>
                <div class="rename_file" v-show="clickFile === scope.row.path && showRenameDiv">
                  <input v-model="renameFileName">
                  <el-button size="mini"  icon="el-icon-check" circle @click="renameFile(clickFile,renameFileName)"> </el-button>
                  <el-button size="mini"  icon="el-icon-close" circle @click="cancelRename"> </el-button>
                </div>
              </el-col>
              <el-col :span="5" class="file_operate" v-show="hoverFilePath === scope.row.path">
                <a><i class="el-icon-share"></i></a>

                <a @click="downloadFile(scope.row.path, scope.row.type)"><i class="el-icon-download"></i></a>
                <!--<a v-if="scope.row.isDir==='文件夹' " v-bind:href="GLOBAL.BASE_URL+'/downloadFolder?srcName=/user'+ scope.row.path"><i class="el-icon-download"></i></a>
                <a v-else-if="scope.row.isDir==='文件'" v-bind:href="GLOBAL.BASE_URL+'/downloadFolder?srcName=/user'+ scope.row.path"><i class="el-icon-download"></i></a>-->

                <el-dropdown trigger="click"  @command="handleMoreComment">
                  <span class="el-dropdown-link">
                    <a><i class="el-icon-more-outline"></i></a>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="move">移动到</el-dropdown-item>
                    <el-dropdown-item command="copy">复制到</el-dropdown-item>
                    <el-dropdown-item command="rename">重命名</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="120"
        sortable>
      </el-table-column>
      <el-table-column
        prop="date"
        label="修改日期"
        width="180"
        sortable>
      </el-table-column>
    </el-table>


    <div>
      <el-dialog
        title="确认删除"
        :visible.sync="showDeleteFileDialog"
        width="30%"
        center>
        <span>确认把所选文件放入回收站吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDeleteFileDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteFile">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  export default {
    name: "all-file",
    data(){
      return{
        searchContent:'',
        fileTotal:0,
        /*fileList中的path 和 BreadList中的path不是同一个含义*/
        breadList:[{path:'/',name:'全部文件'},/*{path:'/test1',name:'test1'},{path:'/test1/test2',name:'test2'}*/],
        fileList:[
          {
            type:'folder',
            fileName:'file3',
            path:'/file3',
            isDir:'文件夹',
            date:'2018-03-02',
            size:0,
          },
          {
            type:'doc',
            fileName:'file4.doc',
            path:'/file4.doc',
            isDir:'文件',
            date:'2015-01-03',
            size:0,
          }],
        showBackToPre:false,
        hoverFilePath:'',   //鼠标进入时的文件路径
        clickFile:'',   //单个选中的文件
        clickFiles:[],  //多个选中的文件
        fileSelection: [],  //文件列表中选中的文件
        showDeleteFileDialog:false, //确认删文件的对话框
        showRenameDiv:false,  //重命名的区域的显现
        renameFileName:'',//重命名编辑中的文件名
        isRename:true,
      }
    },
    methods:{
      /*创建n位的随机数*/
      randomNum(n){
        let rnd="";
        for(let i=0;i<n;i++)
          rnd+=Math.floor(Math.random()*10);
        return rnd;
      },
      /*新建文件夹*/
      newFolderPushToFileList(){
        this.fileList.unshift({fileName:'新建文件夹',size:'0',path:this.breadList[this.breadList.length-1].path,isDir:'文件夹',date:'',type:'folder'});
        let filename = this.randomNum(4)
        if(this.breadList[this.breadList.length-1].path === '/')
          this.fileList[0].path+=filename;
        else
          this.fileList[0].path+=filename;
        this.$refs.fileSelection.clearSelection();
        this.$refs.fileSelection.toggleRowSelection(this.fileList[0]);
        this.$refs.fileSelection.setCurrentRow(this.fileList[0]);
        this.showRenameDiv = true;
        this.clickFile = this.fileList[0].path;
        this.renameFileName = '新建文件夹';
        this.isRename = false;
      },
      createNewFolder(newFilename){
        console.log(this.breadList[this.breadList.length-1]);
        /*this.$axios.post('/TestPlatform/mkdir',{
          pPath:'/user'+ this.breadList[this.breadList.length-1].path,
          fileName:newFilename
        })
          .then(function (res) {
            console.log(res)

            this.isRename = true;
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })*/
      },
      /*下载文件*/
      downloadFile(file,type){
        // user为用户名
        let username = 'user';
        if(type === 'folder')
          window.location.href = this.GLOBAL.BASE_URL+'/TestPlatform/downloadFolder?srcName=/'+ username +file;
        else
          window.location.href = this.GLOBAL.BASE_URL+'/TestPlatform/download?srcName=/'+ username +file;
      },
      downloadFiles(){
        console.log(this.fileSelection)
        let username = 'user';
        let files = new Array();
        for(let i = 0; i<this.fileSelection.length; i++) {
          files.push(this.fileSelection[i].path)
        }
        console.log(files)
/*
        window.location.href = this.GLOBAL.BASE_URL+'/TestPlatform/downloadFolder? jsonSrcName ＝/'+ username +files;
*/
      console.log(this.GLOBAL.BASE_URL+'/TestPlatform/downloadFolder? jsonSrcName ＝/'+ username +JSON.stringify(files))
      },
      /*通过breadList中的path加载目录*/
      loadDir(path){
        console.log(path)
        for(var i = this.breadList.length-1; i >= 0; i--) {
          if(this.breadList[i].path !== path) {
            this.breadList.pop();
          }
          else break;
        }
        if(this.breadList.length > 1)
          this.showBackToPre = true;
        else
          this.showBackToPre = false;
      },
      /*预览文件时在面包屑上加入新的目录*/
      addBreadList(path, name) {
        this.breadList.push({path:path, name:name});
        this.loadDir(path);
      },
      /*文件选择触发的事件*/
      handleFileSelect(val){
        this.fileSelection = val;
        //console.log(this.fileSelection)
      },
      /*单击选择单元格事件*/
      handleCurrentClick(val) {
        if(val === null)
          return;
        console.log(val);
        this.clickFile = val.path;
        this.$refs.fileSelection.clearSelection();
        this.$refs.fileSelection.toggleRowSelection(this.fileList[this.fileList.indexOf(val)]);
        this.showRenameDiv = false;
        this.renameFileName = val.fileName;
      },
      /*鼠标进入或离开文件单元格时触发的事件*/
      handleMouseEnter(event){
        this.hoverFilePath = event.path;
      },
      handleMouseLeave(){
        this.hoverFilePath = '';
      },
      /*更多的文件操作*/
      handleMoreComment(command){
        this.$message('click on item ' + command);
        if(command === 'rename')
          this.showRenameDiv = true;
        else if(command === 'delete')
          this.showDeleteFileDialog = true;
      },
      /*删除文件*/
      deleteFile(){
        console.log(this.clickFile)
        this.showDeleteFileDialog = false;
      },
      /*重命名文件*/
      renameFile(oldPath, newFileName) {
        if(!this.isRename) {
          this.createNewFolder();
          return;
        }
        var newPath;
        if(this.breadList[this.breadList.length-1].path === '/')
          newPath = this.breadList[this.breadList.length-1].path+newFileName;
        else
          newPath = this.breadList[this.breadList.length-1].path + '/' +newFileName;
        console.log(oldPath);
        console.log(newPath);
      },
      cancelRename() {
        this.showRenameDiv=false;
        console.log(this.fileList)
        if(!this.isRename) {
          this.isRename = true;
          this.fileList.shift();
          this.handleCurrentClick(null);
        }
      },
      /*预览文件、文件夹*/
      enterOrPreview(path, type, name){
        if(type === 'folder'){
          this.addBreadList(path, name);
        }
        else {

        }
      }
    },
    mounted(){
      this.loadDir(this.breadList[this.breadList.length-1].path);
      /*this.$axios.post('/TestPlatform/dirLook',{
        muluName:'/user'+this.breadList[this.breadList.length-1].path,
      })
        .then(function (res) {
          console.log(res)
          this.fileList = res.data.result;
        }.bind(this))
        .catch(function (err) {
          console.log(err)
        })*/
    },
  }
</script>

<style scoped>
  .all_operate {
    display: inline-flex;
    padding: 15px 20px;
    min-width: 350px;
  }

  .search_and_sort {
    display: inline-flex;
    float: right;
    line-height: 64px;
    margin-right: 5px;
    height: 64px;
    min-width: 285px;
  }
  .search_icon:hover{
    color: #3b8cff;
  }
  .sort_icon{
    font-size: 20px;
    color: #0b074b;
    line-height: 60px;
    height: 60px;
    margin: 0 10px;
  }

   .all_operate .el-button {
    /*color: #3b8cff;*/
    height: 34px;
    padding: 8px 15px;
  }
  .btn_primary {
    color: #FFF;
  }
  .el-button span {
    margin-left: 6px;
  }

  .bread_and_count {
    padding-left: 20px ;
    padding-top: 15px;
    width: 100%;
  }
  .about_bread {
    display: inline-flex;
    font-size: 14px;
    height: 15px;
    line-height: 15px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  .about_return_to_pre {
    display: inline-flex;
  }
  .return_to_pre {
    color: #409EFF;
  }
  .bread_line {
    color: #c3c3c3;
    margin:0 4px;
  }
  .bread_style{
    color: #409EFF;
    font-weight: 500;
    display: inline-block;
    max-width:200px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  .file_count {
    float: right;
    color: #848484;
    margin-right: 10px;
    font-size: 14px;
    height: 15px;
    line-height: 14px;
    width: 150px;
  }

  .file_and_tools{
    display: inline-flex;
    width: 100%;
  }
  .icon_and_name {
    display: inline-flex;
    margin-top: -16px;
  }
  .table_file_icon{
    height: 32px;
    line-height: 32px;
  }
  .table_file_name {
    margin-left: 5px;
    font-size: 14px;
    line-height: 32px;
  }
  .file_operate{
    margin-top: -16px;
    display: inline-flex;
    float: right;
    line-height: 32px;
  }
  .file_operate a{
    font-size: 23px;
  }
  .file_operate i {
    margin-left: 8px;
    color: cornflowerblue;
  }

  .rename_file input{
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    margin: 0 10px;
  }

</style>

<style>
  th {
    font-weight: 300;
  }
</style>
