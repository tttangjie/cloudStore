<template>
  <div>
    <!--全部文件上面一排工具菜单-->
    <div>
      <div class="all_operate">
        <div  @click="asideRight" class="picker">

        </div>
        <el-button @click="newFolderPushToFileList">
          <i class="fa fa-folder-o"></i>
          <span>新建文件夹</span>
        </el-button>
        <el-button icon="el-icon-share">
          分享
        </el-button>
        <transition name="el-fade-in-linear">
          <div v-show="fileSelection.length > 0">
            <el-button icon="el-icon-download" @click="downloadFiles">
              下载
            </el-button>
            <el-button icon="el-icon-delete" @click="showDeleteFile">
              删除
            </el-button>
            <el-button @click="loadMoveFiles">
              <i class="fa fa-reply"></i>
              移动到
            </el-button>
            <el-button @click="loadCopyFiles">
              <i class="fa fa-copy"></i>
              复制到
            </el-button>
          </div>
        </transition>
      </div>
      <div class="search_and_sort">
        <el-input
          placeholder="搜索您的文件"
          v-model="searchContent">
          <i slot="suffix" class="el-input__icon el-icon-search search_icon"></i>
        </el-input>
        <!--<i class="el-icon-sort sort_icon"></i>-->
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
      @current-change="handleCurrentClick"
      @cell-dblclick="enterOrPreview(clickFile, fileSelection[0].type, fileSelection[0].fileName)">
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
        sortable
        sort-by="len">
      </el-table-column>
      <el-table-column
        prop="time"
        label="修改日期"
        width="180"
        sortable>
      </el-table-column>
    </el-table>

    <div>
      <!--文件加入回收站的Dialog-->
      <el-dialog
        title="确认删除"
        :visible.sync="showDeleteFileDialog"
        width="30%"
        center>
        <span>确认把所选文件放入回收站吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDeleteFileDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteFiles">确 定</el-button>
        </span>
      </el-dialog>

      <!--目录树的Dialog-->
      <DirectoryTree
        :show="showTreeDialog"
        v-on:showTreeDialogFalse="showTreeDialog = false"
        v-on:confirmSelectPath="moveAndCopy">
      </DirectoryTree>

      <!--预览PDF文件的Dialog-->
      <el-dialog
        :visible.sync="showPDF"
        width="72%"
        :close-on-click-modal=false
        :close-on-press-escape=false
        @close="deletePDF"
        center>
        <pdf-view  :pdfurl="pdfurl"> </pdf-view>
      </el-dialog>

      <!--预览视频的Dialog-->
      <el-dialog
        title="在线预览视频"
        :visible.sync="showVideoPlay"
        width="60%"
        height="60%"
        center
        :close-on-click-modal=false
        :close-on-press-escape=false>
        <span>
          <video width="960" height="720" controls>
              <source v-bind:src='this.GLOBAL.BASE_URL + "/get/stream?fpath="+clickFile' type="video/mp4">
          </video>
        </span>
      </el-dialog>

      <!--下载列表-->
      <b-aside  :is-show="showUploadAside"
               title="文件上传列表"
               :show-footer="false"
               placement="right"
               :backdrop="false"
               @close="showUploadAside=false">
        <FileUpload
          v-bind:uploadPath="breadList[breadList.length-1].path"
          @uploadComplete="loadFileList">
        </FileUpload>
      </b-aside>
    </div>
  </div>
</template>

