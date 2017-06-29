<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox" v-if="isaddrecom">
            店铺ID或店铺名模糊搜索：<el-input class="searchinput" placeholder="店铺ID或店铺名" icon="search" v-model="search"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false"  @click.stop="searchDineshop()">搜索</el-button>
            <span style="margin-left:20px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="backRecomList()">返回推荐菜肴</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="toaddRecomDishes()">新增推荐菜肴</el-button>
          </el-col>
        </el-row>
        <el-table :data="disheslist" :default-sort="{prop:'dishname', order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column label="菜肴图片" width="90">
            <template scope="scope">
              <img :src="scope.row.dishicon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column label="菜肴名称" width="130" :show-overflow-tooltip="true">
            <template scope="scope">
              <router-link :to="{path:'/food/dishes/detail/',query:{shopid:scope.row.shopid, shopname:scope.row.shopname, dishid:scope.row.id}}">{{scope.row.dishname}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="分类/口味种类" width="160" :show-overflow-tooltip="true">
            <template scope="scope">
              <span>{{scope.row.cuisinename}} / {{scope.row.classname}}</span><br>
              <span>{{getTastes(scope.row.tastesid)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dishdesc" label="描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="价格" width="100" class-name="noticeinfo">
            <template scope="scope">
              <span>{{moneyFilter(scope.row.dishprice)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="默认折扣" width="92">
            <template scope="scope">
              <span>{{getDiscount(scope.row.defdiscount)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" v-if="isysadmin">
            <template scope="scope">
              <el-button class="btn" size="small" type="danger" @click="processAdmin(scope.row, '添加推荐')" v-if="isaddrecom && scope.row.isrecom == 0">添加推荐</el-button>
              <el-button class="btn" size="small" type="danger" v-else-if="isaddrecom && scope.row.isrecom != 0">已添加推荐</el-button>
              <el-button class="btn" size="small" type="danger" @click="processAdmin(scope.row, '取消推荐')" v-else>取消推荐</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent :page="page" :pagesize="pagesize" :total="allnum" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'
import { currency } from "@/filters/currency"

export default {
  data() {
    return {
      search: "",
      shopid: "",
      fontshopid: "",
      shopname: "",
      page: 1, //页数
      pagesize: 20, //每页显示数
      allnum: 0, //总记录数
      disheslist: [],
      tastesinfo: {}, //口味信息
      isaddrecom: false, //是否是新增推荐列表
    }
  },
  methods: {
    getCurrentPage(page){
      this.page = page;
      this.getRecomDishesList();
    },
    //返回推荐列表
    backRecomList(){
      this.isaddrecom = false;
      this.getRecomDishesList();
    },
    //新增菜肴
    toaddRecomDishes(){
      this.isaddrecom = true;
      this.getDineshopInfo();
    },
    //后台操作管理
    processAdmin(info, key){
      this.$confirm('是否确认“'+key+'”菜肴信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: (action) => {
          if(action == 'confirm'){
            if(key == '添加推荐'){
              this.addRecomDishes(info.id, () => {
                for (var i = 0; i < this.disheslist.length; i++) {
                  if(info.id == this.disheslist[i].id){
                    this.disheslist[i].isrecom = 1;
                  }
                }
              });
            }else if(key == '取消推荐'){
              this.delRecomDishes(info.id, () => {
                for (var i = 0; i < this.disheslist.length; i++) {
                  if(info.id == this.disheslist[i].id){
                    this.disheslist.splice(i,1);
                  }
                }
              });
            }
          }
        }
      });
    },
    addRecomDishes(dishid, fn){
      const params = { dishid: dishid };
      ajax.get('/admin/dishes/addRecomDishes', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          fn();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    delRecomDishes(dishid, fn){
      const params = { dishid: dishid };
      ajax.get('/admin/dishes/delRecomDishes', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          fn();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //金额格式化
    moneyFilter(money){
      return currency(money);
    },
    //折扣信息
    getDiscount(discount){
      const _discount = parseFloat(discount);
      if(discount >= 1){
        return '原价';
      }else if(discount <= 0){
        return '免费';
      }else{
        return (_discount*10).toFixed(1)+'折';
      }
    },
    //获取口味信息
    getTastes(tastes){
      let tasteslist = tastes.split(',');
      for (var i = 0; i < tasteslist.length; i++) {
        tasteslist[i] = this.tastesinfo[tasteslist[i]] || tasteslist[i];
      }
      return tasteslist.join(',');
    },
    //获取店铺基本信息
    getDineshopInfo(){
      var shopid = this.shopid?this.shopid:this.defshopid;
      ajax.get('/admin/shop/getDineshopInfo', {params:{ shopid: shopid, indicator:{async: true} }}).then((response) => {
        if (response.data && response.data.code > 0) {
            const info = response.data.info;
            this.shopid = info.id;
            this.fontshopid = info.fontshopid;
            this.shopname = info.shopname;
            this.getDishesListBySid();
          }
      });
    },
    //获取店铺基本信息
    getTastesList(){
      ajax.get('/admin/dishes/getTastesList', {params:{ indicator:{async: true} }}).then((response) => {
        if (response.data && response.data.code > 0) {
          const list = response.data.list;
          for (var i = 0; i < list.length; i++) {
            this.tastesinfo[list[i].id] = list[i].tastes;
          }
        }
      });
    },
    //获取店铺菜肴信息列表
    getDishesListBySid(){
      ajax.get('/admin/shop/getCanRecomDishesList', {params:{ page: this.page, pagesize: this.pagesize, shopid:this.fontshopid}}).then((response) => {
        this.disheslist = [];
        if (response.data && response.data.code > 0) {
          const info = response.data.info;
          const list = response.data.list;
          this.allnum = info.allnum || list.length;
          this.disheslist = list;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //获取推荐菜肴信息列表
    getRecomDishesList(){
      ajax.get('/admin/dishes/getRecomDishesList', {params:{ page: this.page, pagesize: this.pagesize}}).then((response) => {
        this.disheslist = [];
        if (response.data && response.data.code > 0) {
          const info = response.data.info;
          const list = response.data.list;
          this.allnum = info.allnum || list.length;
          this.disheslist = list;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo',
      defshopid: 'defshopid'
    }),
  },
  created () {
    this.getTastesList();
    this.getRecomDishesList();
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
