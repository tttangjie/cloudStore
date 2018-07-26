<template>
  <el-dialog
    title="选择文件夹"
    :visible.sync="showDialog"
    @open="fatherShowFalse"
    width="400px"
    center>
        <span>
          <el-tree
            v-if="showDialog"
            :props="pathProp"
            node-key="path"
            :load="lazyLoadPathList"
            @current-change="loadCurrentPathList"
            @node-click="nowClickPath"
            lazy
            accordion
            highlight-current>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img src="../../../assets/file_icon/folder.png">
              <span>{{node.label}}</span>
            </span>
          </el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelectNode">确 定</el-button>
        </span>
  </el-dialog>

</template>

<script>
    export default {
        name: "directory-tree",
        props:{
          show:Boolean,
        },
        data() {
          return {
            rootPath:'/'+this.$cookie.get('username'),
            nowPath:'',
            showDialog:this.show,
            pathProp: {
              label: 'dirName',
              children: '',
              isLeaf: 'leaf',
              path:'path'
            },
            rootPathList:[{
              dirName:'全部文件',
              leaf:false,
              path:'/'+this.$cookie.get('username')

            }],
            pathList:[],
          };
        },
        methods: {
          /*得到当前节点文件夹下的文件夹列表*/
         getNodes(path){
           //console.log(path)
            this.$axios.post('/get/tree',
              {
                path:path,
              })
              .then(function (res) {
                this.pathList = res.data;
              }.bind(this))
              .catch(function (err) {
                console.log(err)
              })
          },
         /*懒加载目录*/
          lazyLoadPathList(node, resolve) {
            if (node.level === 0) {
              return resolve(this.rootPathList);
            }
            setTimeout(() => {
              resolve(this.pathList);
            }, 500);
          },
          /*如果不是叶子节点加载节点下的文件夹目录*/
          loadCurrentPathList(node) {
            if(!node.leaf)
              this.getNodes(node.path)
          },
          nowClickPath(data){
            this.nowPath = data.path;
          },
          /*提交选择*/
          confirmSelectNode(){
            this.$emit('confirmSelectPath', this.nowPath);
            this.showDialog = false;
          },
          fatherShowFalse(){
            this.$emit('showTreeDialogFalse');
          }
        },
      mounted() {
          this.getNodes(this.rootPath);
      },

      watch:{
          show:function () {
            if(this.show){
              this.nowPath = this.rootPath;
              this.showDialog = true;
            }
          },
      }
    }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }
  .custom-tree-node img {
    margin-right: 10px;
    height: 20px;
  }

</style>
