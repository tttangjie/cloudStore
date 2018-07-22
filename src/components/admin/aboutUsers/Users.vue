<template>
  <div>
    <!--用户列表表格-->
    <el-table
      :data="users"
      stripe
      class="user_table"
      :default-sort = "{prop: 'create_date', order: 'descending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="年龄 :">
              <span>{{ props.row.age }}</span>
            </el-form-item>
            <el-form-item label="性别 :">
              <span>{{ props.row.sex }}</span>
            </el-form-item>
            <el-form-item label="省份 :">
              <span>{{ props.row.city }}</span>
            </el-form-item>
            <el-form-item label="手机号 :">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="个人说明 :">
              <span>{{ props.row.introduction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        label="VIP"
        prop="vip"
        width="60"
        :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
        :filter-method="filterVIP">
        <template slot-scope="scope" >
          <img :src="isVIP(scope.row.vip)" class="user_vip">
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_date"
        width="230"
        sortable>
      </el-table-column>
      <el-table-column
        label="磁盘使用情况">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="15">
              <el-progress
                class="disk_percentage"
                :text-inside="true"
                :stroke-width="16"
                :percentage="scope.row.usedInfo">
              </el-progress>
            </el-col>
            <el-col :span="8" :offset="1">
              <p>{{scope.row.usedsize}} / {{scope.row.totalsize}}</p>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="用户状态"
        width="120"
        :filters="[{ text: '账号正常', value: 0 }, { text: '已申诉', value: 1 }, { text: '未申诉', value: 2 },{ text: '已驳回', value: 3 }]"
        :filter-method="filterState">
        <template slot-scope="scope" >
          <el-button
            class="state_btn"
            :type="stateType(scope.row.state)"
            disable-transitions
            @click = "viewAppeal(scope.row.username, scope.row.state)">
            {{scope.row.stateStr}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--校验申诉-->
    <el-dialog
      title="用户申诉"
      :visible.sync="showExamineDialog"
      width="40%">
        <span>
          {{ appeal.content }}
        </span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAppeal">驳 回</el-button>
          <el-button type="primary" @click="unfreezeUser(appeal.username)">解 冻</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "users",
        data(){
          return{
            users:[],
            image:{
              yes:require('../../../assets/icon_vip.png'),
              no:require('../../../assets/icon_no_vip.png'),
            },
            showExamineDialog:false,
            appeal:{
              username:'',
              content:''
            },
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          loadUsers(){
            this.$axios.post('/infoDisplay')
              .then(function (res) {
                if(res.data.status === '查看成功'){
                  this.users = res.data.result;
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          stateType(flag) {
            if(flag === 0)
              return 'success';
            else if(flag === 1)
              return 'warning';
            else if(flag === 2)
              return 'danger';
            else
              return 'info'
          },
          isVIP(flag) {
            if(flag === 1)
              return require('../../../assets/icon_vip.png');
            else if(flag === 0)
              return require('../../../assets/icon_no_vip.png');
          },
          filterState(value, row) {
            return row.state === value;
          },
          filterVIP(value, row) {
           return row.vip === value;
          },
          viewAppeal(username, state) {
            if(state === 1) {
              this.showExamineDialog  = true;
              this.appeal.username = username;
              this.examineAppeal(username)
            }
          },
          examineAppeal(username) {
            this.$axios.post('comView',
              {
                username:username,
              })
              .then(function (res) {
                this.appeal.content = res.data.result.cominfo;
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          unfreezeUser(username){
            this.$axios.post('/modeEnable',
              {
                username:username,
              })
              .then(function (res) {
                if(res.data === 1) {
                  this.showExamineDialog = false;
                  this.drawMsg('success', '解冻成功！');
                  this.loadUsers();
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
          cancelAppeal(){
            this.showExamineDialog = false;
            this.$axios.post('/subFailure',
              {
                username:this.appeal.username,
              })
              .then(function (res) {
                if(res.data.result) {
                  this.drawMsg('success', '驳回成功！');
                  this.loadUsers();
                }
                else
                  this.drawMsg('error', '驳回失败！');
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },
        mounted(){
          this.loadUsers();
        }
    }
</script>

<style scoped>
  .user_table {
    width: 90%;
    margin-left: 5%;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .user_vip {
    height: 23px;
  }
  .disk_percentage {
    margin-top: 3px ;
  }
  .state_btn {
    height: 23px;
    line-height: 23px;
    padding: 0px 20px;
  }
</style>
