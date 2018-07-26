<template>
  <div>
    <!--全部文件上面一排工具菜单-->
    <div>
      <div class="all_operate">
        <div  @click="asideRight" class="picker">

        </div>
        <transition name="el-fade-in-linear">
          <div v-show="fileSelection.length > 0">
            <el-button icon="el-icon-share" @click="showShareDialog = true">
              分享
            </el-button>
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
          v-model="searchContent"
          @keyup.native.enter="searchFile">
          <i slot="suffix" class="el-input__icon el-icon-search search_icon" @click="searchFile"></i>
        </el-input>
        <!--<i class="el-icon-sort sort_icon"></i>-->
        <i class="fa fa-reorder sort_icon"></i>
      </div>
    </div>

    <!--列表类型及文件个数-->
    <el-row class="bread_and_count">
      <el-col class="about_bread" :span="16">
        <p v-show="this.pageType.flag!==5">全部</p>{{pageType.name}}
      </el-col>

     <!-- <el-col class="file_count">已加载{{fileList.length}}个</el-col>-->
    </el-row>

    <!--文件表格/文件表格-->
    <el-table
      v-loading="previewLoading"
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
      @cell-dblclick="enterOrPreview(clickFile, fileSelection[0].type, fileSelection[0].fileName)"
      :default-sort = "{prop: 'time', order: 'descending'}">
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
              <a @click="showDecompressDialog = true" v-show="scope.row.type === 'zip'"><i class="el-icon-news"></i></a>
              <a @click="showShareDialog = true"><i class="el-icon-share"></i></a>
              <a @click="downloadFile(scope.row.path, scope.row.type)"><i class="el-icon-download"></i></a>
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

    <!--一些弹出框-->
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

      <!--解压的Dialog-->
      <el-dialog
        title="确认解压"
        :visible.sync="showDecompressDialog"
        width="30%"
        center>
        <span>确认解压文件吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDecompressDialog = false">取 消</el-button>
          <el-button type="primary" @click="decompressFile">确 定</el-button>
        </span>
      </el-dialog>

      <!--目录树的Dialog-->
      <DirectoryTree
        :show="showTreeDialog"
        v-on:showTreeDialogFalse="showTreeDialog = false"
        v-on:confirmSelectPath="moveAndCopy">
      </DirectoryTree>

      <!--分享的Dialog-->
      <ShareDialog
        v-on:showShareDialogFalse="showShareDialog = false"
        :show="showShareDialog"
        :fileSelection="fileSelection">
      </ShareDialog>

      <!--预览PDF文件的Dialog-->
      <el-dialog
        :visible.sync="showPDF"
        width="72%"
        :close-on-click-modal=false
        :close-on-press-escape=false
        @close="deletePDF"
        center>
        <pdf-view  :pdfurl="pdfurl" v-if="showPDF"> </pdf-view>
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
          <video class="video_audio" v-if="showVideoPlay" controls>
              <source v-bind:src='this.GLOBAL.BASE_URL + "/get/stream?fpath="+clickFile' type="video/mp4">
          </video>
        </span>
      </el-dialog>

      <!--预览音乐的Dialog-->
      <el-dialog
        title="在线聆听音乐"
        :visible.sync="showAudioPlay"
        width="60%"
        height="60%"
        center
        :close-on-click-modal=false
        :close-on-press-escape=false>
        <span v-if="showAudioPlay">
          <p class="music_name">{{fileSelection[0].fileName}}</p>
            <audio class="preview_music" controls>
              <source v-bind:src='this.GLOBAL.BASE_URL+"/get/stream?fpath="+clickFile' type="audio/mpeg">
          </audio>
        </span>
      </el-dialog>

      <!--上传列表-->
      <b-aside  :is-show="showUploadAside"
                title="文件上传列表"
                :show-footer="false"
                placement="right"
                :backdrop="false"
                @close="showUploadAside=false">
        <FileUpload
          v-bind:uploadPath="'/'+username"
          @uploadComplete="loadFileList">
        </FileUpload>
      </b-aside>
    </div>
  </div>