<script>
  import DirectoryTree from './DirectoryTree'
  import FileUpload from '../uploadFiles/fileUpload'
  export default {
    name: "all-file",
    components:{
      DirectoryTree,
      FileUpload,
    },
    data(){
      return{
        pdfurl:'',
        showTreeDialog:false,
        username:sessionStorage.getItem('username'),
        searchContent:'',
        fileTotal:0,
        /*fileList中的path 和 BreadList中的path不是同一个含义*/
        breadList:[{path:'/'+sessionStorage.getItem('username'),name:'全部文件'}],
        fileList:[
          {
            type:'folder',
            fileName:'file3',
            path:'/file3',
            isDir:'文件夹',
            time:'2018-03-02',
            len:0,
            size:'0KB',
          },
          {
            type:'doc',
            fileName:'file4.doc',
            path:'/file4.doc',
            isDir:'文件',
            time:'2015-01-03',
            len:0,
            size:'0KB'
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
        showPDF:false ,
        moveOrCopy:'',
        showVideoPlay:false,
        showUploadAside:false,
      }
    },

    methods:{
      asideRight() {
        this.showUploadAside = true;
      },
      drawMsg(type, content) {
        this.$message({
          message:content,
          type: type
        });
      },
      /*创建n位的随机数*/
      randomNum(n){
        let rnd="";
        for(let i=0;i<n;i++)
          rnd+=Math.floor(Math.random()*10);
        return rnd;
      },
      /*新建文件夹*/
      newFolderPushToFileList(){
        this.renameFileName = '新建文件夹';
        this.fileList.unshift({fileName:'新建文件夹',size:'0',path:this.breadList[this.breadList.length-1].path,isDir:'文件夹',date:'',type:'folder'});
        let filename = this.randomNum(4);
        this.fileList[0].path+=filename;
        this.$refs.fileSelection.clearSelection();
        this.$refs.fileSelection.toggleRowSelection(this.fileList[0]);
        this.$refs.fileSelection.setCurrentRow(this.fileList[0]);
        this.showRenameDiv = true;
        this.clickFile = this.fileList[0].path;
        this.isRename = false;
      },
      createNewFolder(newFilename){
        let pPath = this.breadList[this.breadList.length-1].path;
        this.$axios.post('/mkdir',{
          pPath:pPath,
          fileName:newFilename
        })
          .then(function (res) {
            if(res.data.status === '创建成功') {
              this.drawMsg('success','文件新建成功');
              this.showRenameDiv = false;
              this.isRename = true;
              this.loadFileList();
            }
            else if (res.data.status === '文件已存在！')
              this.drawMsg('error','文件名已存在请重新输入');
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
      },
      /*下载文件*/
      downloadFile(path,type){
        if(type === 'folder')
          window.location.href = this.GLOBAL.BASE_URL+'/downloadFolder?srcName='+ path;
        else
          window.location.href = this.GLOBAL.BASE_URL+'/download?srcName='+ path;
      },
      downloadFiles(){
        console.log(this.fileSelection)
        if(this.fileSelection.length === 1) {
          if(this.fileSelection[0].type === 'folder')
            window.location.href = this.GLOBAL.BASE_URL+'/downloadFolder?srcName='+ this.fileSelection[0].path;
          else
            window.location.href = this.GLOBAL.BASE_URL+'/download?srcName='+ this.fileSelection[0].path;
        }
        else {
          let postString = '';
          for(let i = 0 ; i<this.fileSelection.length; i++) {
            if(i!==0)
              postString += ','
            postString += this.fileSelection[i].path;
          }
          window.location.href = this.GLOBAL.BASE_URL+'/downloadBatch?paths=' + postString;
        }
/*
        window.location.href = this.GLOBAL.BASE_URL+'/downloadFolder? jsonSrcName ＝'+  postString;
*/
      /*console.log(window.location.href = this.GLOBAL.BASE_URL+'/downloadFolder? jsonSrcName ＝'+  postString)*/
      },
      /*通过breadList中的path加载目录*/
      loadDir(path){
        for(var i = this.breadList.length-1; i >= 0; i--) {
          if(this.breadList[i].path !== path) {
            this.breadList.pop();
          }
          else break;
        }
        this.loadFileList();
        if(this.breadList.length > 1)
          this.showBackToPre = true;
        else
          this.showBackToPre = false;
      },
      /*加载文件列表*/
      loadFileList(){
        this.$axios.post('/dirLook',{
          muluName:this.breadList[this.breadList.length-1].path,
        })
          .then(function (res) {
            console.log(res)
            this.fileList = res.data.result;
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
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
        if(command === 'rename')
          this.showRenameDiv = true;
        else if(command === 'delete')
          this.showDeleteFileDialog = true;
        else if(command === 'move'){
          this.showTreeDialog = true;
          this.moveOrCopy = 'move';
        }
        else if(command === 'copy'){
          this.showTreeDialog = true;
          this.moveOrCopy = 'copy';
        }
      },
      /*删除文件*/
      /*showDeleteFile(){
        console.log(this.fileSelection);
        if(this.fileSelection.length === 0) {
          this.drawMsg('warning', '请先选择文件');
        }
        else
          this.showDeleteFileDialog = true;
      },
      deleteFiles(){
        this.clickFiles = [];
        let postString = '';
        for(let i = 0 ; i<this.fileSelection.length; i++) {
          if(i!==0)
            postString += ','
          postString += this.fileSelection[i].path;
        }
        this.$axios.post('/delete' ,
          {
            header:{'content-type':'application/json'}
          },
          {
            params:{
              fileDelPaths:postString
            }
          })
          .then(function (res) {
            this.drawMsg('success','删除成功！');
            this.loadFileList();
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
        this.showDeleteFileDialog = false;
      },*/
      showDeleteFile(){
        console.log(this.fileSelection);
        if(this.fileSelection.length === 0) {
          this.drawMsg('warning', '请先选择文件');
        }
        else
          this.showDeleteFileDialog = true;
      },
      deleteFiles() {
        let postString = '';
        for(let i = 0 ; i<this.fileSelection.length; i++) {
          if(i!==0)
            postString += ','
          postString += this.fileSelection[i].path;
        }
        this.$axios.post('/user/recycle/insert/all',{
          oriPaths:postString,
        })
          .then(function (res) {
            if(res.data.msg === '成功'){
              this.drawMsg('success', '放入回收站成功！');
              this.loadFileList();
            }
            this.showDeleteFileDialog = false;
          }.bind(this))
          .catch(function (err) {
            console.log(err);
            this.showDeleteFileDialog = false;
          }.bind(this))
      },
      /*重命名文件*/
      renameFile(oldPath, newFileName) {
        if(!this.isRename) {
          this.createNewFolder(this.renameFileName);
          return;
        }
        this.$axios.post('/rename',{
          oldPath:oldPath,
          newName:newFileName,
        })
          .then(function (res) {
            if(res.data.status === '文件已经存在！')
              this.drawMsg('error','文件名已存在！');
            else if(res.data.status === '修改成功') {
              this.drawMsg('success','文件名修改成功');
              this.showRenameDiv = false;
              this.loadFileList();
            }
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
      },
      cancelRename() {
        this.showRenameDiv=false;
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
        else if(type === 'doc' || type === 'ppt' || type === 'txt' || type === 'code' ||  type === 'xls'){
          this.$axios.post('/file2Pdf',
            {
            input:path
          })
            .then(function (res) {
              this.pdfurl = res.data.result;
              this.showPDF = true;
            }.bind(this))
            .catch(function (err) {
              this.drawMsg('error','文件预览失败')
              console.log(err)
            }.bind(this))
        }
        else if(type === 'mp4') {
          this.showVideoPlay = true;
        }

      },
      /*删除预览的PDF文件*/
      deletePDF(){
        this.$axios.post('/pdfDelete',{
          deletePath:this.pdfurl,
        })
          .then(function (res) {

          })
          .catch(function (err) {
            console.log(err)
          })
      },
      /*移动或复制*/
      moveAndCopy(newFatherPath){
        if(this.moveOrCopy === 'move')
          this.moveFile(newFatherPath);
        else if(this.moveOrCopy === 'copy')
          this.copyFile(newFatherPath);
      },
      /*多文件移动加载目录树*/
      loadMoveFiles(){
        this.showTreeDialog = true;
        this.moveOrCopy = 'move';
      },
      /*多文件复制加载目录树*/
      loadCopyFiles(){
        this.showTreeDialog = true;
        this.moveOrCopy = 'copy';
      },
      /*文件移动*/
      moveFile(newFatherPath){
        let postString = '';
        for(let i = 0 ; i<this.fileSelection.length; i++) {
          if(i!==0)
            postString += ','
          postString += this.fileSelection[i].path;
        }
        this.$axios.post('/move',
          {
            header:{'content-type':'application/json'}
          },
          {
            params:{
              oldDirPaths:postString,
              newFatherPath:newFatherPath,
            }
          })
          .then(function (res) {
            console.log(res);
            let errorFlag = 0;
            for(let i = 0; i<res.data.length; i++) {
              if(res.data[i].status !== '移动成功') {
                errorFlag ++;
              }
            }
            if(errorFlag === 0) {
              this.drawMsg('success', '所有文件移动成功！');
              this.loadFileList();
            }
            else if(errorFlag < res.data.length) {
              this.drawMsg('success', '部分文件移动成功');
              this.loadFileList();
            }
            else if(errorFlag === res.data.length) {
              this.drawMsg('error','所有文件移动失败');
            }
          }.bind(this))
          .catch(function (err) {
            console.log(err)
            this.drawMsg('error', '文件移动失败！');
          }.bind(this))
      },
      /*文件复制*/
      copyFile(newFatherPath) {
        let postString = '';
        for(let i = 0 ; i<this.fileSelection.length; i++) {
          if(i!==0)
            postString += ','
          postString += this.fileSelection[i].path;
        }
        this.$axios.post('/user/file/copy/all',
          {
            srcPaths:postString,
            dstPath:newFatherPath,
          })
          .then(function (res) {
            if(res.data.code === 0)
              this.drawMsg('success', '复制成功！');
            else if(res.data.code === 1)
              this.drawMsg('error','复制失败, 文件(夹)冲突！')
            else if(res.data.code === 2)
              this.drawMsg('error', res.data.msg)
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    mounted(){
      /*console.log(this.breadList)*/
      this.loadDir(this.breadList[this.breadList.length-1].path);
     /* this.loadFileList();*/
    },
  }
</script>

<style scoped>
  .all_operate {
    display: inline-flex;
    padding: 15px 20px;
    min-width: 850px;
  }
  .all_operate div{
    margin-left: 10px;
  }

  .search_and_sort {
    display: inline-flex;
    float: right;
    line-height: 64px;
    margin-right: 5px;
    height: 64px;
    min-width: 250px;
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
    cursor: pointer;
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
