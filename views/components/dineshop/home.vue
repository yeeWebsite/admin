<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-row type="flex" justify="end">
          <el-button style="margin:-10px 10px 10px 0;" type="primary" :loading="false" @click.stop="addAction">新增</el-button>
        </el-row>
        <el-table :data="shoplist" style="width: 100%">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column label="店铺图标" width="120">
            <template scope="scope">
              <img :src="scope.row.shopicon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column prop="shopname" label="店铺名称" width="180"></el-table-column>
          <el-table-column prop="shopdesc" label="描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column :formatter="handleAway" label="可否外卖" width="100"></el-table-column>
          <el-table-column prop="shophone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="address" label="详细地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="opentime" label="营业时间" width="130"></el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button size="small" @click="handleManage(scope.$index, scope.row)">管理</el-button>
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
      //页面data数据源
      shoplist: [
        {
          sid: '201705100001',
          shopname: '深运潮州粥',
          shopdesc: '非常好吃',
          shopicon: 'http://p1.meituan.net/200.0/deal/15c8885d14f18774938a88752f08bb1e49194.jpg@118_0_466_466a%7C267h_267w_2e_90Q',
          shophone: '0755-28635923',
          address: '中银花园1号楼B-8（中银大厦旁）',
          isaway: '1',
          opentime: '10:00-23:00',
        },
        {
          sid: '201705100002',
          shopname: '深运潮州粥',
          shopdesc: '非常好吃',
          shopicon: 'http://p1.meituan.net/200.0/deal/15c8885d14f18774938a88752f08bb1e49194.jpg@118_0_466_466a%7C267h_267w_2e_90Q',
          shophone: '0755-28635923',
          address: '中银花园1号楼B-8（中银大厦旁）',
          isaway: '1',
          opentime: '10:00-23:00',
        },
        {
          sid: '201705100003',
          shopname: '深运潮州粥',
          shopdesc: '非常好吃',
          shopicon: 'http://p1.meituan.net/200.0/deal/15c8885d14f18774938a88752f08bb1e49194.jpg@118_0_466_466a%7C267h_267w_2e_90Q',
          shophone: '0755-28635923',
          address: '中银花园1号楼B-8（中银大厦旁）',
          isaway: '1',
          opentime: '10:00-23:00',
        },
      ]
    }
  },
  methods: {
    addAction(){
      this.$router.push('/dineshop/detail/');
    },
    handleAway(row, column){
      return row.isaway === '1' ? '是': '否';
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleManage(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
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
