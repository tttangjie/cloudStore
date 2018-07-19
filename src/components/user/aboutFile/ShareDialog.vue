<template>
  <el-dialog
    title="分享文件（夹)"
    :visible.sync="showShareDialog"
    width="530px"
    height="40%"
    :close-on-click-modal=false
    :close-on-press-escape=false
    @open="fatherShowFalse"
    @close="showShareFirst = true">
     <span v-if="showShareFirst">
       <el-row>
         <el-col :span="5">
           分享形式
         </el-col>
         <el-col :span="15">
           <div>
             <div class="share_radio">
               <el-radio v-model="ifPasswd" label=yes >加密 <span>仅限拥有密码者可查看，更加隐私安全</span></el-radio>
             </div>
              <div class="share_radio">
                <el-radio v-model="ifPasswd" label=no >公开 <span>任何人可查看或下载</span></el-radio>
              </div>
            </div>
         </el-col>
       </el-row>
     </span>
      <span slot="footer" class="dialog-footer" v-if="showShareFirst">
        <el-button type="primary" @click="createLink">创建链接</el-button>
        <el-button @click="showShareDialog = false">取 消</el-button>
      </span>

      <span v-if="!showShareFirst">
          <p class="link_type">
            <i class="el-icon-success"></i>
            成功创建
            <span v-show="ifPasswd === 'yes'">私密</span>
            <span v-show="ifPasswd === 'no'">公开</span>
            链接
          </p>
          <el-row>
            <el-col :span="15">
              <el-input v-model="linkUrl" readonly id="linkURL"> </el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button
                v-show="ifPasswd === 'yes'"
                type="primary"
                id="copyBtnTrue"
                :data-clipboard-text="'链接：'+linkUrl+' 密码：'+linkPWD"
                @click="copyLink(true)">
                双击复制链接及密码
              </el-button>
              <el-button
                v-show="ifPasswd === 'no'"
                type="primary"
                class="copyBtn"
                id="copyBtnFalse"
                :data-clipboard-text="'链接：'+linkUrl"
                @click="copyLink(false)">
                双击复制链接
              </el-button>
            </el-col>
          </el-row>
          <el-row v-show="ifPasswd === 'yes'" class="get_pwd">
            <el-col :span="3">
              <p>提取密码</p>
            </el-col>
            <el-col :span="4">
              <el-input v-model="linkPWD" readonly id="linkPWD"> </el-input>
            </el-col>
          </el-row>
      </span>
      <span slot="footer" class="dialog-footer" v-if="!showShareFirst">
        <el-button @click="showShareDialog = false; showShareFirst = true">关 闭</el-button>
      </span>

  </el-dialog>

</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import Clipboard from 'clipboard'
  export default {
    components: {ElRow},
    name: "share-dialog",
    props: {
      show: Boolean,
      fileSelection:Array,
    },
    data() {
      return {
        showShareDialog: this.show,
        showShareFirst: true,
        ifPasswd:'yes',
        fileString:'',
        linkID:'',
        linkPWD:'',
        linkUrl:'',
      }
    },
    methods:{
      drawMsg(type, content) {
        this.$message({
          message:content,
          type: type
        });
      },
      createLink(){
        this.$axios.post('/get/shared/link',
          {
            filePath:this.fileString,
            ifPasswd:this.ifPasswd,
          })
          .then(function (res) {
            if(res.data.code === 0) {
              this.showShareFirst = false;
              this.linkID = res.data.data.id;
              this.linkPWD = res.data.data.passwd;
              this.linkUrl = this.GLOBAL.MY_URL+ '/#/share/' +this.linkID;
            }
            else {
              this.drawMsg('error', '链接创建失败！')
            }
          }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
      },
      copyLink(isPrivate){
        if(isPrivate){
          let btn = document.getElementById('copyBtnTrue');
          let clipboard = new Clipboard(btn);
          clipboard.on('success', function() {
            clipboard.destroy()
          });
          clipboard.on('error', function() {
            clipboard.destroy();
          });
        } else {
          let btn = document.getElementById('copyBtnFalse');
          let clipboard = new Clipboard(btn);
          clipboard.on('success', function() {
            clipboard.destroy()
          });
          clipboard.on('error', function() {
            clipboard.destroy();
          });
        }

      },
      fatherShowFalse(){
        this.$emit('showShareDialogFalse');
      }
    },
    mounted(){

    },
    watch:{
      show:function () {
        if(this.show){
          this.showShareDialog = true;
        }
        this.fileString = '';
        for(let i = 0 ; i<this.fileSelection.length; i++) {
          if(i!==0)
            this.fileString += ',';
          this.fileString += this.fileSelection[i].path;
        }
      },
    }
  }
</script>

<style scoped>
  .share_radio{
    margin-bottom: 20px;
  }
  .share_radio span{
    color: #8b909e;
  }
  .link_type {
    color: #3b8cff;
    margin-bottom: 30px;
  }
  .get_pwd {
    margin-top: 25px;
  }
  .get_pwd p{
    height: 40px;
    line-height: 40px;
  }
</style>
