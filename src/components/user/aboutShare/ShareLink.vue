<template>
  <div>
    <inputPWD
      v-if="showCheckPWD"
      :username="shareLink.username"
      :id="shareLink.id"
      v-on:getFileSuccess="getFileSuccess">
    </inputPWD>

    <div v-if="!showCheckPWD">
      <el-header>
        <home_header> </home_header>
      </el-header>

      <div id="share_contain" class="share_contain">
        <el-row style="height: 100%;">
          <el-col :span="20" class="share_info_box">
            <!--文件信息及操作按钮-->
            <el-row class="share_info_and_operate">
              <el-col :span="14">
                <div class="share_info">
                  <img :src="require('../../../assets/file_icon/'+shareLink.type+'.png')">
                  <p>{{ shareLink.shareName }}</p>
                </div>
                <p class="share_time">
                  <i class="el-icon-time"></i> {{ shareLink.shareTime }}
                </p>
              </el-col>
              <el-col :span="10" class="share_operate">
                <el-button
                  icon="el-icon-edit-outline"
                  type="primary"
                  @click="checkShowTreeDialog"
                  v-show="shareLink.username === nowUsername">
                  保存到网盘
                </el-button>
                <el-button
                  icon="el-icon-remove-outline"
                  @click="showCancelShareDialog = true"
                  v-show="shareLink.username !== nowUsername">
                  取消分享
                </el-button>
                <el-button icon="el-icon-download" @click="downloadFiles">
                  下载
                </el-button>
              </el-col>
            </el-row>

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
              @selection-change="handleFileSelect">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="filename"
                label="文件名"
                sortable>
                <template slot-scope="scope">
                  <el-row class="file_and_tools" >
                    <el-col :span="18" class="icon_and_name">
                      <img class="table_file_icon"
                           :src="require('../../../assets/file_icon/'+scope.row.type+'.png')">
                      <p class="table_file_name"
                         @click="enterOrPreview(scope.row.path, scope.row.type, scope.row.filename)">{{ scope.row.filename }}</p>
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
          </el-col>

          <!--目录树-->
          <DirectoryTree
            :show="showTreeDialog"
            v-on:showTreeDialogFalse="showTreeDialog = false"
            v-on:confirmSelectPath="copyToMine">
          </DirectoryTree>

          <div>
              <!--确认取消分享的Dialog-->
              <el-dialog
                title="确认取消分享吗？"
                :visible.sync="showCancelShareDialog"
                width="30%"
                center>
                <span>取消后记录将被删除，此链接将无法再被访问。</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="showCancelShareDialog = false">取 消</el-button>
                  <el-button type="primary" @click="cancelShare">确 定</el-button>
               </span>
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

              <!--预览PDF文件的Dialog-->
              <el-dialog
                :visible.sync="showPDF"
                width="72%"
                :close-on-click-modal=false
                :close-on-press-escape=false
                @close="deletePDF"
                center>
                <pdfView  :pdfurl="pdfurl"> </pdfView>
              </el-dialog>
          </div>

          <!--分享者的相关信息-->
          <el-col :span="4" class="share_user_info">
            <div class="username_and_head_img">
              <img v-bind:src="this.GLOBAL.BASE_URL+'/icon/get?username='+shareLink.username">
              <p>{{shareLink.username}}</p>
            </div>
            <div class="user_intro">
              <p>说明：{{ shareLink.userIntro }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
    import InputPWD from './InputPWD'
    import home_header from '../HomeHeader'
    import DirectoryTree from '../aboutFile/DirectoryTree'
    import pdfView from '../aboutFile/PDFView'
    export default {
        name: "share-link",
        components:{
          home_header,
          InputPWD,
          DirectoryTree,
          pdfView,
        },
        data(){
          return {
            bodyHeight: document.documentElement.clientHeight-60,
/*
            shareLink:{
              id:this.$route.params.id,
              username:'',
              fileList:[],
              shareName:'',
              shareTime:'',
              userIntro:'',
            },
*/
            shareLink:{
              id:this.$route.params.id,
              username:'tj',
              fileList:[
                {
                  filename:"testLink",
                  owner:'victo',
                  path:"/tj/testLink",
                  size:'0 B',
                  time:"2018-07-19 09:37",
                  len:0,
                  type:'folder'
                }
              ],
              shareName:'testLink',
              shareTime:'2018-07-19 09:37',
              userIntro:'HELLO VUE!',
              type:'folder',
            },
            nowUsername:'',
            showCheckPWD:false,
            fileList:[],
            rootPath:'/zlw',
            breadList:[{path:this.rootPath ,name:'全部文件'}],
            showBackToPre:false,
            fileSelection:[],
            clickFile:'',
            showTreeDialog:false,
            pdfurl:'',
            showCancelShareDialog:false,
            showPDF:false,
            showVideoPlay:false,
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          /*分享的链接是否需要密码查看*/
          loadLinkNeedPWD(){
            this.$axios.post('/home/share',
              {
                id: this.shareLink.id,
                username: this.nowUsername,
              })
              .then(function (res) {
                if(res.data.code === 0) {
                  if(res.data.data.ifPasswd === 'yes') {
                    this.showCheckPWD = true;
                    this.shareLink.username = res.data.data.shareUsername;
                  }
                  else {
                    this.getFileSuccess(res.data.data);
                  }
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          getFileSuccess(res){
            this.shareLink.username = res.username;
            this.shareLink.fileList = res.info;
            this.shareLink.shareName = res.shareName;
            this.shareLink.shareTime = res.shareTime;
            this.shareLink.userIntro  = res.userIntro;
            this.showCheckPWD = false;
            this.fileList = this.shareLink.fileList;
          },

          /*通过breadList中的path加载目录*/
          loadDir(path){
            for(let i = this.breadList.length-1; i >= 0; i--) {
              if(this.breadList[i].path !== path) {
                this.breadList.pop();
              }
              else break;
            }
            if(this.breadList.length > 1) {
              this.loadFileList();
              this.showBackToPre = true;
            }
            else{
              this.fileList = this.shareLink.fileList;
              this.showBackToPre = false;
            }
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
          },
          /*预览文件、文件夹*/
          enterOrPreview(path, type, name){
            if(type === 'folder'){
              this.addBreadList(path, name);
            }
            else if(type === 'doc' || type === 'ppt' || type === 'txt' || type === 'code' ||  type === 'xls' || type === 'pdf' || type === 'img'){
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
            else if(type === 'video') {
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
          /*下载文件*/
          downloadFiles(){
            if(this.fileSelection.length < 1) {
              this.drawMsg('warning', '请先选择文件')
            }
            else if(this.fileSelection.length === 1) {
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
          /*移动到自己的网盘*/
          checkShowTreeDialog(){
            if(this.fileSelection.length<1)
              this.drawMsg('warning', '请先选择文件！')
            else
              this.showTreeDialog = true
          },
          copyToMine(newFatherPath) {
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

          /*取消分享*/
          cancelShare(){
            this.$axios.post('/home/share/remove',
              {
                id:this.shareLink.id,
              })
              .then(function (res) {
                if(res.data.code === 0) {
                  this.drawMsg('success', '链接取消成功！');
                  this.showCancelShareDialog = false;
                  /*关闭页面操作*/
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
        },
      beforeMount(){
        window.onresize = function () {
          this.bodyHeight = document.documentElement.clientHeight-60;
          if(document.getElementById('share_contain') != null) {
            document.getElementById('share_contain').style.height = this.bodyHeight + "px";
          }
        }
      },
        mounted(){
          document.getElementById('share_contain').style.height =this.bodyHeight + "px";

          this.nowUsername = this.$cookie.get('username');
          /*this.loadLinkNeedPWD();*/
          console.log(this.shareLink)
          this.fileList = this.shareLink.fileList;

        },
    }
</script>

<style scoped>
  .el-header {
    padding: 0;
  }
  .share_contain{
    background: #edf1f5;
    padding: 10px 30px 0 30px;
    min-width: 1050px;
    color: #424e67;
  }
  .share_info_box {
    border-top-left-radius: 8px;
    background: white;
    height: 100%;
  }
  .share_info_and_operate {
    padding: 15px 10px;
    border-bottom: 1px solid #e1e1e1;
  }

  .share_info {
    display: inline-flex;
    margin-left: 5px;
    margin-top: 10px;
  }
  .share_info p {
    height: 32px;
    line-height: 32px;
    margin-left: 5px;
  }
  .share_time {
    margin-left: 5px;
    margin-top: 10px;
  }
  .share_operate {
    display: inline-flex;
    margin-top: 10px;
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

  .share_user_info {
    border-top-right-radius: 8px;
    background: #f3f8ff;
    height: 100%;
  }
  .username_and_head_img {
    display: inline-flex;
  }
  .username_and_head_img img{
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-left: 10px;
    border-radius: 90px;
  }
  .username_and_head_img p{
    margin-left: 10px;
    line-height: 80px;
    height: 80px;
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .user_intro {
    margin-left: 10px;
    max-width: 200px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
</style>
