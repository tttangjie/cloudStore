<template>
  <div class="send_notice">
    <el-button
      type="primary"
      icon="el-icon-edit"
      @click="sendNotice">
      发布公告
    </el-button>
    <quill-editor
      class="editor_style"
      ref="noticeEditor"
      v-model="noticeContent"
      @blur="onEditorBlur($event)">

    </quill-editor>
  </div>

</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    let stompClient;
    export default {
        name: "notice",
        data(){
          return{
            noticeEditor:'',
            noticeContent:'',
          }
        },
        methods:{
          onEditorBlur(event) {
            this.noticeContent = event.root.innerHTML;
          },
          sendNotice(e){
            stompClient.send("/zhuoyun/Notice", {}, JSON.stringify({'notice': this.noticeContent}));
          },

        },
        mounted(){
          let socket = new SockJS(this.GLOBAL.BASE_URL+'/gs-guide-websocket');
          stompClient = Stomp.over(socket);
          stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
          });
        }
    }
</script>

<style scoped>
  .send_notice{
    height: 80%;
  }
  .send_notice .el-button {
    margin-left: 3%;
    margin-top: 2%;
  }
  .editor_style {
    height: 60%;
    margin-top: 3%;
    width: 94%;
    margin-left: 3%;
  }
</style>
