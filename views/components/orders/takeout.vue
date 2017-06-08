<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-row>
          <el-col :span="24" class="searchbox" v-if="isysadmin">
            选择日期范围：<el-date-picker v-model="daterange" format="yyyy/MM/dd" type="daterange" align="right" placeholder="选择日期范围" :picker-options="datePickerOptions"></el-date-picker>&nbsp;&nbsp;
            输入店铺名或订单号：<el-input class="searchinput" placeholder="店铺名或订单号" icon="search" v-model="searchname"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false" @click.stop="getOrderlist">搜索</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{(shopinfo&&shopinfo.shopname)?shopinfo.shopname:'-'}}</span>
          </el-col>
        </el-row>
        <el-table :data="orderlist" :default-sort="{prop:'orderid',order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="orderid" label="订单号" width="110"></el-table-column>
	  <el-table-column prop="shopname" label="店铺名" width="100"></el-table-column>
          <el-table-column label="菜肴名称" width="200" class-name="noticeinfo">
            <template scope="scope"><span v-html="scope.row.orderdetail"></span></template>
          </el-table-column>
          <el-table-column prop="addtime" label="订单时间" width="176"></el-table-column>
          <el-table-column prop="allmoney" label="价格" class-name="noticeinfo" width="110"></el-table-column>
          <el-table-column label="配送信息" :show-overflow-tooltip="true">
            <template scope="scope"><span v-html="scope.row.deliveryaddress"></span></template>
          </el-table-column>
          <el-table-column label="状态" width="96">
            <template scope="scope">
              <span v-html="scope.row.statustr"></span>
              <el-tooltip v-if="scope.row.status == 3" :content="'配送员信息('+scope.row.deliveryinfo+')'" placement="left">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-popover v-if="scope.row.status == 2" ref="popoverDistrip" placement="left" trigger="click" v-model="scope.row.showpopover">
                <el-table :data="distriplist">
                  <el-table-column property="distripname" label="配送员" width="80"></el-table-column>
                  <el-table-column property="distripmobile" label="联系电话" width="150"></el-table-column>
                  <el-table-column label="-" width="80">
                    <template scope="subscope">
                      <el-button type="primary" size="small" @click.stop="processOrder(scope.row, 2, subscope.row)">派送</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="scope.row.status == 2" size="small" v-popover:popoverDistrip @click.stop="deliveryOrder(scope.row.shopid);">派单配送</el-button>
              <el-button v-else-if="scope.row.status == 3" size="small" @click.stop="processOrder(scope.row, 3)">配送完成</el-button>
              <el-button v-else-if="scope.row.status == 4" size="small" @click.stop="processOrder(scope.row, 4)">已完成</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent v-if="orderlist.length>0" :page="page" :pagesize="pagesize" :total="allnum" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { timefilter } from "@/filters/timefilter"
import { currency } from "@/filters/currency"
import { getOrderStatus } from "@/libs/order"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      //UI组件数据
      daterange: [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()],
      searchname: '',
      datePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      //页面data数据源
      page: 1,
      pagesize: 20,
      allnum: 0,
      orderlist: [],
      distriplist: [],
    }
  },
  methods: {
    getCurrentPage(page){
      this.page = page;
      this.getOrderlist();
    },
    deliveryOrder(shopid) {
      ajax.get('/admin/shop/getDistripList', {params:{shopid:shopid}}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.distriplist = response.data.list;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    processOrder(order, status, info = {}){
      let params = { orderid: order.orderid, status: status, userid: order.userid};
      let callback;
      if(status == 2){ //已付款处理
        const distrip = info;
        params['distripid'] = distrip.id;
        callback = () => {
          order.status = 3;
          order.statustr = getOrderStatus(order.status);
          order.deliveryinfo = distrip.distripname+'/'+distrip.distripmobile;
          order.showpopover = false;
          this.$message.success('订单已派送');
        }
      }else if(status == 3){ //配送中处理
        callback = () => {
          order.status = 4;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('订单处理完成');
        }
      }else if(status == 4) { //配送完成处理
        callback = () => {
          order.status = 100;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('订单处理完成');
        }
      }
      ajax.get('/admin/order/processOrder', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          if(callback) callback();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //获取订单列表
    getOrderlist(){
      const startime = timefilter(this.daterange[0], 'yyyy/mm/dd');
      const endtime = timefilter(this.daterange[1], 'yyyy/mm/dd');
      const params = { startime: startime, endtime: endtime, shopname: this.searchname, page: this.page, pagesize: this.pagesize, ordertype:1 };
      ajax.get('/admin/order/getOrderlist', {params:params}).then((response) => {
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
        this.orderlist = [];
        for (var i = list.length - 1; i >= 0; i--) {
          let orderinfo = {};
          orderinfo['showpopover'] = false;
          orderinfo['shopid'] = list[i].shopid;
	  orderinfo['shopname'] = list[i].shopname;
	  orderinfo['userid'] = list[i].userid;
          orderinfo['orderid'] = list[i].orderid;
          orderinfo['orderdetail'] = this.formatOrderlist(list[i].orderlist);
          orderinfo['addtime'] = list[i].addtime?timefilter(new Date(list[i].addtime), 'yyyy/mm/dd hh:ii:ss'):'';
          orderinfo['allmoney'] = currency(list[i].allmoney);
          orderinfo['deliveryinfo'] = list[i].deliveryname+'/'+list[i].deliverymobie;
          orderinfo['deliveryaddress'] = list[i].recipientname+' '+list[i].recipientmobile+'<br>'+list[i].deliveryaddress;
          orderinfo['status'] = list[i].status;
          orderinfo['statustr'] = getOrderStatus(list[i].status);
          this.orderlist.push(orderinfo);
        }
      }
    },
    formatOrderlist(order){
      const orderlist = [];
      for (var i = order.length - 1; i >= 0; i--) {
        orderlist.push(order[i].dishesname+' x'+order[i].num);
      }
      return orderlist.join('<br>');
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
    //初始获取数据
    this.getOrderlist();
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
.searchinput{width: 200px;}
.searchbox{padding:12px 6px;margin-bottom: 10px;background-color: #f2f2f2; }
.searchbox .el-date-editor--timerange{width: 136px;}
</style>
