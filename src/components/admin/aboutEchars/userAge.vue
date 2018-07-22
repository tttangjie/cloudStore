<template>
    <div class="visitorpie">
        <div id="visitorpie" class="echartPie" ></div>
    </div>
</template>

<script>
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/pie';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';

    export default {
        data(){
          return {
            pieData: {},
          }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('visitorpie'));
            this.randomData();
        },

        // props: ['pieData'],
        methods: {
          randomData() {
            this.$axios.post('/ageDistribution')
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

            // return Math.round(Math.random()*100);
          },
          initData(){
                const option = {
                    title : {
                        text: '卓云微盘用户年龄分布',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['10岁以下','10-19岁','20-29岁','30-39岁','40-49岁','50-59岁','60岁以上']
                    },
                    series : [
                      {
                        name: '用户年龄分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                          {value:this.pieData.shisuiyixia, name:'10岁以下'},
                          // {value:this.randomData(), name:'10岁以下'},
                          {value:this.pieData.shi2shijiu, name:'10-19岁'},
                          {value:this.pieData.ershi2erjiu, name:'20-29岁'},
                          {value:this.pieData.sanshi2sanjiu, name:'30-39岁'},
                          {value:this.pieData.sishi2sijiu, name:'40-49岁'},
                          {value:this.pieData.wushi2wujiu, name:'50-59岁'},
                          {value:this.pieData.liushiyishang, name:'60及岁以上'},
                        ],
                        itemStyle: {
                          emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        }
                      }

                    ]
                };
                this.myChart.setOption(option);
            }
        },
    }
</script>

<style scoped>
    .visitorpie{
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .echartPie{
      width: 90%;
      height:450px;
    }
</style>
