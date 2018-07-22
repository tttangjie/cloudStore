<template>
  <div class="dashboard_body">
    <p class="dashboard_title">DASHBOARD</p>

    <el-row>
      <el-col :span="6">
        <el-card
          shadow="hover"
          class="dashboard_info_card dashboard_info_card_admin">
          <i class="fa fa-vcard-o"></i>
          <p class="dashboard_info_card_num">{{info.admin}}</p>
          <p>管理员人数</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard_info_card dashboard_info_card_users">
          <i class="fa fa-user"></i>
          <p class="dashboard_info_card_num">{{info.users}}</p>
          <p>用户总人数</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard_info_card dashboard_info_card_vip">
          <i class="fa fa-vimeo"></i>
          <p class="dashboard_info_card_num">{{info.vip}}</p>
          <p>VIP用户</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard_info_card dashboard_info_card_check">
          <i class="fa fa-calendar-check-o"></i>
          <p class="dashboard_info_card_num">{{info.check}}</p>
          <p>待处理申诉</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-card class="draw_echars_card">
          <div slot="header">
            <span>用户日访问量</span>
          </div>
          <div>
            <visitor> </visitor>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="draw_echars_card">
          <div slot="header">
            <span>磁盘空间容量</span>
          </div>
          <div>
            <capacity> </capacity>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import capacity from '../aboutEchars/capacity'
  import visitor from '../aboutEchars/userVisitor'
    export default {
        name: "dashboard",
        components:{
          capacity,
          visitor,
        },
        data(){
          return{
            info:{
              admin: 6,
              users: 0,
              vip:0,
              check:0,
            }
          }
        },
        methods:{
          getInfo(){
            this.$axios.post('/countData')
              .then(function (res) {
                if(res.data.status === '获得数据成功') {
                  this.info = res.data.result;
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },
        mounted() {
          this.getInfo();
        }
    }
</script>

<style scoped>
  .dashboard_body {
    padding: 20px 30px;
  }
  .dashboard_title{
    margin-left: 15px;
    border-bottom: none;
    opacity: 0.7;
    text-transform: uppercase;
    padding-bottom: 9px;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -1px;
  }

  .dashboard_info_card {
    height: 98px;
    margin: 0 15px;
  }
  .dashboard_info_card_num {
    position: relative;
    font-size: 30px;
    font-weight: 700;
    margin: 0;
  }
  .dashboard_info_card i {
    font-size: 45px;
    float: right;
    margin-top: 30px;
  }
  .dashboard_info_card_admin{
    background: #70c1b3;
    color: #fff;
  }
  .dashboard_info_card_admin i{
    color: rgba(255, 255, 255, 0.6);
  }
  .dashboard_info_card_users{
    background: #f3ffbd;
    color: #475700;
  }
  .dashboard_info_card_users i{
    color: rgba(71, 87, 0, 0.6);
  }
  .dashboard_info_card_vip{
    background: #57889c;
    color: #fff;
  }
  .dashboard_info_card_vip i{
    color: rgba(255, 255, 255, 0.6);
  }
  .dashboard_info_card_check{
    background: #eb547c;
    color: #fff;
  }
  .dashboard_info_card_check i{
    color: rgba(255, 255, 255, 0.6);
  }

  .draw_echars_card {
    margin: 30px 15px 0 15px;
    height: 360px;
  }
</style>
