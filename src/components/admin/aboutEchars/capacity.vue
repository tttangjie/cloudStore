<template>
  <div class="pie" id="main_pie">
    <div id="capacitypie" class="capacity" ></div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import 'echarts/lib/chart/pie';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/legend';

  export default {
      name: "capacity",
      data() {
        return {
          pieData: {},
        }
      },
      mounted() {
        this.myChart = echarts.init(document.getElementById('capacitypie'));
        this.randomData();
      },

      // props: ['pieData'],
      methods: {
        randomData() {
          this.$axios.post('/capacity')
            .then(function (res) {
              if(res.data.status === '获得数据成功') {
                this.pieData = res.data.result;
                this.initData();
              }
            }.bind(this))
            .catch(function (err) {
              // this.drawMsg('error','获取用户分布信息失败');
              console.log(err);
            }.bind(this));

          // return Math.round(Math.random() * 100);
        },
        initData: function () {
          const option = {
            title : {
              // text: '卓云微盘磁盘空间容量',
              subtext: '单位/GB',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient : 'vertical',
              x : 'left',
              data:['未使用','已使用']
            },

            series : [
              {
                name:'磁盘空间容量',
                type:'pie',
                radius : ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },

                data:[
                  {value:this.pieData.notused, name:'未使用'},
                  {value:this.pieData.used, name:'已使用'},

                ],
                itemStyle: {
                  normal: {
                    color: function(params) {
                      // build a color map as your need.
                      var colorList = [
                        '#61d3ff','#be66c1',
                      ];
                      return colorList[params.dataIndex]
                    }
                  }
                },
              }
            ]
          };
          this.myChart.setOption(option);
        },
      }
    }


</script>

<style scoped>
  .capacity{
    height: 300px;
    width: 80%;
    margin-left: 10%;
  }

</style>
