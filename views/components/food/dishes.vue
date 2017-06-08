<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox" v-if="isysadmin">
            输入店铺ID：<el-input class="searchinput" placeholder="店铺ID" icon="search" v-model="shopid"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false"  @click.stop="searchDishes()">搜索</el-button>
            <span style="margin-left:20px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDishes()">新增菜肴</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDishes()">新增菜肴</el-button>
          </el-col>
        </el-row>
        <el-table :data="disheslist" :default-sort="{prop:'addtime', order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column label="菜肴图片" width="90">
            <template scope="scope">
              <img :src="scope.row.dishicon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column label="菜肴名称" width="130" :show-overflow-tooltip="true">
            <template scope="scope">
              <router-link :to="{path:'/food/dishes/detail/',query:{shopid:shopid, shopname:shopname, dishid:scope.row.id}}">{{scope.row.dishname}}</router-link>
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
          <el-table-column label="菜肴状态" width="120" class-name="noticeinfo">
            <template scope="scope"><span>{{getShopstatus(scope.row.status)}}</span></template>
          </el-table-column>
          <el-table-column label="操作" width="200" v-if="isysadmin">
            <template scope="scope">
              <el-button class="btn" size="small" type="danger" v-if="scope.row.status==0" @click="processAdmin(scope.row, '审核')">审核</el-button>
              <el-button class="btn" size="small" type="danger" v-if="scope.row.status==1" @click="processAdmin(scope.row, '通过审核')">通过审核</el-button>
              <el-button class="btn" size="small" type="danger" v-if="scope.row.status==1" @click="processAdmin(scope.row, '审核不通过')">审核不通过</el-button>
              <el-button class="btn" size="small" type="danger" v-if="scope.row.status==100||scope.row.status==-100" @click="processAdmin(scope.row, '删除')">删除</el-button>
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
      shopid: "",
      shopname: "",
      page: 1, //页数
      pagesize: 20, //每页显示数
      allnum: 0, //总记录数
      disheslist: [],
      tastesinfo: {}, //口味信息
    }
  },
  methods: {
    getCurrentPage(page){
      this.page = page;
      this.getDishesList();
    },
    searchDishes(){
      this.getBaseInfo();
      this.getDishesList();
    },
    //店铺分类信息管理
    dishClassify(){
      this.$router.push('/food/classify/');
    },
    //新增菜肴
    addDishes(){
      this.$router.push({path:'/food/dishes/detail/', query:{shopid: this.shopid, shopname: this.shopname}});
    },
    //后台操作管理
    processAdmin(info, key){
      if(key == '审核'){
        this.modDishestatus(info.id, key, () => {
          info.status = 1;
        });
      }else if(key == '通过审核'){
        this.modDishestatus(info.id, key, () => {
          info.status = 100;
        });
      }else if(key == '审核不通过'){
        this.modDishestatus(info.id, key, () => {
          info.status = -100;
        });
      }else if(key == '删除'){
        this.$confirm('请谨慎操作，删除的菜肴信息将不可恢复，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          callback: (action) => {
            if(action == 'confirm'){
              this.modDishestatus(info.id, key, () => {
                info.status = -300;
              });
            }
          }
        });
      }
    },
    modDishestatus(dishid, key, fn){
      const params = { dishid: dishid, key: key };
      ajax.get('/admin/dishes/modDishestatus', {params:params}).then((response) => {
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
    searchDineshop(){
      if(this.shopid){
        const urls = ['/admin/shop/getDineshopInfo?shopid='+this.shopid, '/admin/dishes/getTastesList'];
        const requests = urls.map(function(url){ return ajax.get(url, { params: {indicator:{async: true}} }); });
        ajax.all(requests).then(ajax.spread((shopinfo, tasteslist) => {
          if (shopinfo.data && shopinfo.data.code > 0) {
            const info = shopinfo.data.info;
            this.shopname = info.shopname;
          }
          if (tasteslist.data && tasteslist.data.code > 0) {
            const list = tasteslist.data.list;
            for (var i = 0; i < list.length; i++) {
              this.tastesinfo[list[i].id] = list[i].tastes;
            }
          }
        })).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //获取菜肴信息列表
    getDishesList(){
      if(this.shopid){
        ajax.get('/admin/shop/getDishesList', {params:{ page: this.page, pagesize: this.pagesize, shopid:this.shopid}}).then((response) => {
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
    }
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo'
    }),
  },
  created () {
    //门店端
    if(!this.isysadmin){
      this.shopid = this.shopinfo?this.shopinfo.id:'';
      this.searchDineshop();
      this.getDishesList()
    }
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
