<template>
  <div>
    <div class="tip_and_clear">
      <el-col class="tip">提示：回收站不占用网盘空间</el-col>
      <el-button @click="recoveryFiles" icon="el-icon-refresh" class="clear">还原</el-button>
      <el-button @click="deleteFiles" icon="el-icon-tickets" class="clear">删除</el-button>
      <el-button @click="cleanRecycle" icon="el-icon-delete" class="clear">清空回收站</el-button>
      <el-switch
        style="display: block"
        class="switch-timed"
        v-model="isTimed"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="定时清空">
      </el-switch>
    </div>

    <div class="load_num">
      <el-col :span="12" class="load_num_name">回收站</el-col>
      <p :span="12" class="load_num_len">已加载全部，共 {{ recycleList.length }} 个</p>
    </div>

    <el-table
      ref="fileSelection"
      :data="recycleList"
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
              <p class="table_file_name">{{ scope.row.fileName }}</p>
            </el-col>
            <el-col :span="5" class="file_operate" v-show="hoverFilePath === scope.row.path">
              <a @click="recoveryFile"><i class="el-icon-refresh"></i></a>
              <a @click="deleteFile"><i class="el-icon-delete"></i></a>
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
        prop="delTime"
        label="删除时间"
        width="180"
        sortable>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

    export default {
      name: "recycle",
        data(){
          return{
            user:'/'+this.$cookie.get('username'),
            recycleList:[],
            hoverFilePath:'',
            fileSelection:[],
            clickID:0,
            clickIDs:[],
            isTimed:false
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          /*加载回收站中的文件列表*/
          loadRecycleList(){
            this.$axios.get('/user/recycle/get')
              .then(function (res) {
                this.recycleList = res.data.data;
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
            this.clickID = val.recoveryId;
            this.$refs.fileSelection.clearSelection();
            this.$refs.fileSelection.toggleRowSelection(this.recycleList[this.recycleList.indexOf(val)]);
          },
          /*鼠标进入或离开文件单元格时触发的事件*/
          handleMouseEnter(event){
            this.hoverFilePath = event.path;
          },
          handleMouseLeave(){
            this.hoverFilePath = '';
          },
          /*文件还原*/
          recoveryFile(){
            this.$confirm('是否进行还原操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/user/recycle/restore',
                {
                  id:this.clickID,
                })
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.loadRecycleList();
                    this.drawMsg('success', '单文件还原成功！');
                  } else if(res.data.code === 1)
                    this.drawMsg('error', this.data.msg);
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {

            })
          },
          recoveryFiles(){
            this.$confirm('是否进行还原操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let postString = '';
              for(let i = 0 ; i<this.fileSelection.length; i++) {
                if(i!==0)
                  postString += ','
                postString += this.fileSelection[i].recoveryId;
              }
              this.$axios.post('/user/recycle/restore/all',
                {
                  ids:postString,
                })
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.loadRecycleList();
                    this.drawMsg('success', '多文件还原成功！');
                  } else if(res.data.code === 1) {
                    this.drawMsg('error', '多文件还原失败，其中某文件(夹)已存在！');
                  }
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {

            })
          },
          /*文件删除*/
          deleteFile(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/user/recycle/delete',
                {
                  id:this.clickID,
                })
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.loadRecycleList();
                    this.drawMsg('success', '文件删除成功！');
                  }
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {

            })
          },
          deleteFiles(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let postString = '';
              for(let i = 0 ; i<this.fileSelection.length; i++) {
                if(i!==0)
                  postString += ','
                postString += this.fileSelection[i].recoveryId;
              }
              this.$axios.post('/user/recycle/delete/all',
                {
                  ids:postString,
                })
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.loadRecycleList();
                    this.drawMsg('success', '多文件删除成功！');
                  }
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {

            })
          },
          /*清空回收站*/
          cleanRecycle() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/user/delete/all')
                .then(function (res) {
                  if(res.data.code === 0) {
                    this.loadRecycleList();
                    this.drawMsg('success', '清空成功！');
                  }
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {

            })
          },
        },
        mounted(){
          this.loadRecycleList();
        },
        watch:{
          isTimed:function () {
            if(this.isTimed === true)
              this.$axios.post('/timedEmptying',
                {
                  path:this.$cookie.get('username'),
                })
                .then(function (res) {
                  this.drawMsg('success', '定时设置成功！');
                }.bind(this))
                .catch(function (err) {
                  console.log(err)
                })
          }
        }
    }
</script>

<style scoped>
  .tip_and_clear {
    height: 50px;
    display: inline-flex;
    width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid #F2F6FD;
  }
  .tip{
    height: 40px;
    line-height: 40px;
    color:#999999;
  }
  .clear {
    float: right;
    margin-right: 5px;
  }
  .switch-timed {
    width: 200px;
    line-height: 40px;
    height: 40px;
  }

  .load_num{
    width: 100%;
    padding: 0 10px;
  }
  .load_num_len{
    float: right;
    margin-right: 5px;
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
</style>
