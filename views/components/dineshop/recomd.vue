<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-row type="flex">
          <el-col :span="24" class="searchbox" v-if="isaddrecom">
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="backRecomList()">返回推荐门店</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="toaddRecomDineshop()">新增推荐门店</el-button>
          </el-col>
        </el-row>
        <el-table :data="shoplist" :default-sort="{prop:'addtime',order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column prop="id" label="门店ID" width="80"></el-table-column>
          <el-table-column label="店铺图标" width="90">
            <template scope="scope">
              <img :src="scope.row.shopicon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column prop="shopname" label="店铺名称" width="180"></el-table-column>
          <el-table-column label="可否预订/外卖" width="126">
            <template scope="scope"><span class="noticeinfo">{{scope.row.isbooking==1?"是":"否"}}</span>&nbsp;|&nbsp;<span class="noticeinfo">{{scope.row.isaway==1?"是":"否"}}</span></template>
          </el-table-column>
          <el-table-column label="营业/配送时间" :show-overflow-tooltip="true">
            <template scope="scope">
              <span>{{scope.row.opentime}}<br/>{{scope.row.deliverytime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" :show-overflow-tooltip="true">
            <template scope="scope">
              <span>{{scope.row.shophone}}<br/>{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺状态" width="120" class-name="noticeinfo">
            <template scope="scope"><span>{{getShopstatus(scope.row.status)}}</span></template>
          </el-table-column>
          <el-table-column label="操作" width="200">
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

export default {
  data() {
    return {
      page: 1, //页数
      pagesize: 20, //每页显示数
      allnum: 0, //总记录数
      //页面data数据源
      shoplist: [],
      isaddrecom: false, //是否是新增推荐列表
    }
  },
  methods: {
    //返回推荐列表
    backRecomList(){
      this.isaddrecom = false;
      this.getRecomShoplist();
    },
    //新增推荐门店
    toaddRecomDineshop(){
      this.isaddrecom = true;
      this.getCanRecomShoplist();
    },
    //后台操作管理
    processAdmin(info, key){
      this.$confirm('是否确认“'+key+'”门店信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: (action) => {
          if(action == 'confirm'){
            if(key == '添加推荐'){
              this.addRecomDineshop(info.id, () => {
                for (var i = 0; i < this.shoplist.length; i++) {
                  if(info.id == this.shoplist[i].id){
                    this.shoplist[i].isrecom = 1;
                  }
                }
              });
            }else if(key == '取消推荐'){
              this.delRecomDineshop(info.id, () => {
                for (var i = 0; i < this.shoplist.length; i++) {
                  if(info.id == this.shoplist[i].id){
                    this.shoplist.splice(i,1);
                  }
                }
              });
            }
          }
        }
      });
    },
    addRecomDineshop(shopid, fn){
      const params = { shopid: shopid };
      ajax.get('/admin/shop/addRecomDineshop', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          fn();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    delRecomDineshop(shopid, fn){
      const params = { shopid: shopid };
      ajax.get('/admin/shop/delRecomDineshop', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          fn();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //获取当前店铺状态 店铺状态（0初始，1审核中，100审核通过，-100审核不通过，-300已下架）
    getShopstatus(status){
      let statustr = '等待审核';
      if(status == 1){
        statustr = '审核中';
      }else if(status == 100){
        statustr = '审核通过';
      }else if(status == -100){
        statustr = '审核不通过';
      }else if(status == -300){
        statustr = '已下架';
      }
      return statustr;
    },
    //获取门店列表
    getRecomShoplist(){
      const params = { page: this.page, pagesize: this.pagesize };
      ajax.get('/admin/shop/getRecomDineshopList', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          const info = response.data['info'];
          const list = response.data['list'];
          this.allnum = info.allnum || list.length;
          if(list && list.length > 0){
            this.shoplist = list;
          }
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }, 
    //获取门店列表
    getCanRecomShoplist(){
      const params = { page: this.page, pagesize: this.pagesize };
      ajax.get('/admin/shop/getCanRecomDineshopList', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          const info = response.data['info'];
          const list = response.data['list'];
          this.allnum = info.allnum || list.length;
          if(list && list.length > 0){
            this.shoplist = list;
          }
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }, 
    getCurrentPage(page){
      this.page = page;
      this.getRecomShoplist();
    },
  },
  computed: {
    ...mapGetters({
      
    }),
  },
  created () {
    //获取店铺列表
    this.getRecomShoplist();
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
