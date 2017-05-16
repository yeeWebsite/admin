<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row class="discount-shop-name">门店：{{shopinfo.shopname}}</el-row>
        <el-row type="flex" justify="end">
          <el-button style="margin:-10px 10px 10px 0;" type="primary" @click.stop="dishesClassify()">菜肴分类管理</el-button>
          <el-button style="margin:-10px 10px 10px 30px;" type="primary" @click.stop="addDishes()">新增</el-button>
        </el-row>
        <el-table :data="disheslist" style="width: 100%">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column label="菜肴图标" width="100">
            <template scope="scope">
              <img :src="scope.row.icon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column prop="dishesname" label="菜肴名称" width="120"></el-table-column>
          <el-table-column prop="cuisinename" label="一级分类" width="94"></el-table-column>
          <el-table-column prop="classifyname" label="二级分类" width="120"></el-table-column>
          <el-table-column prop="dishtastes" label="口味种类" width="140"></el-table-column>
          <el-table-column prop="dishesdesc" label="描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="店铺名称" width="120">
            <template scope="scope">
              <span>{{shopinfo.shopname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120"></el-table-column>
          <el-table-column prop="discount" label="默认折扣" width="64"></el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent :total="21" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      shopinfo:{
        shopid: "1",
        shopname: "深运潮州粥",
        shopicon: "http://p1.meituan.net/200.0/deal/15c8885d14f18774938a88752f08bb1e49194.jpg@118_0_466_466a%7C267h_267w_2e_90Q",
        shopaddress: "中银花园1号楼B-8（中银大厦旁）"
      },
      disheslist: [
        {
          id: '1',
          icon: "https://img.meituan.net/100.100.90/wmproduct/712a233b4018a100bdf7a668132ab49386611.jpg",
          dishesname: "葱香油焖大虾",
          price: "88.0000",
          classifyname: "招牌推荐",
          cuisinename: "鲁菜",

          dishtastes: '微辣、辣、超辣',
          dishesdesc: '好吃的油焖大虾',
          discount:'3',
        },
        {
          id: '11',
          icon: "https://img.meituan.net/100.100.90/wmproduct/712a233b4018a100bdf7a668132ab49386611.jpg",
          dishesname: "葱香油焖大虾",
          price: "88.0000",
          classifyname: "招牌推荐",
          cuisinename: "鲁菜",

          dishtastes: '微辣、辣、超辣',
          dishesdesc: '好吃的油焖大虾',
          discount:'3',
        },
      ]
    }
  },
  methods: {
    dishesClassify(){
      console.log("菜肴分类管理");
    },
    addDishes(){
      console.log("新增");
    },
    handleEdit(){
      console.log('修改');
    },
    handleDelete(){
      console.log('删除');
    },
    getCurrentPage(page){
      console.log(page);
    },
  },
  computed: {
    ...mapGetters({
      
    }),
  },
  created () {
    
  },
  destroyed(){
    
  },
  components: {
    headerComponent: require('components/header.vue'),
    leftComponent: require('components/left.vue'),
    breadtitleComponent: require('components/breadtitle.vue'),
    pageComponent: require('components/page.vue'),
  },
  watch: {
    
  }
}
</script>

<style type="text/css">

</style>
