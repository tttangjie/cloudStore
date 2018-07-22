<template>
  <el-carousel :interval="4000" type="card" height="300px" class="info_carousel">
    <el-carousel-item v-for="item in adminList" :key="item.name">
      <el-row>
        <el-col :span="12">
          <img :src="item.image" class="item_photo">
        </el-col>
        <el-col :span="12" class="item_info">
          <p class="item_name"> {{ item.name }} </p>
          <p class="item_age">年龄： {{ item.age }} </p>
          <p class="item_sex">性别： {{ item.sex }} </p>
          <p class="item_introduction">简介： {{ item.introduction }} </p>

        </el-col>
      </el-row>

    </el-carousel-item>
  </el-carousel>
</template>

<script>
    export default {
      name: "info",
        data(){
          return{
            adminList:[
              {
                name:'唯唯小豆奶',
                age:18,
                sex:'女',
                image:require('../../../assets/admin/lww.jpg'),
                introduction:'那么那么大的世界啊，这么这么小的我。'
              },
              {
                name:'浩浩小公举',
                age:20,
                sex:'男',
                image:require('../../../assets/admin/shw.jpg'),
                introduction:'summer Life'
              },
              {
                name:'前端小菜鸡',
                age:18,
                sex:'女',
                image:require('../../../assets/admin/tj.jpg'),
                introduction:'灼热的思绪膨胀 翻涌迷惘填充幻想'
              },
              {
                name:'周老板颜值担当',
                age:20,
                sex:'男',
                image:require('../../../assets/admin/zlw.jpg'),
                introduction:'提及年少一词，应与平庸相斥。'
              },
              {
                name:'戴院长懵逼三连',
                age:20,
                sex:'男',
                image:require('../../../assets/admin/dc.jpg'),
                introduction:'所有对过去的怀念，都是在教我们要珍惜眼前.'
              },
              {
                name:'大伟兄天下无敌',
                age:20,
                sex:'男',
                image:require('../../../assets/admin/zdw.jpg'),
                introduction:'小小的海洋，小小的鲸鱼'
              }
            ],
          }
        }
    }
</script>

<style scoped>
  .el-carousel__item{
    border-radius: 8px;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: rgba(200, 200, 169, 0.91);
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: rgba(196, 226, 216, 0.91);
  }
  .info_carousel {
    width: 80%;
    margin: 60px 10%;
  }

  .item_photo {
    width: 200px;
    height: 200px;
    border-radius: 180px;
    margin: 50px;
  }
  .item_name {
    margin-left: 15px;
    margin-top: 60px;
    font-size: 20px;
    font-weight: 700;
  }
  .item_age {
    margin-top: 20px;
    font-size: 16px;
    margin-left: 40px;
  }
  .item_sex {
    margin-top: 20px;
    font-size: 16px;
    margin-left: 50px;
  }
  .item_introduction {
    margin-top: 20px;
    font-size: 16px;
    margin-left: 25px;
    max-width: 200px;
    word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
  }

</style>
