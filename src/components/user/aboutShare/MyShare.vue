<template>
  <div>
    <div class="tip_and_cancel">
      <el-col class="tip">链接分享<span>(分享失败超过1年以上的链接记录将被自动清理)</span></el-col>
    </div>

    <div class="load_num">
      <el-col :span="12">
        <transition name="el-fade-in-linear">
          <div v-show="fileSelection.length > 0">
             <el-button @click="showCancelShareDialog = true" icon="el-icon-remove-outline" >取消分享</el-button>
          </div>
        </transition>
      </el-col>
      <p :span="12" class="load_num_len">已加载全部，共 {{ fileList.length }} 个</p>
    </div>

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
      @cell-dblclick=""
      :default-sort = "{prop: 'time', order: 'descending'}">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="link_class">
            <p :id="'link'+scope.row.id">
              <span>链接：</span>
              <a >{{GLOBAL.MY_URL+ '/#/share/' +scope.row.charId}}</a>
              <span v-if="scope.row.ifPasswd === 'yes'">密码：{{scope.row.passwd}}</span>
            </p>
            <el-button class="copyLink" :data-clipboard-target='"#link"+scope.row.id' @click="copyLink">复制</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="30">
        <template slot-scope="scope" class="lock_icon">
          <i class="fa fa-lock" v-show="scope.row.ifPasswd === 'yes'" ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="分享文件"
        sortable>
        <template slot-scope="scope">
          <el-row class="file_and_tools"  v-bind:hoverFileID=scope.row.charId>
            <el-col :span="18" class="icon_and_name">
              <img class="table_file_icon"
                   :src="require('../../../assets/file_icon/'+scope.row.type+'.png')">
              <p class="table_file_name" @click="">{{ scope.row.shareName }}</p>
            </el-col>
            <el-col :span="5" class="file_operate" v-show="hoverFileID == scope.row.charId">
              <a @click="showCancelShareDialog = true"><i class="el-icon-remove-outline"></i></a>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="分享时间"
        width="240"
        sortable>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
     import Clipboard from 'clipboard'
    export default {
      name: "my-share",
        data(){
          return{
            fileList:[{
              id:252,
              charId: 'rozk8nxM',
              shareName :'shw2等',
              type:'folder',
              passwd:'-1',
              ifPasswd:'no',
              time:'2018-03-02',
            },
              {
                id:253,
                charId: 'rozk8sss',
                shareName :'testFilenam',
                type:'folder',
                passwd:'hEvq',
                ifPasswd:'yes',
                time:'2018-03-02',
              }],
            fileSelection:[],
            clickFile:'',
            hoverFileID:-1,
            showCancelShareDialog:false,
          }
        },
        methods: {
          drawMsg(type, content) {
            this.$message({
              message: content,
              type: type
            });
          },
          loadFileList(){
            this.$axios.post('/home/share/all')
              .then(function (res) {
                if(res.data.code === 0) {
                  this.fileList = res.data.data;
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          /*文件选择触发的事件*/
          handleFileSelect(val){
            this.fileSelection = val;
          },
          /*单击选择单元格事件*/
          handleCurrentClick(val) {
            if(val === null)
              return;
            this.clickFile = val.charId;
            this.$refs.fileSelection.clearSelection();
            this.$refs.fileSelection.toggleRowSelection(this.fileList[this.fileList.indexOf(val)]);

          },
          /*鼠标进入或离开文件单元格时触发的事件*/
          handleMouseEnter(event){
            this.hoverFileID = event.charId;
          },
          handleMouseLeave(){
            this.hoverFileID = '-1';
          },
          /*复制链接*/
          copyLink(){
            new Clipboard('.copyLink');
          },
          /*取消分享*/
          cancelShare(){
            let fileString = '';
            for(let i = 0 ; i<this.fileSelection.length; i++) {
              if(i!==0)
                fileString += ',';
              fileString += this.fileSelection[i].charId;
            }

            this.$axios.post('/home/share/remove',
              {
                id:fileString,
              })
              .then(function (res) {
                if(res.data.code === 0) {
                  this.drawMsg('success', '链接取消成功！');
                  this.loadFileList();
                  this.showCancelShareDialog = false;
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
        },
        mounted(){
          this.loadFileList();
        }
    }
</script>

<style scoped>
  .tip_and_cancel {
    height: 50px;
    display: inline-flex;
    width: 100%;
    padding: 5px 10px;
  }
  .tip{
    height: 40px;
    line-height: 40px;
    color:#999999;
  }

  .load_num{
    width: 100%;
    padding: 0 10px;
  }
  .load_num_len{
    float: right;
    margin-right: 5px;
    height: 40px;
    line-height: 40px;
  }

  .fa-lock{
    font-size: 18px;
    color: cornflowerblue;
    margin-top: 5px;
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

  .link_class {
    display: inline-flex;
  }
  .link_class p {
    height: 30px;
    line-height: 30px;
  }
  .link_class button {
    margin-left: 20px;
    padding:7px 20px;
  }
</style>
