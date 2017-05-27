<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-row type="flex">
          <el-col :span="24" class="searchbox">
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDineshop()">新增门店</el-button>
          </el-col>
        </el-row>
        <el-table :data="shoplist" :default-sort="{prop:'addtime',order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column prop="shopid" label="门店ID" width="80"></el-table-column>
          <el-table-column label="店铺图标" width="90">
            <template scope="scope">
              <img :src="scope.row.shopicon" alt="" style="width: 60px;height: 60px;padding: 10px 0;"/>
            </template>
          </el-table-column>
          <el-table-column label="店铺名称" width="180">
            <template scope="scope">
              <router-link :to="{path:'/dineshop/detail/',query:{shopid:scope.row.shopid}}">{{scope.row.shopname}}</router-link>
            </template>
          </el-table-column>
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

export default {
  data() {
    return {
      page: 1, //页数
      pagesize: 20, //每页显示数
      allnum: 0, //总记录数
      //页面data数据源
      shoplist: []
    }
  },
  methods: {
    //新增店铺跳转
    addDineshop(){
      this.$router.push('/dineshop/detail/');
    },
    //修改店铺信息
    modDineshop(info){
      this.$router.push({path:'/dineshop/detail/', query:{shopid: info.shopid}});
    },
    //后台操作管理
    processAdmin(info, key){
      if(key == '审核'){
        this.modDineshopstatus(info.shopid, key, () => {
          info.status = 1;
        });
      }else if(key == '通过审核'){
        this.modDineshopstatus(info.shopid, key, () => {
          info.status = 100;
        });
      }else if(key == '审核不通过'){
        this.modDineshopstatus(info.shopid, key, () => {
          info.status = -100;
        });
      }else if(key == '删除'){
        this.$confirm('请谨慎操作，删除的门店信息将不可恢复，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          callback: (action) => {
            if(action == 'confirm'){
              this.modDineshopstatus(info.shopid, key, () => {
                info.status = -300;
              });
            }
          }
        });
      }
    },
    modDineshopstatus(shopid, key, fn){
      const params = { shopid: shopid, key: key };
      ajax.get('/admin/shop/modDineshopStatus', {params:params}).then((response) => {
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
    getShoplist(){
      const params = { page: this.page, pagesize: this.pagesize };
      ajax.get('/admin/shop/getDineshopList', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.delayLoad(response.data['info'], response.data['list']);
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }, 
    delayLoad(info, list){
      this.allnum = info.allnum || list.length;
      if(list && list.length > 0){
        this.shoplist = [];
        for (var i = list.length - 1; i >= 0; i--) {
          let shopinfo = {
            shopid: list[i].id,
            userid: list[i].userid,
            adduser: list[i].adduser,
            status: list[i].status,
            shopname: list[i].shopname,
            shopicon: list[i].shopicon,
            shophone: list[i].shophone,
            address: list[i].address,
            isbooking: list[i].isbooking,
            opentime: list[i].opentime,
            isaway: list[i].isaway,
            deliverytime: list[i].deliverytime,
            addtime: list[i].addtime
          };
          this.shoplist.push(shopinfo);
        }
      }
    },
    getCurrentPage(page){
      this.page = page;
      this.getShoplist();
    },
  },
  computed: {
    ...mapGetters({
      
    }),
  },
  created () {
    //获取店铺列表
    this.getShoplist();
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
