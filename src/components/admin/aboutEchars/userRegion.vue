<template>
    <div class="fillcontainer">
        <div id="fundPosition" class="echartsPosition" ></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import '../../../../node_modules/echarts/map/js/china.js';
    import '../../../../node_modules/echarts/theme/roma.js';

    export default {
        data(){
          return {
            chart:null,
            pieData: {},
          }
        },
       methods: {
          randomData() {
             // return Math.round(Math.random()*100);
            this.$axios.post('/areaDistribution')
              .then(function (res) {
                if(res.data.status === '获得数据成功') {
                  this.pieData = res.data.result;
                  this.$nextTick(function() {
                    this.drawMap('fundPosition');
                    var that = this;
                    var resizeTimer = null;
                    // 保证页面在放大或缩小时，也能够动态的显示数据
                    window.onresize = function() {
                      if (resizeTimer) clearTimeout(resizeTimer);
                      resizeTimer = setTimeout(function() {
                        that.drawMap('fundPosition');
                      }, 100);
                    }
                  })
                }
              }.bind(this))
              .catch(function (err) {
                // this.drawMsg('error','获取信息失败');
                console.log(err);
              }.bind(this));
          },
         drawMap (id) {
            // echarts.init(),初始化数据
            if ( this.chart &&  this.chart.dispose) {
               this.chart.dispose();
            }
            this.chart = echarts.init(document.getElementById(id),'roma');
            this.chart.setOption({
                title: {
                    text: '2018卓云微盘用户地区分布',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data:['总人数']
                },
                visualMap: {
                    min: 0,
                    max: 5,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: '总人数',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[
                            {name: '北京',value: this.pieData.beijing },
                            {name: '天津',value: this.pieData.tianjing },
                            {name: '上海',value: this.pieData.shanghai },
                            {name: '重庆',value: this.pieData.chongqing},
                            {name: '河北',value: this.pieData.hebei },
                            {name: '河南',value: this.pieData.henan},
                            {name: '云南',value: this.pieData.yunnan},
                            {name: '辽宁',value: this.pieData.liaoning},
                            {name: '黑龙江',value: this.pieData.heilongjiang},
                            {name: '湖南',value: this.pieData.hunan},
                            {name: '安徽',value: this.pieData.anhui},
                            {name: '山东',value: this.pieData.shandong},
                            {name: '新疆',value: this.pieData.xinjiang},
                            {name: '江苏',value: this.pieData.jiangsu},
                            {name: '浙江',value: this.pieData.zhejiang},
                            {name: '江西',value: this.pieData.jiangxi},
                            {name: '湖北',value: this.pieData.hubei},
                            {name: '广西',value: this.pieData.guangxi},
                            {name: '甘肃',value: this.pieData.gansu},
                            {name: '山西',value: this.pieData.shanxi},
                            {name: '内蒙古',value: this.pieData.neimenggu},
                            {name: '陕西',value: this.pieData.shanxi3},
                            {name: '吉林',value: this.pieData.jilin},
                            {name: '福建',value: this.pieData.fujian},
                            {name: '贵州',value: this.pieData.guizhou},
                            {name: '广东',value: this.pieData.guangdong},
                            {name: '青海',value: this.pieData.qinghai},
                            {name: '西藏',value: this.pieData.xizang},
                            {name: '四川',value: this.pieData.sichuan},
                            {name: '宁夏',value: this.pieData.ningxia},
                            {name: '海南',value: this.pieData.hainan },
                            {name: '台湾',value: this.pieData.taiwan },
                            {name: '香港',value: this.pieData.xianggang},
                            {name: '澳门',value: this.pieData.aomen}
                        ]
                    }
                ]
            });
          }
        },
        mounted(){
              this.randomData();

        }

    }
</script>

<style  scoped>
  .echartsPosition{
    height: 500px;
    width: 80%;
    margin-left: 10%;
    margin-top: 2%;
  }

</style>


