<template>
  <div id="uploader" class="wu-example" v-if="">
    <el-row class="about_upload_btn">
      <!--<el-button id="uploadStartBtn" type="primary">全部开始</el-button>
      <el-button id="uploadStopBtn">全部暂停</el-button>-->
      <el-switch
        style="display: block"
        v-model="stopOrStart"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="开始"
        inactive-text="暂停">
      </el-switch>
    </el-row>
    <div id="thelist" class="uploader-list">

    </div>
    <!--<div id="picker">  </div>-->
    <!--<el-button id="ctlBtn" class="btn btn-default">开始上传</el-button>-->
  </div>
</template>

<script>
    import $ from 'jquery'
    export default {
        name: "file-upload",
        props:{
          uploadPath: {
            type: String,
            required:true,
          }
        },
        data(){
          return{
            uploader:'',
            chunkSize : 5 * 1024 * 1024,
            $thelist:'',
            stopOrStart:true,
            fileItem:[],
            username:this.$cookie.get('username'),

          }
        },
        methods:{
          // 初始化uploader
          initWebUpload(){
            this.uploader = WebUploader.create({
              pick: {
                id: '.picker',
                label: '<i class="el-icon-upload2"></i>上传',
                multiple:true, // 是否多文件上传 默认false
              },
              formData: {
                uid: 0,
                md5: '',
                chunkSize: this.chunkSize,
                username: this.username,
                path:this.uploadPath,
              },
              swf:'../../../../static/webuploader/Uploader.swf',
              chunked: true, //分片上传
              chunkSize: this.chunkSize, // 分片上传大小 字节 1M分块
              /**
               * 限制分片上传数目为1
                这个是关键 如果开启了分片上传 并不限制同时上传的数目 会导致后台接受的分片错乱 比如按正常的分片第一片应该是开头
                但接收的可能就变成第三片从而顺序错乱 这是由于百度webuploader默认允许同时最大上传进程数为3个
                所以会导致接受顺序错乱从而重组发生错误，故这里设置为1
               */
              threads: 1,
              server:this.GLOBAL.BASE_URL + '/break/fileUpload',
              auto: true, // 选完文件后，是否自动上传
              duplicate: true, // 重复上传

              // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
              disableGlobalDnd: true,
              fileNumLimit: 1024, // 限制上传个数
              fileSizeLimit: 1.5 * 1024 * 1024 * 1024,    // 1.5G
              fileSingleSizeLimit: 1024 * 1024 * 1024    // 1 G
            });
          },
          // 当有文件被添加进队列的时候
          fileQueud(file) {
            console.log("fileQueued");
            this.$thelist.append(
              '<div id="' + file.id + '" class="fileItem">' +
              '<p class="info upload_file_title">' + file.name + '</p>' +
              '<p class="state">等待上传...</p>' +
              '</div>');
          },
          //文件发送前先查询有没有上传过 ,MD5表示文件的唯一标识
          beforeSendFile(file){
            console.log("beforeSendFile");
            // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
            let task = new $.Deferred();
            // 根据文件内容来查询MD5
            this.uploader.md5File(file).progress(function (percentage) {   // 及时显示进度
              console.log('计算md5进度:', percentage);
              this.getProgressBar(file, percentage, "MD5", "MD5");
            })
              .then(function (val) { // 完成
              console.log('md5 result:', val);
              console.log(file.uid)
              file.md5 = val;
              // 模拟用户id
              // file.uid = new Date().getTime() + "_" + Math.random() * 100;
              file.uid = WebUploader.Base.guid();
              // 进行md5判断
     /*         this.$axios.post("/break/checkFileMd5",
                {
                  uid: file.uid,
                  fileMd5: file.md5,
                  path:this.uploadPath,
                  fileName:file.name,
                })
                .then(function (res) {
                  console.log(res.data)
                  let status = res.data.status.value;
                  task.resolve();
                  if (status === 101) {
                    // 文件不存在，那就正常流程
                  } else if (status === 100) {
                    // 忽略上传过程，直接标识上传成功；
                    this.uploader.skipFile(file);
                    file.pass = true;
                  } else if (status === 102) {
                    // 部分已经上传到服务器了，但是差几个模块。
                    file.missChunks = res.data.data;
                  }}.bind(this))
                .catch(function (err) {
                  console.log(err)
                })*/
                $.ajax({
                  type:"post",
                  url:this.GLOBAL.BASE_URL +"/break/checkFileMd5",
                  async:false,
                  data:{
                    uid: file.uid,
                    fileMd5: file.md5,
                    path:this.uploadPath,
                    fileName:file.name,
                    username:this.username,
                    fileSize:file.size,
                  },
                  success: function (data) {
                    let status = data.status.value;
                    task.resolve();
                    if (status == 101) {
                      // 文件不存在，那就正常流程
                    } else if (status == 100) {
                      // 忽略上传过程，直接标识上传成功；
                      this.uploader.skipFile(file);
                      file.pass = true;
                    } else if (status == 102) {
                      // 部分已经上传到服务器了，但是差几个模块。
                      file.missChunks = data.data;
                    }
                    else if (status == 104) {
                      // 部分已经上传到服务器了，但是差几个模块。
                      this.uploader.skipFile(file);
                      file.full = true;
                    }
                  }.bind(this)
              });
            }.bind(this));
            return $.when(task);
          },
          beforeSend(block) {
            console.log("block")
            let task = new $.Deferred();
            let file = block.file;
            let missChunks = file.missChunks;
            let blockChunk = block.chunk;
            console.log("当前分块：" + blockChunk);
            console.log("missChunks:" + missChunks);
            if (missChunks !== null && missChunks !== undefined && missChunks !== '') {
              let flag = true;
              for (let i = 0; i < missChunks.length; i++) {
                if (blockChunk == missChunks[i]) {
                  console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                  flag = false;
                  break;
                }
              }
              if (flag) {
                task.reject();
              } else {
                task.resolve();
              }
            } else {
              task.resolve();
            }
            return $.when(task);
          },

          //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
          uploadBeforeSend(obj, data){
            console.log("onUploadBeforeSend");
            let file = obj.file;
            data.md5 = file.md5 || '';
            data.uid = file.uid;
          },
          // 上传中
          uploadProgress(file, percentage) {
            this.getProgressBar(file, percentage, "FILE", "上传进度");
          },
          // 上传返回结果
          uploadSuccess(file) {
            if (file.full) {
              this.drawMsg('error','磁盘空间不足');
              return ;
            }
            let text = '已上传';
            if (file.pass) {
              text = "文件秒传成功。"
            }
            $('#' + file.id).find('p.state').text(text);
          },
          uploadError(file) {
            $('#' + file.id).find('p.state').text('上传出错');
          },
          uploadComplete(file) {
            this.$emit('uploadComplete')
            // 隐藏进度条
/*
            this.fadeOutProgress(file, 'MD5');
            this.fadeOutProgress(file, 'FILE');
*/
          },

          /**
           *  生成进度条封装方法
           * @param file 文件
           * @param percentage 进度值
           * @param id_Prefix id前缀
           * @param titleName 标题名
           */
          getProgressBar(file, percentage, id_Prefix, titleName) {
            let $li = $('#' + file.id), $percent = $li.find('#' + id_Prefix + '-progress-bar');
            // 避免重复创建
            if (!$percent.length) {
              $percent = $('<div id="' + id_Prefix + '-progress" class="progress progress-striped active">' +
                '<div id="' + id_Prefix + '-progress-bar" class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>'
              ).appendTo($li).find('#' + id_Prefix + '-progress-bar');
            }
            let progressPercentage = (percentage * 100).toFixed(2) + '%';
            $percent.css('width', progressPercentage);
            $percent.html(titleName + ':' + progressPercentage);
          },

          /**
           * 隐藏进度条
           * @param file 文件对象
           * @param id_Prefix id前缀
           */
          fadeOutProgress(file, id_Prefix) {
            $('#' + file.id).find('#' + id_Prefix + '-progress').fadeOut();
          }
        },
        mounted() {
          this.$thelist = $('#thelist');

          WebUploader.Uploader.register({
            'before-send-file': (file) => this.beforeSendFile(file),
            'before-send': (block) => this.beforeSend(block)
          });
          this.initWebUpload();
          this.uploader.on('fileQueued',  (file) => this.fileQueud(file));
          this.uploader.on('uploadBeforeSend', (obj, data) => this.uploadBeforeSend(obj, data));
          this.uploader.on('uploadProgress', (file, percentage) => this.uploadProgress(file, percentage));
          this.uploader.on('uploadSuccess', (file) => this.uploadSuccess(file));
          this.uploader.on('uploadError', (file) => this.uploadError(file));
          this.uploader.on('uploadComplete', (file) => this.uploadComplete(file));

        },
        destroyed(){
          this.uploader.stop(true);
          this.uploader.reset();
          this.uploader.destroy();
          this.initWebUpload();
        },

        watch:{
          uploadPath:function () {
            this.uploader.options.formData.path = this.uploadPath;
          },
          stopOrStart:function () {
            if(this.stopOrStart === true) {
              this.uploader.upload();
            } else {
              this.uploader.stop(true);
            }
          }
        }
    }
</script>

<style scoped>
  .file_title {
    color: green;
  }
  .about_upload_btn {
    border-bottom: solid 1px #ededed;
  }
  .about_upload_btn .el-switch{
    float: right;
    margin-bottom: 10px;
  }
</style>
