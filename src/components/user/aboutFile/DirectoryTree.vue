<template>
  <el-tree
    :props="pathProp"
    :load="lazyLoadPathList"
    lazy
    accordion>
  </el-tree>
</template>

<script>
    export default {
        name: "directory-tree",
        data() {
          return {
            pathProp: {
              label: 'name',
              /*children: 'zones',*/
              isLeaf: 'leaf'
            },
            pathList:[{
              name:'全部文件',
              path:'/',
              leaf:'true',
            }],
            pathList2:[{
              name:'test1',
              path:'/test1',
              leaf:'true',
            },
              {
                name:'test2',
                path:'/test2',
                leaf:'false',
              }],
            pathList3:[{
              name:'test3',
              path:'/test3',
              leaf:'true',
            },
              {
                name:'test4',
                path:'/test4',
                leaf:'false',
              }],
          };
        },
        methods: {
          lazyLoadPathList(node, resolve) {
            if (node.level === 0) {
              return resolve(this.pathList);
            }
            if (node.level > 1)
              return resolve(this.pathList2);

            setTimeout(() => {

              resolve(this.pathList3);
            }, 500);
          }
        },
      mounted() {

      }
    }
</script>

<style scoped>

</style>