</template>

<script>
    import DirectoryTree from '../utils/DirectoryTree'
    import FileUpload from '../utils/fileUpload'
    import ShareDialog from "../utils/ShareDialog";
    export default {
        name: "category",
        components:{
          DirectoryTree,
          FileUpload,
          ShareDialog,
        },
        data(){
          return{
            pageType:{
              name:'',
              type:this.$route.query.type,
              flag:-1,
            },
            pdfurl:'',
            showTreeDialog:false,
            username:this.$cookie.get('username'),
            searchContent:'',
            fileTotal:0,
            fileList:[],
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
            showAudioPlay:false,
            showUploadAside:false,
            showShareDialog: false,
            showDecompressDialog:false,
            previewLoading:false,
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          /*初始化页面*/
          initPageType() {
            this.pageType.type = this.$route.query.type;
            if(this.pageType.type === 'text') {
              this.pageType.name = '文档';
              this.pageType.flag = 1;
            } else if(this.pageType.type === 'video') {
              this.pageType.name = '视频';
              this.pageType.flag = 3;
            } else if(this.pageType.type === 'music') {
              this.pageType.name = '音乐';
              this.pageType.flag = 4;
            } else if(this.pageType.type === 'other') {
              this.pageType.name = '其他文件';
              this.pageType.flag = 5;
            }
            else if(this.pageType.type === 'image') {
              this.pageType.name = '图片';
              this.pageType.flag = 2;
            }
          },
          /*页面文件列表的加载*/
          loadFileList(){
            this.$axios.post('/sort',
              {
                flag:this.pageType.flag,
              })
              .then(function (res) {
                console.log(res)
                this.fileList = res.data.data;
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          /*展示文件上传的侧边栏*/
          asideRight() {
            this.showUploadAside = true;
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
            },
          /*文件选择触发的事件*/
          handleFileSelect(val){
            this.fileSelection = val;
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
            else if(type === 'doc' || type === 'ppt' || type === 'txt' || type === 'code' ||  type === 'xls' || type === 'img' || type === 'pdf'){
              this.previewLoading = true;
              this.$axios.post('/file2Pdf',
                {
                  input:path
                })
                .then(function (res) {
                  this.previewLoading = false;
                  this.pdfurl = res.data.result;
                  this.showPDF = true;
                }.bind(this))
                .catch(function (err) {
                  this.drawMsg('error','文件预览失败')
                  console.log(err)
                }.bind(this))
            }
            else if(type === 'video') {
              this.showVideoPlay = true;
            }
            else if(type === 'music') {
              this.showAudioPlay = true;
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
          },
          /*解压文件*/
          decompressFile(){
            this.$axios.post('/decompress', {
              path:this.clickFile,
            })
              .then(function (res) {
                if(res.data.status === '解压成功'){
                  this.showDecompressDialog = false;
                  this.drawMsg('success', res.data.result);
                  this.loadFileList();
                }
                else if(res.data.status === '解压失败') {
                  this.showDecompressDialog = false;
                  this.drawMsg('error', res.data.result);
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          /*文件搜索*/
          searchFile(){
            this.$axios.post('/search/file', {
              searchWord:this.searchContent,
            })
              .then(function (res) {
                this.fileList = res.data.data;
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },


        mounted(){
          this.initPageType();
          this.loadFileList();
        },
        watch:{
          '$route.query.type':function () {
              this.initPageType();
              this.loadFileList();
          }
        }
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
    padding-left: 2px ;
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

  .video_audio {
    width: 100%;
    height: 450px;
    overflow: hidden;
  }
  .preview_music {
    width: 60%;
    margin-left: 20%;
    margin-top: 60px;
  }
  .music_name {
    margin-top: 5%;
    font-size: 18px;
    width: 100%;
    text-align: center;
  }

</style>
