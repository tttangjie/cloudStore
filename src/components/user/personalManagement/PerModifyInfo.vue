<template>
  <el-row class="info_body">
    <el-col :span="5" :offset="1">
      <el-upload
        class="avatar-uploader"
        :action= 'GLOBAL.BASE_URL+"/user/icon/upload?username="+username'
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-bind:src="this.GLOBAL.BASE_URL+'/user/icon/get'" class="avatar" ref="headImgRef">
      </el-upload>
    </el-col>
    <el-col :span="10">
      <el-form ref="form" :model="form" label-width="80px" >
        <el-form-item label="用户名">
         {{username}}
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"> </el-radio>
            <el-radio label="女"> </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <input class="age_box" type="number" v-model.number="form.age">
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="form.city">
            <el-option :label="city" :value="city" :key="city" v-for="city in cityList"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="form.introduction"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="saveInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "per-modify-info",
        data(){
          return{
            headImgRef:'',
            username:this.$cookie.get('username'),
            header: {
              'Content-Type':' multipart/form-data',
            },
            form:{},
            cityList:['北京','上海','天津','重庆','黑龙江', '辽宁','吉林', '河北',
                      '河南','山东','山西','陕西','安徽','浙江','江苏','福建',
                      '广东','海南','四川','云南','贵州','青海','甘肃','江西','台湾',
                      '香港','澳门','内蒙古','宁夏','新疆','西藏','广西','湖北','湖南'],
          }
        },
        methods:{
          drawMsg(type, content) {
            this.$message({
              message:content,
              type: type
            });
          },
          handleAvatarSuccess(res, file) {
            this.$refs.headImgRef.src = this.$refs.headImgRef.src + '?';
            this.$emit('modifyHeadImg');
          },
          beforeAvatarUpload(file) {
            let isJPG;
            if(file.type === 'image/jpeg' || file.type === 'image/png')
              isJPG = true;
            else
              isJPG = false;
            /*const isJPG = file.type === 'image/jpeg';*/
            const isLt3M = file.size / 1024 / 1024 < 3;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt3M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt3M;
          },
          saveInfo(){
            this.$axios.post('/user/info',
              {
                age:this.form.age,
                sex:this.form.sex,
                city:this.form.city,
                introduction:this.form.introduction,
              })
              .then(function (res) {
                if(res.data.code === 0) {
                  this.drawMsg('success', '信息修改成功')
                } else {
                  this.drawMsg('error','信息修改失败')
                }
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          }
        },

        mounted(){
          this.$axios.get('/get/user/info')
            .then(function (res) {
              if(res.data.code === 0){
                this.form = res.data.data;
              } else {
                this.drawMsg('error','信息拉取失败');
              }
            }.bind(this))
            .catch(function (err) {
              console.log(err)
            })
        },
    }
</script>

<style scoped>
  .avatar-uploader .el-upload img{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload img:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  /* chrome */
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button{
    -webkit-appearance: none!important;
    margin: 0;
  }
  /* Firefox */
  input[type=number]{
    -moz-appearance: textfield;
  }

  .age_box {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .submit_btn {
    margin-top: 45px;
    width: 160px;
    margin-left: 50px;
  }
</style>
