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
            输入店铺ID或店铺名：<el-input class="searchinput" placeholder="店铺ID或店铺名" icon="search" v-model="shopsearch"></el-input>&nbsp;&nbsp;
            输入订单ID：<el-input class="searchinput" placeholder="订单ID" icon="search" v-model="ordersearch"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false" @click.stop="getOrderlist">搜索</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{(shopinfo&&shopinfo.shopname)?shopinfo.shopname:'-'}}</span>
          </el-col>
        </el-row>
        <el-table :data="orderlist" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column prop="orderid" label="订单号" width="120"></el-table-column>
          <el-table-column prop="shopname" label="店铺名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="usermobile" label="用户账户" width="127"></el-table-column>
          <el-table-column label="就餐信息" :show-overflow-tooltip="true">
            <template scope="scope"><span v-html="scope.row.eatinfo"></span></template>
          </el-table-column>
          <el-table-column prop="deskinfo" label="桌号" width="120"></el-table-column>
          <el-table-column label="菜肴名称" width="120">
            <template scope="scope"><span @click.stop="showOrderDetail(scope.row.orderlist)" style="text-decoration: underline; cursor:pointer;">查看菜单</span></template>
          </el-table-column>
          <el-table-column prop="allmoney" label="价格" class-name="noticeinfo" width="110"></el-table-column>
          <el-table-column prop="statustr" label="状态" width="96"></el-table-column>
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-popover v-if="scope.row.status == 2" ref="popoverDistrip" placement="left" trigger="click" v-model="scope.row.showpopover">
                <el-table :data="distriplist">
                  <el-table-column property="distripname" label="配送员" width="80"></el-table-column>
                  <el-table-column property="distripmobile" label="联系电话" width="150"></el-table-column>
                  <el-table-column label="-" width="80">
                    <template scope="subscope">
                      <el-button type="primary" size="small" @click.stop="processOrder(scope.row, 6, subscope.row)">申请打包</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>


	      <el-button v-if="scope.row.status == -110" size="small" @click.stop="processAdmin(scope.row, -120)">通过审核</el-button>
	      <el-button v-if="scope.row.status == -110" size="small" @click.stop="processAdmin(scope.row, -130)">已打审核不通过</el-button>

              <el-button v-if="scope.row.status == 5" size="small" @click.stop="processOrder(scope.row, 5);">用餐结束</el-button>
              <el-button v-else-if="scope.row.status == 6" size="small" @click.stop="processOrder(scope.row, 6);">去打包</el-button>

              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog class="sellinfo-dialog" title="菜单信息" size="tiny" :visible.sync="orderdetailvisible" :close-on-click-modal="false">
          <el-table :data="orderlistdetail">
            <el-table-column prop="dishesname" label="菜肴名称" align="left"></el-table-column>
            <el-table-column label="金额" align="left">
              <template scope="scope"><span>{{moneyCurrency(scope.row.price)}}</span></template>
            </el-table-column>
            <el-table-column prop="num" label="预订数量" align="right">
              <template scope="scope"><span>x{{scope.row.num}}</span></template>
            </el-table-column>
          </el-table>
        </el-dialog>
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
      shopsearch: '', //店铺搜索
      ordersearch: '', //订单搜索
      page: 1,
      pagesize: 20,
      allnum: 0,
      orderlist: [],
      distriplist: [],
      orderdetailvisible: false,
      orderlistdetail: [],
    }
  },
  methods: {
    searchOrderlist(){
      this.getOrderlist();
    },
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
      let params = {userid: order.userid,  orderid: order.orderid, status: status };
      let callback;
      if(status == 5){ //用餐中
        callback = () => {
          order.status = 100;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('用餐结束');
        }
      }else if(status == 6) { //申请打包
        callback = () => {
          order.status = 90;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('打包完成');
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
    //退款审核管理
    processAdmin(order, status, info = {}){
      let callback;
    	if (status == -120){
    	  status = 1;
    	  callback = () => {
          order.status = -200;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('审核通过');
        }
    	}else if (status == -130){
    	  status = 0;
    	  callback = () => {
          order.status = -130;
          order.statustr = getOrderStatus(order.status);
          this.$message.success('审核不通过');
        }
    	}
    	let params = {userid: order.userid,  orderid: order.orderid, checkupstatus: status };
    	ajax.get('/admin/order/checkupCancelOrder', {params:params}).then((response) => {
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
      const params = { startime: startime, endtime: endtime, shopid: this.shopsearch, orderid: this.ordersearch, page: this.page, pagesize: this.pagesize, ordertype:2 };
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
      this.orderlist = [];
      if(list && list.length > 0){
        for (var i = list.length - 1; i >= 0; i--) {
          let orderinfo = {};
          orderinfo['showpopover'] = false;
          orderinfo['shopid'] = list[i].shopid;
          orderinfo['orderid'] = list[i].orderid;
          orderinfo['shopname'] = list[i].shopname;
          orderinfo['usermobile'] = list[i].usermobile;
          orderinfo['deskinfo'] = list[i].seatnum?list[i].seatnum+'人桌 C'+list[i].deskid:'';
          orderinfo['orderlist'] = list[i].orderlist;
          orderinfo['addtime'] = list[i].addtime?timefilter(new Date(list[i].addtime), 'yyyy/mm/dd hh:ii:ss'):'';
          orderinfo['allmoney'] = currency(list[i].allmoney);
          orderinfo['eatinfo'] = '就餐人数：'+list[i].mealsnum+'<br>就餐时间：'+timefilter(new Date(list[i].startime), 'yyyy/mm/dd hh:ii:ss')+' - '+timefilter(new Date(list[i].endtime), 'yyyy/mm/dd hh:ii:ss');
          orderinfo['status'] = list[i].status;
	  orderinfo['userid'] = list[i].userid;
          orderinfo['statustr'] = getOrderStatus(list[i].status);
          this.orderlist.push(orderinfo);
        }
      }
    }, 
    showOrderDetail(orderlistdetail){
      this.orderdetailvisible = true;
      this.orderlistdetail = orderlistdetail;
      console.log(orderlistdetail);
    },
    moneyCurrency(money){
      return currency(money);
    }
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo',
      defshopid: 'defshopid',
    }),
  },
  created () {
    //门店端
    if(!this.isysadmin){
      this.shopsearch = this.shopinfo?this.shopinfo.id:'-';
    }else{
      this.shopsearch = this.defshopid;
    }
    this.searchOrderlist();
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
